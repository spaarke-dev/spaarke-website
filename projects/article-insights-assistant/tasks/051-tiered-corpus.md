# Task 051: Tiered corpus

**Phase:** 4 (Instrument and launch)
**Status:** complete (2026-09-28)
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

- [x] With everything in tier 1, the assembled prompt is byte identical to today's
- [x] A demoted article still appears in the index and is still citable as a whole
- [x] Its headings still carry citation markers that resolve
- [x] The build reports the headroom a demotion would buy
- [x] The quality cost of a demotion is measured against the evaluation set
- [x] Which article to demote is answerable from `citedSlugs` telemetry

## Notes

Byte identical matters more than it sounds. The cached prefix is the cost model,
and a change that shifts one character invalidates it for every reader.

Do not put the tier in article frontmatter. It is an operational decision about the
assistant, not a fact about the writing, and the writer should not have to think
about it.

See the context headroom section of `current-task.md`.


## Result, 2026-09-28

Built, measured, and shipped with every article still in tier 1.

**The lever is `content/insights/corpus-tiers.json`.** Adding a slug under
`tier2` demotes that article. A slug that is not a published article fails the
build rather than warning, because a typo there would demote nothing while
looking like it had worked, and would be discovered as a ceiling error several
articles later.

**Byte identity is proved, not asserted.** The assembled corpus block hashes to
`7bf6dbf1...d92f45` at 476,877 characters both before and after the change, so no
reader's cached prefix moved.

**The build now reports the lever.** Current output says how many articles are
held as outlines and what demoting eight would free: **24,751 to 77,331 tokens**,
four to thirteen more articles, depending which eight. The ceiling warning and
the ceiling error both now name the config and point at `citedSlugs` for deciding
which articles to pick.

**The quality cost is measured**, not assumed, in `notes/cost-model.md` under
"What a demoted article costs an answer". Demoting `the-20b-blind-spot` and
re-running case `co-04`: still passes, still cited, answer a third shorter, and
it told the reader it was holding an outline and could not quote. Anchors from
the demoted article still resolved against the rendered page, which is the
evaluation runner's own check rather than a claim.

**Eleven checks added** to `npm run insights:console`, including one asserting
that every published article ships at tier 1, so a stray demotion cannot reach
readers unnoticed.

**One operational note:** changing any tier changes the cached prefix, so the
next turn after a demotion is a cache write at about $0.69. Demote in one batch.
