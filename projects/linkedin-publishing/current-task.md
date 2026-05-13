# Current task — LinkedIn Publishing

**Active task:** 002 — Implement scripts/linkedin-shared.ts

**Last completed:** 001 — Add dependencies and scripts TypeScript config (2026-05-13)
- `@azure/identity` ^4.5.0, `@azure/keyvault-secrets` ^4.9.0, `open` ^10.1.0 added to dependencies
- `tsx` ^4.19.2 added to devDependencies (installed as 4.21.0)
- `tsconfig.scripts.json` created at repo root (target ES2022, module ESNext, strict)
- `.gitignore` updated with `/scripts/.linkedin-cache/`
- Bulk replaced `pnpm` → `npm`/`npx` across all project files (npm is the repo's actual package manager)

**Up next after 002:** 003 (refresh-token logic), then Phase 1 fan-out (010 + 011 + 012 in parallel).

**Notes:**
- LinkedIn Community Management API submitted 2026-05-13; expect approval 2–6 weeks.
- KV `sprk-demo-kv` has `linkedin-member-client-id` and `linkedin-member-client-secret` populated.
- 17 audit warnings in `npm install` output are pre-existing transitive deps, not from new packages.
