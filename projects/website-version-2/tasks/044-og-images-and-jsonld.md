# Task 044: OG images + JSON-LD

**Phase:** 4 — Polish
**Status:** not-started (stub — to be expanded when Phase 4 begins)
**Estimated:** 2.5 hours
**Dependencies:** 025, 031, 032
**Tags:** seo, opengraph, structured-data

## Context

Next.js App Router supports route-collocated OpenGraph images via `opengraph-image.tsx` files (or .png/.jpg) — Next renders them as static OG cards at `/route/opengraph-image`. Combined with JSON-LD structured data, this gets us proper social-share previews and rich search results.

## Steps (when Phase 4 begins)

1. **Home page OG image** at `src/app/opengraph-image.tsx`:
   - Dynamic image with v2 typography
   - "See all sides of every matter." headline
   - Spaarke wordmark
   - Subtle background — match v2 dark slab aesthetic
   - 1200×630px (Twitter/LinkedIn standard)
2. **Insights index OG image** at `src/app/insights/opengraph-image.tsx`:
   - "Insights" headline
   - Same v2 visual system
3. **Per-post OG images** at `src/app/insights/[slug]/opengraph-image.tsx`:
   - Dynamic — pulls post title and date from frontmatter
   - Type tag chip
4. **JSON-LD on home** in `src/app/page.tsx` metadata or via a `<Script>` tag:
   ```ts
   const orgSchema = {
     "@context": "https://schema.org",
     "@type": "Organization",
     name: "Spaarke",
     url: "https://www.spaarke.com",
     logo: "https://www.spaarke.com/images/logo-color.svg",
     // ...
   };
   ```
5. **JSON-LD on Insights posts** (Article schema):
   - `headline`, `datePublished`, `author`, `description`, `image`
   - Add to MDX page rendering pipeline so all posts get it automatically
6. Validate via:
   - Twitter Card validator
   - LinkedIn Post Inspector
   - Google Rich Results Test (for JSON-LD)

## Acceptance (will expand when Phase 4 begins)

- [ ] Home page renders correct OG card in Twitter/LinkedIn debuggers
- [ ] Insights index renders correct OG card
- [ ] Insights post pages render dynamic OG cards with title + date
- [ ] JSON-LD Organization schema present on home, validates in Google Rich Results Test
- [ ] JSON-LD Article schema present on Insights posts, validates in Google Rich Results Test
- [ ] No regression in basic Metadata exports
