# Current task: Article Insights Assistant

> Context recovery tracker. A session picking this up cold reads this file
> first, then `tasks/TASK-INDEX.md`.

**Active task:** none. Project initialized 2026-09-25, no task started.

**Next task:** `001-create-foundry-project.md`

## Where things stand

Design, spec, plan and tasks are written. The privacy policy has been
updated for 90-day conversation capture and is live-ready. No
implementation code exists yet.

The owner was creating the website-specific Foundry project by hand on
2026-09-25. Task 001 records its details rather than creating it, so check
with the owner before assuming it does not exist.

## Blocked on

- **Foundry deployment details.** Resource name, deployment name, and the
  choice between Entra ID and API key. Task 001 cannot complete without
  them, and every later task depends on task 001.

## Decisions already made, do not relitigate

- No retrieval layer. Whole corpus in cached context. See KD-01.
- Claude in Microsoft Foundry, website-specific project, not the product's.
- Open to everyone, rate limited. No email gate.
- Mobile is a bottom sheet behind a floating button.
- 500 USD per month inference ceiling.
- All 21 articles in release one.
- 90-day retention for question text, aggregate counts after.
- A disclaimer rather than a legal-advice refusal path.

## Open questions the owner still holds

- Which Claude model the Foundry catalogue offers at the chosen tier. The
  spec assumes `claude-sonnet-5`; the Microsoft examples use
  `claude-sonnet-4-6`. Either has enough context for the corpus, but the
  deployment name has to match what exists.
- Whether Zero Data Retention is enabled on the subscription, which would
  make Anthropic's Covered Models reject requests.

## Session log

**2026-09-25.** Project initialized from `design.md` through
`/design-to-spec` and `/project-pipeline`. Two findings came from reading
code rather than assuming: the Spaarke BFF's AI layer authorizes per user
per document and cannot serve a public endpoint, and this repo's rate
limiter keeps counters in a module-level `Map` and is not a spend guard.
Both are written into the spec.
