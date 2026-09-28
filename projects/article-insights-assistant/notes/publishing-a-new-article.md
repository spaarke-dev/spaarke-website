# Publishing a new article, with the assistant in mind

Short, because most of it is already automatic.

## What happens on its own

`npm run build` runs the corpus manifest build first. So a new MDX file in
`content/blog/` is in the model's context on the next deploy, with its headings,
its anchors and a citation marker printed beside each heading.

Nothing needs indexing. There is no retrieval layer, no vector store, no embedding
step. The whole library sits in a cached model context, which is the spec's first
decision (KD-01) and the reason this is not a website chat bot.

## The two things that are not automatic

### 1. Entry card questions

```
npm run insights:questions
```

Generates six questions for any article that does not have them and leaves the rest
alone, so it is safe to run whenever. About **$0.04 an article**. The console shows
three of the six, drawn fresh each page load, with summarize last.

Without it the console opens on that article with no chips. Degraded rather than
broken: the reader can still type a question, and every other article is
unaffected. The corpus build prints a note naming any article that is short.

Read the six before shipping. They are reader-facing copy in the reader's voice and
they occasionally name a competitor, which the prompt then constrains.

### 2. The ceiling

The corpus build prints how full the context window is and how many more articles
fit. **It warns as the headroom shrinks and fails the build when it is gone.**

At the time of writing: 92% full, room for about two more. Task 051 adds the lever
that makes the next one cheap. Read the warning rather than scrolling past it.

## What the writing itself should do

**Headings should be H2 or H3, with text distinct enough to produce distinct
anchors.** The citation anchors come from the same slugger that runs on the
rendered page, so two headings with the same words produce two anchors that differ
by a numeric suffix, and a citation is then one edit away from pointing at the
wrong one.

**Em dashes in a title will be reproduced.** The assistant quotes a title exactly
when it cites the article. Two published titles contain one and the owner has
decided they keep it; that is a deliberate exception rather than a gap in the dash
repair, which covers prose the model writes.

## After it is live

```
npm run insights:gap
```

Reports what readers asked that the articles did not answer. A question answered
from general knowledge is a subject the library does not cover, which makes this
the brief for the next piece rather than a defect report.


## When the ceiling warning appears

The build warns above 90% of the token ceiling and fails above it. The warning
now names the fix: `content/insights/corpus-tiers.json`. Adding a slug under
`tier2` holds that article as an outline rather than in full, which frees roughly
4,000 tokens and costs the assistant the ability to quote it. It stays in the
index and stays citable.

Pick which articles from telemetry rather than by feel. `insights.answer` records
`citedSlugs` on every turn, so an article nothing has cited in a month is the
candidate. Demote in one batch: each change to the tiers invalidates the prompt
cache, so the next turn afterwards costs about $0.69 instead of $0.04.

What a demotion costs an answer is measured in
`projects/article-insights-assistant/notes/cost-model.md`. Read it before
demoting an article readers ask about in detail.
