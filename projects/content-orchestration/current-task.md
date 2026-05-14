# Current task — Content Orchestration

**Active task:** none — Phase 2 complete, M2 reached.

**Project nearly done.** 11 of 12 tasks complete. Only 090 (wrap-up after
3+ clean scheduled runs) remaining.

**Completed (all but 090):**
- 001–014 Phases 0+1 (function logic) — M1
- 020 GitHub PAT in KV (operator)
- 021 Function App `spaarke-content-reminder` provisioned
- 022 Managed identity + Key Vault Secrets User role on `sprk-demo-kv`
- 023 Deployed + manual trigger verified — **🟢 M2 reached**

**M2 evidence (App Insights, 2026-05-14T18:56:17.886Z):**
```
[remind] Started at 2026-05-14T18:56:17.886Z.
[remind] 2 pieces in window (of 12 total).
[remind] Digest sent to <operator>: "[Spaarke content] 2 pieces due in the next week"
Executed 'Functions.remind' (Succeeded, Duration=1691ms)
```

**Up next:** Wait 3+ days for scheduled morning runs to validate the
daily cadence. Then run 090 (wrap-up) to mark project complete.

**Notes:**
- First scheduled run: tomorrow at 13:00 UTC.
- Function reads KV at runtime so any secret rotation (e.g., switching
  `notification-email-operator` from info@ to ralph.schroeder@) takes
  effect on the next run — no redeploy needed.
- The `az role assignment` Bash-session quirk is now reproducible across
  two projects (LinkedIn refresh, content reminder). Workaround:
  run from PowerShell. Worth folding into the LinkedIn runbook §1 quirk
  note as a more general "Azure CLI cross-shell" caveat.
