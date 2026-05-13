# Task 042: Write operator runbook

**Phase:** 4 — Polish & docs
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 014 (system must be working end-to-end)
**Tags:** docs, runbook, operations
**Parallel group:** **C** — runs alongside 040, 041, 043

## Goal

`docs/linkedin-publishing.md` — the operator's "how do I…" guide.
Self-contained enough that a new operator could pick up the system
from scratch.

## Context

The spec is for architects; the README is for engineers. This doc
is for the operator who actually runs publishes, encounters
failures, and might leave the project. Should answer real questions
without reading the spec.

## Steps

1. Create `docs/linkedin-publishing.md`.
2. Sections (each one a real "how do I" answer):
   - **First-time setup** — how to add an operator (KV roles, az login, run auth)
   - **Publishing an article** — the happy-path workflow in 4–5 lines
   - **Checking system health** — `pnpm linkedin:status`
   - **Re-authorizing when a token expires** — exact command
   - **What to do when a publish fails** — table of error → action
   - **Adding a new LinkedIn app** (e.g., a future second company page) — abstract steps
   - **Decommissioning an operator** — `pnpm linkedin:revoke` flow
   - **How the system stays alive without intervention** — describes the refresh function in plain language
3. Include 2–3 actual screenshots/transcripts from a publish run (operator chat with Claude, the email from the refresh function on a successful Monday summary).
4. Add a "FAQ" section with answers to:
   - "Can I post a long-form Pulse article?" → no, do that manually
   - "Why does the LinkedIn post have a different image than my Twitter/X share?" → different aspect ratios, see open question #11 (TBD if relevant)
   - "What happens if I accidentally publish to the wrong target?" → delete from LinkedIn UI; the system can't auto-revert
5. Link from `docs/README.md` (if present) or `projects/linkedin-publishing/README.md`.

## Expected Outputs

- `docs/linkedin-publishing.md` — ~300 lines
- Maybe `docs/images/linkedin-skill-preview.png` — a screenshot of the approval gate in Claude

## Acceptance Criteria

- [ ] A new operator could follow the doc end-to-end without asking questions.
- [ ] Every CLI command shown is a real command that works as written.
- [ ] Error messages from the publish CLI are quoted verbatim where referenced (so search-on-error-message works).
- [ ] Doc references spec.md for architecture details but doesn't repeat them.

## Notes

- Keep the runbook task-oriented. No background, no rationale. Background lives in the spec.
- One-page principle: a printed version should fit on ~4 pages of US Letter. Beyond that, split.
