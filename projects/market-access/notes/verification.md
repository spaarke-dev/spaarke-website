# Verification (task 090)

How each success criterion in `spec.md` was checked, on 2026-11-24, with what is left for Ralph's final checks. Counts only; no names, addresses or codes.

"Local production build" below means `next build` and `next start` against the Azurite emulator (tables suffixed `Check`), signed in by sending the principal header the way SWA does. On the live site SWA strips that header from visitors (`auth-spike.md`, question 4).

## Success criteria

| # | Criterion | Status |
|---|---|---|
| 1 | Admin sign-in, and an account without the role is refused | Mostly verified; Ralph tries a second account |
| 2 | TLTF counts match `index.csv`, engaged list matches `track.py` | Verified |
| 3 | Bulk thank-you follow-ups show `sent` within 30 minutes | Ralph's check; the mechanism is verified, and the sync can run late |
| 4 | A test contact form submission appears with its UTM fields | Verified on a local production build; not run on a preview |
| 5 | A LinkedIn Lead Gen CSV imports, and a second import adds nothing | Verified |
| 6 | Without the `investor` role, no TLTF investor record or count appears | Verified against live data |
| 7 | contactus@ syncs, new senders reach triage, an out-of-scope mailbox shows an error | Mostly verified; Ralph adds a mailbox outside the scope |
| 8 | No contact data, codes or tenant identifiers in the repo | Verified |

### 1. Sign-in

- Signed out on the live site, `/admin` redirects to sign-in (302) and `POST /api/admin/campaigns` returns 401.
- Signed in without the `admin` role:
  - On the live site, SWA returns its own 403 before Next.js runs. This was tested in the auth spike with a rule that requires a role nobody has.
  - On the local production build, `/admin` shows "You are signed in, but your account does not have the admin role", and the admin API returns 403.
- Ralph signs in with his work account every day.
- **Left for Ralph:** sign in at `/admin` with a second account that has no invitation, and expect the 403 page.

### 2. TLTF results

- Import on 2026-11-23: 81 sent, 10 bounced and 11 replied, the same as `index.csv`. 19 members have a meeting.
- After the backfill on 2026-11-24: 6 engaged, the same 6 recipients `track.py` lists (`engagement-check.md`).

### 3. Follow-ups close themselves

- The sync engine turns a `todo` or `drafted` follow-up into `sent` when it sees an outgoing email to the contact. The storage checks cover this (task 042).
- The mail sync ran 44 times between 2026-11-23 15:47 and 2026-11-24 12:38 UTC, every run a success.
- **Finding:** GitHub starts the scheduled job late at times. The gap between runs had a median of 28 minutes and a maximum of 44; 4 of 43 gaps were over 35 minutes. So a follow-up can take up to about 45 minutes to show `sent`, not 30. The schedule moved to every 15 minutes on 2026-11-24 to keep it under 30.
- **Left for Ralph:** on `/admin/campaigns/tltf-2026`, bulk-create "Thank-you after the Summit" follow-ups for the people he met, send them from Outlook, and check each shows `sent`.

### 4. Contact form writer

- On the local production build, a contact form with made-up details and UTM fields (`linkedin`, `paid`, `wrap-090`) returned `ok`.
- The contact appeared at `/admin/contacts` with a "Contact form" entry and its UTM campaign.
- On live data, the backfill brought in the 8 earlier contact form rows with their original times and UTM fields.
- Not run on a preview environment: a preview writes to the live tables and sends the real notification email. Ralph can run it there as a final check, then delete the test contact.

### 5. LinkedIn import

- On the local production build, the sample file (`scripts/market/fixtures/linkedin-leads-sample.csv`, 8 made-up rows) went into a new LinkedIn campaign:
  - First import: 4 imported, 3 new contacts, 3 members added. The other 4 rows are broken in the file on purpose and were named and skipped.
  - Second import: 0 imported, 4 already imported.
- Not yet tried with a real Campaign Manager export; the first one comes after 2026-12-19.

### 6. Investor restriction

Run read-only against the live tables, comparing an admin without the `investor` role to an admin with it:

| | Admin | Admin and investor |
|---|---:|---:|
| Contacts | 14 | 109 |
| Organizations | 7 | 84 |
| Campaigns | 0 | 1 |
| Investor-only records in the admin's lists | 0 | |

- Without the role:
  - `tltf-2026` gives no members and no results, and the campaign summaries hold no TLTF entry.
  - Recent activity and new contacts include nothing on an investor contact, and a search for "tltf" finds nothing.
  - None of 25 investor contact pages opens.
- The checks also cover every list and count (FR-02).
- Ralph can repeat this in the browser with an account that has `admin` but not `investor`.

### 7. Mailboxes

- Both registered mailboxes synced at 12:38 UTC on 2026-11-24 with no error. The first two syncs read 63 contactus@ messages and 891 personal ones.
- New senders reach triage: the first contactus@ sync queued 4, and 3 are waiting now. The personal mailbox queues none, as designed.
- An error for a mailbox outside the scope maps to `NoMailboxAccess`; the checks cover the mapping with a canned 403 answer. A made-up address answers 404, so it cannot test the scope.
- **Left for Ralph:**
  - Add a real mailbox that is not in the "Market access sync" group at `/admin/mailboxes`.
  - Press Check access and expect the clear error, then let a sync run and confirm the other two still sync.
  - Remove that mailbox afterwards.

### 8. Repo privacy

- **Pattern search** over the 146 files the project changed: no GUIDs, keys or secrets. Every email address is a made-up `.test` or `example` address or a published Spaarke address.
- **Private-file search** over all 1,582 tracked files, for every value in the private outreach files: 86 addresses, 166 codes and keys, 27 names and firms.
  - No address appears anywhere.
  - Two items were replaced with placeholders in this change: one label used as a format example in `tltf-import.ts`, and a Spaarke mailbox in the check fixtures.
  - The only other matches are public conference speakers and companies in the published research library, which predates this project.

## Speed and accessibility

### Public pages (Lighthouse 13.6, mobile, live site)

| Page | Performance | Accessibility | Best practices | SEO | LCP |
|---|---:|---:|---:|---:|---|
| `/contact` | 94 | 97 | 77 | 100 | 1.9 s |
| `/meet` | 98 | 100 | 100 | 100 | 1.7 s |
| `/tltf-2026` | 82 | 96 | 73 | 100 | 4.4 s |

- The activity writers run on the server after a form or booking is saved, so they cannot change these scores. A write takes 6 to 11 ms and gives up after 1.5 s (`auth-spike.md`, question 7).
- Every lost point comes from site-wide pieces older than this project:
  - the reCAPTCHA cookie;
  - a report-only Content Security Policy warning about the reCAPTCHA frame;
  - the contrast of the primary button (below).

### Admin pages (axe 4.14, WCAG 2.1 A and AA, local production build)

| Page | Phone (375 px) | Desktop (1280 px) | Load |
|---|---|---|---|
| `/admin` | no issues | 1 contrast | 1.4 s |
| `/admin/contacts` (7,358 contacts) | no issues | 1 contrast | 1.3 to 2.5 s |
| `/admin/contacts/<id>` | no issues | 1 contrast | 1.0 to 1.3 s |
| `/admin/organizations` and one organization | no issues | 1 contrast | 0.9 to 1.1 s |
| `/admin/campaigns` | no issues | 1 contrast | 1.0 to 1.3 s |
| `/admin/campaigns/<slug>` (500 members) | no issues | 1 contrast | 2.0 to 3.9 s |
| `/admin/import`, `/admin/mailboxes`, `/admin/triage` | no issues | 1 contrast | 0.8 to 1.0 s |

- Load times are full page loads in headless Chrome, scripts included. The server answers the contacts list in 0.4 s.
- No admin page scrolls sideways at phone width.
- **Contrast:** the one issue on every page is the site header's primary button: white 13 px text on `#5078DC`, 4.14 to 1 against the 4.5 to 1 required. It is the site's shared `Button`, not part of this module, and changing it is a brand color decision. It shows only at desktop width, where the header shows the button.
- **Dev mode:** in `next dev`, the contacts list with 7,358 contacts took 3 minutes and logged "Maximum call stack size exceeded". The same page built for production answers in 0.4 s, so this is a development-mode cost of tracking each awaited row, not a production issue. For local work at that size, use a small table suffix.

## Checks

`npm run market:check` against Azurite: 59 pass. The first run of the day had one failure that did not repeat; it ran while the local server was writing to the same test tables.
