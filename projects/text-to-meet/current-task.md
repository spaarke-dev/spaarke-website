# Current task: Text to Meet

> Context recovery. A session picking this up cold reads this file first,
> then [tasks/TASK-INDEX.md](tasks/TASK-INDEX.md).

## Quick Recovery

| Field | Value |
|-------|-------|
| **Task** | 011, SMS link token and phone hash (not started) |
| **Branch** | `feature/text-to-meet` (worktree `spaarke-website-wt-text-to-meet`, draft PR #178) |
| **Status** | Task 010 complete 2026-11-21; task 001 waits on the owner |
| **Next Action** | Begin task 011 |

## Last completed

Task 010: `src/lib/sms/config.ts`, `twilio-signature.ts`, `keywords.ts`.
Signatures match Twilio's own library. Decision recorded in the task file:
a stop word anywhere in a message wins over MEET (FR-08), flagged for
counsel.

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
