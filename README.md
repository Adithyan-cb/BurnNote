# BurnNote

A single-page site where you write down what you want to let go of, then burn it. Nothing is saved. Nothing is sent.

This is a static React + Vite app — no backend, no database, no accounts, and no storage of user text. See [`BurnNote-PRD.md`](./BurnNote-PRD.md) for the product spec and [`BurnNote-implementation-doc.md`](./BurnNote-implementation-doc.md) for the phase plan.

**Status:** Phase 0 (pre-work decisions) complete. Next: M0 project setup.

---

## Phase 0 — Locked decisions

These were agreed before implementation and should only change with a deliberate update to this file.

| Item | Decision |
| --- | --- |
| **Project name** | **BurnNote** is the internal working name only. **Phase 0 conflict check failed:** `burnnote.com` is an existing self-destructing-message product ("Burn Note", active since ~2013); "Burner Note" (`burnernote.com`) and "Burn Notes" (iOS App Store) are also in the same space. Do **not** launch under BurnNote without a trademark search and legal review. Final launch name is decided at M5. **Do not spend on branding or domains until then.** |
| **Domain** | `burnnote.com` is taken by the existing product — ruled out. No domain will be purchased for the working name. Once the final name is chosen at M5, verify availability and claim a `.com` plus one fallback. |
| **Hosting** | **Cloudflare Pages** — static deploy, preview deploys per branch, HTTPS, and a `public/_headers` file for a strict CSP. |
| **Audio source** | **CC0 / royalty-free packs** (freesound.org and similar). Normalize loudness on import. Every asset must be logged in [Asset licenses](#asset-licenses). Total audio budget: **under 1 MB**. |
| **Typography** | **Lora** for the writing area (soft literary serif) + **Inter** for UI controls (clean sans). Self-hosted via `@fontsource/lora` and `@fontsource/inter` — no third-party font requests, keeps CSP strict. |
| **Language / stack** | JavaScript + JSX (no TypeScript for v1), React 19, Vite 8. No router, no state library — a single `useState` state machine in `App.jsx`. |
| **State** | `'writing'` → `'burning'` → `'aftermath'`. Text lives in React state only, in memory. |
| **Animation** | GSAP + `@gsap/react` for sequencing; a custom Canvas particle layer. |
| **Audio engine** | Howler.js, lazy-initialized on first user interaction to satisfy autoplay policies. |
| **Privacy** | No backend, no user accounts, no network calls after load, no storage of user text. The only thing allowed in `localStorage` is the mute preference. No third-party trackers. |
| **Analytics** | None at launch. If added later, only cookie-less page-view/burn-count tooling (e.g. Cloudflare Web Analytics) — never anything that touches note content. |

### Naming: Phase 0 finding

The name check required by Phase 0 / PRD §14 found conflicts:

- **Burn Note** — `burnnote.com`, a self-destructing-message product active since ~2013 (Crunchbase).
- **Burner Note** — `burnernote.com`, an open-source self-destructing-notes service (2021).
- **Burn Notes** — an iOS App Store app (2025).

Consequences:

- **BurnNote stays as the internal/dev name** (repo, package, docs) and must not be used in launch branding, the domain, or store listings without legal review.
- **PRD §3 already refers to the product as "Cinder"** once ("Cinder is a reflective tool, not a clinical one"), suggesting a prior working name — treat **Cinder** as a candidate too, but run a fresh conflict check on it.
- Action at M5: shortlist names → trademark search → domain availability → pick. Keep the visible product name in a single copy/config constant once M1 starts, so renaming is a one-line change.

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
