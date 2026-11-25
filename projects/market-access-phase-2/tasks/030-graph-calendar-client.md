# Task 030: Graph calendar client and registry setting

**Phase:** 3 (Calendar)
**Status:** done (contactus@ live read waits on the Exchange step)
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

- [x] A mailbox without calendar access shows a clear calendar error and keeps syncing mail.
- [x] A run that runs out of time leaves the state rows consistent for the next run.
- [x] No event body, notes or attachments are requested.

## Notes

- Request with `$select` so bodies are never fetched. The delta read ignores `$select` for the body, which is why it is not used.
- Spec references: FR-06, NFR-01, NFR-04.

## As built

- `src/lib/market/graph-calendar.ts`: `listCalendarView` (the window with `$select`, `Prefer: outlook.timezone="UTC"` through the shared `graphGet`, paging on Graph's own links, at most 1,000 events a run), `getCalendarEvent` (null on 404), `toCalendarEvent` (the fields in step 1; a private or confidential event keeps no subject) and `calendarWindow`. A 403 becomes `NoCalendarAccess`, a `NoMailboxAccess` whose message names the calendar.
- `src/lib/market/graph-mail.ts`: `graphGet` is exported for the calendar client, and its error text hides event IDs as it hides message IDs.
- `src/lib/market/calendar-state.ts`: `MaCalendarEvents`. The row key is the SHA-256 of the `iCalUId`, which can hold characters a row key cannot; the `iCalUId` is a field. Rows are written whole with `upsert`, so a run cut short leaves each row as one run or the other wrote it. `pruneCalendarStates` removes rows 30 days after the event ended.
- `src/lib/market/mailboxes.ts`: `readCalendar` (off by default; audited as `mailbox.calendar_on` and `mailbox.calendar_off`), `lastCalendarAt`, `lastCalendarError`, `lastCalendarErrorAt` and `checkCalendarError`, set by `recordCalendar` and `recordCheck` apart from the mail's fields. "Check access" also asks for one event in the next day when the switch is on.
- `src/lib/market/calendar-sync.ts` and `sync.ts`: for a mailbox with Read calendar on, the calendar runs after its mail inside the same deadline; a failure is recorded on the calendar fields and the mailbox stays `ok`. Task 031 adds the entries. The sync's answer and telemetry gain `calendarEvents` and `calendarFailed`.
- `/admin/mailboxes`: a Read calendar box, the calendar's last read, its error with "Mail keeps syncing", and the calendar check.
- `docs/market-access-mailboxes.md`: how to start reading a calendar, and a troubleshooting row.
- Checks: event mapping, the window, paging and `$select`, 403 and 404, state rows and their cleanup, a mailbox whose calendar answers 403 keeping its mail status, the check and the audit. 77 pass with fresh tables.
- Browser: the switch on and off, its status line, no sideways scroll at 375 px, axe clean apart from the header contrast that predates this work.
