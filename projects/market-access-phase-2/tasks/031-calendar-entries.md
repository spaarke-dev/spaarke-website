# Task 031: Calendar entries in the sync

**Phase:** 3 (Calendar)
**Status:** done (live run after deploy)
**Estimated:** 4 hours
**Dependencies:** 030
**Tags:** api, storage, graph

## Goal

Each sync run turns calendar events with a known contact into booked, moved, canceled and held entries on that contact, with no doubles.

## Context

FR-07 and owner decision 3 (log when booked and when completed). Phase 1 logs `/meet` bookings itself, so those events are skipped here.

## Steps

1. `src/lib/market/calendar-sync.ts`, run per mailbox after mail inside the sync's time budget:
   - find attendees and the organizer who are contacts (point reads by email hash); ignore Spaarke's own addresses;
   - skip host-calendar events whose `id` is a `MeetingBookings` `eventId`, and events in other calendars with those events' `iCalUId`s;
   - compare with the `MaCalendarEvents` row: a changed start is a move; `isCancelled`, or an event gone from the window that answers 404 by ID, is a cancellation; one found outside the window is a move;
   - recurring meetings: `calendar.booked` once per series (keyed by `seriesMasterId`), then held, moved and canceled for each occurrence;
   - for each contact on the event, write through `recordActivity` with source `graph-calendar`:
     - `calendar.booked` the first time, dated when the event was created, with the meeting time in the summary;
     - `calendar.moved` when the start changes, the source ID carrying the new start;
     - `calendar.cancelled` when canceled;
     - `calendar.held` once the end has passed without a cancellation, dated at the start, checked on every run for events in the window.
2. Each entry carries subject, meeting time, online or in person, and the Outlook link. A private event logs as "Private meeting" with no subject.
3. Source IDs from `iCalUId`, so the same meeting seen in Ralph's calendar and contactus@ logs once.
4. Investor contacts' entries take the contact's visibility (NFR-02).
5. Add the four types with labels and icons (meeting group).
6. Add calendar counts to the sync's answer: events read, booked, moved, canceled, held, skipped as `/meet`.
7. Checks with canned events: booked then held, moved, canceled with no held, private, `/meet` skipped, both mailboxes seeing one meeting, a re-read changing nothing.
8. Live: switch on "Read calendar" for Ralph's mailbox and check counts only after one run. Then contactus@, once Ralph's Exchange step has applied.
9. Update TASK-INDEX.md.

## Expected outputs

- `src/lib/market/calendar-sync.ts`
- Changes to `src/lib/market/sync.ts`, `types.ts`, `src/components/admin/format.ts`, `icons.tsx`, `src/app/api/market/sync/route.ts`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [x] One meeting gives one booked entry and, after it takes place, one held entry.
- [x] A canceled meeting gets no held entry.
- [x] Re-reading changes nothing.
- [ ] An Outlook meeting with a known contact appears within one sync run.

## Notes

- Never log a subject or attendee; telemetry carries counts only.
- Spec references: FR-06, FR-07, NFR-01 to NFR-04.

## As built

- `src/lib/market/calendar-sync.ts`: for each event in the window, the organizer and attendees who are contacts, leaving out the mailbox and its own domain. `entriesFor` decides the entries from the event and its `MaCalendarEvents` row; `logEvent` writes one activity per contact through `recordActivity` (source `graph-calendar`), then the row.
  - Source IDs: `booked:<iCalUId>`, `moved:<iCalUId>:<old start>><new start>`, `cancelled:<iCalUId>`, `held:<iCalUId>`, each with a slice of the contact ID.
  - Recurring meetings: `booked` once per series. The series key is the occurrence's Exchange `iCalUId` with its date bytes (16 to 19) zeroed, which every calendar shares; for other UIDs it falls back to the mailbox's `seriesMasterId`.
  - A meeting first seen already canceled logs nothing; a canceled meeting is final and never gets a held entry.
  - Logged events the window no longer returns are read by ID: 404 or canceled logs `calendar.cancelled` (a deleted one with no subject or place); found elsewhere logs `calendar.moved`.
  - `/meet`: `bookingEventIds` reads the bookings whose start is in the window; `resolveMeet` reads each one's `iCalUId` once from `MEET_HOST`'s calendar and keeps it in `MaCalendarEvents` (partition `meet`), so every calendar skips the meeting whatever order the mailboxes run in.
  - Summaries in `MEET_HOST_TIME_ZONE`: "Meeting on Tue, Dec 1, 2026, 10:00 AM EST, online", "Moved to ...", "Canceled the meeting on ...", "Recurring meeting, first on ...". A private or confidential event's subject is "Private meeting".
- `types.ts`, `format.ts`, `icons.tsx`: `calendar.booked` ("Meeting in calendar"), `calendar.moved`, `calendar.cancelled`, `calendar.held`, in the meeting group.
- `sync.ts` and `/api/market/sync`: the calendar counts per mailbox, totals in the answer and telemetry (counts only), and a campaign recompute when calendar entries were logged.
- Investor contacts' entries take the contact's visibility through `recordActivity`.
- Checks: entry rules, the series key, counterparts and summaries; then canned calendars through the sync: booked then held, a move, a deletion, a canceled occurrence, a private event, `/meet` skipped by ID and by `iCalUId`, one meeting in two calendars logged once, and a re-read changing nothing. 79 pass with fresh tables.
- Open: step 8, the live run, needs the deploy. Then Ralph's mailbox first, contactus@ after the Exchange step.
