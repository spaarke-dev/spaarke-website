# Task 041: Go live

**Phase:** 4 (Ship and go live)
**Status:** blocked (Verified number, counsel approval)
**Estimated:** 2 hours (with the owner's phone)
**Dependencies:** 040, 002, 003, 004
**Tags:** deploy, azure, swa, testing

## Goal

A MEET text from a real phone gets one reply whose link opens `/meet` with
the welcome line, and success criteria 3 to 7 in the spec are ticked.

## Context

The only task that waits on outside approvals: the number must be Verified
(task 002) and counsel must have approved the Compliance section (task 004).
Test texts and bookings are production data, so the owner sends them.

## Steps

1. Confirm in the Twilio Console that the number is Verified and the
   account is paid; confirm counsel's checklist is ticked in spec.md.
2. Set `SMS_MODE=twilio` on `swa-spaarke-website`; wait about 3 minutes for
   the site to pick it up.
3. In Twilio, set the number's incoming message webhook (or the Messaging
   Service's integration) to exactly the `SMS_WEBHOOK_URL` value, HTTP POST.
4. Owner texts MEET from their phone. Expect one reply worded as in FR-07.
   Check App Insights for `sms.received` and `sms.replied`, and no
   `sms.bad_signature`. If the signature fails, compare the URL Twilio shows
   in its request log with `SMS_WEBHOOK_URL`.
5. Owner opens the link: the welcome line shows, `c` leaves the address bar,
   the conversation shows `opened`.
6. Owner books a test meeting through the link with an address other than
   the host's: the booking row has `smsConversationId`, the conversation
   shows `booked`, the team email has the "Came from a text" line. Cancel
   the test meeting.
7. Owner texts HELP (one reply, the FR-11 text), STOP (only Twilio's reply),
   MEET (no reply), START, MEET (a reply again).
8. Search the tables, App Insights, and the team email for the test
   number's digits: none found.
9. Tick success criteria 3 to 7 in spec.md; record the results in
   `notes/go-live.md`.
10. Update TASK-INDEX.md, current-task.md, and the `text-to-meet-sms` memory.

## Expected Outputs

- SWA setting `SMS_MODE=twilio`; Twilio webhook set
- `projects/text-to-meet/notes/go-live.md`
- `projects/text-to-meet/spec.md`: criteria ticked

## Acceptance Criteria

- [ ] One reply per MEET; none after STOP; HELP answered once
- [ ] Booking through the link is linked in both tables
- [ ] No readable number anywhere

## Notes

Rollback: unset `SMS_MODE` (route returns 404) and clear the Twilio webhook.
