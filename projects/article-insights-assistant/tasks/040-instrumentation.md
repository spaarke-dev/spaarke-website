# Task 040: Instrumentation and the engagement baseline

**Phase:** 4 (Instrument and launch)
**Status:** not-started
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

- [ ] Every event type confirmed arriving by an Application Insights query
- [ ] Pre-launch baseline captured and recorded
- [ ] Comparative measure runs and produces a readable answer
- [ ] Per-turn cost observable, not merely estimated
- [ ] Cost alert fires below the ceiling, tested
- [ ] The threshold that would count as failure written down in advance

## Notes

Step 7 matters more than it looks. Deciding after the fact what counts as
success is how features survive evidence they are not working. Write the
threshold down before the data exists.

See spec NFR-01, NFR-03, NFR-06, success criteria 9 and 10.
