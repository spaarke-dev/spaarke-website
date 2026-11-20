# Current task: Text to Meet

> Context recovery. A session picking this up cold reads this file first,
> then [tasks/TASK-INDEX.md](tasks/TASK-INDEX.md).

## Quick Recovery

| Field | Value |
|-------|-------|
| **Task** | None active. The plan and tasks were generated 2026-11-20 |
| **Branch** | `feature/text-to-meet` |
| **Status** | Waiting on the owner's answers in task 001; build tasks 010 onward can start now |
| **Next Action** | Owner: answer task 001. Claude: execute task 010 |

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
