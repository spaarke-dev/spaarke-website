# Verification (task 090)

How each success criterion in `spec.md` was checked, on 2026-11-24, and what is left for Ralph's final checks. Counts only; no names, addresses, codes or keys.

"Local production build" below means `next build` and `next start` against the Azurite emulator, signed in by sending the principal header the way SWA does. "The checks" means `npm run market:check` against Azurite with fresh tables.

Phase 2 went live on 2026-11-25: Ralph approved the merge, PRs 210 to 220 were merged in order, and the production deploy of the last merge succeeded. The live smoke tests are under "After deploy" below.

## Success criteria

| # | Criterion | Status |
|---|---|---|
| 1 | A campaign is created, filled from a CSV, coded and its links exported, all from `/admin` | Verified with made-up data; Ralph runs one real campaign |
| 2 | A brief read and an Ask AI click from the exported links count for the right member | Verified on a local production build; live check with the real campaign |
| 3 | An Outlook meeting shows booked, then held, on the timeline | Verified in the checks; live test meetings after deploy and the Exchange step |
| 4 | A "7 days, no reply" step creates follow-ups for exactly the right members, once | Verified in the checks; first live run after deploy |
| 5 | "Write in Outlook" opens a new message with the subject filled in | Link verified in the browser; Ralph clicks one |
| 6 | The morning report shows the last sync, warns on a stale sync and a near secret expiry | Verified in the checks with canned times; app setting and one live report left |
| 7 | No contact data, codes, keys or brief text in the repo | Verified |

### 1. A campaign from `/admin`

- Tasks 010, 020, 021 and 022 each ran in headless Chrome against a local production build, with made-up people:
  - a target list previewed with its 3 broken rows named, then imported into a new campaign, and a second import added nothing;
  - codes given to every member, a second run gave none, and the prefix was then fixed;
  - a brief saved, which gave each coded member a link;
  - the links shown and exported as a CSV with the byte order mark and the tagged page link.
- The checks cover the same path in storage: preview writes nothing, hand edits survive an import, two code runs at once never share a number, a 257-row list imports in two parts, and the links export drops hidden and deleted contacts.
- **Left for Ralph:** one real campaign, from the CSV to the exported links.

### 2. Brief reads and Ask AI clicks

- Task 022, local production build: the exported brief link answered 200 and the Ask AI link redirected to Claude. Both appeared on that member's timeline and not on the other member's.
- Task 021: turning the briefs off gave 404, and on gave 200 again. A general campaign's brief does not mention investors.
- **Left for Ralph:** open two links from the real campaign's export and check the campaign results.

### 3. Calendar meetings

- Task 001 read Ralph's own calendar through Graph (app-only) on 2026-11-24. contactus@ answered 403 until Ralph ran the Exchange step (setup guide, section 7) on 2026-11-25; it now answers 200, and the 01:40 UTC sync on 2026-11-26 read both calendars with no failures.
- The checks cover booked, moved, canceled and held entries from made-up Graph events, including a recurring series, a meeting first seen already canceled, a deleted event, a /meet booking (left to the booking writer, not logged twice) and a second sync that adds nothing. Held meetings count toward the meeting stage in results (task 032).
- **Left for Ralph:** after deploy, turn on "Read calendar" for his mailbox, book a test meeting with a known contact, and check it shows booked and then held. The same for contactus@ (the Exchange step is done).

### 4. Follow-up steps

- The checks run the job on made-up members with canned times: day 7 makes a follow-up for exactly the member at `sent`; replied, bounced and Stop steps members get none; a step not yet due waits; one 8 days late is skipped and counted, one 5 days late is caught up; the group filter and the first-meeting anchor work; and a second run the same day creates nothing.
- The run route answered 401 without the token and counts with it, on the local production build.
- Live, 2026-11-25: the "Follow-up steps" workflow, run by hand once, got HTTP 200 and logged counts only (0 campaigns with steps, 0 created), as expected before any campaign has steps.
- **Left for Ralph:** the first scheduled run after a real campaign has a step.

### 5. Write in Outlook

- Task 042, local production build: the link is on `/admin`, the contact page and the campaign page, with the contact's address and the follow-up title as the subject. A title with `&` and `#` keeps them.
- Whether it opens Outlook or another app depends on the computer's default mail app.
- **Left for Ralph:** click it on one follow-up.

### 6. Morning report health

- The checks with canned times: the last successful sync, a warning after an hour without one, one alert on the third failure in a row and none on the fourth the same day; the secret warning 20 days ahead, nothing at 60 days, a past date, and a missing or malformed setting.
- `MEET_GRAPH_SECRET_EXPIRES` set on the site on 2026-11-25, with Ralph's go-ahead.
- **Left for Ralph:** one live report; and a mailbox outside the Exchange scope to see the alert (task 050).

### 7. Privacy

- **Pattern search** over the 91 files phase 2 changed (`git log --grep "phase 2"`): addresses outside the test and Spaarke domains, GUIDs, storage keys, secret literals, long base64 or hex strings, and phone numbers.
  - 6 hits, all in `scripts/check-market.mts`, all made up: one address on a fictional `acme.co.uk` subdomain, four standard bounce senders (`postmaster@`, `mailer-daemon@`), and one long line of code.
- **Private-value search** over all 1,641 tracked files, using the values in the private outreach files (the outreach list, the brief keys, the contact profiles, the Summit people and the Summit calendar):

| Kind | Values | Found in tracked files |
|---|---:|---:|
| Addresses | 96 | 0 |
| Brief keys | 83 | 0 |
| Codes (6 characters or more) | 2 | 0 |
| Names | 13 | 1 |
| Phone numbers | 3 | 0 |

- The name is in a research note from 2026-09-22 (`content-platform/research/2026-09-loi-series/notes/`), from public sources; phase 2 did not add it.
- The 81 shorter codes were searched as whole words in the phase 2 files: one match, the reserved `.TEST` domain in two made-up addresses in the checks. It shares its letters with a code, and is not one.

## Checks

- `npm run market:check`: 84 pass with fresh tables, against Azurite, on this branch.

## Speed and accessibility

### axe (WCAG 2.1 AA), headless Chrome at 1280 px and 375 px

| Page | Task | Result |
|---|---|---|
| Campaign page: codes, brief, links | 020, 021, 022 | Only the site header button's contrast |
| Campaign page: follow-up steps, open follow-ups | 040, 042 | Only the site header button's contrast |
| Import page (target list) | 010 | Only the site header button's contrast |
| Contacts page (add contact) | 011 | Only the site header button's contrast |
| Contact page (Stop steps, Write in Outlook) | 040, 042 | Only the site header button's contrast |
| Mailboxes page (Read calendar) | 030 | Only the site header button's contrast |

- The header button's contrast (`bg-[#5078DC]` with white text) predates phase 2 and fails at desktop width only. It is a site-wide fix, outside this project.
- No page scrolls sideways at 375 px.

### Lighthouse

- `/brief/<key>` needs a live brief, which needs the deploy. Run Lighthouse (mobile) on one link from the real campaign after deploy, with the phase 1 numbers for `/tltf-2026` as the comparison.

## After deploy (2026-11-25)

- `/` and `/meet` answer 200; `/admin` and `/admin/import` redirect signed-out visitors to sign-in (302).
- Signed out, `POST /api/admin/campaigns` and the links route answer 401.
- `POST /api/market/followups/run` answers 401 with no token and with a wrong one.
- An unknown brief key answers 404.
- The mail sync's first run on the new code (05:12 UTC) succeeded. No mailbox reads its calendar yet, so the calendar part has nothing to do until "Read calendar" is turned on.

## Ralph's final checks

1. ~~Merge and deploy PRs 210 to 220 in order.~~ Done 2026-11-25.
2. One real campaign from `/admin`: import the list, give codes, save the brief, export the links (criterion 1).
3. Open two links from that export and check the campaign results (criterion 2).
4. A test meeting with a known contact in his own calendar after turning on "Read calendar", and one in contactus@; the Exchange step is done (criterion 3).
5. ~~Run the "Follow-up steps" workflow by hand once.~~ Done 2026-11-25; check the first scheduled run after a campaign has a step (criterion 4).
6. Click "Write in Outlook" on one follow-up (criterion 5).
7. ~~The go-ahead to set `MEET_GRAPH_SECRET_EXPIRES=2027-11-13`.~~ Set 2026-11-25. Read one live morning report (criterion 6).
8. The phase 1 final checks still open in `projects/market-access/notes/verification.md`.

The project stays open until these are done: the README is not marked Complete, the plan's milestones are not ticked, and `current-task.md` stays.
