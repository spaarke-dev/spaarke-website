# Task 020: Streaming endpoint

**Phase:** 2 (The endpoint)
**Status:** not-started
**Estimated:** 4 hours
**Dependencies:** 002, 011
**Tags:** api, azure-functions, serverless, typescript

## Goal

A streaming route that takes a question and an article slug, calls Foundry
with the cached corpus, and streams a labeled answer back.

## Context

Everything the reader experiences passes through here. The two things that
must not be got wrong are the cache, because it is the cost model, and the
timeout, because an LLM call is slow enough that ambiguous silence is the
default state rather than the edge case.

The contact form failed on 2026-09-25 in exactly that way: two awaits with
no timeout, a hung promise caught by nothing, and a visitor who reasonably
concluded their message had sent. This endpoint is slower and more likely
to hang. Do not repeat it.

## Steps

1. Create `src/app/api/article-insights/route.ts`.
2. Validate the request: question length, article slug against the
   manifest, conversation turn count.
3. Compose the prompt from task 011, with the corpus in the cached block.
4. Call Foundry with `stream: true` using `@anthropic-ai/foundry-sdk`.
5. Stream back to the client, emitting citations as structured events
   rather than embedding them in prose the client has to parse.
6. Put a hard timeout on the upstream call. A request that does not begin
   streaming within it aborts and returns an error that names the failure.
7. Handle upstream 429 with a distinct client-visible message, since rate
   limiting by Foundry is different from ours and the reader should be told
   to retry rather than told something broke.
8. Track cache read and write token counts per request for the cost log.
9. Flush telemetry before returning, per the logger fix of 2026-09-25.
10. Verify acceptance criteria are met.
11. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/app/api/article-insights/route.ts`
- `src/lib/insights/client.ts` for the Foundry client
- `src/lib/insights/stream.ts` for event encoding

## Acceptance Criteria

- [ ] A question returns a streamed answer
- [ ] Citations arrive as structured events, not prose to be parsed
- [ ] Cache reads confirmed on the second turn, not rewrites
- [ ] A forced upstream hang produces a visible error within the timeout
- [ ] Upstream 429 is distinguishable from a failure
- [ ] Token counts recorded per request
- [ ] No key or token reaches the browser

## Notes

Streaming through Azure Static Web Apps managed functions needs verifying
early. If the platform buffers the response, the whole interface design
changes, so prove it streams before building anything on top of it.

Read `src/app/api/contact/route.ts` for the house patterns on validation,
telemetry flushing, and independent failure handling.

See spec FR-02, FR-08, NFR-04, NFR-06.
