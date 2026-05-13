# Task 030: Run OAuth for the org (company-page) app

**Phase:** 3 — Company-page publishing (gated)
**Status:** blocked — waits on LinkedIn Community Management API approval
**Estimated:** 30 minutes
**Dependencies:** 010 (auth CLI must support `--app=org`)
**Tags:** linkedin, oauth, manual

## Goal

Populate the `linkedin-org-*` set of secrets in KV. Operator-driven
one-shot.

## Context

When LinkedIn approves the **Community Management API** request on
the second app, the operator must:
1. Add the second app's Client ID and Client Secret to KV.
2. Run `npm run linkedin:auth --app=org` to do the OAuth flow.

This task is a checklist. No code changes.

## Steps

1. Confirm LinkedIn email approval received for **Spaarke Company Page Publisher** Community Management API.
2. From LinkedIn Developer Portal → Spaarke Company Page Publisher → Auth tab, copy:
   - Client ID
   - Client Secret (you'll need to generate / view it)
3. Add to KV (these are the only two operator-supplied values; rest are populated by the OAuth run):
   ```bash
   az keyvault secret set --vault-name sprk-demo-kv --name linkedin-org-client-id --value "<id>"
   az keyvault secret set --vault-name sprk-demo-kv --name linkedin-org-client-secret --value "<secret>"
   ```
   Do this in a terminal that doesn't log to chat. Verify with `az keyvault secret list ... | grep linkedin-org`.
4. Run the OAuth flow:
   ```bash
   npm run linkedin:auth --app=org
   ```
5. The browser opens, you sign in as a Spaarke Company Page administrator, approve the requested scopes.
6. If you administer multiple LinkedIn pages, the script will show a picker — choose Spaarke.
7. Script prints "Token stored. Access valid until <YYYY-MM-DD>." → done.
8. Verify the three KV secrets that should now exist:
   - `linkedin-org-access-token`
   - `linkedin-org-refresh-token`
   - `linkedin-org-token-expires-at`
   - `linkedin-org-author-urn` (should be `urn:li:organization:<id>`)

## Expected Outputs

- 6 KV secrets populated for the `org` app.
- No code changes.

## Acceptance Criteria

- [ ] `npm run linkedin:test-kv --app=org` (after task 040 extends it) returns OK.
- [ ] `linkedin-org-author-urn` starts with `urn:li:organization:`.
- [ ] No secret values logged to chat or terminal capture.

## Notes

- This task is **manual operator action**, not Claude Code automation.
- The CM API approval can take 2–6 weeks. Until approval lands, this task stays blocked.
- If LinkedIn denies the application, the operator can iterate on the application form. Document the denial reason in `notes/` if it happens.
