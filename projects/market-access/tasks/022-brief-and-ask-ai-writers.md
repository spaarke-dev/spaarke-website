# Task 022: Brief read and Ask AI writers

**Phase:** 2 (Site writers)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 013
**Tags:** nextjs, api, storage

## Goal

`/brief/[key]` and `/ask/[provider]` record `brief.read` and `ask_ai.click` against the campaign member they belong to, and record nothing when neither the code nor the brief label resolves.

## Context

FR-06: these routes have no email. A brief read resolves through the brief label (`getPrivateBrief` returns it); an Ask AI click resolves through the recipient code in `src` or the brief key in `k`. Both routes already emit App Insights events, which stay.

## Steps

1. In `src/app/brief/[key]/route.ts`, after the brief is found, call `recordActivitySafe` with type `brief.read`, the member found by brief label, source `brief`, and a source ID that makes a single read unique (request time to the second plus label), so retries within the same second do not double.
2. In `src/app/ask/[provider]/route.ts`, resolve `src` as a member code first, then `k` as a brief key; record `ask_ai.click` with the provider in the summary.
3. Keep the raw hit time on the activity; the scanner filter (task 051) is applied when results are computed, not at write time, so nothing is lost.
4. Keep both routes' visitor latency within the timeout; they redirect or stream immediately after.

## Expected outputs

- Changes to `src/app/brief/[key]/route.ts` and `src/app/ask/[provider]/route.ts`
- `src/lib/market/writers.ts` additions

## Acceptance criteria

- [ ] A read with a known brief label writes one `brief.read` on the right member.
- [ ] A click with an unknown `src` and no `k` writes nothing.
- [ ] Neither the brief key nor the code is logged.

## Notes

- Spec references: FR-06, FR-10.
