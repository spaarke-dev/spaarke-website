# Task 023: Partial answer polling

**Phase:** 2 (The endpoint)
**Status:** complete
**Estimated:** 4 hours
**Dependencies:** 020
**Tags:** api, azure, storage, typescript

## Goal

A reader sees the answer arrive a sentence at a time, on a platform that refuses
to stream.

## Context

Azure Static Web Apps buffers the response. Proven against the deployed site: every
chunk arrives at the end and the response carries `Content-Length` rather than
chunked encoding, while the same build streams correctly under `next start`. See
`notes/endpoint-and-defences.md`.

**The owner chose this option on 2026-09-26.** The alternatives were shipping
without progressive rendering, and moving the endpoint to an Azure Function App
that supports streaming. This one was chosen because it is the best experience
available rather than because it is the cheapest, and the reasoning is worth
keeping:

- The assembler already flushes by sentence, since a quotation can only be checked
  once the citation following it arrives. So real streaming and polling produce the
  same visual granularity, and the only difference is a few hundred milliseconds a
  sentence that no reader can perceive.
- The audience is in-house legal at large companies, on corporate networks that
  buffer or kill long-lived connections, which is exactly what Azure just
  demonstrated. A design that depends on chunked encoding reaching the browser
  fails for some of those readers, and fails as a hang.
- Polling has a fallback that streaming does not. The POST is still running and
  still returns the complete answer, so a blocked poller costs the reader
  progressive rendering and not the answer.

## Steps

1. Give each request an id. Generated server side, returned in a header on the
   POST response, and also accepted as a client-supplied id so the poller can
   start before the POST resolves. The second is what makes this work, because
   the POST does not resolve until the answer is finished.
2. As each event is assembled, append it to a blob keyed by that id, in the
   existing storage account. Newline-delimited JSON, the same event shape the
   stream already emits, so the client parses one format.
3. Add `GET /api/article-insights/partial?id=...`, which returns what has been
   written so far plus a flag for whether the answer is complete. It reads only
   the blob for that id and nothing else.
4. Keep the buffered POST response exactly as it is. It is the fallback: if the
   poller is blocked, the reader still gets the whole answer when the POST lands.
   The client renders whichever arrives first and ignores the duplicate.
5. Poll every 400ms while a request is open, stop on the complete flag, and stop
   on the POST resolving.
6. Expire the blobs quickly. They hold reader questions and answers, so a short
   life keeps them outside the 90-day conversation record rather than adding a
   second copy of it. A container lifecycle rule or a delete on completion.
7. Rate limit the poll route, cheaply. It costs a blob read rather than a model
   call, so the limit is about noise and not spend, but an unbounded GET on a
   public route is still a GET on a public route.
8. Measure time to first visible sentence against the deployed site, which is the
   number this whole task exists to improve.
9. Verify acceptance criteria are met.
10. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/insights/partial.ts` for the writer and reader
- `src/app/api/article-insights/partial/route.ts`
- `src/lib/insights/poll-client.ts`, which merges the two paths for task 030
- The POST route writing partial events as it assembles them
- `scripts/check-insights-partial.mts`, `scripts/check-insights-dedup.mts`,
  `scripts/measure-insights-first-sentence.mts`
- Time to first visible sentence in `notes/endpoint-and-defences.md`

## Acceptance Criteria

- [x] First sentence visible within about three seconds. **2.4 to 3.3s**, measured
      against a local production build with real storage and the real model. The
      deployed-site number needs `INSIGHTS_ENABLED=true`, which is prerequisite 2
      for task 030 and the owner's to set.
- [x] Sentences and citation chips appear progressively, not all at once. Thirteen
      of thirteen sentences arrived by polling, across twenty polls.
- [x] With the poller disabled, the reader still gets the complete answer from the
      POST response. Covered by the "partials are switched off" scenario in
      `check-insights-dedup.mts`, and by the route writing nothing when there is no
      storage connection.
- [x] The poll route reads one partition by id and session and exposes nothing
      else. An unknown id and a wrong session return byte-identical results, which
      is asserted rather than described.
- [x] Partial rows are gone within hours, not days. Better than asked: the POST
      deletes its own rows at close, and the ten minute expiry plus the sampled
      sweep are the backstop for a request that died mid-answer.
- [x] No duplicate rendering when both paths deliver. Six orderings, including one
      with a deliberately repeated sentence, in `check-insights-dedup.mts`.

## What was learned

**Deduplication had to be by position rather than by content.** Both paths emit
the same events in the same order because the route writes to both from one call,
so a count of what has been delivered is exact. Matching on text would drop the
second of two identical sentences, which an answer citing the same article twice
produces more often than it sounds.

**The deterministic test found a bug no live test would have.** Cancelling the
poller cleared its timer without waking the promise it was sleeping on, so
`askInsights` never returned. It only shows up when the poller is still sleeping
when the answer completes, which is the production ordering and not the local one.

**The buffering that defeats the stream cannot touch a poll.** A poll response is
short and complete before it is sent. That is the whole reason this works, and it
is worth stating because it also means the approach does not depend on any header
the platform chose to ignore.

## Notes

Table Storage rather than blobs, which is a change from the step above. One row per
event with a sequence row key gives the poller an incremental read for free, where
a blob would mean tracking byte offsets and re-fetching the whole body on every
poll. It also avoids adding `@azure/storage-blob` when `@azure/data-tables` is
already a dependency.

The id has to be client supplied or client readable before the POST resolves,
which is the one piece of this that is easy to get wrong. A design where the
poller needs the POST response to learn the id cannot start polling until there is
nothing left to poll for.

Do not add a second telemetry path. The POST already records the turn, the spend
and the events, and the poller is a transport detail rather than a thing that
happened.

See spec FR-02, FR-08, NFR-04, and `notes/endpoint-and-defences.md`.
