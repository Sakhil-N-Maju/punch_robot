#!/usr/bin/env python3
"""Minimal consumer for Animation/ and Kiosk/ teams.

Animation (same board):  connect to tcp://127.0.0.1:5556
Kiosk (other board):     connect to tcp://<axon-hostname>:5556

Rule for consumers: if no message arrives for ~2 s, treat the state as
face_detected=False — never act on stale data.

Greeting-trigger heuristic (no gaze/landmark model, by design — see
Emotion/notes.md): treat face_detected=True with position=="center" as
"facing the robot" and fire a greeting off that, debounced on your own
rising edge (e.g. only fire again after a face_detected=False gap).
"""

import json
import sys

import zmq

ENDPOINT = sys.argv[1] if len(sys.argv) > 1 else "tcp://127.0.0.1:5556"

ctx = zmq.Context()
sub = ctx.socket(zmq.SUB)
sub.connect(ENDPOINT)
sub.setsockopt_string(zmq.SUBSCRIBE, "face")
sub.setsockopt(zmq.RCVTIMEO, 2000)  # 2 s staleness rule

print(f"listening on {ENDPOINT} ...")
while True:
    try:
        _topic, payload = sub.recv_multipart()
        msg = json.loads(payload)
        print(f"face_detected={msg['face_detected']} position={msg['position']}")
    except zmq.Again:
        print("stale (>2 s, treat as face_detected=False)")
