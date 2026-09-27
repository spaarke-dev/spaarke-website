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

**Checked on 2026-09-27, and the finding is in two parts.**

Application Insights held **zero rows in every table across 90 days**:
`customEvents`, `requests`, `pageViews`, `traces`, `exceptions`. The connection
string in the app settings was confirmed to point at `appi-spaarke-website` rather
than at some other resource.

Then a side-effect-free event was fired in production, by posting to the contact
route with the honeypot field filled, which records `contact.honeypot` and sends
no email. **It arrived.** So the flush fix of 2026-09-25 works, and the ninety days
of silence was absent traffic rather than a broken pipeline. That one row is in
production telemetry and is a probe rather than a bot.

`requests` and `pageViews` staying empty is expected rather than broken. Automatic
request collection does not hook into Next.js App Router handlers on Static Web
Apps managed functions, and there is no browser SDK on this site, so page views
live in Plausible.

**The method is repeatable.** After the console goes live, this confirms each
server event type actually arrived:

```
az monitor app-insights query --app 65cb39e6-e925-4507-8b5e-ff7d3474c04c \
  --analytics-query "customEvents | where timestamp > ago(7d) | where name startswith 'insights.' | summarize n=count() by name | order by n desc"
```

Reader events are confirmed on the Plausible dashboard, where a new event name
appears under Goals once it has fired. There is no API key in this repo, so that
check is the owner's and takes about a minute.

## The queries worth having

**Spend, per day and per turn.** NFR-01 asks for spend to be observable rather
than estimated.

```
customEvents
| where name == "insights.answer"
| extend cost = todouble(customDimensions.costUsd),
         cacheMiss = tostring(customDimensions.cacheMiss)
| summarize turns = count(), spend = sum(cost), worst = max(cost),
            misses = countif(cacheMiss == "True")
  by bin(timestamp, 1d)
| order by timestamp desc
```

`misses` is the line to watch. A cache miss is roughly fifteen times a cached turn,
so a day with many of them is a cost problem rather than a traffic one.

**What readers ask that the articles do not answer.**

```
customEvents
| where name == "insights.answer"
| summarize n = count() by provenance = tostring(customDimensions.provenance)
```

A rising `general` share is the brief for the next article, not a defect.

**Which defence is firing.**

```
customEvents
| where name startswith "insights.blocked."
| summarize n = count() by name, bin(timestamp, 1d)
```

`ip_hour` and `session` firing is the system working. `counters_error` firing is
the system refusing everybody because storage is unreachable, and that is a page.

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
