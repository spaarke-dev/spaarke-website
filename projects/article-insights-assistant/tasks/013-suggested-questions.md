# Task 013: Per-article suggested questions

**Phase:** 1 (Corpus, prompt, and evaluation)
**Status:** not-started
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

- [ ] Three questions per article across all 21
- [ ] Questions differ per article rather than following a template
- [ ] Summarize present and never first
- [ ] No model call before the reader asks something
- [ ] Hand reviewed for voice

## Notes

If the generated questions read as filler, generate them once with a model
at build time and commit the output as data rather than shipping weak copy
to every reader.

See spec FR-04, FR-05.
