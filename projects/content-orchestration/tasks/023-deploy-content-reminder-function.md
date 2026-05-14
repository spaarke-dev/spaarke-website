# Task 023: Deploy and verify the content-reminder Function

**Phase:** 2 — Azure provisioning + deploy
**Status:** not-started
**Estimated:** 20 minutes
**Dependencies:** 014, 020, 021, 022
**Tags:** azure, deploy, devops, milestone

## Goal

The function is live in Azure, runs daily, and the first manual
trigger produces a real digest email. **Milestone M2 reached.**

## Context

Final integration step. Validates that the local scaffold, managed
identity, and KV access all work end-to-end against real Azure.

## Steps

1. Build:

   ```bash
   cd azure/functions/content-reminder
   npm install
   npm run build
   ```

2. Deploy:

   ```bash
   func azure functionapp publish spaarke-content-reminder
   ```

   Expect ~1 min upload + sync. Output ends with the registered functions:
   ```
   Functions in spaarke-content-reminder:
     remind - [timerTrigger]
   ```

3. Manual trigger to verify end-to-end:

   ```bash
   MASTER_KEY=$(az functionapp keys list -n spaarke-content-reminder -g rg-spaarke-demo --query masterKey -o tsv)
   curl -X POST "https://spaarke-content-reminder.azurewebsites.net/admin/functions/remind" \
     -H "Content-Type: application/json" \
     -H "x-functions-key: $MASTER_KEY" \
     --data "{}" -w "\nHTTP %{http_code}\n"
   ```

   Expect `HTTP 202` (queued for async execution).

4. Check the operator's email inbox within 1–2 minutes:
   - If at least one piece is in the next-7-day window: a digest email should arrive.
   - If zero in-window pieces: no email (skip-day rule); check App Insights for the `[remind] No pieces due — skip-day rule applies.` log entry.

5. **Force a real digest** by temporarily lowering the window filter or by editing the calendar to put one piece in the window — verify email content renders correctly (HTML + plain-text, all three links work, "Continue in Claude" URL opens a session with the right prompt).

6. **Wait for the first scheduled run** (next morning at 13:00 UTC) and confirm it delivered without manual intervention. Document outcome in `notes/m2-deploy-<date>.md`.

## Expected Outputs

- Live `spaarke-content-reminder` Function App with the `remind` timer trigger registered
- App Insights traces for the manual + first scheduled runs
- `projects/content-orchestration/notes/m2-deploy-<date>.md` (verification log)

## Acceptance Criteria

- [ ] `az functionapp function list -n spaarke-content-reminder -g rg-spaarke-demo` shows `remind` (not disabled).
- [ ] Manual trigger returns HTTP 202 and emits expected log line in App Insights.
- [ ] If in-window pieces exist: operator receives the digest email.
- [ ] If zero in-window: skip-day log line present, no email sent.
- [ ] First scheduled run (next morning) runs cleanly without operator intervention.
- [ ] No secret values appear in any log.

## Notes

- Cold start can add ~5 seconds to first manual invocation on Consumption plan — fine for a daily timer.
- KV-access 403 errors immediately after deploy = role propagation delay (task 022 note). Wait 5 min and retry.
- M2 acceptance also includes the "first scheduled run delivers" criterion which spans overnight — mark task complete after the scheduled morning run, not the manual trigger.
