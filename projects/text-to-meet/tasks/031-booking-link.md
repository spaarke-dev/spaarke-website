# Task 031: Booking linked to the text

**Phase:** 3 (The link into /meet)
**Status:** not-started
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

- [ ] Linked booking: both rows updated, email line present
- [ ] Bad or expired token: booking succeeds, no link, logged
- [ ] The visitor's confirmation email is unchanged

## Notes

The form is not pre-filled: the text carries only a phone number, which is
neither stored nor shown.
