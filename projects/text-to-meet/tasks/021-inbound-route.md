# Task 021: Inbound webhook route

**Phase:** 2 (Storage and webhook)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 012, 020
**Tags:** api, nextjs, typescript

## Goal

`POST /api/sms/inbound` runs the FR-03 pipeline and answers every request
with either one TwiML `<Message>` or an empty `<Response/>`, within 3 seconds
at p95.

## Context

Spec FR-03 to FR-11, FR-13, FR-20, NFR-01 to NFR-03. Twilio retries on an
error or a timeout, so any failure after the signature check must still
answer 200 with an empty `<Response/>`, or the person could get two
replies.

## Steps

1. `src/app/api/sms/inbound/route.ts`, Node runtime, dynamic.
2. In order:
   1. `getSmsConfig()` is `null`: 404.
   2. Content type must be form-encoded and the body at most 16 KB, else
      400.
   3. Parse with `URLSearchParams` from the raw text; check
      `X-Twilio-Signature` over `SMS_WEBHOOK_URL` with the current and
      previous tokens. Fail: 403, no body, `sms.bad_signature`.
   4. `AccountSid` and `To` must match the settings, else 403.
   5. `claimInbound(MessageSid)`; already claimed: empty response.
   6. `normalizeE164(From)`; not `+1`: empty response,
      `sms.region_blocked`. Hash it; drop the readable number.
   7. `classify(Body, OptOutType)`.
   8. stop: mark sender opted out, empty response. start: clear the flag,
      empty response. help: empty response (Twilio answers).
   9. Opted-out sender: empty response for anything else.
   10. meet: rate limits (task 022), reuse the sender's conversation if
       created in the last 24 hours, else create one; token; reply
       `meetReply(`${siteUrl()}/meet?c=${token}`)`.
   11. other: the once-a-day nudge (task 022), else empty.
   12. Update the inbound row with the classification and conversation.
3. `src/lib/sms/replies.ts`: `twiml(message?)` that XML-escapes the text and
   returns a `text/xml` response; the nudge text lives in `messages.ts`.
4. Telemetry: `sms.received` (classification, code), `sms.replied`, and the
   error events, through `src/lib/logger.ts`; no number or hash in any
   property. `trackException` and an empty 200 on any error after step 3.
   Flush telemetry before returning, as the meet routes do.
5. `npm run typecheck`, `npm run lint`, `npm run voice:lint` on new texts.
6. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/app/api/sms/inbound/route.ts`
- `src/lib/sms/replies.ts`
- `src/lib/sms/messages.ts`: the nudge text (FR-12), already added as
  `NUDGE_REPLY` in task 012

## Acceptance Criteria

- [ ] With `SMS_MODE` unset the route returns 404
- [ ] Nothing reads `From`, `To` or `Body` before the signature passes
- [ ] The reply link uses `siteUrl()`, never the request's origin
- [ ] Any thrown error after the signature check yields 200 and an empty
      `<Response/>`

## Notes

`siteUrl()` comes from `@/lib/ask-ai`; behind Static Web Apps the request
origin is the internal localhost:8080 (the PR #153 lesson). A wording change
to any reply must also go to the verification submission.
