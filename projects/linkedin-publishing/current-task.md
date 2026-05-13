# Current task — LinkedIn Publishing

**Active task:** 014 — End-to-end test against personal LinkedIn account

**🟡 BLOCKED ON OPERATOR ACTION** — this is the manual milestone.

**Last completed:**
- 001 (2026-05-13) — deps + tsconfig.scripts.json
- 002 (2026-05-13) — scripts/linkedin-shared.ts (164 lines)
- 003 (2026-05-13) — scripts/linkedin-refresh-token.ts (129 lines)
- 010 (2026-05-13) — scripts/linkedin-auth.ts (504 lines) — Agent A1 parallel
- 011 (2026-05-13) — scripts/linkedin-publish.ts (746 lines) — Agent A2 parallel
- 012 (2026-05-13) — .claude/skills/publish-linkedin/SKILL.md (606 lines) — Agent A3 parallel
- 013 (2026-05-13) — package.json scripts + scripts/linkedin-test-kv.ts helper

**To start Task 014 (E2E test against personal account), the operator must:**

1. Run from a terminal at the repo root:
   ```bash
   npm run linkedin:auth -- --app=member
   ```
   This opens a browser, signs in via LinkedIn, and writes the four
   `linkedin-member-*` token secrets to KV.

2. Verify token is stored:
   ```bash
   npm run linkedin:test-kv
   ```

3. From Claude Code, invoke the skill against a real article (recommend `the-iq-stack`):
   ```
   /publish-linkedin the-iq-stack --target=personal
   ```
   Walk through the 7 gates; at the approval gate, type `approve`.

4. Verify the post on LinkedIn (image renders, link card resolves to spaarke.com).

5. Once verified, write `notes/e2e-personal-2026-05-13.md` with any observations.

**After Task 014 passes, the parallel paths split:**
- Phase 2 (refresh function) — tasks 020–024, independent
- Phase 4 (polish + docs) — tasks 040–043, parallelizable
- Phase 3 (company posting) — still blocked on Community Management API approval

**Notes:**
- Group A parallel fan-out cut wall-clock from ~7 hr sequential to ~3 min agent dispatch.
- Combined `npx tsc -p tsconfig.scripts.json --noEmit` is clean.
- LinkedIn CM API submitted 2026-05-13; approval typically 2–6 weeks.
