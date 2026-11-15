# Task 012: Daily report section

**Phase:** 1 (Server side)
**Status:** completed
**Estimated:** 1 hour
**Dependencies:** 010
**Tags:** api, storage

## Goal

The daily report counts the day's design partner applications.

## Context

Spec FR-13. `src/lib/reports/daily.ts` already reads `DemoRequests` and
`ContactSubmissions` in `leadsSection()`.

## Steps

1. Add `DesignPartnerApplications` to `leadsSection()` with `rowsSince`, as
   a line per application (organization, organization type) and a count.
2. A missing table reads as zero, not as a section problem.
3. Run the report locally against the storage account, or with a stubbed
   client, with zero and with one row.
4. Verify acceptance criteria are met.
5. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/reports/daily.ts` (modified)

## Acceptance Criteria

- [ ] The report renders with zero applications and with one
- [ ] A missing table does not mark the section as failed
