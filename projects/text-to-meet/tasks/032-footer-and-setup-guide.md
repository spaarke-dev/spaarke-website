# Task 032: Footer line, setup guide, env example

**Phase:** 3 (The link into /meet)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 021
**Tags:** content, config, docs

## Goal

`/meet` carries a "Text MEET" line beside "Prefer to write first?", and
`docs/text-to-meet.md` lets someone rebuild the Twilio and Azure setup from a
new account.

## Context

Spec "Placement" (the /meet row), FR-01 acceptance, FR-13 (the hash secret
is never rotated), and the auth token rotation in FR-04.

## Steps

1. `/meet` footer: "Prefer to text? Text MEET to <number> for a link on your
   phone. Terms: /sms." Number from `SMS_PUBLIC_NUMBER` through
   `displayNumber()`; the line is hidden when the number is unset or
   `SMS_MODE` is not `twilio`, so it appears only once the program is live.
   Wording from `messages.ts`.
2. `docs/text-to-meet.md`: the Twilio account, number, Messaging Service,
   Advanced Opt-Out, HELP text, geo permissions, webhook URL; the
   verification submission fields (spec FR-02); every app setting and Key
   Vault secret by name; auth token rotation using
   `TWILIO_AUTH_TOKEN_PREVIOUS`; why `SMS_PHONE_HASH_SECRET` is never
   rotated; pausing the program (unset `SMS_MODE`); the App Insights events
   to watch. No values.
3. `.env.local.example`: every SMS setting with a placeholder and the local
   table name settings.
4. `npm run voice:lint` on the new copy and the guide.
5. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/app/meet/page.tsx`: footer line
- `src/lib/sms/messages.ts`: footer wording
- `docs/text-to-meet.md`
- `.env.local.example`

## Acceptance Criteria

- [ ] Footer line hidden while `SMS_MODE` is unset
- [ ] `git grep` finds no number, SID, or secret value
- [ ] The guide covers every setting in spec "External Dependencies"

## Notes

Pausing is the rollback: unset `SMS_MODE` and Twilio's requests get 404, so
nobody gets a reply. Clear the Twilio webhook too if the pause is long.
