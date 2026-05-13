# Task 090: Project wrap-up

**Phase:** Wrap-up
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** all preceding tasks (001 through 043)
**Tags:** verification, lessons-learned, milestone

## Goal

Verify every spec acceptance criterion is met. Mark the plan
complete. Capture lessons learned. **Milestone M5.**

## Context

The final pass. After this, the project is done — the system runs
on autopilot via the refresh function, and operator-driven
publishes happen ad hoc from Claude Code.

## Steps

1. Walk the spec section by section, confirm each acceptance bullet
   is met:
   - §2 Goals — every goal achieved.
   - §3 Architecture — every component built.
   - §4 Skill — gated workflow runs end-to-end on both targets.
   - §5 OAuth + refresh — function deployed and verified.
   - §6 Publish script — both targets work.
   - §7 Voices — both voice paths in the skill.
   - §8 Image — both default-path and rasterize-fallback verified.
   - §9 Failure modes — confirmed via the forced-failure tests in
     tasks 014 and 024.
2. Run `npm run linkedin:status` — confirm both apps green.
3. Run `npm run linkedin:test-kv` — confirm KV reachable.
4. Trigger the refresh function manually — confirm it runs clean.
5. Update `projects/linkedin-publishing/README.md` status to
   "🟢 Complete".
6. Tick all milestones in `plan.md`.
7. Update `current-task.md` to "none — project complete".
8. Write `projects/linkedin-publishing/notes/lessons-learned.md`:
   - What took longer than expected.
   - What was simpler than expected.
   - Decisions that should be revisited in a follow-up project
     (e.g., personal voice doc; multi-image support).
   - Concrete things the next operator should know.
9. Open a PR with the title `feat(linkedin-publishing): ship phase 1
   personal + phase 2 refresh function + phase 4 polish`. Body:
   summary + links to spec, plan, runbook.
10. Squash-merge once approved.

## Expected Outputs

- `README.md` status flipped to Complete.
- `plan.md` all milestones ticked.
- `current-task.md` cleared.
- `notes/lessons-learned.md` — 1–2 pages.
- PR open + merged.

## Acceptance Criteria

- [ ] All spec §2 goals verified.
- [ ] All phase milestones ticked.
- [ ] No partial state on disk anywhere.
- [ ] `npm run linkedin:status` exits 0.
- [ ] Refresh function has had at least 3 successful daily runs visible in App Insights.
- [ ] Operator-runbook smoke-tested by reading it end-to-end fresh.

## Notes

- If LinkedIn Community Management API still isn't approved at
  wrap-up time, ship the project at Phase 0 + 1 + 2 + 4 (no Phase 3)
  and mark Phase 3 as "deferred — gated on external approval".
  Open a follow-up issue/spec for phase 3 completion.
- This task wraps the project but doesn't end LinkedIn
  publishing — that becomes BAU. Posts continue ad hoc; the
  refresh function keeps tokens alive.
