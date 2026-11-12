# Design Partner Page

**Status:** In progress
**Created:** 2026-10-21

A page at `/design-partners` that recruits legal operations leaders into the
Spaarke Design Partner Program and hands over the LinkedIn overview carousel
as an open PDF download. It is the one destination for the carousel, later
posts, the contact form, and the printed postcard (`/go/more-info-1`).

Design partners contribute product direction, functional requirements, and
user feedback. In return they help direct the product, get early access, and
use Spaarke free of charge.

## Documents

| File | What it holds |
|---|---|
| [`design.md`](design.md) | Purpose, name, page structure, reuse, decisions |
| [`spec.md`](spec.md) | 15 FRs, 6 NFRs, 8 success criteria |
| [`plan.md`](plan.md) | Four phases with gates |
| [`tasks/TASK-INDEX.md`](tasks/TASK-INDEX.md) | Task registry and status |
| [`current-task.md`](current-task.md) | Active task, for context recovery |
| [`notes/`](notes/) | Implementation notes |

## Tech stack

- Next.js 16.1.6 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind v4 and the v2 primitives in `src/components/primitives`
- Azure Table Storage (`DesignPartnerApplications`)
- SendGrid notification to contactus@spaarke.com
- reCAPTCHA, the shared rate limiter, Plausible, Application Insights
- Azure Static Web Apps

## The decisions worth knowing before you touch this

**Copy the early-release route, not the demo-request route.** The
demo-request route forwards to the platform's registration service and
creates evaluation registrations in Dataverse. A design partner application
is not a request for evaluation access.

**The PDF is open.** The same file is free on LinkedIn, so a form in front
of it would cost readers and return nothing.

**Two names in public, on purpose.** The overview carousel says "advisory
group" and keeps it. `/advisory-group` redirects permanently to
`/design-partners`, and everything new uses "design partner".

**The carousel HTML stays private.** This repo is public. Slide images and
the PDF come from `C:\code_files\spaarke-research\linkedin-carousel\`
(`render.mjs`); only the rendered PNG or WebP files and the PDF are
committed.

## Local development

```
npm install
npm run dev
```

The form needs `STORAGE_ACCOUNT_CONNECTION`, `SENDGRID_API_KEY`,
`SENDGRID_FROM_EMAIL`, `CONTACT_EMAIL_TO`, `RECAPTCHA_SECRET_KEY`, and the
reCAPTCHA site key in `.env.local`. Without them the route still validates,
and storage and email log a skip.

## Deployment

Feature branch, pull request, Azure Static Web Apps preview for review,
merge to `main` for production. See [`plan.md`](plan.md) phase 3.
