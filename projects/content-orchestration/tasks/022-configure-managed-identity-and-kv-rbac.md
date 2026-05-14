# Task 022: Configure managed identity + KV RBAC

**Phase:** 2 — Azure provisioning + deploy
**Status:** not-started
**Estimated:** 10 minutes
**Dependencies:** 021
**Tags:** azure, identity, rbac, keyvault, security

## Goal

The Function App has a system-assigned managed identity with **Key
Vault Secrets User** (read-only) on `sprk-demo-kv`. This function
never writes secrets, so it gets a narrower role than the LinkedIn
refresh function (which has Secrets Officer).

## Context

Per [spec.md §3.4](../spec.md). Least-privilege: this function only
reads `sendgrid-api-key`, `notification-email-operator`,
`notification-email-from`, and `github-token-readonly`. Read-only
KV role is sufficient.

## Steps

1. Enable system-assigned identity:

   ```bash
   az functionapp identity assign \
     --name spaarke-content-reminder \
     --resource-group rg-spaarke-demo \
     --query principalId -o tsv
   ```

   Capture the `principalId` output (a GUID).

2. Grant **Key Vault Secrets User** role on the vault:

   ```bash
   az role assignment create \
     --role "Key Vault Secrets User" \
     --assignee-object-id <principalId from step 1> \
     --assignee-principal-type ServicePrincipal \
     --scope /subscriptions/2ff9ee48-6f1d-4664-865c-f11868dd1b50/resourceGroups/rg-spaarke-demo/providers/Microsoft.KeyVault/vaults/sprk-demo-kv
   ```

   **Shell quirk** (per the LinkedIn runbook §1): if this fails from your Bash session with a `(MissingSubscription)` error, run the same command from Windows PowerShell instead. The cause is a session-token edge case in the az CLI.

3. Verify:

   ```bash
   az role assignment list \
     --assignee <principalId> \
     --scope /subscriptions/.../providers/Microsoft.KeyVault/vaults/sprk-demo-kv \
     -o table
   ```

   Should show one row for `Key Vault Secrets User`.

## Expected Outputs

- Function App identity enabled, principalId captured
- One role assignment: `Key Vault Secrets User` on `sprk-demo-kv` to that principalId

## Acceptance Criteria

- [ ] `az functionapp identity show -n spaarke-content-reminder -g rg-spaarke-demo` returns a `principalId`.
- [ ] Role assignment visible in `az role assignment list`.
- [ ] After deploy (task 023), the function can read all four KV secrets it needs.
- [ ] Function cannot write to KV (try in App Insights — `setSecret` should fail with 403).

## Notes

- **Secrets User**, not **Secrets Officer** — this is the only difference from the LinkedIn refresh function's identity. Defense in depth: a compromised reminder function can't poison the LinkedIn token store.
- Role propagation typically takes 1–5 minutes after assignment. If the first deploy gets 403 on KV reads, wait and retry.
