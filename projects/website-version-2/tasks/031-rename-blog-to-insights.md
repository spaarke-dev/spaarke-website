# Task 031: Rename `/blog` → `/insights` + redirect; reskin index

**Phase:** 3 — Reskin Existing Pages
**Status:** not-started (stub — to be expanded when Phase 3 begins)
**Estimated:** 2.5 hours
**Dependencies:** 030
**Tags:** routing, redirect, reskin

## Context

Rename the route folder `src/app/blog/` → `src/app/insights/` and update internal references. Add a permanent redirect `/blog` → `/insights` (and `/blog/[slug]` → `/insights/[slug]`) via `next.config.ts` redirects, so existing links and SEO juice survive. Update sitemap to use the new path. Update RSS feed URL.

Reskin the Insights index page using the page template primitives from Task 030 — eyebrow "INSIGHTS", H1 "How we think about the work.", lede, then the existing post listing with v2 card styling.

Update SiteHeader nav link `/blog` → `/insights` (will already be `/insights` if we set it correctly in Task 011).

Update the v1 sitemap.ts to reference `/insights`.

## Acceptance (will expand when Phase 3 begins)

- [ ] Route exists at `/insights` and `/insights/[slug]`
- [ ] Permanent redirect from `/blog` and `/blog/[slug]` works
- [ ] Sitemap uses `/insights` paths
- [ ] RSS feed URL updated
- [ ] Index page reskinned in v2 system
- [ ] All internal links updated (no broken links to `/blog`)
