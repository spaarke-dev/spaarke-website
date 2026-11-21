# Task 010: Route, content file and audience switch

**Phase:** 1 - Page shell and audience
**Status:** complete (draft)
**Estimated:** 2-4 hours
**Dependencies:** 001
**Tags:** nextjs, react, typescript

## Goal

`/services` renders with a sticky page bar (anchors, switch, CTA) and an audience provider seeded from `searchParams` (design.md sections 2 and 3).

## Context

See `../spec.md` and the design sections named in the goal.

## Steps

1. Port `mlo.content.ts` to `src/app/services/content.ts`; add copy for sections 4 to 8
2. Build the audience provider, switch and cross-fade wrapper in `src/components/services/`
3. Build the page bar and the section frame
4. Verify the acceptance criteria are met
5. Update TASK-INDEX.md: mark this task complete

## Expected Outputs

- `src/app/services/page.tsx`, `src/app/services/content.ts`
- `src/components/services/audience.tsx`, `PageBar.tsx`

## Acceptance Criteria

- [x] `?audience=corporate` renders corporate on first paint
- [x] Switch updates URL and storage; reduced motion swaps instantly
