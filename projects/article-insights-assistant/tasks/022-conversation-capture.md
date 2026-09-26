# Task 022: Conversation capture

**Phase:** 2 (The endpoint)
**Status:** not-started
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

- Table Storage table and schema
- `src/lib/insights/capture.ts`
- `scripts/content-gap-report.mjs`
- `notes/conversation-schema.md`

## Acceptance Criteria

- [ ] Turns recorded with question, slug, provenance and continuation
- [ ] No identifying field beyond existing site collection
- [ ] Session id ephemeral, not a cookie
- [ ] 90-day purge implemented and demonstrated
- [ ] Content-gap report runs and produces readable output
- [ ] Public endpoint cannot read the store

## Notes

Readers will type confidential things into this despite being asked not
to. That is a reason to keep retention short and access narrow, not a
reason to capture less of the useful signal.

The provenance field is what makes the gap report possible. A question
answered from general knowledge is a subject the library does not cover,
which is the whole point of recording it.

See spec FR-07, NFR-07.
