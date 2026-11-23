# Task 052: Launch: indexing and merge

**Phase:** 5 - Review and launch inputs
**Status:** not-started
**Estimated:** 2-4 hours
**Dependencies:** 051
**Tags:** seo, deploy

## Goal

The page is indexed and live.

## Context

See `../spec.md` and the design sections named in the goal.

## Steps

1. Replace the hero media with licensed files: license the trial videos (Stocksy 5947230 and 5947223, or others) and commit them under `public/services/` with new names (the `hero-comp*` names are gitignored), set `hero.media.videos`, set `fallbackImage` to a licensed still, adjust each `focus` and `fallbackFocus`, set `interim: false`, and delete `public/services/hero-interim.jpg`
2. Remove noindex; add /services to sitemap.ts; add FAQPage JSON-LD
3. Open the PR and merge after review
4. Verify the acceptance criteria are met
5. Update TASK-INDEX.md: mark this task complete

## Expected Outputs

- `src/app/sitemap.ts`, `src/app/services/page.tsx`

## Acceptance Criteria

- [ ] No interim tag on the hero; the interim Unsplash file is removed and the hero videos are licensed and committed
- [ ] Page in the sitemap and indexable
