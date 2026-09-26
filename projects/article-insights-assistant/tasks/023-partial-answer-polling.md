# Task 023: Partial answer polling

**Phase:** 2 (The endpoint)
**Status:** not-started
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

- `src/lib/insights/partial.ts` for the blob writer and reader
- `src/app/api/article-insights/partial/route.ts`
- The POST route writing partial events as it assembles them
- Time to first visible sentence, measured on the deployed site, in
  `notes/endpoint-and-defences.md`

## Acceptance Criteria

- [ ] First sentence visible within about three seconds on the deployed site
- [ ] Sentences and citation chips appear progressively, not all at once
- [ ] With the poller disabled, the reader still gets the complete answer from the
      POST response
- [ ] The poll route reads one blob by id and exposes nothing else
- [ ] Partial blobs are gone within hours, not days
- [ ] No duplicate rendering when both paths deliver

## Notes

The id has to be client supplied or client readable before the POST resolves,
which is the one piece of this that is easy to get wrong. A design where the
poller needs the POST response to learn the id cannot start polling until there is
nothing left to poll for.

Do not add a second telemetry path. The POST already records the turn, the spend
and the events, and the poller is a transport detail rather than a thing that
happened.

See spec FR-02, FR-08, NFR-04, and `notes/endpoint-and-defences.md`.
