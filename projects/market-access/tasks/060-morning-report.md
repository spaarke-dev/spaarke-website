# Task 060: Morning report sections

**Phase:** 6 (Reporting and privacy)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 034
**Tags:** typescript, api

## Goal

The morning digest gains two sections: follow-ups due today or overdue, and contacts created in the period, with investor records shown only as a count.

## Context

FR-16. `src/lib/reports/daily.ts` builds the digest and `/api/reports/daily` sends it to a list, so no investor name may appear.

## Steps

1. Add both sections to `buildDailyReport` and `renderDailyReport`, reading the follow-up due index and new contacts.
2. Investor records: a single line such as "2 investor contacts (hidden)".
3. A section that cannot be read is reported in `broken`, like the existing sections.
4. Check with `?dry=1` against dev tables.

## Expected outputs

- `src/lib/reports/daily.ts`

## Acceptance criteria

- [ ] Both sections render in a dry run with made-up data.
- [ ] No investor name or email appears.

## Notes

- Spec references: FR-16.
