# Task 033: Reskin `/contact` and `/access-request` (forms)

**Phase:** 3 — Reskin Existing Pages
**Status:** not-started (stub — to be expanded when Phase 3 begins)
**Estimated:** 2 hours
**Dependencies:** 030
**Tags:** reskin, forms

## Context

Both pages have working forms (different APIs — `/api/contact` and `/api/registration`). Don't change the API contracts or success/error flows. Only restyle inputs, labels, helper text, buttons, and the page chrome around them.

Build a small set of v2 form primitives in `src/components/v2/`:
- `<FormField>` (label + input wrapper)
- `<FormInput>`, `<FormTextarea>`, `<FormSelect>` — match v2 typography (Source Sans 3 body), hairline borders, dark-bg friendly focus rings
- `<FormSubmit>` — wraps `<Button variant="primary">` with submitting/disabled state

Apply page template (Task 030): eyebrow + H1 + lede above the form.

## Acceptance (will expand when Phase 3 begins)

- [ ] Both forms render in v2 styling
- [ ] No regression in form submission (API contracts unchanged)
- [ ] Validation messages styled consistently
- [ ] Success states styled
- [ ] Mobile usable (44px tap target on inputs / buttons)
