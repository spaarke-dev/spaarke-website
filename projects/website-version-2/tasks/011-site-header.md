# Task 011: SiteHeader (sticky, dark, left/right groups)

**Phase:** 1 — Global Components
**Status:** not-started (stub — to be expanded when Phase 1 begins)
**Estimated:** 2 hours
**Dependencies:** 005
**Tags:** component, global, ui, navigation

## Context

Replace `src/components/SiteHeader.tsx` with the v2 version. Sticky dark header with hairline bottom border. Left group: spaarke white wordmark logo (38px) + nav links Platform · Why Spaarke · Insights. Right group: Sign in · Contact us.

Reference: [design_handoff/README.md §"SiteHeaderV2"](../design_handoff_spaarke_website_v2/README.md) and [design_handoff/design/SiteHeaderV2.jsx](../design_handoff_spaarke_website_v2/design/SiteHeaderV2.jsx).

Mobile menu pattern: convert to a hamburger ≤640px; hairline-styled drawer.

Note: Insights links to `/insights` (renamed from `/blog` in Task 031).

## Acceptance (will expand when Phase 1 begins)

- [ ] Renders sticky dark v2 header
- [ ] Logo links home
- [ ] Nav links present and styled
- [ ] Mobile hamburger works
- [ ] Focus states visible
- [ ] No scroll-based logo crossfade (single static logo)
