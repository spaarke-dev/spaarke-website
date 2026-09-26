# Task 020: Streaming endpoint

**Phase:** 2 (The endpoint)
**Status:** complete
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

- [x] A question returns a streamed answer. Driven end to end: 745 output tokens,
      six resolved citations across two articles
- [x] Citations arrive as structured events with heading and href resolved from
      the manifest, not prose to be parsed
- [x] Cache reads confirmed, `cacheRead: 154015` with no cache write
- [x] A forced upstream hang produces a visible error within the timeout. Forcing
      the first-token deadline to 50ms returned a TIMEOUT event
- [~] Upstream 429 is distinguishable from a failure. Coded and read by
      inspection; there is no way to make Foundry return 429 on demand, so this
      one is unverified and said so in `notes/endpoint-and-defences.md`
- [x] Token counts recorded per request, in the `done` event and in telemetry,
      with a `cacheMiss` flag because a miss is twelve times the cost
- [x] No key or token reaches the browser. The key is read in a server module and
      the client receives only events

## Notes

Streaming through Azure Static Web Apps managed functions needs verifying
early. If the platform buffers the response, the whole interface design
changes, so prove it streams before building anything on top of it.

Read `src/app/api/contact/route.ts` for the house patterns on validation,
telemetry flushing, and independent failure handling.

See spec FR-02, FR-08, NFR-04, NFR-06.

## Outcome

`src/app/api/article-insights/route.ts`, with `client.ts` for the Foundry client
and `stream.ts` for the event assembly. Full detail in
`notes/endpoint-and-defences.md`.

**The endpoint ships switched off**, behind `INSIGHTS_ENABLED`. Nothing calls it
yet, and a public route that spends money should come on with the interface that
uses it. Task 030 turns it on.

**The stream flushes by sentence rather than by token**, which is the design
decision worth remembering. Two of the three mechanical repairs need a whole
sentence: a quotation can only be checked once the citation that follows it has
arrived. Streaming token by token would show a false verbatim claim and then
correct it.

**Streaming through Azure Static Web Apps is still unproven.** It works through
Next locally. Whether the platform buffers has to be checked on the deployed site,
so the route carries a probe that emits six chunks half a second apart, needs no
flag and costs nothing:
`curl -N https://spaarke.com/api/article-insights?probe=stream`. Check it before
task 030, because if the platform buffers, the interface design changes.
