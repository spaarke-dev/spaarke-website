# Task 050: Cache warming

**Phase:** 4 (Instrument and launch)
**Status:** step 1 done, build deliberately deferred. Waiting on traffic, not on work
**Estimated:** 3 hours
**Dependencies:** 040
**Tags:** azure, api, ci-cd, cost

## Goal

A reader arriving after a quiet spell pays $0.04 rather than $0.69.

## Context

The prompt cache has an hour to live. On this site's traffic most readers arrive
after it has lapsed, so they pay a cache write: **$0.6855 measured in production on
2026-09-27, against $0.0397 for the turn after it.**

The owner estimated $57.96 a month. At a twelve hour window with hourly lapses the
worst case is twelve misses a day, **$8.28 a day and about $250 a month**. The real
figure is now measurable, and step 1 is to measure it rather than argue about it.

Warming costs a cached read, roughly **$0.045**, because a cache hit refreshes the
time to live. Thirteen calls across a twelve hour window is about **$0.59 a day,
$18 a month**. It wins above roughly one miss a day.

`keep-warm.yml` already exists and keeps the **Azure function** warm. The model's
prompt cache is a different thing and that workflow does not touch it.

## Steps

1. Measure the real miss rate first, with the query in `current-task.md`. If it is
   under one a day, stop and write that down instead.
2. Add a warming path that calls the model through `buildMessageRequest` with the
   same cached prefix and `maxTokens: 1`. Anything that composes its own request
   warms nothing, because the prefix has to be byte identical.
3. **Authenticate it.** A warming call costs real money, so an open endpoint is a
   way to spend it. A shared secret in the app settings and in the workflow, and a
   refusal that costs nothing when it is absent or wrong.
4. Schedule it inside the hours that matter rather than around the clock. Warming
   at 03:00 buys nothing.
5. Count the spend. Warming is spend and belongs in `recordSpend` and under the
   daily ceiling like any other turn, or the ceiling stops being the truth.
6. Emit its own event, so warming turns can be excluded from the answer stats.
7. Measure the miss rate again after a week and record both numbers.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md.

## Expected Outputs

- A warming route or a guarded probe on the existing route
- A schedule, in `keep-warm.yml` or beside it
- Before and after miss rates in `notes/cost-model.md`

## Acceptance Criteria

- [x] The measured miss rate is recorded before anything is built
- [ ] A reader arriving mid-window gets a cache hit
- [ ] The warming path refuses without the shared secret, and the refusal is free
- [ ] Warming spend is counted and sits under the daily ceiling
- [ ] Warming turns are distinguishable from reader turns in telemetry
- [ ] The after figure is measured, not projected

## Notes

Do not warm by asking a real question. `maxTokens: 1` on a trivial prompt reads the
cache and refreshes it, which is the whole job.

See `notes/cost-model.md`, and the cache warming section of `current-task.md`.


## Step 1 result, 2026-09-28: do not build yet

The gate in step 1 says stop if the miss rate is under one a day. It is zero.

Over the 30 days to 2026-09-28 there is **one** `insights.answer` event in
Application Insights, and launch verification generated it. Real reader turns:
**zero**. Measured miss rate: **0.00 a day**.

**The rate is zero because traffic is zero, not because the cache is warm.** Every
real turn so far has been a cold miss, so the per-turn miss rate is 100%. What is
missing is turns, and warming an empty window buys nothing.

At one turn a day, misses cost about $21 a month and warming costs about $18. That
is not a saving, it is a swap that adds a scheduled job, a shared secret and a
second spend path to keep correct.

**The trigger is traffic, not a date.** Re-run the query in `notes/cost-model.md`
when the assistant is taking **more than two turns a day on separate hours**, and
build then. The design in the steps above stands and needs no rework.

Recorded in `notes/cost-model.md` under "Cache warming: measured 2026-09-28, and
not built".
