# Task 050: Sync health and alert

**Phase:** 5 (Health)
**Status:** done (live test with a mailbox outside the scope pending)
**Estimated:** 3 hours
**Dependencies:** none
**Tags:** api, storage, email

## Goal

The morning report shows when the mail sync last succeeded and which mailboxes keep failing, and the sync sends one alert when a mailbox fails three runs in a row.

## Context

FR-13. Today a failing mailbox shows only on `/admin/mailboxes`, so a broken sync can go unnoticed for days.

## Steps

1. On `MaMailboxes`: `failStreak` (raised by a failed run, reset by a good one) and `alertedOn` (the day of the last alert). Include calendar failures from task 030 when that has merged.
2. In the sync, when a mailbox's streak reaches 3 and it has not been alerted today, send one email through the morning report's SendGrid sender to its recipient: the mailbox, its error and a link to `/admin/mailboxes`.
3. In `src/lib/reports/daily.ts`, a "Mail sync" section:
   - the time of the last successful run across mailboxes;
   - a warning when that is more than an hour old;
   - each mailbox at a streak of 3 or more, with its error.
4. Checks with canned times and errors: streak up and reset, one alert on the third failure, none on the fourth the same day, the report lines.
5. Update TASK-INDEX.md.

## Expected outputs

- Changes to `src/lib/market/mailboxes.ts`, `src/lib/market/sync.ts`, `src/lib/reports/daily.ts`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] A mailbox outside the Exchange scope triggers one alert on its third failed run and shows in the next morning report.
- [x] A good run resets the streak.
- [x] The alert carries no message content, only the mailbox and its error.

## Notes

- Ralph's phase 1 check with a mailbox outside the scope can double as this task's live test.
- Spec references: FR-13, NFR-01.

## As built

- `src/lib/market/mailboxes.ts`: `failStreak` and `alertedOn` on each mailbox. `recordSync` now returns `{ streak, alert }`: a good run sets the streak to 0; a failure raises it, and `alert` is true when the streak is 3 or more and no alert went that UTC day (it then sets `alertedOn`). `FAIL_ALERT_STREAK = 3`.
- `src/lib/market/sync.ts`: on `alert`, `syncAll` sends `sendSyncAlert` (or the checks' own sender). A failed alert is logged and never fails the run.
- `src/lib/email.ts`: `sendSyncAlert` through the morning report's sender and recipient. It carries the mailbox label, address, error and streak only.
- `src/lib/reports/daily.ts`: a "Mail sync" section: the last successful sync across enabled mailboxes, a warning when that is more than an hour old or when none has synced, and each mailbox at a streak of 3 or more with its error. Health sections do not count toward a quiet day.
- `/admin/mailboxes` shows "Failed N runs in a row" beside the error from the second failure.
- Calendar failures (task 030) are not included yet; task 030 has not been built.
- `docs/market-access-mailboxes.md`: a troubleshooting row for the alert.
- Checks: canned times for the streak, one alert on the third failure, none on the fourth the same day, one the next day, the reset; one alert through `syncAll` for a mailbox answering 403; the report lines. 73 pass with fresh tables.
- Open: the first acceptance criterion needs the live test (a mailbox outside the Exchange scope, after deploy).
