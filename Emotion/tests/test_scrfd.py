"""Unit tests for SCRFD decode + NMS (no hardware needed)."""

import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import scrfd  # noqa: E402


def synthetic_outputs(input_size=640, cy=40, cx=40, score=0.9, stride=8):
    s = input_size // stride
    sc = np.zeros((s, s, 2), np.float32)
    bb = np.zeros((s, s, 8), np.float32)
    sc[cy, cx, 0] = score
    bb[cy, cx, :4] = [10, 10, 10, 10]  # l,t,r,b in stride units
    return {"score8": sc, "bbox8": bb}


def test_decodes_single_face():
    dets = scrfd.decode(synthetic_outputs(), input_size=640, score_thr=0.5)
    assert len(dets) == 1
    x1, y1, x2, y2, score = dets[0]
    # center = (40*8, 40*8) = (320, 320); distances 10*8 = 80 px
    assert (x1, y1, x2, y2) == (240, 240, 400, 400)
    assert abs(score - 0.9) < 1e-6


def test_below_threshold_returns_nothing():
    dets = scrfd.decode(synthetic_outputs(score=0.3), score_thr=0.5)
    assert dets == []


def test_nms_merges_overlapping():
    out = synthetic_outputs()
    out["score8"][40, 41, 0] = 0.8            # heavily overlapping neighbor
    out["bbox8"][40, 41, :4] = [10, 10, 10, 10]
    dets = scrfd.decode(out, score_thr=0.5, nms_thr=0.4)
    assert len(dets) == 1
    assert abs(dets[0][4] - 0.9) < 1e-6       # kept the higher score


def test_ignores_landmark_head():
    out = synthetic_outputs()
    out["kps8"] = np.zeros((80, 80, 20), np.float32)  # must be ignored
    dets = scrfd.decode(out, score_thr=0.5)
    assert len(dets) == 1


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_"):
            fn()
            print(f"ok  {name}")
    print("all scrfd tests passed")
