# Task 021: Meeting writers

**Phase:** 2 (Site writers)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 012
**Tags:** nextjs, api, storage

## Goal

Booking, rescheduling and canceling a meeting on `/meet` each record an activity on the guest's contact (and on each added guest).

## Context

FR-06 and FR-05 (`meeting.booked`, `meeting.rescheduled`, `meeting.cancelled`). The booking record lives in `MeetingBookings` (`src/lib/meet/store.ts`); the routes are under `src/app/api/meet/`.

## Steps

1. Add mappers in `src/lib/market/writers.ts` for the three meeting events. Source `MeetingBookings`; source ID `<bookingId>:<event>:<n>` so a second reschedule is a new activity; summary is the meeting time in the host zone.
2. Call `recordActivitySafe` after the booking store update succeeds in the book, reschedule and cancel routes (or once in `src/lib/meet/service.ts` if that is where the three meet).
3. Pass the booking's attribution as UTM fields.
4. Check with `MEET_DEV_MOCK` (or the existing dev mock) locally that each action writes one activity and a repeat of the same request writes none.

## Expected outputs

- `src/lib/market/writers.ts` additions
- Calls in the three meet routes or the service

## Acceptance criteria

- [ ] Each of the three actions writes one activity; added guests get their own.
- [ ] A meet action with the market tables unavailable behaves exactly as before.

## Notes

- Campaign status `meeting` (FR-09) is derived in task 033 from these activities.
- Spec references: FR-05, FR-06.
