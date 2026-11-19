# Task 061: Privacy page

**Phase:** 6 (Reporting and privacy)
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 031
**Tags:** content, nextjs

## Goal

The privacy page describes the contact and activity records: purpose, sources (forms, meetings, email with Spaarke, LinkedIn leads, engagement with links Spaarke sends), what is stored (no email bodies), retention, and how to ask for deletion.

## Context

FR-17 and the retention assumption (contacts until deleted, activities three years).

## Steps

1. Draft the new section in plain language; run it past Ralph before merge.
2. Update `src/app/privacy/page.tsx` and its last-updated date.
3. `npm run voice:lint` if it covers the page text; otherwise check by hand.

## Expected outputs

- `src/app/privacy/page.tsx`

## Acceptance criteria

- [ ] Ralph approves the wording.
- [ ] The deletion route on the page matches the delete action in task 031.

## Notes

- Spec references: FR-17, Assumptions (retention).
