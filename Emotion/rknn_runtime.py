"""Thin wrapper around RKNN Lite's Python API + a mock for dev machines.

AXON's NPU uses Rockchip's RKNN toolchain, not Hailo — this replaces
hailo_runtime.py (removed 2026-08-17, moved to _to_delete/ pending manual
cleanup — see notes.md). Model files are .rknn (compiled from the
SCRFD-500M ONNX via RKNN-Toolkit2 on an x86 host) rather than .hef; same
"compile off-device, run on-device" shape as the old Hailo DFC flow, just a
different vendor SDK.

Real path (on AXON, with rknn-toolkit-lite2 installed — the on-device
runtime wheel, matched to AXON's OS/Python/NPU driver version; get it from
Vicharak's AXON SDK or Rockchip's rknn-toolkit2 GitHub releases):
    model = RKNNModel("/opt/punch/models/scrfd_500m.rknn")
    outputs = model.infer(np_input)   # {output_name: np.ndarray}

Mock path (EMOTION_MOCK=1): no rknnlite import, deterministic fake outputs
so the rest of the pipeline + the ZMQ interface can be exercised on any
machine.
"""

import numpy as np


class RKNNModel:
    """One loaded .rknn model. Synchronous infer."""

    def __init__(self, rknn_path):
        from rknnlite.api import RKNNLite  # provided by rknn-toolkit-lite2 on AXON

        self._rknn = RKNNLite()
        ret = self._rknn.load_rknn(rknn_path)
        if ret != 0:
            raise RuntimeError(f"failed to load RKNN model: {rknn_path}")
        ret = self._rknn.init_runtime()
        if ret != 0:
            raise RuntimeError("failed to init RKNN runtime on AXON's NPU")

    def infer(self, arr):
        batch = np.expand_dims(arr, 0) if arr.ndim == 3 else arr
        outputs = self._rknn.inference(inputs=[batch.astype(np.float32)])
        # scrfd.decode() groups outputs by SHAPE, not by name (release-robust
        # for Hailo's HEF metadata; RKNN doesn't expose per-tensor names the
        # same way either, so this keeps the same shape-based contract).
        return {f"out{i}": o for i, o in enumerate(outputs)}

    def close(self):
        self._rknn.release()


class MockDetector:
    """Fake SCRFD: returns one confident face most of the time, sweeping
    left/center/right across the frame so position bucketing can be
    exercised without hardware.
    """

    def __init__(self, input_size=640):
        self.input_size = input_size
        self._t = 0

    def infer(self, arr):
        self._t += 1
        s = self.input_size // 8
        score = np.zeros((s, s, 2), np.float32)
        bbox = np.zeros((s, s, 8), np.float32)
        if (self._t // 50) % 4 != 3:  # periodically "lose" the face
            cy = s // 2
            cx = [s // 4, s // 2, (3 * s) // 4][(self._t // 50) % 3]
            score[cy, cx, 0] = 0.92
            bbox[cy, cx, :4] = [12, 14, 12, 16]  # l,t,r,b in stride units
        return {"mock_score_8": score, "mock_bbox_8": bbox}
