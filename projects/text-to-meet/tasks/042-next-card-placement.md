# Task 042: Next card placement

**Phase:** 4 (Ship and go live)
**Status:** deferred (until the next card goes to print)
**Estimated:** 0.5 hours
**Dependencies:** 041
**Tags:** config, content

## Goal

When the next postcard goes to print, `/go/more-info-2` exists and the card
copy carries the call to action, the consent statement, and the code.

## Context

Spec "Placement". An unprinted `/go/` slot is an unused promise, so it is
added only with a print date. The August 2026 cards (`/go/more-info-1`) stay
as they are.

## Steps

1. Add `/go/more-info-2` to `/meet`, `permanent: false`, in `next.config.ts`
   with the comment block the other slots use.
2. Add the card's code (for example `CARD2`) to `PLACEMENT_CODES`.
3. Card copy: `callToAction()` and `consentStatement()` from `messages.ts`
   with "Text MEET CARD2", plus "Terms: spaarke.com/sms. Privacy:
   spaarke.com/privacy."
4. Owner approves the proof before print.
5. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `next.config.ts`, `src/lib/sms/config.ts`

## Acceptance Criteria

- [ ] Slot redirects with the query string kept
- [ ] Card copy matches `messages.ts` and the verification submission

## Notes

Never change a printed QR; change where its `/go/` slot points.
