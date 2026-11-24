# Market access

> **Status**: Built and live (2026-11-24). Open for the owner's final checks; see [`notes/verification.md`](notes/verification.md).

A signed-in admin area on the website that brings Spaarke's contacts, organizations, activity, outreach projects and follow-ups into one place. Every site form and engagement writer feeds one activity log, the synced mailboxes add email, and campaigns (outreach projects) report their results from that log. Phase 1 makes the TLTF Summit 2026 outreach pattern repeatable and measurable.

- **Spec**: [`spec.md`](spec.md) (approved 2026-11-19)
- **Design notes**: [`design.md`](design.md)
- **Plan**: [`plan.md`](plan.md)
- **Tasks**: [`tasks/TASK-INDEX.md`](tasks/TASK-INDEX.md)
- **Session state**: [`current-task.md`](current-task.md)

## Tech stack

- Next.js 16 App Router (TypeScript), hybrid, on Azure Static Web Apps (Standard).
- SWA authentication with Microsoft Entra ID; roles `admin` and `investor`.
- Azure Table Storage through `@azure/data-tables` and `STORAGE_ACCOUNT_CONNECTION`. New tables use the `Ma` prefix.
- Microsoft Graph over `fetch` with app-only credentials, limited by Exchange RBAC for Applications (the `/meet` pattern).
- GitHub Actions for the 15-minute mail sync, the same shape as `daily-report.yml`.
- Tailwind v4 with the v2 tokens, and `@fluentui/react-icons`.

## Code map

| Path | What |
|---|---|
| `src/lib/market/` | Store, `recordActivity`, contact resolution, Graph mail sync, campaign results |
| `src/app/admin/` | Admin pages |
| `src/app/api/admin/` | Admin API routes (role-guarded) |
| `src/app/api/market/sync/` | Bearer-token route the scheduled sync calls |
| `scripts/market/` | CLI importers and the backfill; private paths are arguments |
| `scripts/check-market.mts` | Check script for the store (`npm run market:check`) |
| `docs/market-access-mailboxes.md` | Exchange and app setup, and the add-a-mailbox runbook |

## Local development

1. Copy the storage connection into `.env.local` and point the module at dev tables:

   ```
   STORAGE_ACCOUNT_CONNECTION=<connection string>
   MA_TABLE_SUFFIX=Dev
   ```

2. Run the site with `npm run dev`. SWA authentication does not run locally, so the admin guard accepts a local principal only when `MA_DEV_PRINCIPAL` is set and `NODE_ENV` is `development` (task 002 defines the exact shape).
3. Run `npm run market:check` after changes to the store.

Never point local runs or imports at the production tables with real data unless that is the intent of the run, and never commit an export, list or address.

## Deployment

Merges to `main` deploy through `.github/workflows/azure-static-web-apps-*.yml`, and every PR gets a preview environment. New app settings (sync bearer token, Graph app settings) are set with `az staticwebapp appsettings set`, and the GitHub secret for the sync workflow with `gh secret set`. The setup Ralph runs in Exchange and Entra is in `docs/market-access-mailboxes.md` (task 003).

## Privacy

The repo is public. No contact data, recipient lists, codes, brief keys, mailbox addresses (beyond the published contactus@spaarke.com), tenant IDs or secrets go in git. Imports read private files from `C:\code_files\spaarke-research` at run time.
