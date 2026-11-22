# Task 030: /meet with a token

**Phase:** 3 (The link into /meet)
**Status:** completed
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

- [x] Valid token: welcome line, open recorded, `c` gone from the URL
- [x] Invalid or expired token: the normal page, no welcome line, logged
- [x] The page renders when storage throws

## Notes

Reading `searchParams` keeps the page dynamic, which it already is because
it loads availability at request time.

### Done (2026-11-22)

- `src/lib/sms/link-open.ts`: `openSmsLink(c, now)` verifies the token,
  records the open, and logs `sms.link_opened` (with the code and whether it
  is the first open), `sms.token_invalid`, or `sms.token_expired`. A signed
  token whose conversation is gone counts as invalid. It never throws.
- **Decision:** when storage is unset or fails, a token that verifies still
  gets the welcome line; only the record is missed, and the error is logged
  (`sms.link_open`). The signature already proves the link came from a
  reply, and a storage outage should not change what the visitor sees.
- `src/lib/sms/config.ts`: `smsLinkSecret()`, read apart from
  `getSmsConfig()`, so a link already sent still works with the webhook off
  or in Bookings mode.
- `src/app/meet/page.tsx`: the welcome line in both the Graph and the
  Bookings branches; not shown when neither can book, since "Choose a time
  below" would be wrong there. The token check runs beside the
  availability load, not after it.
- `src/components/meet/SmsLinkOpened.tsx`: removes `c` (other parameters
  and the hash kept) and sends `Meeting Link Opened` with `source: sms` and
  `code`. It waits up to five seconds for the Plausible snippet, which loads
  after hydration, and sends once even when React runs the effect twice.
- `MeetBookingFlow` takes `smsToken`; task 031 sends it.
- `scripts/check-sms.mts`: 15 cases for `openSmsLink`; 159 offline pass.
- Browser checks: [notes/link-open-checks.md](../notes/link-open-checks.md).
- `voice:lint` flags the welcome line as "two clipped sentences". The text
  is fixed by FR-16, so it stays.
