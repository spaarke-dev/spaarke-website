# Task 011: SMS link token and phone hash

**Phase:** 1 (Core library)
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 010
**Tags:** typescript, security

## Goal

`createSmsToken` and `verifySmsToken` sit beside the manage token in
`src/lib/meet/tokens.ts`, and `src/lib/sms/phone-hash.ts` turns an E.164
number into a keyed hash.

## Context

Spec FR-13 and FR-15. The token carries a conversation, never personal data.
The keyed hash is used because an unkeyed hash of a US number can be
reversed by trying every number.

## Steps

1. In `tokens.ts`:
   - `newConversationId()`: 9 random bytes, base64url (12 characters).
   - `createSmsToken(conversationId, secret, now)`:
     `<id>.<exp base36>.<sig>`, where `sig` is HMAC-SHA256 over
     `sms.<id>.<exp>`, cut to 16 bytes, base64url (22 characters). Lifetime
     30 days.
   - `verifySmsToken(token, secret, now)`: returns the same `TokenCheck`
     shape as `verifyManageToken`, with `conversationId`. Constant-time
     compare, length cap, ID pattern `^[A-Za-z0-9_-]{12}$`.
   - The `sms.` prefix means neither token type verifies as the other.
2. `src/lib/sms/phone-hash.ts`: `normalizeE164(from)` (accepts `+1` and ten
   digits only, else `null`) and `phoneHash(e164, secret)`: HMAC-SHA256,
   hex, first 32 characters.
3. Confirm the token is 42 characters, so the MEET reply stays at 216
   characters on `https://spaarke.com`.
4. `npm run typecheck`, `npm run lint`.
5. Verify acceptance criteria are met.
6. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/lib/meet/tokens.ts`: SMS token functions added
- `src/lib/sms/phone-hash.ts`

## Acceptance Criteria

- [ ] Round trip, tampered signature, tampered ID, expired, and manage token
      presented as SMS token (and the reverse) all behave as specified
- [ ] Token length is 42
- [ ] `phoneHash` output never contains the input digits in readable form

## Notes

`SMS_LINK_SECRET` is separate from `MEET_LINK_SECRET` so the flow works in
Bookings mode, where the Graph settings are absent.
