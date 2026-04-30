# Spaarke Marketing Website (v2) — Implementation Plan

> **Status**: In Progress (Phase 0)
> **Created**: 2026-04-30
> **Total tasks**: 35

## Phase Breakdown

### Phase 0: Foundations (6 tasks)
**Goal**: Design system primitives in place — branch, tokens, fonts, brand assets, primitives, content modules.

**Deliverables**:
- `v2` feature branch and draft PR ✓
- Semantic design tokens in `src/app/globals.css` under `@theme inline` (no `--v2-` prefix; Tailwind exposes them automatically)
- Inter Tight + Inter + JetBrains Mono via `next/font/google`
- Brand assets at `public/brand/` (logos, hero glow, capability screenshots, Microsoft logos, Section 5 icons)
- Component primitives: `<Heading>`, `<Lede>`, `<Eyebrow>`, `<Shell>`, `<Slab>`, `<Button>` (TypeScript-strict, focus-visible baked in)
- Typed content modules at `src/content/` (nav, home sections, footer)

**Milestone**: Build runs clean on `v2` branch with semantic tokens loaded; primitives render in isolation; content modules are typed and consumable.

---

### Phase 1: Global Components (4 tasks)
**Goal**: Replace site-wide chrome — notification bar, header, footer.

**Deliverables**:
- `NotificationBar` (dismissible, localStorage persistence, hairline bottom border)
- `SiteHeader` (sticky, dark, left: logo + Platform/Why Spaarke/Insights; right: Contact us + Sign in — Get access lives elsewhere)
- `Footer` (dark, hairline top, columns + Get access CTA panel + LinkedIn)
- Wired into `src/app/layout.tsx`; mobile menu present

**Milestone**: Header + footer render on every route on the branch.

**Dependencies**: Phase 0 complete.

---

### Phase 2: Home Page Sections (10 tasks)
**Goal**: New home page with six sections plus the demo modal and asset preparation.

**Deliverables**:
- **Section 1 Hero**: dark slab, centered "See all sides of / every matter." (line break after "of"), subhead "The shared platform for legal departments, business stakeholders, and outside counsel.", CTAs "Watch demo" (outline, opens modal) + "Get access" (primary), full-width product screenshot, no full-bleed glow
- **Section 2 Gap**: dark slab, "Demand is rising. Visibility isn't." heading + paragraph (left), 2×2 stat grid (right) with mockup-version stats (77% / 60% / 79% / 1 in 5)
- **Section 3 Pillars** (NEW — was missing from handoff): light slab, "One platform. All sides. Every matter." heading, three rounded cards, typography-only with thin dividers between operational claim and callback line
- **Section 4 Capabilities + Microsoft foundation**: light slab, five capability rows in zigzag (Operations, Documents & Knowledge, Collaboration, Agents & Automation, Spend & Performance), each with name + body + "KEY FEATURES" + 3 bullets + screenshot frame; Microsoft foundation card with seven logo tiles (Power Platform, SharePoint, M365 Apps, Outlook, Teams, M365 Copilot, Azure AI Foundry)
- **Section 5 Legal Operations Intelligence diagram**: dark slab, "Introducing / Legal Operations Intelligence" heading, intro paragraph, diagram with Spaarke 2×4 icon grid container → arrow → M365 Copilot badge with radial glow
- **Section 6 Closing**: dark slab with subtle radial vignette, "See all sides of every matter." headline (single line), "Now accepting early access partners." sub, CTAs "Get access" + "Why Spaarke →"
- **Watch demo modal**: popup overlay triggered from hero CTA, hosts a video (placeholder until production video ready)
- **Hero screenshot prep**: place `resources/screenshots/spaarke-screenshot-darkmode.png` at `public/brand/hero/`
- **Capability screenshots prep**: map five mockup-aligned screenshots (corporate-workspace, document-record, external-access-site, ai-playbook-builder, matter-record) into `public/brand/capabilities/`
- **Compose home page** at `src/app/page.tsx` in render order: Hero → Gap → Pillars → Capabilities → LOI diagram → Closing

**Milestone**: Home page renders pixel-close to mockups on desktop and stacks cleanly on mobile.

**Dependencies**: Phase 1 complete.

---

### Phase 3: Reskin Existing Pages (8 tasks)
**Goal**: All non-home pages aligned with v2 type, slabs, and primitives.

**Deliverables**:
- Page template pattern (shared layout primitives for content pages)
- `/blog` → `/insights` rename + permanent redirect
- Insights index reskin
- Insights post reskin
- `/contact`, `/access-request` reskin (forms get v2 input/button styling)
- `/privacy`, `/terms`, `/signin` reskin
- v2-styled `/platform` stub (with anchor sections so footer links resolve)
- v2-styled `/why-spaarke` stub
- Root `error.tsx` and `not-found.tsx` styled with v2 system

**Milestone**: All routes render in v2 visual system; no 404s from internal links.

**Dependencies**: Phase 1 complete (header/footer); Phase 0 primitives.

---

### Phase 4: Polish (5 tasks)
**Goal**: Production-ready quality — mobile, a11y, performance, SEO.

**Deliverables**:
- Mobile breakpoint audit across all pages and sections (≤960, ≤640)
- A11y audit: focus-visible, landmark roles, alt text, `prefers-reduced-motion`, heading hierarchy (single H1 per page)
- Image optimization: WebP/AVIF for screenshots and hero glow
- Lighthouse pass (target ≥90 across all four scores on home and a content page)
- OpenGraph images + JSON-LD: per-page `opengraph-image.tsx`; Organization schema on home; Article schema on Insights posts

**Milestone**: Lighthouse targets met; manual mobile + keyboard pass clean; OG previews validate in Twitter/LinkedIn debuggers.

**Dependencies**: Phases 0–3 complete.

---

### Phase 5: Cutover (2 tasks)
**Goal**: Merge `v2` to `main` and verify live.

**Deliverables**:
- Final preview QA on SWA preview URL
- PR description with section-level review checklist
- Merge to `main` (merge commit, not squash, so revert is one operation)
- Live smoke test across all routes
- Documented rollback path

**Milestone**: Production site is v2; rollback path verified; old `/blog` paths redirect to `/insights`.

**Dependencies**: All prior phases complete and reviewed.
