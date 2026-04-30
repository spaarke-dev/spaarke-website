# Handoff: Spaarke Website v2 (Home Page)

## Overview
This is the v2 redesign of the Spaarke marketing home page. It is a single long-scroll page that introduces Spaarke as a "legal IQ layer" / Legal Operations Intelligence platform built on Microsoft 365. The design alternates dark and light slabs, leans on large display type, and uses a single hero "spotlight" treatment that is mirrored at the closing CTA.

## About the Design Files
The files in `design/` are **design references created in HTML + inline-Babel React** — prototypes showing intended look and behavior, **not production code to copy directly**.

The task is to **recreate these designs in the target codebase's existing environment** (e.g., Next.js + Tailwind, Astro, plain Vite/React, etc.) using its established conventions. If the project has no front-end yet, choose a modern, statically-renderable stack (Next.js + Tailwind is a reasonable default for a marketing site) and implement there.

The inline-Babel-in-the-browser pattern in `design/index.html` is a prototyping convenience — production should use a real build pipeline, real component files, and proper bundling/optimization (image optimization, font subsetting, code-splitting if applicable).

## Fidelity
**High-fidelity (hifi).** All colors, typography, spacing, interactions, and copy are final. The developer should reproduce the visual result pixel-for-pixel. Minor liberties for responsive behavior at breakpoints not represented are fine — see "Responsive behavior" below.

## How to view the prototype
Open `design/index.html` in a browser served from the `design_handoff_spaarke_website_v2/` root (because of the `../brand/...` asset paths). A simple way:
```
cd design_handoff_spaarke_website_v2
python3 -m http.server 8000
# open http://localhost:8000/design/
```

---

## Page structure (top to bottom)

The full render order, defined in `design/index.html`'s `<App>`:

1. **NotificationBarV2** — dismissible top strip
2. **SiteHeaderV2** — sticky site nav
3. **HeroV2** — hero with spotlight glow
4. **GapStatsV2** — "Demand is rising. Visibility isn't." 4-stat grid
5. **ModuleGridV2** — alternating-row product modules + "Works how you work" substrate
6. **PlatformDiagramV2** — "Introducing Legal Operations Intelligence" diagram
7. **ClosingV2** — final CTA spotlight
8. **FooterV2**

Note: `AISectionV2.jsx`, `BothSidesV2.jsx`, `InsightsV2.jsx`, and `PillarsV2.jsx` exist as legacy components in the prototype's `<script>` tags but are **not rendered** in the App composition and should be ignored for production.

---

## Design tokens

All tokens live in `design/v2.css` (`:root` block) plus the brand foundation in `brand/colors_and_type.css`. Lift these directly into the production design system / Tailwind config.

### Colors
| Token | Value | Use |
|---|---|---|
| `--v2-bg` | `#000000` | Page background (dark) |
| `--v2-surface` | `#0a0a0a` | Elevated surface (dark) |
| `--v2-surface-2` | `#141414` | Card / pill (dark) |
| `--v2-fg` | `#ffffff` | Primary text on dark |
| `--v2-fg-mid` | `rgba(255,255,255,0.62)` | Secondary text on dark |
| `--v2-fg-low` | `rgba(255,255,255,0.42)` | Tertiary / captions on dark |
| `--v2-line` | `rgba(255,255,255,0.10)` | Hairline borders on dark |
| `--v2-line-2` | `rgba(255,255,255,0.18)` | Stronger borders on dark |
| `--v2-accent` | `#000BFF` | Brand blue (Spaarke) |
| Light slab `bg` | `#f6f6f4` | Section bg in ModuleGridV2 |
| Light slab `surface` | `#ffffff` | Card on light |
| Light slab `fg` | `#0a0a0a` | Primary text on light |
| Light slab `fgMid` | `rgba(10,10,10,0.62)` | Secondary text on light |
| Light slab `fgLow` | `rgba(10,10,10,0.42)` | Tertiary on light |
| Light slab `line` | `rgba(10,10,10,0.10)` | Hairlines on light |

### Typography
| Token | Stack | Use |
|---|---|---|
| `--v2-display` | `'Manrope', 'Source Sans 3', system-ui, sans-serif` | All headings + display copy |
| `--v2-body` | `'Source Sans 3', system-ui, sans-serif` | Body |
| `--v2-mono` | `ui-monospace, 'JetBrains Mono', Menlo, monospace` | Eyebrows, captions, source attributions |

Manrope is the primary brand face. Use the variable font from `brand/fonts/Manrope-VariableFont_wght.ttf` (or load Manrope from Google Fonts in production with weights 400, 500, 600, 700). Source Sans 3 is loaded via Google Fonts in `brand/colors_and_type.css` (weights 300/400/500/600/700, italic + non-italic).

### Type scale (literal clamps used in the prototype — copy these)
| Class | Properties |
|---|---|
| `.v2-h1` | `font-weight: 500; font-size: clamp(48px, 7.5vw, 104px); line-height: 0.98; letter-spacing: -0.04em` |
| `.v2-h2` | `font-weight: 500; font-size: clamp(34px, 4.5vw, 64px); line-height: 1.04; letter-spacing: -0.03em` |
| `.v2-h3` | `font-weight: 500; font-size: clamp(22px, 2vw, 28px); line-height: 1.2; letter-spacing: -0.015em` |
| `.v2-eyebrow` | `font-family: var(--v2-mono); font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase` |
| `.v2-lede` | `font-size: clamp(18px, 1.4vw, 22px); line-height: 1.5; color: var(--v2-fg-mid)` |

### Spacing
The prototype uses inline `clamp()` for fluid spacing rather than a fixed step scale. Vertical section padding is typically `clamp(80px, 12vh, 160px)` top+bottom; section title-to-content gap is typically `clamp(40px, 5vh, 64px)`. Reproduce these clamps verbatim or translate to Tailwind arbitrary values (`py-[clamp(80px,12vh,160px)]`).

### Container / "shell"
`.v2-shell` = `max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 40px)`. Every section's content lives inside this shell unless a section explicitly breaks full-bleed (Hero glow does — see HeroV2 implementation).

### Buttons
- `.v2-btn` — base: pill, `padding: 14px 22px`, `font-weight: 600`, `font-size: 15px`, `letter-spacing: -0.01em`, transition `transform 200ms` (slight scale on hover)
- `.v2-btn-primary` — white background, black text
- `.v2-btn-secondary` — transparent, hairline border (`var(--v2-line-2)`), white text
- `.v2-btn-text` — text-only with arrow; on hover the `.arrow` translates 4px right (CSS in `v2.css`)

### Border radius
Cards and pills use **20–24px** for large surfaces (the platform pill, screenshot frames). Buttons use **999px** (full pill). Substrate logo tiles use **12–14px**.

### Shadows
- Light cards (substrate logo tiles, light-section cards): `0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)`
- Dark screenshot frames: `0 30px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)`
- Platform pill (dark section): inset hairline + `0 40px 80px rgba(0,0,0,0.5)`

---

## Section-by-section spec

### 1. NotificationBarV2
Dismissible thin strip across the top with a short marketing line and an "✕" close. Disappears once dismissed (state lifted into `<App>`). Background `var(--v2-surface-2)`, hairline bottom border, 12–14px text, dim color.

### 2. SiteHeaderV2
- Sticky (`position: sticky; top: 0`), `z-index: 50`, dark background with a hairline bottom border, slight backdrop-blur is OK
- **Left group** (gap 32–40px): Spaarke white wordmark logo (38px height, `brand/assets/logos/spaarke-logo-white.svg`) + nav links: **Platform · Why Spaarke · Insights**
- **Right group** (gap 24–32px): **Sign in** (text link) + **Contact us** (text link)
- Links: `var(--v2-display)`, 15px, 500, slight color shift on hover (mid → fg)

### 3. HeroV2
Hero with the signature Linear-style spotlight glow.

- Section is dark (`var(--v2-bg)`), padding-top ~10vh, padding-bottom 0 (the screenshot strip handles its own bottom space)
- **Eyebrow** ("Built for in-house, outside counsel, and the business they serve.") — `var(--v2-mono)` 12px uppercase, color `var(--v2-fg-low)`
- **H1**: "See all sides of every matter." — applied with a controlled break: `See all sides of<br/>every&nbsp;matter.` so "every matter." stays on line 2 and never splits
- **Lede**: short paragraph, `.v2-lede` styling
- **CTAs** (gap 12px): primary "Get access" + text "Read why →"
- **Hero image strip — full bleed** — breaks out of `.v2-shell` via `marginLeft: calc(50% - 50vw); width: 100vw; overflow: hidden`. Inside:
  - **Glow background**: `brand/assets/hero/hero-glow-bg.png` positioned center, `background-size: 200% 180%`, `mix-blend-mode: screen`, `opacity: 1.4`. This is the Linear-style horizontal-ellipse glow.
  - **Screenshot**: `brand/assets/hero/hero-workspace-dark-v2.png` centered above the glow with a soft drop shadow.
  - **Hard hairline at the bottom of the strip**: `border-bottom: 1px solid var(--v2-line)`. This creates a clean horizontal cut between glow zone and what follows.

### 4. GapStatsV2
"Demand is rising. Visibility isn't." section.
- Dark, `.v2-shell`, top hairline border, `padding-top: clamp(48px, 6vh, 80px)`, `padding-bottom: clamp(80px, 12vh, 160px)`
- Two-column grid `1fr / 1.6fr`, `gap: clamp(48px, 6vw, 96px)`:
  - **Left**: H2 "Demand is rising. / Visibility isn't." (the ' is a real `&rsquo;`); under it a paragraph (`var(--v2-display)`, 20px, weight 400, line-height 1.6, max 32ch) explaining the gap.
  - **Right**: 2×2 stat grid, row-gap `clamp(40px, 5vw, 64px)`, col-gap `clamp(32px, 4vw, 56px)`. Each cell:
    - Big number: `var(--v2-display)`, weight 500, `clamp(40px, 4.4vw, 60px)`, `line-height: 1.0`, `letter-spacing: -0.025em`
    - Label (15–17px, weight 500)
    - Detail line (`var(--v2-fg-mid)`, 14px, line-height 1.45)
    - Source attribution: `var(--v2-mono)`, 11px, italic, uppercase letter-spacing `0.04em`, color `var(--v2-fg-low)`
  - The four cells in order: **77%** (top-left, Axiom 2026 Global In-House Legal Study), **60%** (top-right, LegalBillReview / In-House Connect 2025), **79%** (bottom-left, same source), **1 in 5** (bottom-right, Axiom 2025 Legal AI Report). Exact copy is in `GapStatsV2.jsx`.

### 5. ModuleGridV2
Light slab. Two parts:

**Part A — Alternating product rows (5 modules)**
- Section background `#f6f6f4`, no titles/lede above (intentionally minimal — opens directly with the first row)
- Each row is a 2-column grid, `1fr / 1fr`, alternating image-left / image-right
- **Text column**:
  - Module name as H2-scale heading (clamp ~32–48px)
  - Body paragraph, 17px, line-height 1.6, max 38ch
  - "KEY FEATURES" eyebrow (`var(--v2-mono)`, 11px uppercase, color `LIGHT.fgLow`)
  - Bullet list — bullets are 5px filled circles, gap 12px, body copy in `var(--v2-body)` 15px weight 500
- **Image column**: dark frame around the screenshot — `background: #0a0a0a`, `padding: 14px`, `border-radius: 12px`, hairline border `var(--v2-line)`, layered drop shadow, subtle blue accent halo behind it (`radial-gradient(rgba(70,90,255,0.18), transparent)`)
- Subtle vertical-parallax effect on the screenshots: as the row scrolls through the viewport, the inner `<img>` translates by `(progress - 0.5) * 48px`. See the IntersectionObserver/scroll-handler implementation in `ModuleGridV2.jsx`. In production, prefer `requestAnimationFrame` + `getBoundingClientRect` (as written) or rebuild with `react-intersection-observer`.

The five modules in order:
1. **Operations** — `brand/assets/modules/workspace-v2.png`
2. **Documents & Knowledge** — `brand/assets/modules/document-intelligence.png`
3. **Collaboration** — `brand/assets/modules/outside-counsel.png`
4. **Agents & Automation** — `brand/assets/modules/ai-workflows.png`
5. **Spend & Performance** — `brand/assets/modules/performance-intelligence.png`

Exact copy (header, body, bullets) is in `ModuleGridV2.jsx`. Use it verbatim.

**Part B — "Works how you work" substrate**
Below the module rows, on the same light slab:
- Eyebrow "WORKS HOW YOU WORK"
- Heading "Microsoft, end-to-end."
- Description: "Spaarke runs natively on the Microsoft tools your team already uses, inside the security perimeter your IT team already approved."
- Six logo tiles in a row (52px white rounded squares, hairline border, soft shadow, 32px logo centered). Order: **Power Platform · SharePoint · Microsoft 365 · Teams · M365 Copilot · Azure AI Foundry**. Logos in `brand/assets/substrate/`.
- Three pillar paragraphs ("PILLARS" array in the source) with title + body + tail.

### 6. PlatformDiagramV2
Black slab (no fade transition). Diagram showing Spaarke ↔ M365 Copilot integration.
- Centered heading "Introducing / Legal Operations Intelligence" (where `Legal Operations Intelligence` is forced to one line via `white-space: nowrap`)
- Lede paragraph below, capped at 60ch, centered
- Three-column grid `1.45fr / 0.55fr / 0.7fr`:
  - **Left**: a "platform pill" (24px radius dark surface) with a flush app-chrome bar at the top (9-dot launcher · "spaarke" wordmark · "Corporate Counsel" workspace label · profile dot · hairline divider). Below the chrome, an icon grid for the platform's modules.
  - **Middle**: animated arrow / connector
  - **Right**: M365 Copilot badge (`brand/assets/substrate/copilot-badge.svg`, sized to ~59% of column width, sits on a soft accent bloom)
- Description below: "Spaarke is the legal IQ layer that makes Copilot, your AI agents, and your existing systems fluent in legal work. Decisions, workflows, performance, partnership — not just drafting."

### 7. ClosingV2
Final CTA. Mirrors the hero's spotlight treatment, glow rising from below.
- Dark, full-bleed glow background (`brand/assets/hero/hero-glow-bg.png` flipped via `transform: scaleY(-1)`, anchored to bottom)
- H1 "See all sides of every matter." — `white-space: nowrap`, single line
- Lede "Now accepting early access partners."
- CTAs: primary "Get access" + text "Read why →"

### 8. FooterV2
Dark, hairline top border. Spaarke icon + columns of links + small legal line. See `FooterV2.jsx` for exact column groupings and copy.

---

## Interactions & behavior

- **Notification bar dismissal** — local component state (or a small UI store); persistence with `localStorage` is a nice-to-have but not required.
- **Sticky header** — `position: sticky; top: 0`. No transform-on-scroll behavior.
- **Hero glow / Closing glow** — pure background image with `mix-blend-mode: screen`; no animation.
- **Module row parallax** — see ModuleGridV2 above. ~48px vertical travel as the row crosses the viewport. Use `prefers-reduced-motion` to disable for users who opt out.
- **Button hover** — slight scale via `transform: scale(1.02)`, transition `200ms`.
- **Text-button arrow** — `.arrow` translates 4px right on hover (CSS in `v2.css`).
- **Link hover** — color shifts from `var(--v2-fg-mid)` to `var(--v2-fg)` (or analogous on light).
- **No modals, no carousels, no tabs** in the current scope.

## State management
Effectively none. Only local UI state: notification bar visibility (`useState` in `<App>`). The page is otherwise static.

## Responsive behavior
The prototype is built for **desktop (1240px shell) and naturally degrades** through `clamp()` on type and spacing. There is no explicit mobile redesign in this iteration — at narrow widths content stacks but some side-by-side grids will need explicit `@media` rules to stack cleanly. Recommend the developer:
- At ≤960px, stack the two-column grids in **GapStatsV2** (heading above stats), **ModuleGridV2** (image stacks above text), and **PlatformDiagramV2** (Spaarke pill above arrow above Copilot badge)
- At ≤640px, reduce shell padding to `20px`, drop H1 clamp min to `40px`, drop H2 clamp min to `28px`
- The hero full-bleed glow strip should keep its 100vw treatment at all widths

Treat these as starting recommendations; check final mobile behavior with the brand owner before shipping.

---

## Assets

All assets live in `brand/`. Production should:
- Move SVG logos into a versioned brand folder, served as static assets
- Optimize PNGs (the screenshots especially — currently ~150–500KB each at 2× density). Consider WebP/AVIF for the screenshots and the hero glow.
- Self-host Manrope (already provided as a variable TTF) or load via Google Fonts with `font-display: swap`.

### Inventory
- **Brand**:
  - `brand/colors_and_type.css` — foundation; imports Source Sans 3 from Google Fonts and declares the Manrope `@font-face`. Spaarke design tokens live here too.
  - `brand/fonts/Manrope-VariableFont_wght.ttf` — variable font, weights 200–800
- **Logos** (`brand/assets/logos/`):
  - `spaarke-logo-white.svg` — used in site header (full wordmark)
  - `spaarke-logo-black.svg`, `spaarke-logo-color.svg`, `spaarke-logo-icon-color.svg`, etc.
  - `spaarke-icon.svg` — square icon (used in footer)
- **Hero** (`brand/assets/hero/`):
  - `hero-glow-bg.png` — the Linear-style horizontal glow ellipse (used in Hero and Closing)
  - `hero-workspace-dark-v2.png` — current hero screenshot
- **Modules** (`brand/assets/modules/`):
  - `workspace-v2.png`, `document-intelligence.png`, `outside-counsel.png`, `ai-workflows.png`, `performance-intelligence.png`
- **Substrate** (`brand/assets/substrate/`):
  - `power-platform.svg`, `sharepoint.png`, `m365-apps.png`, `teams.png`, `copilot.svg`, `azure.png`
  - `copilot-badge.svg` — used in PlatformDiagramV2

---

## Files in this handoff

```
design_handoff_spaarke_website_v2/
├── README.md                  ← this file
├── design/                    ← prototype source (HTML + JSX)
│   ├── index.html             ← page composition
│   ├── v2.css                 ← global tokens + utility classes
│   ├── NotificationBarV2.jsx
│   ├── SiteHeaderV2.jsx
│   ├── HeroV2.jsx
│   ├── GapStatsV2.jsx
│   ├── ModuleGridV2.jsx
│   ├── PlatformDiagramV2.jsx
│   ├── ClosingV2.jsx
│   └── FooterV2.jsx
└── brand/                     ← brand foundation + assets
    ├── colors_and_type.css
    ├── fonts/
    │   └── Manrope-VariableFont_wght.ttf
    └── assets/
        ├── logos/
        ├── hero/
        ├── modules/
        └── substrate/
```

## Implementation suggestions

1. **Token translation**: lift `v2.css` `:root` variables into your design system (Tailwind theme, CSS variables, or CSS-in-JS theme object). Don't reinvent values.
2. **Typography**: register Manrope as the display face, Source Sans 3 as body. Use `font-display: swap`.
3. **Section components**: build one component per section. Treat each `.jsx` here as a near-1:1 spec for its production counterpart.
4. **Image optimization**: run all PNGs through your build's image pipeline. The hero glow especially benefits from precise sizing — keep the source PNG as-is and only resize via CSS.
5. **Copy fidelity**: use the strings exactly as they appear in the JSX. There are em-dashes (`—`) and `&rsquo;` apostrophes that should not be normalized.
6. **Accessibility**: the prototype is light on a11y. Production should add proper landmark roles, focus-visible styles, alt text for all images, and respect `prefers-reduced-motion` for the parallax.
