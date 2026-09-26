# Task 021: Abuse and spend defences

**Phase:** 2 (The endpoint)
**Status:** complete
**Estimated:** 4 hours
**Dependencies:** 020
**Tags:** api, azure, storage, forms, testing

## Goal

A scripted client cannot run up the bill, and a breach of the daily ceiling
degrades the feature rather than the budget.

## Context

The owner named this a priority. A public endpoint that calls a frontier
model on every request is unbounded spend and an attractive target, and
abuse shows up as an invoice rather than an outage.

The existing limiter cannot do this job. `src/lib/rate-limit.ts` keeps
counters in a module-level `Map`, so it resets on every function recycle
and is not shared across instances. That is adequate against contact-form
spam, where a missed block costs one email. Here a missed block costs
money, and a scripted client simply waits out a recycle.

Four layers, because no single one holds.

## Steps

1. Build a durable per-IP counter in Table Storage, keyed on the existing
   IP hash from `src/lib/ip-hash.ts`. Survives recycles and is shared
   across instances.
2. Set per-hour and per-day limits from the measured numbers in
   `notes/cost-model.md`, not from the placeholder values in the spec.
3. Add reCAPTCHA on the first question of a session, reusing the site's
   existing keys and the `verifyCaptcha` pattern from the contact route.
   Verify server side. Do not gate later turns in the same session, which
   would make conversation painful.
4. Add a per-session question cap.
5. Add a global daily ceiling across all users. When tripped, the console
   renders disabled with an explanation and an invitation to read the
   article or get in touch. It does not fail silently and it does not throw
   a generic error.
6. Emit a distinct telemetry event for each defence when it fires, so the
   logs distinguish abuse from ordinary load.
7. Write the 90-day retention policy for conversation capture, and the
   mechanism that enforces it.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/insights/rate-limit-durable.ts`
- `src/lib/insights/ceiling.ts` for the global daily limit
- Table Storage table for counters
- Retention mechanism for the conversation log

## Acceptance Criteria

- [x] A POST with no captcha token cannot reach the model, verified against real
      storage: the guard refuses before any model call
- [x] Per-IP counters survive a process ending, verified by running two
      processes, the second with an empty in-memory Map
- [x] Global ceiling, when tripped, returns DAILY_CEILING with copy that says the
      assistant is resting, not that something broke
- [x] Each defence emits its own telemetry event, `insights.blocked.<defence>`
- [x] Question text older than 90 days is blanked, leaving the aggregate row. See
      `notes/conversation-schema.md`
- [x] Later turns in a session are not re-gated by captcha, and a fabricated
      history cannot use that to skip it

## Notes

Test the recycle case rather than reasoning about it. The failure mode of
the existing limiter is invisible in development, where the process never
recycles, which is exactly why it survived this long.

The global ceiling needs a deliberate message. "Something went wrong" is
wrong; the feature is fine and it is resting.

See spec NFR-02, NFR-02a, NFR-03, NFR-07, FR-07.

## Outcome

`src/lib/insights/rate-limit-durable.ts` for the counters, `ceiling.ts` for the
daily spend limit, `guard.ts` for the policy and its ordering. Eighteen checks in
`scripts/check-insights-defences.mts`, run against real Table Storage in its own
table. Full detail in `notes/endpoint-and-defences.md`.

**The ceiling counts money, not requests.** A cache miss costs $0.379 against
$0.032 for a cached turn, so roughly 1,300 cache-missing requests would spend a
month's budget in a day while a request counter sat well inside its limit.

**The verified session row is what makes the captcha more than decoration.** Only
the first question of a session is gated, which leaves an obvious bypass: claim the
conversation is already under way. A passing captcha now writes a row, and a later
turn whose session has no row is refused. That bypass is in the test.

**The defences fail closed.** If the counters cannot be read or written, the
request is refused. Unmetered calls to a frontier model are the failure this
prevents, so a few minutes without the feature is the better outcome. Development
without a storage connection falls back to the in-process limiter and warns.

**The recycle case was tested rather than reasoned about**, as the task asked. One
process wrote counts and verified a session; a second process read what the first
one wrote and its decision followed the stored count.
