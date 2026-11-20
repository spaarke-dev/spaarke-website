# Task 003: Exchange and app setup instructions

**Phase:** 0 (Foundations)
**Status:** instructions written (PR pending merge); waiting on Ralph to run them
**Estimated:** 2 hours (writing); Ralph runs the steps
**Dependencies:** none (open question 1 is answered first)
**Tags:** azure, config, deploy

## Goal

`docs/market-access-mailboxes.md` holds every tenant step Ralph runs for mail sync, written so he can paste each block, plus the two-step runbook for adding a mailbox later. Claude writes the instructions and does not run any tenant admin change.

## Context

FR-07, FR-08, NFR-02, NFR-05 and the Dependencies section of the spec. The pattern is `docs/meet-graph-booking.md` sections 1 to 3: an app with no Entra Graph permissions and no admin consent, access granted only through Exchange RBAC for Applications, scoped by a mail-enabled security group.

**Raise open question 1 with Ralph before writing:** reuse the `/meet` Graph app, or register a separate app? The plan recommends a separate app.

## Steps

1. Ask Ralph open question 1 and record the answer in `spec.md` (Owner Clarifications) and `current-task.md`.
2. Write `docs/market-access-mailboxes.md` with these sections:
   1. **What this sets up**, and why there is no tenant-wide mail permission.
   2. **App registration** (skip if reusing `/meet`): `az ad app create` single tenant, `az ad sp create`, no Graph permissions, no consent.
   3. **Secret in Key Vault**: created straight into the vault, with the expiry reminder.
   4. **Exchange RBAC for Applications** (Exchange Online PowerShell, as an Exchange administrator):
      - `New-DistributionGroup -Name "Market access sync" -Type Security -Members <Ralph's mailbox>, contactus@spaarke.com`;
      - `New-ServicePrincipal` (skip if the `/meet` app already has one);
      - `New-ManagementScope -Name "Market access sync" -RecipientRestrictionFilter "MemberOfGroup -eq '<group DN>'"`;
      - `New-ManagementRoleAssignment -App <APP_ID> -Role "Application Mail.Read" -CustomResourceScope "Market access sync"`;
      - `Test-ServicePrincipalAuthorization` for a synced mailbox (InScope True) and another mailbox (False).
      - Allow up to two hours for the assignment to apply.
   5. **App settings**: the names the code reads (`MA_GRAPH_TENANT_ID`, `MA_GRAPH_CLIENT_ID`, `MA_GRAPH_CLIENT_SECRET`, or the `/meet` names if reused) and `MA_SYNC_TOKEN`, set with `az staticwebapp appsettings set`; the GitHub secret with `gh secret set MA_SYNC_TOKEN`.
   6. **Adding a mailbox later**: add it to the group (`Add-DistributionGroupMember`), wait up to an hour, then register it at `/admin/mailboxes`. What the "no access" error looks like until then.
   7. **Removing a mailbox**: pause or remove it at `/admin/mailboxes`, then remove it from the group.
   8. **Note on contactus@spaarke.com**: a normal user mailbox with only an Exchange license; no Power Apps or other license is needed.
3. Use placeholders for every address except contactus@spaarke.com, and for every ID.
4. Run `npm run voice:lint` on the doc if it covers `docs/`; otherwise check by hand for em dashes and British spellings.
5. PR through `push-to-github`. After merge, tell Ralph the doc is ready to run, and record in `current-task.md` when he has run it (task 040 waits on it).

## Expected outputs

- `docs/market-access-mailboxes.md`
- `spec.md` Owner Clarifications row for open question 1

## Acceptance criteria

- [ ] Every command block can be pasted with only placeholders replaced.
- [ ] No tenant ID, app ID, personal mailbox address or secret is in the doc.
- [ ] The doc says plainly that Claude does not run these steps.
- [ ] Ralph confirms he has run them (recorded in `current-task.md`).

## Notes

- If the `/meet` app is reused, the new role assignment sits beside its existing `Application Calendars.ReadWrite` assignment on the "Spaarke meet hosts" scope; the mail scope is still its own group.
- Spec references: FR-07, FR-08, NFR-02, NFR-05, Dependencies.

## As built

- Open question 1 answered 2026-11-19: reuse the `/meet` app. The doc therefore skips app registration, the new secret and `New-ServicePrincipal`, and adds a check that the app still has no Entra Graph permissions.
- The sync reads `MEET_GRAPH_TENANT_ID`, `MEET_GRAPH_CLIENT_ID` and `MEET_GRAPH_CLIENT_SECRET`; the only new setting is `MA_SYNC_TOKEN`.
- The doc names the task 040 check script `npm run market:mail`.
