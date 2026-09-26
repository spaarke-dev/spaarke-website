# Task 012: Evaluation runner and cases

**Phase:** 1 (Corpus, prompt, and evaluation)
**Status:** complete
**Estimated:** 4 hours
**Dependencies:** 011
**Tags:** testing, typescript

## Goal

Thirty to fifty cases with known-good expectations, runnable on demand,
reporting pass or fail per case.

## Context

This is the step most teams skip and the reason these tools ship bad.
Without it there is no way to know whether a prompt change helped or hurt,
and prompt changes will happen constantly.

It exists before the interface deliberately. A console that looks finished
invites shipping regardless of answer quality.

## Steps

1. Write a runner that executes cases against the composed prompt and
   reports per case.
2. Write cases in these categories, and do not skip the awkward ones.
   - Corpus-only, answerable from one article. Expect a citation.
   - Cross-article, needing three or more articles. Expect multiple
     citations across slugs.
   - Not covered, deliberately outside the corpus. Expect a
     general-knowledge label, not a refusal and not a fabricated citation.
   - Mixed, part corpus and part general. Expect both, distinguished.
   - Legal advice, inviting a specific legal position. Per owner decision
     these are answered under labeled provenance rather than refused.
     Expect a useful answer that does not purport to advise.
   - False premise, built on a competitor's vocabulary or a claim Spaarke
     rejects. Expect correction rather than accommodation.
   - Scope boundary, such as pricing or support. Expect redirection.
   - No-question, where asking the reader something back would be
     gratuitous. Expect no assistant-initiated question.
   - Stance, where the wrong answer contradicts `voice/stance.md`, for
     instance on who owns the definitions.
3. Assert on structure where possible: citation present, slug correct,
   anchor resolves, provenance label present.
4. For judgement-based cases, record the answer for human review rather
   than asserting on exact wording.
5. Make the run cost visible, since each run calls the model.
6. Document how to run it in `notes/evaluation.md`.
7. Verify acceptance criteria are met.
8. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `scripts/eval-insights.ts` runner, TypeScript rather than `.mjs` so that it
  imports the real prompt composer. A runner that builds its own prompt tests
  nothing
- `projects/article-insights-assistant/eval/cases.json`
- `notes/evaluation.md` on how to run and read it

## Acceptance Criteria

- [x] 40 cases across all nine categories
- [x] Runner reports pass or fail per case, showing the failing output, and
      writes every answer to `eval/last-run.json`
- [x] Structural assertions cover citation presence, slug, anchor, provenance
      label, quotation grounding, dashes, prose questions and system prompt
      leakage
- [x] Every anchor asserted against the rendered page on spaarke.com, fetched
      once per article per run
- [x] Run cost reported per case and for the run

## Notes

Cases will need rewriting as articles are added, so store them as data
rather than embedding them in a script.

The false-premise cases are the most valuable and the easiest to write
badly. A good one uses vocabulary a competitor actually uses and that
Spaarke's articles explicitly push back on.

See spec FR-09, FR-03, FR-10, FR-11.

## Outcome

Forty cases, eight full runs, about 18 USD, and six prompt changes caused by what
the runs showed. `notes/evaluation.md` records how to run it, how to read the
rate, and the five findings.

The largest was that extended thinking was on at the deployment. Eleven of the
first forty answers came back completely empty because 1,999 of 2,000 output
tokens went into a thinking block. Every call now goes through one request
builder, so the endpoint cannot inherit the same defect.

Three model behaviours are now repaired mechanically rather than argued with:
citations corrected, non-verbatim quotations demoted to paraphrase, dashes
replaced. The counts print on every run, because they are the rate at which the
instructions are not landing.

**The pass rate is a rate, not a verdict.** The same suite against the same
prompt lands between 32 and 39 of 40. Read one run as a sample.

**Phase 1's gate is met in part.** Cross-article cases pass most of the time,
citations resolve after repair, and provenance is right on corpus-only and
general questions. Mixed labeling is not yet reliable, and that is recorded
rather than smoothed over. Whether it is enough to start phase 2 is the owner's
call; task 020 does not depend on it.
