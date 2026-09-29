# The daily report

A mail every morning saying what happened on the site: what readers asked the
assistant, which subjects the articles could not answer, who asked for access,
and who visited.

## Why it exists

Three alert rules cover failure. None of them says the assistant went a week
without a question, and for a feature that is a bet on engagement **silence is
the outcome worth knowing about**. Alerts tell you when something broke. This
tells you whether anything happened.

The subject line carries the headline, so a quiet day can be triaged without
opening the mail:

```
[Spaarke] 2026-09-29: quiet. No questions, no leads.
[Spaarke] 2026-09-29: daily report
```

## How it is wired

The work happens in the site's own route, not in CI.

```
GitHub Actions, 12:00 UTC daily
  └── GET https://spaarke.com/api/reports/daily?days=1
      Authorization: Bearer <REPORT_TRIGGER_TOKEN>
        ├── Table Storage  → questions, provenance, spend, leads, contact form
        ├── Clarity API    → sessions, distinct visitors, most visited pages
        └── SendGrid       → one mail to CONTACT_EMAIL_TO
```

**The route does the work because the site already holds every credential it
needs.** Running it from GitHub Actions would mean copying the storage
connection, the SendGrid key, the recipient and the Clarity token into a public
repository. The workflow holds one shared secret instead and asks the site to do
it. This is the same shape task 050 specifies for cache warming.

## Configuration

| Setting | Where | Required | Purpose |
|---|---|---|---|
| `REPORT_TRIGGER_TOKEN` | SWA app settings **and** GitHub secret | yes | Shared secret. Both sides must match or the route returns 401. |
| `STORAGE_ACCOUNT_CONNECTION` | SWA app settings | already set | Questions, leads, contact form |
| `SENDGRID_API_KEY`, `CONTACT_EMAIL_TO` | SWA app settings | already set | Sending |
| `CLARITY_API_TOKEN` | SWA app settings | set 2026-09-29 | Traffic. Without it the mail still goes, minus one section. |

### The Clarity token

Generate it in Clarity under **Settings, Data Export**, then:

```
az staticwebapp appsettings set --name swa-spaarke-website -g rg-spaarke-website \
  --setting-names "CLARITY_API_TOKEN=<token>"
```

That command adds and updates rather than replacing, so the other settings are
safe. It is a runtime setting, so it takes effect within a few minutes with no
deploy, though it can take two or three: see the rotation notes in
`projects/article-insights-assistant/current-task.md`.

**Three constraints on Clarity's Data Export API**, worth knowing before reading
the numbers:

- Whole days only, and **at most three**. Asking for more silently returns less.
- **Ten calls per project per day.** This is not something to poll.
- It reports its own bot filtering, so the traffic line prints bot sessions
  separately rather than quietly subtracting them.

Clarity does **not** carry the reader-side assistant events (`Assistant Opened`,
`Assistant Question`, `Assistant Citation`, `Article Engagement`). Those are
Plausible custom events. The report covers the question side from the server
instead, which is the more useful half: it has the questions themselves.

## Running it by hand

Print it to the terminal without sending:

```
STORAGE_ACCOUNT_CONNECTION="..." CLARITY_API_TOKEN="..." npm run report:daily
npm run report:daily -- --days 3
```

Same assembler the mail uses, so what you see is what it says.

Against the live site, returning the text without sending:

```
curl -H "Authorization: Bearer <token>" \
  "https://spaarke.com/api/reports/daily?dry=1"
```

Or send one now from the Actions tab: **Daily report → Run workflow**.

## Verified against the real API, 2026-09-29

The first version of the Clarity parsing was written from the documented shape
and **was wrong in three ways**, all of which would have failed quietly:

- The dimension key is **`Url`**, not `URL`. Every page row was being dropped, so
  "most visited" would have been permanently empty.
- Clarity returns a row with **`Url: null`**, an aggregate rather than a page,
  which was being counted into the totals.
- `distinctUserCount` **must not be summed**. The same person reading three
  articles appears in three rows, so adding them up invents visitors. It is
  reported as a maximum, which is a floor, and labelled as one.

**Nothing here should be trusted from documentation alone.** Call it and look:

```
tok=$(az staticwebapp appsettings list --name swa-spaarke-website \
  -g rg-spaarke-website --query "properties.CLARITY_API_TOKEN" -o tsv)
curl -sS -H "Authorization: Bearer $tok" \
  "https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1&dimension1=Url"
```

### What the response actually contains

Nine metrics. `Traffic` carries `totalSessionCount`, `totalBotSessionCount`,
`distinctUserCount` and `pagesPerSessionPercentage`. `ScrollDepth` carries
`averageScrollDepth`. `EngagementTime` carries `totalTime` and `activeTime`. The
rest are behaviour signals (dead clicks, rage clicks, script errors) that the
report ignores.

**Bot sessions are reported separately rather than subtracted quietly**, because
on the first real run every session was a bot, and a report that hid that would
have shown traffic where there was none.

## Design notes

**Spend is read from Table Storage, not Application Insights.** `costUsd` and
`cacheMiss` were added to the conversation record on 2026-09-28, after a day
where the only copy of the spend lived in Application Insights and the classic
query API returned incomplete results for hours without saying so. Turns written
before that date carry no cost, and the report says **"spend not recorded"**
rather than printing `$0.00`, because reporting absence as zero is the specific
failure that day was made of.

**A section that cannot be read does not stop the mail**, but it is recorded as
`report.daily.partial` telemetry and surfaced as a warning in the workflow. A
digest that quietly loses a section is how you stop trusting the digest.

**The token is compared in constant time.** A token compared with `===` leaks its
prefix through timing.
