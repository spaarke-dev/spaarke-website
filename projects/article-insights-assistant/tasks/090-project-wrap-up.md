# Task 090: Project wrap-up

**Phase:** 4 (Instrument and launch)
**Status:** complete (2026-09-28)
**Estimated:** 3 hours
**Dependencies:** 040
**Tags:** testing, accessibility, performance, deploy

## Goal

Every acceptance criterion in the spec verified, the assistant live across
all 21 articles, and what was learned written down.

## Steps

1. Walk the 11 success criteria in `spec.md` one by one and record the
   result of each, including any that failed.
2. Run the evaluation suite from task 012 and record the pass rate.
3. Run a Lighthouse audit on an article page with the console present.
   Confirm the assistant has not cost the page its performance or
   accessibility scores.
4. Manual pass at 375px and 1440px.
5. Confirm citation anchors resolve on a sample across several articles.
6. Verify the disclaimer is present on both surfaces in the first rendered
   state.
7. Confirm the cost alert is configured and telemetry is arriving.
8. Enable the console across all 21 articles.
9. Produce the first content-gap report from the question log, even if the
   sample is small, to prove the pipeline works end to end.
10. Update `README.md` status to Complete and mark the plan milestones.
11. Write `notes/lessons-learned.md`.
12. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `notes/lessons-learned.md`
- `notes/launch-verification.md` with the result of each criterion
- First content-gap report
- README and plan updated

## Acceptance Criteria

- [x] All 11 spec success criteria checked, with failures recorded honestly
      rather than omitted
- [x] Evaluation suite run and pass rate recorded
- [~] Lighthouse scores not materially degraded against the pre-console
      baseline
- [x] Both viewports verified by hand
- [x] Console live on all 21 articles
- [x] First content-gap report produced

## Notes

The engagement comparison from task 040 will not have enough data on
launch day. Record what exists, note when to look again, and put a date on
it. A measurement nobody returns to is the same as no measurement.

Criteria that failed belong in the verification note. A wrap-up that
records only what passed is not a record.

See spec Success Criteria.


## Result

Done 2026-09-28. Recorded in `notes/launch-verification.md` and
`notes/lessons-learned.md`.

**9 of 11 success criteria met, 1 partly met, 1 not yet assessable.**

- Criterion 4, general-knowledge labeling, is **partly met**. The evaluation run
  scored 37 of 40 and all three failures are the model over-claiming corpus
  grounding. Shipped known.
- Criterion 10, the engagement comparison, **cannot be assessed yet**. The
  console has been live one day. **Look again on 2026-10-12.**
- The Lighthouse criterion is marked `~` rather than met or failed, because
  **no pre-console baseline was ever captured**, so the comparison it asks for
  cannot be made. Absolute desktop scores are recorded instead: Performance 98,
  Accessibility 96, SEO 100, Best Practices 78 against a target of 95. The Best
  Practices gap is the reCAPTCHA cookie the bot defence requires.
- The console is live on **24** articles, not the 21 the criterion names. The
  corpus grew after the spec was written.
