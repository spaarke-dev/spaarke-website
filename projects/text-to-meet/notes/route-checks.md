# Route checks

How to run `npm run sms:check` against a running server, and what the last
run showed. Task 022.

## Two modes

- `npm run sms:check` runs offline: 144 cases, no network or storage. The
  store and the route run against the in-memory dev mock; the route's `POST`
  is called directly with built requests.
- `npm run sms:check -- --server <url> --env-file <file>` adds 22 cases
  against a running `next start` whose storage is Azurite, the local Table
  Storage emulator. It signs each request with the server's own settings,
  read from the env file.

The server mode refuses to run (exit 2) when any `SMS_*_TABLE` setting is
still a production table name, or when `STORAGE_ACCOUNT_CONNECTION` does not
point at a local emulator. It clears the test counters table at the start of
each run, so runs in the same hour do not start at the cap.

## Setup

1. Install Azurite outside the project, so `package.json` is unchanged:
   `npm install azurite@3.35.0` in a scratch folder.
2. Start the table service, in memory:
   `azurite-table --inMemoryPersistence --tableHost 127.0.0.1 --tablePort 10012 --skipApiVersionCheck --disableProductStyleUrl`.
   Port 10002, the default, was taken by another process on this machine.
3. In the worktree, write `.env.production.local` (gitignored; `next start`
   reads it and `next dev` does not, so a dev server in the same folder is
   unaffected) with test values only:
   - `SMS_MODE=twilio`
   - `TWILIO_ACCOUNT_SID`: `AC` and 32 random hex characters
   - `TWILIO_AUTH_TOKEN`, `SMS_LINK_SECRET`, `SMS_PHONE_HASH_SECRET`: random,
     the two secrets 32 characters or more
   - `SMS_WEBHOOK_URL=http://localhost:3124/api/sms/inbound`
   - `SMS_PUBLIC_NUMBER=+18005550100`
   - `SMS_REPLY_HOURLY_CAP=12`, `SMS_REPLY_DAILY_CAP=1000`
   - `STORAGE_ACCOUNT_CONNECTION`: the Azurite connection string with the
     account `devstoreaccount1`, Azurite's published development key, and
     `TableEndpoint=http://127.0.0.1:10012/devstoreaccount1;`
   - `SMS_SENDERS_TABLE=SmsCheckSenders`,
     `SMS_CONVERSATIONS_TABLE=SmsCheckConversations`,
     `SMS_INBOUND_TABLE=SmsCheckInbound`,
     `SMS_COUNTERS_TABLE=SmsCheckCounters`
4. `npm run build`, then `next start -p 3124`.
5. `npm run sms:check -- --server http://localhost:3124 --env-file .env.production.local`.
6. Stop the server and Azurite and delete `.env.production.local`.

The store allows plain http only when the connection string's table
endpoint is `http://127.0.0.1` or `http://localhost`, or it uses
`UseDevelopmentStorage=true`. Azure endpoints are always https.

## Last run (2026-11-22: Azurite 3.35.0, Next.js 16.1.6, two runs in one hour)

| Case | Result |
|---|---|
| Unsigned, wrong token, wrong `AccountSid`, wrong `To` | 403 each |
| MEET | One `<Message>`; the link uses `SITE_URL` and verifies |
| Same `MessageSid` again | Empty `<Response/>` |
| Fourth MEET from one number in a day | Empty |
| Sender outside +1 | Empty |
| `OptOutType=HELP`; STOP; MEET after STOP; START | Empty each |
| MEET after START | A link |
| Unrecognized text; a second one | The nudge; then empty |
| Hourly cap of 12 | Exactly the remaining replies sent, then empty; the counter row marked for one alert |
| Tables searched for every test number and message text | None found |
| Production table names, or remote storage | Script refuses, exit 2 |

Both runs: 166 passed, 0 failed. 26 requests a run, p95 39 ms and 23 ms,
max 51 ms. These timings are for a local emulator; Azure Table Storage adds
network time, so the 3 second target (NFR-02) is confirmed only once the
route runs in Azure (task 041).

The cap alert went through the email path once per run (the server log
shows one "SENDGRID_API_KEY not set" line per run, as SendGrid was not
configured). The real email is checked at go live.

Covered offline only: storage connection unset (200, empty `<Response/>`),
and `SMS_MODE` unset (404). A running server cannot change its settings
between requests.
