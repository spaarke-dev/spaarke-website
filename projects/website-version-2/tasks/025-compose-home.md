# Task 025: Compose home page at `/`

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 1 hour
**Dependencies:** 020, 021, 022, 023, 024
**Tags:** home, composition

## Context

Replace the body of [src/app/page.tsx](../../../src/app/page.tsx) with the v2 home page composition: Hero → GapStats → ModuleGrid → PlatformDiagram → Closing. (NotificationBar, SiteHeader, Footer come from root layout.)

Update SEO metadata to match v2 brand vocabulary — title, description, OG image (use the new hero screenshot or a derived OG card).

Verify `<Container>` and other v1-only home components are removed from imports.

## Acceptance (will expand when Phase 2 begins)

- [ ] Home page renders all five v2 sections in order
- [ ] No v1 imports remain in `page.tsx`
- [ ] Metadata updated with v2 copy
- [ ] OG image works in Twitter/LinkedIn preview tools
