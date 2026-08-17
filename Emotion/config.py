"""Central config for the face-detection / greeting-trigger service.

Everything overridable via environment variables (EMOTION_*) so nothing
secret/machine-specific needs to be committed. (Env prefix kept as EMOTION_
for continuity with the existing deployment/config habits in this repo;
the service itself no longer does emotion classification — see notes.md,
2026-08-17 scope change.)
"""

import os
from dataclasses import dataclass, field


def _env(name, default, cast=str):
    v = os.environ.get(f"EMOTION_{name}")
    return cast(v) if v is not None else default


@dataclass
class Config:
    # --- capture ---
    frame_width: int = _env("FRAME_WIDTH", 640, int)
    frame_height: int = _env("FRAME_HEIGHT", 480, int)
    target_fps: float = _env("TARGET_FPS", 10.0, float)

    # --- face detector model (RKNN, runs on AXON's NPU) ---
    detector_rknn: str = _env("DETECTOR_RKNN", "/opt/punch/models/scrfd_500m.rknn")
    detector_input: int = 640          # SCRFD-500M input is 640x640

    # --- detection ---
    det_score_thr: float = _env("DET_SCORE_THR", 0.55, float)
    det_nms_thr: float = 0.4
    min_face_px: int = _env("MIN_FACE_PX", 48, int)  # ignore tiny/far faces

    # --- position bucketing (fraction of frame width, face-box center) ---
    left_frac: float = 0.4
    right_frac: float = 0.6

    # --- hysteresis (avoid flicker on face_detected) ---
    switch_hold_s: float = _env("SWITCH_HOLD_S", 0.5, float)      # min consistent time before flipping
    no_face_grace_s: float = _env("NO_FACE_GRACE_S", 1.5, float)  # brief dropout tolerance

    # --- output interface ---
    zmq_bind: str = _env("ZMQ_BIND", "tcp://0.0.0.0:5556")
    zmq_topic: str = "face"
    # tmpfs only (RAM-backed) — never a real disk path. Labels only, no imagery.
    state_file: str = _env("STATE_FILE", "/run/punch/face.json")
    publish_hz: float = _env("PUBLISH_HZ", 10.0, float)

    # --- modes ---
    mock: bool = field(default_factory=lambda: os.environ.get("EMOTION_MOCK") == "1")
