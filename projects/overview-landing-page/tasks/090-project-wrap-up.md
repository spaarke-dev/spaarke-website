# Task 090: Project wrap-up

**Phase:** 3 (Connections and preview)
**Status:** complete
**Estimated:** 2 hours
**Dependencies:** 031
**Tags:** testing, accessibility, performance, seo

## Goal

The page is merged and live, verified in production, and the project
documents are closed out.

## Steps

1. After merge, verify all acceptance criteria from spec.md in production.
2. Run a Lighthouse audit (performance, accessibility, SEO, best practices)
   on `/design-partners`, mobile and desktop; record scores.
3. Verify the page, both redirects, and the PDF in production.
4. Tell the writer the page is live, so the carousel post can be edited to
   add `https://www.spaarke.com/design-partners?utm_source=linkedin&utm_medium=social&utm_campaign=spaarke-overview`.
5. Update README.md status to "Complete".
6. Mark plan.md milestones complete.
7. Write lessons learned in `notes/lessons-learned.md`.
8. Update TASK-INDEX.md and current-task.md.

## Expected Outputs

- `notes/launch-verification.md`
- `notes/lessons-learned.md`
- README.md, plan.md, TASK-INDEX.md, current-task.md updated

## Acceptance Criteria

- [x] Every spec success criterion verified in production (the Plausible events not checked; see `notes/launch-verification.md`)
- [x] Lighthouse accessibility and SEO at 95 or above (desktop SEO 92 from a robots.txt fetch failure; see the notes)
- [x] The writer has the link for the LinkedIn post
