# Current task: Article Insights Assistant

> Context recovery. A session picking this up cold reads this file first, then
> `notes/console.md`, then `tasks/TASK-INDEX.md`, then `spec.md`.
>
> Last updated 2026-09-28. **The assistant is live in production.**

**Active task:** none in progress.
**Next task:** `090-project-wrap-up.md`, then tasks 050 and 051 scoped below.

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

### 1. Rotating the keys, in order

Three secrets were printed into a session transcript on 2026-09-26. Nothing reached
the repository, verified against git history and the working tree. Rotate in this
order, because the first one can take the site down if done carelessly.

**Storage account key, first and carefully.** That account holds real contact form
submissions, the conversation record, the spend counters and the partial answers.

1. List the keys and work out which is in use:
   `az storage account keys list -n <account> -g <rg> --query "[].keyName" -o tsv`
2. Regenerate **the one not in use**:
   `az storage account keys renew -n <account> -g <rg> --key key2`
3. Set the new connection string:
   `az staticwebapp appsettings set --name swa-spaarke-website --setting-names STORAGE_ACCOUNT_CONNECTION="<new>"`
   That command adds and updates rather than replacing, which was verified on
   2026-09-27: 20 keys before, 21 after, none lost.
4. **Confirm the console still answers.** The counters fail closed, so a stale key
   takes the assistant down rather than leaving it unguarded.
   `npm run insights:partial` and `npx tsx scripts/check-insights-defences.mts`
   both exercise real storage with the new string.
5. Only once that is confirmed, regenerate the other key.

**SendGrid key.** New key in the SendGrid dashboard with the same send permission,
set `SENDGRID_API_KEY`, send one test through the contact form, then delete the
old key.

**reCAPTCHA secret.** In the Google reCAPTCHA admin console only the **secret**
needs rotating; the site key is public by design and appears in the page. Set
`RECAPTCHA_SECRET_KEY`. The insights guard refuses when the secret is absent, so an
empty value stops the assistant rather than opening it.

**Foundry API key.** Optional, since the owner judged the resource not client
confidential. If rotated, set `FOUNDRY_API_KEY`.

After any of these, check `customEvents | where name startswith "insights.blocked."`
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

### 4. Context headroom: build the lever now, pull it later

The corpus is **146,884 estimated tokens against a 160,000 ceiling**, which exists
because the deployment has a **200K** window and the remainder is for the
conversation and the answer. Room for about two more articles.

The efficient fix is not to wait. Give each article a **tier** in the manifest:

- **Tier 1**, the default, is what every article is today: the full body with a
  citation marker on every heading.
- **Tier 2** is title, summary, key takeaways, and headings with their markers, and
  no body. About **350 tokens against 4,910**, so demoting one article frees
  roughly **4,560**.

Ship it with every article in tier 1, so nothing changes on the day. When the
ceiling approaches, demoting an article is a one line change. **Demoting the eight
least cited frees about 36,000 tokens, room for seven more articles**, and the
telemetry already says which eight: `insights.answer` records `citedSlugs` on every
turn, so an article nothing cites in a month is the candidate.

A tier 2 article stays findable and citable as a whole, because its summary,
takeaways and headings remain in context. What it loses is verbatim quotation. That
keeps the whole-corpus reasoning the spec is built on, which retrieval would not.
Scoped as task 051.

The alternative is the 1M window if the Foundry deployment exposes it, which could
not be confirmed from the CLI. It would take the corpus from two more articles to
about 150, at premium pricing above the 200K threshold and with cache writes
scaling accordingly. Build the warming first if going that way.

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
| **090** Project wrap-up | **next.** Unblocked now the feature is live |
| **050** Cache warming | new, scoped above |
| **051** Tiered corpus | new, scoped above |
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
