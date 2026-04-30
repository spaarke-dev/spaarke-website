# Task 040: Mobile breakpoint audit + fixes

**Phase:** 4 — Polish
**Status:** not-started (stub — to be expanded when Phase 4 begins)
**Estimated:** 4 hours
**Dependencies:** 025, 031, 032, 033, 034, 035, 036
**Tags:** mobile, responsive, qa

## Context

Each section task in Phases 2 and 3 builds in mobile basics. This task is the cross-section polish pass — find inconsistencies, fix tap targets, verify scroll-bound interactions work on touch.

Audit at three widths: 375px (iPhone SE), 414px (iPhone 14 Pro Max), 768px (iPad portrait). Verify ≤960 / ≤640 stacking matches handoff guidance.

Test on real iOS Safari and Android Chrome via SWA preview URL (BrowserStack or actual devices) — emulators miss things.

## Acceptance (will expand when Phase 4 begins)

- [ ] No horizontal scroll on any page at 375px
- [ ] All tap targets ≥44px square
- [ ] Hamburger menu works on touch
- [ ] Notification bar dismiss works on touch
- [ ] ModuleGrid parallax disabled on touch (or smooth)
- [ ] Hero glow strip readable at 375px
