# Task 012: recordActivity

**Phase:** 1 (Store and activity log)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 011
**Tags:** typescript, azure, storage, performance

## Goal

`recordActivity()` appends an activity exactly once per idempotency key, and `recordActivitySafe()` lets any public route call it without risk to the visitor.

## Context

FR-05 (append-only log, idempotency key from source plus source ID, no email bodies), FR-06 (failures never fail or slow the visitor), NFR-03 and NFR-04 (two tables: by contact and by month).

## Steps

1. `src/lib/market/activity.ts`:
   - Input: `{ type, source, sourceId, occurredAt, email? | contactId?, contactHints?, campaignSlug?, memberCode?, utm?, summary?, subject?, webLink?, mailbox?, visibility? }`.
   - `idempotencyKey = sha256(source + ":" + sourceId)`.
   - Resolve the contact (task 011) when only an email is given.
   - Write the idempotency marker first (`MaActivities`, partition `idem`, row key the hash) with `createEntity`; on 409 return `{ duplicate: true }` and write nothing else.
   - Write the activity row (partition contact ID, row key `invertedTime(occurredAt) + "-" + hash[0..8]`) and the month index row (`MaActivityByMonth`, partition `monthKey`, same row key, with the contact ID and a copy of the display fields).
   - Update `contact.lastActivityAt` when newer.
   - Reject a `summary` over 280 characters and any field named `body`.
2. `recordActivitySafe(input)`: races `recordActivity` against a 1,500 ms timeout (or the value the spike measured), catches everything, logs with `trackEvent("market.activity_failed", { type, source, reason })`, and resolves either way. Never logs the email.
3. Extend `scripts/check-market.mts`: re-running the same input leaves the count unchanged; the month index and the contact timeline agree; with a bad connection string `recordActivitySafe` resolves within the timeout.
4. `npm run typecheck`, `npm run lint`, `npm run market:check`.

## Expected outputs

- `src/lib/market/activity.ts`
- `scripts/check-market.mts` additions

## Acceptance criteria

- [ ] Re-running any write leaves the activity count unchanged (FR-05 acceptance).
- [ ] `recordActivitySafe` never throws and returns within the timeout when storage is down.
- [ ] No email body can be stored.

## Notes

- Why awaited with a timeout and not left running: on SWA's managed functions a promise left after the response can be frozen, so writes would be lost silently. See `plan.md`, Design decisions.
- Spec references: FR-05, FR-06, NFR-03, NFR-04.
