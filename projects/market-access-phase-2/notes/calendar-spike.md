# Calendar access spike (task 001)

Run on 2026-11-24 against Ralph's mailbox with the `/meet` app's existing access, read-only, from a throwaway script that printed counts and field names only. The window was 30 days back to 90 days ahead.

## Answers

### 1. Does `calendarView/delta` work app-only?

Yes. It answered 200, paged with `@odata.nextLink` (2 pages, 0.8 s), and ended with an `@odata.deltaLink`. Calling the delta link again at once returned 0 changes in 0.1 s.

But it does not suit the sync, for two reasons:

- **It returns the body.** The delta ignores `$select` for the body: with a `$select` that left the body out, every full event still carried `body` and `bodyPreview`. Spec NFR-01 and task 030 say the sync never fetches bodies.
- **Occurrences come back as stubs.** Of 100 items, 60 were occurrences of recurring meetings with only `id`, `type`, `seriesMasterId`, `start` and `end`. Their attendees and subjects would need a second read.

### 2. How is a rolling window kept?

The delta's window is fixed at its first call, so it would need restarting as days pass. A plain `calendarView` read with `$select` needs none of that:

- it honors `$select`, so no body is fetched;
- it expands every occurrence with its own attendees, subject and link;
- it covers the window as of the current run.

On Ralph's calendar it read 96 events in 2 pages and 0.8 s, well inside the sync's 25-second budget.

### 3. Moved, canceled and private events

The window held no canceled and no private events, so their shapes were not seen live. `calendarView` does not report changes, so the sync keeps one state row for each event it has logged and compares on each run:

- **Moved:** the stored start differs from the current one.
- **Canceled, seen as an attendee:** `isCancelled` is true. Outlook leaves the event in an attendee's calendar until they remove it.
- **Canceled or deleted, as organizer:** the event is gone from the window. The sync then reads it by its ID:
  - 404, or `isCancelled` true: canceled;
  - found outside the window: moved.
- **Private:** the rule stays as the spec has it. When `sensitivity` is `private`, the entry says "Private meeting" and keeps no subject, whatever Graph returns.

### 4. Matching a `/meet` booking

`MeetingBookings.eventId` holds the event's `id` in the host's calendar: 3 of the 4 bookings in the window matched an event by `id`. The fourth was not found by a direct read either, and is likely a canceled booking whose event was deleted.

The same meeting has a different `id` in another mailbox but the same `iCalUId`, and a read by `id` returns the `iCalUId`, so the sync can match a booking in either calendar. It:

- skips host-calendar events whose `id` is a booking's `eventId`;
- skips events in other calendars by those events' `iCalUId`s.

### 5. Fields available

Every event had `iCalUId`, `webLink`, `isOnlineMeeting`, `start`, `end`, `sensitivity`, `isCancelled`, `type`, `attendees`, `organizer`, `createdDateTime` and `lastModifiedDateTime`.

`iCalUId` is different for each occurrence: 65 occurrences and exceptions had 65 distinct values. So one key works for single meetings and occurrences alike.

### 6. contactus@

A read of the contactus@ calendar answers 403 `ErrorAccessDenied`, as expected before the Exchange step. To retest once Ralph has run the command in `docs/market-access-mailboxes.md`, section 7.

## Volume

In the 120-day window on Ralph's calendar:

| | Events |
|---|---:|
| All | 96 |
| Single meetings | 31 |
| Occurrences of 4 recurring series, and exceptions | 65 |
| With someone outside Spaarke | 77 |
| With at least one known contact | 50 |

30 distinct outside addresses appear in the window, and recurring meetings matter here. A weekly call with a known contact would add a held entry every week, which is right for the timeline but would crowd it.

## Decision for tasks 030 and 031

- **Read:** `GET /users/{mailbox}/calendarView` for the window on every sync run, with `$select=iCalUId,subject,start,end,isCancelled,sensitivity,isOnlineMeeting,webLink,attendees,organizer,createdDateTime,lastModifiedDateTime,type,seriesMasterId` and `Prefer: outlook.timezone="UTC"`. No delta and no checkpoint. A sync run that runs out of time skips the calendar until the next run.
- **State:** a new table, `MaCalendarEvents`, partitioned by mailbox ID and keyed by `iCalUId`. A row is kept only for events with a known contact, and holds:
  - the event `id`, start and end;
  - the contact IDs;
  - which entries are logged;
  - nothing else, so no subject.

  Rows are removed once the event is more than 30 days past.
- **Entries:** unchanged from the spec (booked, moved, canceled, held). The source ID is `iCalUId` and the entry type, plus the new start for a move.
- **Recurring meetings:** for occurrences, log `calendar.booked` once for the series, keyed by `seriesMasterId`. Then log `calendar.held` for each occurrence that takes place, and moves and cancellations for each occurrence. This is a default; Ralph can choose instead to leave recurring meetings out.
- **`/meet`:** skip by `id` in the host calendar and by `iCalUId` elsewhere, as above.
- **Access errors:** a 403 on the calendar maps to `NoMailboxAccess` and is recorded as the mailbox's calendar error, apart from its mail error.
