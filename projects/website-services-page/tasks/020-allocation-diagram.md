# Task 020: Functional allocation diagram

**Phase:** 2 - Diagrams
**Status:** complete (draft)
**Estimated:** 2-4 hours
**Dependencies:** 010
**Tags:** react, accessibility, animation

## Goal

Two panels joined by a services-agreement connector, item-by-item build on scroll, hover or focus detail, replay (design 4.4 and 6.1).

## Context

See `../spec.md` and the design sections named in the goal.

## Steps

1. Data-driven panels from content.ts
2. IntersectionObserver build with a 120 ms stagger
3. Detail line for the focused item; replay button; service-menu graphic
4. Verify the acceptance criteria are met
5. Update TASK-INDEX.md: mark this task complete

## Expected Outputs

- `src/components/services/AllocationDiagram.tsx`

## Acceptance Criteria

- [x] Keyboard focus shows the detail line
- [x] Reduced motion shows the final state
