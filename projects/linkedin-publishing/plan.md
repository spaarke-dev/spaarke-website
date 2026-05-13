# LinkedIn Publishing — Implementation Plan

Phases mirror [spec.md §12](spec.md). Phases 0–2 ship in parallel
while LinkedIn's Community Management API approval is in-flight;
Phase 3 gates on that external approval.

---

## Phase 0 — Foundation (~half day)

Establish the shared infrastructure that every other component
depends on: TypeScript script toolchain, KV access, common types,
refresh-token logic that's reused by the CLI and the Azure Function.

**Tasks:** 001 (deps), 002 (shared.ts), 003 (refresh-token.ts)

**Deliverables:**
- `scripts/linkedin-shared.ts` — KV client, token types, URN helpers
- `scripts/linkedin-refresh-token.ts` — reusable refresh logic
- Deps + `tsconfig.scripts.json` in place

**Acceptance:** From a fresh checkout, `npm install && npm run
linkedin:test-kv` reads both `linkedin-member-client-*` secrets from
KV successfully.

---

## Phase 1 — Personal-account end-to-end (~1 day)

Build the operator-facing flow. After this phase the operator can
publish to their personal LinkedIn account from Claude Code chat.

**Tasks:** 010 (auth.ts), 011 (publish.ts), 012 (SKILL.md), 013
(package.json scripts), 014 (E2E test)

**Parallel groups:**
- After Phase 0 lands: **010 + 011 + 012** can run in parallel by
  three Claude Code agents (auth, publish, and skill are independent
  surfaces, all spec-driven).
- 013 and 014 run sequentially after the three above land.

**Deliverables:**
- `scripts/linkedin-auth.ts` (`npm run linkedin:auth --app=member`)
- `scripts/linkedin-publish.ts` with `--target=personal`
- `.claude/skills/publish-linkedin/SKILL.md`
- `npm run linkedin:*` scripts wired in `package.json`

**Milestone:** First real personal LinkedIn post created via the
skill, with the link card and 1920×1080 image rendering correctly
in the LinkedIn feed.

---

## Phase 2 — Azure Function refresh loop (~half day)

Make tokens self-maintain. Independent of Phase 1 — no dependency on
the publish/skill code path, only on the refresh logic from
Phase 0.

**Tasks:** 020 (Function scaffold), 021 (Function impl), 022
(managed identity + KV RBAC), 023 (SendGrid alerting), 024 (deploy)

**Parallel groups:**
- After Phase 0 (specifically 003): **020** runs first (scaffold),
  then **021 + 022 + 023** in parallel (impl, identity, alerting are
  separate concerns).
- 024 (deploy) runs last.

**Deliverables:**
- `azure/functions/linkedin-token-refresh/` (timer trigger, daily 02:00 UTC)
- Managed identity with KV `Get/Set` permission on `linkedin-*` secrets
- SendGrid email on refresh failure or 7-day pre-expiry alert
- Deployed Function in `spaarke-linkedin-refresh` (new Functions app)

**Milestone:** Function runs nightly; on a forced-expiry test, it
refreshes the token within 24 h and requires no operator action.

---

## Phase 3 — Company-page publishing (gated, ~half day)

Unblocks when LinkedIn approves Community Management API for the
second app. Until then this phase is paused.

**Tasks:** 030 (auth --app=org), 031 (extend publish.ts), 032 (skill
+ E2E)

**Sequential** — all three depend on the previous.

**Deliverables:**
- Second OAuth populated in KV (`linkedin-org-*` secrets).
- `scripts/linkedin-publish.ts` supports `--target=company` (URN
  selection only — code path is identical to personal).
- Skill drafts in company voice; first company-page post live.

**Milestone:** First Spaarke Company Page post created via the
skill, end-to-end.

---

## Phase 4 — Polish & docs (~half day)

Quality-of-life and operational hardening.

**Tasks:** 040 (status), 041 (revoke), 042 (docs), 043 (calendar
format)

**Parallel groups:**
- **040 + 041 + 042 + 043** all independent, four-way parallel by
  four agents.

**Deliverables:**
- `npm run linkedin:status` — token health check (both apps).
- `npm run linkedin:revoke` — clean disposal for operator handoff.
- `docs/linkedin-publishing.md` — operator runbook.
- New "linkedin-posted" column in `content-platform/calendar.md`.

---

## Wrap-up

**Task:** 090 — verify all acceptance criteria, mark plan complete,
write lessons-learned notes.

---

## Dependency map

```
001 ──┬─> 002 ──┬─> 010 ─┐
      │        ├─> 011 ─┤
      │        ├─> 012 ─┤
      │        └─> 020 ─┐ ──> 021 ─┐
      │                 │ ──> 022 ─┤── > 024
      │                 │ ──> 023 ─┘
      │
      └─> 003 ──> (used by 011, 020)

010 + 011 + 012 ────> 013 ────> 014 (E2E)
014 ────> 042 (docs)

External: LinkedIn CM API approval ──> 030 ──> 031 ──> 032

090 (wrap-up) depends on all above complete.
```

---

## Risks

- **LinkedIn API approval timing.** Phase 3 can't start until
  Community Management API is approved. *Mitigation:* Phase 1–2 are
  self-contained and useful with personal posting alone.
- **Refresh-token revoked externally.** A refresh token can be
  invalidated outside our system (LinkedIn password reset, account
  re-auth elsewhere). *Mitigation:* refresh function emits a clear
  notification with remediation steps.
- **Image aspect mismatch.** LinkedIn link-card thumbnails prefer
  1.91:1; we ship 16:9. Acceptable but worth verifying in real
  posts. *Mitigation:* swapping to 1200×628 is a one-line Sharp
  resize change in `linkedin-publish.ts`.
- **Personal voice quality.** No `personal-voice-ralph.md` yet.
  Phase 1 ships with a placeholder profile; learn from 3–4 real
  posts and codify the voice in a Phase 4 follow-up.

---

## Milestones

| Milestone | Phase | Trigger |
|---|---|---|
| **M1** — KV reachable, shared module compiles | 0 | Task 003 done |
| **M2** — First personal post live | 1 | Task 014 done |
| **M3** — Refresh function deployed and verified | 2 | Task 024 done |
| **M4** — Company-page approved & first post | 3 | Task 032 done |
| **M5** — Project complete | Wrap-up | Task 090 done |
