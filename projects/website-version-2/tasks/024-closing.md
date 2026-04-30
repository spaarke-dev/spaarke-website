# Task 024: Section 6 — Closing CTA

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 1.5 hours
**Dependencies:** 013, 006
**Tags:** component, home

## Context

Build per [mockup `home_05.jpg`](../v2%20mockup%20screenshots/home_05.jpg). The page exhales — generous whitespace, single-line headline, light copy.

**Layout:**
- Dark slab (`<Slab tone="dark">`)
- Subtle radial vignette behind the type for ambient depth (CSS radial gradient, no animation)
- Centered content

**Copy** (from `src/content/home/closing.ts`):
- **Headline** (single line, large, centered): "See all sides of every matter." — `white-space: nowrap` on desktop; will wrap naturally on mobile
- **Sub** (centered, text-mid color): "Now accepting early access partners."
- **CTAs** (centered, side-by-side):
  - Primary: "Get access" (`<Button variant="primary" href="/access-request">`)
  - Secondary: "Why Spaarke →" (`<Button variant="text" href="/why-spaarke" arrow>`)

**Mobile (≤640):**
- Headline wraps if needed (drop `nowrap`)
- CTAs stack vertically

## Acceptance (will expand when Phase 2 begins)

- [ ] Subtle radial vignette renders behind type (no animation)
- [ ] Headline stays one line at desktop
- [ ] CTAs render in correct order with correct variants
- [ ] "Why Spaarke →" arrow translates on hover (motion-safe)
- [ ] Mobile renders cleanly
- [ ] Content sourced from `src/content/home/closing.ts`
