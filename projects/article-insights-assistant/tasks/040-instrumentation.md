# Task 040: Instrumentation and the engagement baseline

**Phase:** 4 (Instrument and launch)
**Status:** instrumented, baseline pending
**Estimated:** 3 hours
**Dependencies:** 030, 031
**Tags:** testing, azure, performance

## Goal

Events confirmed arriving, and a baseline captured before launch, so the
question "does this deepen engagement or replace it" is answerable later.

## Context

Whether the assistant serves the articles or competes with them is
genuinely unknown. Nobody knows, including the people who built it. That
makes measurement the deliverable rather than a nicety.

Confirming arrival matters here more than usual. This site logged 11
requests in 30 days while serving live traffic, because telemetry batched
and the function was torn down before the batch went out. The flush fix
shipped 2026-09-25, but assume nothing and verify.

## Steps

1. Emit events for console open, question asked, answer provenance,
   citation followed, each failure state, and each abuse defence firing.
2. Flush telemetry per the logger fix, and confirm events land by querying
   Application Insights rather than trusting the call.
3. Capture a scroll-depth and time-on-page baseline for article pages
   before the console is enabled for readers.
4. Instrument the comparison: assistant users against non-users, on scroll
   depth and time on page.
5. Instrument cost: tokens and estimated spend per turn, so the monthly
   ceiling is observable rather than discovered on the invoice.
6. Configure an Azure cost alert below the 500 USD ceiling.
7. Document in `notes/measurement.md` what is measured, what would count as
   the assistant competing with the articles, and what the response would
   be.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- Telemetry across the console and endpoint
- `notes/measurement.md`
- Azure cost alert
- Recorded pre-launch baseline

## Acceptance Criteria

- [x] **The telemetry pipeline confirmed arriving.** Application Insights held zero
      rows in every table across 90 days. A side-effect-free event was then fired
      in production and arrived, so the flush fix of 2026-09-25 works and the
      silence was absent traffic. The `insights.*` events themselves cannot be
      confirmed until the console is on, and the repeatable query is in
      `notes/measurement.md`.
- [ ] **Pre-launch baseline captured.** Not possible yet, and the reason is
      sequencing rather than effort. `Article Engagement` is a new event with no
      history, so the baseline has to be collected while the console is off. The
      instrumentation ships first, then at least 150 article visits and two weeks,
      then `INSIGHTS_ENABLED=true`. Skipping the wait does not delay the answer, it
      removes it.
- [x] **The comparative measure is built.** `assistant: true` or `false` on every
      `Article Engagement`, so the comparison is a breakdown of one event rather
      than a join across two. It cannot produce an answer before it has data.
- [x] **Per-turn cost observable.** `costUsd` on every `insights.answer`, computed
      from the rates in `notes/cost-model.md`. A token count is not this: nobody
      sums tokens by rate class in a dashboard at the moment they need the number.
- [ ] **Cost alert.** None exists, which was checked rather than assumed. Not
      created here because a budget notification needs an email address, and
      putting the owner's address into an Azure resource is their decision rather
      than a step in a task. The command is in `notes/measurement.md`.
- [x] **The failure thresholds written down in advance.** Four of them, chosen on
      2026-09-27 before any data exists, each with the response it triggers, plus
      what is explicitly not a failure.

## What was found

**Application Insights had received nothing in ninety days**, across every table.
The task said to assume nothing and verify, and verifying is what turned that from
a broken pipeline into a quiet one: a side-effect-free production event arrived
within a minute. The connection string was also confirmed to point at the right
resource, without printing it.

**`requests` and `pageViews` are empty for a reason that is not a bug.** Automatic
request collection does not hook into Next.js App Router handlers on Static Web
Apps managed functions, and there is no browser SDK on this site. Page views live
in Plausible. Anyone reading an empty `requests` table as an outage will waste a
day.

## Notes

Step 7 matters more than it looks. Deciding after the fact what counts as
success is how features survive evidence they are not working. Write the
threshold down before the data exists.

**The one thing to do next is nothing.** Merge this, leave `INSIGHTS_ENABLED`
unset, and let the baseline accumulate. Turning the console on the same day removes
the only chance to know whether it helped.

See spec NFR-01, NFR-03, NFR-06, success criteria 9 and 10, and
`notes/measurement.md`.
