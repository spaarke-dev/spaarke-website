# Market Access Phase 2 (Target Lists, Codes, Calendar, Follow-up Steps): AI Implementation Specification

> **Status**: Accepted by the owner (2026-11-24)
> **Created**: 2026-11-24
> **Source**: `design.md` (2026-11-24) and the owner's answers recorded below
> **Builds on**: `projects/market-access/spec.md` (phase 1, live 2026-11-24). FR numbers here are new; phase 1 numbers are written as "phase 1 FR-nn".

## Executive Summary

Phase 1 measures outreach and tracks follow-ups, but a new campaign still needs the private scripts for its target list and its personal codes. Phase 2 adds four things to the market access admin area:

- a general target list import, and a form to add one contact;
- personal codes, private brief links and a links export for each campaign;
- calendar entries for meetings with known contacts;
- follow-up steps on a campaign, which a daily job turns into follow-ups.

Three small scheduled jobs keep it healthy. The goal is that the second outreach campaign runs end to end from `/admin`, with emails still written and sent in Outlook.

## Scope

### In Scope

**Target lists**
- A CSV import for any target list, with a column picker, a preview, and safe repeats.
- An "Add contact" form for one person.

**Codes and briefs**
- A code for each campaign member, unique across campaigns.
- One private brief text per campaign, with a brief key for each member.
- Ask AI and brief links for each member, and a CSV export of them.

**Calendar**
- The sync reads the calendars of Ralph's mailbox and contactus@spaarke.com.
- Meetings with known contacts get a "booked" entry and, once they take place, a "held" entry.

**Follow-ups**
- Follow-up steps on a campaign: when, for whom, and for which group.
- A daily job creates the follow-ups each step calls for.
- Each follow-up links to a new Outlook message to the contact.

**Scheduled jobs**
- The daily follow-up job.
- A sync health alert.
- A secret expiry warning.

### Out of Scope
- Writing or sending email from the admin area (owner decision 1). Follow-ups open a new message in Outlook.
- A separate brief text per person or per group (owner decision 2).
- The three-year activity purge and the weekly LinkedIn reminder. They stay on the list for later.
- A link from a campaign to the content calendar's GitHub Project.
- Ad spend and other paid-media metrics.
- Calendar read for mailboxes other than the two named.

### Affected Areas
- `src/lib/market/`:
  - new `target-import.ts`, `codes.ts`, `calendar-sync.ts`, `steps.ts` and `health.ts`;
  - changes to `sync.ts`, `results.ts`, `types.ts` and `campaign-admin.ts`.
- `src/lib/private-brief.ts`: write and switch off brief rows (today it only reads).
- `src/app/admin/`:
  - `import/` (target list);
  - `contacts/` (Add contact);
  - `campaigns/[slug]/` (Codes and links, Follow-up steps).
- `src/app/api/admin/`: routes for the import, add contact, codes, brief, export and steps.
- `src/app/api/market/`: a bearer-token route for the daily follow-up job.
- `src/components/admin/`: forms for the above, and the Outlook link on follow-ups.
- `src/lib/reports/daily.ts`: the sync health and secret expiry lines.
- `.github/workflows/`: the daily follow-up job, in the `daily-report.yml` pattern.
- `docs/market-access-mailboxes.md`: the Exchange step for the contactus@ calendar.

## Requirements

### Functional Requirements

**Target lists**

1. **FR-01 Target list import.** At `/admin/import`, next to the LinkedIn import, Ralph uploads a CSV and picks which column holds each field.
   - Fields:
     - required: email;
     - optional: first name, last name, full name, title, organization, LinkedIn URL, phone, group label, template label, note.
   - Destination: an existing campaign, or a new one named in the form.
   - Visibility: "All admins" or "Investor role only", for the contacts it creates. Choosing investor needs the `investor` role.
   - New rows become contacts, using the phase 1 contact resolution:
     - existing contacts gain only empty fields;
     - fields edited by hand never change.
   - Every valid row becomes a campaign member with its group and template labels.
   - A note becomes a `note` activity on the contact, once.
   - Limits: 2,000 rows and 2 MB a file.
   - Acceptance:
     - a preview shows new contacts, existing contacts, members already in the campaign, and each broken row with its reason;
     - nothing is saved until Ralph confirms;
     - importing the same file again adds nothing.
2. **FR-02 Add contact.** A form on `/admin/contacts` with email (required), name, title, organization, LinkedIn URL, phone and visibility.
   - It uses the same resolution as FR-01.
   - When the email already belongs to a contact, it says so and links to that contact; it creates nothing.
   - Acceptance: a new person appears in the list with an "Added by hand" first activity.

**Codes and briefs**

3. **FR-03 Member codes.** "Give everyone a code" on the campaign page assigns a code to each member without one.
   - Format: the campaign's code prefix, a dash, and a three-digit number (for example `acme-001`).
   - The prefix defaults to the campaign slug, cut to 12 characters, and is editable until the first code exists.
   - Codes are unique across all campaigns. Existing TLTF codes keep their format.
   - Each member's brief label is `<slug>:<code>`, the TLTF pattern, so reads and clicks resolve through the phase 1 code and label lookups.
   - Acceptance: running it twice gives no member a second code, and a new member added later gets the next number.
4. **FR-04 Campaign brief.** Ralph writes one brief text for the campaign in the admin area (owner decision 2).
   - The text is stored in `PrivateBriefs`, one row for each member with a code. Each row has its own random key (32 URL-safe characters, which passes `isBriefKey`) and the member's brief label.
   - Saving changed text updates every row in the campaign.
   - "Turn the briefs off" sets `active` to false on every row in the campaign, and "Turn them on" reverses it.
   - The text never goes to git, logs or telemetry.
   - Acceptance:
     - opening a member's brief link logs a `brief.read` on that member;
     - after "Turn the briefs off", the link answers 404.
5. **FR-05 Links and export.** For each member with a code, the campaign page shows and exports:
   - the brief link (`/brief/<key>`);
   - an Ask AI link for each provider, built by `askLink(provider, code, key)`;
   - a tagged link to any site page Ralph enters, with `utm_source=email`, `utm_medium=outreach`, `utm_campaign=<slug>` and `src=<code>`.
   - "Export links" downloads a CSV with one row per member: email, name, organization, group, template label, code and each link.
   - The export is built in the browser's download and never saved on the server or in the repo.
   - Acceptance: the export opens in Excel with one row per coded member; a click on an exported Ask AI link counts for that member.

**Calendar**

6. **FR-06 Calendar read.** Each sync run also reads the calendars of the mailboxes marked for calendar read: Ralph's and contactus@ (owner decision 4).
   - It reads events changed since a calendar checkpoint, from 30 days back to 90 days ahead.
   - Ralph's mailbox uses the `/meet` app's existing `Application Calendars.ReadWrite` assignment. contactus@ needs `Application Calendars.Read` on the "Market access sync" scope, which Ralph adds in Exchange (`docs/market-access-mailboxes.md` gets the command).
   - The mailbox registry gets a "Read calendar" setting, off by default. A mailbox without access shows a clear error, as mail does today.
   - Acceptance: an Outlook meeting with a known contact appears on the contact within one sync run.
7. **FR-07 Calendar entries.** For each event with at least one attendee who is a contact (owner decision 3):
   - `calendar.booked` when the sync first sees it, dated when it was set up, with the meeting time in the summary;
   - `calendar.moved` when its time changes;
   - `calendar.cancelled` when it is canceled;
   - `calendar.held` once its end time has passed without a cancellation, dated at its start.
   - Each entry carries the subject, the meeting time, whether it is online (Teams) or in person, and an Outlook link. No body, notes or attachments.
   - Events the organizer marked private log as "Private meeting" with no subject.
   - A `/meet` booking is matched to its `MeetingBookings` row by event ID and skipped, since phase 1 already logs it.
   - Acceptance:
     - one meeting gives one booked entry and, after it takes place, one held entry;
     - a canceled one gets no held entry;
     - re-reading changes nothing.
8. **FR-08 Meetings in results.** `calendar.held` counts toward a member's `meeting` stage.
   - `calendar.booked` and `calendar.moved` show on the timeline but do not count; a meeting counts only once held.
   - Phase 1 rules are unchanged: `/meet` bookings and `meeting.in_person` still count as before.
   - Acceptance: a booked calendar meeting with a member leaves the funnel unchanged until it is held.

**Follow-ups**

9. **FR-09 Follow-up steps.** On the campaign page, Ralph adds, edits, orders and removes steps. Each step has:
   - a name (it becomes the follow-up's title);
   - **when**: a number of days after an anchor. The anchor is either the member's first email sent in the campaign, or their first meeting held;
   - **who** (owner decision 5):
     - no reply (status `sent`);
     - engaged but no meeting;
     - met;
     - everyone;
   - an optional group, matching the members' group label;
   - on or off.
   - Acceptance: steps save, reorder and switch off, with an audit entry for each change.
10. **FR-10 Daily follow-up job.** Once a day, a job creates a follow-up for each member a step applies to that day.
    - The follow-up is due that day, linked to the campaign and the member, and created only once per member and step, even if the job runs twice.
    - A member gets no further steps once they:
      - have replied (except for steps whose "who" is "met" or "everyone");
      - have bounced;
      - are deleted;
      - or Ralph has marked "stop steps" on them.
    - A step's day that falls while the job was down is caught up on the next run, up to 7 days late. Older ones are skipped.
    - Created follow-ups behave like phase 1 follow-ups:
      - they show in the morning report and on the contact;
      - they close as `sent` when the sync sees the email go out.
    - Acceptance:
      - a step "7 days after first email, no reply" creates follow-ups on day 7 for exactly the members still at `sent`;
      - running the job twice that day creates nothing more.
11. **FR-11 Write in Outlook.** Every open follow-up, on the contact and on the campaign, has a "Write in Outlook" link (owner decision 1).
    - The link is a `mailto:` with the contact's address and the follow-up's title as the subject.
    - Acceptance: clicking it opens a new message to the contact with the subject filled in.

**Scheduled jobs**

12. **FR-12 Follow-up job schedule.** A GitHub Actions workflow calls `POST /api/market/followups/run` once a day at 11:00 UTC (before the morning report), with a bearer token.
    - It uses the `MA_SYNC_TOKEN` secret, like the mail sync, and also runs on demand.
    - It answers with counts only.
    - Acceptance: a failed call fails the workflow run, so GitHub's failure email reaches Ralph.
13. **FR-13 Sync health.** The morning report adds a "Mail sync" line:
    - the time of the last successful run;
    - a warning when that is more than an hour old;
    - each mailbox that has failed its last three runs, with its error.

    The sync also sends one alert email when a mailbox reaches three failed runs in a row, through the existing email sender, at most once a day for each mailbox.
    - Acceptance: a mailbox outside the Exchange scope triggers one alert on its third failed run and shows in the next morning report.
14. **FR-14 Secret expiry warning.** The morning report shows a warning when the Graph app's secret expires within 30 days.
    - The expiry date comes from a new app setting, `MEET_GRAPH_SECRET_EXPIRES`, set when the secret is created; it is not read from Entra.
    - Without the setting, the report says the date is unknown.
    - Acceptance: with the setting 20 days ahead, the report shows the warning and the date.

### Non-Functional Requirements

- **NFR-01 Privacy.** The repo stays public. No contact data, lists, codes, brief keys, brief text, calendar subjects or tenant identifiers go into git, logs or telemetry. Telemetry carries counts only.
- **NFR-02 Investor restriction.** Phase 1 FR-02 applies to everything here:
  - investor members never appear in an export, a code list or a step's counts for an admin without the `investor` role;
  - calendar entries on an investor contact are investor records.
- **NFR-03 Safe to repeat.** Every write uses the phase 1 idempotency keys. This covers imports, codes, brief rows, calendar entries and step follow-ups: re-running anything adds nothing.
- **NFR-04 Sync budget.** Calendar reads share the sync's time budget. A run that runs out stops cleanly and the next run continues from the checkpoint.
- **NFR-05 Accessibility.** New pages and forms:
  - pass axe (WCAG 2.1 AA) apart from the existing header button;
  - work at 375 px with no sideways scroll;
  - meet text contrast, without using the brand blue for text.
- **NFR-06 Voice.** UI text and docs follow the content voice: plain words, no em dashes, US spelling.

## Technical Constraints

### Tech Stack
- Next.js 16 App Router (TypeScript) on Azure Static Web Apps Standard; SWA authentication with roles `admin` and `investor`.
- Azure Table Storage through `@azure/data-tables`.
  - New tables use the `Ma` prefix: `MaSteps` and `MaStepRuns`.
  - Brief rows stay in `PrivateBriefs`.
- Microsoft Graph over `fetch`, app-only, scoped by Exchange RBAC for Applications.
- GitHub Actions for schedules, following the `daily-report.yml` and `mail-sync.yml` pattern.
- Tailwind v4 tokens and `@fluentui/react-icons`.

### Key Decisions
- Everything goes through `recordActivity` and the phase 1 contact resolution. No second write path.
- Brief text lives only in `PrivateBriefs`, as in phase 1.
- Checks run against Azurite with `MA_TABLE_SUFFIX`; `npm run market:check` grows with each task.

## Success Criteria

1. [ ] A new campaign is created, filled from a CSV and coded, and its links exported, all from `/admin`. Verify by: a test campaign in the Check tables, then one real campaign.
2. [ ] A brief read and an Ask AI click from the exported links count for the right member. Verify by: opening two links from the export and checking the campaign results.
3. [ ] An Outlook meeting with a known contact shows booked, then held, on the timeline. Verify by: a test meeting from Ralph's calendar and one from contactus@.
4. [ ] A "7 days, no reply" step creates follow-ups for exactly the right members, and a second job run that day creates none. Verify by: the checks, then the first live run.
5. [ ] "Write in Outlook" opens a new message to the contact with the subject filled in. Verify by: clicking it on a follow-up.
6. [ ] The morning report shows the last sync time, warns on a stale sync and on a near secret expiry. Verify by: the checks with canned times, then one live report.
7. [ ] No contact data, codes, keys or brief text in the repo. Verify by: the phase 1 privacy search, rerun.

## Dependencies

### Prerequisites
- Phase 1 live, including PR 207 (log types, icons, Outlook links, Read again).
- Ralph adds `Application Calendars.Read` for the Graph app on the "Market access sync" scope, for contactus@ (FR-06).
- Ralph records the current Graph secret's expiry date (2027-11-13) as `MEET_GRAPH_SECRET_EXPIRES` (FR-14), or lets the task set it.

### External Dependencies
- Microsoft Graph (mail and calendar read).
- Azure Table Storage (existing account).
- The existing email sender, for the sync alert.

## Owner Clarifications

| Topic | Question | Answer | Impact |
|-------|----------|--------|--------|
| Sending | Bring sending into phase 2? | No; link to Outlook for now (2026-11-24) | FR-11 `mailto:` link; no send code |
| Briefs | One text per campaign, or per person? | One per campaign (2026-11-24) | FR-04 single text, a key per member |
| Calendar timing | Log meetings when booked, or when held? | Both: when booked and when completed (2026-11-24) | FR-07 booked, moved, canceled and held entries |
| Calendar mailboxes | Which calendars? | Ralph's and contactus@ (2026-11-24) | FR-06; Exchange step for contactus@ |
| Step audiences | Do the "who" choices cover it? | Yes (2026-11-24) | FR-09 four choices |
| Scheduled jobs | Which belong in phase 2? | The daily follow-up job, the sync alert and the secret warning (2026-11-24) | FR-12 to FR-14; purge and LinkedIn reminder deferred |

## Assumptions

- **Code format:** `<prefix>-NNN`, prefix from the slug. Affects FR-03; easy to change before the first codes exist.
- **Step anchors:** "first email sent" and "first meeting held" are enough. "Days after added to the campaign" can be added if needed. Affects FR-09.
- **Catch-up window:** a step day missed by up to 7 days still creates its follow-up. Affects FR-10.
- **Calendar window:** 30 days back, 90 ahead. Affects FR-06.
- **Held counts, booked does not:** for calendar meetings only, so a booked meeting that never happens does not inflate results. `/meet` keeps its phase 1 rule. Affects FR-08.
- **Job time:** 11:00 UTC, before the morning report. Affects FR-12.
- **Alert recipient:** the morning report's recipient. Affects FR-13.

## Unresolved Questions

- [ ] None blocking. The assumptions above stand unless Ralph changes them in review.

---

*AI-optimized specification. Original design: `design.md`.*
