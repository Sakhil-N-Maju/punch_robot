"""SCRFD-500M output decoding (face detection).

Public SCRFD-500M ONNX, converted to .rknn via RKNN-Toolkit2 for AXON's
NPU (was Hailo Model Zoo -> HEF in the earlier Pi+Hailo design; see
notes.md, 2026-08-17). The model's raw heads per stride (8/16/32) are
unchanged by that migration: scores (2 anchors), bbox distances (4 per
anchor), landmarks (10 per anchor). We decode boxes + scores; landmarks
are ignored (we never do identity work).

NOTE: output tensor names/order can vary between conversions — verify
against the actual .rknn on AXON (e.g. via RKNNLite's outputs list at
inference time). We therefore group outputs by SHAPE (H, W, channels),
not by name, which is robust to that.
"""

import numpy as np

STRIDES = (8, 16, 32)
NUM_ANCHORS = 2  # per spatial position, both with ratio 1.0


def _group_outputs(outputs, input_size):
    """Group raw output arrays {name: (H,W,C) or (1,H,W,C)} by stride."""
    grouped = {}
    for arr in outputs.values():
        a = np.squeeze(np.asarray(arr))
        if a.ndim != 3:
            continue
        h, w, c = a.shape
        stride = input_size // h
        if stride not in STRIDES:
            continue
        slot = grouped.setdefault(stride, {})
        if c == NUM_ANCHORS:
            slot["score"] = a
        elif c == 4 * NUM_ANCHORS:
            slot["bbox"] = a
        # c == 10 * NUM_ANCHORS -> landmarks, deliberately unused
    return grouped


def _anchor_centers(h, w, stride):
    ys, xs = np.mgrid[:h, :w]
    centers = np.stack([xs, ys], axis=-1).astype(np.float32) * stride
    # repeat per anchor -> (h*w*NUM_ANCHORS, 2)
    return np.repeat(centers.reshape(-1, 2), NUM_ANCHORS, axis=0)


def _nms(boxes, scores, thr):
    idx = scores.argsort()[::-1]
    keep = []
    while idx.size:
        i = idx[0]
        keep.append(i)
        if idx.size == 1:
            break
        xx1 = np.maximum(boxes[i, 0], boxes[idx[1:], 0])
        yy1 = np.maximum(boxes[i, 1], boxes[idx[1:], 1])
        xx2 = np.minimum(boxes[i, 2], boxes[idx[1:], 2])
        yy2 = np.minimum(boxes[i, 3], boxes[idx[1:], 3])
        inter = np.maximum(0, xx2 - xx1) * np.maximum(0, yy2 - yy1)
        area_i = (boxes[i, 2] - boxes[i, 0]) * (boxes[i, 3] - boxes[i, 1])
        areas = (boxes[idx[1:], 2] - boxes[idx[1:], 0]) * (boxes[idx[1:], 3] - boxes[idx[1:], 1])
        iou = inter / (area_i + areas - inter + 1e-9)
        idx = idx[1:][iou <= thr]
    return keep


def decode(outputs, input_size=640, score_thr=0.55, nms_thr=0.4):
    """Return list of (x1, y1, x2, y2, score) in detector-input pixel coords."""
    grouped = _group_outputs(outputs, input_size)
    all_boxes, all_scores = [], []

    for stride, heads in grouped.items():
        if "score" not in heads or "bbox" not in heads:
            continue
        h, w, _ = heads["score"].shape
        scores = heads["score"].reshape(-1)                     # (h*w*A,)
        dists = heads["bbox"].reshape(-1, 4) * stride           # l,t,r,b
        centers = _anchor_centers(h, w, stride)

        mask = scores >= score_thr
        if not mask.any():
            continue
        c, d, s = centers[mask], dists[mask], scores[mask]
        boxes = np.stack([
            c[:, 0] - d[:, 0], c[:, 1] - d[:, 1],
            c[:, 0] + d[:, 2], c[:, 1] + d[:, 3],
        ], axis=-1)
        all_boxes.append(boxes)
        all_scores.append(s)

    if not all_boxes:
        return []

    boxes = np.concatenate(all_boxes)
    scores = np.concatenate(all_scores)
    keep = _nms(boxes, scores, nms_thr)
    return [(*boxes[i], float(scores[i])) for i in keep]


def letterbox(frame, size):
    """Resize keeping aspect ratio, pad to size x size. Returns (img, scale)."""
    import cv2
    h, w = frame.shape[:2]
    scale = size / max(h, w)
    nh, nw = int(round(h * scale)), int(round(w * scale))
    resized = cv2.resize(frame, (nw, nh))
    canvas = np.zeros((size, size, 3), dtype=frame.dtype)
    canvas[:nh, :nw] = resized
    return canvas, scale
