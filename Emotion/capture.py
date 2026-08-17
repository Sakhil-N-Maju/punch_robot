"""Camera capture. Frames live in RAM only — never written to disk, never
encoded to video, never leave this process except as the face-detection
signal (face_detected/position), never raw pixels.

AXON is not a Raspberry Pi, so the Picamera2/libcamera stack this module
used in the earlier Pi+Hailo design doesn't apply here. CSI vs. USB camera
is still an open hardware decision (see Architecture/ARCHITECTURE.md §8) —
this defaults to OpenCV's V4L2 backend, which works out of the box for USB
UVC webcams (the documented safer fallback) and *may* also work for a CSI
camera if Vicharak exposes it as a /dev/video node. Confirm against AXON's
actual camera SDK once hardware is in hand, and swap this class for a
vendor-specific capture path if V4L2 doesn't cover CSI.
"""

import numpy as np


class USBCamera:
    """OpenCV VideoCapture wrapper (V4L2 backend)."""

    def __init__(self, width, height, device=0):
        import cv2
        self.cap = cv2.VideoCapture(device)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
        if not self.cap.isOpened():
            raise RuntimeError(f"could not open camera device {device}")

    def frame(self):
        import cv2
        ok, bgr = self.cap.read()
        if not ok:
            raise RuntimeError("camera read failed")
        return cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)  # keep RGB convention used downstream

    def close(self):
        self.cap.release()


class MockCamera:
    """Gray noise frames for dev machines without a camera."""

    def __init__(self, width, height):
        self.shape = (height, width, 3)
        self._rng = np.random.default_rng(0)

    def frame(self):
        return (self._rng.integers(90, 120, self.shape)).astype(np.uint8)

    def close(self):
        pass
