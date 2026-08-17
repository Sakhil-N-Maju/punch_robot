"""Temporal smoothing + hysteresis for the face-detection/greeting-trigger
signal.

Replaces the emotion-classification EmotionSmoother this module used to
have (removed 2026-08-17 — see notes.md). Design goals carried over:
- Never guess: default is "no face". A face is only reported once it has
  been seen consistently for switch_hold_s.
- No flicker: face_detected only flips after switch_hold_s of consistent
  evidence in the new direction.
- Graceful no-face: a brief dropout (occlusion, blink, glare) within
  no_face_grace_s is bridged rather than immediately reported as gone.

Pure Python, no hardware deps — unit-testable anywhere.
"""

import time


class FaceTrigger:
    def __init__(self, cfg, clock=time.monotonic):
        self.cfg = cfg
        self.clock = clock
        self._detected = False          # debounced, public state
        self._last_seen_ts = None       # last frame a face was actually seen
        self._candidate = False         # raw, un-debounced instantaneous reading
        self._candidate_since = clock()
        self._position = None

    def update(self, face, frame_width):
        """face: (x1, y1, x2, y2, score) in frame pixel coords, or None.

        Returns the current state dict (also available via .snapshot()).
        """
        now = self.clock()
        raw_present = face is not None

        if raw_present:
            self._last_seen_ts = now
            x1, y1, x2, y2, _score = face
            cx = (x1 + x2) / 2.0
            frac = cx / frame_width if frame_width else 0.5
            if frac < self.cfg.left_frac:
                self._position = "left"
            elif frac > self.cfg.right_frac:
                self._position = "right"
            else:
                self._position = "center"

        # bridge brief dropouts before treating the face as gone
        face_present_bridged = raw_present or (
            self._last_seen_ts is not None
            and (now - self._last_seen_ts) < self.cfg.no_face_grace_s
        )

        if face_present_bridged != self._candidate:
            self._candidate = face_present_bridged
            self._candidate_since = now

        held_long_enough = (now - self._candidate_since) >= self.cfg.switch_hold_s
        if self._candidate != self._detected and held_long_enough:
            self._detected = self._candidate
            if not self._detected:
                self._position = None

        return self.snapshot()

    def snapshot(self):
        return {
            "face_detected": bool(self._detected),
            "position": self._position if self._detected else None,
        }
