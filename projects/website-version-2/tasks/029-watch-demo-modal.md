# Task 029: Watch demo modal

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 2.5 hours
**Dependencies:** 005
**Tags:** component, home, modal, accessibility

## Context

The hero's secondary CTA is "Watch demo" (outline button). Per latest decision: it opens a **modal/popup overlay** that hosts a demo video — not a separate route.

**Component**: `src/components/WatchDemoModal.tsx` (Client Component, mounted globally in root layout or home page).

**Trigger**: a `useState` boolean controlled by the hero CTA's `onClick`. Could lift state to a context or use a small singleton store; for v1 of v2, simple `useState` in `src/app/page.tsx` (which then passes the open prop down) is fine — but if the trigger is also wanted from other CTAs later, switch to a global store.

**Modal behavior:**
- Full-screen overlay with semi-transparent backdrop (matches dark theme)
- Click backdrop or press Escape to close
- Trap focus inside while open (use `headlessui` Dialog, or implement focus trap manually with refs)
- `aria-modal="true"`, `role="dialog"`, accessible name from heading
- Body scroll locked while open
- Restore focus to trigger button on close

**Video content:**
- Placeholder until production video ready — use a video element pointing to a placeholder MP4 or a YouTube embed
- Content config in `src/content/home/hero.ts` so swapping URL doesn't touch component
- Aspect ratio 16:9 with `padding-bottom: 56.25%` trick or modern CSS `aspect-ratio`
- Lazy load — don't render the `<video>` or iframe until modal opens

**Reduced motion:**
- Modal entrance/exit animation: fade only (no scale or slide) by default; if any motion, gate on `motion-safe:`
- Video element: respect `<video preload="none">` so we don't autoload until played

**Mobile:**
- Modal still works at 375px
- Video player controls visible
- Backdrop dismissible by tap

## Acceptance (will expand when Phase 2 begins)

- [ ] Modal opens from hero "Watch demo" CTA
- [ ] Backdrop click and Escape close the modal
- [ ] Focus trapped inside modal while open
- [ ] Focus restored to trigger button on close
- [ ] Body scroll locked while open
- [ ] Video lazy-loads (not in DOM until modal opens)
- [ ] Reduced-motion: no entrance animation
- [ ] Mobile usable
- [ ] A11y: `aria-modal`, `role="dialog"`, accessible name

## Notes

- **Library option**: `@headlessui/react` `Dialog` handles focus trap, scroll lock, and a11y plumbing for free. Adding it adds ~5KB gzipped — worth it for correctness over hand-rolling.
- **Video placeholder**: until production video lands, use a static poster image with a "Demo coming soon" overlay, or a generic Spaarke loop video — coordinate with marketing.
- The existing `src/app/demo/` route (currently an early-access form) is unrelated — leave it for now; rename/repurpose in a future cleanup.
