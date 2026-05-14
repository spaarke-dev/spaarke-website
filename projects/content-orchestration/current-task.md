# Current task — Content Orchestration

**Active task:** none — project initialized

**Up next:** 001 (scaffold the content-reminder Function project)

**Notes:**
- Project initialized 2026-05-13.
- Spec authored, 8 decisions locked.
- Pattern mirrors `azure/functions/linkedin-token-refresh/` (built earlier today).
- KV `sprk-demo-kv` already has three SendGrid secrets shared with
  the LinkedIn refresh; this project reuses them.
- One new KV secret required (operator action in task 020):
  `github-token-readonly` (fine-grained PAT, Contents:Read,
  scoped to `spaarke-dev/spaarke-website`).

Update this file when starting/finishing tasks so session-recovery
in future Claude sessions is one-glance fast.
