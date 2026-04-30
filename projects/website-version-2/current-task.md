# Current Task

## Quick Recovery
| Field | Value |
|-------|-------|
| **Task** | 030 |
| **Step** | 0 (not started) |
| **Status** | Ready to start (Phase 2 complete) |
| **Next Action** | Build page template pattern for content pages |

## Details
- **Task File:** tasks/030-page-template-pattern.md
- **Phase:** 3 — Reskin Existing Pages
- **Started:** —

## Completed Tasks

**Phase 0 — Foundations (complete)**
- **001 Create `v2` feature branch** (2026-04-30) — branch + draft PR + SWA preview build verified ✓
- **002 Add semantic design tokens** (2026-04-30) — v2 tokens in `@theme inline`; light slab via `[data-tone="light"]`; sanity page at `/v2-tokens-check` ✓
- **003 Load fonts** (2026-04-30) — Inter Tight + Inter + JetBrains Mono via `next/font/google`; CSS variables wired ✓
- **004 Migrate brand assets** (2026-04-30) — `public/brand/` populated with Microsoft logos, Spaarke wordmarks, capability icons, hero screenshot ✓
- **005 Build component primitives** (2026-04-30) — `Heading`, `Lede`, `Eyebrow`, `Shell`, `Slab`, `Button` at `src/components/primitives/`; Server Components, focus-visible, motion-safe ✓
- **006 Extract content to typed modules** (2026-04-30) — `src/content/` with nav, notification-bar, hero, gap, pillars, capabilities, loi-diagram, closing, footer; tuple types enforce structure ✓

**Phase 1 — Global Components (complete)**
- **010 NotificationBar** (2026-04-30) — dismissible, localStorage persistence, hairline bottom border, focus-visible dismiss ✓
- **011 SiteHeader** (2026-04-30) — sticky dark header, left: spaarke logo + Platform/Why Spaarke/Insights; right: Contact us + Sign in; mobile hamburger; replaces v1 SiteHeader in place ✓
- **012 SiteFooter** (2026-04-30) — dark footer with 3 columns + Get access CTA panel + bottom strip with LinkedIn ✓
- **013 Wire into root layout** (2026-04-30) — NotificationBar + SiteHeader (replaced v1) + main + SiteFooter (replaced v1) ✓

**Phase 2 — Home Sections (8 of 10 done)**
- **020 Hero** (2026-04-30) — centered "See all sides of every matter." H1, subhead, CTAs (Watch demo opens modal, Get access → /access-request), full-width screenshot, trust strip ✓
- **021 GapStats** (2026-04-30) — top hairline, two-column heading+intro / 2×2 stat grid, mockup-version stats with mono italic source attributions ✓
- **022 Capabilities** (2026-04-30) — five capability rows in zigzag (Operations, Documents & Knowledge, Collaboration, Agents & Automation, Spend & Performance) with screenshots + KEY FEATURES bullets; Microsoft foundation card with 7 logo tiles ✓
- **023 LOI Diagram** (2026-04-30) — Spaarke container with chrome bar + 2×4 icon grid using CSS mask-image to render currentColor SVGs; gradient arrow connector; Copilot badge with multi-color radial glow + M365 tag ✓
- **024 Closing** (2026-04-30) — dark slab with subtle radial vignette, single-line headline, "Why Spaarke →" text CTA ✓
- **025 Compose home** (2026-04-30) — `src/app/page.tsx` renders Hero → Gap → Pillars → Capabilities → LOI → Closing in order ✓
- **026 Hero screenshot prep** (2026-04-30) — asset already at `public/brand/hero/hero-workspace-dark.png` ✓
- **027 Pillars** (2026-04-30) — light slab with umbrella heading + 3 rounded cards with thin dividers between operational claim and callback ✓
- **028 Capability screenshots prep** (2026-04-30) — 5 PNGs copied to `public/brand/capabilities/` ✓
- **029 Watch demo modal** (2026-04-30) — backdrop click + Escape close, body scroll lock, focus restoration, placeholder "Demo coming soon" content ✓

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
