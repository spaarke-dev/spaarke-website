# Task 022: Rate limits, caps, route checks

**Phase:** 2 (Storage and webhook)
**Status:** not-started
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
   - MEET: at most 3 replies per sender in 24 hours.
   - Other text: at most 1 nudge per sender in 24 hours.
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

- [ ] Every case above passes locally
- [ ] The cap alert is sent once per window, not per request
- [ ] No readable number in the local tables or logs

## Notes

Use a fictional test number in the reserved 555-0100 to 555-0199 range (for example +1 202 555 0199) in the script; never a
real person's number.

Note from task 020: the store has only been run against the in-memory dev
mock. The `--server` cases need a storage connection with test table names
(`SMS_*_TABLE`), either Azurite or a connection string in `.env.local`;
neither exists on this machine today, so that is an owner decision.
