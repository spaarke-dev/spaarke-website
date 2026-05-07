# T06 — Readout templates + AI citation monitoring scaffolding

**Phase**: 0
**Wave**: 3 (parallel with T03, T04)
**Dependencies**: T01 (knows the event surface and tool stack)

## Goal

Documentation-only task. Create the readout templates referenced in
spec §8 plus the manual-monitoring scaffolding for AI citation
tracking (Phase 2 wiring). After this task, the team has a clear
recurring-cadence rhythm to follow.

## Reads (required context)

- `projects/website-analytics-platform/spec.md` §8 (cadence
  templates), §6.3 (deferred AI citation monitoring).

## Deliverables

### 1. `projects/website-analytics-platform/readouts/weekly-template.md`

Copy-paste template for the Monday-morning 15-minute readout.

```markdown
# Weekly Analytics Readout — Week of YYYY-MM-DD

15 minutes, Monday morning. Skim, don't deep-dive. Log questions for
the monthly readout.

## Plausible — visitors

| Metric | This week | Prior week | Δ |
|---|---|---|---|
| Total visitors | | | |
| Unique pageviews | | | |
| Bounce rate | | | |
| Avg time on site | | | |

## Plausible — top 5 referrers

1.
2.
3.
4.
5.

## Plausible — top 5 entry pages

1.
2.
3.
4.
5.

## Custom events spike / drop

| Event | This week | Prior week | Notable? |
|---|---|---|---|
| Take Tour Submit | | | |
| Get Access Submit | | | |
| Contact Submit | | | |
| Article Read | | | |
| AI Source Visit | | | |
| Tour Complete | | | |

## App Insights — exceptions

Any new exception cluster? (Check the past 7 days in the Failures
blade.)

- [ ] No new clusters.
- [ ] New cluster: <name> — note for the monthly readout.

## Quick questions raised this week

(Things to dig into during the monthly readout — don't try to answer
here, just capture.)

-
-
```

### 2. `projects/website-analytics-platform/readouts/monthly-template.md`

The monthly hour-long readout. More analytical.

```markdown
# Monthly Analytics Readout — YYYY-MM (covering YYYY-MM-DD to YYYY-MM-DD)

~1 hour, first of the month. The point isn't to fill in numbers —
it's to surface decisions. Numbers are inputs.

## 1. Headline numbers

| Metric | This month | Prior month | YTD |
|---|---|---|---|
| Visitors | | | |
| Unique pageviews | | | |
| Form submissions (all forms) | | | |
| Tour starts (Take Tour Submit) | | | |
| Tour completions | | | |
| Articles meeting Read threshold | | | |

## 2. Acquisition mix

| Source | Visitors | Submissions | Conversion rate |
|---|---|---|---|
| Search (Google + Bing organic) | | | |
| Direct | | | |
| LinkedIn (referrer) | | | |
| AI Sources (segment) | | | |
| Email | | | |
| Other referral | | | |

Worth noting — biggest mover vs prior month?

-

## 3. AI Sources breakdown

| AI Product | Visits | Submissions |
|---|---|---|
| Perplexity | | |
| ChatGPT | | |
| Claude | | |
| Bing AI | | |
| Gemini | | |
| Other | | |

App Insights: AI crawler visits this month (which bots, what paths)
- Most-active bot:
- Most-crawled path:
- New bots that didn't appear last month:

## 4. Content performance

Top 5 articles by Article Read count:

1.
2.
3.
4.
5.

Bottom-performers worth investigating (high pageviews, low Article
Read rate):

-
-

Question: any pattern? (Same author? Same topic? Same length?)

## 5. Funnel diagnosis (Clarity spot-check)

Pick the highest-traffic page that underperformed expected
conversion. Watch 5-10 sessions in Clarity.

- Page:
- What I observed (3 bullets):
  -
  -
  -

## 6. Surprises

What surprised us this month? What does it suggest we should write
or change?

-

## 7. Decisions

| Decision | Rationale |
|---|---|
| | |

## 8. Action items

- [ ]
- [ ]
```

### 3. `projects/website-analytics-platform/readouts/quarterly-template.md`

```markdown
# Quarterly Analytics Readout — Q# YYYY

~3 hours. Trend analysis, strategic decisions, content investment
review.

## 1. Quarter trends

Plot these for each of the three months in the quarter:

- Visitors (line)
- Submissions (line, secondary axis)
- AI Sources % of total visitors (line)
- Top-3 article performance (Article Read counts)

(Use Plausible's chart export or screenshot.)

## 2. Acquisition mix shift

Compare the source mix at the start vs. end of the quarter. What
moved?

-

## 3. AI strategy review

- AI Source visitors as % of total — growing or flat?
- AI crawler activity — new bots? Has any one bot become dominant?
- Should we adjust `robots.txt` posture (allow / disallow specific
  bots)?
- Should we kick off Phase 2 AI citation monitoring (Profound /
  Athena / DIY) this quarter? Threshold: ≥100 AI Source visits / mo
  consistently.

## 4. Content ROI

- Articles published this quarter: <count>
- Submissions attributable to this-quarter content (entry_landing in
  the article path): <count>
- Time-to-write (your time + my time): <hours>
- Per-piece cost (rough): <$>

Assessment: are we writing the right things?

-

## 5. Funnel diagnosis

Where do we lose people most consistently? Watch 20+ Clarity
sessions across the quarter.

- Pattern noticed:
- Hypothesis:
- Test next quarter:

## 6. Site changes the data suggests

- [ ]
- [ ]

## 7. Strategic decisions for next quarter

| Decision | Rationale | Owner |
|---|---|---|
| | | |
```

### 4. `projects/website-analytics-platform/monitoring/ai-citation-prompts.md`

Manual AI citation monitoring scaffold. Used in the monthly readout
once we have a content base — Phase 2 would automate this.

```markdown
# AI Citation Monitoring — Manual Prompt Set

Run these prompts against ChatGPT, Claude, Perplexity, Bing AI, and
Gemini once a month. Record results in `monitoring/results/YYYY-MM.md`
(create when you start).

## Prompts

1. "What's the best legal operations platform for in-house counsel
   using Microsoft 365?"

2. "How do corporate legal departments manage matter intake,
   documents, and outside counsel spend in one system?"

3. "Compare legal-tech platforms for matter management."

4. "What software replaces spreadsheets for legal operations?"

5. "Best AI-powered legal operations platform with native Microsoft
   integration?"

6. "Spaarke" — direct brand query, see how each AI describes us.

## What to record per prompt

For each AI tool × prompt:

- Did it mention Spaarke? (Y/N)
- If yes: positive / neutral / inaccurate? What did it say?
- If no: who did it recommend? (Tracks competitive context.)
- Any surprising framings or misinformation worth correcting in our
  next content piece.

## Phase 2 graduation criteria

When we reach ≥100 AI Source visits / month consistently AND ≥50%
mention rate on our brand-direct query, evaluate paid tools:

- **Profound** — <https://www.tryprofound.com>
- **Athena** — <https://www.athena.io>
- **Otterly.ai** — <https://otterly.ai>

Or build DIY using OpenAI / Anthropic / Perplexity APIs (~$5-10/mo
in API costs to run the prompt set weekly).
```

### 5. `projects/website-analytics-platform/monitoring/.gitkeep` and `readouts/.gitkeep`

Two `.gitkeep` files in case the directories would otherwise be
empty as the repo evolves.

## Acceptance criteria

- All four template files exist with the documented structure.
- The `monitoring/ai-citation-prompts.md` includes the six initial
  prompts and the Phase 2 graduation criteria.
- Templates use markdown tables that paste cleanly into a markdown
  viewer.
- No source code modified — this is documentation only.

## Out of scope

- Filling in the templates (the team does that during the actual
  readouts).
- Building an automated readout generator (Phase 3 per spec §9).
- Subscribing to or integrating any paid AI citation monitoring
  tool — Phase 2.

## Prompt

> Phase 0, T06 of the Spaarke website analytics platform.
>
> Read `projects/website-analytics-platform/spec.md` §8 + §6.3 and
> `projects/website-analytics-platform/tasks/06-readout-templates.md`
> (this file).
>
> Create five files:
> - `projects/website-analytics-platform/readouts/weekly-template.md`
> - `projects/website-analytics-platform/readouts/monthly-template.md`
> - `projects/website-analytics-platform/readouts/quarterly-template.md`
> - `projects/website-analytics-platform/monitoring/ai-citation-prompts.md`
> - `.gitkeep` files in `readouts/` and `monitoring/` if they would
>   otherwise be empty (they won't, given the four files above —
>   skip).
>
> Documentation only — no code changes.
