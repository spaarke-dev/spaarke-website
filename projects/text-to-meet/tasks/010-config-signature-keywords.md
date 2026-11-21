# Task 010: Config, signature check, keywords

**Phase:** 1 (Core library)
**Status:** completed (2026-11-21)
**Estimated:** 3 hours
**Dependencies:** none
**Tags:** typescript, api, config

## Goal

Three pure modules exist under `src/lib/sms/`, with no network or storage
calls: settings and placement codes, the Twilio signature check, and keyword
classification.

## Context

Spec FR-01, FR-04, FR-07 to FR-10, FR-17. Keeping Twilio's specifics in
`src/lib/sms/` means a later provider change touches only these files.

## Steps

1. `src/lib/sms/config.ts`:
   - `getSmsConfig()` reads `SMS_MODE`, `TWILIO_ACCOUNT_SID`,
     `TWILIO_AUTH_TOKEN`, `TWILIO_AUTH_TOKEN_PREVIOUS`, `SMS_WEBHOOK_URL`,
     `SMS_PUBLIC_NUMBER`, `SMS_LINK_SECRET`, `SMS_PHONE_HASH_SECRET`, and the
     two caps (defaults 30 and 150). Returns `null` unless `SMS_MODE` is
     `twilio` and every required value is present; logs which names are
     missing, never values. Pattern: `src/lib/meet/config.ts`.
   - `PLACEMENT_CODES`: a committed map from code to label (from task 001,
     or empty), and `placementLabel(code)`.
2. `src/lib/sms/twilio-signature.ts`:
   - `computeSignature(authToken, url, params)`: base64 HMAC-SHA1 over the
     URL followed by each parameter name and value, sorted by name.
   - `isValidSignature(header, url, params, tokens[])`: tries each token,
     compares with `timingSafeEqual` after a length check.
   - Takes params as `[name, value][]` from `URLSearchParams` so repeated
     names are kept.
3. `src/lib/sms/keywords.ts`: `classify(body, optOutType?)` returns
   `{ kind: "meet" | "stop" | "start" | "help" | "other", code?: string }`.
   - `OptOutType` from Advanced Opt-Out wins when present (STOP, START,
     HELP).
   - First word, trimmed, punctuation removed, case ignored: MEET (second
     word is the code, uppercased, kept only if it matches
     `^[A-Z0-9]{1,12}$`); STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, REVOKE,
     OPTOUT, QUIT; START, UNSTOP; HELP, INFO.
   - A longer message containing a stop word or "stop texting", "don't
     text", "remove me" is `stop` (FR-08).
   - Import `KEYWORD` from `messages.ts` rather than repeating "MEET".
4. `npm run typecheck` and `npm run lint`.
5. Verify acceptance criteria are met.
6. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/sms/config.ts`
- `src/lib/sms/twilio-signature.ts`
- `src/lib/sms/keywords.ts`

## Acceptance Criteria

- [x] No new runtime packages
- [x] `getSmsConfig()` is `null` with `SMS_MODE` unset
- [x] The signature check never reads `request.url`
- [x] "meet", " Meet! ", "MEET card2" classify as meet (code `CARD2` for the
      last); "please stop texting me" classifies as stop

## Notes

Take the signature test vector (URL, parameters, token, expected value) from
Twilio's webhook security page when writing task 012, not from memory.

### Done (2026-11-21)

- `src/lib/sms/config.ts`: `smsModeOn()`, `getSmsConfig()` (null unless
  `SMS_MODE=twilio` and every setting is valid; secrets must be 32
  characters or more, as `MEET_LINK_SECRET` must), `toE164()`,
  `PLACEMENT_CODES` (`CARD2`, `SIG` from the spec's Placement section,
  pending the owner's list in task 001), `resolvePlacement()`,
  `placementLabel()`.
- `src/lib/sms/twilio-signature.ts`: `signaturePayload()`,
  `computeSignature()`, `isValidSignature()` (any of the given tokens),
  `parseFormBody()`. Sorts by code unit, not locale.
- `src/lib/sms/keywords.ts`: `classify(body, optOutType)`.
- Cross-checked against Twilio's own library (`twilio@5.4.0`, installed in a
  scratch folder, not in the project): identical signatures for the docs
  example and for a form-encoded SMS body; 25 cases passed. Twilio's docs
  page gives the example's URL and parameters but no auth token, so the
  vector for task 012 is the library's output (see task 012 notes).
- **Decision, stop wins:** a stop word or plain-language revocation anywhere
  in a message makes it a stop, even after MEET, as FR-08 says. The cost is
  false positives: "Can we meet at the end of the week" contains END, so it
  gets no reply and the sender is marked opted out until START. Flagged for
  counsel with the FR-08 checklist item; narrowing the word list for longer
  messages is a one-line change in `keywords.ts`.
