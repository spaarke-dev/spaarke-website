# Task 052: Backfill CLI

**Phase:** 5 (Imports and backfill)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 020, 021, 022, 004
**Tags:** typescript, azure, storage

## Goal

`scripts/market/backfill.mts` copies the existing site tables and the App Insights engagement events into contacts and activities, once, with their original timestamps and UTM fields. Run it before 2027-02-11 (target: by mid-January 2027).

## Context

FR-13. Using the same source and source ID scheme as the live writers (tasks 020 to 022) means the backfill and live writes never double each other.

## Steps

1. Tables: ContactSubmissions, DemoRequests, DesignPartnerApplications, EarlyReleaseSignups, InvestorOverviewRequests, MeetingBookings. For each row, call the same mapper as the live writer with the row's timestamp.
2. App Insights: read `brief.read` and `ask_ai.click` either live with `az monitor app-insights query ... --offset 90d`, or from the private export of task 004 (`--from-file`). Resolve to members as task 022 does.
3. `--dry-run` prints counts per source; the real run prints the same table so it can be compared with the source counts.

## Expected outputs

- `scripts/market/backfill.mts`

## Acceptance criteria

- [ ] Counts per source match the source tables (FR-13 acceptance).
- [ ] A second run adds nothing.
- [ ] Run date recorded in `current-task.md`, before 2027-02-11.

## Notes

- Spec references: FR-13.
