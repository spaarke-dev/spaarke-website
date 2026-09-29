# Measurement

What is measured, where it lands, and **what would count as this feature failing**,
written down before the data exists.

The last section is the point of this file. Deciding after the fact what counts as
success is how features survive evidence that they are not working.

## The sequencing, which has to happen in this order

The engagement baseline is a new event with no history, so it cannot be
reconstructed later. It has to be collected while the console is off.

1. **Merge the instrumentation and leave `INSIGHTS_ENABLED` unset.** Readers get
   the articles exactly as they are now, and `Article Engagement` starts recording
   how far they read and how long they stay, with `assistant: false` on every row.
2. **Wait for a baseline.** At least 150 article visits, and at least two weeks, so
   a single LinkedIn post does not become the baseline.
3. **Then set `INSIGHTS_ENABLED=true`.** From that point the same event carries
   `assistant: true` for readers who opened it, and the comparison is a breakdown
   of one event rather than a join across two. A join is the version nobody runs.

Skipping step 2 does not delay the answer, it removes it.

## Where each event lands

Two stores, for two reasons. Server events go to Application Insights because they
carry cost and defence data that belongs with the infrastructure. Reader events go
to Plausible because that is where the rest of the site's engagement already is,
and splitting engagement across two tools makes the comparison harder than the
question deserves.

### Application Insights, from the endpoint

| Event | Carries |
|---|---|
| `insights.answer` | provenance, cited slugs, repair counts, token counts, **`costUsd`**, `cacheMiss`, time to first token, total time |
| `insights.error` | code, slug, elapsed |
| `insights.blocked.*` | one event per defence: `ceiling`, `captcha_required`, `captcha_failed`, `ip_hour`, `ip_day`, `session`, `counters_error` |
| `insights.partial_failed` | the partial answer store failing, which costs progressive rendering and not the answer |
| `insights.validation_failed`, `insights.misconfigured` | refused before the model |

### Plausible, from the console

| Event | Carries |
|---|---|
| `Assistant Opened` | article, surface (`panel` or `sheet`) |
| `Assistant Question` | article, source (`suggested` or `typed`), turn number |
| `Assistant Answer` | article, provenance, citation count, whether it asked back, whether the POST closed |
| `Assistant Citation` | article, target article, whether it was the same article, whether it was a whole-article link |
| `Assistant Error` | article, code |
| `Article Engagement` | article, scroll depth bucket, seconds bucket, **`assistant` true or false** |

`Article Read`, the existing conversion signal, is unchanged.

## The telemetry pipeline was verified, not assumed

Task 040 said to assume nothing, because this site once logged 11 requests in 30
days while serving live traffic: the SDK batched, and Static Web Apps froze the
function before the batch went out.

**Checked on 2026-09-27, and that check was half wrong. Corrected 2026-09-28.**

It reported **zero rows in every table across 90 days** and concluded the pipeline
was silent. The zero was an artifact: the reading came from
`az monitor app-insights query`, which returns incomplete results for this
workspace-backed resource. Asked of the workspace, **23 events and 818 requests
from 2026-09-25 and 09-26 were already there** when the check said nothing was.

What survives the correction is the part that was proved rather than queried. A
side-effect-free event was fired in production, by posting to the contact route
with the honeypot field filled, which records `contact.honeypot` and sends no
email. **It arrived.** The flush fix of 2026-09-25 works.

And the ninety days of silence before it was real: the workspace holds nothing at
all before `2026-09-25T16:14`, which is when the fix landed. So the pipeline was
genuinely broken until then and has been healthy since. The right conclusion,
reached partly from a bad reading.

**The lesson is the method, not the number.** Firing a probe and watching it
arrive was sound. Trusting an empty query result was not, and an empty result is
the one answer that looks the same whether it is true or the tool is lying.

`requests` and `pageViews` staying empty is expected rather than broken. Automatic
request collection does not hook into Next.js App Router handlers on Static Web
Apps managed functions, and there is no browser SDK on this site, so page views
live in Plausible.

**The method is repeatable.** After the console goes live, this confirms each
server event type actually arrived:

```
MSYS_NO_PATHCONV=1 az monitor log-analytics query -w 9385d051-edd2-44f7-baca-3249117f7603 \
  --analytics-query "AppEvents | where TimeGenerated > ago(7d) | where Name startswith 'insights.' | summarize n=count() by Name | order by n desc"
```

Reader events are confirmed on the Plausible dashboard, where a new event name
appears under Goals once it has fired. There is no API key in this repo, so that
check is the owner's and takes about a minute.

## Ask the workspace, not the classic API

**`az monitor app-insights query` returns incomplete results for this resource,
silently.** On 2026-09-28 it returned a turn once and then stopped returning it,
and reported the `requests` table as holding only the last half hour. None of it
was true: every event was in the workspace the whole time. Two hours went into
investigating data loss that had not happened.

This resource is workspace-backed, so query the workspace:

```
az monitor log-analytics query -w 9385d051-edd2-44f7-baca-3249117f7603 \
  --analytics-query "AppEvents | where TimeGenerated > ago(7d) | where Name startswith 'insights.' | summarize n=count() by Name | order by n desc"
```

Two differences that matter, because both fail quietly rather than loudly:

- The table is **`AppEvents`**, not `customEvents`, and the columns are
  `TimeGenerated`, `Name` and `Properties`, not `timestamp`, `name` and
  `customDimensions`.
- **Booleans arrive lower-cased.** `Properties.cacheMiss` is `"true"`, so a test
  against `"True"` matches nothing and reports zero misses forever. That is
  exactly what happened: task 050 was deferred on a measured miss rate of zero
  that was really three in a day. Compare with `tolower(...)`.

On Windows, prefix `az` with `MSYS_NO_PATHCONV=1` under Git Bash or the workspace
GUID is mangled into a path.

## The queries worth having

**Spend, per day and per turn.** NFR-01 asks for spend to be observable rather
than estimated.

```
AppEvents
| where Name == "insights.answer"
| extend cost = todouble(Properties.costUsd),
         miss = tolower(tostring(Properties.cacheMiss)) == "true"
| summarize turns = count(), spend = sum(cost), worst = max(cost),
            misses = countif(miss)
  by bin(TimeGenerated, 1d)
| order by TimeGenerated desc
```

`misses` is the line to watch. A cache miss is roughly fifteen times a cached turn,
so a day with many of them is a cost problem rather than a traffic one.

**Sanity check it.** If `misses` is zero while `spend` is more than about a dollar,
the comparison is wrong rather than the day being cheap. Three misses at roughly
$0.69 each is what two dollars looks like.

**What readers ask that the articles do not answer.**

```
AppEvents
| where Name == "insights.answer"
| summarize n = count() by provenance = tostring(Properties.provenance)
```

A rising `general` share is the brief for the next article, not a defect.

**Which defence is firing.**

```
AppEvents
| where Name startswith "insights.blocked."
| summarize n = count() by Name, bin(TimeGenerated, 1d)
```

`ip_hour` and `session` firing is the system working. `counters_error` firing is
the system refusing everybody because storage is unreachable, and that is a page.

## Alerts, added 2026-09-28

Thresholds nobody is paged about are a reading exercise. One rule now runs every
15 minutes and emails `contactus@spaarke.com` via `ag-spaarke-website`:

| Alert | Fires when | Means |
|---|---|---|
| `website-assistant-counters-unavailable` | `insights.blocked.counters_error` or `counters_unavailable` | Storage is unreachable, the defences fail closed, and the assistant is refusing every reader. This is the page. |

Two sibling rules cover the evaluation form, documented in
`docs/demo-request-flow.md`.

Deliberately not alerted: `insights.error` and the rate-limit defences.
`ip_hour` and `session` firing is the system working, and a single upstream
error is noise. The counters being unreachable is different, because it takes
the whole feature down silently.

The rules are log search rules scoped to the workspace, so they query
`AppEvents`, not `customEvents`.

## What would count as this feature failing

Chosen on 2026-09-27, before any of the data exists. All of them need **at least
150 article visits with the assistant used**, and none should be read before four
weeks have passed, because one LinkedIn post can carry a fortnight.

### 1. It replaces the articles rather than deepening them

**The threshold.** Readers who used the assistant reach a lower median scroll depth
bucket than readers who did not, **and** fewer than 15% of answers have a citation
followed.

That pair matters. Lower scroll depth on its own could mean the assistant answered
the question faster, which is a good outcome. Lower scroll depth **with** citations
going unclicked means the assistant is standing in front of the articles.

**The response.** Cut the answers shorter again and make the citation chips the
answer's conclusion rather than its footnote. If a second measurement period does
not move it, the console comes off the article pages and becomes a library-level
surface, where it competes with nothing.

### 2. Nobody opens it

**The threshold.** `Assistant Opened` on fewer than 3% of article visits after four
weeks.

**The response.** This is an entry point problem before it is a feature problem.
The rail link and the mobile button get one round of work, and the entry questions
get regenerated against what readers actually asked, which `npm run insights:gap`
already reports. If it stays under 3% after that, the feature is not wanted and the
honest move is to switch it off rather than to keep paying for it.

### 3. It costs more than it is worth

**The threshold.** More than **$150 in a calendar month**, which is 30% of the
owner's $500 ceiling, or any single day above $16, which is the daily ceiling the
endpoint already enforces.

**The response.** The cache warming in `notes/cost-model.md` is designed and
costed, and cuts a cold turn from $0.68 to $0.046. It is the first lever and it is
not yet built. The second is tightening the per-IP limits, which currently allow 30
questions a day from one address.

### 4. It answers badly in public

**The threshold.** Any citation that resolves to nothing, any quotation the repair
layer did not catch, or a repair rate above 20% of answers.

**The response.** Repairs are already counted in `insights.answer`. A rate above
20% means the instructions are not landing and the prompt gets another pass, not
that the repair layer needs to be louder.

### What is explicitly not a failure

**Answers labeled `general`.** The library does not cover everything, the owner
decided there is no refusal path, and an honest answer from outside the corpus is
the product working. A rising `general` share is a content signal and it goes to
the gap report.

**The assistant asking the reader a question.** It is always skippable and never
blocks a reply. A high skip rate means the questions are not good enough, which is
prompt work.

## The cost alert is the owner's, and here is the command

Checked on 2026-09-27: **no budget and no cost alert exists** on this subscription
for the Foundry resource. NFR-03 asks for one.

It is not created here because a budget notification needs an email address, and
putting the owner's address into an Azure resource is their decision rather than a
step in a task. The command, once a resource group and an address are filled in:

```
az consumption budget create \
  --budget-name insights-monthly \
  --amount 150 \
  --category cost \
  --time-grain monthly \
  --start-date <first of this month> \
  --end-date <a year out> \
  --resource-group <the Foundry resource group> \
  --notifications '{"actual80":{"enabled":true,"operator":"GreaterThan","threshold":80,"contactEmails":["<address>"]}}'
```

$150 rather than $500, so the alert arrives while there is still room to act. That
is the same number as threshold 3 above, deliberately: the alert and the failure
condition should not be two different opinions about what too much means.
