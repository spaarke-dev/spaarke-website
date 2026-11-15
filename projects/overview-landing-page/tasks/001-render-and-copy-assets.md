# Task 001: Render and copy the assets

**Phase:** 0 (Assets)
**Status:** completed
**Estimated:** 2 hours
**Dependencies:** none
**Tags:** content, performance

## Goal

`public/design-partners/` holds `spaarke-overview.pdf`, nine slide images,
and an Open Graph image of 1200 by 630, with no carousel HTML in the repo.

## Context

The page shows the nine carousel slides and offers the PDF (spec FR-04,
FR-05, FR-14, FR-15). The approved carousel source is private because its
editing comment breaks the services positioning rule, and this repo is
public.

## Steps

1. In `C:\code_files\spaarke-research\linkedin-carousel\`, run
   `node render.mjs source.html out-render`. Confirm the overflow report is
   clean and nine `slide-NN.png` files exist.
2. Copy `out-render/slide-01.png` to `slide-09.png` into
   `public/design-partners/`.
3. Check the total size. Above 2 MB, convert to WebP with Sharp (quality
   about 82) and keep only the WebP files.
4. Copy `content-platform/articles/spaarke-overview-carousel/spaarke-overview-carousel.pdf`
   to `public/design-partners/spaarke-overview.pdf`.
5. Make the Open Graph image: crop the cover slide to 1200 by 630 with Sharp
   (or render the cover section at that size), saved as
   `public/design-partners/og.png`. Keep the headline legible.
6. Confirm no `.html` file was copied.
7. Verify acceptance criteria are met.
8. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `public/design-partners/slide-01` to `slide-09` (`.png` or `.webp`)
- `public/design-partners/spaarke-overview.pdf`
- `public/design-partners/og.png`

## Acceptance Criteria

- [x] Nine slide images at 1080 by 1350, under 2 MB in total
- [x] The PDF opens with nine pages and the title "Spaarke Overview"
- [x] The Open Graph image is 1200 by 630 and readable as a thumbnail
- [x] No carousel HTML in the repo

## Notes

The slide alt text for task 021 is in the carousel's `draft.md`, section
"Alt text".
