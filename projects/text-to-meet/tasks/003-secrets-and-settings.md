# Task 003: Secrets and app settings

**Phase:** 0 (Decisions and setup)
**Status:** not-started
**Estimated:** 1 hour
**Dependencies:** none (the Twilio values need 002)
**Tags:** azure, keyvault, swa, config

## Goal

Every setting in spec "External Dependencies" exists in Key Vault
`sprk-demo-kv` and the `swa-spaarke-website` app settings, except
`SMS_MODE`, which stays unset until task 041.

## Context

Same pattern as the /meet Graph secrets (PR #142). With `SMS_MODE` unset the
route returns 404, so setting the rest early changes nothing on the site.

## Steps

1. Generate `SMS_LINK_SECRET` and `SMS_PHONE_HASH_SECRET` (32 random bytes,
   base64url each) and store them in Key Vault as `sms-link-secret` and
   `sms-phone-hash-secret`. Never print the values.
2. Store `TWILIO_AUTH_TOKEN` as `twilio-auth-token` (owner copies it from the
   Console). `TWILIO_ACCOUNT_SID` is not secret but stays out of the repo.
3. Set on `swa-spaarke-website`: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
   `SMS_LINK_SECRET`, `SMS_PHONE_HASH_SECRET`,
   `SMS_WEBHOOK_URL=https://spaarke.com/api/sms/inbound` (match the host
   Twilio will call exactly), `SMS_REPLY_HOURLY_CAP=30`,
   `SMS_REPLY_DAILY_CAP=150`. `SMS_PUBLIC_NUMBER` is already set.
4. Confirm `SMS_MODE` is not set.
5. Record the setting names (not values) and the Key Vault secret names in
   `docs/text-to-meet.md` when task 032 writes it.
6. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- Key Vault secrets and SWA app settings (nothing committed)

## Acceptance Criteria

- [ ] All settings present on the SWA, `SMS_MODE` absent
- [ ] `SMS_PHONE_HASH_SECRET` noted as never rotated (rotating it splits
      every sender's history)
- [ ] No value printed in the session or committed

## Notes

Decide the webhook host once: `https://spaarke.com` or
`https://www.spaarke.com`. The site redirects one to the other, and Twilio
does not follow redirects on a webhook POST, so the setting and the Twilio
webhook URL must both name the host that answers directly. Check with
`curl -I` before setting it.
