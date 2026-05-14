# Content Orchestration

Daily reminder digest email for the Spaarke content calendar. Azure
Function reads `content-platform/calendar.md` from GitHub, filters
for pieces due in the next 7 days, and emails the operator with deep
links to each piece's workspace, GitHub Issue search, and a "continue
in Claude" pre-populated session URL.

## Status

🟡 In Progress — Phase 1 spec authored; tasks pending execution.

## Quick links

- [spec.md](spec.md) — architecture spec (8 decisions locked)
- [plan.md](plan.md) — phase breakdown
- [tasks/TASK-INDEX.md](tasks/TASK-INDEX.md) — task registry
- [current-task.md](current-task.md) — active task pointer

## Tech stack

- Node.js + TypeScript on Azure Functions (Node 24, Consumption plan)
- Octokit for GitHub Contents API
- `@sendgrid/mail` for delivery (shared SendGrid secrets with LinkedIn refresh)
- `@azure/identity` + `@azure/keyvault-secrets` for KV access
- App Insights for runtime traces
- Pattern mirrors `azure/functions/linkedin-token-refresh/` exactly

## Local setup

```bash
cd azure/functions/content-reminder
npm install
npm run build
func start                # local timer test
```

For real KV access locally, ensure `az login` is active.

## Two KV secrets this project owns

| Secret | Owner | Purpose |
|---|---|---|
| `github-token-readonly` | content-reminder | Fine-grained PAT, `Contents: Read` on this repo only. Used to read `calendar.md`. |

Plus reads (shared with LinkedIn refresh): `sendgrid-api-key`,
`notification-email-operator`, `notification-email-from`.

## How a reminder runs

1. Daily timer fires at 13:00 UTC (≈09:00 ET DST / 08:00 ET standard).
2. Function fetches `content-platform/calendar.md` from GitHub.
3. Parses monthly tables, filters: `status in {brief, outline}` AND
   `publish_date in [today - 1, today + 7]`.
4. If zero matches: skip email (skip-day rule).
5. Else: builds multipart (HTML + plain) digest, sends via SendGrid
   to the address in `notification-email-operator`.

## Deployment

```bash
cd azure/functions/content-reminder
func azure functionapp publish spaarke-content-reminder
```

Same deployment pattern as the LinkedIn refresh function. The
Function App is `spaarke-content-reminder` in `rg-spaarke-demo`.

## Future phases (deferred)

Phase 2 (auto-branch creation on status=draft), Phase 3 (email-based
approval gates), and Phase 4 (Claude API routine for brand-aware
weekly commentary) are intentionally deferred. Ship Phase 1, use it
for 2–4 weeks, then decide what's worth automating next. See
[spec.md §8](spec.md) for the rationale.
