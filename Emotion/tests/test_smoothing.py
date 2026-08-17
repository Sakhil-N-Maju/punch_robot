"""Unit tests for FaceTrigger — runnable with pytest or plain python."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from config import Config          # noqa: E402
from smoothing import FaceTrigger  # noqa: E402


class FakeClock:
    def __init__(self):
        self.t = 0.0

    def __call__(self):
        return self.t


def make():
    clock = FakeClock()
    return FaceTrigger(Config(), clock=clock), clock


CENTER_FACE = (280, 100, 360, 220, 0.9)   # center ~320/640
LEFT_FACE = (0, 100, 80, 220, 0.9)        # center 40/640
RIGHT_FACE = (560, 100, 640, 220, 0.9)    # center 600/640


def test_default_is_no_face():
    ft, _ = make()
    s = ft.update(None, frame_width=640)
    assert s["face_detected"] is False
    assert s["position"] is None


def test_centered_face_switches_to_detected():
    ft, clock = make()
    s = None
    for _ in range(10):
        clock.t += 0.1
        s = ft.update(CENTER_FACE, frame_width=640)
    assert s["face_detected"] is True
    assert s["position"] == "center"


def test_left_and_right_positions():
    ft, clock = make()
    s = None
    for _ in range(10):
        clock.t += 0.1
        s = ft.update(LEFT_FACE, frame_width=640)
    assert s["position"] == "left"

    ft2, clock2 = make()
    s2 = None
    for _ in range(10):
        clock2.t += 0.1
        s2 = ft2.update(RIGHT_FACE, frame_width=640)
    assert s2["position"] == "right"


def test_no_flicker_on_momentary_appearance():
    ft, clock = make()
    clock.t += 0.1
    s = ft.update(CENTER_FACE, frame_width=640)
    # single frame, well under switch_hold_s — must not have switched yet
    assert s["face_detected"] is False


def test_brief_dropout_is_bridged():
    ft, clock = make()
    for _ in range(10):
        clock.t += 0.1
        ft.update(CENTER_FACE, frame_width=640)
    assert ft._detected is True
    # one missed frame well inside no_face_grace_s — must not flip
    clock.t += 0.1
    s = ft.update(None, frame_width=640)
    assert s["face_detected"] is True


def test_sustained_absence_clears_detected():
    ft, clock = make()
    for _ in range(10):
        clock.t += 0.1
        ft.update(CENTER_FACE, frame_width=640)
    assert ft._detected is True
    # advance in small steps well past no_face_grace_s + switch_hold_s
    # (simulates continuous absence across many real frames, not one jump)
    total_gap = Config().no_face_grace_s + Config().switch_hold_s + 0.5
    steps = int(total_gap / 0.1) + 1
    s = None
    for _ in range(steps):
        clock.t += 0.1
        s = ft.update(None, frame_width=640)
    assert s["face_detected"] is False
    assert s["position"] is None


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_"):
            fn()
            print(f"ok  {name}")
    print("all smoothing tests passed")
