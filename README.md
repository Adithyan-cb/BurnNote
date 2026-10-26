# BurnNote

A single-page site where you write down what you want to let go of, then burn it. Nothing is saved. Nothing is sent.

This is a static React + Vite app — no backend, no database, no accounts, and no storage of user text. See [`BurnNote-PRD.md`](./BurnNote-PRD.md) for the product spec and [`BurnNote-implementation-doc.md`](./BurnNote-implementation-doc.md) for the phase plan.

**Status:** Phase 0 (pre-work decisions) complete. Next: M0 project setup.

---

## Phase 0 — Locked decisions

These were agreed before implementation and should only change with a deliberate update to this file.

| Item | Decision |
| --- | --- |
| **Project name** | **BurnNote** (working name; branding stays flexible until domain/name checks at launch) |
| **Domain** | Not yet claimed. Candidates to verify at M5: `burnnote.app`, `burnnote.site`, `burnnote.xyz`. No purchase needed until launch. |
| **Hosting** | **Cloudflare Pages** — static deploy, preview deploys per branch, HTTPS, and a `public/_headers` file for a strict CSP. |
| **Audio source** | **CC0 / royalty-free packs** (freesound.org and similar). Normalize loudness on import. Every asset must be logged in [Asset licenses](#asset-licenses). Total audio budget: **under 1 MB**. |
| **Typography** | **Lora** for the writing area (soft literary serif) + **Inter** for UI controls (clean sans). Self-hosted via `@fontsource/lora` and `@fontsource/inter` — no third-party font requests, keeps CSP strict. |
| **Language / stack** | JavaScript + JSX (no TypeScript for v1), React 19, Vite 8. No router, no state library — a single `useState` state machine in `App.jsx`. |
| **State** | `'writing'` → `'burning'` → `'aftermath'`. Text lives in React state only, in memory. |
| **Animation** | GSAP + `@gsap/react` for sequencing; a custom Canvas particle layer. |
| **Audio engine** | Howler.js, lazy-initialized on first user interaction to satisfy autoplay policies. |
| **Privacy** | No backend, no user accounts, no network calls after load, no storage of user text. The only thing allowed in `localStorage` is the mute preference. No third-party trackers. |
| **Analytics** | None at launch. If added later, only cookie-less page-view/burn-count tooling (e.g. Cloudflare Web Analytics) — never anything that touches note content. |

### Dependency budget

Runtime dependencies are fixed at five, and all five are already installed:

| Package | Why |
| --- | --- |
| `react` | UI |
| `react-dom` | UI |
| `gsap` | Burn timeline / staggering |
| `@gsap/react` | GSAP lifecycle integration with React |
| `howler` | Audio playback and WebAudio unlocking |

**Approved exception:** `@fontsource/lora` and `@fontsource/inter` (added as part of the typography decision; they ship CSS + font files only). Any other runtime dependency requires updating this section first.

Dev-only tooling (Vite, ESLint plugins, React types) does not count against the runtime budget.

**Bundle target:** initial JS ≤ 250 KB gzipped, excluding audio; audio lazy-loaded on first interaction.

---

## Local development

```bash
npm install
npm run dev      # start dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # ESLint
```

Requires Node 20.19+ / 22.12+ (Vite 8 requirement; verified on Node 22).

---

## Deployment

Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22 (set via `NODE_VERSION` env var or `.nvmrc` when M0 adds it)
- Headers: `public/_headers` (added in M0) — strict CSP, `frame-ancestors 'none'`, HTTPS-only

---

## Repository status

| Phase | Status |
| --- | --- |
| Phase 0 — Decisions | Done |
| M0 — Setup (tokens, shell, deploy) | Not started |
| M1 — Core write & basic burn | Not started |
| M2 — Real burn animation | Not started |
| M3 — Sound | Not started |
| M4 — Accessibility & QA | Not started |
| M5 — Launch | Not started |

The repo is initialized and the Vite scaffold with the five runtime dependencies is in place. The previous template UI still needs to be replaced in M0 — that is expected.

---

## Asset licenses

Every third-party asset must be recorded here before it ships.

| Asset | Source | License | Notes |
| --- | --- | --- | --- |
| _(typing keys, fire loop — to be sourced in M3)_ | | | |

Fonts: Lora and Inter are licensed under the SIL Open Font License 1.1, distributed via `@fontsource`.

## Privacy commitments

- Your writing never leaves the browser: no requests, no logs, no local storage, no cookies.
- There is no server to receive it — the app is fully static.
- The only persisted value is your mute setting.
- Browser extensions or OS-level autofill are outside the app's control; this is stated honestly in the UI copy.
