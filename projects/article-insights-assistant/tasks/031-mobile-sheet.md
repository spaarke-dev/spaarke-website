# Task 031: Mobile bottom sheet

**Phase:** 3 (The interface)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 030
**Tags:** react, tailwind, responsive, accessibility

## Goal

On viewports without a right rail, a floating button opens the same console
as a bottom sheet over the article.

## Context

The series is promoted on LinkedIn, where a large share of traffic is
mobile. Shipping desktop only would miss the readers the promotion brings.

The button persists as the reader scrolls, because a 6,000-word article is
a long way to scroll back to an entry point that sits at the top.

## Steps

1. Add a floating button, visible below the rail breakpoint, persistent
   through scroll, positioned clear of any other fixed element.
2. Open the console from task 030 in a bottom sheet. Reuse the component
   rather than forking it.
3. Keep the article mounted behind the sheet so scroll position survives
   close.
4. Size the sheet so the input stays visible above the on-screen keyboard.
5. Trap focus while open, restore it on close, and close on escape and on
   backdrop tap.
6. Confirm the disclaimer is visible in the sheet, not just in the rail.
7. Test at 375px one-handed: reachable button, usable input, readable
   citations.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/components/ArticleInsights/MobileSheet.tsx`
- Floating button component
- Responsive wiring on the article route

## Acceptance Criteria

- [ ] Button visible and reachable one-handed at 375px
- [ ] Sheet opens the same console, not a reduced variant
- [ ] Article stays mounted; scroll position survives close
- [ ] Input remains visible with the keyboard open
- [ ] Focus trapped while open and restored on close
- [ ] Escape and backdrop tap both close
- [ ] Disclaimer visible in the sheet

## Notes

The on-screen keyboard is the detail that gets missed. A sheet sized to the
viewport height puts the input under the keyboard on iOS, where the reader
types blind.

Do not fork the console for mobile. Two implementations diverge, and the
mobile one always falls behind.

See spec FR-12, FR-10, NFR-05.
