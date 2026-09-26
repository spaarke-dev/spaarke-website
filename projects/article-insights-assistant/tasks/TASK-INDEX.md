# Task index: Article Insights Assistant

> Registry and status. Update the status column as tasks complete.
> Generated 2026-09-25.

## Status

| ID | Task | Phase | Depends on | Est. | Status |
|---|---|---|---|---|---|
| 001 | [Record the Foundry deployment](001-record-foundry-deployment.md) | 0 | none | 2h | **complete** |
| 002 | [Measure what a real turn costs](002-measure-real-cost.md) | 0 | 001 | 2h | **complete** |
| 010 | [Build-time corpus manifest](010-corpus-manifest.md) | 1 | none | 3h | **complete** |
| 011 | [System prompt and labeled provenance](011-system-prompt.md) | 1 | 010 | 4h | **complete** |
| 012 | [Evaluation runner and cases](012-evaluation-set.md) | 1 | 011 | 4h | **complete** |
| 013 | [Per-article suggested questions](013-suggested-questions.md) | 1 | 010 | 2h | **complete** |
| 020 | [Streaming endpoint](020-streaming-endpoint.md) | 2 | 002, 011 | 4h | **complete** |
| 021 | [Abuse and spend defences](021-abuse-and-spend-defences.md) | 2 | 020 | 4h | **complete** |
| 022 | [Conversation capture](022-conversation-capture.md) | 2 | 020 | 2h | not-started |
| 030 | [Right-rail console](030-rail-console.md) | 3 | 020, 013 | 4h | not-started |
| 031 | [Mobile bottom sheet](031-mobile-sheet.md) | 3 | 030 | 3h | not-started |
| 040 | [Instrumentation and baseline](040-instrumentation.md) | 4 | 030, 031 | 3h | not-started |
| 090 | [Project wrap-up](090-project-wrap-up.md) | 4 | 040 | 3h | not-started |

**13 tasks, roughly 40 hours.**

## Phases

| Phase | Tasks | What it proves |
|---|---|---|
| 0 Foundation and cost truth | 001, 002 | A real call works and the arithmetic holds |
| 1 Corpus, prompt, evaluation | 010 to 013 | Answers are good, measurably |
| 2 The endpoint | 020 to 022 | It streams, it is safe, it records |
| 3 The interface | 030, 031 | Both surfaces, accessible |
| 4 Instrument and launch | 040, 090 | The effect can be judged |

## What can run in parallel

Task 010 has no dependencies and can start alongside 001. Task 013 needs
only 010. Tasks 021 and 022 both depend on 020 and are independent of each
other.

The critical path is 001, 002, 020, 030, 031, 040, 090. Task 011 sits
beside it and blocks 020, so the prompt work should not wait for the cost
measurement to finish.

## Gates that stop the line

**After 002. Passed 2026-09-26.** Measured $0.032 a warm turn and $0.379
cold, against a 500 USD ceiling that buys about 15,600 warm turns a month.
Caching confirmed working. The design is affordable and phase 2 can
proceed.

**After 012. Met in part, 2026-09-26.** The suite runs and reports per case, and
lands between 32 and 39 of 40 across runs, which is a rate rather than a verdict
because the model is nondeterministic and the assertions are strict.
Cross-article cases pass most of the time and citations resolve after mechanical
repair. Mixed provenance labeling is not yet reliable. Three residual behaviours
are recorded in `notes/evaluation.md`. The endpoint does not depend on closing
them, so phase 2 can proceed, but they should be closed before launch.

**Inside 020. Open.** Streaming works through Next locally, proven with six
chunks half a second apart. Whether Azure Static Web Apps buffers is still
unproven, and if it does the interface design changes. The route carries a probe
that needs no flag and costs nothing:
`curl -N https://spaarke.com/api/article-insights?probe=stream`. Run it against
the deployed site before task 030.

## Notes from work so far

**The corpus is 24 articles, not 21.** The spec's figure was an estimate. The
assembled prompt measures 152,357 tokens, 95% of the 160,000 ceiling, with room
for roughly one more article. The build's estimate previously covered the prose
and not the index, the article tags, the heading markers or the instruction
block, which is why it reported 86%.

**Sonnet 5 uses the tokenizer introduced with Claude 4.7**, which produces
roughly 30% more tokens for the same text than earlier models. The build
estimate accounts for it. Task 002 measures the real figure, and that
measurement governs the cost model rather than any estimate.

**Anchor fidelity is verified, and it found a live bug.** Checking the
manifest's anchors against the rendered pages exposed that `extractToc` had
drifted from `rehype-slug`, leaving 7 dead table of contents links across 3
published articles. Fixed separately in PR #89. All 32 sampled manifest
anchors now resolve against production.
