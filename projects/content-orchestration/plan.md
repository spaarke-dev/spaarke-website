# Content Orchestration — Implementation Plan

Single-phase project (Phase 1 only — Phases 2–4 deferred to future
specs per [spec.md §8](spec.md)). Two sub-phases of work: build the
function locally, then provision + deploy Azure resources.

---

## Phase 0 — Foundation (~1.5 hours)

Establish the Function project scaffold and the calendar-parser
module that everything else depends on.

**Tasks:** 001 (scaffold), 002 (calendar parser + types)

**Deliverables:**
- `azure/functions/content-reminder/` — Functions project scaffolded
  via `func init` + `func new` (Node 24, TypeScript, timer trigger)
- `src/calendar/types.ts` — `CalendarRow` type
- `src/calendar/parse-calendar.ts` — regex-based markdown table
  parser with the window filter

**Acceptance:** `npm run build` clean. Parser correctly extracts the
current month + next-7-day window from the live `calendar.md`.

---

## Phase 1 — Function logic (~3 hours, with parallel agent execution ~1.5 hours)

The four integration/template modules + the orchestrator handler.

**Tasks:** 010 (GitHub Octokit), 011 (SendGrid wrapper), 012 (link
builders), 013 (digest templating), 014 (timer trigger handler)

**Parallel groups:**
- After Phase 0 lands: **010 + 011 + 012 + 013** are all independent
  surfaces touching disjoint files. Four-way parallel via Claude Code
  agents.
- 014 (orchestrator) sequential after the four above land.

**Deliverables:**
- `src/integrations/github.ts` — `fetchCalendar(token, repo): string`
- `src/integrations/sendgrid.ts` — `sendDigest({to, from, subject, text, html, apiKey}): Promise<void>`
  (designed for shareability with LinkedIn refresh function — see notes)
- `src/integrations/links.ts` — `buildWorkspaceUrl(slug)`,
  `buildIssueSearchUrl(slug)`, `buildContinueInClaudeUrl(slug)`
- `src/notify/digest.ts` — `renderDigest(rows): {subject, text, html}`
- `src/functions/remind.ts` — timer-triggered handler that
  orchestrates github → parse → digest → send

**Milestone:** Local `func start` + manual trigger sends a real
digest email to the operator using live calendar data.

---

## Phase 2 — Azure provisioning + deploy (~1 hour)

Create the Azure resources and deploy.

**Tasks:** 020 (operator: GH PAT + KV secret), 021 (Function App),
022 (managed identity + KV RBAC), 023 (deploy + verify)

**Sequential** — 020 is the only operator action (cannot be
automated), 021 must run before 022, 022 before 023.

**Deliverables:**
- KV secret `github-token-readonly` populated (operator-supplied)
- Function App `spaarke-content-reminder` in `rg-spaarke-demo`
  (Consumption, Node 24, Windows kind)
- Managed identity has **Key Vault Secrets User** (read-only) on
  `sprk-demo-kv`
- Deployed Function with the `remind` timer trigger live
- Application Insights traces visible

**Milestone:** First scheduled run (next morning at 13:00 UTC)
delivers a real digest email — or correctly skip-day's if no pieces
match the window.

---

## Wrap-up

**Task:** 090 — verify acceptance criteria, write lessons-learned,
mark plan complete.

---

## Dependency map

```
001 ──> 002 ──┬─> 010 ─┐
              ├─> 011 ─┤
              ├─> 012 ─┤
              ├─> 013 ─┤
              └─> 014 ─┘ (sequential after 010+011+012+013)
                  │
                  v
              020  (operator action — can start anytime, blocks 023)
                  │
              021 ──> 022 ──> 023
                                 │
                                 v
                              090 (wrap-up)
```

---

## Risks

- **PAT scope footgun.** A classic GH PAT instead of fine-grained
  would grant the function read access to every repo the operator
  belongs to. *Mitigation:* the operator task (020) walks through
  fine-grained PAT creation explicitly.
- **Calendar drift.** If `calendar.md` schema changes
  (column added/removed/reordered), the parser breaks. *Mitigation:*
  parser maps by header-name lookup, not column-index — schema
  reorderings stay non-breaking. New columns are ignored.
- **Email noise.** If the operator has nothing due for 6 days but
  one piece due in 7, they get an email every morning for a week.
  *Mitigation:* skip-day rule keeps empty-window days silent; the
  emails on populated days are the desired behavior. Revisit if
  excessive in practice.
- **SendGrid sender verification.** The `notification-email-from`
  address must be SendGrid-verified or the send fails silently.
  *Mitigation:* operator runbook references this. Function logs the
  exact SendGrid error if it happens.

---

## Milestones

| Milestone | Phase | Trigger |
|---|---|---|
| **M1** — Parser and integration modules pass local tests | 1 | Task 014 done (local end-to-end works) |
| **M2** — Function deployed, first scheduled run delivers real email | 2 | Task 023 verified |
| **M3** — Project complete | Wrap-up | Task 090 done |
