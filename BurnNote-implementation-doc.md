# BurnNote — Implementation Plan

Derived from `BurnNote-PRD.md`. The project is a static, single-page React (Vite) app with no backend. Work is organized into 6 phases (M0–M5), each with concrete tasks, deliverables, and an exit checklist. A Phase 0 refers to pre-work decisions that unblock Phase 1.

---

## Phase 0: Pre-work & Decisions (0.5 day)

Before code, lock in the small set of decisions that affect everything else.

| Item | Decision needed |
| --- | --- |
| Project name & domain | Check name conflicts (see PRD §14). Working name: **BurnNote**; keep branding flexible. |
| Hosting target | Cloudflare Pages / Netlify / Vercel. Any static host works; pick one early to enable preview deploys from M1. |
| Audio source | Royalty-free packs (e.g., freesound.org CC0) vs. self-recorded. Decide early; sourcing takes longer than coding. |
| Font choice | Serif/handwriting font for the writing area + sans for UI, self-hosted via `@fontsource` packages (keeps CSP strict, avoids third-party requests). |
| Dependency budget | Only: `react`, `react-dom`, `gsap`, `@gsap/react`, `howler`. Everything else custom. |

**Deliverable:** decisions recorded in README; repo created.

---

## Phase M0: Project Setup (2–3 days)

**Goal:** A deployed "hello world" with the Midnight Ember design system already applied.

### Tasks

1. **Scaffold the app**
   - `npm create vite@latest burn-note -- --template react` (JSX, no TS for v1 speed — PRD structure uses `.jsx`).
   - Install `gsap @gsap/react howler`.
   - Set up `.gitignore`, README, repo, `npm run dev` / `build` / `preview` scripts.

2. **Design tokens (`src/styles/variables.css`)** — from PRD §9.2:
   ```css
   :root {
     --bg: #14100E;
     --surface: #1E1815;
     --border: #3A2E28;
     --text: #F2E8DC;
     --text-secondary: #9A8B7E;
     --ember: #FF6B2C;
     --flame: #FFA040;
     --glow: #FFD27A;
     --ash: #6B6560;
   }
   ```
   Plus spacing scale and CSS-based prefers-reduced-motion media defaults.

3. **Global styles (`src/styles/global.css`)**
   - Dark background, centered single-column layout, generous whitespace.
   - Responsive from 320px up (fluid typography with `clamp()`).
   - Visible `:focus-visible` outlines (needed for WCAG AA keyboard nav later).
   - Font faces wire-up with fallback stacks.

4. **Static shell components (no behavior yet)**
   - `App.jsx` — the state machine skeleton (see below).
   - `Header.jsx` + `Header.css` — logo left, mute toggle placeholder right.
   - `Footer.jsx` — one-line privacy statement: *"Nothing is saved. Nothing is sent."*
   - `index.html` — title, favicon.svg (simple flame mark), meta description, `autocomplete="off"` friendly viewport.

5. **App state machine (define now, build across phases)**
   ```
   states: 'writing' | 'burning' | 'aftermath'
   transitions: writing → burning (Burn click) → aftermath (animation end) → writing (Write again)
   ```
   This single `useState` in `App.jsx` drives all UI; no router, no state lib.

6. **Deploy pipeline**
   - Push to repo, connect to chosen host, verify preview + production deploys, HTTPS active, basic CSP headers (host-level `_headers` or `vercel.json`): no external scripts, `frame-ancestors 'none'`.

### Exit checklist
- [ ] Live URL renders the empty shell in Midnight Ember palette.
- [ ] Lighthouse initial pass: FCP < 1.5s on simulated 4G.
- [ ] CSP header blocks third-party scripts.

---

## Phase M1: Core Experience — Write & Basic Burn (1 week)

**Goal:** The full user loop works end-to-end: type → Burn → simple burn → aftermath → reset. Ugly-but-working animation is fine here.

### Tasks

1. **`WritingArea.jsx` + `WritingArea.css`** (F-1 through F-6)
   - Large `<textarea>`, `autoFocus` on load, styled with the serif/handwriting font.
   - Placeholder: "What do you want to let go of?" (make it a constant so F-6 rotating prompts can slot in later).
   - `maxLength={10000}` (comfortable headroom over the 5,000-char requirement); no character counter visible to keep it calm.
   - Text held in React state **only** — verify nothing touches `localStorage`, cookies, or network. Set `autocomplete="off"`, `spellcheck` off (per PRD §14), `name` omitted to defeat most autofill.
   - Warm glow behind the text: a blurred radial-gradient div whose opacity/scale is bound to `text.length` (cheap CSS transition, no JS animation loop).

2. **`BurnButton.jsx` + `BurnButton.css`**
   - Disabled when text is empty (F-7); ember-colored, clearly the primary action.
   - Click → set state to `'burning'`, disable textarea (`F-8`).
   - Keyboard shortcut: `Ctrl/Cmd + Enter` triggers burn when in writing state (F-12, do it now — it's one keydown listener).

3. **`useBurn.js` hook**
   - Owns the burn lifecycle: receives text + textarea ref, runs the burn sequence, calls `onComplete`.
   - **v1 sequence (placeholder for M2):** fade/dissolve the whole text block with GSAP over ~3s, then call `onComplete` → state `'aftermath'`, text cleared from memory (F-9, F-10).

4. **`splitText.js` (lib)**
   - Build now even though M1 doesn't need it: split a string into per-character span nodes, returning `{ chars, container }`. M2 will invoke it only at burn time (PRD §8.2), keeping typing fast during M1.

5. **`AfterBurn.jsx`**
   - Calm message ("It's gone. Breathe.") with fading embers (pure CSS — a few drifting ember dots).
   - "Write again" button → reset state to `'writing'`, empty textarea, re-focus.

6. **Component wiring in `App.jsx`**
   - Render `Header / WritingArea / BurnButton / AfterBurn` conditioned on state.
   - During `'burning'`, BurnEffect takes over the text area region (see M2).

### Exit checklist
- [ ] Full loop works on desktop + 320px mobile viewport.
- [ ] Verify in DevTools: zero network requests after load, zero storage writes while typing or burning.
- [ ] Text is truly unrecoverable after burn (React state nulled).

---

## Phase M2: Real Burn Animation (1–2 weeks)

**Goal:** The centerpiece — the 5–7s cinematic burn from PRD §8.1 — at 60fps on mid-range phones.

### Tasks

1. **Burn sequence choreography (`useBurn.js` expanded, GSAP timeline)**

   | Step | Window | Implementation |
   | --- | --- | --- |
   | Ignition | 0–0.8s | Small flame element (CSS/SVG flame at `--flame`/`--glow` colors) appears at lower edge of text; page glow layer intensifies |
   | Spread | 0.8–4s | Per-character staggering. Split text into char spans (only now), then stagger chars: color keyframe `--text → --flame → --ember → char → --ash`, slight scale/blur, curl via `skew`/rotate on spans. Stagger direction follows reading order (left→right, top→bottom) |
   | Ash & smoke | 3–6s | Overlapping with spread: Canvas particle layer (below) emits embers/sparks/ash at the x/y positions of currently-burning characters |
   | Settle | 6–7s | GSAP dims glow/particles to calm state; `onComplete` fires |

2. **Canvas particle system (`src/lib/particles.js`)**
   - One `<canvas>` overlaying the text area, `position: absolute`, sized to container.
   - Particle types: **embers** (small, rising, flicker between `--ember`/`--flame`), **sparks** (fast, short-lived, tiny), **ash flakes** (gray `--ash`, slow rise + drift, fade).
   - Spawn rates driven by the GSAP timeline progress — call `particles.emit(x, y, type)` from timeline callbacks at burning char positions.
   - rAF loop, single loop shared (no per-particle timers). Devices-Perf heuristic: if `navigator.hardwareConcurrency <= 4` or first-second frame time is poor, halve spawn caps (PRD §8.2, risk mitigation §14).
   - `document.visibilitychange` → pause the loop.

3. **`BurnEffect.jsx`**
   - Rendered during `'burning'` state: keeps a **read-only mirror** of the text (the original textarea is hidden so it can't be edited), the char-span layer, and the canvas layer. This means the burn doesn't animate inside a real textarea — the DOM swap to spans happens at ignition.

4. **Reduced motion path (`useReducedMotion.js`)** (F-19)
   - `matchMedia('(prefers-reduced-motion: reduce)')` hook.
   - If reduced: skip particles and char stagger — simple 1.5s opacity dissolve (already built in M1), shorter timeline, no glow bloom.

5. **Performance pass**
   - Only `transform`/`opacity`/`filter` in the JS-driven animations; color transitions on chars via CSS custom-property keyframes.
   - Profile on a real mid-range Android (or DevTools CPU 4x throttle): target 50+ fps (PRD metric). Tune particle counts before adding anything else.

### Exit checklist
- [ ] Burn reads visually as: ignite → fire travels across text → chars char/fade → embers rise → settle.
- [ ] 60fps desktop / 50+ fps throttled mid-range phone.
- [ ] Reduced-motion users get the dissolve; no particles.
- [ ] Sudden tab-hide during burn doesn't leak rAF loops; text still clears afterwards.

---

## Phase M3: Sound (3–5 days)

**Goal:** Tactile typing and a fire that sounds like fire, all behind a mute toggle.

### Tasks

1. **Audio assets (public/sounds/)**
   - Source per Phase 0 decision. Needed: `key1–4.mp3` (soft key presses, <150ms each), `fire.mp3` (ignition + crackle loop or full 5–7s sequence).
   - Can be produced from free CC0 packs; normalize loudness so keys are quiet and gentle.

2. **`useSound.js` hook**
   - Backed by Howler.js, lazy-initialized on **first user interaction** (F-16): an inch-of-code pattern — first `pointerdown`/`keydown` listener creates the Howl instances, which unlocks WebAudio under autoplay policies.
   - Keystroke sounds: 3–5 variants, random pick, throttled max ~1 per 40ms so rapid typing doesn't stack into noise. Trigger from the textarea's **`input` event**, not `keydown`, so mobile on-screen keyboards work too (F-17; PRD §14 risk).
   - Fire sound: started at ignition, fade-out over the last ~1.5s of the burn timeline (sync via the same GSAP timeline callbacks).
   - All playback no-ops instantly when muted.

3. **Mute toggle (`Header`)**
   - Persistent button in the header (F-15): flame-off/flame-on icon, `aria-pressed`, visible focus ring.
   - Persist **only the mute preference** in localStorage (this is allowed — it's a setting, never user text). Default: sound on.
   - When muted on load, audio system never initializes until explicitly unmuted (still fine with F-16).

4. **Audio polish**
   - Slight random pitch/volume jitter on key sounds (Howler `rate`) so repeated keys don't sound machine-like.
   - Ensure fire sound starts only with user's Burn click (it always is one).
   - Check the burn timeline still completes if audio is blocked/fails — animation must never wait on audio.

### Exit checklist
- [ ] Type with sound on desktop and iPhone/Android sim — keys respond, incl. mobile `input` events.
- [ ] Mute survives reload; unmute works mid-session.
- [ ] Burn completes even with audio disabled entirely.
- [ ] Total audio payload over network (on demand, after load) ≤ 1 MB.

---

## Phase M4: Accessibility, QA & Hardening (1 week)

**Goal:** Meet the PRD's accessibility and compatibility bars; find it broken before users do.

### Tasks

1. **Accessibility** (F-19–F-22, PRD §10)
   - Full keyboard pass: Tab order = textarea → Burn → mute → Write again. Enter in textarea makes newlines (not accidental burn); Ctrl/Cmd+Enter is the only burn shortcut.
   - ARIA: label the textarea (`aria-label="What do you want to let go of?"`), Burn (`aria-label` + disabled semantics), mute (`aria-pressed`).
   - When burn completes, fire a `role="status" aria-live="polite"` region announcement: "Your note has been burned. It's gone." (F-22) — but only announce, don't move focus rudely.
   - Manual screen-reader sanity pass (NVDA or VoiceOver).
   - Contrast check against WCAG AA for `--text`/`--text-secondary`/`--ember` on `--bg` (quick script or browser DevTools); nothing gets in under 4.5:1 for body text / 3:1 for large text.
   - The canvas particles get `aria-hidden="true"`.

2. **Cross-browser & mobile testing**
   - Matrix: latest Chrome, Safari, Firefox, Edge desktop + iOS Safari + Android Chrome (PRD §10). Key risks to probe:
     - iOS: audio unlock timing, input events, GSAP stagger smoothness.
     - Safari: canvas + blur filter perf (glow layer), `backdrop-filter` fallbacks.
     - Firefox: font rendering of the serif at small sizes.
   - Fix forward with feature-detection; no UA sniffing.

3. **Privacy audit** (PRD §10, §12)
   - Zero-tracker check on the deployed URL (Network tab with third-party filters on; no third-party analytics in v1 unless the privacy-friendly page-view-only kind is consciously added).
   - Automated guard: lint rule / CI grep asserting no `localStorage.setItem` outside the mute-key module, and nothing fetches data.
   - Confirm `robots`/headers, HTTPS-only, CSP live in production.

4. **Performance re-audit**
   - Bundle budget: initial JS ≤ 250 KB gzipped excluding audio. If Howler + GSAP blow past it, consider lazy-encoding: load Howler only when sound enabled; GSAP is core so it stays.
   - Audio genuinely lazy-loaded (Howl with `preload: false` or fetch-on-first-interaction).

5. **User-safety touch**
   - Footer link: "Need to talk to someone?" → a curated calm resources list (e.g., findahelpline.com) — per PRD §14. Non-intrusive, low-contrast secondary style.

### Exit checklist
- [ ] Lighthouse Accessibility ≥ 95 on deployed page.
- [ ] Manual test matrix below carried with expected results, all pass (or documented known-issues).
- [ ] Bundle under budget; audio lazy.
- [ ] Privacy grep clean in CI.

---

## Phase M5: Launch (3–5 days)

**Goal:** Real domain, real copy, real users, small and controlled.

### Tasks

1. **Copy pass**
   - Landing prompt, placeholder variants, aftermath message ("It's gone. Breathe." or similar), privacy footnote, honest autofill caveat if needed (PRD §14).
   - Tone check: quiet, warm, never clinical or preachy; no red or alarming language.

2. **Domain & name finalization**
   - Confirm brand name/domain per Phase 0 check; point it at the static host; HTTPS + HSTS.

3. **Telemetry choice (only if wanted)**
   - PRD allows cookie-less page-view counting (Plausible / Cloudflare Web Analytics) tracking only page views + burn clicks (§12). If skipping analytics for launch (reasonable), note the success metrics will be measured manually/approximately.

4. **Soft launch**
   - Share with 10–20 test users matching the PRD personas. Watch: does anyone fail to find the Burn button? Does mobile actually get through the flow?
   - Collect qualitative feedback on the emotional payoff — the product *is* the payoff.

5. **Launch-blocking fix list**
   - Anything found in soft launch gets triaged: fix P0s, ship, iterate.

6. **README & repo hygiene**
   - README: what it is, how to develop, deploy notes, privacy commitments, asset licenses.

### Exit checklist
- [ ] Live on final domain, HTTPS, production CSP.
- [ ] Beta feedback round done; P0 issues fixed.
- [ ] Metrics tracking (even manual) ready to measure PRD §13 targets.

---

## Post-v1 backlog (not scheduled, PRD §16)

Track as GitHub issues, work on after measuring v1:

- Alternative release modes: dissolve into smoke, paper lanterns, waves.
- Ambient soundscapes (rain, fireplace) as opt-in.
- Themes (Soft Ash, Twilight) — trivial with the existing token setup.
- PWA via `vite-plugin-pwa` (installable, offline).
- More languages.
- Optional post-burn breathing exercise (a simple 4-breath guided animation).

---

## Timeline summary

| Phase | Duration | Cumulative |
| --- | --- | --- |
| Phase 0 + M0: Setup | 2.5–3.5 days | ~0.5 week |
| M1: Core write & basic burn | 1 week | 1.5 weeks |
| M2: Real burn animation | 1–2 weeks | 2.5–3.5 weeks |
| M3: Sound | 3–5 days | 3–4.5 weeks |
| M4: Accessibility & QA | 1 week | 4–5.5 weeks |
| M5: Launch | 3–5 days | 5–6.5 weeks |

**Critical path note:** Sound asset sourcing (M3) has external lead time — start sourcing during M0/M1 in parallel. Animation (M2) is the largest risk/effort item; the M1 basic-burn placeholder means the app is demoable every single week.
