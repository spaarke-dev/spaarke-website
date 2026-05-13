# Current task — LinkedIn Publishing

**Active task:** none (Phase 0 complete — ready for Phase 1 fan-out)

**Last completed:**
- 001 (2026-05-13) — deps + tsconfig.scripts.json
- 002 (2026-05-13) — scripts/linkedin-shared.ts (KV client, types, errors, pingKv)
- 003 (2026-05-13) — scripts/linkedin-refresh-token.ts (refreshIfNeeded, refreshNow, daysUntilExpiry)

**Milestone M1 reached:** KV reachable, shared module compiles, refresh logic in place.

**Up next — Phase 1 parallel fan-out (Group A):**
- 010 — scripts/linkedin-auth.ts (OAuth one-shot CLI)
- 011 — scripts/linkedin-publish.ts (publish CLI with --target=personal)
- 012 — .claude/skills/publish-linkedin/SKILL.md (orchestrator)

These three are independent and can run as parallel Claude Code agents per
the dispatch recipe in tasks/TASK-INDEX.md "Recipe 1".

After all three return: 013 (package.json scripts), 014 (E2E test).

**Notes:**
- KV smoke-test passes: `linkedin-member-client-id` reachable, length 14.
- `daysUntilExpiry` math verified on a 30-day-future token.
- LinkedIn Community Management API submitted 2026-05-13; expect approval 2–6 weeks.
- Real-refresh path (`refreshNow`) is not yet exercised — needs first OAuth run (task 010).
