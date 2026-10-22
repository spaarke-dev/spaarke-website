# Task 031: Pull request and preview verification

**Phase:** 3 (Connections and preview)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 012, 021, 022, 030
**Tags:** deploy, swa, ci-cd, testing

## Goal

The pull request's Static Web Apps preview passes every success criterion in
spec.md that can be checked before production.

## Context

Spec success criteria 1 to 8.

## Steps

1. Run `npm run typecheck`, `npm run lint`, `npm run build`.
2. Push the branch and open the PR (`push-to-github`).
3. Confirm the preview environment has the storage, SendGrid, and reCAPTCHA
   settings.
4. On the preview: submit a test application; confirm the row in
   `DesignPartnerApplications` and the email at contactus@spaarke.com.
5. Download the PDF from both links; confirm both Plausible events.
6. curl both redirects with a query string.
7. Check the page at 360 px and desktop; test the contact form reason.
8. Review the PR file list: no carousel HTML.
9. Record results in `notes/preview-verification.md`.
10. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- An open PR with a passing preview
- `notes/preview-verification.md`

## Acceptance Criteria

- [ ] Success criteria 1 to 8 in spec.md pass, or each failure is recorded
      with its cause
- [ ] The test row is deleted from the table after the check
