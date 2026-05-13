# Task 024: Deploy the refresh Function

**Phase:** 2 — Azure Function refresh loop
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 021, 022, 023
**Tags:** azure, deploy, devops, milestone

## Goal

Function is live in Azure, runs daily, has KV access via managed
identity, and can email on failure. **Milestone M3** — phase 2
complete.

## Context

Final deploy step. Validates that the local scaffold, the managed
identity, and the SendGrid alerting all work together against real
Azure.

## Steps

1. Build:
   ```bash
   cd azure/functions/linkedin-token-refresh
   npm install
   npm run build
   ```
2. Deploy:
   ```bash
   func azure functionapp publish spaarke-linkedin-refresh
   ```
3. Verify deployment:
   ```bash
   az functionapp function list -n spaarke-linkedin-refresh -g rg-spaarke-demo -o table
   ```
   Should show the `refresh` function.
4. Manually trigger to verify it runs:
   ```bash
   az functionapp function show -n spaarke-linkedin-refresh -g rg-spaarke-demo --function-name refresh --query invokeUrlTemplate
   # Then POST to the admin trigger URL (uses the master key).
   ```
   Or use the portal: Function App → refresh → Test/Run.
5. Check App Insights for the run logs (the function's bundled Application Insights):
   - Confirm both apps were processed.
   - Confirm no warnings about KV access.
6. Force an expiry test:
   - In KV, set `linkedin-member-token-expires-at` to a date 3 days from now.
   - Invoke the function.
   - Verify the function refreshes the token and writes new values.
   - Reset `expires-at` to the new actual value.
7. Force a failure test:
   - In KV, set `linkedin-member-refresh-token` to garbage.
   - Invoke the function.
   - Verify the operator receives a SendGrid failure email.
   - Restore the original refresh token (via running `npm run linkedin:auth --app=member` again).

## Expected Outputs

- Live Function in Azure: `spaarke-linkedin-refresh`
- Timer trigger fires at 02:00 UTC daily
- App Insights traces from the test runs
- `projects/linkedin-publishing/notes/m3-deploy-<date>.md` — verification log

## Acceptance Criteria

- [ ] Function visible in Azure Portal under the new Functions App.
- [ ] First scheduled run (02:00 UTC) appears in App Insights the next morning, processing both apps cleanly.
- [ ] Forced-expiry test successfully refreshes tokens.
- [ ] Forced-failure test sends the operator email with the right remediation step.
- [ ] `current-task.md` marks phase 2 complete; `plan.md` M3 milestone checked.

## Notes

- Consumption plan cold-starts can add ~5 seconds to first invocation — fine for a daily timer.
- If the function fails to access KV with a 403, the managed-identity role assignment from task 022 didn't propagate yet — wait 5 min and retry.
- Reset any test-modified KV values before declaring done. Run `npm run linkedin:test-kv` and `npm run linkedin:status` (once task 040 exists) to verify clean state.
