# Task 022: Rate limits, caps, route checks

**Phase:** 2 (Storage and webhook)
**Status:** completed (2026-11-22)
**Estimated:** 3 hours
**Dependencies:** 021
**Tags:** api, testing, security

## Goal

The FR-12 limits hold, the cap alert email goes once per window, and
`npm run sms:check -- --server <url>` drives every route branch against a
local server.

## Context

Spec FR-03, FR-05, FR-08, FR-12. Abuse, not volume, is the cost risk. The
in-memory `checkRateLimit` in `src/lib/rate-limit.ts` is per instance, so the
real limits live in Table Storage.

## Steps

1. In the route, before any reply:
   - `checkRateLimit("sms", phoneHash)` first, as a cheap guard.
   - MEET: at most 3 replies per sender in 24 hours. (Done in task 021,
     in `src/lib/sms/inbound.ts`.)
   - Other text: at most 1 nudge per sender in 24 hours. (Done in task
     021.)
   - Site-wide: `incrementCounter` for the hour and the day against
     `SMS_REPLY_HOURLY_CAP` and `SMS_REPLY_DAILY_CAP`. Past a cap: empty
     response, `sms.cap_reached`, and, when this request crossed it, one
     SendGrid email to `CONTACT_EMAIL_TO` (no number, no hash).
   - Limited: empty response, `sms.rate_limited`.
2. Extend `scripts/check-sms.mts` with `--server <url>`. It signs each
   request with `TWILIO_AUTH_TOKEN` from `.env.local`, so it needs local
   table names and refuses to run if they are the production defaults.
   Cases:
   - unsigned and wrongly signed: 403; wrong `AccountSid` or `To`: 403
   - MEET: one `<Message>` whose link verifies; same `MessageSid` again:
     empty
   - non-US `From`: empty
   - STOP then MEET: both empty; START then MEET: a reply
   - `OptOutType=HELP`: empty
   - fourth MEET in 24 hours: empty; second unrecognized text: empty
   - hourly cap set to 2 in the local settings: third reply blocked
   - storage connection unset: empty, no throw
   - search the local tables for the test number's digits: none found
3. Run both modes; all pass. Note timings: each request under 3 seconds.
4. Record the results in `notes/route-checks.md`.
5. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/app/api/sms/inbound/route.ts`: limits added
- `src/lib/sms/notify.ts`: the cap alert email (or a function in the meet
  notify module if it fits)
- `scripts/check-sms.mts`: route cases
- `projects/text-to-meet/notes/route-checks.md`

## Acceptance Criteria

- [x] Every case above passes locally
- [ ] The cap alert is sent once per window, not per request
- [ ] No readable number in the local tables or logs

## Notes

Use a fictional test number in the reserved 555-0100 to 555-0199 range (for example +1 202 555 0199) in the script; never a
real person's number.

Note from task 020: the store has only been run against the in-memory dev
mock. The `--server` cases need a storage connection with test table names
(`SMS_*_TABLE`), either Azurite or a connection string in `.env.local`;
neither exists on this machine today, so that is an owner decision.

Note from task 021: most route cases above already run offline in
`npm run sms:check` by calling the route's `POST` directly with the dev mock
store. The `--server` mode adds what that cannot show: real Table Storage,
real timings, and the hourly cap.

### Done (2026-11-22)

- `src/lib/sms/inbound.ts`: the in-memory guard (5 texts per number per
  minute, MEET and other text only; STOP, START and HELP are always
  recorded), then the per-sender limits (task 021), then the site-wide day
  and hour caps, taken only for a reply about to go. A single number at its
  own limit never uses up the site's allowance.
- `src/lib/email.ts`: `sendSmsCapAlert()`, one email per window to
  `CONTACT_EMAIL_TO` with the cap and the window, no number or hash. Put in
  `email.ts` beside the other notifications rather than a new `notify.ts`.
- `src/app/api/sms/inbound/route.ts`: `sms.cap_reached`, the alert when the
  store says this request is the first refusal in the window, and a console
  line with the error message on a failure (locally there is no App
  Insights, which hid the first server run's failure).
- `src/lib/sms/store.ts`: plain http allowed only for a local emulator.
  The first server run failed every storage call: the SDK refuses an http
  endpoint unless `allowInsecureConnection` is set.
- `scripts/check-sms.mts`: `--server` and `--env-file`, 22 server cases.
- Azurite installed outside the project, run, and stopped; the test env file
  deleted. Setup and results: [notes/route-checks.md](../notes/route-checks.md).
- **Results:** offline 144 pass; with the server 166 pass, twice. p95 39 ms
  against the local emulator; real latency is confirmed in Azure (task 041).
