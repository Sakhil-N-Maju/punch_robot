#!/usr/bin/env python3
"""Face-detection / greeting-trigger service — capture -> RKNN inference ->
debounced face-detected+position signal -> publish.

Runs on AXON (the project's primary board — see
Architecture/ARCHITECTURE.md). AXON's NPU uses the RKNN toolchain
(RKNNLite), not Hailo — see notes.md, 2026-08-17 scope change, for why this
replaced the earlier Hailo-based two-stage emotion-classification pipeline.

SCOPE (as of 2026-08-17): no emotion classification. Face detection only,
collapsed to a simple trigger signal for Animation/ and Kiosk/:
  face_detected: true/false
  position: "left" | "center" | "right" | null

Greeting-trigger heuristic (no gaze/landmark model — deliberately out of
scope): consumers should treat face_detected=True with position=="center"
as "facing the robot" and fire a greeting off that, per the vendor hardware
doc's suggested behavior.

Privacy guardrails (non-negotiable, see notes.md):
  1. No identification — face detection only. SCRFD landmarks and any
     recognition/embedding models are never used.
  2. No persistent storage — frames stay in process memory. The only thing
     that ever leaves this process is a JSON label payload.
  3. Fully on-device — RKNNLite on AXON's local NPU; no network calls out.

Usage:
  python3 emotion_service.py                  # real hardware
  EMOTION_MOCK=1 python3 emotion_service.py    # mock camera+NPU, real ZMQ
"""

import argparse
import logging
import os
import signal
import sys
import time

from config import Config
from smoothing import FaceTrigger
from publisher import EmotionPublisher
import scrfd

log = logging.getLogger("face_trigger")


def build(cfg):
    if cfg.mock:
        from capture import MockCamera
        from rknn_runtime import MockDetector
        return MockCamera(cfg.frame_width, cfg.frame_height), MockDetector(cfg.detector_input)
    from capture import USBCamera
    from rknn_runtime import RKNNModel
    return USBCamera(cfg.frame_width, cfg.frame_height), RKNNModel(cfg.detector_rknn)


def largest_face(dets, min_px, scale):
    """Pick the biggest face (the engaged visitor); map back to frame coords."""
    best, best_area = None, 0.0
    for x1, y1, x2, y2, score in dets:
        fx1, fy1, fx2, fy2 = (v / scale for v in (x1, y1, x2, y2))
        area = (fx2 - fx1) * (fy2 - fy1)
        if (fx2 - fx1) >= min_px and area > best_area:
            best, best_area = (fx1, fy1, fx2, fy2, score), area
    return best


def run(cfg):
    cam, detector = build(cfg)
    trigger = FaceTrigger(cfg)
    pub = EmotionPublisher(cfg)
    period = 1.0 / cfg.target_fps
    stop = {"flag": False}

    def _sig(*_):
        stop["flag"] = True
    signal.signal(signal.SIGTERM, _sig)
    signal.signal(signal.SIGINT, _sig)

    log.info("face-trigger service up (mock=%s) publishing on %s", cfg.mock, cfg.zmq_bind)
    slow_frames = 0
    try:
        while not stop["flag"]:
            t0 = time.monotonic()
            frame = cam.frame()

            if cfg.mock:
                det_in, scale = frame, 1.0  # mock detector ignores pixels
            else:
                det_in, scale = scrfd.letterbox(frame, cfg.detector_input)

            dets = scrfd.decode(detector.infer(det_in),
                                input_size=cfg.detector_input,
                                score_thr=cfg.det_score_thr,
                                nms_thr=cfg.det_nms_thr)
            face = largest_face(dets, cfg.min_face_px, scale)

            state = trigger.update(face, frame_width=cfg.frame_width)
            pub.publish(state, analyzing=True)

            elapsed = time.monotonic() - t0
            if elapsed > 0.2:
                slow_frames += 1
                if slow_frames % 50 == 1:
                    log.warning("frame took %.0f ms (>200 ms budget)", elapsed * 1e3)
            time.sleep(max(0.0, period - elapsed))
    finally:
        # tell consumers we're gone rather than leaving a stale "detected"
        pub.publish({"face_detected": False, "position": None}, analyzing=False)
        pub.close()
        cam.close()
        log.info("face-trigger service stopped")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--mock", action="store_true", help="mock camera + NPU")
    args = ap.parse_args()
    if args.mock:
        os.environ["EMOTION_MOCK"] = "1"
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(message)s")
    run(Config())


if __name__ == "__main__":
    sys.exit(main())
