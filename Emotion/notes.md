# Emotion — facial emotion recognition and emotion-responsive behavior logic for the robot.

## 2026-07-08 — Module built: on-device emotion pipeline + output interface

### Pi assignment (DECISION — affects Animation/ and Kiosk/)

| Pi | Role | Runs |
|----|------|------|
| **Pi #1 — "Interaction Pi"** | 21.5" body touchscreen | Kiosk (Chromium/punch-kiosk), Speech |
| **Pi #2 — "Perception Pi"** | AI HAT+ mounted here | **Emotion service (this module)**, Navigation vision (AprilTag), Animation face-LCD state machine |

Rationale: there is one AI HAT+, so all NPU work lands on one Pi. The kiosk's
Chromium is the heaviest CPU/GPU load and deserves its own Pi (Kiosk notes
already flag blur-perf concerns). Putting **Animation on the same Pi as
Emotion** gives the face LCD the lowest-latency mood reaction (localhost),
while Kiosk reads emotion over the LAN — where a little latency is fine since
it only nudges tone. Navigation's AprilTag detection can share the camera/NPU
Pi later; the emotion loop budgets ~10 fps precisely to leave headroom.

Consequence for Animation/: subscribe to `tcp://127.0.0.1:5556`.
Consequence for Kiosk/: subscribe to `tcp://<perception-pi>:5556` (mDNS
hostname TBD when the Pis are set up; suggest `punch-perception.local`).

### Model approach (DECISION — no training from scratch)

Two-stage, both on the Hailo-8L NPU:

1. **Face detection: SCRFD-500M** from the official
   [Hailo Model Zoo](https://github.com/hailo-ai/hailo_model_zoo)
   ([precompiled HEF list](https://github.com/hailo-ai/hailo_model_zoo/blob/master/docs/PUBLIC_MODELS.rst)) —
   download the Hailo-8L HEF directly, no compilation needed. ~0.5 GFLOPs,
   single-digit-ms on the NPU.
2. **Emotion classification: FER+ (`emotion-ferplus-8`)** from the ONNX Model
   Zoo — 64×64 grayscale in, 8 classes out (neutral, happiness, surprise,
   sadness, anger, disgust, fear, contempt). The official Hailo zoo has **no
   emotion model** (confirmed by search of zoo docs + community forum), so
   this one ONNX must be compiled to HEF ourselves with the **Hailo Dataflow
   Compiler (DFC)** — x86 Linux only ([conversion guide](https://www.cytron.io/tutorial/raspberry-pi-ai-kit-onnx-to-hef-conversion)),
   cannot compile on the Pi. Use a lab PC or WSL2; calibration set = a few
   hundred unlabeled face crops (FER2013 public set is fine — calibration
   images are used transiently on the x86 box, never deployed to the robot).

   Compile sketch (DFC ≥3.27, target hailo8l):
   ```
   hailo parser onnx emotion-ferplus-8.onnx
   hailo optimize --hw-arch hailo8l --calib-set-path calib/ emotion-ferplus-8.har
   hailo compiler --hw-arch hailo8l emotion-ferplus-8_optimized.har   # -> ferplus.hef
   ```
   Fallback if FER+ quantizes badly: retrain-free alternates in the same size
   class are MobileNetV2-FER or ResNet18-FER from HuggingFace; same pipeline.

**Latency budget:** SCRFD ~5 ms + FER+ ~2 ms on NPU; capture + pre/post on
CPU dominate. Loop is throttled to 10 fps (100 ms period) — comfortably
under the 200 ms/frame target; the service logs a warning if a frame ever
exceeds 200 ms.

### Pipeline (built, in this folder)

```
Picamera2 (RGB, 640×480, RAM only)
  → letterbox 640×640 → SCRFD-500M on NPU → decode+NMS (scrfd.py)
  → largest face ≥48 px (the engaged visitor; others ignored)
  → padded crop → 64×64 gray → FER+ on NPU → softmax (ferplus.py)
  → EMA + hysteresis (smoothing.py): switch only if conf ≥0.45 AND
    margin ≥0.15 AND state held ≥1.2 s; no face for 2 s → neutral/idle
  → publish (publisher.py)
```

Files: `emotion_service.py` (entrypoint), `config.py` (all knobs, env-overridable),
`capture.py`, `hailo_runtime.py` (+mocks), `scrfd.py`, `ferplus.py`,
`smoothing.py`, `publisher.py`, `emotion.service` (systemd unit),
`examples/consumer_example.py`, `tests/`.

### Output interface spec (v1) — for Animation/ and Kiosk/

Transport: **ZeroMQ PUB/SUB** (brokerless — no mosquitto to babysit) plus a
**tmpfs JSON snapshot** for anything that prefers polling.

- Push: `tcp://<perception-pi>:5556`, topic `emotion`, multipart
  `[topic, json]`, ~10 Hz.
- Pull: `/run/punch/emotion.json` (atomic replace; RAM-backed, local to the
  Perception Pi — Animation can read it, Kiosk should use ZMQ).

Payload (labels only — never pixels):

```json
{
  "v": 1,                      // schema version, bump on breaking change
  "seq": 1234,                 // monotonic, detect gaps/restarts
  "ts": 1783498797.7,          // unix seconds
  "analyzing": true,           // false only in shutdown farewell → hide camera dot
  "face_present": true,
  "display_state": "happy",    // neutral | happy | surprised | sad | concerned
  "raw_label": "happiness",    // FER+ class (8), null when no face
  "confidence": 0.89,          // smoothed prob of raw_label, 0.0 when no face
  "probs": { "neutral": 0.05, "happiness": 0.89, ... }  // null when no face
}
```

Consumer rules (keeps coupling loose):
1. Drive behavior from **`display_state` only**; `raw_label`/`probs` are
   informational. New display states may be added — treat unknown as `neutral`.
2. **Staleness = 2 s without a message → act as neutral/idle.** Never latch a
   mood.
3. `analyzing` drives the subtle "camera active" UI indicator (Kiosk: small
   dot near the header; Animation: optional tiny iris glint).
4. Kiosk tone mapping suggestion: `sad`/`concerned` → gentler, shorter
   replies; `happy` → default; never mirror negativity back.

Mapping decision: FER+'s anger/disgust map to display state **`concerned`**,
not "angry" — a campus helper robot should respond to a frustrated visitor
with concern, not mirror the frustration. `contempt` (noisy class) → neutral.

### Privacy guardrails — how each is enforced

1. **No identification:** no recognition/embedding model anywhere; SCRFD's
   landmark outputs are explicitly discarded in `scrfd.py`; payload carries
   no per-person or tracking ID.
2. **No persistent storage:** frames/crops are process-memory numpy arrays
   only — zero image-write calls in the module (`grep -rn "imwrite\|imsave\|
   VideoWriter\|\.save(" Emotion/` comes back empty); the only artifact is
   the JSON label snapshot on tmpfs (RAM, cleared at boot); systemd unit
   adds `ProtectHome` + read-only system as a backstop.
3. **On-device only:** HailoRT local inference; the process makes no
   outbound connections — it only *binds* a listening ZMQ socket on the LAN.
4. **Transparency indicator:** `analyzing` flag in every payload (see rule 3
   above).

### Verification done here (no robot hardware in this environment)

- `tests/test_smoothing.py` — 6/6 pass (default-neutral, confident switch,
  never-guess-on-ambiguity, min-hold hysteresis, no-face grace→idle,
  anger→concerned mapping).
- `tests/test_scrfd.py` — 4/4 pass (decode geometry, threshold, NMS,
  landmark head ignored).
- End-to-end mock run: service + `examples/consumer_example.py` over real
  ZMQ — 120 msgs in 12 s (~10 Hz), state transitions smoothed, clean
  shutdown farewell (`analyzing:false`), atomic state file verified.

### Needs on-device validation (open items)

1. SCRFD HEF output tensor names/shapes — grouping is shape-based so it
   should survive zoo-version drift, but confirm with `hailortcli parse-hef`.
2. FER+ quantization accuracy after DFC compile — sanity-check with a few
   live faces; swap to MobileNetV2-FER if degraded.
3. Real per-frame latency on the Pi 5 + Hailo-8L (expected ≪200 ms).
4. Whether both HEFs can stay configured on the VDevice concurrently or need
   the multi-network scheduler (`HailoSchedulingAlgorithm.ROUND_ROBIN`) —
   matters once Navigation shares the NPU.
5. Camera hardware: no camera purchase is in the ledger yet (₹0 spent,
   ₹1,30,000 remaining as of today). If the team doesn't already have one, a
   Pi Camera Module 3 (~₹3,500–4,000) is needed — flag for Hardware/, **not
   spent here**.

Budget check: read `Budget/ledger.md` before this task — no entries; this
task spends nothing.

## 2026-08-17 — Scope change: face detection + greeting trigger, not emotion classification; AXON/RKNN, not Pi/Hailo

### Why

The robot's approved scope simplified from full facial emotion
classification to face detection + a warm/responsive greeting trigger (e.g.
"face detected and roughly facing the robot" -> greeting). Officially
approved documents still call the project "Emotion-Responsive" — see
`Architecture/ARCHITECTURE.md` §1 for the heads-up to raise with Dr. Sarika
if that name is meant to stay permanent.

Separately, compute moved from "2x Pi 5 + one shared Hailo-8L AI HAT+" to
AXON (Vicharak) as the primary board. AXON's NPU uses Rockchip's RKNN
toolchain (RKNNLite on-device, RKNN-Toolkit2 for offline model conversion),
not Hailo's HailoRT/DFC. These are two independent changes that happened to
land together; both are reflected below.

### What changed

- **Dropped:** emotion classification entirely. `ferplus.py` (FER+
  pre/post-processing) and `hailo_runtime.py` (Hailo wrapper) are removed
  from active use — moved to `Emotion/_to_delete/` because this sandbox
  can't run `rm` on files synced from your machine; please delete that
  folder yourself once you've glanced at it.
- **Kept and reused:** face detection. SCRFD-500M is still the model; only
  its runtime changed (Hailo HEF -> RKNN). `scrfd.py`'s decode/NMS/letterbox
  logic is unchanged (it's backend-agnostic — operates on plain numpy
  arrays grouped by output shape), only its docstring was updated to
  reference RKNN instead of Hailo.
- **New:** `rknn_runtime.py` replaces `hailo_runtime.py` — wraps
  `rknnlite.api.RKNNLite` the same way the old module wrapped HailoRT
  (`RKNNModel.infer()` mirrors the old `HailoModel.infer()` shape), plus a
  `MockDetector` for dev-machine testing (now sweeps a fake face
  left/center/right across the frame so position bucketing is exercisable
  without hardware).
- **New:** `smoothing.py`'s `EmotionSmoother` (8-class EMA + hysteresis) is
  replaced by `FaceTrigger` — much simpler: debounced `face_detected`
  bool + `position` ("left"/"center"/"right", null when no face). Same
  never-guess / no-flicker / graceful-no-face design goals, just no
  probability smoothing since there's no classifier output anymore.
- **Changed:** `capture.py`'s `PiCamera` (Picamera2/libcamera, Pi-specific)
  is replaced by `USBCamera` (OpenCV/V4L2). AXON isn't a Raspberry Pi, so
  Picamera2 doesn't apply; V4L2 is the safe default per the vendor hardware
  doc's CSI-vs-USB guidance (USB is the documented fallback). CSI capture
  on AXON is still unverified — flagged in `Architecture/ARCHITECTURE.md`
  §8, not solved here.
- **Changed:** `emotion_service.py`'s pipeline drops the classifier stage
  entirely (`build()` now returns just a camera + one detector, not a
  detector + classifier). Otherwise the loop structure (capture -> detect
  -> largest face -> smooth/trigger -> publish, throttled to target_fps) is
  unchanged.
- **Changed:** output payload (`publisher.py`, `config.py`). New shape:
  ```json
  {
    "v": 2,
    "seq": 1234,
    "ts": 1755000000.0,
    "analyzing": true,
    "face_detected": true,
    "position": "center"
  }
  ```
  `v` bumped to 2 (breaking change from the old emotion-classification
  payload) and ZMQ topic renamed `emotion` -> `face` (state file
  `emotion.json` -> `face.json`) so a stale v1 subscriber can't silently
  misinterpret the new shape. No real consumer exists yet (Animation/ and
  Kiosk/ haven't built anything against this interface), so there's nothing
  to migrate.
- **Updated:** `requirements.txt` and `emotion.service` — Hailo apt
  packages (`hailo-all`, `python3-picamera2`) replaced with RKNN guidance
  (`rknn-toolkit-lite2`, exact source/version TBD until AXON's OS image is
  finalized) + `opencv-python`/`python3-opencv` for camera capture.
- **Updated:** `tests/test_smoothing.py` rewritten for `FaceTrigger`
  (default-no-face, centered/left/right position, no-flicker-on-single-
  frame, brief-dropout-bridged, sustained-absence-clears). `tests/
  test_scrfd.py` untouched — the decode logic it tests didn't change.

### Verification done here

- `tests/test_smoothing.py` — 6/6 pass (new `FaceTrigger` behavior).
- `tests/test_scrfd.py` — 4/4 pass (unchanged decode/NMS logic, confirms
  the RKNN migration didn't touch it).
- **Not re-verified:** the old end-to-end ZMQ mock run (service +
  `examples/consumer_example.py` talking over a real socket). This sandbox
  has no network access to install `pyzmq`/`opencv-python`, so that check
  couldn't be repeated here. Re-run it on a machine with those packages
  before trusting the ZMQ wiring: `python3 emotion_service.py --mock` in
  one terminal, `python3 examples/consumer_example.py` in another.

### Needs on-device validation (open items, supersedes the old Hailo-era list)

1. `rknn-toolkit-lite2` install path on AXON — exact wheel/version isn't
   confirmed; get it from Vicharak's AXON SDK docs or the upstream
   `airockchip/rknn-toolkit2` releases once the board's OS image is set up.
2. SCRFD-500M -> `.rknn` conversion (RKNN-Toolkit2, offline on an x86 host)
   hasn't been done yet — only the Hailo HEF path existed before. Needs an
   ONNX source model, a calibration set (same FER2013-style face crops
   would work for detector calibration too), and a build/quantize pass
   targeting AXON's NPU.
3. Real per-frame latency on AXON (expected comfortably under the 200 ms
   budget given SCRFD-500M's ~0.5 GFLOPs, but unmeasured on this
   hardware).
4. Camera: still no camera purchase in the ledger (see Budget/ledger.md).
   CSI vs. USB undecided — `capture.py` currently assumes USB/V4L2 as the
   safe default; revisit if CSI is chosen instead.
5. End-to-end ZMQ verification (see above) — rerun once `pyzmq` is
   available.

`Architecture/ARCHITECTURE.md` §3–5 already reflect this state (written in
the same session as this change).
