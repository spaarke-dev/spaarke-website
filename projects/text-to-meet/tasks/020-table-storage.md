# Task 020: Table storage

**Phase:** 2 (Storage and webhook)
**Status:** completed (2026-11-22)
**Estimated:** 3 hours
**Dependencies:** 011
**Tags:** azure, storage, typescript

## Goal

`src/lib/sms/store.ts` reads and writes the four tables the route needs,
with table names overridable for local checks.

## Context

Spec FR-05, FR-12, FR-14. Pattern: `src/lib/meet/store.ts` (the slot lock
from PR #142 is the model for deduplication: insert, and a 409 means
already handled).

## Steps

1. Table clients from `STORAGE_ACCOUNT_CONNECTION`, names from
   `SMS_SENDERS_TABLE`, `SMS_CONVERSATIONS_TABLE`, `SMS_INBOUND_TABLE`,
   `SMS_COUNTERS_TABLE` with defaults `SmsSenders`, `SmsConversations`,
   `SmsInbound`, `SmsCounters`. Create tables on first use, as the meet
   store does.
2. `claimInbound(messageSid, receivedAt)`: insert into `SmsInbound`
   (partition `yyyy-mm-dd`, row key `MessageSid`); returns `false` on 409.
   `classifyInbound(...)` updates the row with classification and
   conversation ID. No message text is stored.
3. Senders (partition `sender`, row key phone hash): `getSender`,
   `upsertSender` with first and last seen, `optedOut`, `optedOutAt`,
   `latestConversationId`, MEET reply count and window start, other-reply
   count and window start. ETag on updates.
4. Conversations (partition `sms`, row key conversation ID):
   `createConversation`, `getConversation`, `recordLinkOpen` (first open
   time, count, status `opened`), `markConversationBooked(id, bookingId)`.
5. Counters (partition `hour` or `day`, row key the window):
   `incrementCounter(window, cap)` with ETag retry (three attempts); returns
   whether the reply is allowed and whether this increment crossed the cap
   (so the alert email goes once per window).
6. Every call has a timeout or uses the SDK's abort signal; a storage
   failure throws to the route, which answers with an empty `<Response/>`.
7. `npm run typecheck`, `npm run lint`.
8. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/sms/store.ts`

## Acceptance Criteria

- [x] No field anywhere holds a readable phone number or message text
- [x] A second `claimInbound` with the same SID returns `false`
- [x] Concurrent counter increments do not lose counts (ETag retry)

## Notes

Exercise these against local table names from the check script in task 022
rather than writing a separate harness.

### Done (2026-11-22)

- `src/lib/sms/store.ts`: `claimInbound`, `classifyInbound`; `getSender`,
  `updateSender`, `newSender`; `createConversation`, `getConversation`,
  `recordLinkOpen`, `markConversationBooked`; `counterWindow`,
  `incrementCounter`; `isSmsStorageConfigured`.
- **One write path.** Every change to a sender, conversation, or counter
  goes through a read, change, write loop guarded by the ETag, with three
  tries and a short random pause between them. If all three lose a race it
  throws, and the route answers without a reply, the safe side of every
  limit. `updateSender` takes a function, so the route makes its rate limit
  decision inside the guarded write (task 022) and two texts at once cannot
  both take the last reply.
- **Cap alert once per window.** At the cap, the first refused request marks
  the counter row (`alertedAt`) and gets `alert: true`; later ones do not.
  The hour and day counters are separate rows, so a reply refused by one may
  already have been counted by the other: a small overcount, which errs
  toward replying less.
- **Row keys are checked** (MessageSid, phone hash, conversation ID) before
  any call, so no request value can carry `/`, `#`, or `?` into a key.
- Every call has a 5 second timeout (the SDK's abort signal).
- With `MEET_DEV_MOCK=1` under `next dev`, rows go to the in-memory tables
  the /meet mock uses, so the route can run locally without storage.
- **Checked against the dev mock only.** There is no local storage
  connection (no `STORAGE_ACCOUNT_CONNECTION` in `.env.local`, no Azurite),
  so 17 store cases were added to `npm run sms:check` under the dev mock:
  duplicate SID refused, unsafe key refused, sender create and update, six
  concurrent sender updates lose nothing, conversation opens and booking,
  twelve concurrent increments against a cap of 5 allow exactly 5, one alert
  per window, a new window starts fresh. 116 cases pass; 20 repeated runs
  all passed. The same code against real Table Storage is task 022.
