# Navigation — beacon-based (AprilTag/ArUco) localization and wheeled-base movement in the fixed hall.

## 2026-08-16 — Movement-control hardware DECIDED: ShrikeFi (ESP32S3 + FPGA); first Mobility & Drive parts purchased

### Decision (was UNDECIDED, now resolved — confirmed by Emo 2026-08-19)

Real-time motor control/safety hardware is **ShrikeFi (ESP32S3 + 1KLUT
FPGA)**, purchased alongside the drive motors and motor drivers (Humynex
Robotics invoice HNX26-TAX-0007, 16/08/2026). This resolves the open
question flagged in `Architecture/ARCHITECTURE.md` §3/§8 — ESP32 was one of
the candidates being weighed after the external expert consult; it's the
one that was bought. See `Budget/ledger.md` for the real spend.

Consequence: AXON (perception/UI) and the ShrikeFi board (movement control)
are now a decided two-board split for compute + control. Whether either
Raspberry Pi 5 (held in reserve) ends up used at all is still open — see
`Architecture/ARCHITECTURE.md` §8 — this decision doesn't force an answer
either way, though it does remove one of the reasons a Pi 5 might have been
needed (real-time motor control), so a Pi 5 role is now less likely if
AXON+ShrikeFi cover everything.

### Hardware purchased (Mobility & Drive)

| Item | Qty | Notes |
|---|---|---|
| Pro-Range Planetary Gear DC Motor 12V 262RPM 45 Ncm PG36M555-19.2K, encoder ME-37 (7 PPR) | 2 | Matches the hardware list's "drive motors with encoder" requirement exactly — encoders needed for wheel odometry between marker sightings. |
| BTS7960 43A H-bridge motor driver | 2 | The hardware list originally called for one dual-channel driver board; what was actually bought is two single-motor BTS7960 modules (one H-bridge each) — functionally equivalent for a 2-motor differential drive, just implemented as two boards instead of one. Not a problem, just a spec note in case anyone goes looking for a single dual-channel board and doesn't find one. |
| 1.0mm² flexible copper wire, red, 4m | 1 (4m) | Motor power wiring. |
| 1.0mm² flexible copper wire, black, 4m | 1 (4m) | Motor power wiring (return/ground). |
| ShrikeFi (ESP32S3 + 1KLUT FPGA) | 1 | Movement-control board — see decision above. |

### Still needed for Mobility & Drive (not in this purchase)

From the original hardware component list, not yet bought:
- Driven wheels (×2, matched to the drive motors)
- Caster wheels, free-swiveling (×2)
- Battery pack (Li-ion/LiPo, sized for ~2–3 hour runtime)
- Battery charging/management module

### Open items this doesn't resolve

- **ShrikeFi ↔ motor driver ↔ AXON interface**: how the ESP32S3 board talks
  to AXON (serial/USB/network) and receives movement commands isn't
  designed yet — `Architecture/ARCHITECTURE.md` §4's data-flow diagram
  still shows this as a TBD path, now with a concrete board name instead of
  a placeholder.
- **AprilTag/ArUco detection compute**: still runs on AXON per the existing
  design (dual MIPI-CSI, shared with face detection) — ShrikeFi is for
  motor control, not vision. Beacon position estimates would need to reach
  ShrikeFi as movement commands; that hand-off isn't designed yet either.
- **FPGA usage**: ShrikeFi's onboard FPGA (1K LUT) isn't accounted for in
  any current design — small enough it's likely just along for the ride on
  this board choice rather than load-bearing, but flagging so it doesn't
  get silently assumed into scope later.
