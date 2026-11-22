# Task 031: Booking linked to the text

**Phase:** 3 (The link into /meet)
**Status:** completed
**Estimated:** 3 hours
**Dependencies:** 030
**Tags:** api, react, storage

## Goal

In Graph mode, a booking made through an SMS link carries
`smsConversationId` and `source: sms`, the conversation shows `booked` with
the booking ID, and the team email says "Came from a text (MEET, <code>)". A
bad token never blocks a booking.

## Context

Spec FR-16 (Graph mode) and success criterion 6. Graph mode is live, so this
is the path real visitors take.

## Steps

1. `MeetBookingFlow`: accept an optional `smsToken` prop and send it in the
   book request body. `LetsMeetPanel` passes nothing.
2. `src/app/api/meet/book/route.ts`: when `smsToken` is present, verify it
   again; on success write `smsConversationId` and `source: "sms"` on the
   booking (extend `BookingRecord` in `src/lib/meet/store.ts`), then
   `markConversationBooked`. Any failure here is logged and ignored.
3. Log `sms.booking_linked`.
4. The team notice in `src/lib/meet/notify.ts` (or `emails.ts`): one line
   "Came from a text (MEET, <placement label or none>)" when linked.
5. Check locally with the Graph dev mock (`src/lib/meet/dev-mock.ts`): a
   booking through a fresh token links; an expired token books without a
   link.
6. `npm run typecheck`, `npm run lint`, `npm run meet:check`.
7. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/components/meet/MeetBookingFlow.tsx`
- `src/app/api/meet/book/route.ts`
- `src/lib/meet/store.ts`
- `src/lib/meet/notify.ts` or `src/lib/meet/emails.ts`

## Acceptance Criteria

- [x] Linked booking: both rows updated, email line present
- [x] Bad or expired token: booking succeeds, no link, logged
- [x] The visitor's confirmation email is unchanged

## Notes

The form is not pre-filled: the text carries only a phone number, which is
neither stored nor shown.

### Done (2026-11-22)

- `MeetBookingFlow`: sends `smsToken` with the booking when it has one, and
  adds `source: sms` to the `Meeting Booked` event. `LetsMeetPanel` passes
  nothing.
- `src/lib/sms/link-open.ts`: `smsBookingSource()` verifies the token again
  and loads the conversation; `markSmsBooked()` sets `bookingId`, `bookedAt`
  and status `booked`; `smsSourceLine()` builds the email line. Neither can
  throw. Failures log `sms.booking_unlinked` with a reason (`invalid`,
  `expired`, `unknown_conversation`, `storage`, `no_secret`,
  `conversation_gone`); success logs `sms.booking_linked`.
- `src/app/api/meet/book/route.ts`: the check runs after validation and
  before the slot lock. The booking row gets `source: "sms"` and
  `smsConversationId` when it is created, so a failed booking never marks
  the conversation; the conversation is marked once the meeting exists.
  `meet.booked` carries `source`.
- `src/lib/meet/store.ts`: `source` and `smsConversationId` on
  `BookingRecord`, both optional.
- `src/lib/email.ts`: the team notice's text is now built by
  `meetingNotificationText()`, so the check script can read it. The line is
  "Came from a text (MEET, SIG: Email signature)." under the storage line,
  or "(MEET, none)" when the text had no code. In dev mock mode the notice is
  logged and not sent, as the visitor emails already were.
- **Decision:** a second booking through the same link replaces the
  conversation's `bookingId`; both bookings carry the conversation ID, so
  neither is lost.
- The visitor's confirmation email code is unchanged.
- `scripts/check-sms.mts`: 17 cases; 176 offline pass. `meet:check` 30 pass.
- Browser checks: [notes/booking-link-checks.md](../notes/booking-link-checks.md).
