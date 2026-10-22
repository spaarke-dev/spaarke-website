# Task 021: Slide strip and download

**Phase:** 2 (The page)
**Status:** completed
**Estimated:** 3 hours
**Dependencies:** 001, 020
**Tags:** react, tailwind, responsive, accessibility, performance

## Goal

The nine slides display in a swipeable strip with alt text, and the PDF
download fires "Overview Download".

## Context

Spec FR-04, FR-05, FR-12, NFR-02, NFR-03.

## Steps

1. Build the strip (inline in the page or `src/components/SlideStrip.tsx`):
   horizontal scroll with `scroll-snap-type: x mandatory`, one slide wide on
   a phone, three to four visible on desktop.
2. `next/image` per slide, width 1080, height 1350, responsive `sizes`, lazy
   below the hero; alt text from the carousel `draft.md`.
3. The strip is focusable and scrolls with arrow keys; give it an
   `aria-label`.
4. Download link `/design-partners/spaarke-overview.pdf` with `download`,
   under the strip and in the hero.
5. Add "Overview Download" and "Design Partner Submit" to
   `src/types/plausible.d.ts`; call `track("Overview Download", { props: {
   location } })` on both links (a small client component).
6. Check at 360 px and desktop; check total transferred image weight.
7. Verify acceptance criteria are met.
8. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/app/design-partners/page.tsx` (modified)
- `src/components/SlideStrip.tsx` (optional)
- `src/types/plausible.d.ts` (modified)

## Acceptance Criteria

- [ ] Swipes on a phone without page-level horizontal scroll
- [ ] Every slide has alt text; the strip works by keyboard
- [ ] Both download links work and send the event with `location`
- [ ] Images lazy-load and total under 2 MB
