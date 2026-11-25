# Lessons learned

What market access phase 2 taught, for the next module on this site. These notes were written on 2026-11-24, at task 090, and they add to phase 1's lessons in `projects/market-access/notes/lessons.md`.

## What worked

- **Phase 1's foundations carried the load.** Imports, codes, calendar entries and follow-up steps all write through `recordActivity` and `addMember` with keyed IDs, so every re-run in phase 2 added nothing without any new deduplication code.
- **Keyed IDs for scheduled jobs.** A step's follow-up ID is a hash of the campaign, step and contact. A run cut off halfway, a second run the same day, or GitHub starting the job twice all create nothing more. A 7-day catch-up window covers runs GitHub skips.
- **Stacked pull requests while the owner was busy.** Each task branched from the one before, so work kept moving without a merge per task. The cost: every live check now waits for one deploy at the end, so the final checks are longer.
- **One spike before the calendar code.** Task 001 settled that `calendarView` on each run is simpler than a delta query for a rolling window, and found the Exchange scope step before any code depended on it.

## What to do differently

- **Check an "audience" before reusing a page.** The brief route assumed every private brief was the investor overview. A general campaign's brief would have told a prospect they were an investor. New uses of an existing page need a look at what it assumes about its reader.
- **Work out a check's expected count from the fixture, not by hand.** Twice a check expected one more than the code produced, and both times the count was wrong, not the code. Build the fixture as a small table and count from it.
- **Ask what a later run sees.** A meeting first seen already canceled was logged as booked on the next sync, because nothing recorded that it had been seen. A pure check that ran the same events twice found it. Any sync that keeps state needs a "second run" check for each state.
- **Wait for the saved state in browser tests.** A form's live preview showed the same sentence the saved list would, so the test went on before the save. Wait for the element only the saved state has.
- **Short private values collide with ordinary words.** A 4-letter code matched the `.TEST` test domain. Search short values as whole words, then look at each hit's context before calling it a leak.

## Calendar quirks worth knowing

- Exchange gives each occurrence of a recurring meeting its own `iCalUId`, with the date written into bytes 16 to 19 of the UID. Zeroing them gives one key for the series.
- A deleted event is gone from `calendarView`, and reading it by ID answers 404 (`ItemNotFound`). It is logged as canceled, with no subject or place, since both are unknown.
- Private and confidential events must not show their subject, so the client drops it whatever Graph returns.
- Calendar access needs its own Exchange role assignment (`Application Calendars.Read`), apart from mail. A calendar failure is recorded apart and leaves the mailbox's mail sync marked as working.
- Under `tsx`, node's `assert` prints source from the wrong line, so its message can show the wrong expression. Read the actual and expected values instead.
