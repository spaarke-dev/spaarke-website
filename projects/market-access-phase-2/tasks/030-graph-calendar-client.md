# Task 030: Graph calendar client and registry setting

**Phase:** 3 (Calendar)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 001
**Tags:** azure, graph, api, storage

## Goal

The sync can read a mailbox's calendar changes since a checkpoint, and each mailbox has a "Read calendar" setting with its own error.

## Context

FR-06. Task 001 decides the read pattern (delta within a window, or a window read with change hashes). This task builds the client and the setting; task 031 turns events into entries.

## Steps

1. `src/lib/market/graph-calendar.ts`, using the phase 1 Graph token and fetch helpers:
   - read events in the window (30 days back, 90 ahead) with the pattern from `notes/calendar-spike.md`;
   - return only: `iCalUId`, event ID, start, end, time zone, `isCancelled`, sensitivity, online flag, `webLink`, subject, organizer and attendee addresses, created and last modified times;
   - map a 403 to the phase 1 `NoMailboxAccess` error.
2. Calendar checkpoint in `MaSyncState`, keyed by mailbox and `calendar`, with the same overlap and "only moves back" rules as mail. "Read again" moves it back too.
3. `readCalendar` on `MaMailboxes`, off by default, with `lastCalendarError` and `lastCalendarErrorAt`, kept apart from the mail error.
4. `/admin/mailboxes`: a "Read calendar" switch and the calendar error. "Check access" also tries one calendar read when the switch is on.
5. Checks with canned Graph answers: paging, the window, the 403 mapping, the checkpoint rules.
6. Update TASK-INDEX.md.

## Expected outputs

- `src/lib/market/graph-calendar.ts`
- Changes to `src/lib/market/mailboxes.ts`, `src/lib/market/sync.ts` (checkpoint helpers), the mailbox page and its actions
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] A mailbox without calendar access shows a clear calendar error and keeps syncing mail.
- [ ] The checkpoint never moves forward past events not yet handled.
- [ ] No event body, notes or attachments are requested.

## Notes

- Request with `$select` so bodies are never fetched.
- Spec references: FR-06, NFR-01, NFR-04.
