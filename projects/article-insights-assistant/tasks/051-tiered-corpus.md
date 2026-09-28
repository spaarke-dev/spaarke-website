# Task 051: Tiered corpus

**Phase:** 4 (Instrument and launch)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 010, 040
**Tags:** typescript, content, cost

## Goal

The library can grow past the context window without the build failing and without
retrieval.

## Context

The corpus is **146,884 estimated tokens against a 160,000 ceiling**, which exists
because the deployment has a **200K** window and the rest is for the conversation
and the answer. Room for about two more articles, and the build fails hard when it
is gone.

The owner asked to address it now rather than when it lands, which is right: the
decision is cheaper to make with this context than to rediscover in three articles'
time.

## The design

A **tier** per article in the manifest.

- **Tier 1**, the default, is today's behaviour: full body, a citation marker on
  every heading.
- **Tier 2** is title, summary, key takeaways and headings with their markers, and
  no body. About **350 tokens against 4,910**, so demoting one frees roughly
  **4,560**.

**Ship it with every article in tier 1.** Nothing changes on the day. When the
ceiling approaches, demoting an article is a one line change, and demoting the
eight least cited frees about 36,000 tokens, which is room for seven more.

A tier 2 article stays findable and citable as a whole, because its summary,
takeaways and headings stay in context. What it loses is verbatim quotation. That
keeps the whole-corpus reasoning the spec is built on, which retrieval would not,
and it degrades one article at a time rather than all of them at once.

## Steps

1. Add `tier` to the manifest, defaulting to 1, driven by a small committed config
   rather than by frontmatter, so demoting an article is not an edit to the article.
2. Teach `buildCorpusBlock` to render a tier 2 article as head and headings only.
   The headings keep their citation markers, because a tier 2 article must still be
   citable by section.
3. Say so in the corpus block. A model that cannot see an article's body should be
   told that it is reading an outline, or it will cite what it cannot quote.
4. Make the build report both numbers: tokens now, and tokens if the N least cited
   were demoted, so the lever is visible before it is needed.
5. Add an evaluation case that asks about a tier 2 article, run with one demoted,
   and record what the answer loses. That is the real cost of this design and it
   should be measured once rather than assumed.
6. Leave every article in tier 1.
7. Verify acceptance criteria are met.
8. Update TASK-INDEX.md.

## Expected Outputs

- `tier` in the manifest and in `buildCorpusBlock`
- A committed tier config
- The demotion maths in the build output
- What a tier 2 answer loses, measured, in `notes/cost-model.md`

## Acceptance Criteria

- [ ] With everything in tier 1, the assembled prompt is byte identical to today's
- [ ] A demoted article still appears in the index and is still citable as a whole
- [ ] Its headings still carry citation markers that resolve
- [ ] The build reports the headroom a demotion would buy
- [ ] The quality cost of a demotion is measured against the evaluation set
- [ ] Which article to demote is answerable from `citedSlugs` telemetry

## Notes

Byte identical matters more than it sounds. The cached prefix is the cost model,
and a change that shifts one character invalidates it for every reader.

Do not put the tier in article frontmatter. It is an operational decision about the
assistant, not a fact about the writing, and the writer should not have to think
about it.

See the context headroom section of `current-task.md`.
