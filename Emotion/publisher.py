"""Output interface: ZMQ PUB (push) + tmpfs JSON snapshot (pull).

Consumers (Animation/ on the same board, Kiosk/ over the LAN) subscribe to
the "face" topic, or poll /run/punch/face.json. Payload is a face-detected
signal only (face_detected + position) -- no frames, no crops, no
embeddings, no emotion label. (Was "emotion" topic / emotion.json with a
full emotion-classification payload before the 2026-08-17 scope change --
see notes.md.)
"""

import json
import os
import tempfile
import time


class EmotionPublisher:
    def __init__(self, cfg):
        self.cfg = cfg
        import zmq
        self._ctx = zmq.Context.instance()
        self._sock = self._ctx.socket(zmq.PUB)
        self._sock.bind(cfg.zmq_bind)
        self._seq = 0
        self._state_dir_ok = self._ensure_state_dir()

    def _ensure_state_dir(self):
        d = os.path.dirname(self.cfg.state_file)
        try:
            os.makedirs(d, exist_ok=True)
            return True
        except OSError:
            return False  # e.g. /run not writable on a dev box — ZMQ still works

    def publish(self, state, analyzing):
        self._seq += 1
        payload = {
            "v": 2,  # v2: face_detected/position signal (was emotion classification in v1)
            "seq": self._seq,
            "ts": round(time.time(), 3),
            "analyzing": bool(analyzing),  # drive the camera-active UI dot
            **state,
        }
        msg = json.dumps(payload, separators=(",", ":"))
        self._sock.send_multipart([self.cfg.zmq_topic.encode(), msg.encode()])
        if self._state_dir_ok:
            self._write_atomic(msg)
        return payload

    def _write_atomic(self, msg):
        # atomic replace so a reader never sees a half-written file
        d = os.path.dirname(self.cfg.state_file)
        try:
            fd, tmp = tempfile.mkstemp(dir=d, prefix=".emotion.")
            with os.fdopen(fd, "w") as f:
                f.write(msg)
            os.replace(tmp, self.cfg.state_file)
        except OSError:
            self._state_dir_ok = False

    def close(self):
        self._sock.close(0)
