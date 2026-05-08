# Task 013: Wire global components into root layout

**Phase:** 1 — Global Components
**Status:** not-started (stub — to be expanded when Phase 1 begins)
**Estimated:** 30 minutes
**Dependencies:** 010, 011, 012
**Tags:** layout, integration

## Context

Update [src/app/layout.tsx](../../../src/app/layout.tsx) so NotificationBar (top), SiteHeader (sticky), and Footer (bottom) wrap all routes.

Verify on every existing route the global chrome renders correctly: `/`, `/blog`, `/why-spaarke/[slug]`, `/contact`, `/access-request`, `/privacy`, `/terms`, `/signin`, `/platform`, `/why-spaarke`.

After this task, every page on the `v2` branch is using v2 chrome even if the page body is still v1-styled — that's expected; Phase 3 reskins the page bodies.

## Acceptance (will expand when Phase 1 begins)

- [ ] All routes show v2 NotificationBar, SiteHeader, Footer
- [ ] No layout-shift regression
- [ ] Header height variable (`--header-h`) preserved for downstream consumers
