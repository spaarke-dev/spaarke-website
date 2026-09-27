# Current task: Article Insights Assistant

> Context recovery. A session picking this up cold reads this file first,
> then `tasks/TASK-INDEX.md`, then `spec.md`.
>
> Last updated 2026-09-26, end of the third working session. **Phases 0, 1 and 2
> are complete, and so is phase 3.** What remains is the instrumentation, the
> wrap-up, and the five things the owner has to do.

**Active task:** none in progress.
**Next task:** `090-project-wrap-up.md`. Task 040 is built but cannot finish until
the baseline has accumulated, which is a wait rather than work.

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
| 023 Partial answer polling | complete, verified against real Table Storage |
| 030 Rail console | complete, unlooked-at |
| 031 Mobile sheet | complete, never opened on a phone |
| 040 Instrumentation | instrumented, baseline pending, needs two weeks of quiet |
| 090 Wrap-up | **next** |

Merged to `main`: PR #87 the scaffold, #91 the prompt, #92 the entry card
questions, #93 the evaluation suite, #94 the endpoint and its defences, #95 and
#96 the streaming finding, #97 the checkpoint, #98 partial answer polling, #99 the
console, #100 the rail as an entry point, #101 the mobile sheet.

## Where the two open questions landed

**Azure Static Web Apps buffers the stream, so answers are polled for, and that is
now built.** The platform collects the whole response before sending any of it,
proven against the deployed site. Task 023 writes each event to Table Storage as it
is assembled and adds a poll route the client reads while the POST is still open.
It was chosen as the best experience available rather than the cheapest: the
assembler already flushes by sentence, so polling looks identical to real
streaming; the audience sits behind corporate networks that break long-lived
connections; and the buffered POST remains a fallback, so a blocked poller costs
progressive rendering rather than the answer.

Measured first sentence: **2.4 to 3.3 seconds**, against a local production build
with real storage and the real model, with thirteen of thirteen sentences delivered
progressively. The deployed-site number needs `INSIGHTS_ENABLED=true` and is listed
below. Design and the two things that are easy to get wrong are in
`notes/endpoint-and-defences.md`.

**Answers are now the length the owner asked for, and the numbers are measured.**
They ran 400 to 650 words, which is a wall in a narrow column beside an article the
reader is already part way through. They now run a **mean of 185 words, a median of
197 and a maximum of 233** across forty live answers, with nothing above 280.

Getting there took two turns of prompt work and both are worth knowing. The model
**overshoots a stated band by five to twenty five percent**, so asking for 120 to
200 produced a median of 205 and the instruction had to aim at 100 to 160 to land
inside 200. And shortening the answers made it **over-quote**: demotions went from
one to four, because compression squeezes a sentence and keeps the quotation marks.
The quotation rule and the length rule now reference each other and the four
failing cases cleared.

**The rail is 220px, so the answers open in a panel.** The owner chose this on
2026-09-26, after the measured answer length made the original plan unworkable: 185
words in a 220px column is about 38 lines of three or four words. The entry card
stays in the rail with its three questions and the disclaimer, and asking opens a
420px panel beside the article. The article is shifted rather than covered, with
padding rather than a transform, because a transformed ancestor would break the
sticky table of contents inside it. **Task 031's mobile sheet is the third
container around the same console**, so do not fork the transcript, the composer or
the disclaimer. Detail in `notes/console.md`.

**The privacy policy has to merge with the console.** PR #90 is a deliberate
draft. The live policy does not mention the assistant, and task 022 records reader
questions for 90 days, so the code currently keeps a promise that has not been
published. That is the safe order, and #90 goes live with task 030 rather than
after it. The spec claimed this had already shipped, and that claim is corrected.

## The launch order, which matters

**Merge everything, then leave `INSIGHTS_ENABLED` unset for two weeks.** The
engagement baseline is a new event with no history, so it can only be collected
while the console is off. Turning the console on the same day removes the only
chance to know whether it helped the articles or replaced them. At least 150
article visits and at least two weeks, so one LinkedIn post does not become the
baseline. Full reasoning in `notes/measurement.md`.

## Before the console ships

1. **Look at the console, on a desktop and on a phone.** Nobody has opened it on
   either. There is no browser automation in this repo, so what is proven is the
   markup, the logic and the links, not the appearance or the feel. On desktop it
   wants a 1440px screen and a 1280px one, where the panel's shift calculation does
   the most work. On a phone it wants the keyboard open, which is the detail this
   kind of sheet usually gets wrong.
2. **`INSIGHTS_ENABLED=true`** in Azure Static Web Apps app settings, **after the
   baseline has accumulated.** Until it is set the console does not render at all
   and the endpoint refuses, which is how the feature stays off. Setting it is also what unblocks the one measurement task
   023 could not take, so take it at the same time with `npx tsx
   scripts/measure-insights-first-sentence.mts --base https://spaarke.com`.
   `RECAPTCHA_SITE_KEY` has to be there too, or the first question of every session
   is refused.
3. **Merge PR #90**, the privacy policy.
4. **An Azure cost alert** on the Foundry resource. Confirmed on 2026-09-27 that
   none exists. The command is written out in `notes/measurement.md` at $150
   rather than $500, so it arrives while there is still room to act. It is the
   owner's because a budget notification needs an email address.
5. **Rotate the storage account key, the SendGrid key and the reCAPTCHA secret.**
   The owner scheduled this for after the full build, so it belongs here rather
   than in the deferred list. See the detail at the end of this file.

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
| `notes/console.md` | The console's shape, the three bugs a live turn found, the three surfaces |
| `notes/measurement.md` | Every event and where it lands, the queries, and the four failure thresholds |

## Commands

```
npm run insights:check -- --offline   prompt, parser and entry card copy, free
npm run insights:check                the same plus four live calls, $0.17 warm
npm run insights:eval                 40 evaluation cases, $1.75 to $2.40
npm run insights:gap                  what readers asked that the articles did not answer
npm run insights:partial              31 checks on the partial answer store, real storage, free
npm run insights:console              38 checks on the console, free
npm run insights:console -- --base http://localhost:3000 --live   plus one real turn and its links
npm run corpus                        regenerate the corpus manifest

npx tsx scripts/check-insights-dedup.mts               6 merge orderings, no model, no storage, free
npx tsx scripts/check-insights-defences.mts            18 checks on the counters, real storage
npx tsx scripts/measure-insights-first-sentence.mts    time to first sentence, one warm turn
```

The three self-tests that touch storage need the connection string in the
environment. Pass it from the app settings rather than writing it into a file, and
see the header of `scripts/check-insights-defences.mts` for the one-liner. Both
self-tests write only to their own tables, `InsightsCountersSelfTest` and
`InsightsPartialsSelfTest`, so live rows are never touched.

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

**There is one console and three places it appears.** `ConsoleBody` is the
console; the desktop panel and the mobile sheet are frames around it, and
`InsightsProvider` holds the single conversation all of them read. The provider
exists because the rail sits inside a `hidden lg:block` aside and a `display: none`
ancestor hides a fixed child too, so the mobile button could not live there. Do not
answer a mobile bug by copying the panel; a check fails if you do.

**Task 040 and anything after it call `askInsights` from `poll-client.ts` and
nothing lower.** That
function owns the request id, the POST, the poller, and the merge of the two, and
it delivers each event once through one `onEvent` callback. A component that posts
to the route itself gets a buffered answer with no progressive rendering, which is
the whole thing task 023 exists to prevent. Everything in that file is an
`import type`, deliberately, because `stream.ts` and `citations.ts` reach the
500 kB corpus manifest.

**`askInsights` has three outcomes and the middle one matters.** `answered`,
`error`, and `answered-without-close`, which is prose that reached the reader
before the POST died. The last one is not an error and must not be rendered as
one: the answer on screen is real and may be missing its final sentence.

**Do not import `@/lib/corpus` from a client component.** It pulls a 500 kB JSON
manifest into the browser bundle. The article page is a server component, so read
the three entry card questions there with `entryOptions(slug)` and pass them as
props.

**Application Insights had nothing in it for ninety days, and that was traffic
rather than a fault.** Checked on 2026-09-27: zero rows in every table. A
side-effect-free event fired in production then arrived within a minute, so the
flush fix of 2026-09-25 works. `requests` and `pageViews` stay empty by design,
because automatic collection does not hook into App Router handlers on Static Web
Apps and there is no browser SDK; page views live in Plausible. Anyone reading an
empty `requests` table as an outage will waste a day.

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
## The key rotation, which is a release step rather than a deferral

**Rotate the storage account key, the SendGrid key and the reCAPTCHA secret after
the full build.** On 2026-09-26 an `az staticwebapp appsettings list` printed every
production secret into a session transcript. Nothing reached the repository, which
was verified by scanning git history and the working tree. The storage key is the
one worth rotating first, because that account holds real contact form
submissions. **The owner scheduled this for after the full build**, on 2026-09-26,
so it is item 5 of the list above rather than an open question. Rotating
mid-build would break the defences self-test and the app settings at the same
time, which is the argument for waiting. Two things have to be true when it
happens: the storage key rotates before the console is announced, and
`STORAGE_ACCOUNT_CONNECTION` is updated in the app settings in the same change,
because the counters fail closed and a stale key takes the assistant down rather
than leaving it unguarded. Three tables now depend on it: the counters, the
conversation record, and the partial answers.

## Content items, one settled and one open

**The em dashes in the two article titles are accepted.** The owner decided on
2026-09-26 that the platform feature reference and the article on legal AI not
being deterministic keep their titles. The assistant will reproduce the mark
whenever it cites either piece, and that is a known and accepted exception rather
than a bug in the dash repair. Do not add a normalization pass over titles or
headings to hide it: `normalizeDashes` covers prose the model writes, and a title
is the owner's text being quoted accurately.

**The entry card questions name ChatGPT and Copilot** in the reader's voice, both
of which the articles name themselves. The prompt forbids claims about a named
competitor beyond what an article states, so the question invites an answer the
instructions already constrain. Worth reading one of those answers before launch.
