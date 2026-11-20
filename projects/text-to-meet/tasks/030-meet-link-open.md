# Task 030: /meet with a token

**Phase:** 3 (The link into /meet)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 020
**Tags:** nextjs, react, analytics

## Goal

`/meet?c=<token>` verifies the token, records the open, shows "Thanks for
texting. Choose a time below." above the picker or the embed, removes `c`
from the address bar, and sends the Plausible event. A bad token changes
nothing for the visitor.

## Context

Spec FR-16 (the first part). Works in both Graph and Bookings mode; Bookings
mode is the rollback, so the welcome line must show there too.

## Steps

1. `src/app/meet/page.tsx`: accept `searchParams`; when `c` is present and
   `SMS_LINK_SECRET` is set, `verifySmsToken`, then `getConversation` and
   `recordLinkOpen`. Log `sms.link_opened`, `sms.token_invalid`, or
   `sms.token_expired`. Wrap in try/catch: a storage error must not break
   the page.
2. Render the welcome line as plain text in the page flow (NFR-06), in both
   the Graph and the Bookings branches.
3. A small client component that, on mount, calls
   `history.replaceState` to drop `c` (keeping other query parameters) and
   sends `track("Meeting Link Opened", { source: "sms", code })`. Add the
   event name to `src/types/plausible.ts`.
4. Pass the verified token to `MeetBookingFlow` as a prop for task 031.
5. Check locally: valid token, tampered token, expired token, no token, and
   the page with storage unset.
6. `npm run typecheck`, `npm run lint`, `npm run voice:lint` on the line.
7. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/app/meet/page.tsx`
- `src/components/meet/SmsLinkOpened.tsx` (or similar)
- `src/types/plausible.ts`

## Acceptance Criteria

- [ ] Valid token: welcome line, open recorded, `c` gone from the URL
- [ ] Invalid or expired token: the normal page, no welcome line, logged
- [ ] The page renders when storage throws

## Notes

Reading `searchParams` keeps the page dynamic, which it already is because
it loads availability at request time.
