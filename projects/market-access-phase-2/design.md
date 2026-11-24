# Market access phase 2: design

Design notes from 2026-11-24, after phase 1 went live (`projects/market-access/`). Ralph asked for two things in phase 2, target list import and campaign codes, and listed six things he noticed while using the admin area. This note answers each, proposes the scope, and lists the decisions needed before `spec.md` is written.

## Where phase 1 stops

Phase 1 set out to make the TLTF Summit 2026 outreach repeatable. That pattern has five steps:

1. Build a target list.
2. Give each recipient a personal code and private brief link.
3. Send personalized emails.
4. Track bounces, replies, brief reads, Ask AI clicks and meetings.
5. Run the follow-ups.

Steps 4 and 5 work for any campaign. Steps 1 and 2 still depend on the private scripts and a TLTF-only import:

- There is no way to add a contact by hand, and the only list imports are the TLTF script and the LinkedIn Lead Gen file. "Add members" takes only people who are already contacts.
- Codes and brief keys are made by the private scripts. The `PrivateBriefs` rows and the member labels for TLTF came in through the TLTF import. A new campaign has no way to create them, so its brief reads and Ask AI clicks would not count toward its results.

Phase 2 closes that gap, so the second campaign runs from the admin area.

## Quick fixes on the contact page (Ralph's items 1 to 4)

These are small and need no decisions beyond the labels. They can ship before the rest.

1. **More types in "Log something".** Today the form offers Note, In-person meeting and LinkedIn message. Add:
   - **Phone call**, a new activity type `call`.
   - **Email**, with a choice of sent or received, for mail the sync cannot see (another account, a phone). It writes `email.sent` or `email.received` marked as logged by hand.
2. **An icon for each type on the timeline.** A small colored circle with a Fluent icon before each entry, one per group, so the type reads at a glance:
   - forms;
   - meetings (booked, moved, canceled, in person, from the calendar);
   - email (sent, received, bounced);
   - brief reads and Ask AI clicks;
   - LinkedIn;
   - notes and calls;
   - follow-ups done.
3. **A link to each email.** The timeline already shows "Open in Outlook" when an entry has an Outlook link. None does today, because:
   - all 102 email entries came from the TLTF import, which read saved `.eml` files that carry no Outlook link;
   - when the mail sync later read the same messages, it found them already logged and skipped them, link included.

   The fix is for the sync to add the Outlook link to an entry it finds already logged. For the entries already there, a one-time run reads each mailbox's sent and received mail again from before the TLTF sends and adds the links. One limit: a link to a contactus@ message opens only for someone with access to that mailbox in Outlook.
4. **Clickable email address in the profile.** Make the address a `mailto:` link, which opens a new message in Outlook (or whatever mail app the computer uses) with the address filled in. Make the phone number a `tel:` link at the same time.

## Calendar entries (item 5)

The sync reads mail only, so a meeting sent from Outlook never reaches the timeline. The only meeting entries today come from `/meet` bookings and the Summit calendar import.

**Proposal:** the sync also reads the calendar of each synced mailbox that allows it. For each event with at least one attendee who is a contact, it logs a `meeting.calendar` entry with:
- the subject and time;
- whether it was online (Teams) or in person;
- the attendees who are contacts;
- an "Open in Outlook" link.

Details:

- **Permission.** The Graph app already holds `Application Calendars.ReadWrite` on Ralph's mailbox, because he is a `/meet` host. His calendar needs no tenant change. Any other mailbox would need `Application Calendars.Read` added on the "Market access sync" scope, which Ralph runs in Exchange.
- **No doubles with `/meet`.** A `/meet` booking also lands on the calendar. The sync matches it to the booking's own entry by the event ID and skips it.
- **Changes.** A moved event updates its entry, and a canceled one is marked canceled, the same way `/meet` bookings work.
- **When it counts.** Log the entry when the event is created, dated at its start time, so upcoming meetings show on the contact. A meeting with a campaign member counts as "met" for the campaign only once its start time has passed.
- **What is kept.** Subject, time, attendees who are contacts, and the link. No body, notes or attachments, the same rule as email.

## Follow-ups and follow-up rules (item 6)

**Why there are none:** no follow-up has been created yet. Phase 1 creates follow-ups only by hand:
- one at a time, on a contact;
- in bulk, on a campaign page, for a group (for example everyone marked "met").

Nothing creates them from rules, and the bulk thank-yous for the Summit are still to be made.

**Proposal: follow-up steps on a campaign.** A campaign gets an ordered list of steps. Each step says:

| Field | Example |
|---|---|
| Name | "Second note" |
| When | 7 days after the first email was sent |
| Who | Members whose status is still `sent` (no reply, no meeting) |
| Group | Optional, for example only the "Summit attendee" group |

A daily job turns each step into follow-ups, one per member who matches on that day. Then:
- each follow-up shows in the morning report, on the contact and on the campaign page;
- it still closes itself when the sync sees the email go out;
- a member stops getting new steps once they reply, book a meeting or bounce, or once Ralph marks them done.

The job runs on a GitHub Actions schedule, the same way the mail sync and morning report do.

Phase 2 queues the follow-ups; Ralph still writes and sends them from Outlook. Writing and sending from the admin area was planned for phase 2 in the original design. Whether it stays in phase 2 is a decision below.

## Target list import

A general CSV import at `/admin/import`, beside the LinkedIn one, reusing its column picker:

- **Columns:**
  - required: email;
  - optional: first and last name, title, organization, LinkedIn URL, phone, group label, template label;
  - optional, per row: a personal note that becomes the first timeline entry.
- **Contacts:** new rows become contacts. Existing contacts gain only the fields that are empty, and fields Ralph edited by hand never change, the same rule as every other writer.
- **Campaign:** pick a campaign or create one. Every row becomes a member, with its group and template labels.
- **Visibility:** the import picks "All admins" or "Investor role only" for the contacts it creates.
- **Preview first:** the import shows what it will do before anything is saved:
  - how many rows are new, already contacts or already members;
  - which rows are broken, and why.
- **Safe to repeat:** importing the same file again adds nothing.
- **Add a contact by hand:** a small form on `/admin/contacts` for one person, with the same fields.

## Campaign codes and private briefs

On the campaign page, a **Codes and links** section:

- **Codes:** "Give everyone a code" assigns each member without one a short code, unique across campaigns. The format follows TLTF: a campaign prefix and a number.
- **Private brief (optional):**
  - Ralph writes the campaign's brief text in the admin area. It is stored in `PrivateBriefs`, never in git.
  - Each member gets their own brief key pointing to that text, so a read counts for that member.
  - A group can have its own text, for example a version for each kind of firm.
  - "Turn the briefs off" disables every key in the campaign at once.
- **Links for each member:**
  - the brief link;
  - the Ask AI links, which carry the code and brief key the way the TLTF emails did;
  - a tagged link to any site page.
- **Export:** a CSV of the members with their codes and links, ready for an Outlook mail merge or the private send scripts. It is downloaded to Ralph's computer and never written to the repo.
- **Results:** reads and clicks already count toward the right member through the label. No change is needed there.

## What GitHub does here, and what else it could do

The module is not tied to GitHub's project tools. GitHub runs it in three ways:

- it deploys the site, with a preview for each pull request;
- it runs the mail sync every 15 minutes;
- it runs the morning report each day.

The same scheduler can take on small jobs that keep the module healthy:

- **Follow-up steps:** the daily job above.
- **Sync health:** an email if no mail sync has succeeded for an hour, or a mailbox has failed three runs in a row.
- **Secret expiry:** a warning in the morning report 30 days before the Graph secret expires (2027-11-13). That secret runs both `/meet` and the sync.
- **Retention:** the three-year purge of old activity entries that the privacy page promises. The first entries come due in 2029, so this can wait, but it belongs on the list.
- **LinkedIn reminder:** while a Lead Gen campaign is running, a weekly line in the morning report to upload the latest CSV.
- **Campaign to content calendar:** an optional link from a campaign to its issue on the GitHub Project used for the content calendar, so a LinkedIn or email push shows its results next to its plan.

## Decisions for Ralph

1. **Sending from the admin area:** keep it out of phase 2, so follow-ups are queued and sent from Outlook? Or bring it in?
2. **Briefs:** one brief text per campaign with optional group versions, as above? Or a separate text for each person, as TLTF had?
3. **Calendar:** log meetings when they are created, so upcoming ones show (proposed)? Or only after they happen?
4. **Calendar mailboxes:** Ralph's mailbox only? Or also others, which means adding the calendar role in Exchange?
5. **Follow-up steps:** do the "who" choices cover what you need? They are: no reply, engaged but no meeting, met, and everyone.
6. **The GitHub jobs above:** which belong in phase 2?
