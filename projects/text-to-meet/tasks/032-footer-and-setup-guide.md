# Task 032: Footer line, setup guide, env example

**Phase:** 3 (The link into /meet)
**Status:** completed
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

- [x] Footer line hidden while `SMS_MODE` is unset
- [x] `git grep` finds no number, SID, or secret value
- [x] The guide covers every setting in spec "External Dependencies"

## Notes

Pausing is the rollback: unset `SMS_MODE` and Twilio's requests get 404, so
nobody gets a reply. Clear the Twilio webhook too if the pause is long.

### Done (2026-11-22)

- `src/lib/sms/messages.ts`: `meetPageLine()`, "Prefer to text? Text MEET
  to <number> for a link on your phone. Msg & data rates may apply." The
  page follows it with a "Text message terms" link to /sms. The rates
  clause was added to the wording in step 1 because every other call to
  action carries it; counsel sees it in task 004.
- `src/app/meet/page.tsx`: the line under "Prefer to write first?" in the
  Graph and Bookings branches. It shows only when `getSmsConfig()` returns
  a full configuration, not just when `SMS_MODE` is set, so the page never
  offers a number that would not answer. Not shown when neither booking
  mode works, since the link would lead to a page that cannot book.
- `docs/text-to-meet.md`: settings table; Twilio account, number, geo
  permissions; Messaging Service with the webhook and Advanced Opt-Out;
  the verification fields; Key Vault and app settings commands; switching
  on, with the live test; pausing; auth token rotation with
  `TWILIO_AUTH_TOKEN_PREVIOUS`; why the hash secret is never rotated and
  what rotating the link secret costs; placement codes; local checks; the
  App Insights events and exception steps to watch. No values.
- **Correction while writing:** the draft said the apex redirects to `www`.
  `https://spaarke.com/sms` answers 200 directly, so the guide now says the
  two hosts are different URLs to the signature check and to use `www` in
  both Twilio and `SMS_WEBHOOK_URL`.
- `.env.local.example`: every SMS setting, with the four table names marked
  for local checks only.
- `scripts/check-sms.mts`: one case for the line; 177 offline pass.
- Browser: with the program on (test settings), the line shows with the
  formatted number and the /sms link; with `SMS_MODE` unset it is gone and
  "Prefer to write first?" remains.
- `git grep` for the real number and an account SID pattern finds nothing.
- `npm run lint` reports 11 errors, all in files this project has not
  touched; every changed file lints clean.
