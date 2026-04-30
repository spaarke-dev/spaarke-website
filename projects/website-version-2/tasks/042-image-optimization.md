# Task 042: Image optimization (WebP/AVIF)

**Phase:** 4 — Polish
**Status:** not-started (stub — to be expanded when Phase 4 begins)
**Estimated:** 2 hours
**Dependencies:** 025
**Tags:** performance, images, build

## Context

Convert hero glow, hero screenshot, and module screenshots to WebP/AVIF for size savings. Use Next.js `<Image>` for all of them so the build pipeline handles responsive sources, lazy loading, and modern formats.

Audit current PNG sizes (per handoff "150-500KB each at 2× density") — target 60-80% reduction with AVIF.

If any image needs to remain PNG (e.g., logos with sharp edges, the SVG logos already), leave it.

Verify hero LCP improves on a Lighthouse run before/after.

## Acceptance (will expand when Phase 4 begins)

- [ ] Hero screenshot uses Next.js `<Image>` with appropriate `priority` and `sizes`
- [ ] Module screenshots lazy-loaded
- [ ] Hero glow optimized (still PNG OK if AVIF causes artifacts in the gradient)
- [ ] LCP < 2.5s on home (mobile, throttled)
