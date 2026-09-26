# Current task: Article Insights Assistant

> Context recovery. A session picking this up cold reads this file first,
> then `tasks/TASK-INDEX.md`, then `spec.md`.
>
> Last updated 2026-09-26, end of the second working session. Phases 0, 1 and 2
> are done apart from task 023, which the owner has just approved.

**Active task:** none in progress.
**Next task:** `023-partial-answer-polling.md`, then `030-rail-console.md`.

## What this is, in one paragraph

An AI console in the article rail that lets a reader interrogate the piece and the
library around it. The whole 24-article corpus sits in a cached model context, so
it reasons across articles with no retrieval layer, and every claim is labeled with
where it came from. It is not a website chat bot. It is also a demonstration of
Spaarke's own product thesis, which is why visible citation is a requirement
rather than a nicety.

## Where things stand

| Task | State |
|---|---|
| 001 Foundry deployment | complete |
| 002 Cost measurement | complete, gate passed |
| 010 Corpus manifest | complete |
| 011 System prompt | complete |
| 012 Evaluation set | complete, gate met in part |
| 013 Suggested questions | complete |
| 020 Streaming endpoint | complete, switched off behind `INSIGHTS_ENABLED` |
| 021 Abuse and spend defences | complete, verified against real Table Storage |
| 022 Conversation capture | complete |
| 023 Partial answer polling | **next**, approved by the owner on 2026-09-26 |
| 030, 031, 040, 090 | not started |

Merged to `main`: PR #87 the scaffold, #91 the prompt, #92 the entry card
questions, #93 the evaluation suite, #94 the endpoint and its defences, #95 and
#96 the streaming finding.

## The three decisions taken at the end of this session

**Azure Static Web Apps buffers the stream, so answers will be polled for.** The
platform collects the whole response before sending any of it, proven against the
deployed site. The owner chose to write partial answers to storage and poll for
them, which is task 023. It was chosen as the best experience available rather
than the cheapest: the assembler already flushes by sentence, so polling looks
identical to real streaming; the audience sits behind corporate networks that
break long-lived connections; and the buffered POST remains a fallback, so a
blocked poller costs progressive rendering rather than the answer. Full reasoning
in `notes/endpoint-and-defences.md`.

**Answers are too long, and the target is now 120 to 200 words.** Measured answers
ran 400 to 650, which is a wall in a narrow column beside an article the reader is
already part way through. The instructions now carry the numbers,
`DEFAULT_MAX_TOKENS` came down from 2,000 to 1,100 as a guard rail, and nineteen
evaluation cases assert a character ceiling. **This is unverified against live
answers.** Run `npm run insights:eval` early in the next session, because it is the
thing most likely to need another turn of prompt work.

**The privacy policy has to merge with the console.** PR #90 is a deliberate
draft. The live policy does not mention the assistant, and task 022 records reader
questions for 90 days, so the code currently keeps a promise that has not been
published. That is the safe order, and #90 goes live with task 030 rather than
after it. The spec claimed this had already shipped, and that claim is corrected.

## Before the console ships

1. **Task 023**, so a reader sees an answer arrive rather than waiting eleven
   seconds for a wall of text.
2. **`INSIGHTS_ENABLED=true`** in Azure Static Web Apps app settings. The endpoint
   ships off because nothing calls it, not because it is unsafe.
3. **Merge PR #90.**
4. **An Azure cost alert** on the Foundry resource, below the monthly ceiling.
   Still the owner's to do, and NFR-03 asks for it.

## The measured numbers, which are not estimates

Live calls on 2026-09-26 against `spaarke-website-claude-sonnet-5`:

- Warm turn, cache hit: **$0.032 to $0.046**
- Cold turn, cache write at the 1 hour rate: **$0.68**
- Assembled prompt: **152,357 tokens**, 95% of the 160,000 ceiling
- A full 40-case evaluation run: **$1.75 to $2.40**
- Answer time: 3.6 to 22.5 seconds, median about 11, with no streaming through the
  platform

The cache write is roughly fifteen times a cached turn, so cache misses are the
whole cost model. Detail in `notes/cost-model.md`.

## Read these notes before touching anything

| Note | What it holds |
|---|---|
| `notes/prompt-design.md` | The wire format, the four decisions behind it, six findings from live runs |
| `notes/evaluation.md` | How to run the suite, how to read its rate, the three behaviours still wrong |
| `notes/endpoint-and-defences.md` | What the route does, what it refuses, the streaming finding and the decision |
| `notes/conversation-schema.md` | The capture schema, the retention mechanism, the gap report |
| `notes/cost-model.md` | Rates, the CCU wrapper, the cache warming that is designed and not built |

## Commands

```
npm run insights:check -- --offline   prompt, parser and entry card copy, free
npm run insights:check                the same plus four live calls, $0.17 warm
npm run insights:eval                 40 evaluation cases, $1.75 to $2.40
npm run insights:gap                  what readers asked that the articles did not answer
npm run corpus                        regenerate the corpus manifest
```

The defences self-test needs the storage connection string in the environment.
Pass it from the app settings rather than writing it into a file, and see the
header of `scripts/check-insights-defences.mts` for the one-liner.

## Findings that shape the work still to do

**Extended thinking is on at the deployment and it destroys answers.** Eleven of
forty evaluation cases came back completely empty because 1,999 of 2,000 output
tokens went into a thinking block. Every call goes through `buildMessageRequest`,
which disables it. Anything new that calls the model uses that builder rather than
composing its own request. The model also rejects `temperature` as deprecated.

**Three model behaviours are repaired mechanically** in `parseAnswer` and in the
stream assembler: citations corrected, non-verbatim quotations demoted to
paraphrase, dashes replaced. The counts are reported, because they are the rate at
which the instructions are not landing. Never bypass them by rendering raw model
text.

**Mixed provenance labeling is not yet reliable.** A reply drawing on both the
articles and outside knowledge is sometimes labeled corpus, and does not always
carry the paragraph marker the client needs. Phase 1's gate is met in part, which
is recorded rather than smoothed over.

**Citations are copied, not composed.** Every heading in the corpus prints its own
citation marker. The first live run showed the model assembling a slug from one
article with an anchor from another, which produced a citation that looked right
and went nowhere.

**Do not import `@/lib/corpus` from a client component.** It pulls a 500 kB JSON
manifest into the browser bundle. The article page is a server component, so read
the three entry card questions there with `entryOptions(slug)` and pass them as
props.

**The defences fail closed.** If the counters cannot be read or written the
request is refused. Development without a storage connection falls back to the
in-process limiter and warns loudly.

## Deferred by the owner, still open

- **Cache warming**, which would cut a cold turn from $0.68 to $0.046. Designed,
  costed, not built. Break-even around 61 conversations a month.
- **Context window headroom.** The assembled prompt is at 95% of the 160,000
  ceiling, with room for about one more article. The build warns on every run and
  fails hard when the headroom is gone.
- **Rotating the Foundry API key.** The owner judged the resource not client
  confidential.
- **Rotating the storage account key, the SendGrid key and the reCAPTCHA secret.**
  On 2026-09-26 an `az staticwebapp appsettings list` printed every production
  secret into a session transcript. Nothing reached the repository, which was
  verified by scanning git history and the working tree. The storage key is the
  one worth rotating first, because that account holds real contact form
  submissions.

## Two content items for the owner

**Two published titles contain em dashes**, the platform feature reference and the
article on legal AI not being deterministic. The assistant reproduces a title
whenever it cites the article, so the mark will appear in front of readers until
the titles change. Several article headings carry them too, and those become
citation chip labels.

**The entry card questions name ChatGPT and Copilot** in the reader's voice, both
of which the articles name themselves. The prompt forbids claims about a named
competitor beyond what an article states, so the question invites an answer the
instructions already constrain. Worth reading one of those answers before launch.
