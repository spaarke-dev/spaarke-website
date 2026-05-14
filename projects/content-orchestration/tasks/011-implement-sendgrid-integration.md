# Task 011: Implement SendGrid integration (multipart email)

**Phase:** 1 — Function logic
**Status:** not-started
**Estimated:** 30 minutes
**Dependencies:** 001
**Tags:** typescript, sendgrid, email, integration
**Parallel group:** **A** — runs alongside 010, 012, 013 after Phase 0

## Goal

Single function `sendDigest()` that wraps `@sendgrid/mail` with a
typed multipart-email signature. Designed to be reusable
(LinkedIn refresh function could adopt the same wrapper later).

## Context

Per [spec.md §3](../spec.md). The Function reads the SendGrid API
key + addresses from KV (the orchestrator handler does this); this
module just sends. Multipart (HTML + plain) per decision #6.

## Steps

1. Create `src/integrations/sendgrid.ts`.
2. Import `sgMail` from `@sendgrid/mail`.
3. Export interface `DigestEmail { to: string; from: string; subject: string; text: string; html: string; apiKey: string; }`.
4. Export `async function sendDigest(email: DigestEmail): Promise<void>`:
   - `sgMail.setApiKey(email.apiKey)`
   - `await sgMail.send({ to: email.to, from: email.from, subject: email.subject, text: email.text, html: email.html })`
   - On error: rethrow with a wrapped message including the SendGrid response body (helpful for "sender not verified" errors).
5. Don't memoize `sgMail.setApiKey` — the API key could change between calls if the operator rotates it; idempotent setter call is cheap.

## Expected Outputs

- `azure/functions/content-reminder/src/integrations/sendgrid.ts` (~50 lines)

## Acceptance Criteria

- [ ] `npm run build` exits 0.
- [ ] Smoke test with a real API key sends a test email to the operator.
- [ ] On an unverified `from` address: throws with `"SendGrid sender <addr> is not verified"`.
- [ ] No secret values appear in any thrown error message (only the from/to addresses are public).

## Notes

- Yes this could live in a shared `azure/shared/sendgrid.ts` and be used by both functions. **Don't extract yet.** Wait for the third caller. For v1, copy the small module into both function projects (same pattern as LinkedIn refresh's duplication of `linkedin-shared.ts`).
- Future: when `azure/shared/` exists, this becomes the seed.
