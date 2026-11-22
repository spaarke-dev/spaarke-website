# Current task: Text to Meet

> Context recovery. A session picking this up cold reads this file first,
> then [tasks/TASK-INDEX.md](tasks/TASK-INDEX.md).

## Quick Recovery

| Field | Value |
|-------|-------|
| **Task** | 041, Go live (blocked) |
| **Branch** | Code merged to `main` (PR #178, `da3dc77`); task 041 needs no code change |
| **Status** | Shipped dark 2026-11-22: `SMS_MODE` unset in production |
| **Next Action** | Task 041 once the number is Verified, the Twilio account is paid (002), and counsel has signed off (004) |

## Last completed

Task 040: PR #178 merged and deployed. On spaarke.com the inbound route
answers 404, `/meet` shows no text line, a junk `c` renders the normal page,
and `/sms` is unchanged.

Task 032: the "Prefer to text?" line on /meet (shown only with a full SMS
configuration), `docs/text-to-meet.md`, and the SMS settings in
`.env.local.example`. Phase 3 complete; 177 offline cases pass.

Task 031: a booking through a text link carries `source: sms` and
`smsConversationId`, the conversation is marked `booked`, and the team email
says "Came from a text (MEET, <code>)". A bad token never blocks a booking,
and all 176 offline cases pass.

Task 030: `/meet?c=` verifies the token, records the open, shows the
welcome line in Graph and Bookings mode, drops `c`, and sends `Meeting Link
Opened`. `MeetBookingFlow` has an `smsToken` prop, not yet sent (task 031).
159 offline cases pass.

Task 022: site-wide caps, cap alert email, in-memory guard, and
`sms:check --server` against Azurite (166 pass). Phase 2 complete.

Task 021: `POST /api/sms/inbound`, `src/lib/sms/inbound.ts`, `replies.ts`.
Per-sender limits done here; 144 offline cases pass; build passes.

Task 020: `src/lib/sms/store.ts`, checked against the dev mock (17 cases in
`npm run sms:check`, 116 in all). Real Table Storage is not yet exercised.

Task 012: `npm run sms:check`, 99 offline cases, all pass. `NUDGE_REPLY`
added to `messages.ts` early so the check covers it.

Task 011: `createSmsToken`, `verifySmsToken`, `newConversationId` in
`src/lib/meet/tokens.ts`; `normalizeE164` and `phoneHash` in
`src/lib/sms/phone-hash.ts`. Token is 42 characters; the MEET reply is 216.

Task 010: `src/lib/sms/config.ts`, `twilio-signature.ts`, `keywords.ts`.
Decision recorded in the task file: a stop word anywhere in a message wins
over MEET (FR-08), flagged for counsel.

## Outside approvals

| Item | State |
|---|---|
| Toll-Free Verification | Resubmitted 2026-11-19 after error 30513; in review |
| Twilio account | Trial; must be upgraded to paid (task 002) |
| Counsel review of the Compliance section | Not started (task 004) |

## Standing rules

- The repo is public: no phone number, SID, token, or secret in any file.
- Any change to a text in `src/lib/sms/messages.ts` must match the
  verification submission and the `/sms` page.
- No em or en dashes and US spelling in reader-facing copy; run
  `npm run voice:lint -- <file>`.
- Test texts and test bookings in production are made by the owner.
- Don't push to main, force push, or skip hooks.
