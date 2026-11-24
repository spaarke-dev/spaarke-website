# Task 052: Backfill CLI

**Phase:** 5 (Imports and backfill)
**Status:** done (run live 2026-11-24)
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

- [x] Counts per source match the source tables (FR-13 acceptance).
- [x] A second run adds nothing.
- [x] Run date recorded in `current-task.md`, before 2027-02-11.

## Notes

- Spec references: FR-13.

## As built

- `src/lib/market/backfill.ts`: each source row goes through the same builder as its live writer, so the backfill and the live writes share source IDs.
  - Form rows use `formActivity` with the row's own time: `createdAt`, `signedUpAt` for early release, or the row key's leading milliseconds. UTM fields come from the row.
  - Booking rows give a `meeting.booked` for the booker and each guest, dated at `createdAt`. A cancelled booking also gives `meeting.cancelled`, dated at `updatedAt`. A moved booking gives its last move. A move is skipped when the booker already has one for that booking, because the live writer dated moves to its own millisecond. Pending and failed bookings are no meeting.
  - App Insights events go through the live builders, `briefReadActivity` and `askClickActivity`, which are now exported from `writers.ts`. A click whose member already has a live click on the same provider within two seconds is skipped, because App Insights does not keep the brief label the live writer hashed in.
  - Events come from the private export of task 004 (`--from-file`), from a live query with `--offset 90d` (`--app`, `--resource-group`), or both; repeats are dropped.
  - Rows from spaarke.com addresses are the team's own tests and are skipped. Deleted contacts are skipped.
  - At the end the run recomputes every campaign and audits `import.backfill` with counts only.
- `scripts/market/backfill.mts` (`npm run market:backfill`): `--dry-run` reads everything and counts what would be added, writing nothing. It prints counts only.
- Dry run against live data, 2026-11-24, with the export plus a live query (408 events, 2026-11-13 21:47 to 2026-11-24 01:10 UTC). Nothing was already logged:
  - ContactSubmissions: 11 rows, 8 to add, 3 from a Spaarke address.
  - DemoRequests: 1 row, 1 to add.
  - DesignPartnerApplications: 0 rows.
  - EarlyReleaseSignups: 33 rows, 33 to add.
  - InvestorOverviewRequests: 1 row, from a Spaarke address.
  - MeetingBookings: 4 rows giving 7 activities, 4 to add, 3 from a Spaarke address.
  - brief.read: 26 events, 20 to add, 6 with no member.
  - ask_ai.click: 382 events, 231 to add, 52 with no member (rewritten or unknown codes), 99 site clicks.
- The source rows hold 18 distinct addresses, one of them at spaarke.com. 4 contact form rows look like tests and will become contacts that Ralph can delete.
- Checks: one pure check (row and event mapping against the live builders) and one storage check (original time and UTM, a row already logged live, a click logged live a second apart, a deleted contact, a Spaarke address, a move, a dry run equal to the run, a second run adding nothing). 59 pass.
- Live run, 2026-11-24, from `main` after PR #202 merged. Events came from the export plus a live query (408 events, 2026-11-13 21:47 to 2026-11-24 01:10 UTC). Every source row is accounted for:
  - Form tables: 42 entries added. ContactSubmissions gave 8, with 3 from a Spaarke address skipped; DemoRequests 1; EarlyReleaseSignups 33. InvestorOverviewRequests' 1 row was from a Spaarke address.
  - MeetingBookings: 4 meeting entries added, 3 from a Spaarke address skipped.
  - brief.read: 20 added, 6 with no member.
  - ask_ai.click: 187 added. 44 more shared an ID with another click (same member, provider and second; a scanner pressing a button twice, which the live writer also logs once). 52 had no member and 99 were site clicks.
- TLTF after the run: 95 members, 81 sent, 71 delivered, 6 engaged, 11 replied, 19 with a meeting. The 6 engaged members are the same 6 recipients `track.py` lists (FR-10 acceptance, with the data in the log).
- A second run the same day added nothing in any source. No file under the repo changed.
