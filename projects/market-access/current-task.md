# Current task

> Context recovery for market access sessions. Update it when a task starts, pauses or finishes.

## Quick recovery

| Field | Value |
|-------|-------|
| **Task** | 052: Backfill CLI |
| **Step** | PR open |
| **Status** | built; PR and the live run wait for Ralph |
| **Next action** | With Ralph's go-ahead: merge, then run `npm run market:backfill -- --from-file <export> --app appi-spaarke-website --resource-group rg-spaarke-website`, check the TLTF engaged count against `track.py` (6), run it again to confirm nothing is added, and record the run date here; then 090 (wrap-up). Ralph: correct Summit meetings that did not happen on `/admin/campaigns/tltf-2026`; work through `/admin/triage`; confirm `NoMailboxAccess` against a real mailbox outside the scope; try the LinkedIn import with the first real export after 2026-12-19 |

- **Spike:** done; findings and decision in `notes/auth-spike.md`. Draft PR #163 closed without merging.
- **Store:** tasks 010 to 012 merged (PR #164).
- **Admin guard:** task 002 merged (PR #168); `/admin` live behind the `admin` role.
- **Mailbox setup:** task 003 merged (PR #169) and run in the tenant 2026-11-20.
- **Plan:** approved and merged 2026-11-19 (PR #162).

## Open questions and where they stand

| # | Question | Status |
|---|---|---|
| 1 | Reuse the `/meet` Graph app for mail read? | Answered 2026-11-19: reuse it |
| 2 | Confirm which Summit meetings took place? | Answered 2026-11-23: import every calendar meeting as held; Ralph corrects the ones that did not happen with the status override |
| 3 | Default visibility for form-submitted investors? | Answered 2026-11-20: `general`, except the investor overview form (`investor`) |

## Decisions made

- Store checks run against the Azurite emulator (`npx -p azurite azurite-table --inMemoryPersistence`), not the live storage account. The script refuses to touch storage unless `MA_TABLE_SUFFIX` is set.
- Idempotency marker written last; long summaries shortened, not rejected (see task 012 notes).
- Auth: pre-configured Entra provider with invitation roles; SWA role rules guard `/admin` pages; `/api/admin/*` handlers check the role in code and return JSON 401 or 403 (see `notes/auth-spike.md`).
- Organization visibility: created as the first contact's visibility, becomes `general` when a `general` contact joins.

## Log

- 2026-11-19: spec Owner Clarifications updated (contactus@spaarke.com is a user mailbox with an Exchange license only). Plan, tasks and README generated; plan approved and merged (PR #162).
- 2026-11-19: task 001 spike routes deployed to a preview via draft PR #163.
- 2026-11-19: tasks 010 to 012 built; `npm run market:check` passes 16 checks against Azurite.
- 2026-11-19: store merged (PR #164). Auth spike finished in the browser signed in as Ralph; all seven questions answered (`notes/auth-spike.md`).
- 2026-11-19: task 002 built (guards, admin layout and home, SWA rules, robots).
- 2026-11-19: task 002 merged (PR #168) and verified on production signed out. Open question 1 answered: reuse the `/meet` Graph app. Task 003 instructions written.
- 2026-11-19: task 003 merged (PR #169); tenant steps waiting on Ralph. Task 004 done: 508 custom events exported privately (`notes/appinsights-export.md`).
- 2026-11-20: tenant setup for task 003 run by Claude at Ralph's request (his Exchange admin sign-in): "Market access sync" group (2 members), scope, `Application Mail.Read` on it. `Test-ServicePrincipalAuthorization`: Mail.Read in scope for both synced mailboxes, out of scope for another mailbox; the meet calendar scope unchanged. `market-sync-token` created in the website's Key Vault, `MA_SYNC_TOKEN` set in app settings and GitHub secrets.
- 2026-11-20: PR #170 merged. Task 013 built: campaigns, members with code and brief-label lookups, member links in recordActivity, audit log; 21 checks pass against Azurite.
- 2026-11-20: PR #171 merged; stale preview environments removed. Question 3 answered; Ralph confirmed all mail with a known contact is logged, personal or not. Tasks 021 and 022 built; 24 checks pass.
- 2026-11-20: PR #174 merged (tasks 021, 022) and live. Task 020 built: the five forms record after their own save; 26 checks pass.
- 2026-11-20: PR #175 merged (task 020) and live. Task 030 built: admin home and contacts list on `queries.ts`; 28 checks pass; a 10,000-contact scan takes about 200 ms in the emulator.
- 2026-11-20: PR #176 merged (task 030) and live. Task 031 built: contact page with edit, log, merge and delete, all audited; deleted contacts are tombstoned; 32 checks pass.
- 2026-11-21: PR #177 merged (task 031) and live. Task 033 built: campaign list and page with funnel, member table, add members and status overrides, all audited; 37 checks pass; 500 members load in about 100 ms in the emulator.
- 2026-11-22: PR #180 merged (task 033) and live. Task 053 built: `/admin/import` previews and imports a Lead Gen Form CSV into a campaign; a second import adds nothing; 40 checks pass.
- 2026-11-22: PR #181 merged (task 053). Task 034 built: follow-ups on contacts, bulk follow-ups on campaigns, due and overdue on `/admin`, all audited; 43 checks pass.
- 2026-11-22: PR #182 merged (task 034) and live. Task 060 built: the morning report lists follow-ups due and new contacts, investor records as counts only; 44 checks pass.
- 2026-11-22: PR #183 merged (task 060) and live. Task 032 built: organization list and page with edits and domain overrides, all audited; the contacts cache is now shared between pages and API routes; 46 checks pass.
- 2026-11-22: PR #184 merged (task 032) and live. Task 040 built: Graph mail client and `npm run market:mail`; read both synced mailboxes live (counts only); 47 checks pass.
- 2026-11-22: PR #185 merged (task 040) and live. Task 041 built: `/admin/mailboxes` adds, edits, pauses, removes and checks access, all audited; the last sync error shows on the page; 49 checks pass.
- 2026-11-23: PR #187 merged (task 041) and live; Ralph registered both mailboxes and Check access passed on each. Task 042 built: `/api/market/sync` and the 30-minute workflow; known-contact mail, bounces, triage queue, follow-up auto-close; 51 checks pass.
- 2026-11-23: PR #190 merged (task 042) and live after a re-run (a concurrent deploy canceled the first). Two runs by hand caught up both mailboxes: 63 contactus messages, 4 queued for triage; 891 personal messages, none with a contact yet. Task 043 built: `/admin/triage` accepts, links or dismisses senders, all audited; 53 checks pass.
- 2026-11-23: PR #192 merged (task 043). Open question 2 answered: import every Summit meeting, confirm later. Task 050 built: `npm run market:import-tltf`; the dry run matches `index.csv` (81 sent, 10 bounced, 11 replies); 55 checks pass.
- 2026-11-23: PR #193 merged (task 050) and live. Import run against live storage: 95 contacts, 95 members, 134 activities; sent 81, bounced 10, replied 11, matching `index.csv`; a second run added nothing.
- 2026-11-23: PR #195 merged (task 050 run records). Task 051 built: the `track.py` scanner filter in `engagement.ts`, applied to member statuses; the TLTF engaged list matches `track.py` (6 and 6, same set); 57 checks pass.
- 2026-11-23: PR #198 merged (task 051) and live. Task 061 built: the privacy page section on contact and activity records, wording approved by Ralph.
- 2026-11-24: PR #201 merged (task 061, wording approved). Task 052 built: `npm run market:backfill`; dry run against live data reads 50 form rows, 4 bookings and 408 events, nothing yet logged; 59 checks pass.
