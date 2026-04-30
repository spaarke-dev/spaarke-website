# Task 020: Hero (full-bleed glow + screenshot)

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 4 hours
**Dependencies:** 013
**Tags:** component, home, hero

## Context

Build the v2 hero. Eyebrow, H1 ("See all sides of every matter."), lede, primary CTA "Get access" + text CTA "Read why →", full-bleed glow strip with screenshot frame, hard hairline at the bottom of the strip.

Reference: [design_handoff/README.md §"HeroV2"](../design_handoff_spaarke_website_v2/README.md) and [design_handoff/design/HeroV2.jsx](../design_handoff_spaarke_website_v2/design/HeroV2.jsx).

Screenshot source: `public/brand/hero/hero-workspace-dark.png` (placed in Task 004). Glow background: `public/brand/hero/hero-glow-bg.png`.

Mobile: keep the full-bleed glow strip at all widths; H1 clamps drop at ≤640.

## Acceptance (will expand when Phase 2 begins)

- [ ] Full-bleed glow strip via `marginLeft: calc(50% - 50vw); width: 100vw`
- [ ] Screenshot drop shadow correct
- [ ] Hard hairline bottom present
- [ ] CTAs link correctly (Get access → /access-request, Read why → /why-spaarke)
- [ ] Mobile renders cleanly at 640 / 960
