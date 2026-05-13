# Current task — LinkedIn Publishing

**Active task:** none — Phase 1 complete (M2 reached)

**Last completed:**
- 001 (2026-05-13) — deps + tsconfig.scripts.json
- 002 (2026-05-13) — scripts/linkedin-shared.ts
- 003 (2026-05-13) — scripts/linkedin-refresh-token.ts
- 010 (2026-05-13) — scripts/linkedin-auth.ts (parallel agent)
- 011 (2026-05-13) — scripts/linkedin-publish.ts (parallel agent)
- 012 (2026-05-13) — .claude/skills/publish-linkedin/SKILL.md (parallel agent)
- 013 (2026-05-13) — package.json scripts
- **014 (2026-05-13) — E2E personal post live: https://www.linkedin.com/feed/update/urn:li:share:7460418660302573568/**

**🟢 Milestone M2 reached** — first real LinkedIn post via the system, end-to-end through the 7-gate workflow.

**What worked end-to-end:**
- KV-backed OAuth (one-shot, port 3030)
- Token rotation logic exists (not yet exercised — first refresh is ~53 days away)
- Skill orchestrator drove all 7 gates: validate → image → commentary draft → preview → approve → publish → record
- Personal-voice placeholder profile produced a usable post on the first attempt
- Image rendered cleanly in LinkedIn feed; link card resolves to canonical URL on spaarke.com
- Calendar row + linkedin-posts/<slug>.md record both auto-updated
- No partial-state markers left behind

**Up next — parallel paths available:**
- **Phase 2** — refresh function (tasks 020–024). Independent. Can dispatch Group B fan-out (021 + 022 + 023) after 020.
- **Phase 4** — polish & docs (tasks 040–043). Four-way parallel via agents.
- **Phase 3** — company posting (tasks 030–032). Still blocked on LinkedIn Community Management API approval (submitted 2026-05-13; 2–6 week SLA).

**Notes:**
- Personal voice placeholder produced good copy first try. Could codify a `personal-voice-ralph.md` from this + future hand-written posts later.
- The `npm run` arg-stripping issue was fixed by switching the skill to invoke `npx tsx` directly. `npm run linkedin:auth -- --app=member` still works via the parser's bare-positional fallback.
- Port 3030 (not 3000) is the OAuth callback to avoid Next.js dev conflict.
