# Services Page: Managed Legal Operations

> **Status**: In Progress (first draft for review)

A `/services` page, labeled "Services" in the nav, presenting Spaarke Managed Legal Operations (MLO) to law firms and corporate legal departments, with a page-wide Law Firm | Corporate switch, two animated diagrams and an illustrative cost calculator.

| File | Purpose |
|---|---|
| [`design.md`](design.md) | Human design (v2), including how it fits the site |
| [`spec.md`](spec.md) | Implementation spec, requirements, assumptions, open questions |
| [`plan.md`](plan.md) | Phases, milestones, risks |
| [`tasks/TASK-INDEX.md`](tasks/TASK-INDEX.md) | Task registry and status |
| [`current-task.md`](current-task.md) | Context recovery for the next session |
| [`prototype/`](prototype/) | The original React and Vite prototype (reference only, not built by the site) |
| [`notes/`](notes/) | Handoff notes and review notes |

Private material (competitive notes, private source documents) is in `C:\code_files\spaarke-research\2026-11-services-page\`, outside this public repo.

## Tech

Next.js App Router, React 19, Tailwind v4, `d3-sankey` for the Sankey layout. Code lives in `src/app/services/` and `src/components/services/`.

## Local development

```bash
npm ci
npm run dev
```

Open http://localhost:3000/services (add `?audience=corporate` for the corporate view).

```bash
npm run test:services
```

runs the calculator model tests, including the compliance guardrails.

## Deployment

Standard site flow: PR to `main`, Azure Static Web Apps deploys on merge. The page stays `noindex` and out of the sitemap until counsel review (task 052).
