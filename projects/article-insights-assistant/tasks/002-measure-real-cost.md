# Task 002: Measure what a real turn costs

**Phase:** 0 (Foundation and cost truth)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 001
**Tags:** azure, performance, config

## Goal

A recorded, measured per-turn cost at realistic corpus size, compared
against the 500 USD monthly ceiling, with the resulting rate-limit numbers
written down.

## Context

NFR-01 and NFR-02 are currently sized on an estimate. Every rate limit and
the whole cost model rest on a number nobody has measured. This task
replaces the estimate with a measurement before anything is built on top
of it.

If the arithmetic does not work, the design changes here. That is the
entire point of doing it in phase 0.

## Steps

1. Assemble a stand-in corpus payload of roughly 100,000 tokens from
   `content/blog/`. A rough concatenation is enough; the real manifest is
   task 010.
2. Make a call with the corpus in a cached system block and a short
   question.
3. Record from the response: input tokens, cache creation tokens, cache
   read tokens, output tokens.
4. Make a second call with the same cached block and a different question.
   Record the same figures and confirm the cache was read rather than
   rewritten.
5. Look up current Foundry rates for the deployed model, including the
   cache read and cache write rates, which differ from base input.
6. Compute cost per turn on a cache hit and on a cache miss.
7. Divide the 500 USD ceiling by the per-turn cost to get a monthly turn
   budget, then derive per-IP hourly and daily limits from it.
8. Write the numbers and the arithmetic into `notes/cost-model.md`.
9. If per-turn cost puts the ceiling out of reach, stop and raise options
   with the owner: a smaller model, a trimmed corpus, or a lower ceiling.
10. Verify acceptance criteria are met.
11. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `notes/cost-model.md` - measured token counts, rates, per-turn cost,
  derived limits, and the arithmetic
- Proposed values for the NFR-02 rate limits, replacing the placeholders

## Acceptance Criteria

- [ ] Cost per turn measured on both a cache hit and a cache miss
- [ ] Cache read confirmed working, not silently rewriting each call
- [ ] Monthly turn budget derived from the 500 USD ceiling
- [ ] Rate-limit numbers proposed from the measurement rather than guessed
- [ ] If the ceiling is unreachable, options raised rather than absorbed

## Notes

Cache write costs more than base input and cache read costs far less. A
design that writes the cache on every call is worse than no cache at all,
so step 4 is the one that matters.

Record the date with the rates. They change.

See spec NFR-01, NFR-02, KD-01.
