# Current Task

## Quick Recovery
| Field | Value |
|-------|-------|
| **Task** | 006 |
| **Step** | 0 (not started) |
| **Status** | Ready to start |
| **Next Action** | Extract content to typed modules at `src/content/` |

## Details
- **Task File:** tasks/006-extract-content-modules.md
- **Phase:** 0 — Foundations
- **Started:** —

## Completed Tasks

- **001 Create `v2` feature branch** (2026-04-30) — branch + draft PR + SWA preview build verified ✓
- **002 Add semantic design tokens** (2026-04-30) — v2 tokens in `@theme inline`; light slab via `[data-tone="light"]`; sanity page at `/v2-tokens-check` ✓
- **003 Load fonts** (2026-04-30) — Inter Tight + Inter + JetBrains Mono via `next/font/google`; CSS variables wired ✓
- **004 Migrate brand assets** (2026-04-30) — `public/brand/` populated with Microsoft logos, Spaarke wordmarks, capability icons, hero screenshot ✓
- **005 Build component primitives** (2026-04-30) — `Heading`, `Lede`, `Eyebrow`, `Shell`, `Slab`, `Button` at `src/components/primitives/`; Server Components, focus-visible, motion-safe ✓

## Decisions Made

### Strategy
- **Branch strategy**: feature branch `v2`, atomic merge cutover, revert as rollback
- **No V2 filename suffix**: replace v1 components in place on the branch (clean code, no parallel V1/V2 maintenance)
- **Asset path**: `public/brand/` for v2-era assets (separate from v1 `public/images/`)
- **Mobile**: baked into every section task, not deferred to a polish phase

### Foundation
- **Tokens**: semantic naming (no `--v2-` prefix); live in `globals.css` under `@theme inline` so Tailwind exposes them as utility classes
- **Fonts**: Inter Tight (display) + Inter (body) + JetBrains Mono via `next/font/google` — self-hosted at build time, no Google Fonts `@import`
- **Primitives**: typed React components (`<Heading>`, `<Lede>`, `<Eyebrow>`, `<Shell>`, `<Slab>`, `<Button>`) at `src/components/primitives/`
- **Content layer**: copy in typed modules at `src/content/`, separated from presentation

### Visual / copy decisions (from v1.4 brief + mockup review)
- **Hero subhead**: "The shared platform for legal departments, business stakeholders, and outside counsel." (overrides "system of record" framing)
- **Hero CTAs**: secondary "Watch demo" (outline, opens modal) left; primary "Get access" right
- **Hero screenshot source**: `resources/screenshots/spaarke-screenshot-darkmode.png`
- **Site nav right side**: Contact us + Sign in (text links). Get access lives in notification banner, hero, closing CTA, and footer panel.
- **Section 2 stats**: use mockup version (77% / 60% / 79% / 1 in 5)
- **Section 3 Pillars**: build from v1.4 brief copy + home_03-1 mockup; light slab between dark Sections 2 and 4
- **Section 4 capability bullets**: use mockup's tight 3-bullet wording (e.g. "Daily briefing / Smart to-dos / Performance tracking"); brief's longer prose lives on the Platform page
- **Section 4 transitional line**: skip ("Built on Microsoft, designed for legal..." not in mockup)
- **Section 4 CTA**: skip ("Explore the full platform →" — not in mockup)
- **Section 4 Microsoft foundation**: seven logos (Power Platform, SharePoint, M365 Apps, Outlook, Teams, M365 Copilot, Azure AI Foundry) — both M365 Apps and Outlook included
- **Section 5 icons**: 8 icons in 2×4 grid — best-mapped from `resources/icons/` (judgment call)
- **Section 6 closing secondary**: "Why Spaarke →" (links to `/why-spaarke`)
- **Insights URL**: rename `/blog` → `/insights` with redirect

### Routing additions
- **Watch demo**: modal/popup overlay (not a separate route) hosting a placeholder video; opens from hero "Watch demo" CTA

## Open follow-ups (not blockers)
- Microsoft logos at `resources/logos/` ✓ (in place: 7 logos)
- Section 5 icons at `resources/icons/` ✓ (17 SVGs available; will pick 8)
- Capability screenshots: 5 of 5 candidates available in `resources/screenshots/`
- Demo video: placeholder until production video ready

## Notes

Project kicks off 2026-04-30. Source of truth for copy/positioning = [creative brief v1.4](spaarke-home-page-creative-brief-v1.4.md). Source of truth for visual treatment = [mockup screenshots](v2%20mockup%20screenshots/).
