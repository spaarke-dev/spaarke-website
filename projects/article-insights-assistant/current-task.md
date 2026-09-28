# Current task: Article Insights Assistant

> Context recovery. A session picking this up cold reads this file first, then
> `notes/console.md`, then `tasks/TASK-INDEX.md`, then `spec.md`.
>
> Last updated 2026-09-28. **The assistant is live in production.**

**Active task:** none in progress.
**Next task:** none. Every task in the index is complete or deliberately deferred.

**Task 090 is complete** (2026-09-28). The result is in
`notes/launch-verification.md`: 9 of 11 success criteria met, 1 partly met, 1
not assessable for another fortnight. `notes/lessons-learned.md` holds what the
build taught.

**Both Azure keys were rotated on 2026-09-28.** SendGrid and reCAPTCHA were
judged not to need it by the owner.

## It is live

Switched on 2026-09-27. The console renders on all 24 article pages and on the
library page at `/why-spaarke`, the endpoint answers, the captcha gate works, the
privacy policy covering the 90 day question record is published, and the cost alert
exists.

**The first two production turns, from `insights.answer`:**

| Turn | Cost | Cache | Provenance | Citations | Time |
|---|---|---|---|---|---|
| First | **$0.6855** | miss | corpus | 2 | 9.7s |
| Second | **$0.0397** | hit | mixed | 2 | 7.7s |

Those match what task 002 measured in the lab, so the cost model holds in
production. The owner confirmed the phone surface reads well.

## What switching it on took, and what it taught

**Two flags, not one, and they do different jobs.** The pages are statically
generated, so whether the console renders is decided at build time, and
`INSIGHTS_ENABLED` had to go into the GitHub workflow as well as Azure app
settings. The app setting still gates the endpoint at runtime and **is the kill
switch**: clear it and every question is refused immediately, where clearing the
build flag takes a full build.

**The same bug one layer down.** `RECAPTCHA_SITE_KEY` was in app settings only, so
the widget never rendered on the statically generated pages, the token was always
empty, and the guard refused every first question with a message telling the reader
to confirm something there was no way to confirm. The key now comes from a
repository secret at build time.

That also **restored the contact form's captcha**, broken the same way on every
deploy. It was invisible because the contact route treats a missing token as a
pass, so only the honeypot was stopping anything. `/contact` is a dynamic route,
which is why it read the app setting fine and the console could not.

**Deploys cancel each other.** Merging two pull requests a minute apart produced
`Deployment Failure Reason: Deployment Canceled` and left `main` built but not
published. A `concurrency` group now queues them, with `cancel-in-progress: false`.

**The lesson under all three:** an Azure app setting is a runtime value. Anything a
statically generated page needs must be in the build environment. Verify against
the rendered page, not the setting.

## Answers to the owner's questions, 2026-09-28

### 1. Rotating the keys. Done 2026-09-28

Three secrets were printed into a session transcript on 2026-09-26. Nothing
reached the repository, verified against git history and the working tree.

**Both Azure keys are rotated.** The storage account and the Foundry resource
each had the exposed key regenerated, after the application was moved onto the
other key and confirmed working. The exposed values are dead. `.env.local` was
updated to match, and every value was handled inside a single shell invocation
so none of it passed through a transcript. Which key was live was determined by
comparing truncated SHA-256 fingerprints, never by printing the values.

**SendGrid and reCAPTCHA were not rotated**, by the owner's decision. Both are
third-party consoles with no CLI path, and the owner judged them not to need it.

**It caused a three-minute production outage**, from roughly 13:33 to 13:35 UTC.
Telemetry confirms no real visitor hit it: the only genuine turn that day was at
12:46, and the nine events inside the window were all verification traffic.

**Two findings worth carrying into any future rotation.** They are the reason
the outage happened, and they are written up more fully in
`notes/lessons-learned.md`.

1. **A regenerated storage key is not immediately usable.** The new key took
   roughly **four to five minutes** to authenticate against the data plane.
   Repointing straight after regenerating pointed production at a key that did
   not yet work. Poll the new key until it authenticates first.
2. **Never invalidate the old credential in the same breath as repointing.** The
   Foundry rotation set the new app setting and killed the old key seconds
   apart, and the running app was still holding the old one. The storage
   rotation was clean precisely because minutes of verification sat in between.

The order that works:

1. Confirm which key is live, by fingerprint rather than by printing it.
2. Regenerate the key that is **not** in use.
3. Poll until the new key authenticates.
4. Repoint the app setting.
5. **Prove the running application picked it up, with a real request.** This is
   the step it is tempting to skip and it is the whole point.
6. Only then regenerate the exposed key.

The defences fail closed, so a stale storage key takes the assistant down rather
than leaving it unmetered. That is correct, and it is why the order matters.

After any rotation, check `customEvents | where name startswith "insights.blocked."`
for a spike in `counters_error`, which is what a wrong storage key looks like.

### 2. The cost alert, created 2026-09-28

A monthly budget of **$150** on `rg-website-article-agent`, the Foundry resource
group, notifying `contactus@spaarke.com` at **50% actual, 80% actual, and 100%
forecast**.

$150 rather than the $500 ceiling, so it arrives while there is room to act, and
deliberately the same number as failure threshold 3 in `notes/measurement.md`.
Created with `az rest` against the Consumption API, because this CLI version's
`az consumption budget create` cannot attach notifications and a budget that does
not notify is decoration.

### 3. Cache warming: build it, and the estimate was low

The owner estimated $57.96 a month, which is about 2.8 cold misses a day. **At a
twelve hour window with an hour of cache life the worst case is twelve misses a
day: $8.28 a day, about $250 a month.** The real number is measurable now:

```
customEvents
| where name == "insights.answer"
| summarize misses = countif(tostring(customDimensions.cacheMiss) == "True"),
            turns = count(), spend = sum(todouble(customDimensions.costUsd))
  by bin(timestamp, 1d)
```

Warming costs a cached read each time, roughly **$0.045**, because a cache hit
refreshes the time to live. Thirteen calls across a twelve hour window is about
**$0.59 a day, $18 a month**, and it removes every miss inside that window. It wins
above roughly one miss a day, so on this traffic it wins comfortably.

**It cannot be an open endpoint.** A warming call costs real money, so it needs a
shared secret between the workflow and the app settings. Note that `keep-warm.yml`
already exists and keeps the **Azure function** warm; the model's prompt cache is a
different thing and is not touched by it. Scoped as task 050.

### 4. Context headroom: the lever is built. Done 2026-09-28

The corpus is **146,884 estimated tokens against a 160,000 ceiling**, which exists
because the deployment has a **200K** window and the remainder is for the
conversation and the answer. Room for about two more articles.

**Task 051 is complete.** Each article now has a **tier**:

- **Tier 1**, the default and what every article is today: the full body with a
  citation marker on every heading.
- **Tier 2**: title, summary, key takeaways and headings with their markers, and
  no body. It stays in the index, stays citable as a whole and by section, and
  loses only verbatim quotation.

**The lever is `content/insights/corpus-tiers.json`.** Adding a slug under
`tier2` demotes that article. Nothing is demoted today, so nothing changed for
any reader: the assembled corpus block is byte identical, hash for hash, to what
it was before the change.

**The build now says what the lever is worth.** Demoting eight frees **24,751 to
77,331 tokens**, four to thirteen more articles, depending which eight. The
ceiling warning and the ceiling error both name the config and point at
`citedSlugs` on `insights.answer` for deciding which: an article nothing has
cited in a month is the candidate.

**What a demotion costs an answer is measured**, not assumed, in
`notes/cost-model.md`. Demoting one article and re-running a case that needed its
body: the answer still passed, still cited it, recovered the fact from a
different article, and **told the reader it was holding an outline and could not
quote**. It lost a third of its length and the specifics that came from the body.
Thinner and more deferential, not wrong.

Changing any tier changes the cached prefix, so the turn after a demotion is a
cache write at about $0.69. Demote in one batch rather than one a day.

The alternative is still the 1M window if the Foundry deployment exposes it,
which could not be confirmed from the CLI. It would take the corpus from two more
articles to about 150, at premium pricing above the 200K threshold.

### 5. Reading what visitors asked

Three places, because the events go to two stores for two reasons.

**What readers asked, and what the library could not answer.** The conversation
record, 90 days of question text and then counts only:

```
npm run insights:gap
```

It needs `STORAGE_ACCOUNT_CONNECTION` in the environment. This is the one that
feeds the content pipeline: a question answered from general knowledge is a subject
the articles do not cover, which makes it a brief for the next piece.

**Cost, provenance, defences and repairs.** Application Insights, queries in
`notes/measurement.md`:

```
az monitor app-insights query --app 65cb39e6-e925-4507-8b5e-ff7d3474c04c \
  --analytics-query "customEvents | where timestamp > ago(7d) | where name startswith 'insights.' | summarize n=count() by name"
```

**What readers did with it.** Plausible, on the dashboard: `Assistant Opened`,
`Assistant Question`, `Assistant Answer`, `Assistant Citation`, `Assistant Error`,
and `Article Engagement` with its `assistant` property. That last one carries the
comparison the whole feature is being judged on.

### 6. Publishing a new article

Indexing is **already automatic**. `npm run build` runs the corpus manifest build
first, so a new MDX file in `content/blog/` is in the model's context on the next
deploy, with its headings, anchors and citation markers.

Two things are not automatic:

1. **Entry card questions.** `npm run insights:questions` generates six for any
   article that lacks them and leaves the rest alone, so it is safe to run at any
   time. About $0.04 an article. Without it the console opens with no chips, which
   is degraded rather than broken.
2. **The ceiling.** The build warns as the corpus grows and **fails** when the
   headroom is gone. Read the warning.

Anchors come from the same slugger the rendered page uses, so headings should be H2
or H3 with text distinct enough to produce distinct anchors.

This belongs in the publish checklist rather than in a new tool. Written up as
`notes/publishing-a-new-article.md`.

## What is left

| | |
|---|---|
| **090** Project wrap-up | **complete** 2026-09-28. See `notes/launch-verification.md` |
| **050** Cache warming | **deferred.** Measured: 0 misses a day. Build when traffic passes two turns a day on separate hours |
| **051** Tiered corpus | **complete** 2026-09-28. Lever built, nothing demoted |
| Read the engagement comparison | **2026-10-12**, `notes/measurement.md`. Nothing to compare before then |
| Read the thresholds | late October, `notes/measurement.md` |
| Run the gap report | a fortnight in, feeds the content pipeline |

**The engagement baseline is one day, not two weeks**, because the console went on
sooner. The before and after comparison is weak as a result. The primary one is
unaffected: `Article Engagement` carries `assistant: true` or `false` within the
live period, and the four failure thresholds are written against that.

## Read these before touching anything

| Note | What it holds |
|---|---|
| `notes/console.md` | The console's shape and every decision behind it. **Read this first.** Most of it was learned by getting it wrong |
| `notes/measurement.md` | Every event, where it lands, the queries, the four failure thresholds written before the data |
| `notes/endpoint-and-defences.md` | What the route does, what it refuses, the streaming finding, partial answers |
| `notes/prompt-design.md` | The wire format, findings from live runs, why answers are the length they are |
| `notes/evaluation.md` | How to run the suite, how to read its rate, what is still wrong |
| `notes/cost-model.md` | Rates, the CCU wrapper, the cache warming maths |
| `notes/conversation-schema.md` | The capture schema and the retention mechanism |

## Commands

```
npm run insights:console              99 checks on the console, free
npm run insights:console -- --base http://localhost:3000 --live   plus a real turn
npm run insights:check -- --offline   prompt and parser, free
npm run insights:eval                 40 evaluation cases, about $1.60
npm run insights:gap                  what readers asked that the articles did not answer
npm run insights:partial              31 checks on the partial answer store, real storage
npm run insights:questions            six entry questions for any article missing them
npm run corpus                        regenerate the corpus manifest
npx tsx scripts/check-insights-dedup.mts      6 merge orderings, free
npx tsx scripts/check-insights-defences.mts   18 checks on the counters, real storage
```

The three that touch storage need the connection string in the environment. Pass it
from the app settings rather than writing it into a file, and see the header of
`scripts/check-insights-defences.mts` for the one liner.

## Findings that still shape the work

**Extended thinking is on at the deployment and it destroys answers.** Eleven of
forty evaluation cases came back empty. Everything goes through
`buildMessageRequest`, which disables it. Anything new that calls the model uses
that builder rather than composing its own request. The model also rejects
`temperature` as deprecated.

**Three model behaviours are repaired mechanically** and counted: citations
corrected, non-verbatim quotations demoted, dashes replaced. Never bypass them by
rendering raw model text.

**Mixed provenance labeling is still not reliable**, and it is the largest failure
class in the evaluation suite. Phase 1's gate is met in part, which is recorded
rather than smoothed over.

**The model overshoots a stated word band by five to twenty five percent.** Answers
run a mean of 185 words against an instruction asking for 100 to 160. Shortening
them made it over-quote, so the quotation rule and the length rule now reference
each other.

**The defences fail closed.** If the counters cannot be read or written the request
is refused. That is correct, and it is also how a wrong storage key takes the
assistant down, which is why the rotation order above matters.

**Do not import `@/lib/corpus` from a client component.** It pulls a 500 kB
manifest into the browser bundle.
