# Spaarke Marketing Website (v2) — Implementation Plan

> **Status**: Not Started
> **Created**: 2026-04-30

## Phase Breakdown

### Phase 0: Foundations
**Goal**: Design system primitives in place — branch, tokens, fonts, brand assets, shared utility classes.

**Deliverables**:
- `v2` feature branch created and tracking origin
- v2 CSS tokens added to `src/app/globals.css` (colors, type stack, container, buttons)
- Manrope variable font self-hosted; Source Sans 3 loaded via Google Fonts
- Brand assets migrated to `public/brand/`
- Shared primitives: `Shell` (1240px container), `Button` (primary/secondary/text variants), `Eyebrow` mono caption

**Milestone**: Build runs clean on the `v2` branch with v2 tokens loaded; primitives render in isolation.

---

### Phase 1: Global Components
**Goal**: Replace site-wide chrome — notification bar, header, footer.

**Deliverables**:
- `NotificationBar` (dismissible, localStorage persistence, hairline bottom border)
- `SiteHeader` (sticky, dark, left group: logo + Platform/Why Spaarke/Insights; right group: Sign in + Contact us)
- `Footer` (dark, hairline top, columns of links + small legal line)
- Wired into `src/app/layout.tsx`; mobile menu present

**Milestone**: Header + footer render correctly across all pages on the branch.

**Dependencies**: Phase 0 complete.

---

### Phase 2: Home Page Sections
**Goal**: New home page composed of all eight v2 sections (one is the header, one is the footer — six content sections).

**Deliverables**:
- `Hero` with full-bleed glow strip and screenshot frame
- `GapStats` two-column "Demand is rising. Visibility isn't." section
- `ModuleGrid` five-row alternating modules + "Works how you work" substrate
- `PlatformDiagram` Spaarke ↔ Copilot diagram
- `Closing` mirrored-spotlight final CTA
- Home page composed at `src/app/page.tsx`
- Hero screenshot prepared from `resources/screenshots/spaarke-screenshot-darkmode.png` (cleanup per handoff §"Product screenshot specs")

**Milestone**: Home page renders pixel-close to the prototype on desktop and stacks cleanly on mobile.

**Dependencies**: Phase 1 complete.

---

### Phase 3: Reskin Existing Pages
**Goal**: All non-home pages aligned with v2 type, slabs, shell, and components.

**Deliverables**:
- Page template pattern (shared layout primitives for content pages)
- `/blog` → `/insights` rename + redirect rule
- Insights index reskin
- Insights post reskin
- `/contact`, `/access-request` reskin (forms get v2 input/button styling)
- `/privacy`, `/terms`, `/signin` reskin
- v2-styled `/platform` stub
- v2-styled `/why-spaarke` stub

**Milestone**: All routes render in v2 visual system.

**Dependencies**: Phase 1 complete (header/footer); Phase 2 not strictly required but useful for shared primitive maturity.

---

### Phase 4: Polish
**Goal**: Production-ready quality — mobile, a11y, performance.

**Deliverables**:
- Mobile breakpoint audit across all pages and sections (≤960, ≤640)
- A11y audit: focus-visible styles, landmark roles, alt text, `prefers-reduced-motion` honored
- Image optimization: WebP/AVIF for screenshots and hero glow
- Lighthouse pass (target: ≥90 across performance, a11y, best practices, SEO on home and a content page)

**Milestone**: Lighthouse targets met; manual mobile + keyboard pass clean.

**Dependencies**: Phases 0–3 complete.

---

### Phase 5: Cutover
**Goal**: Merge `v2` to `main` and verify live.

**Deliverables**:
- Final preview QA on SWA preview URL
- PR description with section-level review checklist
- Merge to `main`
- Live smoke test across all routes
- v1 components removed from `main` (already replaced on branch)

**Milestone**: Production site is v2; rollback path documented.

**Dependencies**: All prior phases complete and reviewed.
