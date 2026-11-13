# Meet Page Graph Booking: AI Implementation Specification

> **Status**: Approved 2026-11-13
> **Created**: 2026-11-13
> **Source**: Task brief from the /meet session (2026-11-13), "Bookings now, Graph later"

## Executive Summary

The /meet page embeds a Microsoft Bookings page in an iframe. This project
replaces the embed with a booking flow the site owns: the server reads the
host's free and busy time through Microsoft Graph, the visitor picks a slot in
a picker built from the site's own primitives, and the server creates a Teams
meeting on the host's calendar. Each booking is stored in Table Storage with
its attribution and emailed to the team, like every other lead. The URL stays
/meet, and the Bookings embed stays available behind a setting until the new
flow has proven itself.

## Scope

### In Scope
- Graph client (app-only, client secret) for `getSchedule`, event create,
  event update, and event cancel. Plain `fetch`, no Graph SDK.
- Slot generation from business hours, host time zone, buffers, minimum
  notice, and booking window, shown in the visitor's time zone.
- `GET /api/meet/availability`, `POST /api/meet/book`,
  `POST /api/meet/reschedule`, `POST /api/meet/cancel`.
- `/meet` in Graph mode: date and time picker, details form, confirmation.
- `/meet/manage?t=<token>`: signed reschedule and cancel page (`noindex`).
- Tables `MeetingBookings` and `MeetingSlotLocks`; a SendGrid notification
  for booked, rescheduled, and cancelled meetings.
- `MEET_BOOKING_MODE` cutover setting with the Bookings embed and /contact as
  fallbacks.
- Privacy policy "Meeting bookings" paragraph.
- Setup guide `docs/meet-graph-booking.md`: app registration, Exchange RBAC
  for Applications scope, Key Vault, app settings, secret rotation.
- Slot check script `scripts/check-meet-slots.mts` (`npm run meet:check`).

### Out of Scope
- Writing bookings to the CRM, Dataverse, or the BFF.
- Reminder emails, follow-up sequences, or a SendGrid email to the visitor
  (the Graph invitation is the visitor's confirmation; see Assumptions).
- Several meeting types or durations on one page.
- Holiday calendars (hosts block holidays on their own calendars).
- A daily report section for bookings (a follow-up once data exists).
- Removing the Bookings embed code (a follow-up after cutover).

### Affected Areas
- `src/app/meet/page.tsx`: picks the mode; renders the Graph flow, the embed,
  or the contact fallback.
- `src/app/meet/manage/page.tsx` (new)
- `src/app/api/meet/{availability,book,reschedule,cancel}/route.ts` (new)
- `src/components/meet/` (new): `MeetBookingFlow`, `SlotPicker`,
  `MeetDetailsForm`, `ManageBooking`
- `src/lib/meet/` (new): `config.ts`, `graph.ts`, `slots.ts`, `tz.ts`,
  `tokens.ts`, `bookings-store.ts`
- `src/lib/bookings.ts`: mode selection next to the existing URL check
- `src/lib/email.ts`: `sendMeetingNotification`
- `src/lib/rate-limit.ts`: named buckets so availability and booking limits
  do not share one counter
- `src/app/privacy/page.tsx`, `.env.local.example`, `package.json`

## Requirements

### Functional Requirements

1. **FR-01 App registration.** One Entra app, "Spaarke website booking",
   app-only with a client secret. Calendar access is granted through Exchange
   RBAC for Applications: role `Application Calendars.ReadWrite` on a
   management scope that contains only the host mailbox. The app gets no
   tenant-wide `Calendars.ReadWrite` consent in Entra, because an Entra grant
   applies to every mailbox and adds to the RBAC scope rather than narrowing
   it. Acceptance: `Test-ServicePrincipalAuthorization` shows the role in scope
   for a host and out of scope for a non-host mailbox, and a Graph call
   against a non-host mailbox returns 403.

2. **FR-02 Secrets.** The client secret and the link-signing key
   (`MEET_LINK_SECRET`) are created in the site's Key Vault, which is the record
   for both. The site reads every other secret from a plain app setting, and
   the static web app has no managed identity, so the guide copies each value
   from Key Vault into an app setting with `az`. (A Key Vault reference would
   need a system-assigned identity on the static web app, and Microsoft does
   not document whether references resolve for hybrid Next.js; that is a
   possible later change, not part of this work.) No tenant ID, client ID, mailbox address, or secret appears in a
   committed file. Acceptance: `git grep` for the values finds nothing; the
   guide documents rotation.

3. **FR-03 Availability.** `GET /api/meet/availability?from&to` calls
   `POST /users/{host}/calendar/getSchedule` for the host over the requested
   range (at most the booking window) and returns open slot starts as UTC ISO
   strings plus the duration. A candidate slot is open when it falls inside
   business hours in the host time zone, starts at least the minimum notice
   from now, starts within the booking window, and no `busy`, `tentative`, or
   `oof` item overlaps the slot widened by the buffer on each side. `free` and
   `workingElsewhere` count as open. Candidates start on a 30 minute grid.
   Results are cached in memory for 60 seconds. Acceptance: `npm run
   meet:check` passes cases for buffers, minimum notice, a daylight saving
   change in the host zone, a visitor in a zone where the host's afternoon
   falls on the next date, and a range with no open slots.

4. **FR-04 Picker.** The page shows days with open slots for the booking
   window, then the times for the chosen day in the visitor's time zone
   (detected with `Intl`, changeable from a time zone list). Days without slots
   are disabled. If the whole window is empty, the page says so and links to
   /contact. Acceptance: verified in the browser in light and dark themes, at
   phone and desktop widths, with keyboard only.

5. **FR-05 Details form.** Name, work email, and organization (required),
   role and "What would you like to cover?" (optional, 1,000 characters), a
   honeypot, and invisible reCAPTCHA. Field styling is the underline style from
   `DemoRequestForm`. Acceptance: validation messages match the existing forms.

6. **FR-06 Booking.** `POST /api/meet/book` runs in this order: honeypot
   (silent success), reCAPTCHA (token required whenever
   `RECAPTCHA_SECRET_KEY` is set), rate limit, validation, slot in the current
   open list, slot lock, live re-check, create event, store, notify. The event
   is created with `POST /users/{host}/events`: `isOnlineMeeting: true`,
   `onlineMeetingProvider: "teamsForBusiness"`, the visitor as a required
   attendee, the answers and the manage
   link in the HTML body, and `transactionId` set to the booking ID so a retried
   request cannot create a second event. Acceptance: one booking produces one
   event with a Teams link and one invitation to the visitor.

7. **FR-07 No double booking.** Two guards. First, a slot lock: an insert into
   `MeetingSlotLocks` keyed by host and slot start, which fails with 409 for the
   second of two concurrent requests on any instance. Second, a `getSchedule`
   re-check of the widened slot immediately before the event is created, which
   catches meetings added in Outlook since the list loaded. Either failure
   returns `SLOT_TAKEN`, and the picker reloads with a message. The lock is
   released when event creation fails. Acceptance: two parallel requests for
   one slot yield one event; a slot blocked in Outlook after load is refused.

8. **FR-08 Reschedule and cancel.** The invitation body and the confirmation
   screen carry a link to `/meet/manage?t=<token>`. The token is the booking ID
   and an expiry (the meeting start), signed with HMAC SHA-256 using
   `MEET_LINK_SECRET` and compared in constant time. The page shows the booking
   and offers a new time (same picker; the event is moved with
   `PATCH /users/{host}/events/{id}`, which keeps the Teams link and sends an
   update) or cancellation with an optional note (`POST .../events/{id}/cancel`,
   which sends the cancellation). Locks move or are released. An expired,
   tampered, or already cancelled link shows a plain message and a link to
   /meet. Acceptance: each path updates the calendar, the table row, and sends
   a team notification.

9. **FR-09 Data.** `MeetingBookings` (partition `meeting`, row key booking
   ID) stores: event ID, host, start and end (UTC), visitor time zone, name,
   email, organization, role, topic, status (`booked`, `rescheduled`,
   `cancelled`), IP hash, created and updated times, and the same attribution
   fields as `DesignPartnerApplications`. A storage failure after the event is
   created does not fail the booking, since the event and the email are
   records too; it is logged with `trackException`.

10. **FR-10 Notifications.** `sendMeetingNotification` emails
    `CONTACT_EMAIL_TO` for booked, rescheduled, and cancelled meetings, with the
    time in the host zone, the answers, and attribution.

11. **FR-11 Cutover.** `MEET_BOOKING_MODE` is `graph` or `bookings`, default
    `bookings`. In `graph` mode with incomplete Graph settings, the page falls
    back to the embed, then to /contact, and logs a warning. If availability
    fails at request time in `graph` mode, the page shows the embed when a
    Bookings URL is set, otherwise the /contact link. Acceptance: each of the
    four states renders correctly.

12. **FR-12 Analytics.** Plausible events `Meeting Booked`,
    `Meeting Rescheduled`, `Meeting Cancelled`, and `Meeting Slot Taken`, with
    the attribution properties from `submissionProps()`; App Insights events
    `meet.*` mirroring the contact route.

13. **FR-13 Privacy.** The "Meeting bookings" paragraph states that a booking
    creates an event on a team member's Microsoft 365 calendar with a Teams
    link, that what the visitor enters and the meeting time are stored in Azure
    Table Storage with the visit's attribution and emailed to the team through
    SendGrid, and that the invitation carries a private link to reschedule or
    cancel. "Last updated" changes to the merge date.

### Non-Functional Requirements
- **NFR-01 Security.** Graph tokens and calls stay on the server.
  `ClientSecretCredential` from `@azure/identity` caches tokens. Host addresses
  never reach the browser. Manage tokens carry no personal data.
- **NFR-02 Abuse.** Booking: honeypot, required reCAPTCHA, existing per-IP
  limit (5 per minute). Availability: its own bucket at 30 per minute, plus the
  60 second cache, so the picker cannot be used to hammer Graph.
- **NFR-03 Performance.** Availability responds in under 2 seconds at p95
  uncached; booking in under 5 seconds.
- **NFR-04 Accessibility.** Slots are buttons in a labeled group with
  visible focus, selected state announced, and errors in `role="alert"`.
- **NFR-05 Voice.** All copy passes `npm run voice:lint`: no em dashes, US
  spelling.
- **NFR-06 Dependencies.** No new runtime packages. Time zone math uses
  `Intl.DateTimeFormat`.

## Technical Constraints

### Tech Stack
- Next.js 16 App Router, TypeScript, Tailwind v4, hybrid rendering on Azure
  Static Web Apps (Standard plan, no managed identity configured)
- `@azure/identity`, `@azure/data-tables`, `@sendgrid/mail` (all present)
- Microsoft Graph v1.0 over `fetch`

### Key Decisions
- **RBAC for Applications over an Application Access Policy.** Microsoft is
  replacing access policies with RBAC for Applications; RBAC scopes the grant
  itself, so the Entra consent is left off entirely.
- **Client secret over certificate.** Both would live in an app setting on
  this hosting model, so a certificate adds work without adding protection.
  The secret gets a 12 month expiry and a rotation step in the guide.
- **Table lock plus live re-check** for double bookings, since the in-memory
  rate limiter and cache are per instance.
- **Invitation as confirmation.** The host's Graph invitation reaches the
  visitor from a Spaarke mailbox and carries the manage link, so the site does
  not send its own confirmation email.

## Success Criteria
1. [x] Spec approved by the owner. Verify by: sign-off in this session.
2. [ ] A booking against the test mailbox creates one Teams event, one
       invitation, one table row, one team email. Verify by: local run.
3. [ ] Reschedule and cancel work from the manage link. Verify by: local run.
4. [ ] Parallel requests for one slot produce one event. Verify by: script.
5. [ ] Picker works in light and dark themes, phone and desktop, keyboard
       only. Verify by: browser pane.
6. [ ] `npm run typecheck`, `npm run lint`, `npm run meet:check`, and
       `npm run voice:lint` on changed copy pass. Verify by: CI and local.
7. [ ] PR open with `MEET_BOOKING_MODE` defaulting to `bookings`, so merging
       changes nothing in production. Verify by: PR description and settings.

## Dependencies

### Prerequisites
- The /meet embed (`feat/meet-page`) is on a branch or merged; this work
  builds on its `page.tsx`, `bookings.ts`, and privacy paragraph.
- An Entra app registration and the Exchange RBAC scope in a tenant with a
  test mailbox (admin steps in the guide).

### External Dependencies
- Microsoft Graph `getSchedule`, `events`, `events/{id}/cancel`
- Exchange Online PowerShell for the RBAC scope
- Key Vault, SWA app settings, Table Storage, SendGrid, reCAPTCHA (existing)

## Owner Clarifications

| Topic | Question | Answer | Impact |
|-------|----------|--------|--------|
| Hosts | Who hosts, and how are several hosts handled? | One host mailbox | `MEET_HOST` is a single address; the host is the organizer; no multi-host logic in this release |
| Meeting format | Keep the proposed defaults? | Keep them | Defaults below live in `config.ts`, each overridable by an app setting |
| Test tenant | Who runs the admin steps? | The owner, from the guide | The guide gives exact commands; the secret goes straight into `.env.local` and Key Vault, never through the session |

## Assumptions
- **Meeting format:** 30 minutes, Monday to Friday 9:00 to 17:00 in
  `America/New_York`, 15 minute buffer each side, 24 hours minimum notice,
  21 day window. All are app settings with these defaults.
- **Confirmation:** no separate visitor email; the invitation and the
  confirmation screen carry the manage link.
- **Graph throttling:** a single small site stays far under the
  per-mailbox limits; a 429 is retried once after `Retry-After`.

## Unresolved Questions
- [ ] The owner runs the setup guide against a test mailbox. Blocks:
      success criteria 2 to 4.

---

*AI-optimized specification. Original design: task brief, 2026-11-13.*
