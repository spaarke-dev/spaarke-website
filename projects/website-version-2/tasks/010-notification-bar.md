# Task 010: NotificationBar (dismissible, localStorage)

**Phase:** 1 — Global Components
**Status:** not-started (stub — to be expanded when Phase 1 begins)
**Estimated:** 1 hour
**Dependencies:** 005
**Tags:** component, global, ui

## Context

Replace the existing `src/components/NotificationBar.tsx` with the v2 version. Dismissible thin strip across the top with a short marketing line and ✕ close button, hairline bottom border, dim color.

Reference: [design_handoff/README.md §"NotificationBarV2"](../design_handoff_spaarke_website_v2/README.md) and [design_handoff/design/NotificationBarV2.jsx](../design_handoff_spaarke_website_v2/design/NotificationBarV2.jsx).

Add localStorage persistence so dismissal sticks across page loads (handoff says "nice-to-have but not required" — we'll do it).

## Acceptance (will expand when Phase 1 begins)

- [ ] Renders v2 styling per handoff
- [ ] Dismiss button works
- [ ] Dismissal persists in localStorage
- [ ] Mobile responsive
- [ ] A11y: `aria-label` on dismiss, focus-visible
