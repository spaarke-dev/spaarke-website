# Task 011: API route

**Phase:** 1 (Server side)
**Status:** completed
**Estimated:** 3 hours
**Dependencies:** 010
**Tags:** api, forms, validation, typescript

## Goal

`POST /api/design-partners` validates, rate-limits, verifies reCAPTCHA,
stores, notifies, and tracks, returning the statuses in spec FR-07.

## Context

Modelled on `src/app/api/early-release/route.ts`. The contact form failed on
2026-09-25 because awaits with no timeout hung and the visitor saw no
error. This route must not repeat that.

## Steps

1. Create `src/app/api/design-partners/route.ts`.
2. Rate-limit by IP hash with `checkRateLimit` and `getIpHash`; 429 when
   exceeded.
3. Validate the body against the field rules in spec FR-06; 400 with
   per-field errors.
4. Verify reCAPTCHA; 400 `CAPTCHA_FAILED` on failure. Copy `verifyCaptcha()` from the
   early-release route and give its `fetch` an `AbortSignal.timeout`
   (the demo-request route uses one), treating a timeout as a failure.
5. Call `saveDesignPartnerApplication()` and
   `sendDesignPartnerNotification()`. If both fail, return 500 so the visitor
   sees an error and can use the contact form.
6. `trackEvent("DesignPartnerApplication", …)` with organization type and
   attribution, no personal data, then `flushTelemetry()` before every
   return, as the contact route does.
7. Test locally with curl: valid, invalid, missing token, and rate limit.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/app/api/design-partners/route.ts`

## Acceptance Criteria

- [~] 400, 429, and 500 (nothing configured) reached locally; 200 and
      `CAPTCHA_FAILED` need the preview's settings (task 031)
- [ ] No await without a timeout on a network call
- [ ] Telemetry flushed before each return
- [ ] No personal data in telemetry properties

## Notes

Server validation must mirror the client rules in task 022 exactly; keep
the rules in one shared module (for example `src/lib/design-partners.ts`)
imported by both, as `src/lib/contact.ts` does for the contact form.
