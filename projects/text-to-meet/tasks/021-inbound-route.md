# Task 021: Inbound webhook route

**Phase:** 2 (Storage and webhook)
**Status:** completed (2026-11-22)
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

- [x] With `SMS_MODE` unset the route returns 404
- [x] Nothing reads `From`, `To` or `Body` before the signature passes
- [x] The reply link uses `siteUrl()`, never the request's origin
- [x] Any thrown error after the signature check yields 200 and an empty
      `<Response/>`

## Notes

`siteUrl()` comes from `@/lib/ask-ai`; behind Static Web Apps the request
origin is the internal localhost:8080 (the PR #153 lesson). A wording change
to any reply must also go to the verification submission.

### Done (2026-11-22)

- `src/app/api/sms/inbound/route.ts`: the HTTP side. Switch (404), form
  content type and 16 KB limit (400), signature over `SMS_WEBHOOK_URL` with
  current and previous tokens (403, `sms.bad_signature`), `AccountSid` and
  `To` match (403, `sms.wrong_destination`). Then everything answers 200
  with TwiML; an error becomes `trackException` and an empty `<Response/>`.
  Telemetry flushed before every return. Events carry labels only
  (classification, code, reason), never a number or hash.
- `src/lib/sms/inbound.ts`: `handleInbound()`, the message side. Claim the
  `MessageSid`, region check, hash, classify, then stop, start, help (record
  and stay silent), meet, or other. The readable number never leaves the
  function.
- `src/lib/sms/replies.ts`: `twiml()`, `twimlBody()`, `xmlEscape()`. The
  MEET reply's "Msg & data rates" needs the escaping.
- **Moved forward from task 022:** the per-sender limits (3 MEET replies and
  1 nudge per 24 hours) are decided inside the guarded sender write in
  `inbound.ts`, because that write is where they belong. Task 022 keeps the
  site-wide caps, the cap email, the in-memory guard, and the server mode
  checks.
- **Conversation order:** a new conversation row is created before the
  sender points at it, so a link never names a missing conversation. A
  reused ID is read first and replaced if missing. A race between two MEETs
  at once can leave one unused conversation row; that is harmless.
- Store changes: `InboundClassification` gains `blocked` (sender outside
  +1, never hashed); `SenderRecord` gains `latestConversationAt`.
- **Checked:** 28 route cases added to `npm run sms:check`, calling the
  route's `POST` directly with built requests and the dev mock store (144
  cases in all, all pass). They cover each 404, 400 and 403; a body changed
  after signing; a signature over the request's own URL; MEET with an
  escaped reply whose link verifies and uses `siteUrl()`; a duplicate
  `MessageSid`; conversation reuse; the fourth MEET; the nudge and its
  limit; HELP, STOP, START, plain-language stop; a sender outside +1; no
  number or message text in any table; and a storage failure answering 200
  with an empty `<Response/>`. `npm run build` passes and lists the route.
- Not yet measured: latency against real Table Storage (task 022).
