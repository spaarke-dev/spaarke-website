# Task 050: Sync health and alert

**Phase:** 5 (Health)
**Status:** not-started
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
- [ ] A good run resets the streak.
- [ ] The alert carries no message content, only the mailbox and its error.

## Notes

- Ralph's phase 1 check with a mailbox outside the scope can double as this task's live test.
- Spec references: FR-13, NFR-01.
