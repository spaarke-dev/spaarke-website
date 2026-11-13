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
   can move or cancel the meeting and add or remove guests.
5. SendGrid sends the visitor a branded confirmation, and the visitor and
   their guests reminders 24 hours and 1 hour before, plus a notice if the
   meeting moves or is cancelled. A Logic App calls `/api/meet/reminders`
   every five minutes to send the reminders that are due (section 6). The
   design is in
   [`projects/meet-emails-guests/spec.md`](../projects/meet-emails-guests/spec.md).

## Settings

| Setting | Required | Default | Notes |
|---|---|---|---|
| `MEET_BOOKING_MODE` | | `bookings` | `graph` switches /meet to the Graph flow |
| `MEET_GRAPH_TENANT_ID` | yes | | Directory (tenant) ID |
| `MEET_GRAPH_CLIENT_ID` | yes | | Application (client) ID of the app registration |
| `MEET_GRAPH_CLIENT_SECRET` | yes | | From Key Vault, see below |
| `MEET_HOST` | yes | | The host mailbox address; the meeting organizer |
| `MEET_LINK_SECRET` | yes | | At least 32 characters; signs the manage links |
| `MEET_CRON_SECRET` | for reminders | | At least 32 characters; the Logic App's bearer token. Without it `/api/meet/reminders` answers 404 |
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

`npm run meet:check` runs the slot, time zone, manage link, reminder timing, guest, and email checks.

`npm run meet:graph` checks the live tenant from `.env.local` without
printing secrets:

- `access --outside <mailbox>`: the host's schedule reads, and a mailbox
  outside the scope gets 403.
- `block <ISO start> [minutes]` and `unblock <event id>`: create and delete
  a plain busy event for the "meeting added in Outlook" check.
- `event <event id>`: an event's time, attendees, and a hash of its Teams
  link, to confirm a move kept the same link.

Last run against the real host on 2026-11-13: every item in the checklist
passed, and the test meetings were cancelled afterward.

The emails, guests, and reminders were tested the same way on 2026-11-13: a
booking with one guest, a guest removed and added back from the manage page,
the 1-hour reminder sent once when two reminder runs started at the same
moment, and a cancellation from the manage page.

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

## 6. Reminder emails

The site cannot run on a timer, so a Logic App (Consumption plan) in the
website's resource group calls `POST /api/meet/reminders` every five minutes
with `Authorization: Bearer <MEET_CRON_SECRET>`. Each call sends the
reminders that are due and answers with counts:
`{ ok, checked, sent, skipped, failed }`. Reminders have windows (24 hours
before until 20; 60 minutes before until 10), so a missed run is harmless,
and each is claimed on its booking row before it is sent, so two runs at once
never send it twice.

Create the secret, give it to the site, and create the Logic App:

```bash
az keyvault secret set --vault-name <vault> --name meet-cron-secret --output none \
  --value "$(openssl rand -base64 48)"
CRON="$(az keyvault secret show --vault-name <vault> --name meet-cron-secret --query value -o tsv)"
az staticwebapp appsettings set -n <static-web-app> --setting-names MEET_CRON_SECRET="$CRON" --output none

az extension add --name logic --yes
az logic workflow create -g <resource group> -n logic-spaarke-meet-reminders \
  --location <region> --definition reminders-workflow.json
```

`reminders-workflow.json` is written at setup time (it holds the secret, so it
is never committed) from this shape, with the secret in `parameters`:

```json
{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "endpoint": { "type": "String" },
      "cronSecret": { "type": "SecureString" }
    },
    "triggers": {
      "Every_5_minutes": { "type": "Recurrence", "recurrence": { "frequency": "Minute", "interval": 5 } }
    },
    "actions": {
      "Send_due_reminders": {
        "type": "Http",
        "inputs": {
          "method": "POST",
          "uri": "@parameters('endpoint')",
          "headers": { "Authorization": "@{concat('Bearer ', parameters('cronSecret'))}" }
        },
        "limit": { "timeout": "PT1M" },
        "runtimeConfiguration": { "secureData": { "properties": ["inputs"] } }
      }
    },
    "outputs": {}
  },
  "parameters": {
    "endpoint": { "value": "https://www.spaarke.com/api/meet/reminders" },
    "cronSecret": { "value": "<the secret>" }
  }
}
```

`secureData` keeps the header out of the run history. Delete the file after
the create. To pause reminders, disable the workflow
(`az logic workflow update -g <resource group> -n logic-spaarke-meet-reminders --state Disabled`).

To look at the emails while working on them, run `npm run dev` and open
`/api/meet/dev/email-preview?type=confirmation&as=booker`. `type` is one of
`confirmation`, `reminder24`, `reminder1`, `moved`, `cancelled`; `as` is
`booker` or `guest`; `format=text` shows the plain-text part. The route
answers 404 outside development.

## 7. Rotating the client secret

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
| No confirmation or reminder emails | `SENDGRID_API_KEY` or `SENDGRID_FROM_EMAIL` missing; App Insights event `meet.visitor_email_failed` |
| No reminders at all | The Logic App is disabled or failing (its run history), or `MEET_CRON_SECRET` differs between it and the site (401s) |
| A guest got no invitation | Exchange sends it; check the address on the manage page. Guests are not sent the branded confirmation, only the reminders |
