# Task 051: Engagement filter

**Phase:** 5 (Imports and backfill)
**Status:** done
**Estimated:** 2 hours
**Dependencies:** 033
**Tags:** typescript

## Goal

The `track.py` scanner filter, ported to `src/lib/market/engagement.ts`, decides which brief reads and clicks count as engagement in campaign results.

## Context

FR-10: ignore the first 15 minutes after a recipient's first hit, multi-hit bursts, and gateway-rewritten codes. The private `track.py` is the reference; read it from `C:\code_files\spaarke-research` and port the rules, not the data.

## Steps

1. Read `track.py` and write the rules as pure functions over a member's hit list.
2. Use them in `deriveMemberStatus` (task 033) and remove the page's "unfiltered" note.
3. Compare the TLTF engaged list with `track.py` output for the same window; record the counts (not names) in `notes/`.

## Expected outputs

- `src/lib/market/engagement.ts`
- `projects/market-access/notes/engagement-check.md` (counts only)

## Acceptance criteria

- [x] The TLTF engaged list matches `track.py` output for the same window (FR-10 acceptance).

## Notes

- Task 053 also counts a `linkedin.lead` tagged with the campaign as engaged. The filter is for link scanners, so leave lead submissions out of it.
- Task 033 counts every `brief.read` and `ask_ai.click` tagged with the campaign as engaged (`STAGE_OF` in `results.ts`). Apply the filter in `memberActivities` or `deriveMemberStatus`, then remove the note on the campaign page that says engaged counts every read.

- The quiet window is a constant (15 minutes) with a comment pointing to the spec assumption.
- Spec references: FR-10, Assumptions.

## As built

- `src/lib/market/engagement.ts` ports the rules of `track.py` as pure functions over one member's hits. The first hit marks delivery, and anything in the 15-minute quiet window after it is a scanner. Clicks less than 5 seconds apart form a burst, and a burst of more than one is a scanner. A click with a rewritten code is a scanner, and so is a burst within a second of one. A brief read within 30 seconds after a scanner burst came from it. Hits before the member's first sent email are tests.
- `results.ts`: `withoutScanners` drops the hits the filter gives to machines before `deriveMemberStatus` picks the furthest stage, so a scanner-only member stays `sent`. Scanner hits no longer move a member's last activity. A LinkedIn lead tagged with the campaign still counts as engaged without the filter.
- `activity.ts`: an Ask AI click whose recipient code matches no member while its brief key does is stored with `codeRewritten`. That is how a gateway-rewritten link (for example `gyga-...`) shows up in the log.
- The campaign page note now says what engaged leaves out.
- The comparison with `track.py` is in `notes/engagement-check.md`, with counts only: 6 engaged recipients in both, the same set. Matching rewritten codes per member, as the store does, gives the same result as `track.py`'s campaign-wide matching.
- Checks: one pure check (the rules and their effect on member status) and one storage check (a rewritten-code click is flagged). Two existing checks now open with a delivery hit, since a lone first hit never counts. 57 pass.
- Verified locally against Azurite: the campaign page shows the new note, with no server errors.
