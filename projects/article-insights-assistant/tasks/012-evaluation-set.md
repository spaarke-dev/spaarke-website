# Task 012: Evaluation runner and cases

**Phase:** 1 (Corpus, prompt, and evaluation)
**Status:** not-started
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

- `scripts/eval-insights.mjs` runner
- `projects/article-insights-assistant/eval/cases.json`
- `notes/evaluation.md` on how to run and read it

## Acceptance Criteria

- [ ] 30 to 50 cases across all nine categories
- [ ] Runner reports pass or fail per case, showing the failing output
- [ ] Structural assertions cover citation presence, slug, anchor and
      provenance label
- [ ] Every anchor asserted against the rendered article, not the manifest
- [ ] Run cost reported

## Notes

Cases will need rewriting as articles are added, so store them as data
rather than embedding them in a script.

The false-premise cases are the most valuable and the easiest to write
badly. A good one uses vocabulary a competitor actually uses and that
Spaarke's articles explicitly push back on.

See spec FR-09, FR-03, FR-10, FR-11.
