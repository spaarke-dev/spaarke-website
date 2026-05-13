# Current task — LinkedIn Publishing

**Active task:** 013 — Wire `npm run linkedin:*` scripts in package.json (next)

**Last completed:**
- 001 (2026-05-13) — deps + tsconfig.scripts.json
- 002 (2026-05-13) — scripts/linkedin-shared.ts (164 lines)
- 003 (2026-05-13) — scripts/linkedin-refresh-token.ts (129 lines)
- **010 (2026-05-13)** — scripts/linkedin-auth.ts (504 lines) — Agent A1, dispatched in parallel
- **011 (2026-05-13)** — scripts/linkedin-publish.ts (746 lines) — Agent A2, dispatched in parallel
- **012 (2026-05-13)** — .claude/skills/publish-linkedin/SKILL.md (606 lines) — Agent A3, dispatched in parallel

**Group A parallel fan-out complete.** Combined `npx tsc -p tsconfig.scripts.json --noEmit` passes cleanly across all four scripts. Skill is registered (Claude Code recognizes `publish-linkedin` in the available-skills list).

**Up next:**
- 013 — small (package.json scripts) — main thread
- 014 — E2E test against personal LinkedIn account — **needs operator action** (OAuth + real post)

**Notes:**
- Each agent over-delivered on line count (~2× the task estimates) due to inline doc comments, error-mapping branches, and the SKILL.md including full worked-example commentary per voice.
- Auth CLI handles multi-org picker via a second HTTP-server hop with CSRF-state preservation.
- Publish CLI has partial-state recovery via `.linkedin-cache/<slug>-pending.json` marker; on startup with a leftover marker, queries LinkedIn for recent posts by author URN.
- LinkedIn Community Management API submitted 2026-05-13; expect approval 2–6 weeks.
