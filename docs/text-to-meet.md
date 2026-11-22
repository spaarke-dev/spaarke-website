# Text MEET: setup and operation

A person texts MEET to Spaarke's toll-free number and gets one reply with a
link to `/meet`, where they book a meeting. This guide covers the Twilio
setup from a new account, the toll-free verification, the secrets and app
settings, switching the program on and off, rotation, and what to watch. The
design is in [`projects/text-to-meet/spec.md`](../projects/text-to-meet/spec.md).

Nothing in this guide goes into a committed file. The repository is public:
the phone number, the Twilio account SID, the auth token, and the secrets
live only in Twilio, Key Vault, the static web app's settings, and your own
`.env.local`.

## How it works

1. Twilio receives the text on the toll-free number and posts it to
   `/api/sms/inbound`, signed with the account's auth token.
2. The route checks the signature against `SMS_WEBHOOK_URL`, checks that the
   account and the number are ours, records the message ID so a retry never
   gets a second reply, and drops senders outside the US and Canada.
3. MEET (with an optional placement code, as in "MEET CARD2") gets one reply
   with a signed link, at most three a day per number. Any other text gets
   one short nudge a day. STOP, START, and HELP are answered by Twilio, so
   the route records them and stays silent.
4. The link opens `/meet?c=<token>` with a welcome line. A booking made
   through it is tied to the text, and the team email says "Came from a text
   (MEET, <code>)".

The readable phone number is never stored, logged, or emailed. It is
reduced on arrival to a keyed hash (`SMS_PHONE_HASH_SECRET`).

## Settings

| Setting | Required | Default | Notes |
|---|---|---|---|
| `SMS_MODE` | yes | | `twilio` switches the program on. Unset, the route answers 404 and /meet shows no "Prefer to text?" line |
| `TWILIO_ACCOUNT_SID` | yes | | The account SID; requests from any other account get 403 |
| `TWILIO_AUTH_TOKEN` | yes | | The primary auth token; verifies Twilio's signature. From Key Vault |
| `TWILIO_AUTH_TOKEN_PREVIOUS` | during rotation | | The old token, accepted alongside the new one until the swap is done |
| `SMS_WEBHOOK_URL` | yes | | The exact URL set in Twilio, `https://www.spaarke.com/api/sms/inbound`. Twilio signs this URL, so it must match character for character |
| `SMS_PUBLIC_NUMBER` | yes | | The toll-free number, any common format. Also shown on /sms and /meet |
| `SMS_LINK_SECRET` | yes | | At least 32 characters; signs the links in replies. From Key Vault |
| `SMS_PHONE_HASH_SECRET` | yes | | At least 32 characters; keys the phone hash. From Key Vault. Never rotated |
| `SMS_REPLY_HOURLY_CAP` | | 30 | Replies per UTC clock hour, site-wide |
| `SMS_REPLY_DAILY_CAP` | | 150 | Replies per UTC day, site-wide |
| `STORAGE_ACCOUNT_CONNECTION` | yes | | Already set for the site. Without it the route replies to nothing |
| `SITE_URL` | | `https://www.spaarke.com` | The base of the link in the reply |
| `CONTACT_EMAIL_TO`, SendGrid settings | | | Already set; the cap alert goes here |
| `SMS_SENDERS_TABLE`, `SMS_CONVERSATIONS_TABLE`, `SMS_INBOUND_TABLE`, `SMS_COUNTERS_TABLE` | | `SmsSenders`, `SmsConversations`, `SmsInbound`, `SmsCounters` | Local checks only. Leave unset in Azure |

If `SMS_MODE` is `twilio` but a required setting is missing or a secret is
too short, the route answers 404 and logs the names (never the values) of
what is missing.

## 1. Twilio account and number

1. Upgrade the account to a paid account. A trial account adds "Sent from
   your Twilio trial account" to every reply and can text only verified
   numbers.
2. Buy a US toll-free number with SMS capability (Phone Numbers, Buy a
   number, Toll-free).
3. Messaging, Settings, Geo permissions: allow the United States and Canada
   only. The route also drops other senders, as a second guard against toll
   fraud.

## 2. Messaging Service

Create a Messaging Service named "Spaarke meeting links" and add the number
to its sender pool.

- **Integration, incoming messages:** "Send a webhook", POST, with the URL in
  `SMS_WEBHOOK_URL`, character for character. The signature covers the
  host, so `www.spaarke.com` and `spaarke.com` are different URLs to the
  check; use `www` in both places.
- **Opt-Out Management:** turn on Advanced Opt-Out. Set the HELP response
  (keywords HELP and INFO) to the text of `HELP_REPLY` in
  [`src/lib/sms/messages.ts`](../src/lib/sms/messages.ts), exactly. Leave the
  STOP response as it is; on toll-free numbers the carrier's text is used.
  Advanced Opt-Out can be switched off only by Twilio support, so this is a
  one-way step.

## 3. Toll-Free Verification

Submit the verification for the number (Messaging, Regulatory Compliance,
Toll-Free Verification). The fields, as resubmitted on 2026-11-19, are in
spec FR-02. In short:

| Field | Value |
|---|---|
| Opt-in type | Via Text |
| Use case category | Customer Care |
| Monthly volume | 100 |
| Proof of consent | `https://spaarke.com/sms/opt-in.png` |
| Sample message | The MEET reply, `meetReply()` in `messages.ts` |
| HELP message sample | `HELP_REPLY` in `messages.ts` |
| Opt-in keyword | MEET |
| Privacy Policy URL | `https://spaarke.com/privacy` |
| Terms URL | `https://spaarke.com/sms` |

The /sms page, the opt-in image, and the webhook all read their words from
`messages.ts`, and the reviewer compares them. Any change to a text there
must be matched by an edit to the submission.

Replies sent before the number is Verified may be blocked by carriers, so
switch the program on only after verification.

## 4. Secrets in Key Vault

Create the two site secrets straight into Key Vault, so they never print:

```bash
az keyvault secret set --vault-name <vault> --name sms-link-secret --output none \
  --value "$(openssl rand -base64 48)"

az keyvault secret set --vault-name <vault> --name sms-phone-hash-secret --output none \
  --value "$(openssl rand -base64 48)"
```

The auth token comes from the Twilio console (Account, API keys and tokens).
Paste it at a hidden prompt rather than on the command line:

```bash
read -rs TOKEN && az keyvault secret set --vault-name <vault> --name twilio-auth-token \
  --output none --value "$TOKEN"; unset TOKEN
```

## 5. App settings and switching on

Copy the values into the static web app. Key Vault stays the record.

```bash
az staticwebapp appsettings set -n <static-web-app> --setting-names \
  TWILIO_ACCOUNT_SID=<account sid> \
  SMS_PUBLIC_NUMBER=<toll-free number> \
  SMS_WEBHOOK_URL=https://www.spaarke.com/api/sms/inbound \
  TWILIO_AUTH_TOKEN="$(az keyvault secret show --vault-name <vault> --name twilio-auth-token --query value -o tsv)" \
  SMS_LINK_SECRET="$(az keyvault secret show --vault-name <vault> --name sms-link-secret --query value -o tsv)" \
  SMS_PHONE_HASH_SECRET="$(az keyvault secret show --vault-name <vault> --name sms-phone-hash-secret --query value -o tsv)" \
  --output none
```

With those set and `SMS_MODE` unset, the program is still off. To switch it
on:

```bash
az staticwebapp appsettings set -n <static-web-app> --setting-names SMS_MODE=twilio --output none
```

Then text MEET from your own phone. Expect one two-segment reply whose link
opens /meet with "Thanks for texting. Choose a time below." Text HELP (one
reply, the custom text), STOP (one reply, the carrier's), MEET again (no
reply), and START. The tables `SmsSenders`, `SmsConversations`, and
`SmsInbound` are created on first use.

## 6. Pausing

Delete `SMS_MODE`. The route answers 404, so nobody gets a reply from the
site; Twilio still answers STOP and HELP itself, which is what the terms
promise. The "Prefer to text?" line leaves /meet at the same moment. Links
already sent keep opening /meet with the welcome line, because that needs
only `SMS_LINK_SECRET`.

For a pause longer than a few days, also set the Messaging Service's
incoming messages to "Drop the message", so Twilio's console does not fill
with webhook errors (11200).

## 7. Rotating the auth token

The route accepts either `TWILIO_AUTH_TOKEN` or `TWILIO_AUTH_TOKEN_PREVIOUS`,
so the swap drops no messages:

1. In the Twilio console, request a secondary auth token. Store it in Key
   Vault as `twilio-auth-token`, as in step 4.
2. Set `TWILIO_AUTH_TOKEN_PREVIOUS` to the current token and
   `TWILIO_AUTH_TOKEN` to the new one. Twilio is still signing with the old
   token, which the route accepts as the previous one.
3. In the console, promote the secondary token to primary. Twilio now signs
   with the new token.
4. A day later, delete `TWILIO_AUTH_TOKEN_PREVIOUS`.

## 8. The other secrets

`SMS_PHONE_HASH_SECRET` is never rotated. Every sender row is keyed by the
hash; a new secret would make every returning number look new, which resets
the per-number limits and loses who opted out through the route. Twilio's
own STOP block would still hold, but the site's record of it would not. If
the secret is ever exposed, treat it as an incident: the hashes can then be
reversed by trying every US number.

`SMS_LINK_SECRET` can be rotated, but links sent in the last 30 days stop
verifying: they open /meet without the welcome line, and bookings through
them are not tied to the text. Rotate it at a quiet time.

## 9. Placement codes

A code is the optional second word after MEET, saying where the person saw
the number ("MEET CARD2"). The codes and their labels are in
`PLACEMENT_CODES` in [`src/lib/sms/config.ts`](../src/lib/sms/config.ts).
Add one per event or print run before it goes out; codes are not secret. An
unknown code is recorded as `none`, not refused.

## 10. Local checks

`npm run sms:check` runs the offline cases: signature, keywords, tokens,
phone hash, reply lengths, the store, the route, and the /meet link. With
`--server` it also drives a running `next start` against Azurite, the local
storage emulator; the setup is in
[`projects/text-to-meet/notes/route-checks.md`](../projects/text-to-meet/notes/route-checks.md).
Under `next dev`, `MEET_DEV_MOCK=1` keeps every table in memory, including
the SMS ones.

## What to watch

App Insights custom events. None carries a phone number or its hash.

| Event | Meaning |
|---|---|
| `sms.received` | A signed message arrived; `classification` (meet, stop, start, help, other, blocked), `code`, and `reason` when nothing was sent |
| `sms.replied` | A reply went out |
| `sms.bad_signature` | A request failed the signature check. A burst after a token change means a setting is wrong |
| `sms.wrong_destination` | A signed request for another account or number |
| `sms.region_blocked` | A sender outside the US and Canada |
| `sms.rate_limited` | A per-number limit held |
| `sms.cap_reached` | A site-wide cap held; the first refusal in each window also emails `CONTACT_EMAIL_TO` |
| `sms.link_opened` | A reply's link opened /meet; `first` is true on the first open |
| `sms.token_invalid`, `sms.token_expired` | A link that did not verify; /meet showed the normal page |
| `sms.booking_linked` | A booking was tied to its text |
| `sms.booking_unlinked` | A booking carried a link that could not be tied; `reason` says why. The booking itself went through |

Exceptions carry `step`: `sms.inbound` (the route failed after the
signature check and sent nothing), `sms.link_open`, `sms.booking_source`,
`sms.booking_link`, and `sms.cap_alert`.

In the Twilio console, watch the Messaging logs for error 11200 (the
webhook did not answer) and for delivery errors in the 30000 range.
