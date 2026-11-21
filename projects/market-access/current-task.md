# Current task

> Context recovery for market access sessions. Update it when a task starts, pauses or finishes.

## Quick recovery

| Field | Value |
|-------|-------|
| **Task** | 031: Contact detail and edits |
| **Step** | PR open |
| **Status** | done; PR pending Ralph's go-ahead to merge |
| **Next action** | After merge: task 033 (campaigns), then 053 (LinkedIn import, before 2026-12-19) |

- **Spike:** done; findings and decision in `notes/auth-spike.md`. Draft PR #163 closed without merging.
- **Store:** tasks 010 to 012 merged (PR #164).
- **Admin guard:** task 002 merged (PR #168); `/admin` live behind the `admin` role.
- **Mailbox setup:** task 003 merged (PR #169) and run in the tenant 2026-11-20.
- **Plan:** approved and merged 2026-11-19 (PR #162).

## Open questions and where they stand

| # | Question | Status |
|---|---|---|
| 1 | Reuse the `/meet` Graph app for mail read? | Answered 2026-11-19: reuse it |
| 2 | Confirm which Summit meetings took place? | Open; raise at task 050 |
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
