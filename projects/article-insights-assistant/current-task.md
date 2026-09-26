# Current task: Article Insights Assistant

> Context recovery. A session picking this up cold reads this file first,
> then `tasks/TASK-INDEX.md`, then `spec.md`.
>
> Last updated 2026-09-26, end of the first working session.

**Active task:** none in progress.
**Next task:** `011-system-prompt.md`, then `013`, then `012`.

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
| 011 System prompt | **next** |
| 013 Suggested questions | after 010, can run beside 011 |
| 012 Evaluation set | after 011 |
| 020 to 090 | not started |

## The measured numbers, which are not estimates

Two live calls on 2026-09-26 against `spaarke-website-claude-sonnet-5`:

- Warm turn (cache hit) **$0.032**, 3.1s
- Cold turn (cache write) **$0.379**, 4.6s
- Corpus **137,341 tokens**, 24 articles
- Prompt caching confirmed working

The write is about twelve times the turn, so cache misses are the entire
cost model. Full detail in `notes/cost-model.md`.

## Deferred by the owner on 2026-09-26

Both of these are real and neither blocks the build. **Do not spend session
time on them until the project is further along.**

- **Cost work**, including the hourly cache warming that would cut per-turn
  cost from $0.379 to $0.032. Designed, costed, not built.
- **Context window headroom.** The corpus is at 86% of the 160,000 ceiling
  with room for roughly three more articles. The build prints headroom on
  every run and fails hard when it is gone.

Also deferred: rotating the Foundry API key. The owner judged the resource
not client-confidential. It was pasted into a chat transcript and this
repository is public.

## Branch and PR state, read this before committing anything

Work is on **`docs/article-insights-assistant`**, PR **#87**.

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

## Findings that shape the work still to do

**The system prompt must ban em dashes.** The sample answer in task 002
contained one. House voice bans them everywhere and the assistant writes
Spaarke-voiced prose in front of readers. Task 012 needs a case that fails
on one.

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
   `node scripts/measure-insights-cost.mjs` makes two real calls and costs
   a few cents.
