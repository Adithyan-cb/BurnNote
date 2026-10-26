# Product Requirements Document: BurnNote

---

## 1. Overview

BurnNote is a single-page website where people write down feelings, negative thoughts, worries, or anything they want to let go of, then press a **Burn** button. The text is destroyed with a realistic burning animation and fire sounds, and nothing is ever stored or sent anywhere. The experience is private, calming, and symbolic: a small digital ritual for release.

## 2. Problem Statement

People often carry thoughts they cannot or do not want to share with anyone. Journaling apps save everything, require accounts, and can feel heavy or risky for private feelings. Physical rituals (writing on paper and burning it) are effective but inconvenient, unsafe indoors, and unavailable to most people on demand.

There is no fast, free, no-signup way to get the emotional benefit of writing something down and watching it disappear.

## 3. Goals and Non-Goals

### Goals

- Deliver a satisfying, emotionally resonant write-and-burn experience in under a minute.
- Guarantee privacy by design: no backend, no database, no accounts, no storage of user text.
- Make the typing and burning feel tactile through high-quality animation and sound.
- Work smoothly on desktop and mobile with no sign-up or install.

### Non-Goals (v1)

- User accounts, saved entries, or history.
- Social sharing, community features, or public posts.
- Therapy, diagnosis, or mental-health advice. Cinder is a reflective tool, not a clinical one.
- Multi-language UI (English only at launch).
- Native mobile apps.

## 4. Target Users

| Persona | Description | Need |
| --- | --- | --- |
| The Overwhelmed | Students and professionals under stress | A quick way to dump thoughts and reset |
| The Private Processor | People who do not talk about feelings openly | A safe space with zero trace |
| The Ritual Seeker | People into journaling, mindfulness, or symbolic closure | A meaningful letting-go ritual |
| The Curious Visitor | Arrived via a shared link or social post | A delightful experience worth trying |

## 5. User Stories

1. As a user, I can open the site and start typing immediately, without signing up.
2. As a user, I hear soft keyboard sounds as I type, so writing feels tactile.
3. As a user, I can press Burn and watch my text catch fire and turn to ash.
4. As a user, I am confident my text never leaves my device.
5. As a user, I can mute sounds at any time.
6. As a user, I can use the site comfortably on my phone.
7. As a user sensitive to motion, I get a calmer, reduced-motion version of the burn.
8. As a user, after burning I can start fresh with a new empty page.

## 6. User Flow

1. **Landing:** a dark, quiet screen with a prompt such as "What do you want to let go of?" and a text area. A short line reads "Nothing is saved. Nothing is sent."
2. **Writing:** the user types. Key sounds play, and a soft warm glow behind the text area grows slightly as the amount of text increases.
3. **Ready to burn:** the Burn button becomes active once there is text.
4. **Burning:** on click, the text ignites and burns away with sound and particle effects (see Section 8).
5. **Aftermath:** a calm closing state with fading embers and a gentle message (for example, "It's gone. Breathe.").
6. **Reset:** a "Write again" button returns to a fresh, empty text area.

## 7. Functional Requirements

### 7.1 Writing Area

| ID | Requirement | Priority |
| --- | --- | --- |
| F-1 | Large, auto-focused text area on page load | P0 |
| F-2 | Supports multi-line text and long entries (at least 5,000 characters) | P0 |
| F-3 | Placeholder text prompts the user gently | P0 |
| F-4 | Text lives only in memory (React state); never written to localStorage, cookies, or network | P0 |
| F-5 | Character-level styling is not required; plain text only | P0 |
| F-6 | Optional rotating prompts (e.g., "What's weighing on you?") | P2 |

### 7.2 Burn Action

| ID | Requirement | Priority |
| --- | --- | --- |
| F-7 | Burn button disabled while the text area is empty | P0 |
| F-8 | Pressing Burn locks the text area (no editing during animation) | P0 |
| F-9 | Animation plays to completion, then all text is permanently cleared from memory | P0 |
| F-10 | After the burn, the text area is empty and the user can start again | P0 |
| F-11 | Optional confirmation is not required; one click burns | P0 |
| F-12 | Keyboard shortcut (e.g., Ctrl/Cmd + Enter) to burn | P2 |

### 7.3 Sound

| ID | Requirement | Priority |
| --- | --- | --- |
| F-13 | Keyboard typing sounds with 3 to 5 variations chosen at random | P0 |
| F-14 | Fire crackle sound during the burn, fading out at the end | P0 |
| F-15 | Visible mute/unmute toggle, persistent in the header | P0 |
| F-16 | Audio starts only after the first user interaction (browser autoplay rules) | P0 |
| F-17 | Sounds triggered by `input` events so they also work on mobile on-screen keyboards | P1 |
| F-18 | Separate volume control or ambient background sound option | P2 |

### 7.4 Accessibility and Settings

| ID | Requirement | Priority |
| --- | --- | --- |
| F-19 | Respect `prefers-reduced-motion`: replace the burn with a simple fade or dissolve | P0 |
| F-20 | Full keyboard navigation and visible focus states | P0 |
| F-21 | Text and button contrast meet WCAG AA | P0 |
| F-22 | ARIA labels on the text area, Burn button, and mute toggle; screen-reader announcement when the burn completes | P1 |

## 8. Animation and Sound Specification

### 8.1 Burn Sequence (target duration: 5 to 7 seconds)

1. **Ignition (0 to 0.8s):** a small flame appears at the lower edge or the start of the text; the page glow intensifies.
2. **Spread (0.8 to 4s):** text is split into individual characters or words and set on fire with staggered timing, so the fire appears to travel across the writing. Burning characters turn from warm off-white to orange to dark char, then curl and fade.
3. **Ash and smoke (3 to 6s):** particles (embers, sparks, ash flakes) rise and drift upward; subtle smoke or SVG displacement effect on dissolving text.
4. **Settle (6 to 7s):** the screen dims back to its calm state, and embers fade out.

### 8.2 Implementation Notes

- GSAP (with `@gsap/react`) for sequencing and staggering.
- Canvas-based particle system for sparks, embers, and ash.
- Text wrapped in per-character spans only at burn time, to keep typing performance fast.
- Target 60 fps on mid-range phones; cap particle count on low-power devices.

### 8.3 Audio Assets

- 3 to 5 soft key press samples (short, under 150 ms).
- 1 fire ignition and crackle loop with fade-out.
- Optional soft ambient room tone.
- Use royalty-free or self-recorded audio only; keep total audio under 1 MB.

## 9. Design Requirements

### 9.1 Visual Direction

Dark, warm, and quiet. Fire is the only bright element on screen.

### 9.2 Color Palette (Midnight Ember)

| Role | Hex |
| --- | --- |
| Background | `#14100E` |
| Surface | `#1E1815` |
| Border | `#3A2E28` |
| Main text | `#F2E8DC` |
| Secondary text | `#9A8B7E` |
| Ember (accent / Burn button) | `#FF6B2C` |
| Flame | `#FFA040` |
| Glow | `#FFD27A` |
| Ash | `#6B6560` |

No red error or warning colors; the tone should never feel alarming.

### 9.3 Typography

A soft serif or handwriting-style font for the writing area; a clean sans-serif for UI controls. Fonts should be self-hosted or loaded with a fast fallback.

### 9.4 Layout

- Single centered column, generous whitespace.
- Header with logo and mute toggle only.
- Footer with a one-line privacy statement.
- Fully responsive from 320px mobile to large desktop.

## 10. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Privacy | No user text is transmitted, logged, or stored. No third-party trackers. |
| Performance | First contentful paint under 1.5s on 4G; initial JS bundle under 250 KB gzipped (excluding audio); lazy-load audio. |
| Compatibility | Latest two versions of Chrome, Safari, Firefox, Edge; iOS Safari and Android Chrome. |
| Reliability | Fully static; works offline after first load if PWA support is added. |
| Accessibility | WCAG 2.1 AA target. |
| Security | HTTPS only; strict Content Security Policy; no inline third-party scripts. |

## 11. Technical Approach

- **Framework:** React with Vite (static single-page app).
- **Animation:** GSAP and `@gsap/react`, plus a custom Canvas particle layer.
- **Audio:** Howler.js (or Web Audio API directly if keystroke latency is an issue).
- **State:** React `useState` only; no router and no state library.
- **Hosting:** Cloudflare Pages, Netlify, or Vercel (static).
- **Backend / database:** none.
- **Optional later:** `vite-plugin-pwa` for installable, offline use.

## 12. Analytics and Privacy

- No analytics that touch user text or identify individuals.
- If measurement is needed, use a privacy-friendly, cookie-less tool (e.g., Plausible or Cloudflare Web Analytics) that only counts page views and burn-button clicks, never content.
- Display a clear, honest privacy line on the page and a short privacy note explaining that everything stays in the browser.

## 13. Success Metrics

| Metric | Target (first 3 months) |
| --- | --- |
| Burn completion rate (visits that result in a burn) | 35% or higher |
| Average session length | 2 minutes or more |
| Repeat visits (returning users, cookie-less estimate) | 20% or higher |
| Load time (p75) | Under 2s |
| Animation frame rate on mid-range mobile | 50+ fps average |
| Reports of text persisting or leaking | Zero |

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Animation is janky on low-end phones | Breaks the emotional payoff | Adaptive particle count; reduced-motion fallback; profile early |
| Mobile keyboards do not produce reliable key events | Typing sounds missing | Trigger sounds from `input` events |
| Audio blocked by browser autoplay policy | No sound | Unlock audio on first interaction; show clear sound toggle |
| Users in serious distress use the site as their only outlet | User safety | Add a gentle, non-intrusive "Need to talk to someone?" link to support resources in the footer |
| Browser extensions or autofill snapshot the text | Privacy perception | Set `autocomplete="off"`, `spellcheck` optional, and be honest in copy about what the site can control |
| Domain or name conflicts | Branding delays | Check domain and trademark early; keep naming flexible |

## 15. Milestones

| Phase | Scope | Estimated time |
| --- | --- | --- |
| M0: Setup | Vite + React project, repo, hosting, design tokens | 2 to 3 days |
| M1: Core | Text area, state, Burn button, basic fade burn | 1 week |
| M2: Animation | Per-character burn, particle system, polish | 1 to 2 weeks |
| M3: Sound | Typing sounds, fire audio, mute control | 3 to 5 days |
| M4: Accessibility and QA | Reduced motion, keyboard use, cross-browser and mobile testing | 1 week |
| M5: Launch | Domain, privacy copy, soft launch, feedback | 3 to 5 days |

## 16. Future Considerations (Post-v1)

- Alternative "release" modes (e.g., dissolve into smoke, float away as paper lanterns, wash away with waves).
- Selectable ambient soundscapes (rain, fireplace).
- Themes (Soft Ash, Twilight).
- Installable PWA with offline support.
- Multiple languages.
- A short, optional breathing exercise after the burn.

## project structure

burn-site/
├── public/
│   ├── favicon.svg
│   └── sounds/
│       ├── key1.mp3
│       ├── key2.mp3
│       ├── key3.mp3
│       ├── key4.mp3
│       └── fire.mp3
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── WritingArea.jsx
│   │   ├── WritingArea.css
│   │   ├── BurnButton.jsx
│   │   ├── BurnButton.css
│   │   ├── BurnEffect.jsx
│   │   ├── AfterBurn.jsx
│   │   └── Footer.jsx
│   ├── hooks/
│   │   ├── useSound.js
│   │   ├── useBurn.js
│   │   └── useReducedMotion.js
│   ├── lib/
│   │   ├── particles.js
│   │   └── splitText.js
│   ├── styles/
│   │   ├── variables.css
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
