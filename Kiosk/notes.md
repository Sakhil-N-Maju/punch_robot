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
