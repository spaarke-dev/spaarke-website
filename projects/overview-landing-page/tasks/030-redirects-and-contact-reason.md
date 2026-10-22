# Task 030: Redirects and contact reason

**Phase:** 3 (Connections and preview)
**Status:** completed
**Estimated:** 2 hours
**Dependencies:** 020
**Tags:** nextjs, config, contact, forms

## Goal

`/advisory-group` and `/go/more-info-1` land on `/design-partners`, and the
contact form's reason uses the program's name and points to the page.

## Context

Spec FR-10 and FR-11. The carousel says "advisory group"; the postcard is
printed with `/go/more-info-1`.

## Steps

1. In `next.config.ts`, add `{ source: "/advisory-group", destination:
   "/design-partners", permanent: true }`.
2. Change the `/go/more-info-1` destination from `/` to `/design-partners`;
   keep `permanent: false`; update its comment.
3. In `src/lib/contact.ts`, rename "Join design community" to "Join the
   design partner program".
4. In `src/components/ContactForm.tsx`, when that reason is selected, show a
   line: "Apply on the design partner page", linking to `/design-partners`.
5. Search the codebase for other uses of the old reason string and update
   them.
6. Test both redirects locally, including `?utm_source=postcard`.
7. Verify acceptance criteria are met.
8. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `next.config.ts` (modified)
- `src/lib/contact.ts` (modified)
- `src/components/ContactForm.tsx` (modified)

## Acceptance Criteria

- [ ] `/advisory-group` returns 308 to `/design-partners`
- [ ] `/go/more-info-1?utm_source=postcard` returns 307 to
      `/design-partners?utm_source=postcard`
- [ ] The server accepts the new reason and rejects the old one
- [ ] The pointer line shows only for that reason
