# Article Insights Assistant

**Status:** In Progress
**Created:** 2026-09-25

An AI console in the article rail that lets a reader interrogate the piece
and the library around it. The whole 21-article corpus sits in a cached
model context, so it reasons across articles with no retrieval layer, and
every claim is labeled with where it came from.

It is not a website chat bot. It answers about the articles and their
subject matter, and it does not sell.

## Why it exists

Spaarke publishes long-form because developing an idea completely is the
proof of expertise. Most readers will not read 6,000 words. The assistant
is a second way into the same material for the people who will not.

It is also a demonstration of Spaarke's own product thesis: AI grounded in
governed content, connected across sources, with the reasoning traceable to
where it came from. That is why visible citation is a requirement rather
than a nicety.

## Documents

| File | What it holds |
|---|---|
| [`design.md`](design.md) | Rationale, placement, architecture, risks |
| [`spec.md`](spec.md) | 12 FRs, 8 NFRs, 6 key decisions, 11 success criteria |
| [`plan.md`](plan.md) | Five phases with gates and milestones |
| [`tasks/TASK-INDEX.md`](tasks/TASK-INDEX.md) | Task registry and status |
| [`current-task.md`](current-task.md) | Active task, for context recovery |
| [`notes/`](notes/) | Implementation notes |

## Tech stack

- Next.js 16.1.6 (App Router, Turbopack), React 19, TypeScript
- Tailwind v4
- Claude in Microsoft Foundry, website-specific project
- Azure Static Web Apps, managed functions
- Azure Table Storage for conversation capture and the rate counter
- Application Insights for telemetry

## The decisions worth knowing before you touch this

**No retrieval layer.** 21 articles is roughly 100,000 tokens, which fits a
cached context window whole. This removes retrieval miss as a failure
class. If you find yourself adding a vector store, re-read KD-01 in the
spec first. Revisit at 80 to 100 articles.

**The Spaarke BFF cannot be reused.** Its `Services/Ai` layer authorizes
per user against per-document access, which does not transfer to an
endpoint with no user and no documents. But read
`Services/Ai/CitationVerification/GroundingVerifier.cs` before writing the
provenance code, because it already solves the same problem for the
product.

**The existing rate limiter is not a spend guard.** `src/lib/rate-limit.ts`
holds counters in a module-level `Map`. It resets on every function recycle
and is not shared across instances. Fine for contact-form spam, useless
when every call costs money.

**Summarize is never the first option.** A summary that ends the visit
defeats the reason for publishing long form. This is an acceptance
criterion, not a preference.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
npx tsc --noEmit     # typecheck
node scripts/voice-lint.mjs <files>   # house voice rules
```

Foundry calls need the app settings from Phase 0 in `.env.local`. Without
them the console renders and the endpoint returns a configuration error
rather than failing silently.

## Deployment

GitHub to Azure Static Web Apps, `main` to production. Preview
environments are capped at 10 on the Free tier and need periodic cleanup,
or the deploy check fails on quota while the build itself succeeds.

## Working through the tasks

Tasks live in `tasks/` numbered by phase, with 10-number gaps so tasks can
be inserted. Start with `tasks/TASK-INDEX.md`, then run a task with
`/task-execute <number>`. Update `current-task.md` and the index as you go,
so a later session can pick up without re-deriving state.
