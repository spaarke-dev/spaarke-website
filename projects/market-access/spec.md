# Market Access (Contacts, Activity, Outreach Projects): AI Implementation Specification

> **Status**: Approved by owner 2026-11-19 (with the mailbox registry added); ready for project-pipeline
> **Created**: 2026-11-19
> **Source**: `design.md` (2026-11-19 session) and the owner's answers recorded below

## Executive Summary

Spaarke records leads in six separate tables, engagement in App Insights, and outreach in hand-kept private files, so no one place shows who Spaarke is talking to or what came of it. This project adds a signed-in admin area to the website, called **market access**. It holds:

- contacts and organizations;
- a single activity log;
- outreach projects (campaigns) with recipient lists and measured results;
- follow-ups.

Every site writer feeds the log, and so does Ralph's mailbox through Microsoft Graph. Phase 1 lets the TLTF Summit 2026 outreach pattern be run again and measured: target list, personal codes, personalized emails, results, follow-ups.

## Scope

### In Scope (Phase 1)

**Admin area and roles**
- `/admin`, signed in with Microsoft Entra ID.
- Roles `admin` and `investor`.
- `noindex`, and disallowed in robots.

**Data model and reads**
- Contacts, organizations and the activity log.
- Campaigns (outreach projects) and their members.
- Follow-ups.

**Site writers**
- Every existing lead and engagement writer also records an activity:
  - the contact, demo request, design partner, early access and investor overview forms;
  - meeting booking, reschedule and cancel;
  - brief reads;
  - Ask AI clicks.

**Mailbox sync**
- Sync several mailboxes, managed from the admin area: Ralph's mailbox and contactus@spaarke.com to start, with more added later.
- Log mail with known contacts. A mailbox can also be set to queue mail from new senders for triage.
- Detect bounces.

**Imports**
- A local CLI imports the private TLTF history: the outreach list, brief keys, Summit people and calendar.
- An admin-page upload imports LinkedIn Lead Gen Form CSVs.
- A one-time backfill copies the existing site tables and the App Insights engagement events.

**Follow-ups**
- Per contact and in bulk for a campaign segment.
- Each has a due date and status.
- A follow-up closes on its own when the sync sees the email go out.

**Reporting**
- Campaign results: the funnel and a per-recipient table.
- The morning report adds follow-ups due and new contacts.

**Privacy**
- Update the privacy page to cover these records.
- A delete-contact action in the admin area.

### Out of Scope (Phase 1)
- Writing or sending email from the admin area. That is Phase 2.
- LinkedIn API integration. Leads come in by CSV only; the 2026-10-28 decision rules out the Insight Tag and the Conversions API.
- Ad spend, cost per lead and other paid-media metrics. That is Phase 2.
- Two-way sync with Dataverse, HubSpot or any other CRM.
- Users other than Ralph. The roles are built so the team can be added later.
- Sending from any synced mailbox, shared or personal. That is Phase 2.
- Changes to the existing lead tables, emails or morning report, other than the additions listed above.

### Affected Areas
- `src/app/admin/`: new admin pages.
- `src/app/api/admin/`: new admin API routes.
- `src/lib/market/`: new module with the store, `recordActivity`, contact resolution, Graph mail sync, importers and campaign results.
- Writers that gain one `recordActivity` call each:
  - `src/lib/storage.ts`
  - `src/app/api/early-release/route.ts`
  - `src/lib/investor-overview.ts`
  - `src/lib/meet/service.ts` (or `store.ts`)
  - `src/app/brief/[key]/route.ts`
  - `src/app/ask/[provider]/route.ts`
- `src/lib/reports/daily.ts`: add follow-ups due and new contacts.
- `staticwebapp.config.json`: the auth provider and the route rules for `/admin/*` and `/api/admin/*`.
- `src/app/robots.ts`: disallow `/admin`.
- `src/app/privacy/page.tsx`.
- `.github/workflows/`: a mail sync schedule, following the `daily-report.yml` pattern.
- `scripts/market/`: CLI importers. They take the private paths as arguments, and no data is committed.

## Requirements

### Functional Requirements

**Access**

1. **FR-01 Sign-in.** `/admin/*` and `/api/admin/*` need an Entra ID sign-in through SWA authentication (the site is on SWA Standard) and the `admin` role.
   - Each API route also checks the `x-ms-client-principal` header on the server, so the route config is not the only guard.
   - Acceptance: a signed-out request gets a redirect (pages) or 401 (API), and a signed-in user without the role gets 403.
2. **FR-02 Investor restriction.** Contacts, organizations, activities and campaigns carry `visibility`: `general` or `investor`.
   - Records marked `investor` are left out of every list, search, count and export unless the user has the `investor` role.
   - Acceptance: an admin without the `investor` role sees no investor records and no counts that include them.

**Data**

3. **FR-03 Contacts.** One record per person:
   - keyed by normalized email (lower-cased and trimmed), with alternate emails linked;
   - fields: name, title, organization link, LinkedIn URL, phone, kind (prospect, design partner, customer, investor, partner, press, other), stage (new, engaged, conversation, opportunity, active, closed), tags, owner, visibility, created and updated times, and a source (the first activity);
   - edit, merge and delete actions.
   - Acceptance: a form submitted twice with different capitalization gives one contact with two activities.
4. **FR-04 Organizations.** Keyed by email domain, with a manual override.
   - Free-mail domains (gmail.com, outlook.com and similar) never create an organization.
   - Fields: name, website, kind, notes, visibility.
   - Acceptance: two contacts at the same company domain list under one organization.
5. **FR-05 Activity log.** An append-only list of dated activities on a contact. Each activity has:
   - a type and a source;
   - campaign and member links where known;
   - UTM fields;
   - a short summary, and for email a subject plus a link back to Outlook. No email body is stored.
   - Types:
     - `form.contact`, `form.demo`, `form.design_partner`, `form.early_release`, `form.investor_overview`;
     - `meeting.booked`, `meeting.rescheduled`, `meeting.cancelled`, `meeting.in_person`;
     - `brief.read`, `ask_ai.click`;
     - `email.sent`, `email.received`, `email.bounced`;
     - `linkedin.lead`, `linkedin.message`;
     - `note`, `followup.done`.
   - Each record has an idempotency key (source plus source ID), so re-running a sync or import never duplicates entries.
   - Acceptance: re-running any import or sync leaves the activity count unchanged.

**Site writers**

6. **FR-06 Site writers.** Each existing writer calls `recordActivity()` after its own save succeeds.
   - Writers with an email resolve or create the contact.
   - Brief reads and Ask AI clicks have no email. They resolve through the recipient code (`src`) or brief label to a campaign member, and are skipped if neither resolves.
   - A failure in `recordActivity` is logged and never fails or slows the visitor's request. It runs after the response or in a fire-and-forget promise with a timeout.
   - Acceptance: with the market tables unavailable, every form still succeeds and sends its email.

**Mailbox sync**

7. **FR-07 Mail sync.** A Graph client reads the Inbox and Sent Items of each mailbox registered for sync.
    - It uses app-only auth and the same app pattern as `/meet`.
    - Mail access is granted through Exchange RBAC for Applications: `Application Mail.Read`, scoped to a management scope that covers only the synced mailboxes. There is no tenant-wide mail consent.
    - It reads the sender, recipients and subject of messages since each mailbox's last checkpoint.
    - An email activity is written when a counterpart address matches a known contact, and records which mailbox it came from.
    - In `known-only` mode, all other mail is ignored and never stored.
    - Bounces (non-delivery reports) are detected and logged as `email.bounced` against the original recipient.
    - A scheduled GitHub Action runs it every 30 minutes, calling a bearer-token route like `/api/reports/daily`. Mailboxes are synced one at a time, and a failure in one does not stop the others.
    - Acceptance: a sent email to a known contact appears on their timeline within 30 minutes. Mail to an unknown address from a `known-only` mailbox creates nothing.
8. **FR-08 Mailbox registry.** `/admin/mailboxes` lists the synced mailboxes and adds, pauses or removes them. The list is kept in `MaMailboxes`, not in code or app settings.
    - Each mailbox has:
      - an address and a label;
      - a kind (personal or shared);
      - a mode (`known-only`, or `capture-new`);
      - a default visibility for contacts it creates;
      - an enabled flag;
      - its last sync time and last error.
    - Setup starts with Ralph's mailbox (`known-only`) and contactus@spaarke.com (`capture-new`, visibility `general`).
    - Adding a mailbox in the admin area does not grant access. The mailbox must also be inside the Exchange management scope; the Dependencies section gives the admin steps. Until it is, the first sync fails with a clear "no access" error shown on the page, and the other mailboxes still sync.
    - **`capture-new` mode** is for shared inboxes, where most first contacts arrive from people Spaarke does not know yet:
      - inbound mail from an unknown sender goes to a **triage queue** (`/admin/triage`) with the sender, subject, time and Outlook link;
      - Ralph accepts it (creating a contact and an `email.received` activity, with any earlier queued messages from that sender attached), links it to an existing contact, or dismisses it;
      - dismissing a sender, or a whole domain, stops it from queueing again;
      - nothing becomes a contact without a person choosing to accept it;
      - mail the mailbox sends to an unknown address is not queued.
    - Acceptance: a test email to contactus@spaarke.com from a new address appears in triage within 30 minutes. Accepting it creates one contact and one activity. A dismissed sender does not reappear.

**Outreach projects**

9. **FR-09 Campaigns.** A campaign has a slug, name, kind (outreach, event, LinkedIn, website, other), UTM campaign value, dates, owner, visibility and notes.
   - It has a list of **members**. Each member has:
     - a contact;
     - a per-recipient code;
     - an optional brief key and label;
     - a group and template label;
     - a status: planned, sent, bounced, replied, engaged, meeting, done.
   - Statuses update from the activity log:
     - a sent email to the member sets `sent`;
     - a bounce sets `bounced`;
     - a reply sets `replied`;
     - a brief read or click after the quiet window sets `engaged`;
     - a meeting sets `meeting`.
   - A manual status override is kept and shown.
   - Acceptance: importing the TLTF list and its history reproduces the counts in the private `index.csv`: 81 sent, the bounces and the replies.
10. **FR-10 Results.** The campaign page shows two things.
   - A funnel: members, sent, delivered (sent minus bounced), engaged, replied, meeting.
   - A table, one row per member, with last activity and status, filterable by status and group.
   - Engagement uses the scanner filter from the private `track.py`: ignore the first 15 minutes after a recipient's first hit, multi-hit bursts, and gateway-rewritten codes.
   - Acceptance: the TLTF engaged list matches `track.py` output for the same window.

**Follow-ups**

11. **FR-11 Follow-ups.** A follow-up belongs to a contact and optionally a campaign.
    - Fields: title, due date, status (todo, drafted, sent, replied, skipped), notes.
    - Bulk create: pick campaign members by status or tag and add one follow-up to each, for example "Thank-you after the Summit."
    - Mail sync moves a `todo` or `drafted` follow-up to `sent` when an email to that contact is seen after the follow-up was created, and to `replied` on their reply.
    - Acceptance: after Ralph sends a thank-you from Outlook, that follow-up shows `sent` within 30 minutes, with no manual step.

**Imports**

12. **FR-12 TLTF import (CLI).** `scripts/market/import-tltf.mjs` takes paths to the private files: the outreach list CSV, the brief keys CSV, the Summit `people.json`, and the calendar export.
    - It creates the `tltf-2026` campaign with visibility `investor`.
    - It creates the members with their codes and brief keys, and the contacts with titles, LinkedIn and context notes.
    - It adds `meeting.in_person` activities for the Summit meetings.
    - Acceptance: it runs against the private folder from a local shell with `STORAGE_CS` set, and no file under the repo changes.
13. **FR-13 Backfill.** A one-time CLI copies existing rows into contacts and activities, keeping their timestamps and UTM fields:
    - ContactSubmissions, DemoRequests, DesignPartnerApplications, EarlyReleaseSignups, InvestorOverviewRequests and MeetingBookings.
    - The App Insights `brief.read` and `ask_ai.click` events, queried with an explicit `--offset 90d`.
    - It must run before 2027-02-11, when the 2026-11-13 send data leaves App Insights' 90-day retention.
    - Acceptance: the counts per source match the source tables.
14. **FR-14 LinkedIn lead import.** The admin page takes a Campaign Manager Lead Gen Form CSV export.
    - The user picks or creates a campaign, maps the columns (with defaults for LinkedIn's standard headers), previews, and confirms.
    - Each lead becomes a contact and a `linkedin.lead` activity.
    - The uploaded file is parsed in memory and not stored.
    - Acceptance: importing the same file twice adds nothing the second time.

**Admin pages**

15. **FR-15 Admin pages.**
    - `/admin` shows follow-ups due and overdue, recent activity, and new contacts this week.
    - `/admin/contacts` has search (name, email, organization) and filters (kind, stage, tag, campaign).
    - `/admin/contacts/[id]` shows the profile, timeline, campaign memberships and follow-ups, with add-note and log-activity actions for in-person or LinkedIn touches.
    - `/admin/organizations` and `/admin/organizations/[id]`.
    - `/admin/campaigns` and `/admin/campaigns/[slug]` show the results and members, with bulk follow-up.
    - `/admin/import` takes the LinkedIn CSV.
    - `/admin/mailboxes` and `/admin/triage` (FR-08).
    - The `/admin` home also shows the triage count.
    - Desktop-first, usable on a phone for looking things up at events.
    - Acceptance: every page renders for the `admin` role and refuses all others.

**Reporting and privacy**

16. **FR-16 Morning report.** `src/lib/reports/daily.ts` adds two sections: follow-ups due today or overdue, and contacts created in the period.
    - Investor records are counted only as a number, with no names, because the email goes to a list.
17. **FR-17 Privacy.** The privacy page describes the contact and activity records (purpose, sources, retention) and how to ask for deletion.
    - The admin area has a delete-contact action that removes the contact, its activities, memberships and follow-ups, and writes a minimal tombstone (a hashed email) so imports do not re-create it.
    - Acceptance: after a deletion, re-running the imports does not bring the contact back.

### Non-Functional Requirements

- **NFR-01 Public repo.** No contact data, recipient lists, codes, brief keys, mailbox addresses, tenant IDs or secrets in git. Tests use made-up data, and imports read private paths given at run time.
- **NFR-02 Secrets.** The Graph client secret is read the same way `/meet` reads its secret. The sync bearer token is a new app setting and GitHub secret.
- **NFR-03 Visitor impact.** The activity writes add no noticeable time to any public route, and a failure is never shown to the visitor (see FR-06).
- **NFR-04 Scale.** Plan for 10,000 contacts and 200,000 activities. A contact page loads in under 1 second, and a campaign of 500 members in under 2 seconds.
  - Table Storage partitioning: activities partitioned by contact; a second index table partitioned by month for the recent-activity views; members partitioned by campaign.
- **NFR-05 Least privilege.** Graph mail access is read-only and limited to the mailboxes in the management scope. No `Mail.Send` in Phase 1. Triage stores only sender, subject, time and link, and dismissed entries are deleted after 30 days.
- **NFR-06 Audit.** Edits, merges, deletions and status overrides write a `who`, `when` and `what` entry to an admin audit table.
- **NFR-07 Voice.** Admin UI text follows the site voice rules: US spelling and no em dashes.

## Technical Constraints

### Tech Stack
- Next.js 16 App Router (TypeScript) hybrid on Azure Static Web Apps, Standard plan.
- Tailwind v4 with the site's v2 tokens, and `@fluentui/react-icons` for icons.
- Azure Table Storage through `@azure/data-tables` and the existing `STORAGE_ACCOUNT_CONNECTION`.
- Microsoft Graph through plain `fetch` with app-only client credentials, the same as `src/lib/meet/graph.ts`.
- GitHub Actions for schedules, the same as `daily-report.yml`.

### Key Decisions
- The store is the website's Table Storage. Not Dataverse, and not an off-the-shelf CRM (owner, 2026-11-19).
- One activity log, fed by every writer. The existing lead tables stay as they are and become sources.
- Email comes from the synced mailboxes, not from hand entry. Only metadata is stored. Mail from unknown senders is stored only in a `capture-new` mailbox's triage queue, until someone accepts or dismisses it.
- Synced mailboxes are configured in the admin area, not in code. Access is granted separately in Exchange.
- Investor records share the store and are hidden by role.
- A campaign is an outreach project with members, not just a UTM tag.
- New tables use the `Ma` prefix: `MaContacts`, `MaOrganizations`, `MaActivities`, `MaActivityByMonth`, `MaCampaigns`, `MaMembers`, `MaFollowUps`, `MaMailboxes`, `MaTriage`, `MaSyncState`, `MaAudit`, `MaTombstones`.

## Success Criteria

1. [ ] Ralph signs in at `/admin` with his work account, and a second test account without the role is refused. Verify by trying both.
2. [ ] The TLTF 2026 campaign shows 81 sent and the same bounces and replies as `index.csv`, and its engaged list matches `track.py`. Verify by side-by-side comparison.
3. [ ] Ralph bulk-creates "Thank-you after the Summit" follow-ups for the people he met, sends them from Outlook, and each shows `sent` within 30 minutes without a manual step. Verify on the campaign page.
4. [ ] A test contact form submission appears as a contact with a `form.contact` activity and its UTM fields. Verify on the preview environment.
5. [ ] A LinkedIn Lead Gen CSV (test data) imports cleanly, and a second import adds nothing. Verify by counts.
6. [ ] With an admin account that lacks the `investor` role, no TLTF investor contact or count appears anywhere. Verify by browsing and searching.
7. [ ] contactus@spaarke.com syncs, a test message from a new sender reaches triage, and a mailbox added at `/admin/mailboxes` that is not yet in the Exchange scope shows a clear error while the others keep syncing. Verify on the mailboxes page.
8. [ ] A repo search finds no contact data, codes or tenant identifiers. Verify by grep in review.

## Dependencies

### Prerequisites
- An Entra app registration for SWA authentication (single tenant), plus a role assignment for Ralph.
- Exchange RBAC for Applications, set up once:
  - a mail-enabled security group (for example "Market access sync") whose members are the synced mailboxes;
  - a management scope over that group's membership;
  - the `Application Mail.Read` role for the Graph app, on that scope.
  - This can be the `/meet` app or a separate one; see the open questions.
- Adding a mailbox later takes two steps: add it to the group in Exchange (an admin task, and it can take up to an hour to apply), then register it at `/admin/mailboxes`. The implementation documents both steps in `docs/market-access-mailboxes.md`.
- contactus@spaarke.com is a normal user mailbox with an Exchange license only, so Graph can read it once it is in the management scope. It needs no Power Apps or other license.
- New app settings: auth client ID and secret, and the sync bearer token. Mailbox addresses go in `MaMailboxes`, not in app settings or code.

### External Dependencies
- Microsoft Graph (mail read).
- Azure Table Storage (existing account).
- App Insights (backfill only).
- LinkedIn Campaign Manager CSV export (manual).

## Owner Clarifications

| Topic | Question | Answer | Impact |
|-------|----------|--------|--------|
| Store | Where do contacts and activity live? | Website Table Storage | No Dataverse or CRM integration; new `Ma*` tables |
| Email capture | How does email reach the log in Phase 1? | Auto-sync Ralph's mailbox | Graph mail read, limited to the synced mailboxes; FR-07 and FR-11 automation |
| Investors | How are investor contacts handled? | Same store, restricted | `visibility` field and an `investor` role (FR-02) |
| Users | Who signs in? | Ralph only for now | One role assignment; roles still built in |
| Mailboxes | Which mailboxes sync? | Ralph's and contactus@spaarke.com, with a way to add more | Mailbox registry, triage for shared inboxes, a group-based Exchange scope (FR-08) |
| contactus mailbox | What kind of mailbox is contactus@spaarke.com? | A normal user mailbox with only an Exchange license; no Power Apps or other license is needed | Graph reads it like any user mailbox in the scope; no mailbox type check at setup. Its registry `kind` is still `shared`, since it is a team inbox in `capture-new` mode |
| Graph app for mail read | Reuse the `/meet` Graph app, or register a separate app? | Reuse the `/meet` app (decided 2026-11-19) | Mail sync reads `MEET_GRAPH_TENANT_ID`, `MEET_GRAPH_CLIENT_ID` and `MEET_GRAPH_CLIENT_SECRET`; no new app or secret. Mail read is its own Exchange scope ("Market access sync") beside the meet hosts scope. The `/meet` secret now also opens mail read on synced mailboxes, so its rotation covers both |
| Form visibility | Should contacts from the website forms start as `general` even when they are investors? | `general` for every form except the investor overview form, whose contacts start as `investor` (decided 2026-11-20) | Task 020 sets visibility per form; Ralph reclassifies by hand when needed |
| Personal mail with contacts | Should mail between Ralph and a market contact be logged when it is personal? | Yes, all mail with a known contact is logged (decided 2026-11-20) | No per-contact exclusion from mail sync; `known-only` still ignores everyone who is not a contact |
| Summit meetings | Should Summit `meeting.in_person` entries come from the calendar import only, or should Ralph confirm which took place? | Import every Summit meeting from the calendar as held; Ralph corrects the ones that did not happen in one pass on the campaign page (decided 2026-11-23) | Task 050 writes a `meeting.in_person` activity per outside attendee, marked as from the calendar; corrections use the member status override |
| Purpose | Is this for repeatable outreach like TLTF? | Yes | Campaigns are outreach projects with members and results (FR-09, FR-10) |

## Assumptions

- **SWA route auth with Next.js hybrid:** assuming `staticwebapp.config.json` route rules protect hybrid Next.js routes. Task 1 confirms this. If they don't, middleware checks `x-ms-client-principal` on its own.
- **contactus@spaarke.com mode:** assuming `capture-new` with triage, since most of its mail comes from people not yet in the system. Ralph's mailbox stays `known-only`, so personal mail is never queued.
- **Sync interval:** 30 minutes is close enough to real time for follow-ups.
- **Email storage:** subject, participants, time and Outlook link only. No bodies or attachments.
- **Retention:** contacts are kept until deleted, and activities for 3 years. Can be changed in the privacy text.
- **TLTF quiet window:** 15 minutes, as in `track.py`.

## Unresolved Questions

- [x] Reuse the `/meet` Graph app for mail read, or register a separate app? Answered: reuse it (see Owner Clarifications).
- [x] Should `meeting.in_person` entries for the Summit come from the calendar import only, or should Ralph also confirm which meetings took place? Answered: import them all, confirm later (see Owner Clarifications).
- [x] Should contacts collected through the website forms (FR-06) start as `general` even when they're investors, with Ralph reclassifying them? Answered: yes, except the investor overview form (see Owner Clarifications).

---

*AI-optimized specification. Original design: `design.md`.*
