# Link open checks

Task 030. `/meet?c=<token>` checked in a browser against `next dev` in the
worktree on port 3125, with test-only settings passed on the command line
(nothing written to the project). Offline cases for `openSmsLink` are in
`npm run sms:check`.

## Setup

- Graph mode: `MEET_DEV_MOCK=1`, `MEET_BOOKING_MODE=graph`, `SMS_MODE=twilio`
  with random test values for the Twilio account, token, and both secrets,
  `SMS_WEBHOOK_URL=https://example.test/api/sms/inbound`, and
  `SITE_URL=http://localhost:3125`. A signed MEET CARD2 sent to
  `/api/sms/inbound` returned the link.
- Bookings mode: the same SMS settings, no `MEET_DEV_MOCK`, no storage, and
  `BOOKINGS_PAGE_URL` set to a placeholder page on `bookings.cloud.microsoft`.
  The token was signed with the test secret for a made-up conversation.

## Results (2026-11-22)

| Case | Welcome line | `c` after load | Plausible |
|---|---|---|---|
| Valid link from the reply, with `utm_source=test` | Shown above the picker | Removed; `utm_source` kept | Pageview and the event |
| One character of the signature changed | No | Removed | Pageview only |
| Same conversation, expired | No | Removed | Not checked |
| No `c` | No | Not present | Not checked |
| Bookings mode, storage unset | Shown above the embed | Removed | Pageview and the event |

Plausible drops events on localhost and logs "Ignoring Event: localhost" for
each one, so the count of those lines is what shows the event was sent.

With storage unset the server logged `[sms] link open not recorded:
Storage is not configured`, as intended. Bookings refuses to be framed by
an http page, so the embed itself is blank locally; that was already so
before this task.

Not checked here: that the open is recorded on the conversation in the dev
server (the mock lives in the server's memory). The offline cases cover it:
first open sets the time and count 1, a second open counts 2 and keeps the
first time, and refused tokens record nothing.

The test settings file was kept outside the project and deleted after the
run; both servers were stopped.
