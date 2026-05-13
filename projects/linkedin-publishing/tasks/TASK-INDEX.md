# Task Index — LinkedIn Publishing

Registry of all tasks with status, dependencies, and parallel-execution
groupings. Update the status column as tasks complete.

---

## Phase summary

| Phase | Tasks | Total est. | Parallel agents possible? |
|---|---|---|---|
| 0 — Foundation | 001, 002, 003 | ~4.5 hr | Sequential (each depends on prior) |
| 1 — Personal end-to-end | 010, 011, 012, 013, 014 | ~9 hr | **Yes: 010 + 011 + 012 in parallel after 003** |
| 2 — Refresh function | 020, 021, 022, 023, 024 | ~4.5 hr | **Yes: 021 + 022 + 023 in parallel after 020** |
| 3 — Company page (gated) | 030, 031, 032 | ~2.5 hr | Sequential; gated on external approval |
| 4 — Polish & docs | 040, 041, 042, 043 | ~3.25 hr | **Yes: 040 + 041 + 042 + 043 all in parallel** |
| Wrap-up | 090 | ~1 hr | Sequential after all above |

**Total estimated:** ~24.75 hours of focused work. With parallel agent
execution where marked, wall-clock time is roughly **half** that.

---

## Parallel execution groups

These groups are designed for dispatch via Claude Code's `Agent` tool
running multiple independent task-execute agents in parallel. Each
group's tasks have no inter-dependencies and touch disjoint files.

### Group A — Phase 1 mid-phase fan-out

After **003** is complete, dispatch in one message:

| Task | Owner agent | Touches |
|---|---|---|
| 010 — auth CLI | Agent A1 | `scripts/linkedin-auth.ts` |
| 011 — publish CLI | Agent A2 | `scripts/linkedin-publish.ts` |
| 012 — orchestrator skill | Agent A3 | `.claude/skills/publish-linkedin/SKILL.md` |

After all three converge: **013** (package.json scripts) → **014** (E2E test).

### Group B — Phase 2 mid-phase fan-out

After **020** is complete, dispatch in one message:

| Task | Owner agent | Touches |
|---|---|---|
| 021 — function logic | Agent B1 | `azure/functions/linkedin-token-refresh/refresh/index.ts` |
| 022 — managed identity + RBAC | Agent B2 | Azure (no code files) |
| 023 — SendGrid alerting | Agent B3 | `azure/functions/linkedin-token-refresh/src/notify.ts` |

After all three converge: **024** (deploy).

### Group C — Phase 4 four-way fan-out

After **014** (Phase 1 E2E) is complete, dispatch in one message:

| Task | Owner agent | Touches |
|---|---|---|
| 040 — status script | Agent C1 | `scripts/linkedin-status.ts` |
| 041 — revoke script | Agent C2 | `scripts/linkedin-revoke.ts` |
| 042 — operator runbook | Agent C3 | `docs/linkedin-publishing.md` |
| 043 — calendar column | Agent C4 | `content-platform/calendar.md`, `scripts/linkedin-publish.ts` (small edit) |

**Note:** 043 touches `scripts/linkedin-publish.ts` for the calendar-write
logic. If 014 has just shipped, the file is freshly committed. To avoid
merge conflicts, agent C4 should rebase before pushing.

---

## Task registry

| ID | Title | Phase | Status | Dependencies | Tags |
|---|---|---|---|---|---|
| 001 | Add dependencies and scripts TypeScript config | 0 | **complete** | — | typescript, deps, config |
| 002 | Implement linkedin-shared.ts | 0 | **complete** | 001 | typescript, azure, keyvault, foundation |
| 003 | Implement refresh-token logic | 0 | **complete** | 002 | typescript, oauth, linkedin |
| 010 | Implement linkedin-auth.ts (OAuth CLI) | 1 | not-started | 002 | typescript, oauth, linkedin, cli |
| 011 | Implement linkedin-publish.ts | 1 | not-started | 002, 003 | typescript, linkedin, api, cli, sharp |
| 012 | Create publish-linkedin skill | 1 | not-started | 002 (shape) | claude-code, skill, orchestration |
| 013 | Wire package.json scripts | 1 | not-started | 002, 003, 010, 011 | package-json, scripts |
| 014 | E2E test personal account | 1 | not-started | 010, 011, 012, 013 | testing, e2e, milestone |
| 020 | Scaffold refresh Azure Function | 2 | not-started | 003 | azure, functions, timer, devops |
| 021 | Implement refresh function logic | 2 | not-started | 020 | azure, functions, linkedin, oauth |
| 022 | Configure managed identity + KV RBAC | 2 | not-started | 020 | azure, identity, rbac, keyvault |
| 023 | SendGrid alerting on refresh failures | 2 | not-started | 020 | sendgrid, alerting, email |
| 024 | Deploy refresh function | 2 | not-started | 021, 022, 023 | azure, deploy, milestone |
| 030 | Run OAuth for org app | 3 | **blocked** (CM API approval) | 010 | linkedin, oauth, manual |
| 031 | Extend publish CLI for --target=company | 3 | blocked | 011, 030 | linkedin, cli |
| 032 | Extend skill + E2E company post | 3 | blocked | 012, 031 | claude-code, skill, e2e, milestone |
| 040 | Implement linkedin-status CLI | 4 | not-started | 002, 003 | cli, observability |
| 041 | Implement linkedin-revoke CLI | 4 | not-started | 002 | cli, security, lifecycle |
| 042 | Write operator runbook | 4 | not-started | 014 | docs, runbook |
| 043 | Extend calendar with LinkedIn columns | 4 | not-started | 011 | content-platform, calendar |
| 090 | Project wrap-up | wrap | not-started | all | verification, milestone |

---

## Dispatch recipes (for parallel-execution sessions)

Each block shows the exact "send to multiple agents in one Claude
message" pattern. Each agent has a self-contained prompt; they don't
share context with each other.

### Recipe 1 — Group A fan-out

```
After 001/002/003 are committed, in a single Claude message dispatch:

  Agent(description="Implement LinkedIn auth CLI",
        subagent_type="general-purpose",
        prompt=<contents of tasks/010-implement-linkedin-auth-cli.md, plus
                "Implement this task. Touch only files listed in 'Expected
                Outputs'. The 'scripts/linkedin-shared.ts' module already
                exists from task 002 — import from it, don't redefine its
                exports. Run npx tsc -p tsconfig.scripts.json to
                verify before declaring done.">)

  Agent(description="Implement LinkedIn publish CLI",
        subagent_type="general-purpose",
        prompt=<contents of 011, plus same coda>)

  Agent(description="Author publish-linkedin skill",
        subagent_type="general-purpose",
        prompt=<contents of 012, plus "This skill shells out to
                'npm run linkedin:publish' — assume that CLI exists with
                the contract documented in spec §6.1. You don't need
                to run the actual publish.">)
```

After all three return, proceed sequentially with 013 then 014.

### Recipe 2 — Group B fan-out

```
After 020 is committed:

  Agent(description="Implement refresh function logic", ..., prompt=<021>)
  Agent(description="Configure managed identity + KV RBAC", ..., prompt=<022>)
  Agent(description="Wire SendGrid alerting", ..., prompt=<023>)
```

After all three: 024 (deploy).

### Recipe 3 — Group C fan-out

```
After 014 is committed:

  Agent(description="LinkedIn status CLI", ..., prompt=<040>)
  Agent(description="LinkedIn revoke CLI", ..., prompt=<041>)
  Agent(description="Operator runbook", ..., prompt=<042>)
  Agent(description="Calendar column extension", ..., prompt=<043>)
```

---

## Status updates

When a task completes:
1. Update its row in the registry above (`not-started` → `complete`).
2. Update `current-task.md`.
3. Tick the next task in the dependency chain.
4. If the task is a milestone (014, 024, 032, 090): tick the
   corresponding milestone in `plan.md`.
