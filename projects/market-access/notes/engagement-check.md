# Engagement filter check (task 051)

FR-10 acceptance: the TLTF engaged list from `src/lib/market/engagement.ts` matches the private `track.py` for the same window. Counts only; no names or codes.

## Method

- Run on 2026-11-24 at 03:15 UTC.
- Both read the same App Insights events: `ask_ai.click` and `brief.read`, queried with `--offset 90d`.
- `track.py` ran as it is, with its window starting at the send, 2026-11-14 03:00 UTC. Only the recipient codes in its "Likely people" list were kept.
- The port grouped the same events by recipient code. Clicks come from `src=tltf-<code>` and reads from the label `tltf-2026:<code>`. Each recipient's hits then went through `engagedHits`.

## Events in the window

| | Count |
|---|---|
| Ask AI clicks with a recipient code | 231 |
| Brief reads | 21 |
| Clicks with a gateway-rewritten code | 8 |
| Recipients with any hit | 38 |
| Scanner bursts filtered by `track.py` | 71, across 36 recipients |

## Result

| Run | Engaged recipients | Same set as `track.py` |
|---|---|---|
| `track.py` | 6 | |
| Port, rewritten-code clicks matched campaign-wide (as `track.py` does) | 6 | yes |
| Port, rewritten-code clicks matched per member only (as the store does) | 6 | yes |
| Port, window from the import's estimated send time (02:00 UTC) | 6 | yes |

## Notes

- **The store works per member.** A rewritten-code click reaches a member only when its brief key resolves (the `/ask` route passes `k`). Such a click is flagged `codeRewritten` on the activity. Matching per member gives the same TLTF result as `track.py`'s campaign-wide matching.
- **Tests before the send.** In results, hits before the member's first `email.sent` are tests. For TLTF that is the import's estimated send time, 21:00 US Eastern on 2026-11-13. Moving the start to 03:00 UTC changes nothing.
- **What the backfill can carry.** The backfill (task 052) reads the same events. Brief reads carry their label. Ask AI clicks carry only `src`, so a rewritten-code click cannot be placed on a member, and it is left out. This check shows that does not change the TLTF engaged list.
- **TLTF engaged is still 0 on the campaign page.** No brief read or click is in the log for the imported members yet. They arrive with the backfill.
