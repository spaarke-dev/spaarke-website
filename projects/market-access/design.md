# Market access: contacts and activity

Design notes from the 2026-11-19 session. The writer asked how Spaarke tracks its contacts and outreach, and whether that should be part of the website platform, covering LinkedIn, website activity and the email lead generation that is about to start. `spec.md` is the implementation spec.

## The problem

Spaarke has no single record of the people it is talking to.

- **The website saves leads but never brings them together.** Every form writes to its own Azure table: ContactSubmissions, DemoRequests, DesignPartnerApplications, EarlyReleaseSignups, InvestorOverviewRequests and MeetingBookings. The morning report reads three of them. Nothing reads the rest.
- **Engagement goes only to App Insights.** That covers brief reads, Ask AI clicks and tagged visits. Answering "did this person engage?" means a script and a KQL query.
- **Outreach is tracked by hand.** The TLTF Summit 2026 investor outreach lives in CSV and JSON files in the private research folder: the send list, replies, bounces, brief keys and Summit contacts. A Python script reads clicks back from App Insights.
- **LinkedIn leads have nowhere to go.** The paid program starts 2026-12-19. Lead Gen Form leads stay in Campaign Manager, and the ads plan still lists "where do leads live" as an open decision.
- **The post-Summit thank-yous have no tracker.** About a dozen personalized notes need writing now, with no place to record who was thanked, when, and whether they replied.

## The idea

Add a signed-in admin area to the website, called market access, that holds:

- **Contacts and organizations.** One record per person, keyed by email, and one per organization, keyed by domain.
- **One activity log.** Every touchpoint becomes a dated entry on the contact: form submissions, meeting bookings, brief reads, Ask AI clicks, emails sent and received, LinkedIn leads, in-person meetings and notes.
- **Campaigns** tied to UTM tags, so LinkedIn, email and the website report in one place.
- **Follow-ups**, small to-dos on a contact with a due date and status. The thank-yous are the first use.

## Outreach projects: run the TLTF playbook again

The writer wants to repeat the TLTF Summit 2026 pattern for other campaigns. That pattern was:

1. Build a target list.
2. Give each recipient a personal tracking code and private brief link.
3. Send personalized emails.
4. Track bounces, replies, brief reads, Ask AI clicks and meetings booked.
5. Run the follow-ups.

So a campaign is more than a UTM tag. It is an **outreach project** with:

- a **recipient list**, where each member is a contact plus a per-recipient code, an optional brief key, a template or group label, and a status: planned, sent, bounced, replied, engaged, meeting, or done;
- **results**: a funnel (sent, delivered, engaged, replied, meeting) and a per-recipient table, built from the activity log, not counted by hand;
- **follow-ups** created in bulk for a segment, such as "thank everyone I met at the Summit."

In phase 1, emails are still written and sent outside the admin area, through the existing private scripts or Outlook. Mailbox sync records each sent email, reply and bounce against the right member. In phase 2, composing and sending move into the admin area.

Each part of the site that collects a lead also writes an activity. Nothing already built gets replaced: the existing tables, emails and morning report keep working.

## Decisions made in the session

- **Store:** the website's existing Table Storage account. Not Dataverse, and not an off-the-shelf CRM.
- **Email:** sync automatically from Ralph's Spaarke mailbox through Microsoft Graph, limited to that one mailbox, the same way `/meet` is limited to its host calendar. Only mail with a known contact is logged.
- **Investors:** in the same store, but tagged and visible only to an `investor` role.
- **Users:** Ralph only for now, with roles designed so the team can be added later.
- **Public repo:** no contact data, lists or mailbox addresses in git. Imports read from the private folder at run time.

## Phases

1. **Phase 1:** the log, contact and organization views, campaigns, follow-ups, mailbox sync, imports (the Summit and outreach history, LinkedIn CSVs), and site writers.
2. **Phase 2:** write and send personalized email from the admin area, with tracking. Also campaign performance reports, including LinkedIn spend and cost per qualified lead.
