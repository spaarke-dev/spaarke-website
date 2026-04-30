# Spaarke Marketing Website (v2)

> **Status**: In Progress (Phase 0)
> **Started**: 2026-04-30
> **Phase**: 0 — Foundations
> **Progress**: 1 / 35 tasks
> **PR**: [#2](https://github.com/spaarke-dev/spaarke-website/pull/2) (draft)
> **Preview URL**: [SWA preview deploy](https://github.com/spaarke-dev/spaarke-website/pull/2) (link in PR)

## Overview

Full visual redesign of the Spaarke marketing site to match the v1.4 creative brief and v2 design mockup. Keeps all v1 backend and infrastructure (Next.js routes, MDX blog, contact API, access-request flow, sitemap, Azure SWA, Application Insights). Replaces visual layer — global typography/tokens, header, footer, notification bar, home page, and re-skinned content pages.

Built on the v1 site's existing tech stack — Next.js 16 (App Router), Tailwind v4, TypeScript. No framework changes.

## Source of truth

- **Creative brief (canonical for copy/positioning)**: [spaarke-home-page-creative-brief-v1.4.md](spaarke-home-page-creative-brief-v1.4.md)
- **Mockup screenshots (canonical for visual treatment)**: [v2 mockup screenshots/](v2%20mockup%20screenshots/)
- **Reference design files (token values, JSX patterns to adapt)**: [design_handoff_spaarke_website_v2/](design_handoff_spaarke_website_v2/)

The mockup screenshots and creative brief together define what we build. The design handoff `.jsx` files and `v2.css` are reference — we don't carry their patterns into production verbatim. Production uses idiomatic Next.js + Tailwind v4 conventions (see "Technical principles" below).

## Technical principles

These guard against drag toward prototype-quality patterns:

- **Server Components by default** — only `"use client"` for components with state, scroll listeners, or interactivity (NotificationBar dismiss, SiteHeader mobile menu, parallax effects).
- **Tailwind-first, semantic tokens** — design tokens live in `globals.css` under `@theme inline` so Tailwind exposes them as utility classes (`bg-surface`, `text-mid`). Drop the `--v2-` prefix; semantic names only.
- **Component primitives over class soup** — typed React components (`<Heading level={1-3}>`, `<Lede>`, `<Eyebrow>`, `<Shell>`, `<Slab>`, `<Button variant="primary|outline|text">`) replace bespoke utility classes.
- **Fonts via `next/font/google`** — Inter Tight + Inter + JetBrains Mono. No `@import` from Google in CSS.
- **Content separated from presentation** — copy lives in typed modules under `src/content/`, not hardcoded in components. Marketing/product can edit copy without touching presentation.
- **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess: true`, typed prop interfaces on every component.
- **Mobile via Tailwind responsive prefixes** — no bespoke `@media` rules unless absolutely needed.
- **Motion respects `prefers-reduced-motion`** — bake into motion-bearing components from day one.

## Strategy

- **Branch-based dev**: all work on `v2` branch. SWA preview URL on PR. Atomic cutover at merge.
- **Replace in place** on the branch (no V2 filename suffix). V1 components remain on `main` until merge.
- **Rollback**: revert the merge commit if needed.
- **Backend untouched**: no changes to `/api/contact`, `/api/registration`, MDX pipeline, sitemap, Azure config, env vars.

## Scope

**In scope**:
- Global design tokens (colors, type, spacing) into `src/app/globals.css` under `@theme inline`
- Component primitives at `src/components/primitives/`
- Typed content modules at `src/content/`
- New global components: NotificationBar, SiteHeader, Footer (replace v1 versions on the branch)
- New home page with six v1.4 sections: Hero, Gap, Pillars (Section 3), Capabilities + Microsoft foundation (Section 4), Legal Operations Intelligence diagram (Section 5), Closing (Section 6)
- Watch demo modal (popup overlay with video)
- Reskin existing content pages: Insights index (renamed from `/blog` to `/insights`), Insights post, contact, access-request, privacy, terms, signin
- v2-styled stubs for `/platform` and `/why-spaarke` (full content lands in future briefs)
- Error and 404 pages styled with v2 system
- Mobile breakpoints baked in (≤960 stack, ≤640 reduce padding/type)
- A11y baseline: focus-visible, alt text, `prefers-reduced-motion`, single H1 per page
- SEO: per-page Metadata, OpenGraph images, JSON-LD on home and Insights articles

**Out of scope**:
- Full content for `/platform` and `/why-spaarke` (separate briefs)
- New blog posts
- Changes to backend APIs or Azure resources
- Visual regression testing infrastructure (manual + Lighthouse is sufficient at this scale)
- Animation library (plain CSS for current scope; framer-motion only when first needed)

## Project Links

- [Implementation Plan](plan.md)
- [Task Index](tasks/TASK-INDEX.md)
- [Current Task](current-task.md)
- [Creative Brief v1.4](spaarke-home-page-creative-brief-v1.4.md)
- [Mockup Screenshots](v2%20mockup%20screenshots/)
- [Design Handoff (reference)](design_handoff_spaarke_website_v2/)
