# Task 013: Per-article suggested questions

**Phase:** 1 (Corpus, prompt, and evaluation)
**Status:** complete
**Estimated:** 2 hours
**Dependencies:** 010
**Tags:** content, typescript, mdx

## Goal

Three extending questions per article, generated at build time, plus a
summarize option that is never offered first.

## Context

The entry points decide what readers believe the tool is for. A summarize
button as the invitation is a machine for destroying the reason the
articles are long, which is the whole go-to-market premise.

Extending questions send a reader into the piece. Summarize is a fallback
for someone who would otherwise bounce, which is why it is present and
fourth.

## Steps

1. Derive three questions per article at build time from `keyTakeaways`,
   `summary` and `tags`. Build time, not per request, so no model call
   happens before the reader has asked anything.
2. Favour question shapes that only work if the article exists: what this
   means for a department of a given size, how it differs from a vendor's
   framing, what decisions it says the reader has to make, and what the
   rest of the series adds.
3. Confirm questions differ meaningfully per article rather than being a
   template with the title swapped.
4. Add the summarize option, positioned after the three.
5. Review the output for all 21 articles by hand. Generated questions are
   reader-facing copy and get the same scrutiny as any other.
6. Verify acceptance criteria are met.
7. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- Suggested questions in the corpus manifest, per article
- `notes/suggested-questions-review.md` recording the hand review

## Acceptance Criteria

- [x] Three questions per article across all 24, checked on every run of
      `npm run insights:check -- --offline`
- [x] Questions differ per article rather than following a template. Fifteen of
      seventy-two were rewritten in review, ten of them to break one repeated
      objection shape
- [x] Summarize present and never first. Ordering is enforced in
      `entryOptions`, not left to the component, and a check asserts it
- [x] No model call before the reader asks something. Generated once, committed
      as data, read from the corpus manifest
- [x] Hand reviewed for voice, recorded in `notes/suggested-questions-review.md`

## Notes

If the generated questions read as filler, generate them once with a model
at build time and commit the output as data rather than shipping weak copy
to every reader.

See spec FR-04, FR-05.

## Outcome

Generated in 24 warm calls for about $0.80, reviewed line by line, and committed
to `content/insights/suggested-questions.json`.

The review found one false premise, which is the finding worth carrying: a
question asked about report cards in an article that has none. A question with a
false premise invites an answer that either corrects the reader or plays along,
and neither is good. Every technical term and cross-reference the seventy-two
questions assert is now verified against the corpus text.

A missing questions file is a warning rather than a build failure. The console
opens with summarize alone, which is degraded and not broken, and an article
should not be blocked from publishing by a model call.

`src/lib/insights/questions.ts` holds the ordering and the copy rules, so
summarize being fourth is a property of the code rather than a convention the
component has to remember.
