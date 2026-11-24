# Task 031: Calendar entries in the sync

**Phase:** 3 (Calendar)
**Status:** not-started
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
   - skip events whose event ID matches a `MeetingBookings` row (the field the spike chose);
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
8. Live: switch on "Read calendar" for Ralph's mailbox, read again 30 days, and check counts only. Then contactus@, once Ralph's Exchange step has applied.
9. Update TASK-INDEX.md.

## Expected outputs

- `src/lib/market/calendar-sync.ts`
- Changes to `src/lib/market/sync.ts`, `types.ts`, `src/components/admin/format.ts`, `icons.tsx`, `src/app/api/market/sync/route.ts`
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] One meeting gives one booked entry and, after it takes place, one held entry.
- [ ] A canceled meeting gets no held entry.
- [ ] Re-reading changes nothing.
- [ ] An Outlook meeting with a known contact appears within one sync run.

## Notes

- Never log a subject or attendee; telemetry carries counts only.
- Spec references: FR-06, FR-07, NFR-01 to NFR-04.
