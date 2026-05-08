# Task 032: Reskin Insights post page

**Phase:** 3 — Reskin Existing Pages
**Status:** not-started (stub — to be expanded when Phase 3 begins)
**Estimated:** 2 hours
**Dependencies:** 031
**Tags:** reskin, mdx, typography

## Context

Apply v2 typography and layout to the Insights post template (formerly `/why-spaarke/[slug]`, now `/insights/[slug]`). MDX content needs a styled prose container — Manrope for headings, Source Sans 3 for body, generous max-width (~720px), correct heading hierarchy clamps from v2 type scale.

Update the post header: eyebrow with type tag (whitepaper/article/brief), H1 title, lede, byline + date + reading time line.

Footer of post: tag chips, "more insights" sidebar or footer linking to 2-3 other posts.

Tailwind `prose` classes won't match v2 system out of the box — either configure `@tailwindcss/typography` with v2 colors/fonts (already loaded per memory note), or write a bespoke `.v2-prose` class.

## Acceptance (will expand when Phase 3 begins)

- [ ] Post renders in v2 visual system
- [ ] MDX headings, lists, blockquotes, code blocks styled correctly
- [ ] Reading time + date + byline present
- [ ] Tag chips link to filtered Insights index
- [ ] Mobile reads cleanly
