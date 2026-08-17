# ARCHITECTURE.md — Punch Robot, single-source-of-truth

Last updated: 2026-08-17. This file is the canonical reference for what's
actually decided vs. still open. When in doubt about current project state,
check here first, then the per-subfolder `notes.md` files for history/detail.

## 1. Project Overview

This is the AI-Powered "Emotion-Responsive" Social Interaction Robot for Adi
Shankara Institute of Engineering and Technology, Dept. of AI & Data Science,
guided by Dr. Sarika S. It's a wheeled reception robot for a single fixed
hall: a 21.5" touchscreen on its body runs a rule-based Q&A kiosk (Punch)
answering questions about the college, a 10"x6" face LCD gives it an
animated presence, and a camera lets it notice and greet visitors. It
navigates the hall using fixed visual beacons rather than open-ended SLAM,
since it never leaves that one space.

**Naming note:** officially approved project documents call this the
"Emotion-Responsive Social Interaction Robot." The actual mechanism has
since been simplified — see §5 — to face detection plus a warm/responsive
greeting trigger, not emotion classification. The two names are now out of
sync; worth flagging to Dr. Sarika if "Emotion-Responsive" is meant to stay
the permanent, official name.

## 2. Physical Spec

| Attribute | Spec |
|---|---|
| Height | 5 ft |
| Base | 22"×20" wheeled base, 4-wheel (2 driven + 2 free-swiveling casters), differential drive |
| Face display | 10"×6" animated-expression LCD |
| Body display | 21.5" touchscreen, tilted ~12°, mounted 28"–47" from floor |
| Arms | Decorative only — non-functional |
| Head | PETG, 3D-printed |
| Base shell | Laser-cut perforated acrylic mesh (3–5mm), ventilation + lighter/cheaper than solid |
| Localization | Beacon-based (AprilTag/ArUco fixed markers) — the robot only operates in one fixed hall, so this replaces depth camera/LiDAR/SLAM |

## 3. Compute Architecture

| Board | Qty | Status | Role |
|---|---|---|---|
| AXON AI-Edge Computer (Vicharak) | 1 | **Purchased — ₹20,000** | Primary board. 8GB RAM / 32GB storage, 6 TOPS NPU, octa-core CPU, triple HDMI, dual MIPI-CSI. Being tested to see if it alone can run face detection + response, the Kiosk UI, Speech, and the face LCD together. |
| Raspberry Pi 5 (8GB) | 2 | Approved, Phase 1 | Held in reserve. Role undecided — depends entirely on the navigation hardware decision below. |
| ~~Raspberry Pi AI HAT+~~ | ~~1~~ | **Dropped — not purchased** | AXON's built-in NPU covers this job, so the AI HAT+ that Phase 1 originally budgeted for is no longer needed. Saves ~₹9,000 against the budget as long as it's confirmed unbought (see Budget/ledger.md). |

**Navigation/movement hardware is UNDECIDED.** Do not assume ESP32, a Pi 5,
or any other board for real-time motor control/safety — this is being
decided after consulting an external expert already advising the project.
AXON is being tried first to see if it can handle navigation too; if not,
the fallback (ESP32 / a spare Pi 5 / other) gets planned separately. Nothing
in this document assumes a specific outcome.

## 4. Data Flow

```
Camera (CSI or USB — undecided, §8)
      │
      ▼
  ┌─────────────────────────────────────────────────────────┐
  │ AXON                                                     │
  │                                                           │
  │  Face detection (SCRFD-500M, RKNN toolchain)  — DECIDED   │
  │     → face_detected / position signal (Emotion/)          │
  │                                                           │
  │  Marker detection (AprilTag/ArUco)            — DECIDED   │
  │     → beacon-based position estimate (Navigation/)        │
  └───────┬───────────────────────────────┬───────────────────┘
          │                               │
          ▼                               ▼
  face_detected/position          movement command
  signal, LAN (ZMQ)               → NAVIGATION BOARD — UNDECIDED
          │                         (AXON itself, or the fallback
    ┌─────┴──────┐                  board once §8 is resolved)
    ▼            ▼
 Animation/    Kiosk/
 (face LCD    (greeting/tone
  reaction —   cue — not yet
  not yet      built)
  built)
```

Decided: camera → AXON → face detection (RKNN) and marker detection both run
on AXON. Not yet built: Animation/ and Kiosk/ don't yet consume the face
signal (Emotion/ publishes it; nothing subscribes yet). Undecided: which
board executes movement commands, and by extension whether that command
path even leaves AXON.

## 5. Software Stack

| Layer | Choice | Status |
|---|---|---|
| Face detection | SCRFD-500M, compiled to `.rknn` via RKNN-Toolkit2, run on AXON's NPU via RKNN**Lite** at inference time | Built, in `Emotion/` |
| Face-detection output | Simple signal only — `face_detected` (bool) + `position` (left/center/right) — no emotion label, no raw video | Built, in `Emotion/` |
| Greeting trigger | Consumer-side heuristic: face detected + roughly centered → greeting response. No gaze/landmark model (kept out deliberately, privacy + simplicity) | Design decided; Animation/Kiosk consumption not yet built |
| Speech-to-text | Vosk (`vosk-model-small-en-in`), offline, streaming | Designed, in `Speech/`; not yet implemented |
| Text-to-speech | Piper, local neural TTS | Designed, in `Speech/`; not yet implemented |
| Chat / Q&A engine | Rule-based `chatEngine.js` (keyword-matched against `asietContent.js`) — deliberately not an LLM, so every answer is traceable to a verified fact | Built, in `punch-kiosk/src/data/` |
| Kiosk UI | React + Vite (`punch-kiosk/`) | Built |
| Localization | Beacon-based (AprilTag/ArUco), fixed markers in the one operating hall | Designed |

**RKNN, not Hailo.** Earlier design work (pre-AXON) assumed a Raspberry Pi 5
+ Hailo AI HAT+ and used the Hailo Dataflow Compiler / HailoRT. AXON's NPU
uses Rockchip's RKNN toolchain instead — a different SDK, different model
format (`.rknn` vs `.hef`), different runtime (RKNNLite vs HailoRT). `Emotion/`
has been migrated to RKNN; see `Emotion/notes.md` (2026-08-17 entry) for what
changed.

## 6. Folder Map

- `Budget/` — `ledger.md`, the real-spend tracker against the ₹1,30,000 total budget.
- `Hardware/` — component sourcing/vendor enquiry work. Not yet started (scaffold only).
- `Kiosk/` — the touchscreen UI (`punch-kiosk/`, React/Vite) and its UX/perf notes.
- `Animation/` — face-LCD expression/animation logic. Not yet started (scaffold only).
- `Emotion/` — camera-driven face detection + greeting-trigger service, runs on AXON.
- `Speech/` — Vosk STT + Piper TTS voice pipeline, designed but not yet implemented.
- `Navigation/` — beacon-based localization + movement control. Barely started; blocked on the navigation-hardware decision (§3, §8).
- `Other/` — catch-all for anything that doesn't fit the above. Not yet started (scaffold only).
- `Architecture/` — this file: the cross-cutting, single-source-of-truth reference.
- `punch-kiosk/` — the actual React app backing `Kiosk/`.

## 7. Budget Snapshot

Total budget ₹1,30,000. Spent so far: ₹21,999 (AXON board ₹20,000 + Claude
subscription ₹1,999). Remaining: ₹1,08,001. Full itemized ledger, running
totals, and any future purchases: `Budget/ledger.md` — that file is the
source of truth; this is a snapshot only and will drift out of date.

## 8. Open Decisions

1. **Navigation/movement hardware** — undecided pending AXON testing and an
   external expert consultation. Candidates on the table: AXON handling it
   directly, ESP32, or a spare Pi 5. Blocks: final role of the 2x reserve
   Pi 5 units, the Navigation/ movement-command path in §4.
2. **AXON power input spec** — needs the datasheet or a direct question to
   Vicharak before assuming it matches the existing buck-converter/battery
   plan. Not yet verified.
3. **CSI vs. USB camera** — AXON has dual MIPI-CSI (lower latency), worth
   trying first, but it's a newer/less common board with less
   community-verified CSI driver support; USB is the safer fallback. Related:
   `Emotion/capture.py`'s current implementation targets USB (OpenCV/V4L2)
   as the safe default — CSI support depends on whatever camera SDK Vicharak
   ships for AXON, not evaluated yet.
4. **Whether both Raspberry Pi 5 units get used at all** — depends entirely
   on #1. If AXON handles everything including navigation, both Pi 5s may
   end up unused.

---

Should the project Instructions be updated to formally point future tasks
at this file as the canonical architecture reference? Flag this back to Emo
for a decision rather than assuming.
