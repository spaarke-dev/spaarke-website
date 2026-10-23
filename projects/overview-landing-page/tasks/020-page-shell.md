# Task 020: Page shell and copy

**Phase:** 2 (The page)
**Status:** completed
**Estimated:** 3 hours
**Dependencies:** 001
**Tags:** nextjs, react, tailwind, seo, metadata, sitemap, content

## Goal

`/design-partners` renders statically with the hero, the contribute and
receive lists, the application section placeholder, further reading,
metadata, and a sitemap entry.

## Context

Spec FR-01, FR-02, FR-03, FR-14. Layout and tone follow
`src/app/access-request/page.tsx`.

## Steps

1. Create `src/app/design-partners/page.tsx` with the v2 primitives, dark
   tone, and brand glow, matching `/access-request`.
2. Hero: eyebrow, headline, and lede from design.md section 4; buttons
   "Apply to become a design partner" (anchor `#apply`) and "Download the
   overview (PDF)".
3. Contribute and receive: two short lists, copy from spec FR-03.
4. Application section with id `apply`: the two-column layout, left column
   "What happens next" (the team reads every application and replies by
   email from contactus@spaarke.com), right column reserved for the form.
5. Further reading: The Spaarke Method article and `/contact`.
6. Metadata: title, description, canonical, Open Graph image
   `/design-partners/og.png`.
7. Add `/design-partners` to `src/app/sitemap.ts`.
8. Put the page copy in a scratch `.md` file and run `npm run voice:lint` on
   it; fix every error.
9. Verify acceptance criteria are met.
10. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/app/design-partners/page.tsx`
- `src/app/sitemap.ts` (modified)

## Acceptance Criteria

- [ ] Builds as a static route
- [ ] No horizontal scroll at 360 px; 16 px side gutter
- [ ] Copy passes voice lint with no errors
- [ ] Meta tags and the sitemap entry render in the build
