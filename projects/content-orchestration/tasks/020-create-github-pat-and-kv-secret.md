# Task 020: Create fine-grained GitHub PAT + populate KV secret

**Phase:** 2 — Azure provisioning + deploy
**Status:** not-started
**Estimated:** 10 minutes
**Dependencies:** none (operator action — can run anytime before task 023)
**Tags:** github, security, kv, manual

## Goal

A fine-grained GitHub PAT exists with `Contents: Read` permission on
`spaarke-dev/spaarke-website` only, stored in KV as
`github-token-readonly`.

## Context

Per [spec.md §3.4](../spec.md) and decision #4. The function reads
the calendar via this token. Fine-grained PAT (not classic) so the
blast radius is one permission on one repo.

## Steps

**Operator-only — Claude Code can't create the PAT for you.**

1. Go to https://github.com/settings/personal-access-tokens?type=beta (Fine-grained PATs).
2. Click **Generate new token**.
3. Settings:
   - **Token name**: `spaarke-content-reminder`
   - **Expiration**: 90 days (or whatever your security policy allows). Mark a calendar reminder to rotate before expiry.
   - **Repository access**: **Only select repositories** → pick `spaarke-dev/spaarke-website` only.
   - **Repository permissions**:
     - **Contents**: **Read-only**
     - All other permissions: **No access**
4. **Generate token**. Copy the value — GitHub only shows it once.
5. Store in KV (from your PowerShell or Bash terminal):

   ```bash
   az keyvault secret set \
     --vault-name sprk-demo-kv \
     --name github-token-readonly \
     --value "<paste the PAT here>"
   ```

6. Verify the secret is set:

   ```bash
   az keyvault secret show \
     --vault-name sprk-demo-kv \
     --name github-token-readonly \
     --query "{name: name, created: attributes.created}" -o table
   ```

7. **Do not paste the PAT value into chat.** Add it directly via the terminal.

## Expected Outputs

- One new fine-grained PAT visible in your GitHub settings
- One new KV secret `github-token-readonly` in `sprk-demo-kv`

## Acceptance Criteria

- [ ] PAT shows in GitHub's Fine-grained tokens list under "spaarke-content-reminder".
- [ ] KV `secret show` returns the secret (don't print the value).
- [ ] PAT's permissions are exactly `Contents: Read` on `spaarke-dev/spaarke-website` — no other permission, no other repo.
- [ ] PAT expiry date is on your calendar to rotate.

## Notes

- The function's `checkPatExpiry` call (task 010) will warn the operator via the daily digest footer when the PAT is within 14 days of expiring. So you'll have advance notice; you don't have to remember.
- If you ever want to revoke: GitHub settings → Fine-grained tokens → click the token → Revoke. The function will start logging 401 errors on the next run.
