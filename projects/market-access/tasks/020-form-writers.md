# Task 020: Form writers

**Phase:** 2 (Site writers)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 012
**Tags:** nextjs, api, forms, storage

## Goal

Each lead form records a contact and an activity after its own save succeeds, without any effect on the visitor if the market tables fail.

## Context

FR-06. The existing tables, emails and morning report stay as they are; each writer gains one `recordActivitySafe` call.

**Raise open question 3 with Ralph before coding:** should contacts from the website forms start as `general` even when they are investors, with Ralph reclassifying them? The plan recommends `general` for every form except the investor overview form, which starts as `investor`.

## Steps

1. Ask Ralph open question 3; record the answer in `spec.md` and `current-task.md`.
2. Add `src/lib/market/writers.ts` with one small mapper per form that builds the `recordActivity` input from the form data and attribution: type, source (the existing table name), source ID (the existing row key), occurred-at, email and hints (name, title, organization, phone), UTM fields, a one-line summary, and the visibility rule from step 1.
3. Call `recordActivitySafe` after the save in:
   - `src/app/api/contact/route.ts` (`form.contact`);
   - `src/app/api/registration/demo-request/route.ts` (`form.demo`);
   - `src/app/api/design-partners/route.ts` (`form.design_partner`);
   - `src/app/api/early-release/route.ts` (`form.early_release`);
   - `src/lib/investor-overview.ts` `saveRequest` or its route (`form.investor_overview`).
4. Extend `scripts/check-market.mts` to feed each mapper made-up data and check the output.
5. Verify on the preview environment: submit the contact form with UTM parameters, read the contact and activity from the dev or preview tables; then set a broken storage connection in a local run and confirm each form still succeeds and sends its email.

## Expected outputs

- `src/lib/market/writers.ts`
- One call added in each of the five form paths
- `scripts/check-market.mts` additions

## Acceptance criteria

- [ ] A form submitted twice with different capitalization gives one contact with two activities (FR-03 acceptance).
- [ ] With the market tables unavailable, every form still succeeds and sends its email (FR-06 acceptance).
- [ ] Success criterion 4 holds on the preview environment.

## Notes

- The source ID is the existing row key, so the backfill (task 052) produces the same idempotency keys and never doubles these rows.
- Spec references: FR-03, FR-06, NFR-03, Unresolved question 3.
