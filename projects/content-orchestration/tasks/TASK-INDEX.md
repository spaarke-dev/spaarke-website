# Task Index — Content Orchestration

Registry of all tasks with status, dependencies, and parallel-execution
groupings. Update the status column as tasks complete.

---

## Phase summary

| Phase | Tasks | Total est. | Parallel agents possible? |
|---|---|---|---|
| 0 — Foundation | 001, 002 | ~1.75 hr | Sequential (002 depends on 001) |
| 1 — Function logic | 010, 011, 012, 013, 014 | ~3.25 hr | **Yes: 010 + 011 + 012 + 013 in parallel after 002, then 014 sequential** |
| 2 — Azure deploy | 020, 021, 022, 023 | ~50 min | 020 can run anytime; 021 → 022 → 023 sequential |
| Wrap-up | 090 | ~30 min | Sequential |

**Total estimated:** ~6.5 hours of focused work. With Group A parallel
fan-out, wall-clock is roughly **4 hours**.

---

## Parallel execution groups

### Group A — Phase 1 four-way fan-out

After **002** is complete, dispatch in one Claude message:

| Task | Owner agent | Touches |
|---|---|---|
| 010 — GitHub integration | Agent A1 | `src/integrations/github.ts` |
| 011 — SendGrid integration | Agent A2 | `src/integrations/sendgrid.ts` |
| 012 — Link builders | Agent A3 | `src/integrations/links.ts` |
| 013 — Digest templating | Agent A4 | `src/notify/digest.ts` |

After all four return: **014** (timer-trigger orchestrator) — sequential, integrates all four.

### Single-task waves

- **020** (operator action: create PAT + KV secret) — can run anytime
  before 023. No agent needed; this is a manual operator task.
- **021–023** — sequential Azure provisioning + deploy. Best done by
  the operator in their own terminal (Azure session, deploy auth).

---

## Task registry

| ID | Title | Phase | Status | Dependencies | Tags |
|---|---|---|---|---|---|
| 001 | Scaffold content-reminder Function project | 0 | **complete** | — | azure, functions, scaffold |
| 002 | Implement calendar parser | 0 | **complete** | 001 | typescript, parser, content-platform |
| 010 | Implement GitHub integration (Octokit) | 1 | **complete** | 001 | typescript, github, octokit |
| 011 | Implement SendGrid integration | 1 | **complete** | 001 | typescript, sendgrid, email |
| 012 | Implement link builders | 1 | **complete** | 001 | typescript, urls |
| 013 | Implement digest templating | 1 | **complete** | 002, 012 | typescript, templating, email |
| 014 | Implement timer-trigger orchestrator | 1 | **complete** ✅ M1 | 010, 011, 012, 013 | azure, functions, orchestration, milestone |
| 020 | Create GitHub PAT + KV secret | 2 | 🟡 blocked-on-operator | — | github, security, kv, manual |
| 021 | Provision content-reminder Function App | 2 | **complete** | 014 | azure, functions, provisioning |
| 022 | Configure managed identity + KV RBAC | 2 | 🟡 identity-done, role-pending-on-operator | 021 | azure, identity, rbac |
| 023 | Deploy + verify | 2 | code-deployed; verification pending on 020+022 | 014, 020, 021, 022 | azure, deploy, milestone |
| 090 | Project wrap-up | wrap | not-started | all | verification, milestone |

---

## Dispatch recipe — Group A fan-out

After 001 + 002 are committed, in a single Claude message dispatch four agents:

```
Agent(description="GitHub Octokit integration",
      subagent_type="general-purpose",
      prompt=<contents of tasks/010-implement-github-integration.md, plus
              "Implement this task. Touch only files listed in
              'Expected Outputs'. The shared types from
              src/calendar/types.ts already exist from task 002 —
              import from there. Verify with npm run build before
              declaring done.">)

Agent(description="SendGrid integration",
      subagent_type="general-purpose",
      prompt=<contents of 011, same coda>)

Agent(description="Link builders",
      subagent_type="general-purpose",
      prompt=<contents of 012, same coda>)

Agent(description="Digest templating",
      subagent_type="general-purpose",
      prompt=<contents of 013, same coda>)
```

After all four return, integrate and proceed with **014**.

---

## Status updates

When a task completes:
1. Update its row in the registry above (`not-started` → `complete`).
2. Update `current-task.md`.
3. Tick the next task in the dependency chain.
4. If the task is a milestone (014, 023, 090): tick the corresponding milestone in `plan.md`.
