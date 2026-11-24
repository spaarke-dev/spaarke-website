# Task 030: Graph calendar client and registry setting

**Phase:** 3 (Calendar)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 001
**Tags:** azure, graph, api, storage

## Goal

The sync can read a mailbox's calendar changes since a checkpoint, and each mailbox has a "Read calendar" setting with its own error.

## Context

FR-06. Task 001 settled the read pattern: a `calendarView` read of the whole window on each run, with a state row for each logged event (`notes/calendar-spike.md`). This task builds the client and the setting; task 031 turns events into entries.

## Steps

1. `src/lib/market/graph-calendar.ts`, using the phase 1 Graph token and fetch helpers:
   - read `calendarView` for the window (30 days back, 90 ahead) with the `$select` in `notes/calendar-spike.md`, every run, with no delta;
   - read one event by ID, for events gone from the window (404 means deleted);
   - return only: `iCalUId`, event ID, start, end, time zone, `isCancelled`, sensitivity, online flag, `webLink`, subject, organizer and attendee addresses, created and last modified times;
   - map a 403 to the phase 1 `NoMailboxAccess` error.
2. `MaCalendarEvents` (partition mailbox ID, row `iCalUId`): event ID, start, end, contact IDs and which entries are logged; no subject. Rows go once the event is more than 30 days past. No checkpoint: each run reads the whole window.
3. `readCalendar` on `MaMailboxes`, off by default, with `lastCalendarError` and `lastCalendarErrorAt`, kept apart from the mail error.
4. `/admin/mailboxes`: a "Read calendar" switch and the calendar error. "Check access" also tries one calendar read when the switch is on.
5. Checks with canned Graph answers: paging, the window, the 403 mapping, the state rows and their cleanup.
6. Update TASK-INDEX.md.

## Expected outputs

- `src/lib/market/graph-calendar.ts`
- Changes to `src/lib/market/mailboxes.ts`, `src/lib/market/tables.ts` (`MaCalendarEvents`), the mailbox page and its actions
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] A mailbox without calendar access shows a clear calendar error and keeps syncing mail.
- [ ] A run that runs out of time leaves the state rows consistent for the next run.
- [ ] No event body, notes or attachments are requested.

## Notes

- Request with `$select` so bodies are never fetched. The delta read ignores `$select` for the body, which is why it is not used.
- Spec references: FR-06, NFR-01, NFR-04.
