# Task 020: Table storage

**Phase:** 2 (Storage and webhook)
**Status:** not-started
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

- [ ] No field anywhere holds a readable phone number or message text
- [ ] A second `claimInbound` with the same SID returns `false`
- [ ] Concurrent counter increments do not lose counts (ETag retry)

## Notes

Exercise these against local table names from the check script in task 022
rather than writing a separate harness.
