# Spaarke Marketing Website (v2)

> **Status**: Not Started
> **Started**: 2026-04-30
> **Phase**: 0 — Foundations
> **Progress**: 0 / 24 tasks

## Overview

Full visual redesign of the Spaarke marketing site to match the v2 design handoff. The redesign keeps all v1 backend and infrastructure (Next.js routes, MDX blog, contact API, access-request flow, sitemap, Azure SWA, Application Insights) and replaces the visual layer — global typography/tokens, header, footer, notification bar, home page, and re-skinned content pages.

Built on the v1 site's existing tech stack — Next.js 16 (App Router), Tailwind v4, TypeScript. No framework changes.

## Source of truth

- **Design handoff**: [design_handoff_spaarke_website_v2/README.md](design_handoff_spaarke_website_v2/README.md)
  - Section-by-section spec, design tokens, type scale, asset inventory, copy, mobile breakpoint guidance
- **Creative brief (text)**: [../spaarke-home-page-creative-brief-v1.1.md](../spaarke-home-page-creative-brief-v1.1.md)
  - Strategic position, brand vocabulary, things to avoid

The handoff README is the canonical implementation spec. Any conflict with this README's task descriptions: handoff wins.

## Strategy

- **Branch-based dev**: all work on `v2` branch. SWA preview URL on PR. Atomic cutover at merge.
- **Replace in place** on the branch (no `V2` filename suffix). V1 components remain on `main` until merge.
- **Rollback**: revert the merge commit if needed.
- **Backend untouched**: no changes to `/api/contact`, `/api/registration`, MDX pipeline, sitemap, Azure config, env vars.

## Scope

**In scope**:
- Global v2 design tokens (colors, type, spacing) into `src/app/globals.css`
- New global components: NotificationBar, SiteHeader, Footer
- New home page composed of v2 sections (Hero, GapStats, ModuleGrid, PlatformDiagram, Closing)
- Reskin existing content pages: Insights index (renamed from `/blog` to `/insights`), Insights post, contact, access-request, privacy, terms, signin
- v2-styled stubs for `/platform` and `/why-spaarke` (full content lands in future briefs)
- Mobile breakpoints baked in (≤960 stack, ≤640 reduce padding/type)
- A11y baseline: focus-visible, alt text, `prefers-reduced-motion`

**Out of scope**:
- Full content for `/platform` and `/why-spaarke` (separate briefs)
- New blog posts
- Changes to backend APIs or Azure resources
- New telemetry / analytics

## Project Links

- [Implementation Plan](plan.md)
- [Task Index](tasks/TASK-INDEX.md)
- [Current Task](current-task.md)
- [Design Handoff](design_handoff_spaarke_website_v2/README.md)
