# Task 022: Conversation capture

**Phase:** 2 (The endpoint)
**Status:** complete
**Estimated:** 2 hours
**Dependencies:** 020
**Tags:** api, azure, storage

## Goal

Every turn recorded in a form that answers the question "what are readers
asking that our writing does not cover", within the privacy commitments
already published.

## Context

This is arguably the highest-value output of the whole feature. What a
reader asks the ontology article is the brief for the next article.

The privacy policy now commits publicly to what is captured, why, and for
how long, so this task implements a promise rather than deciding one.

## Steps

1. Create the Table Storage table for conversation turns.
2. Record per turn: question text, article slug, provenance of the answer,
   whether the reader continued, ephemeral session id, timestamp.
3. Do not record anything identifying beyond what the site already
   collects. No name, no email, no IP in clear.
4. Use an ephemeral client-side session id, not a cookie and not a
   persistent identifier.
5. Implement the 90-day purge of question text, leaving aggregate counts.
6. Write a query that produces a content-gap report: questions answered
   from general knowledge rather than the corpus, grouped by subject.
7. Confirm the store is not reachable from the public endpoint beyond the
   write path.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- Table Storage table `InsightsConversations` and its schema
- `src/lib/insights/capture.ts`
- `scripts/content-gap-report.ts`, TypeScript rather than `.mjs` so it shares the
  types, run with `npm run insights:gap`
- `notes/conversation-schema.md`

## Acceptance Criteria

- [x] Turns recorded with question, slug, provenance, citations, continuation,
      whether the assistant asked back, answer length and error code
- [x] No identifying field. No IP, no IP hash, no name, no email, no user agent
- [x] Session id client generated and ephemeral, not a cookie, not persisted
- [x] 90-day purge implemented and demonstrated against real Table Storage: a row
      dated 120 days back lost its question text, kept every aggregate column, and
      a second pass changed nothing
- [x] Content-gap report runs. Verified on an empty window against the real table
      and on populated, missing-table and bad-argument cases against an emulator
- [x] Public endpoint cannot read the store. The route calls `recordTurn` and
      there is no read path, no API over the table and no route taking a key

## Notes

Readers will type confidential things into this despite being asked not
to. That is a reason to keep retention short and access narrow, not a
reason to capture less of the useful signal.

The provenance field is what makes the gap report possible. A question
answered from general knowledge is a subject the library does not cover,
which is the whole point of recording it.

See spec FR-07, NFR-07.

## Outcome

Written by a subagent working in parallel with task 021, then reviewed, corrected
and wired in. Full detail in `notes/conversation-schema.md`.

**The partition key is the UTC date.** Both jobs this table has are time ranged,
the purge and the report, so a date partition makes each a key range scan rather
than a table scan.

**The purge blanks the question and keeps the row**, so the aggregate counts the
gap report is built on survive the retention window. It runs sampled from the
write path, roughly one write in fifty, because there is no scheduler and no
storage secret in CI, and putting a privacy promise behind new infrastructure is
how the promise ends up unkept. Bounded to 500 rows a pass in review, since it
runs inside a request and the first pass after the window fills could otherwise
face thousands.

**A correction found during review, and it matters.** Both the spec and this
task's framing said the privacy policy already commits publicly to 90-day
retention. It does not. The wording is written and held in draft PR #90,
deliberately unmerged so the live policy does not describe a feature nobody can
use. So this code currently keeps a promise that has not been made. That is the
safe order, and it means **PR #90 has to merge with the console**. The spec has
been corrected.
