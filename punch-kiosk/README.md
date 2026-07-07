# Punch — ASIET AI Receptionist Kiosk

Production React rebuild of the original static-HTML/Babel-in-browser prototype
(kept at `../Design System/ui_kits/punch-kiosk/` for reference). Same brand —
white + turquoise, Sora/Plus Jakarta Sans/JetBrains Mono, Lucide icons, no
emoji, no face/avatar — but now a real build, with live content and working
interaction instead of static mock-ups.

## Run it

```
npm install
npm run dev       # http://localhost:5173 — live-reload dev server
npm run build     # outputs dist/ — static files, deploy this to the kiosk
npm run preview   # serve the production build locally to sanity-check it
```

## What changed vs. the prototype

- **Real content.** Every fact on screen — programs, accreditations, contact
  numbers, leadership, facilities, clubs, events, and a full faculty/HOD
  directory for all 11 departments — comes from `src/data/asietContent.js`,
  sourced from adishankara.ac.in including its public
  `/department/all-faculty` and `/about/head-of-the-departments` pages
  (fetched 2026-06-24). Update that one file; the home screen, the detail
  panels, and the chat answers all read from it, so they can't drift out of
  sync. The Academics panel has a department picker showing each HOD and
  their faculty list; "Ask Punch" answers "who is the HOD of CSE" the same
  way, from the same data.
  >  **Note on what was trimmed:** the source faculty page also listed a few
  >  staff with personal HR status ("on maternity leave", "study leave").
  >  That's published on adishankara.ac.in but isn't the kind of detail a
  >  public-facing robot should broadcast next to someone's name, so it was
  >  stripped from the kiosk's copy of the data (the academic title/PhD
  >  status was kept).
- **Per-department deep profiles.** Beyond the directory, a department can
  have a full profile — vision/mission, labs, funded research, patents,
  publications, industry MOUs, clubs, notable student projects, achievements
  (`departmentDetails` in `asietContent.js`, rendered by
  `DepartmentProfile.jsx`). Only **AI&DS** is fully populated right now as
  the template; other departments just show their HOD/faculty list until
  someone fetches and fills in the rest the same way.
- **It actually works now**, not just looks like it does:
  - Live clock + date (Asia/Kolkata), ticking for real.
  - Carousel auto-rotates every 8s through real upcoming events and recent
    news, pauses on touch/hover, tapping it opens the full Events panel.
  - The 6 Quick Access cards open real drill-down panels (Academics,
    Campus Life, About & Directory, Events & News, Admissions) instead of
    being decorative.
  - "Ask Punch" answers from a keyword-matched rule engine
    (`src/data/chatEngine.js`) grounded in the same content file — see
    "About the chat" below for why it's not a free-form LLM.
  - An on-screen QWERTY keyboard appears on input focus (most kiosk
    touchscreens have no physical keyboard), and voice input is wired to the
    Web Speech API behind the mic button, with the mic hidden automatically
    if the browser doesn't support it.
- **No CDN runtime dependency for rendering.** The prototype loaded React,
  Babel, and Lucide from CDN script tags and JSX-compiled them in the
  browser on every load — fine for quick iteration, risky for something
  meant to run unattended for hours on a robot. This is a real Vite build;
  `npm run build` produces a static bundle with icons compiled in
  (`lucide-react`), no Babel-in-browser, and no CDN dependency at runtime
  except the Google Fonts import (see below).

## Deploying on the robot

1. `npm run build`, then point the kiosk's Chromium/Edge browser at the
   `dist/` folder (a local static file server, or `file://.../dist/index.html`)
   in kiosk/fullscreen mode (e.g. `chromium --kiosk --app=<url>`).
2. The frame is authored at 1080×1920 portrait and scales uniformly to fill
   whatever resolution `useKioskScale` (`src/hooks/useKioskScale.js`) finds —
   mount the panel in portrait orientation.
3. **Offline fonts.** `src/styles/tokens.css` currently `@import`s Sora, Plus
   Jakarta Sans, and JetBrains Mono from Google Fonts. If the robot won't
   reliably have internet (likely, in a reception area on building Wi-Fi),
   download the three `.woff2` files once and switch that import for local
   `@font-face` rules — otherwise the kiosk will fall back to a system font
   any time the network blips.
4. **Voice input** depends on the Web Speech API, which routes audio to
   Google's speech servers — it needs internet and a working mic, and is
   unavailable in some locked-down embedded browsers. The UI already hides
   the mic button when unsupported (`useSpeechRecognition.js`), so this
   degrades gracefully to keyboard/touch.
5. Lock the browser down (disable right-click, address bar, navigation,
   dev tools, screen-saver/sleep) at the OS level — that's outside this
   repo's scope, see "Capabilities & limits" below.

## About the chat — why it's rule-based, not an LLM

`chatEngine.js` matches keywords against `asietContent.js` and returns a
canned, fact-checked sentence — it is deliberately not a language model.
On a reception kiosk representing a real college to real visitors, every
answer needs to be traceable to a verified fact; an LLM with no guardrails
will confidently invent a wrong phone number or admission deadline. Swapping
in a real LLM later is a one-function change (replace the body of
`getResponse()` in `chatEngine.js` with an API call), but see the next
section for what that actually requires.

## Capabilities & limits — what's beyond this build

Things you may want next that need a decision or resource only you can
provide:

- **A real conversational LLM.** The current chat only handles questions
  that match its keyword rules. A genuinely open-ended "ask anything" Punch
  needs an LLM API (e.g. Claude) wired in — that means an API key, a small
  backend/proxy (an API key can't safely live in client-side kiosk JS), a
  network-reliability plan for the robot's connection, and ideally
  retrieval-grounding (RAG) over verified ASIET documents so it can't
  hallucinate facts to a visitor. I can write that integration code, but I
  can't provision the API key, hosting, or budget for you.
- **Hardware/robot integration.** This is the chest touchscreen only. The
  robot's head/animated-eyes display, microphone array, speakers/TTS engine,
  and any motion are handled elsewhere (the `emo_model-main` Python module
  and the robot's firmware) — wiring this screen's state to that hardware
  (e.g. triggering a face expression when the chat opens) is systems
  integration I have no access to from here.
- **Physical testing.** I verified this in a desktop browser preview at the
  kiosk's exact pixel dimensions. I can't test touch responsiveness, glare
  under reception lighting, viewing angle at the robot's mounted height, or
  reachability for visitors in wheelchairs — that needs in-person testing on
  the actual installed unit.
- **Data I deliberately left out rather than guess.** Placement statistics,
  exact fee figures, and library hours aren't published on
  adishankara.ac.in, so they're absent from `asietContent.js` instead of
  being invented. If you have internal documents with these, send them and
  I'll add them as real data.
- **Live/official data feeds.** Everything here is a snapshot fetched
  2026-06-24. Events, admissions status, news, and the faculty roster
  (people join/leave, change designation) will go stale; there's no live
  sync to the college's actual CMS/database or HR system (that would need
  ASIET's IT department to expose an API or feed, and periodic re-fetching
  of this kind of data needs a refresh process either way).
- **Branding/legal sign-off.** This surfaces the ASIET seal, leadership and
  faculty names, and phone numbers — all already public on
  adishankara.ac.in, so there's no third-party permission issue. But this
  robot presents itself *as* ASIET to visitors, so it's worth a quick check
  with college administration/IT before deployment: confirm the logo is
  current, that staff are comfortable having their name+designation shown on
  a physical kiosk (vs. a webpage table), and that someone there owns
  keeping `asietContent.js` accurate as people and programs change.
