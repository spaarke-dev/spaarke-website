# Task 023: SendGrid alerting on refresh failures

**Phase:** 2 — Azure Function refresh loop
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** 020 (function scaffold must exist)
**Tags:** sendgrid, alerting, notifications, email
**Parallel group:** **B** — runs alongside 021 and 022 after 020

## Goal

When the refresh function fails (revoked refresh token, API down,
unexpected error), the operator gets an email with a clear next
step. Weekly summary email regardless of outcome.

## Context

Per [spec §10 #6](../spec.md), SendGrid is the alerting path
because it's already a site dependency (contact form). The KV
already has a SendGrid API key (`SendGrid-ApiKey` — verify name in
KV; might be different). The function reads the key from KV and
sends from `noreply@spaarke.com` to the operator's address.

## Steps

1. Verify the SendGrid API key secret name in KV:
   ```bash
   az keyvault secret list --vault-name sprk-demo-kv -o table | grep -i sendgrid
   ```
   If it doesn't exist, create one and update the contact-form code to use it as well (out of scope here; flag to operator).
2. Add operator email + sender email to KV as new secrets (if not present):
   - `notification-email-operator` — operator's email
   - `notification-email-from` — `noreply@spaarke.com`
3. Add `@sendgrid/mail` to the Function's `package.json` (already in the site deps, but Functions is self-contained per task 020).
4. Create `azure/functions/linkedin-token-refresh/src/notify.ts`:
   ```ts
   import sgMail from '@sendgrid/mail';
   import { getSecretClient } from './linkedin/linkedin-shared';

   export async function notifyOnResults(results: RefreshResult[]) {
     const failures = results.filter(r => r.outcome === 'failed');
     const isWeeklySummary = new Date().getUTCDay() === 1; // Mondays

     if (failures.length === 0 && !isWeeklySummary) return;

     // ... fetch SendGrid key + addresses from KV, build email, send.
   }
   ```
5. Email content:
   - **Failure email subject**: `[LinkedIn refresh] <app> token refresh failed`
   - **Body**: error message + remediation step (e.g., "Run `npm run linkedin:auth --app=member` from your dev machine.")
   - **Weekly summary subject**: `[LinkedIn refresh] Weekly health: member=<N>d, org=<M>d`
   - **Body**: token expiry status for both apps.
6. Wire `notifyOnResults` into `refresh/index.ts` (the stub from task 021).
7. Test by faking a failure: set `linkedin-member-refresh-token` to garbage in a non-production scope, invoke the function locally, confirm email arrives.

## Expected Outputs

- `azure/functions/linkedin-token-refresh/src/notify.ts` — ~120 lines
- Updated `refresh/index.ts` — calls `notifyOnResults(results)`
- Two new KV secrets if absent: `notification-email-operator`, `notification-email-from`

## Acceptance Criteria

- [ ] Forced failure → operator receives email within 1 min of function execution.
- [ ] Monday weekly summary → email arrives with both apps' expiry status.
- [ ] No failure & not Monday → no email (no noise).
- [ ] Email never contains the actual refresh token, access token, or client secret. Only days-until-expiry and app name.

## Notes

- Verify SendGrid sender authentication is set up for `noreply@spaarke.com` — if not, an unverified-sender email won't deliver.
- Don't use SendGrid templates — keep the email body inline so the function is self-contained.
- A "soft warn at 14 days" email could be added later; for v1 the 7-day refresh window already prevents this case.
