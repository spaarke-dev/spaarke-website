# Task 022: Application form

**Phase:** 2 (The page)
**Status:** completed
**Estimated:** 3 hours
**Dependencies:** 011, 020
**Tags:** react, forms, validation, accessibility

## Goal

`DesignPartnerForm` submits to `/api/design-partners`, shows field errors,
keeps values on failure, and replaces itself with the confirmation on
success.

## Context

Spec FR-06 and NFR-02, NFR-04, NFR-05. Modelled on
`src/components/DemoRequestForm.tsx`.

## Steps

1. Create `src/components/DesignPartnerForm.tsx` with the fields in spec
   FR-06, using `FormField` and the shared rules module from task 011.
2. Organization type as a select: Law department, Law firm, Other.
3. "The decision you would start with" as an optional textarea with a
   500-character counter.
4. Consent checkbox and privacy link copied from `DemoRequestForm`.
5. Invisible reCAPTCHA as in `DemoRequestForm`; include `submissionProps()`.
6. On success: replace the form with "Thank you. The Spaarke team will reply
   by email." and `track("Design Partner Submit", { props: {
   organizationType } })`.
7. On failure: `InlineAlert` naming the problem, values kept, a pointer to
   `/contact` on a server error.
8. Mount it in the right column of the `#apply` section.
9. Submit locally against the route with and without settings.
10. Verify acceptance criteria are met.
11. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/components/DesignPartnerForm.tsx`
- `src/app/design-partners/page.tsx` (modified)

## Acceptance Criteria

- [ ] Client validation matches the server rules, from one module
- [ ] Every field labelled; errors announced to screen readers
- [ ] Success shows the confirmation and fires the event
- [ ] Failure keeps the values and shows an alert
