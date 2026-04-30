# Task 041: A11y + reduced-motion audit

**Phase:** 4 — Polish
**Status:** not-started (stub — to be expanded when Phase 4 begins)
**Estimated:** 2 hours
**Dependencies:** 025, 031, 032, 033, 034, 035, 036
**Tags:** a11y, accessibility, motion

## Context

Audit all v2 pages for keyboard navigation, screen reader landmarks, focus-visible states, alt text, color contrast, and `prefers-reduced-motion` honoring.

Tools: axe DevTools, Lighthouse a11y audit, manual keyboard tab-through, NVDA/VoiceOver spot check.

Key areas:
- All images have meaningful alt text (decorative ones use `alt=""`)
- All interactive elements reachable via keyboard
- Focus rings visible (don't rely on default browser ring — match v2 design)
- Heading hierarchy is correct on every page (single H1, no skips)
- Form fields properly labeled with `<label>` or `aria-labelledby`
- ModuleGrid parallax disabled when `prefers-reduced-motion: reduce`
- Color contrast ≥4.5:1 for body text, ≥3:1 for large text
- Notification bar dismiss has accessible name

## Acceptance (will expand when Phase 4 begins)

- [ ] Lighthouse a11y ≥95 on home and one content page
- [ ] axe DevTools no critical issues
- [ ] Keyboard-only flow through home page works
- [ ] `prefers-reduced-motion` disables all animation
