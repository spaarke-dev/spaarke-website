# Current task: Article Insights Assistant

> Context recovery. A session picking this up cold reads this file first,
> then `tasks/TASK-INDEX.md`, then `spec.md`.
>
> Last updated 2026-09-26, after tasks 020, 021 and 022. Phase 2 is complete.

**Active task:** none in progress.
**Next task:** `030-rail-console.md`, then `031`.

## What this is, in one paragraph

An AI console in the article rail that lets a reader interrogate the piece
and the library around it. The whole 24-article corpus sits in a cached
model context, so it reasons across articles with no retrieval layer, and
every claim is labeled with where it came from. It is not a website chat
bot. It is also a demonstration of Spaarke's own product thesis, which is
why visible citation is a requirement rather than a nicety.

## Where things stand

**Phase 0 is complete and its gate passed.** Tasks 001, 002 and 010 are
done. The design is proven affordable, which was the thing that had to be
true before anything else got built.

| Task | State |
|---|---|
| 001 Foundry deployment | complete |
| 002 Cost measurement | complete, gate passed |
| 010 Corpus manifest | complete |
| 011 System prompt | complete |
| 012 Evaluation set | complete, gate met in part |
| 013 Suggested questions | complete |
| 020 Streaming endpoint | complete, switched off behind INSIGHTS_ENABLED |
| 021 Abuse and spend defences | complete, verified against real Table Storage |
| 022 Conversation capture | complete |
| 030 Rail console | **next** |
| 031, 040, 090 | not started |

## The measured numbers, which are not estimates

Two live calls on 2026-09-26 against `spaarke-website-claude-sonnet-5`:

- Warm turn (cache hit) **$0.032**, 3.1s
- Cold turn (cache write) **$0.379**, 4.6s
- Corpus **137,341 tokens** of prose, 24 articles. The assembled prompt measures
  **152,357 tokens**, 95% of the 160,000 ceiling
- Prompt caching confirmed working

The write is about twelve times the turn, so cache misses are the entire
cost model. Full detail in `notes/cost-model.md`.

## Deferred by the owner on 2026-09-26

Both of these are real and neither blocks the build. **Do not spend session
time on them until the project is further along.**

- **Cost work**, including the hourly cache warming that would cut per-turn
  cost from $0.379 to $0.032. Designed, costed, not built.
- **Context window headroom.** The assembled prompt measures 152,357 tokens,
  **95%** of the 160,000 ceiling, with room for roughly one more article. Task
  011 found the earlier 86% was the prose alone, and the build now counts the
  index, the article tags, the heading markers and the instructions. The build
  warns on every run and fails hard when the headroom is gone.

Also deferred: rotating the Foundry API key. The owner judged the resource
not client-confidential. It was pasted into a chat transcript and this
repository is public.

## Branch and PR state, read this before committing anything

Phase 1 is merged to `main`: PR #87 the scaffold, #91 the prompt, #92 the entry
card questions, #93 the evaluation suite.

The privacy policy change was **deliberately split out** of that PR. It
adds an "Article assistant" section written in the present tense, and
merging it before the feature ships would have the live policy describe
something that does not exist. The patch is preserved on its own branch,
unmerged, to land with the feature. Do not fold it back in early.

If `projects/article-insights-assistant/` is missing, PR #87 has not
merged. Check out the branch.

## Decisions already made, do not relitigate

- **No retrieval layer.** Whole corpus in cached context. Spec KD-01. If a
  vector store starts to look necessary, that is the headroom decision
  above, not a missing utility.
- **Claude in Microsoft Foundry**, `spaarke-website-claude-sonnet-5`,
  `DataZoneStandard` so inference stays in the US. Website-specific
  resource so marketing traffic cannot consume product quota.
- **The Spaarke BFF cannot be reused.** Its `Services/Ai` layer authorizes
  per user against per-document access, which does not transfer to a public
  endpoint with no user and no documents. Spec KD-03.
- **Open to everyone**, rate limited, no email gate.
- **Mobile is a bottom sheet** behind a floating button.
- **$500 a month** inference ceiling.
- **All 24 articles** in release one.
- **90-day retention** for question text, aggregates after.
- **A disclaimer, not a legal-advice refusal path.**
- **Playground Instructions, Knowledge and Memory stay empty.** They
  configure the Playground and Agents service, not the Messages API this
  project calls.

## Two things to do before task 030

**Decide what to do about streaming, because Azure Static Web Apps buffers.**
Proven against the deployed site: every chunk arrives at the end, and the response
carries `Content-Length` rather than chunked encoding. The same build streams
under `next start`, so it is the platform. The reader waits for the whole answer,
3.6 to 22.5 seconds measured. Three options with their costs are in
`notes/endpoint-and-defences.md`, the recommendation is to write partial answers to
storage and poll for them, and the choice is the owner's. **Task 030 renders
differently depending on it.**

**Switch the endpoint on.** `INSIGHTS_ENABLED=true` in Azure Static Web Apps app
settings. It ships off because nothing calls it yet, not because it is unsafe: the
defences are in place and verified.

**Merge PR #90, the privacy policy.** The live policy does not mention the
assistant, and task 022 records reader questions for 90 days. The wording is
written and held in draft on purpose, so the policy does not describe a feature
nobody can use. It has to go live with the console, and not after it.

## Read these notes before touching the prompt or the endpoint

`notes/prompt-design.md` records the wire format and why each part of it is
shaped that way. `notes/evaluation.md` records how to run the suite, how to read
its rate, and the three behaviours that are still not right.
`notes/endpoint-and-defences.md` records what the route does, what it refuses,
what was verified against real infrastructure and what was not.

**Extended thinking is on at the deployment and it destroys answers.** Eleven of
forty evaluation cases came back completely empty because 1,999 of 2,000 output
tokens went into a thinking block. Every call goes through
`buildMessageRequest` in `src/lib/insights/prompt.ts`, which disables it. Task
020 must use that builder rather than composing its own request, or it inherits
the same defect. The model also rejects `temperature` as deprecated.

**Three model behaviours are repaired mechanically** in `parseAnswer`: citations
corrected, non-verbatim quotations demoted to paraphrase, dashes replaced. The
endpoint should keep using it rather than streaming raw text to the client, and
task 030 needs the repaired text.

**Phase 1's gate is met in part.** The suite lands between 32 and 39 of 40 across
runs. Mixed provenance labeling is not yet reliable. Recorded rather than
smoothed over, and it does not block task 020.

## Findings that shape the work still to do

**Read `notes/prompt-design.md` before touching the prompt.** It records the wire
format, the four decisions behind it, six findings from live runs, and the ten
cases task 012 should carry. Every one of them came from a real answer rather
than from reasoning about the prompt.

**The system prompt bans em dashes and a check enforces it.** The sample answer
in task 002 contained one. `scripts/check-insights-prompt.ts` now fails on a dash
in the instructions or in any live answer, using the same lookarounds as
`scripts/voice-lint.mjs`.

**Citations are copied, not composed.** Every heading in the corpus prints its
own `[[cite:slug#anchor]]`. The first live run showed the model assembling a slug
from one article with an anchor from another, which produced a citation that
looked right and went nowhere.

**A cold turn costs $0.68 and a warm one about $0.04.** A full evaluation run of
forty cases costs $1.75 to $2.40 warm. The write is measured at the 1 hour rate
rather than assumed, and `cache_creation` is logged on every call so the next cold
run confirms the 1 hour TTL is honoured.

**The entry card questions are committed data, not generated at request time.**
`content/insights/suggested-questions.json`, three per article, reviewed by hand.
Summarize is offered fourth by `entryOptions`, never first.

**The existing rate limiter is not a spend guard.** `src/lib/rate-limit.ts`
keeps counters in a module-level `Map`, so it resets on every function
recycle and is not shared across instances. Task 021 needs a durable
counter.

**The global ceiling should count spend, not turns.** An abuser forcing
cache misses costs $0.379 a request, so about 1,300 requests would exhaust
a month in a day.

**Anchor fidelity has to be verified against rendered pages**, never
against the generator's own output. Checking it found seven dead table of
contents links on production, fixed separately.

**Estimating tokens went wrong twice** before being measured, by 27% then
13%. `TOKENS_PER_WORD` in the manifest script is now calibrated against a
real measurement. Recalibrate the same way rather than guessing.

## Unrelated live fixes shipped during this session

Noted so a later session does not rediscover them as bugs.

- **Contact form**: three of four reason options were silently rejected
  because the form and the validator held separate lists. PR #88.
- **Contact form**: two awaits with no timeout left the form hanging with
  no success and no error on a cold start. PR #86.
- **Telemetry**: App Insights was batching and losing nearly everything,
  11 requests logged in 30 days. Now flushes. This is what made the contact
  diagnosis possible.
- **Table of contents**: seven dead anchor links across three articles.
  PR #89.

## How to resume

1. Read `tasks/TASK-INDEX.md` for status and the gates that stop the line.
2. Open `tasks/011-system-prompt.md`.
3. Read `content-platform/voice/stance.md` before writing any prompt text.
   Without it the assistant will contradict the articles it is quoting,
   particularly on what the general counsel owns versus what legal
   operations facilitates.
4. `node scripts/build-corpus-manifest.mjs` regenerates the corpus.
   `npm run insights:check -- --offline` checks the prompt, the parser and the
   entry card copy for free. Without `--offline` it makes four real calls, about
   $0.17 warm or $0.80 cold. `npm run insights:eval` runs all forty evaluation
   cases for $1.75 to $2.40 and writes every answer to `eval/last-run.json`.
