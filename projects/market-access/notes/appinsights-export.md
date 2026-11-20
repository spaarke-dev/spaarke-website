# App Insights safety export (task 004)

Exported 2026-11-20 (UTC) from `appi-spaarke-website`, with `az monitor app-insights query --offset 90d`. The file is private, outside the repo: `C:\code_files\spaarke-research\market-access\appinsights-engagement-2026-11-20.json`. It holds every custom event in retention, not only the two the backfill needs, since the whole set is 508 rows. Each row has the timestamp, name, custom dimensions, client location and browser, session, user and operation IDs.

| Event | Rows | Earliest (UTC) | Latest (UTC) |
|---|---:|---|---|
| `ask_ai.click` | 323 | 2026-11-13 21:47 | 2026-11-20 02:22 |
| `brief.read` | 26 | 2026-11-14 03:31 | 2026-11-19 15:49 |
| All other events (25 names) | 159 | 2026-09-25 16:14 | 2026-11-19 14:03 |
| **Total** | **508** | 2026-09-25 16:14 | 2026-11-20 02:22 |

The other events include `meet.booked` (4), `meet.cancelled` (1), `investor_overview.*` (25), `design_partner.*` (6), `demo_request.*` (5), `contact.*` (25) and `tour.*` (8). They are in the file in case a later task wants them; FR-13 needs only the first two.

The acceptance check asked for an earliest timestamp before the 2026-11-13 send. The two engagement events started on the day of the send, because the routes that emit them launched with it. The export already reaches back to 2026-09-25, so nothing has aged out yet: the oldest event in retention is in the file.

Task 052 can read this file instead of App Insights after 2027-02-11. Events after 2026-11-20 are not in it; the live data covers them until their own 90 days run out.
