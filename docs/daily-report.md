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
| `CLARITY_API_TOKEN` | SWA app settings | **not yet set** | Traffic. Without it the mail still goes, minus one section. |

### The Clarity token, which is not set yet

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

## What is not verified

**The Clarity section has never run against the real API.** It was written from
the published shape of the Data Export response and cannot be exercised without
a token, which is generated in the Clarity dashboard. It is built to fail into a
`problem` on the section rather than take the mail down, so the worst case is a
mail with a line saying Clarity could not be read and why.

**Check it the first time** with the `--dry` call above, rather than waiting for
tomorrow's mail to tell you.

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
