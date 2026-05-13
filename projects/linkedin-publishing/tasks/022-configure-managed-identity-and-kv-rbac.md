# Task 022: Managed identity + KV RBAC for the refresh function

**Phase:** 2 — Azure Function refresh loop
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 020
**Tags:** azure, identity, rbac, keyvault, security
**Parallel group:** **B** — runs alongside 021 and 023 after 020

## Goal

The Function reads/writes its own LinkedIn secrets in KV using a
system-assigned managed identity. No secrets in app settings, no
service principals to rotate.

## Context

`DefaultAzureCredential` in the shared module already falls back to
managed identity in Azure. We just need to enable the identity on
the Function and grant it the right KV role.

## Steps

1. Enable system-assigned identity on the Function:
   ```bash
   az functionapp identity assign \
     --name spaarke-linkedin-refresh \
     --resource-group rg-spaarke-demo
   ```
2. Capture the `principalId` from the output.
3. Grant **Key Vault Secrets Officer** role scoped to the `linkedin-*` secrets only — actually, Azure KV RBAC scopes at the vault level, not the secret level, so grant the role on the vault and rely on naming convention:
   ```bash
   KV_ID=$(az keyvault show -n sprk-demo-kv -g rg-spaarke-demo --query id -o tsv)
   az role assignment create \
     --role "Key Vault Secrets Officer" \
     --assignee <principalId from step 2> \
     --scope $KV_ID
   ```
4. Verify the assignment:
   ```bash
   az role assignment list --assignee <principalId> --scope $KV_ID -o table
   ```
5. **Add a vault-level audit alert** (Azure portal → sprk-demo-kv → Diagnostic settings) so any reads of `linkedin-*` secrets are logged. Optional but cheap.

## Expected Outputs

- Function app has a `SystemAssigned` identity.
- Identity has `Key Vault Secrets Officer` role on `sprk-demo-kv`.
- No new code files.

## Acceptance Criteria

- [ ] `az functionapp identity show -n spaarke-linkedin-refresh -g rg-spaarke-demo` returns a `principalId`.
- [ ] After deploy (task 024), the Function can read `linkedin-member-access-token` from KV without any secret-or-credential config in app settings.
- [ ] An unauthorized identity (e.g., a different Functions app) still gets 403.

## Notes

- "Secrets Officer" gives Get + List + Set + Delete on secrets. We need Set for the refresh-write-back path.
- If you want to scope tighter, "Secrets User" (read-only) on a separate identity, plus a more privileged process for writes, is overkill for this use case.
- Don't add the secret values to function app settings. The whole point is they live in KV.
