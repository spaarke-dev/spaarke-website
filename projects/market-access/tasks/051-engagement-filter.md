# Task 051: Engagement filter

**Phase:** 5 (Imports and backfill)
**Status:** not-started
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

- [ ] The TLTF engaged list matches `track.py` output for the same window (FR-10 acceptance).

## Notes

- Task 033 counts every `brief.read` and `ask_ai.click` tagged with the campaign as engaged (`STAGE_OF` in `results.ts`). Apply the filter in `memberActivities` or `deriveMemberStatus`, then remove the note on the campaign page that says engaged counts every read.

- The quiet window is a constant (15 minutes) with a comment pointing to the spec assumption.
- Spec references: FR-10, Assumptions.
