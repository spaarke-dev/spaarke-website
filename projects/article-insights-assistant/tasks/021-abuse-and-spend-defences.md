# Task 021: Abuse and spend defences

**Phase:** 2 (The endpoint)
**Status:** not-started
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

- [ ] A POST with no captcha token cannot reach the model
- [ ] Per-IP counters survive a function recycle, verified by forcing one
- [ ] Global ceiling, when tripped, disables the console with an
      explanation rather than an error
- [ ] Each defence emits its own telemetry event
- [ ] Question text older than 90 days is removed, leaving aggregate counts
- [ ] Later turns in a session are not re-gated by captcha

## Notes

Test the recycle case rather than reasoning about it. The failure mode of
the existing limiter is invisible in development, where the process never
recycles, which is exactly why it survived this long.

The global ceiling needs a deliberate message. "Something went wrong" is
wrong; the feature is fine and it is resting.

See spec NFR-02, NFR-02a, NFR-03, NFR-07, FR-07.
