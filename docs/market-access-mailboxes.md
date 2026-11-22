# Market access mail sync: tenant setup

The market access admin area (`/admin`) logs email with known contacts by reading message metadata from a short list of mailboxes through Microsoft Graph. This guide covers the one-time tenant setup, the settings, and how to add or remove a mailbox later. The design is in [`projects/market-access/spec.md`](../projects/market-access/spec.md) (FR-07, FR-08, NFR-02, NFR-05).

**Ralph runs these steps, or asks Claude to run them with his sign-in** (first run: 2026-11-20). Nothing here goes into a committed file: the repository is public, so tenant IDs, app IDs, mailbox addresses and secrets live only in Key Vault, the static web app's settings, GitHub secrets and your own `.env.local`.

## What this sets up

- **The app:** the existing `/meet` booking app ("Spaarke website booking"). Mail sync reuses it, along with its tenant ID, client ID and client secret settings, so there is no new app registration and no new Graph secret.
- **Which mailboxes it can read:** only the members of a new mail-enabled security group, "Market access sync". At the start that is your mailbox and contactus@spaarke.com.
- **What it can do there:** `Application Mail.Read`, granted through Exchange RBAC for Applications on a management scope built from that group. The app's existing `Application Calendars.ReadWrite` assignment on the "Spaarke meet hosts" scope stays as it is. The two scopes are separate, so being a meet host does not grant mail read, and being synced does not grant calendar write.
- **Why no tenant-wide permission:** an Entra application permission such as `Mail.Read` applies to every mailbox in the tenant, and Exchange adds it to whatever the RBAC scope allows rather than narrowing it. The app must keep having no Microsoft Graph API permissions in Entra and no admin consent. Access comes only from Exchange.
- **What the sync reads:** sender, recipients, subject, time, message ID and the Outlook link. It never stores a body or attachment. The one exception is a non-delivery report, whose body is read only long enough to find the failed address.

The trade-off of reusing the app: the `/meet` client secret now opens mail read on the synced mailboxes as well as calendars, so a leak of that secret exposes both. Rotate it on the schedule in [`meet-graph-booking.md`](meet-graph-booking.md) section 7, and rotate it at once if it may have leaked.

## 1. Find the app and confirm it has no Graph permissions

Bash with the Azure CLI:

```bash
APP_ID=$(az ad app list --display-name "Spaarke website booking" --query "[0].appId" -o tsv)
echo "$APP_ID"

# Should print [] (no API permissions in Entra).
az ad app show --id "$APP_ID" --query requiredResourceAccess
```

If `requiredResourceAccess` is not empty, stop and remove those permissions first; otherwise the scope below would not limit anything.

## 2. Exchange RBAC for Applications

In Exchange Online PowerShell, as an Exchange administrator. The app's Exchange service principal already exists from the `/meet` setup, so there is no `New-ServicePrincipal` step.

```powershell
Connect-ExchangeOnline

# The group that decides which mailboxes the sync can read.
New-DistributionGroup -Name "Market access sync" -Type Security -Members <your mailbox address>, contactus@spaarke.com
$dn = (Get-Group "Market access sync").DistinguishedName

# Confirms the /meet service principal is there (one row).
Get-ServicePrincipal | Where-Object AppId -eq "<APP_ID>"

New-ManagementScope -Name "Market access sync" -RecipientRestrictionFilter "MemberOfGroup -eq '$dn'"
New-ManagementRoleAssignment -App <APP_ID> -Role "Application Mail.Read" -CustomResourceScope "Market access sync"
```

Run from a script or a background shell, `Connect-ExchangeOnline` can fail with "A window handle must be configured"; add `-DisableWAM` so it signs in through the browser. Device code sign-in (`-Device`) may be blocked by the tenant's sign-in policy.

Then check the result. `Test-ServicePrincipalAuthorization` lists every role the app holds, with `InScope` for the mailbox you name:

```powershell
# Application Mail.Read: InScope True for both synced mailboxes.
Test-ServicePrincipalAuthorization -Identity <APP_ID> -Resource contactus@spaarke.com
Test-ServicePrincipalAuthorization -Identity <APP_ID> -Resource <your mailbox address>

# Application Mail.Read: InScope False for anyone outside the group.
Test-ServicePrincipalAuthorization -Identity <APP_ID> -Resource <any other mailbox>
```

For contactus@spaarke.com, expect `Application Calendars.ReadWrite` to show `InScope False` unless it is also a meet host. That is correct: the two scopes do not overlap.

Role assignments can take up to two hours to apply. Until then Graph answers 403 `ErrorAccessDenied`, and `/admin/mailboxes` shows "This mailbox is not in the Exchange access scope yet."

contactus@spaarke.com is a normal user mailbox with only an Exchange license. It needs no Power Apps or other license, and Graph reads it like any other mailbox in the scope.

## 3. Settings

**Graph:** none to add. The sync reads the settings `/meet` already has: `MEET_GRAPH_TENANT_ID`, `MEET_GRAPH_CLIENT_ID` and `MEET_GRAPH_CLIENT_SECRET`.

**Sync token:** a GitHub Actions schedule calls `POST /api/market/sync` every 30 minutes with a bearer token, the same way the daily report works. Create it once, give it to the site and to GitHub:

```bash
az keyvault secret set --vault-name <vault> --name market-sync-token --output none \
  --value "$(openssl rand -base64 48)"
TOKEN="$(az keyvault secret show --vault-name <vault> --name market-sync-token --query value -o tsv)"

az staticwebapp appsettings set -n <static-web-app> --setting-names MA_SYNC_TOKEN="$TOKEN" --output none
printf '%s' "$TOKEN" | gh secret set MA_SYNC_TOKEN --repo spaarke-dev/spaarke-website
unset TOKEN
```

The route and the schedule arrive with task 042. Until then the token sits unused, and without it the route answers 503.

For a local test, put the same three `MEET_GRAPH_*` values in `.env.local`. Then `npm run market:mail -- <mailbox> [hours]` prints message counts per folder for one mailbox, never content. A mailbox outside the scope prints `NoMailboxAccess`.

## 4. Adding a mailbox later

1. Add it to the group:

   ```powershell
   Add-DistributionGroupMember -Identity "Market access sync" -Member <mailbox address>
   Test-ServicePrincipalAuthorization -Identity <APP_ID> -Resource <mailbox address>
   ```

2. Wait until `Application Mail.Read` shows `InScope True`; group changes usually apply within an hour.
3. Register it at `/admin/mailboxes`. Choose its mode there: `known-only` logs mail only with existing contacts (right for a personal mailbox), and `capture-new` also queues mail from new senders for triage (right for a team inbox).

If you register it before the change applies, the registry shows "This mailbox is not in the Exchange access scope yet," and the sync skips it without affecting the other mailboxes. It picks up on the next run once access applies.

## 5. Removing a mailbox

Activities already logged from the mailbox stay on their contacts; removing it only stops new ones.

1. Pause or remove it at `/admin/mailboxes`, so the sync stops asking for it.
2. Remove it from the group:

   ```powershell
   Remove-DistributionGroupMember -Identity "Market access sync" -Member <mailbox address> -Confirm:$false
   ```

## 6. Turning mail read off entirely

This removes only the mail role. `/meet` keeps working, since its calendar assignment is untouched.

```powershell
Get-ManagementRoleAssignment -RoleAssignee <APP_ID> |
  Where-Object Role -eq "Application Mail.Read" |
  Remove-ManagementRoleAssignment -Confirm:$false
```

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| A mailbox shows "not in the Exchange access scope yet" | It is not in the group, or the change has not applied (up to two hours for a new assignment, about an hour for a group change) |
| Graph 401 for every mailbox | The `/meet` client secret expired or was rotated without updating `MEET_GRAPH_CLIENT_SECRET`; `/meet` would show the fallback too |
| The sync run fails with 401 | `MA_SYNC_TOKEN` differs between the app settings and the GitHub secret |
| The sync run fails with 503 | `MA_SYNC_TOKEN` is not set in the app settings |
| A mailbox outside the group can be read | The app has an Entra Graph permission; check step 1 |
