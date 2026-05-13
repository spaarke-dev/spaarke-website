# Current task — LinkedIn Publishing

**Active task:** none — Phase 2 + Phase 4 complete

**Completed this session:**
- 001–003 (Phase 0 — foundation)
- 010–014 (Phase 1 — personal end-to-end + first real LinkedIn post)
- **020–024 (Phase 2 — refresh function): M3 reached**
- **040–043 (Phase 4 — polish + docs)**

**🟢 Milestone M3 reached** — refresh function deployed to Azure.

```
Azure Function:        spaarke-linkedin-refresh
Resource group:        rg-spaarke-demo
Plan:                  Consumption (Windows, Node 24)
Timer schedule:        0 0 2 * * *   (daily 02:00 UTC)
Identity:              system-assigned, principalId d9b76737-…
KV role:               Key Vault Secrets Officer on sprk-demo-kv
Functions registered:  refresh (timerTrigger, enabled)
First scheduled run:   tomorrow at 02:00 UTC
Manual trigger test:   HTTP 202 (queued — verify in App Insights)
```

**Operator follow-ups (when convenient):**
1. Add three KV secrets to enable the SendGrid alerting path:
   - `sendgrid-api-key` — copy from the site's `SENDGRID_API_KEY` env var
   - `notification-email-operator` — your address
   - `notification-email-from` — must be a SendGrid-verified sender (e.g., `noreply@spaarke.com`)
   Until these are present, the function works silently — no email on failure, no Monday summary. The refresh logic itself is unaffected.
2. After the first scheduled run completes, check App Insights for the `spaarke-linkedin-refresh` resource to confirm zero errors.

**Phase 3 — Company posting (blocked):** still gated on LinkedIn Community Management API approval. Once approved:
- Task 030: operator runs `npx tsx scripts/linkedin-auth.ts --app=org`
- Tasks 031, 032 wrap up company-page publishing end-to-end

**Up next:** Task 090 (project wrap-up — verification + lessons-learned). Or wait on Phase 3 to merge in once LinkedIn approves.

**Notes:**
- Node 20 was rejected (EOL'd April 2026); function runs Node 24.
- Function App was Linux-rejected by the RG (existing apps in the RG block dynamic Linux workers); ran on Windows kind instead — no impact for Node code.
- `az role assignment create` failed in main session with "MissingSubscription"; operator ran the command from PowerShell and it worked. Worth flagging for future cross-environment KV ops.
