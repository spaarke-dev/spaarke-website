# Task 001: Add dependencies and scripts TypeScript config

**Phase:** 0 — Foundation
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** none
**Tags:** typescript, azure, keyvault, deps, config

## Goal

Add the runtime dependencies the LinkedIn integration needs, and a
dedicated `tsconfig.scripts.json` so the `scripts/linkedin-*.ts` tree
can run via `tsx` without polluting the Next.js compilation.

## Context

The site uses Next.js + Turbopack with its own `tsconfig.json`. The
LinkedIn CLIs are pure Node — different module target, different
runtime — so they need a sibling tsconfig. The Azure SDK packages
also need to be in `dependencies` (not `devDependencies`) so the
eventual Function deployment picks them up.

## Steps

1. Add to `package.json` `dependencies`:
   - `@azure/identity` (Default credential chain — works with `az login` locally and managed identity in Azure)
   - `@azure/keyvault-secrets` (KV client)
   - `open` (cross-platform browser opener for the OAuth flow)
2. Add to `devDependencies` (if not present): `tsx` (already used elsewhere — verify).
3. Create `tsconfig.scripts.json` at repo root:
   - `target`: ES2022
   - `module`: ESNext
   - `moduleResolution`: bundler
   - `strict`: true
   - `esModuleInterop`: true
   - `skipLibCheck`: true
   - `noEmit`: true
   - `include`: `["scripts/**/*.ts"]`
4. Add a `.gitignore` entry for `scripts/.linkedin-cache/` (used later for token-state-during-OAuth).
5. Run `npm install` and verify no warnings.

## Expected Outputs

- `package.json` — dependencies + devDependencies updated
- `package-lock.json` — refreshed
- `tsconfig.scripts.json` — new file at repo root
- `.gitignore` — one new line

## Acceptance Criteria

- [ ] `npm install` runs clean.
- [ ] `npx tsc -p tsconfig.scripts.json --noEmit` exits 0 (no scripts yet, so trivially passes).
- [ ] `npx tsx --version` shows a working tsx runner.
- [ ] `git status` shows only the four files above modified.

## Notes

- Don't import these packages in any Next.js code — they're Node-only.
- Sharp is already in the site deps; we reuse it for image rasterization.
- We deliberately avoid `dotenv` — credentials never live in `.env`.
