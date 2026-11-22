# Text to Meet

> **Status:** In progress. Planned 2026-11-20. The /sms terms page, the
> privacy policy "Text messages" section, and the opt-in image are live
> (PRs #145 and #166). Toll-Free Verification was resubmitted 2026-11-19 and
> is in review. The webhook is not built.

A person texts MEET to Spaarke's toll-free number and gets one reply: a
signed link to `/meet` that ties a booking back to the text. The site never
texts anyone who has not texted first, and never stores a readable phone
number.

- Spec: [spec.md](spec.md)
- Plan: [plan.md](plan.md)
- Tasks: [tasks/TASK-INDEX.md](tasks/TASK-INDEX.md)
- Session recovery: [current-task.md](current-task.md)

## Tech stack

- Next.js 16 App Router route handler on Azure Static Web Apps
- Twilio Programmable Messaging: one US toll-free number in a Messaging
  Service with Advanced Opt-Out; the reply is TwiML in the webhook response
- `node:crypto` for the Twilio signature (HMAC-SHA1), the link token, and the
  phone hash (HMAC-SHA256); no new runtime packages
- Azure Table Storage through `@azure/data-tables` (present)
- All program wording in `src/lib/sms/messages.ts`

## Local development

1. `npm ci`, then copy `.env.local` by hand (it is not in git).
2. Add the SMS settings listed in `.env.local.example` with local values:
   `SMS_MODE=twilio`, a made-up `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`,
   `SMS_WEBHOOK_URL=http://localhost:3000/api/sms/inbound`, random
   `SMS_LINK_SECRET` and `SMS_PHONE_HASH_SECRET`, and local table names
   (`SMS_SENDERS_TABLE`, `SMS_CONVERSATIONS_TABLE`, `SMS_INBOUND_TABLE`,
   `SMS_COUNTERS_TABLE`) so checks never touch production rows.
3. `npm run dev`, then `npm run sms:check` (offline cases) and
   `npm run sms:check -- --server http://localhost:3000` (route cases). The
   check script signs its own requests, so no Twilio account is needed
   locally.

## Deployment

The code ships with `SMS_MODE` unset, so `/api/sms/inbound` returns 404 and
nothing changes on the site. Going live is a settings change plus the Twilio
webhook URL, done only after the number is Verified and counsel has approved
the Compliance section. Steps: `docs/text-to-meet.md` (written in task 032).

## Never commit

The repository is public. The phone number, the Twilio account SID, the auth
token, the Messaging Service SID, and every secret live in Key Vault
`sprk-demo-kv` and the SWA app settings only.
