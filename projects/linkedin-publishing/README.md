# LinkedIn Publishing

Claude-Code-orchestrated LinkedIn publishing for Spaarke. Publishes
feed-card posts (commentary + image + link to canonical article on
spaarke.com) to either the operator's personal LinkedIn account or
the Spaarke Company Page, triggered from a single chat command in
Claude Code with an approve-in-chat gate.

## Status

🟡 In Progress — Phase 0 (foundation) starting; Phase 3 (company
posting) gated on LinkedIn Community Management API approval
(2–6 week SLA, submitted 2026-05-13).

## Quick links

- [spec.md](spec.md) — full architecture spec
- [plan.md](plan.md) — phase breakdown and milestones
- [tasks/TASK-INDEX.md](tasks/TASK-INDEX.md) — task registry with parallel-execution groups
- [current-task.md](current-task.md) — active task pointer (session recovery)

## Tech stack

- Node.js + TypeScript for the publish/auth CLIs in `scripts/linkedin-*.ts`
- Azure Key Vault (`sprk-demo-kv`) for credential storage
- Azure Functions (Node 20 runtime) for the daily token-refresh loop
- LinkedIn Posts API v2026-04 (`POST /rest/posts` + Images API)
- Sharp for image rasterization (already a site dependency)
- `@azure/identity` + `@azure/keyvault-secrets` for KV access

## Local setup

```bash
npm install
az login                                    # KV access via your Azure session
npm run linkedin:auth --app=member             # one-shot OAuth, writes tokens to KV
npm run linkedin:publish --slug=<slug> --target=personal --dry-run
```

## Two LinkedIn apps

| App | Purpose | Status |
|---|---|---|
| **Spaarke Content Publisher** | Personal-account posting | Live — Sign In + Share approved |
| **Spaarke Company Page Publisher** | Company Page posting | Pending — Community Management API in review |

## How a publish runs

The operator invokes `/publish-linkedin <slug> [--target=company\|personal]`
in Claude Code. The skill drafts commentary in the right voice,
resolves the 1920×1080 LinkedIn image, gates on chat approval, and
invokes `npm run linkedin:publish` to do the actual API call. See
[spec.md §4](spec.md) for the full flow.

## Deployment

- **CLI scripts** (`scripts/linkedin-*.ts`): run from operator
  machines, no deployment.
- **Refresh function**: deploys to a new Functions app
  `spaarke-linkedin-refresh` via `func azure functionapp publish`.

## Operator notes

- LinkedIn access tokens last 60 days; refresh tokens last 365 days.
  The Azure Function refreshes daily and emails on failure. Manual
  re-auth is needed roughly once per year (per app).
- Never paste a LinkedIn client secret in chat. Use Key Vault.
- The system **never** edits `content/blog/<slug>.mdx`. Only the
  LinkedIn post draft file and `content-platform/calendar.md` are
  written by this system.
