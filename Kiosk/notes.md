# Kiosk workstream notes

## 2026-07-07 — UI/UX + code-quality pass on punch-kiosk (High-priority items)

Full review across visual design / touch usability / code quality; implemented
all High items. Build verified (`vite build` passes). Rule-based chat engine and
asietContent.js untouched; no excluded data (fees, placements, library hours,
HR/leave) added.

### Files touched

- `src/styles/tokens.css` — new `--punch-text-muted: #737373`,
  `--punch-turquoise-text: #0F766E`, `--punch-gradient-deep`; user-bubble
  gradient darkened to `#0F766E → #115E59`.
- `src/styles/global.css` — `touch-action: manipulation` + `user-select: none`
  on buttons; AA-passing `::placeholder` color.
- `src/App.jsx` — exit transition on Back (slideDownOut, element kept mounted,
  reduced-motion backstop); 3-minute idle reset to a fresh Home (clears the
  previous visitor's chat/search).
- `src/features/home/HomeFrame.jsx` — greeting now uses the live `useClock`
  instead of a Date frozen at mount ("Good Morning" forever bug).
- `src/features/home/Carousel.jsx` — slides recompute on day change (stale
  events bug); fadeInUp between slides instead of a hard cut; dots got 44×44
  hit areas + AA inactive color; pointer press feedback on the big card.
- `src/components/cards/QuickAccessCard.jsx` — featured "Ask Punch" tile now
  carries its gradient border/tint at rest (hover never fires on touch);
  pointer-event press feedback.
- `src/features/chat/OnScreenKeyboard.jsx` — per-key press feedback via a Key
  component (pointer events); shift auto-releases after one letter; 44×44
  close button; enter/shift-active bg `#0D9488` (white glyph ≥3:1); aria-labels.
- `src/components/core/IconButton.jsx`, `Button.jsx` — deep gradients so white
  text/icons pass AA/3:1; pointer press feedback.
- `src/components/feedback/Tag.jsx`, `StatusDot.jsx`, `Chip.jsx`,
  `MessageBubble.jsx` — AA text colors; Chip gets minHeight 44 + press feedback.
- `src/features/chat/ChatFrame.jsx`, `src/features/detail/DetailPanel.jsx` —
  back buttons and header "Ask Punch" enlarged to ≥44px targets; muted text
  `#A3A3A3 → #737373`.
- `src/features/detail/panels/AcademicsPanel.jsx` — DeptChip: 44px target,
  AA active color (`#0F766E`), press feedback; PhD pills / HOD line AA colors.
- `src/features/detail/panels/DepartmentProfile.jsx` — every section guarded
  (`detail.mission?.length` etc.) so partial profiles for the 10 remaining
  departments render what they have instead of crashing the Academics panel.
- `src/features/home/Header.jsx`, `Greeting.jsx`, `QuickAccess.jsx`,
  `AssistantBar.jsx` — muted/label text moved to AA colors ("PUNCH" label
  `#14B8A6 → #0F766E`).
- `src/hooks/useSpeechRecognition.js` — onResult held in a ref so the
  recognizer isn't torn down/recreated every render (could abort a capture
  mid-sentence).

### Key decisions

- Contrast: `#A3A3A3` (2.5:1) → `#737373` (4.6:1) for all muted TEXT;
  `#14B8A6`/`#0D9488` as text → `#0F766E` (5.5:1). Bright turquoise stays for
  backgrounds, icons, and decorative accents — the brand look is preserved,
  only text-bearing uses darkened. White-on-gradient surfaces darkened to keep
  17px chat text ≥4.5:1 and icon glyphs ≥3:1.
- Press feedback standardized on pointer events (mouse events fire late/never
  under touch). Hover styles kept for desktop dev.
- Idle reset chosen at 180 s — long enough to read a department profile,
  short enough that the next visitor never sees a stranger's conversation.
- Deliberately NOT done: chat engine untouched; no swipe gestures yet; no
  token migration of the remaining hardcoded hex (Medium, follow-up).

### Medium/Low follow-up list

1. (M) Migrate remaining hardcoded hex in components to tokens.css variables.
2. (M) Carousel swipe gesture support.
3. (M) React error boundary around the app shell.
4. (M) Test Atmosphere blur blobs on the actual Pi 5 — 5 animated 60px-blur
   layers may jank Chromium there; drop `intensity`/count if so.
5. (M) On-screen keyboard: backspace key-repeat on hold.
6. (L) Guard `facultyDirectory[0]` in AcademicsPanel against an empty array.
7. (L) Focus-visible outlines (matters if a physical keyboard is ever attached).
8. (L) Consider bumping InfoCard detail text 14→15px for standing distance.
9. (L) MessageBubble uses array index as key (fine while append-only).
10. (L) SUGGESTED_QUESTIONS could rotate/randomize for variety.

## 2026-07-08 — Atmosphere blur performance: proxy profile + low-power fallback

### 1. Proxy signal (NOT verified on real Pi 5 hardware)

Method: built kiosk page profiled in headless Chromium (software/SwiftShader
rendering) at 1080×1920 with CDP CPU throttling at 4x and 6x, comparing the
default 5-blur-layer Atmosphere vs the new `?lowPower=true` static fallback.
rAF frame-time sampling (4s idle Home + 800ms windows around panel
open/close) plus renderer trace category sums.

Results (frame times in ms):

| Scenario                | mean | p95  | max  | % frames >16.7ms |
|-------------------------|------|------|------|------------------|
| 4x idle, default        | 19.3 | 33.3 | 333  | 22%              |
| 4x idle, lowPower       | 17.5 | 16.8 | 50   | 21%              |
| 6x idle, default        | 27.0 | 33.4 | 400  | 44%              |
| 6x idle, lowPower       | 19.7 | 33.4 | 67   | 37%              |

Panel-open transition: at 6x default the 0.42s slide produced only 4 frames
in 800ms (median 317ms — a slideshow); lowPower produced 12 frames
(median 16.7ms). At 4x: 6 frames default vs 15 lowPower. The fallback
consistently collapses worst-case frame times by 5-8x.

Attribution caveats (why this is a proxy, not a verdict):
- Blur compositing happens in Chromium's GPU/viz process, which page-level
  tracing does not capture — renderer-side Paint/Commit sums were similar in
  both modes (~1.3-1.6s busy per 4s). The A/B frame-time difference is the
  meaningful signal, and it points squarely at the blur layers.
- Headless SwiftShader rasterizes blur on CPU; the Pi 5's VideoCore VII GPU
  behaves differently (possibly better at compositing, possibly worse on
  five 520-700px blur radius-60 layers). Real numbers require the device.
- Side observation: `dotPulse` animates box-shadow (repaints every frame
  even in lowPower) — added to follow-ups.

### 2. Fallback mechanism added

- `src/hooks/usePerformanceMode.js` (new): reads `?lowPower=true|false`
  (true forces the fallback, false pins the full effect and disables the
  auto-switch — needed for clean A/B); otherwise runs a one-shot
  self-benchmark 1.5s after mount (60 rAF frames; median >24ms ≈ can't hold
  ~42fps → switches to low power, logged to console).
- `src/features/home/Atmosphere.jsx`: `lowPower` prop swaps the 5 animated
  60px-blur layers for a single static two-stop radial-gradient wash — no
  filter, no animation, painted once. Same turquoise mood; full effect
  remains the default (guardrail 2: animation must never slow the visitor).
- `src/components/debug/FpsCounter.jsx` (new): `?debug=true` overlay —
  FPS / avg / max frame time, color-coded, plus a LOW POWER (URL|AUTO) badge.
- `src/App.jsx`, `HomeFrame.jsx`: wire lowPower + debug overlay through.

### 3. Manual test steps on the actual Pi 5

1. Boot the Pi with the kiosk build served, open Chromium at
   `http://<kiosk-url>/?debug=true&lowPower=false` (full effect pinned,
   FPS counter on, auto-switch off so you measure the true default).
2. Let Home idle 60s. Read the counter: green (avg ≤17ms) = fine; amber
   (17-34ms) = borderline; red (>34ms) or max spikes repeatedly >50ms = the
   blur layers are a real problem on this hardware.
3. Tap through 5-6 panel opens/closes and the chat. Watch `max` during the
   slide transitions — repeated 100ms+ maxima mean visitors see stutter.
4. Change the URL to `?debug=true&lowPower=true` and repeat steps 2-3 with
   the same interactions. Compare readings side by side.
5. Auto-switch check: load with only `?debug=true`. If the self-benchmark
   trips, a "LOW POWER (AUTO)" badge appears within ~5s of load and the
   console logs `[punch] self-benchmark: ...`.
6. Optional DevTools view: Ctrl+Shift+I → Performance → gear icon → no CPU
   throttling (you're on real hardware) → Record 10s of idle + a panel
   open → look at the frame chart (red striped = dropped frames) and the
   GPU/Raster tracks while the blobs drift.
7. Decision: if default is red/amber and lowPower is green, either ship the
   kiosk launch URL with `lowPower=true` or simply trust the auto-benchmark
   (it makes the same call on every boot).

### Follow-ups added

11. (M) `dotPulse` keyframe animates box-shadow → per-frame repaint even in
    low-power mode; switch to a transform/opacity pulse.
12. (L) Consider `will-change: transform` on Atmosphere blobs (full mode) if
    Pi testing shows raster churn rather than composite cost.
