# Current task — Content Orchestration

**Active task:** waiting on operator for 2 manual steps before
end-to-end verification.

**Completed this session (10 of 12):**
- 001–002 Phase 0 (function scaffold + calendar parser)
- 010–013 Phase 1 Group A parallel fan-out (github, sendgrid, links, digest)
- 014 Phase 1 orchestrator → **🟢 Milestone M1 reached** (local build clean)
- 021 Function App provisioned (`spaarke-content-reminder`, Consumption, Windows kind, Node 24, App Insights auto-attached)
- 022a Managed identity enabled (principalId `4dee0567-f571-4545-a83f-50a1e96a6c5a`)
- 023a Code deployed (`func azure functionapp publish` succeeded; `remind` timer registered)

**Waiting on operator:**
- 020 (GitHub PAT) — create fine-grained PAT `spaarke-content-reminder`,
  `Contents: Read` only on `spaarke-dev/spaarke-website`, then:
  ```powershell
  az keyvault secret set --vault-name sprk-demo-kv --name github-token-readonly --value "<paste PAT>"
  ```
- 022b (role assignment) — `az role assignment create` failed from main-session Bash
  with the "MissingSubscription" quirk we hit on the LinkedIn project. Run from PowerShell:
  ```powershell
  az role assignment create `
    --role "Key Vault Secrets User" `
    --assignee-object-id "4dee0567-f571-4545-a83f-50a1e96a6c5a" `
    --assignee-principal-type ServicePrincipal `
    --scope "/subscriptions/2ff9ee48-6f1d-4664-865c-f11868dd1b50/resourceGroups/rg-spaarke-demo/providers/Microsoft.KeyVault/vaults/sprk-demo-kv"
  ```

**After both operator steps complete:**
- Main session manually triggers the function via admin API to verify end-to-end.
- If first call succeeds: 023 acceptance complete; M2 reached on first scheduled morning run.

**Up next after M2:** task 090 wrap-up (after 3+ clean scheduled runs).

**Notes:**
- Parallel-agent Group A fan-out worked again — 4 files written + integrated, clean type-check.
- `@octokit/rest` v21 ESM-only created a friction point; agent 010 solved with dynamic import + `resolution-mode: "import"` attribute.
- The `az role assignment` shell quirk is now reproducible across two projects — worth documenting more permanently in the repo's runbook.
