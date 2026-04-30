# Task 011: SiteHeader (sticky, dark, left/right groups)

**Phase:** 1 — Global Components
**Status:** not-started (stub — to be expanded when Phase 1 begins)
**Estimated:** 2 hours
**Dependencies:** 005, 006
**Tags:** component, global, ui, navigation

## Context

Replace `src/components/SiteHeader.tsx` with the v2 version. Sticky dark header with hairline bottom border.

**Layout (per mockup `home_01.jpg` and v1.4 brief):**
- **Left group**: spaarke white wordmark logo + nav links **Platform · Why Spaarke · Insights**
- **Right group**: **Contact us · Sign in** (text links only — Get access lives in the notification banner, hero CTA, closing CTA, and footer panel)
- Mobile: hamburger menu ≤640px

**Source nav data** from `src/content/nav.ts` (created in Task 006).

**Insights URL** points to `/insights` (renamed from `/blog` in Task 031).

## Acceptance (will expand when Phase 1 begins)

- [ ] Sticky dark header with hairline bottom border
- [ ] Logo links home (full logo, no scroll-based crossfade)
- [ ] Nav data sourced from `src/content/nav.ts`
- [ ] Right side is **Contact us + Sign in** (text links, no Get access button)
- [ ] Mobile hamburger menu works
- [ ] Focus-visible states on all interactive elements
- [ ] No console errors on any route
