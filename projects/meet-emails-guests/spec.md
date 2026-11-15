# Meeting Emails and Guests: AI Implementation Specification

> **Status**: Approved 2026-11-13
> **Created**: 2026-11-13
> **Source**: Owner request after the /meet Graph cutover (2026-11-13), plus
> the answers to three design questions. Builds on
> [`../meet-graph-booking/spec.md`](../meet-graph-booking/spec.md).

## Executive Summary

The /meet Graph flow sends one email to the visitor: the Outlook invitation
that Exchange sends when the event is created. Nothing branded follows it,
nothing reminds the visitor as the meeting nears, and nobody else can be
brought along except by forwarding. This project adds Spaarke-branded emails
through SendGrid (a confirmation, a reminder 24 hours before, and a reminder
1 hour before, plus notices when a meeting moves or is cancelled), lets the
visitor add up to five guests when booking and later from the manage page,
and runs the reminders from a small Azure Logic App that calls a protected
endpoint every five minutes.

The first real booking after the cutover showed the gap: the test used the
host's own address, Exchange sends no invitation to the organizer, and so no
email arrived at all. A SendGrid confirmation goes out whatever the address.

## Scope

### In Scope

- Branded HTML email template (with a plain-text part) shared by every
  visitor email: Spaarke logo, meeting time in the reader's zone, a Join
  Microsoft Teams button, and Reschedule and Cancel links for the booker.
- Confirmation email on booking, to the booker.
- Reminder emails 24 hours and 1 hour before the meeting, to the booker and
  every guest.
- Notice emails when the meeting moves or is cancelled, to the booker and
  every guest.
- Guests: up to five addresses on the booking form, added as attendees on the
  Outlook event, so each gets the invitation and the Teams link.
- Manage page: list, add, and remove guests (five at most).
- `POST /api/meet/reminders`, protected by a shared secret, which sends the
  reminders that are due.
- An Azure Logic App (Consumption plan) in `rg-spaarke-website` that calls the
  endpoint every five minutes.
- A development-only preview route that renders each email in the browser.
- Privacy paragraph and setup guide updates.

### Out of Scope

- Calendar (.ics) attachments. The Outlook invitation already puts the
  meeting on the calendar; a second calendar item would create duplicates.
- Reminders by text message (a separate spec, "Text Meet SMS", is in
  progress in another session).
- Letting guests move or cancel the meeting. Only the booker holds the
  manage link.
- Changing reminder times per booking, or a visitor opt-out of reminders.
- Branded emails for the Bookings embed fallback.
- Translating emails.

### Affected Areas

- `src/lib/meet/emails.ts` (new): template, message builders, send helpers.
- `src/lib/meet/reminders.ts` (new): finds due reminders and claims them.
- `src/app/api/meet/reminders/route.ts` (new).
- `src/app/api/meet/guests/route.ts` (new): add and remove guests.
- `src/app/api/meet/dev/email-preview/route.ts` (new, development only).
- `src/app/api/meet/book/route.ts`, `reschedule/route.ts`, `cancel/route.ts`:
  send the new emails; book accepts guests.
- `src/lib/meet/graph.ts`: attendees as a list; `setAttendees`.
- `src/lib/meet/store.ts`: new booking fields.
- `src/lib/meet/service.ts`: guest validation.
- `src/components/meet/MeetBookingFlow.tsx`, `ManageBooking.tsx`: guest UI.
- `src/app/privacy/page.tsx`, `docs/meet-graph-booking.md`,
  `.env.local.example`.

## Requirements

### Functional Requirements

1. **FR-01 Email template.** One table-based HTML layout, 600 pixels wide,
   inline styles only, readable in Outlook (desktop and web), Gmail, and Apple
   Mail. Header: `public/images/email/logo-color.png` loaded from `SITE_URL`
   on a white card, with alt text "Spaarke". Body: a heading, the date and
   time in the reader's time zone with the zone name, the 30-minute length,
   and a short line of copy. A **Join Microsoft Teams meeting** button in the
   site's CTA blue, with the raw link underneath for clients that block
   buttons. For the booker only: **Reschedule** and **Cancel** links to the
   signed manage URL. Footer: why they got the email, and that a reply
   reaches the Spaarke team. Every email has hidden preview text and a
   plain-text part with the same content. Acceptance: the preview route
   renders every email type; a real send renders correctly in Outlook web
   and on a phone.
2. **FR-02 Sender.** From `SENDGRID_FROM_EMAIL` with the display name
   "Spaarke"; reply-to `MEET_HOST`, so replies reach the host.
3. **FR-03 Confirmation.** After the event is created, `/api/meet/book` sends
   the confirmation to the booker: "You're booked: {weekday, date} at {time}".
   It lists any guests and says they received the invitation. It is sent
   even when the booker's address is the host's. A send failure is logged
   (App Insights `step: meet.email.confirmation`) and never fails the
   booking. Acceptance: a booking with an outside address receives both the
   Outlook invitation and the confirmation.
4. **FR-04 Reminders.** Two reminders: 24 hours before and 1 hour before.
   Each goes to the booker (with manage links) and to each guest (without
   them). Rules:
   - The 24-hour reminder is due from 24 hours before the start until 20
     hours before; the 1-hour reminder from 60 minutes before until 10
     minutes before. A run that finds a reminder past its window skips it.
   - A reminder is skipped when the booking or the latest move happened too
     shortly before it fell due: 12 hours for the 24-hour reminder, 30
     minutes for the 1-hour one. In practice: a meeting booked 25 hours ahead
     gets no 24-hour reminder, since the confirmation arrived an hour earlier.
   - Cancelled, failed, and pending bookings get no reminders.
   - Each reminder is sent at most once per meeting time. The row records the
     start time each reminder was sent for (`reminder24hFor`,
     `reminder1hFor`); a move changes the start, so both reminders apply
     again for the new time.
   Acceptance: the checks in `npm run meet:check` cover the windows and the
   skip rules; a real booking receives the 1-hour reminder within five
   minutes of 60 minutes before the start.
5. **FR-05 Reminder endpoint.** `POST /api/meet/reminders` with header
   `Authorization: Bearer <MEET_CRON_SECRET>`, compared in constant time.
   Anything else gets 401, and the route returns 404 when the secret is not
   set. It queries `MeetingBookings` for status `booked` or `rescheduled`
   with a start between now and 25 hours from now, decides which reminders
   are due, claims each one by writing the `…For` field with the row's ETag
   (a 412 means another run claimed it, so skip), then sends. It runs in
   under 30 seconds and returns counts: `{ checked, sent, skipped, failed }`.
   A failed send clears the claim so the next run retries it while the window
   is open. It also checks the event on Graph first and skips a meeting that
   was cancelled in Outlook.
6. **FR-06 Scheduler.** A Logic App, `logic-spaarke-meet-reminders`, in
   `rg-spaarke-website`: a Recurrence trigger every 5 minutes and one HTTP
   action that POSTs to `{SITE_URL}/api/meet/reminders` with the bearer
   header held as a secure parameter, so it does not show in the run history.
   A 1-minute timeout and no retry, since the next run covers a miss. The
   secret is generated into Key Vault as `meet-cron-secret` and copied to
   the SWA setting `MEET_CRON_SECRET` and the Logic App, the same pattern as
   the other secrets. The setup guide gives the `az` commands.
7. **FR-07 Moved and cancelled notices.** Reschedule sends "Your meeting
   moved to {new time}" to the booker and guests. Cancel sends "Your meeting
   on {date} is cancelled" with a **Book a new time** button to /meet. These
   go out alongside the Outlook updates Exchange already sends. They never
   fail the request.
8. **FR-08 Guests on the booking form.** An optional "Invite others" field
   under the details: one address per entry, with an Add button and a remove
   button per guest, five at most. Each guest must be a valid email address,
   not the booker's, not `MEET_HOST`, and not already listed (compared case
   insensitively). Guests become required attendees on the event, so Exchange
   sends each the invitation with the Teams link. The confirmation lists them.
   Acceptance: a booking with two guests creates one event with three
   attendees.
9. **FR-09 Guests on the manage page.** The manage page shows the current
   guests with a Remove button each, and an Invite field (five in total).
   `POST /api/meet/guests` takes the manage token and the full new guest
   list, validates it as in FR-08, PATCHes the event's attendees (booker plus
   guests), and updates the row. Exchange sends the invitation to added
   guests and a cancellation to removed ones. Limits: 10 guest changes per
   booking, plus the existing per-IP rate limit (bucket `meet-guests`, 5 per
   minute). Rejected for cancelled or past meetings.
10. **FR-10 Data.** New `MeetingBookings` fields: `guests` (a JSON array of
    addresses, at most five), `joinUrl` (stored at booking time, for
    reminders), `reminder24hFor`, `reminder1hFor`, `guestChanges`, and
    `movedAt`. Older rows without them work: missing `joinUrl` is read from
    the event when a reminder is sent.
11. **FR-11 Team email.** The team notification lists guests.
12. **FR-12 Analytics.** Plausible `Meeting Guests Updated`. The booking event
    gains a `guests` count property.
13. **FR-13 Privacy.** The "Meeting bookings" paragraph adds: guest addresses
    the booker enters are stored with the booking and receive the invitation
    and reminders; reminder emails are sent through SendGrid.
14. **FR-14 Preview.** `GET /api/meet/dev/email-preview?type=confirmation|
    reminder24|reminder1|moved|cancelled&as=booker|guest` returns the HTML
    with sample data. It returns 404 unless `NODE_ENV` is `development`.
15. **FR-15 Dev mock.** With `MEET_DEV_MOCK=1`, emails are written to the
    server log (subject and recipient) instead of sent, and the reminder
    endpoint works against the in-memory table.

### Non-Functional Requirements

- **NFR-01 Security.** The cron secret is at least 32 characters and never
  logged. Guest addresses come only from the booker (behind reCAPTCHA at
  booking, behind the signed manage token later), capped at five, so the
  invitation cannot be turned into a bulk sender. Email HTML escapes every
  visitor-supplied value; subjects strip line breaks.
- **NFR-02 Reliability.** A missing or failing SendGrid never blocks a
  booking, move, cancel, or guest change. The reminder endpoint is safe to
  run twice at once (ETag claims) and safe to miss runs (windows, not
  instants).
- **NFR-03 Deliverability.** SendGrid sends from the verified sender already
  in use, with a plain-text part and no link shorteners. Click tracking is
  turned off for these messages, so the Teams and manage links stay as
  written.
- **NFR-04 Accessibility.** Emails use real text (not images) for content,
  at least 16-pixel body text, sufficient contrast, and `role="presentation"`
  on layout tables. The guest fields have labels and announce errors.
- **NFR-05 Voice.** All copy passes `npm run voice:lint`: no em dashes, US
  spelling, plain words.
- **NFR-06 Dependencies.** No new runtime packages. The template is a
  TypeScript function that returns strings.
- **NFR-07 Cost.** The Logic App runs 8,640 times a month with one action
  each, which is well under a dollar.

## Technical Constraints

### Tech Stack

- Next.js 16 App Router on Azure Static Web Apps (hybrid, no timers).
- Microsoft Graph v1.0 as in the booking spec; SendGrid via `@sendgrid/mail`.
- Azure Table Storage via `@azure/data-tables` (ETag merges).
- Azure Logic Apps, Consumption plan.

### Key Decisions

- **SendGrid sends the branded emails; Exchange still sends the invitation.**
  The invitation is what puts the meeting on the visitor's calendar and
  carries updates. The branded emails sit beside it and never replace it.
- **Reminders by polling, not by scheduled sends.** SendGrid can schedule a
  send only 72 hours ahead, and moves and cancels would need each scheduled
  send cancelled. A five-minute poll that reads the table is simpler and
  always uses the current time and guest list.
- **Logic App over GitHub Actions.** GitHub's scheduled runs are often 10 to
  30 minutes late, which breaks the 1-hour reminder.
- **Guests are attendees, not a mailing list.** Adding them to the event
  keeps Exchange in charge of invitations, updates, and cancellations, and
  the Teams lobby treats them like any other invitee.

## Success Criteria

1. [ ] `npm run typecheck`, `npm run lint`, `npm run voice:lint` (on the spec,
   docs, and email copy), and `npm run meet:check` pass. Verify by: CI and a
   local run.
2. [ ] Each email type renders in the preview route in light and narrow
   widths. Verify by: browser pane screenshots.
3. [ ] A real booking from an outside address with one guest delivers the
   invitation to both, the confirmation to the booker, and a team email.
   Verify by: the owner's inboxes.
4. [ ] The 1-hour reminder arrives for a real booking, once. Verify by: a
   booking about 70 minutes ahead (with `MEET_MIN_NOTICE_HOURS=1` locally
   against the Dev tables).
5. [ ] Adding and removing a guest from the manage page updates the event
   and sends the invitation and cancellation. Verify by: `npm run meet:graph
   -- event <id>` and the guest's inbox.
6. [ ] The Logic App's run history shows 200 responses every five minutes.
   Verify by: the Azure portal or `az`.
7. [ ] A reminder is not sent twice when the endpoint is called twice at
   once. Verify by: two parallel calls in the local test.

## Dependencies

### Prerequisites

- The Graph booking flow (PR 142), live since 2026-11-13.
- `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` set in production (they are).

### External Dependencies

- Key Vault secret `meet-cron-secret`; SWA setting `MEET_CRON_SECRET`.
- The Logic App resource. Claude can create it with `az` after sign-off, or
  the owner can run the commands in the setup guide.

## Owner Clarifications

| Topic | Question | Answer | Impact |
|-------|----------|--------|--------|
| Missing email | Why no email after the test booking? | The booker address was the host's; Exchange does not invite the organizer | Confirmation goes through SendGrid for every booking (FR-03) |
| Emails | Which emails besides the Outlook invitation? | Confirmation, 24 hours, 1 hour | FR-03, FR-04 |
| Guests | How should visitors bring colleagues? | Guest field on the form and on the manage page, five at most; only the booker moves or cancels | FR-08, FR-09 |
| Scheduler | What runs the reminders? | Azure Logic App every 5 minutes | FR-05, FR-06 |

## Assumptions

- **Moved and cancelled notices**: the branded set includes them so every
  email the visitor gets from us looks the same. Drop FR-07 if the Outlook
  updates are enough.
- **Guests get reminders but no confirmation**: their first email is the
  Outlook invitation, which already names the time and Teams link.
- **Guest time zone**: unknown, so guest emails show the booker's zone with
  its name.
- **Skip rules of 12 hours and 30 minutes** for a reminder that would follow
  the confirmation or a move too closely.
- **Logic App name and location**: `logic-spaarke-meet-reminders`, same
  region as the storage account.

## Unresolved Questions

- [ ] Does a PATCH of `attendees` by the organizer send the invitation only
  to the added guests, or an update to everyone? Blocks: nothing, but the
  manage page copy depends on it. Verify in the local test against the real
  mailbox before writing the copy.

---

*AI-optimized specification. Source: owner request and design questions,
2026-11-13.*
