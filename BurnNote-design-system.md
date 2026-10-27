# Design System: Cinder

**Version:** 1.0 **Style:** Simple, minimal, dark room with a single sheet of paper

---

## 1. Design Principles

1. **One thing on screen at a time.** Either a sheet of paper, or the Write again button. Never both.
2. **The paper is the hero.** It is the only light surface on a dark page, so the eye goes straight to it.
3. **Fire is the only bright color.** Orange is reserved for the Burn button and the burn animation.
4. **Quiet by default.** No decorative elements, no icons beyond the mute toggle, no extra copy.
5. **Motion has meaning.** Animation only appears when paper arrives, burns, or when the page changes state.

## 2. Screen States

The whole product is three states. Every design decision maps to one of them.

| State | What the user sees | Primary action |
| --- | --- | --- |
| **Idle** | Paper-style text area centered, Burn button below it | Type, then click **Burn** |
| **Burning** | Paper and text burn away; controls are hidden or disabled | None (animation plays) |
| **Done** | Empty dark screen with a single **Write again** button in the center | Click **Write again** |

After **Write again** is clicked, a fresh paper appears and the app returns to Idle.

## 3. Layout

Everything sits in one centered column on a dark background.

```
+--------------------------------------+
|                          [sound]     |   header: mute toggle only
|                                      |
|          +----------------+          |
|          |                |          |
|          |     PAPER      |          |   paper: centered
|          |   (textarea)   |          |
|          |                |          |
|          +----------------+          |
|               [ Burn ]               |   button: 24px below paper
|                                      |
|     Nothing is saved. Nothing is     |   footer: one line, muted
|              sent.                   |
+--------------------------------------+
```

- The paper and button are centered both horizontally and vertically in the viewport.
- Paper width: `min(680px, 90vw)`. Paper height: `min(60vh, 480px)`.
- In the Done state, the **Write again** button sits at the exact center of the screen.
- Header and footer are small and quiet so they never compete with the paper.

## 4. Color Tokens

| Token | Hex | Used for |
| --- | --- | --- |
| `--color-bg` | `#14100E` | Page background |
| `--color-paper` | `#F2E8DC` | Paper surface |
| `--color-paper-edge` | `#E4D6C4` | Paper border and fold shading |
| `--color-ink` | `#2A211C` | Text written on the paper |
| `--color-ink-muted` | `#8A7B6E` | Placeholder text on the paper |
| `--color-text` | `#F2E8DC` | Text on the dark background |
| `--color-text-muted` | `#9A8B7E` | Footer and secondary text |
| `--color-border` | `#3A2E28` | Subtle lines on the dark background |
| `--color-ember` | `#FF6B2C` | Burn button, primary accent |
| `--color-flame` | `#FFA040` | Button hover, flame body |
| `--color-glow` | `#FFD27A` | Flame core, soft glow |
| `--color-char` | `#1A0F0A` | Burnt paper edge |
| `--color-ash` | `#6B6560` | Ash particles |

**Rules**

- Never use pure black or pure white.
- Never use red for errors or warnings. This is a calm place.
- Orange appears only on the Burn button, the Write again button, and the fire.

## 5. Typography

| Role | Font | Size | Weight | Line height |
| --- | --- | --- | --- | --- |
| Paper text | Lora (serif) | 20px (18px on mobile) | 400 | 1.7 |
| Paper placeholder | Lora, italic | 20px | 400 | 1.7 |
| Button label | Inter (sans-serif) | 16px | 500 | 1 |
| Footer / helper text | Inter | 13px | 400 | 1.5 |

- Optional alternative for the paper text: a handwriting font such as Caveat, if you want a more personal feel. Check readability on long entries before choosing it.
- Fallback stacks: `Georgia, serif` for paper text and `system-ui, sans-serif` for UI.
- Keep button labels lowercase or sentence case: **Burn**, **Write again**.

## 6. Spacing, Radius and Shadow

**Spacing scale (4px base):** `4, 8, 12, 16, 24, 32, 48, 64`

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |

**Radius**

- Paper: `4px` (paper has nearly square corners)
- Buttons: `999px` (pill shape)

**Shadows**

- Paper: `0 20px 60px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.4)` so it appears to rest above the dark surface.
- Ambient glow behind paper: `0 0 120px rgba(255, 107, 44, 0.06)`, which grows slightly as the user types.

## 7. Components

### 7.1 Paper (text area)

The text area is styled as a single sheet of paper. It is a real `<textarea>` so typing, selection, and mobile keyboards all work normally.

- Background: `--color-paper`, with a very subtle paper texture or noise (opacity under 4%).
- Border: `1px solid var(--color-paper-edge)`.
- Padding: `32px` (`24px` on mobile).
- No visible textarea outline. Instead, on focus the paper gets a slightly stronger glow shadow.
- Resize handle: disabled.
- Placeholder: "What do you want to let go of?"
- Caret color: `--color-ember`.
- Optional detail: a faint top margin line or soft inner shadow at the top edge to make it feel like paper.

| State | Appearance |
| --- | --- |
| Default | Paper with muted italic placeholder |
| Focus | Slightly stronger ambient glow, caret in ember |
| Typing | Glow intensity grows gently with text length (capped) |
| Burning | Locked, no caret, burn animation runs on top |

### 7.2 Burn Button

- Placed centered, `24px` below the paper.
- Background: `--color-ember`. Text: `--color-bg`.
- Padding: `14px 36px`. Pill shape.
- Hover: background `--color-flame`, soft glow `0 0 24px rgba(255, 160, 64, 0.4)`.
- Active: scale to `0.97`.
- Focus visible: 2px outline `--color-glow` with 3px offset.
- Disabled (empty text): opacity `0.35`, no glow, cursor `not-allowed`.
- On click: the button fades out in `200ms` as the burn begins.

### 7.3 Write Again Button

- Appears at the exact center of the screen after the burn finishes.
- Same style as the Burn button but outlined for a calmer feel: transparent background, `1px solid var(--color-ember)` border, text in `--color-ember`.
- Hover: fills with `--color-ember`, text becomes `--color-bg`.
- Entrance: fades in over `600ms` after a short `800ms` pause, so the user gets a quiet moment first.
- On click: the button fades out in `200ms`, then a new paper appears.

### 7.4 Mute Toggle

- Small icon button, top right, `40px` touch target.
- Icon color: `--color-text-muted`; hover `--color-text`.
- State is shown by the icon (speaker / speaker with slash) and an `aria-label`.

### 7.5 Footer Text

- One line: "Nothing is saved. Nothing is sent."
- Color `--color-text-muted`, 13px, centered, fixed at the bottom.
- Hidden during the Burning state to keep the screen clean.

## 8. Motion Tokens

| Token | Value | Used for |
| --- | --- | --- |
| `--ease-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances and fades |
| `--duration-fast` | `200ms` | Button fades, hover |
| `--duration-base` | `400ms` | Paper entrance |
| `--duration-slow` | `600ms` | Write again entrance |
| `--duration-burn` | `5500ms` | Full burn sequence |

### Paper entrance (Idle)

On first load and after Write again: the paper fades in from `opacity 0` to `1` while rising `16px` into place, over `400ms` with `--ease-soft`. The text area is focused as soon as it settles.

### Burn sequence (Burning)

1. **Ignite (0 to 0.8s):** the Burn button and footer fade out. A small flame appears at the bottom edge of the paper and the ambient glow brightens.
2. **Spread (0.8 to 4s):** a glowing burn line travels upward across the paper. Behind it, the paper darkens to `--color-char` and curls away; text characters ahead of the line stay readable, and characters at the line turn orange and fade.
3. **Embers and ash (2 to 5s):** sparks and ash flakes rise and drift above the paper using the fire colors (`--color-glow`, `--color-flame`, `--color-ash`).
4. **Settle (4.5 to 5.5s):** the last of the paper turns to ash and disappears, the glow fades out, and the page returns to plain `--color-bg`.

The text content is cleared from memory as soon as the sequence ends.

### Done

After an `800ms` pause on the empty dark screen, **Write again** fades in at the center.

### Reduced motion

If the user prefers reduced motion, skip the flame and particles. The paper simply fades to the background over `800ms`, and the rest of the flow is unchanged.

## 9. Sound Guidelines

| Event | Sound | Notes |
| --- | --- | --- |
| Key press | Soft key click, 3 to 5 variations | Random per key, low volume |
| Burn | Fire ignition and gentle crackle | Fades out with the animation |
| Write again | None | Silence keeps the done state calm |

Sound is off until the user's first interaction and always controllable from the mute toggle.

## 10. Responsive Behavior

| Breakpoint | Changes |
| --- | --- |
| Under 480px | Paper width `92vw`, padding `24px`, paper text `18px`, Burn button full width up to `280px` |
| 480px to 768px | Paper width `90vw` |
| Over 768px | Paper width `680px`, centered |

- When the on-screen keyboard opens on mobile, keep the Burn button visible by letting the paper height shrink rather than pushing the button off screen.
- Touch targets are at least `44px`.

## 11. Accessibility

- Text on paper (`#2A211C` on `#F2E8DC`) and button text meet WCAG AA contrast.
- All interactive elements have visible focus rings in `--color-glow`.
- The textarea has an `aria-label` ("Write what you want to let go of").
- When the burn finishes, announce "Your words have been burned" in an `aria-live` region.
- Respect `prefers-reduced-motion` as described above.
- The whole flow works with the keyboard: type, Tab to Burn, Enter to burn, Tab to Write again, Enter to restart.

## 12. CSS Variables (copy into `variables.css`)

```css
:root {
  /* Color */
  --color-bg: #14100E;
  --color-paper: #F2E8DC;
  --color-paper-edge: #E4D6C4;
  --color-ink: #2A211C;
  --color-ink-muted: #8A7B6E;
  --color-text: #F2E8DC;
  --color-text-muted: #9A8B7E;
  --color-border: #3A2E28;
  --color-ember: #FF6B2C;
  --color-flame: #FFA040;
  --color-glow: #FFD27A;
  --color-char: #1A0F0A;
  --color-ash: #6B6560;

  /* Typography */
  --font-paper: 'Lora', Georgia, serif;
  --font-ui: 'Inter', system-ui, sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Shape and depth */
  --radius-paper: 4px;
  --radius-pill: 999px;
  --shadow-paper: 0 20px 60px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.4);
  --glow-ambient: 0 0 120px rgba(255, 107, 44, 0.06);

  /* Motion */
  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 600ms;
  --duration-burn: 5500ms;
}
```

## 13. Component Inventory

Matches the folder structure for the project.

| Component | Section above | File |
| --- | --- | --- |
| Paper (text area) | 7.1 | `WritingArea.jsx` |
| Burn button | 7.2 | `BurnButton.jsx` |
| Burn effect (animation) | 8 | `BurnEffect.jsx` |
| Write again button | 7.3 | `AfterBurn.jsx` |
| Mute toggle | 7.4 | `Header.jsx` |
| Footer text | 7.5 | `Footer.jsx` |

## 14. Do and Don't

**Do**

- Keep the screen empty except for the current state's one main element.
- Let the paper and fire carry all the visual interest.
- Give the user a quiet pause after the burn.

**Don't**

- Add extra buttons, menus, or settings to the main screen.
- Use bright colors other than the fire palette.
- Show counters, progress bars, or success messages that explain the burn.
