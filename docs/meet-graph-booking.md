# /meet Graph booking: setup and operation

The /meet page can book meetings directly on a host's Microsoft 365 calendar
through Microsoft Graph, instead of embedding a Microsoft Bookings page. This
guide covers the one-time tenant setup, the app settings, local testing, the
switch from the embed to Graph, and secret rotation. The design is in
[`projects/meet-graph-booking/spec.md`](../projects/meet-graph-booking/spec.md).

Nothing in this guide goes into a committed file. The repository is public:
tenant IDs, client IDs, mailbox addresses, and secrets live only in Key Vault,
the static web app's settings, and your own `.env.local`.

## How it works

1. `/meet` asks Graph (`getSchedule`) for the host's busy time over the
   booking window and shows the open slots in the visitor's time zone.
2. The visitor picks a slot and enters their details.
3. `/api/meet/book` checks the honeypot, the rate limit, and reCAPTCHA, then
   claims the slot with a row in `MeetingSlotLocks`, asks Graph again whether
   the slot is still free, writes the booking to `MeetingBookings`, and creates
   the event on the host's calendar with a Teams link. Graph sends the
   invitation. SendGrid emails the team.
4. The invitation carries a signed link to `/meet/manage`, where the visitor
   can move or cancel the meeting.

## Settings

| Setting | Required | Default | Notes |
|---|---|---|---|
| `MEET_BOOKING_MODE` | | `bookings` | `graph` switches /meet to the Graph flow |
| `MEET_GRAPH_TENANT_ID` | yes | | Directory (tenant) ID |
| `MEET_GRAPH_CLIENT_ID` | yes | | Application (client) ID of the app registration |
| `MEET_GRAPH_CLIENT_SECRET` | yes | | From Key Vault, see below |
| `MEET_HOST` | yes | | The host mailbox address; the meeting organizer |
| `MEET_LINK_SECRET` | yes | | At least 32 characters; signs the manage links |
| `MEET_HOST_TIME_ZONE` | | `America/New_York` | IANA zone the business hours are in |
| `MEET_BUSINESS_HOURS` | | `09:00-17:00` | In the host zone |
| `MEET_BUSINESS_DAYS` | | `1,2,3,4,5` | 0 is Sunday |
| `MEET_DURATION_MINUTES` | | `30` | |
| `MEET_BUFFER_MINUTES` | | `15` | Clear time on each side of a meeting |
| `MEET_MIN_NOTICE_HOURS` | | `24` | |
| `MEET_WINDOW_DAYS` | | `21` | |
| `MEET_BOOKINGS_TABLE` | | `MeetingBookings` | Override for testing |
| `MEET_LOCKS_TABLE` | | `MeetingSlotLocks` | Override for testing |

The flow also uses the site's existing `STORAGE_ACCOUNT_CONNECTION`,
`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `CONTACT_EMAIL_TO`,
`RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, and `SITE_URL`. Storage is
required: without it the page falls back to the embed rather than book
without slot locks.

## 1. App registration

Run as someone who can create app registrations. Bash with the Azure CLI:

```bash
APP_ID=$(az ad app create --display-name "Spaarke website booking" \
  --sign-in-audience AzureADMyOrg --query appId -o tsv)
az ad sp create --id "$APP_ID" --output none
SP_OBJECT_ID=$(az ad sp show --id "$APP_ID" --query id -o tsv)
echo "$APP_ID $SP_OBJECT_ID"
```

Do **not** add Microsoft Graph API permissions to the app in Entra, and do not
grant admin consent. An Entra application permission such as
`Calendars.ReadWrite` applies to every mailbox in the tenant, and Exchange adds
it to whatever the RBAC scope allows rather than narrowing it. Access comes
only from the Exchange role assignment in step 3.

## 2. Secrets in Key Vault

Create the client secret straight into Key Vault, so it never prints:

```bash
az keyvault secret set --vault-name <vault> --name meet-graph-client-secret --output none \
  --value "$(az ad app credential reset --id "$APP_ID" --display-name meet-booking \
     --years 1 --append --query password -o tsv)"

az keyvault secret set --vault-name <vault> --name meet-link-secret --output none \
  --value "$(openssl rand -base64 48)"
```

Note the secret's expiry date (one year) and put a rotation reminder on the
calendar for two weeks before it.

## 3. Exchange RBAC for Applications

Limit the app to the host mailbox. In Exchange Online PowerShell, as an
Exchange administrator:

```powershell
Connect-ExchangeOnline

# A mail-enabled security group that holds the host mailbox. Adding a host
# later is then a group change, not a new scope.
New-DistributionGroup -Name "Spaarke meet hosts" -Type Security -Members <host address>
$dn = (Get-Group "Spaarke meet hosts").DistinguishedName

New-ServicePrincipal -AppId <APP_ID> -ObjectId <SP_OBJECT_ID> -DisplayName "Spaarke website booking"
New-ManagementScope -Name "Spaarke meet hosts" -RecipientRestrictionFilter "MemberOfGroup -eq '$dn'"
New-ManagementRoleAssignment -App <APP_ID> -Role "Application Calendars.ReadWrite" -CustomResourceScope "Spaarke meet hosts"

# InScope should be True for the host and False for anyone else.
Test-ServicePrincipalAuthorization -Identity <APP_ID> -Resource <host address>
Test-ServicePrincipalAuthorization -Identity <APP_ID> -Resource <any other mailbox>
```

Role assignments can take up to two hours to apply. Until then Graph answers
403 `ErrorAccessDenied`.

The host mailbox needs a Teams license, or the event is created without a
Teams link.

## 4. Local test against a test mailbox

Use a test mailbox as `MEET_HOST` (in the same scope), and separate tables so
nothing touches the live ones. In `.env.local`:

```
SITE_URL=http://localhost:3000
MEET_BOOKING_MODE=graph
MEET_GRAPH_TENANT_ID=<tenant id>
MEET_GRAPH_CLIENT_ID=<APP_ID>
MEET_GRAPH_CLIENT_SECRET=<from Key Vault>
MEET_HOST=<test mailbox>
MEET_LINK_SECRET=<from Key Vault, or any 32+ characters for local use>
STORAGE_ACCOUNT_CONNECTION=<connection string>
MEET_BOOKINGS_TABLE=MeetingBookingsDev
MEET_LOCKS_TABLE=MeetingSlotLocksDev
```

Then `npm run dev` and check, against the test mailbox's calendar:

- [ ] /meet shows slots, and a meeting added in Outlook removes its slot and
      the buffer on each side within a minute.
- [ ] A booking creates one event with a Teams link and one invitation to the
      visitor address, a `MeetingBookingsDev` row with status `booked`, and a
      team email (when SendGrid is set).
- [ ] Blocking the chosen slot in Outlook after the picker loads, then booking
      it, is refused with "Someone just took that time."
- [ ] The invitation's link moves the meeting (same Teams link, update sent)
      and cancels it (cancellation sent, row `cancelled`).
- [ ] A Graph call against a mailbox outside the scope fails with 403.

Without a tenant, `MEET_DEV_MOCK=1` with `MEET_BOOKING_MODE=graph` runs the
whole flow against an in-memory calendar and table under `npm run dev`. A
production build ignores it.

`npm run meet:check` runs the slot, time zone, and manage link checks.

## 5. App settings and cutover

Copy the values into the static web app. Every other secret on the site is a
plain app setting too; Key Vault stays the record.

```bash
az staticwebapp appsettings set -n <static-web-app> --setting-names \
  MEET_GRAPH_TENANT_ID=<tenant id> \
  MEET_GRAPH_CLIENT_ID="$APP_ID" \
  MEET_HOST=<host address> \
  MEET_GRAPH_CLIENT_SECRET="$(az keyvault secret show --vault-name <vault> --name meet-graph-client-secret --query value -o tsv)" \
  MEET_LINK_SECRET="$(az keyvault secret show --vault-name <vault> --name meet-link-secret --query value -o tsv)" \
  --output none
```

With those set and `MEET_BOOKING_MODE` unset, production still shows the
Bookings embed. To switch:

```bash
az staticwebapp appsettings set -n <static-web-app> --setting-names MEET_BOOKING_MODE=graph --output none
```

To roll back, delete `MEET_BOOKING_MODE`. Manage links already sent keep
working, because `/meet/manage` and its API routes need only the Graph
settings, not the mode.

The page also falls back on its own, per request: to the embed (when
`BOOKINGS_PAGE_URL` is set) or to /contact, whenever a Graph setting or storage
is missing or Graph fails to answer. App Insights records each fallback as an
exception with `step: meet.page`.

## 6. Rotating the client secret

```bash
az keyvault secret set --vault-name <vault> --name meet-graph-client-secret --output none \
  --value "$(az ad app credential reset --id <APP_ID> --display-name meet-booking \
     --years 1 --append --query password -o tsv)"
az staticwebapp appsettings set -n <static-web-app> --setting-names \
  MEET_GRAPH_CLIENT_SECRET="$(az keyvault secret show --vault-name <vault> --name meet-graph-client-secret --query value -o tsv)" \
  --output none
```

`--append` keeps the old secret valid until you remove it, so there is no gap.
Once /meet shows slots again, remove the old credential with
`az ad app credential delete --id <APP_ID> --key-id <old key id>`
(`az ad app credential list --id <APP_ID>` shows the key IDs).

Rotating `MEET_LINK_SECRET` invalidates every manage link already sent. Do it
only if the secret leaks.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| /meet shows the embed with `MEET_BOOKING_MODE=graph` | A required setting or storage is missing, or Graph failed; see App Insights `meet.page` |
| Graph 403 `ErrorAccessDenied` | Role assignment not applied yet (up to two hours), or the host is outside the scope |
| Graph 401 | Wrong tenant or client ID, or the secret expired |
| Event has no Teams link | The host mailbox has no Teams license |
| Manage link says "We could not find this meeting" | The booking row is missing; the team email for that booking says NOT SAVED |
