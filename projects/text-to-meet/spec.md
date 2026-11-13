# Text to Meet: AI Implementation Specification

> **Status**: Draft for owner sign-off
> **Created**: 2026-11-13
> **Source**: Task brief from the /meet session (2026-11-13): inbound-first "Text MEET to <number>", building on the /meet Graph booking work in PR #142

## Executive Summary

A person who sees "Text MEET to <number>" on a postcard, an event slide, or an
email signature sends that one word to a Spaarke toll-free number. Twilio
forwards the message to a site API route, which checks the request signature
and answers in the same request with one text: a short, signed link to
`/meet?c=<token>`. The link opens the booking page with the conversation
attached, so a booking made through it is linked back to the text in Table
Storage. The phone number is never stored in readable form. The person starts
every exchange; the site sends nothing a person did not ask for.

## Scope

### In Scope
- Provider: Twilio Programmable Messaging on one US toll-free number, with
  Toll-Free Verification and a Messaging Service with Advanced Opt-Out.
- `POST /api/sms/inbound`: signature check, deduplication, keyword handling
  (MEET, STOP, HELP, START), rate limits, and a TwiML reply.
- A signed SMS link token in `src/lib/meet/tokens.ts`, next to the manage
  token from PR #142.
- Table Storage for conversations and senders, keyed by a keyed hash of the
  phone number.
- `/meet?c=<token>`: a welcome line, the link recorded as opened, and, in
  Graph mode, the booking linked to the conversation.
- A public `/sms` page with the program terms and the call to action, which
  Toll-Free Verification needs as its Terms URL and opt-in proof.
- A privacy policy "Text messages" paragraph and the clause Twilio requires.
- The printed and spoken placements, and a `/go/` slot for the next card.
- A check script (`npm run sms:check`) for signatures, keyword parsing, token
  round trips, and reply length.

### Out of Scope
- Outbound or proactive texts of any kind: reminders, follow-ups, marketing,
  or a text confirming a booking. A text the person starts permits a direct
  response only (see Compliance).
- Booking inside the text thread (choosing a slot by reply). A possible later
  phase.
- More than one number, short codes, MMS, and numbers outside the US and
  Canada.
- Writing texts or senders to the CRM, Dataverse, or the BFF.
- Showing the phone number to the team. See Unresolved Questions.
- Azure Communication Services. See Provider Choice.

### Affected Areas
- `src/app/api/sms/inbound/route.ts` (new)
- `src/lib/sms/` (new): `config.ts`, `twilio-signature.ts`, `keywords.ts`,
  `phone-hash.ts`, `store.ts`, `replies.ts`
- `src/lib/meet/tokens.ts`: `createSmsToken`, `verifySmsToken`
- `src/app/meet/page.tsx`: reads `c`, records the open, passes the token to
  the flow
- `src/components/meet/MeetBookingFlow.tsx`: welcome line, sends the token
  with the booking
- `src/app/api/meet/book/route.ts` and `src/lib/meet/store.ts`: the
  `smsConversationId` field
- `src/app/sms/page.tsx` (new)
- `src/app/privacy/page.tsx`
- `next.config.ts`: the new `/go/` slot (when the card is printed)
- `scripts/check-sms.mts` (new), `package.json`, `.env.local.example`
- `docs/text-to-meet.md` (new): Twilio setup, verification submission,
  secrets, rotation

## Provider Choice (checked 2026-11-13)

### Azure Communication Services: ruled out

Microsoft announced on 2026-09-23 that Azure Communication Services is
retiring as a standalone offering, with ACS SMS on the retired list and an
end date of 2028-09-30. From 2026-10-23, a customer without an ACS resource
created before that date cannot acquire phone numbers for SMS, and SMS is in
maintenance mode. Microsoft points SMS customers to Marketplace partners
(Blip, Infobip, Telesign).
([Retirement guide](https://learn.microsoft.com/en-us/azure/communication-services/acs-retirement-and-breaking-changes-guide))

The retirement guide's FAQ narrows this further: new SMS numbers can be
acquired "only if you're an existing customer with ACS resources that have
existing ACS phone numbers." Spaarke's only ACS resource, `spaarke-acs-dev`
(created 2026-07-16 for the platform's ACS Chat messaging, which defers SMS to
its R2), holds no phone numbers (checked with the phone numbers API on
2026-11-13), and no other Spaarke subscription has an ACS resource. So the
platform's ACS work does not open a path to an SMS number. The same guide
lists ACS Chat and ACS Email as retiring too.

Microsoft's other SMS routes do not fit this flow. The guide says Microsoft
"will offer equivalent alternative SMS services before the ACS retirement
date", with no date or product named. Dynamics 365 Contact Center offers SMS
for Dynamics customers, which brings contact center licensing for one
keyword. The Marketplace partners are third-party providers, as Twilio is.
The flow keeps the provider behind `src/lib/sms/` (signature check, reply
format) so a later move to a Microsoft service changes those files only.

Even with a number, a new program built on a service with a fixed end date
is a migration scheduled in advance. For the record, the figures ACS
publishes are below, but they do not change the decision.

| ACS (for reference) | Toll-free | 10DLC |
|---|---|---|
| Number | $2 per month | $1 per month |
| Per segment, send and receive | $0.0075 each | $0.0075 each |
| Carrier surcharge | $0.0025 sent, $0.0010 received | by carrier, $0.002 to $0.005 |
| Verification lead time | about 5 to 6 weeks, up to 8 | brand 2 to 3 business days, campaign 3 to 5 |
| Inbound delivery | Event Grid `SMSReceived` webhook | same |
| Request authentication | Entra bearer token or a shared secret; no per-request signature | same |

- Sources: [SMS pricing](https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms-pricing),
  [SMS FAQ](https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms/sms-faq),
  [Event Grid webhook security](https://learn.microsoft.com/en-us/azure/event-grid/secure-webhook-delivery).

### Twilio: recommended

- **Inbound** arrives as a form-encoded POST to a webhook. The webhook can
  answer inline with TwiML (`<Response><Message>`), so the reply needs no
  separate API call and no API credentials beyond the auth token used for the
  signature check. ([TwiML for Messaging](https://www.twilio.com/docs/messaging/twiml))
- **Every request is signed** in the `X-Twilio-Signature` header: an
  HMAC-SHA1, keyed with the account auth token, over the full webhook URL
  followed by the POST parameters sorted by name.
  ([Webhook security](https://www.twilio.com/docs/usage/webhooks/webhooks-security))
- **Opt-out** is handled by Twilio and the carriers: STOP and its synonyms
  add a block entry and send an automatic reply, and later sends to that
  number fail with error 21610.
  ([Opt-out keywords](https://help.twilio.com/articles/223134027-Twilio-support-for-opt-out-keywords-SMS-STOP-filtering-))

### Number type: toll-free over 10DLC

| Twilio | Toll-free (recommended) | Local 10DLC |
|---|---|---|
| Registration | Toll-Free Verification | A2P 10DLC brand and campaign |
| Stated lead time | "within three business days" ([onboarding](https://www.twilio.com/docs/messaging/compliance/toll-free/api-onboarding)) | campaign "under one week" ([A2P 10DLC](https://www.twilio.com/en-us/phone-numbers/a2p-10dlc)) |
| Before approval | Sending to the US and Canada is blocked | Sending is blocked (error 30034) |
| One-time fees | No verification fee found in Twilio's docs | Brand $4.50 (low-volume standard), campaign vetting $15 ([fees](https://help.twilio.com/articles/1260803965530-Pricing-and-Fees-for-A2P-10DLC-Service)) |
| Monthly fees | Number $2.15 | Number $1.15, campaign $1.50 (low-volume mixed) |
| Messaging Service | Optional (needed here for Advanced Opt-Out) | Required |
| Requires | Paid account, EIN | Paid account, EIN (standard brands) |

Toll-free is the better fit: no brand or campaign registration, no campaign
fee, one review, and a number that reads as a business line on print. The
three business days is Twilio's stated target, not a promise; the plan
allows two weeks from submission to first live text.

### Cost model (Twilio, "Pricing current as of November 2026")

Per segment, both directions: $0.0083, plus a carrier fee. Toll-free carrier
fees per segment (sent / received): AT&T $0.0035 / $0.0035, T-Mobile
$0.0045 / $0.0025, Verizon $0.005 / none, other carriers $0.0042 / none.
Twilio's automatic STOP and HELP replies are free; the inbound message is
billed. ([US SMS pricing](https://www.twilio.com/en-us/sms/pricing/us))

At 100 MEET texts a month, each with one single-segment reply, the cost is
roughly $1.00 inbound plus $1.30 outbound plus $2.15 for the number: about
$4.50 a month. Volume is not the cost risk; abuse is, and the rate limits
below cap it.

## Requirements

### Functional Requirements

1. **FR-01 Twilio account and number.** One paid Twilio account, one US
   toll-free number in a Messaging Service named "Spaarke meeting links",
   with Advanced Opt-Out on and the custom HELP reply from FR-11. The number's
   incoming message webhook is `https://<site>/api/sms/inbound` (POST).
   Messaging geographic permissions allow the US and Canada only. The account
   SID, auth token, and number are app settings, never committed.
   Acceptance: the setup guide reproduces the configuration from a new
   account; `git grep` finds none of the values.

2. **FR-02 Toll-Free Verification.** The submission uses opt-in type
   `VIA_TEXT`, a use case summary that describes a person texting MEET to
   receive one booking link, the MEET reply in FR-07 as the production
   sample, a volume of 1,000 a month (the lowest step that covers events),
   the EIN, `https://<site>/privacy` as the Privacy Policy URL, and
   `https://<site>/sms` as both the Terms URL and the public opt-in image
   URL. Since 2026-09-15 a submission without separate Privacy and Terms URLs
   is rejected with error 30493. Acceptance: the number's status is Verified.

3. **FR-03 Inbound route.** `POST /api/sms/inbound` accepts
   `application/x-www-form-urlencoded` bodies up to 16 KB and runs, in order:
   feature switch (`SMS_MODE=twilio`, otherwise 404), signature (FR-04),
   account and number check (`AccountSid` and `To` match the settings,
   otherwise 403), deduplication (FR-05), sender region (FR-06), keyword
   (FR-07 to FR-10), rate limits (FR-12), storage, reply. It answers within
   Twilio's timeout with `text/xml`: either one `<Message>` or an empty
   `<Response/>`. Errors after the signature check return an empty
   `<Response/>` with 200 and log with `trackException`, so Twilio does not
   retry into a second reply. Acceptance: `npm run sms:check` covers each
   branch against a local server.

4. **FR-04 Signature check.** Recompute the signature as base64 HMAC-SHA1,
   keyed with `TWILIO_AUTH_TOKEN`, over `SMS_WEBHOOK_URL` (the exact URL set
   in Twilio, read from a setting rather than from `request.url`, because
   behind Static Web Apps the host and scheme the route sees can differ from
   the ones Twilio signed) followed by every POST parameter sorted by name,
   each as name then value. Compare with `timingSafeEqual`. A missing or
   wrong signature returns 403 with no body and logs `sms.bad_signature`.
   Implemented in about 20 lines with `node:crypto` rather than the `twilio`
   package (no new runtime packages). During an auth token rotation the route
   accepts either `TWILIO_AUTH_TOKEN` or `TWILIO_AUTH_TOKEN_PREVIOUS`.
   Acceptance: the check script verifies Twilio's documented example and
   rejects a changed parameter, a changed URL, and a reordered body.

5. **FR-05 Deduplication.** Insert `MessageSid` into `SmsInbound`; a 409
   means the message was already handled, and the route returns an empty
   `<Response/>`. This is the slot-lock pattern from PR #142 applied to
   messages. Acceptance: posting the same signed body twice yields one reply.

6. **FR-06 Sender region.** Only `From` numbers starting `+1` get a reply.
   Any other sender is logged (`sms.region_blocked`, no number in the log) and
   answered with an empty `<Response/>`. This backs up Twilio's geographic
   permissions against toll fraud.

7. **FR-07 MEET.** A message whose first word, after trimming, removing
   punctuation, and ignoring case, is `MEET` is a MEET request. An optional
   second word is a placement code (FR-17); an unknown code is ignored, not
   refused. The route finds or creates the sender row (FR-13), reuses the
   sender's open conversation if one was created in the last 24 hours,
   otherwise creates one, and replies:

   > Spaarke: pick a time to meet our team: https://spaarke.com/meet?c=<token> Msg&data rates may apply. Reply STOP to opt out.

   With a 42 character token on `https://spaarke.com`, the reply is 157 GSM-7
   characters, one segment. The reply builder uses `SITE_URL`, and the check
   script fails if the reply would exceed 160 characters, which would happen
   with a longer host. Acceptance: one MEET text produces one single-segment
   reply with a link that opens /meet with the welcome line.

8. **FR-08 STOP.** Twilio handles STOP, STOPALL, UNSUBSCRIBE, CANCEL, END,
   REVOKE, OPTOUT, and QUIT: it blocks the number and sends the carrier's
   reply, and on toll-free that reply cannot be changed. The message still
   reaches the route. The route marks the sender `optedOut` with the time and
   returns an empty `<Response/>`. A longer message that contains one of
   these words or "stop texting", "don't text", or "remove me" is treated the
   same way (no reply, sender marked), since a person may revoke consent in
   their own words. Acceptance: STOP produces exactly one reply (Twilio's),
   and a later MEET from the same number gets no reply from the route.

9. **FR-09 START.** START and UNSTOP (the only re-opt-in words on toll-free)
   are handled by Twilio. The route clears `optedOut` and returns an empty
   `<Response/>`. The person texts MEET again for a link.

10. **FR-10 HELP.** HELP and INFO are answered by Twilio's Advanced Opt-Out
    with the text in FR-11. When the webhook receives one (Advanced Opt-Out
    forwards it with `OptOutType=HELP`), the route returns an empty
    `<Response/>` so the person does not get two replies. The route does not
    send its own HELP text, because Twilio's default would send a second one.

11. **FR-11 HELP text** (158 characters, one segment; configured in the
    Messaging Service, not in code):

    > Spaarke meeting links: text MEET for a link to book a meeting. 1 reply per text. Msg&data rates may apply. Help: contactus@spaarke.com. Reply STOP to opt out.
12. **FR-12 Rate limits.** Checked after the keyword is known, before any
    reply, and stored in Table Storage because the in-memory limiter in
    `src/lib/rate-limit.ts` is per instance:
    - Per sender: at most 3 MEET replies in 24 hours (each repeats the same
      link); further MEET texts get an empty `<Response/>`.
    - Other text: at most one reply per sender in 24 hours, the nudge
      "Spaarke: text MEET for a link to book a meeting with our team, or HELP
      for help. Reply STOP to opt out." (103 characters).
    - Site-wide: `SMS_REPLY_HOURLY_CAP` (default 30) and
      `SMS_REPLY_DAILY_CAP` (default 150) replies, counted in a row per hour
      and per day in `SmsCounters`, updated with ETag concurrency. Past a
      cap, the route stops replying, logs `sms.cap_reached`, and emails
      `CONTACT_EMAIL_TO` once per cap window.
    - The existing in-memory `checkRateLimit` with bucket `sms` runs first as
      a cheap guard, keyed by the phone hash.
    Acceptance: the check script drives each limit past its edge.

13. **FR-13 Phone number handling.** The number is reduced on arrival to
    `HMAC-SHA256(SMS_PHONE_HASH_SECRET, E.164 number)`, hex, first 32
    characters. The readable number is held only in memory for the length of
    the request and is never written to a table, a log, an App Insights
    property, or an email. A keyed hash is used rather than the plain SHA-256
    used for IP addresses, because US numbers fit in a space small enough to
    reverse an unkeyed hash by trying every number. `SMS_PHONE_HASH_SECRET`
    is not rotated (rotating it would split every sender's history); the
    setup guide says so. Acceptance: a search of the tables and logs after a
    test run finds no digits of the test number.

14. **FR-14 Data.** Three tables, names overridable for local checks:
    - `SmsSenders` (partition `sender`, row key phone hash): first and last
      seen, `optedOut`, `optedOutAt`, `latestConversationId`, and reply
      counts with their window start.
    - `SmsConversations` (partition `sms`, row key conversation ID): phone
      hash, keyword (`MEET`), placement code, created time, link expiry,
      `linkOpenedAt`, `linkOpenCount`, `bookingId`, and status (`sent`,
      `opened`, `booked`).
    - `SmsInbound` (partition by day, row key `MessageSid`): received time,
      classification (`meet`, `stop`, `start`, `help`, `other`), and
      conversation ID. No message text is stored.
    Storage is required: with `STORAGE_ACCOUNT_CONNECTION` missing the route
    replies with nothing and logs, because it can neither deduplicate nor
    limit.

15. **FR-15 SMS link token.** In `src/lib/meet/tokens.ts`, alongside the
    manage token: `<conversationId>.<exp>.<sig>`, where the conversation ID
    is 9 random bytes in base64url (12 characters), `exp` is the expiry in
    seconds in base36 (6 characters), and `sig` is HMAC-SHA256 over
    `sms.<conversationId>.<exp>` keyed with `SMS_LINK_SECRET`, cut to 16
    bytes and base64url encoded (22 characters). The `sms.` prefix keeps an
    SMS token from ever verifying as a manage token and the reverse. Lifetime
    30 days. Comparison in constant time, as in `verifyManageToken`.
    `SMS_LINK_SECRET` is separate from `MEET_LINK_SECRET` because the SMS
    flow must also work in Bookings mode, where the Graph settings are absent.
    Acceptance: round trip, tamper, expiry, and cross-use cases in the check
    script.

16. **FR-16 /meet with a token.** When `/meet` is requested with `c`:
    - The server verifies the token and loads the conversation. On success it
      records the open (`linkOpenedAt` on first open, `linkOpenCount`
      always, status `opened`) and logs `sms.link_opened`. On failure the page
      renders as it does without `c`, and logs `sms.token_invalid` or
      `sms.token_expired`.
    - The page shows one line above the picker or the embed: "Thanks for
      texting. Choose a time below."
    - The client removes `c` from the address bar with
      `history.replaceState` once the page loads, so a copied or bookmarked
      URL does not carry it.
    - Plausible event `Meeting Link Opened` with `source: sms` and the
      placement code.

    **Graph mode:** `MeetBookingFlow` receives the token and sends it with the
    booking as `smsToken`. The book route verifies it again; on success it
    writes `smsConversationId` and `source: sms` on the `MeetingBookings` row
    and `bookingId` and status `booked` on the conversation, and the team
    email says "Came from a text (MEET, <code>)". A bad or expired token never
    blocks a booking; the booking simply has no link. The form is not
    pre-filled with personal details: a text carries only the phone number,
    which is not stored or shown. What the link carries is the conversation,
    which is what ties the booking to the text.

    **Bookings mode:** the open is recorded and the welcome line shows, but
    the booking happens inside the Microsoft Bookings frame and its data
    stays in Microsoft 365, so the site cannot link a Bookings appointment to
    the conversation. The funnel reads texts, then link opens; bookings from
    texts are counted only in Graph mode.

17. **FR-17 Placement codes.** A committed map in `src/lib/sms/config.ts`
    from code to label, for example `CARD2` to "Postcard, second print" or a
    conference code. Codes are not secret. The code is stored on the
    conversation and shown in the team email. A text with no code is
    recorded as `none`. Codes are optional for the person; a sign shows
    "Text MEET" and, where a placement should be counted, "Text MEET CARD2".

18. **FR-18 /sms page.** A public, indexable page (verification
    reviewers must reach it), linked from the privacy policy and the /meet
    footer. It shows the call to action as it appears on print, with the
    number read from the `SMS_PUBLIC_NUMBER` app setting at request time (so
    no number is committed), and the program terms from the Compliance
    section. The page hosts the opt-in image that Toll-Free Verification
    requires. `/sms` is printed on cards, so like a `/go/` slot it must never
    404; the route carries a comment saying so. With `SMS_MODE` off, the page
    still renders, says the program is paused, and points to /meet.

19. **FR-19 Privacy.** The "Text messages" paragraph from the Compliance
    section is added after "Meeting bookings", Twilio is added to the list
    of services that process data, the required clause is added, and "Last
    updated" changes to the merge date.

20. **FR-20 Analytics.** App Insights events `sms.received` (with
    classification and code), `sms.replied`, `sms.bad_signature`,
    `sms.region_blocked`, `sms.rate_limited`, `sms.cap_reached`,
    `sms.link_opened`, `sms.token_invalid`, `sms.token_expired`, and
    `sms.booking_linked`. No event carries a phone number or its hash.

### Non-Functional Requirements
- **NFR-01 Security.** The auth token, link secret, and phone hash secret
  are created in the site's Key Vault and copied into app settings, as in
  PR #142. The webhook never trusts `From`, `To`, or `Body` before the
  signature check passes.
- **NFR-02 Latency.** The route answers in under 3 seconds at p95, well
  inside Twilio's webhook timeout, so a slow table call cannot lead to a
  retry and a second reply.
- **NFR-03 Idempotency.** One inbound message produces at most one reply,
  whatever Twilio retries (FR-05).
- **NFR-04 Dependencies.** No new runtime packages.
- **NFR-05 Voice.** The page copy and texts pass `npm run voice:lint`: no em
  dashes, US spelling. Texts open with "Spaarke:" so the sender is named.
- **NFR-06 Accessibility.** The welcome line is plain text in the page flow,
  not an alert. The /sms page meets the site's existing contrast and heading
  rules.

## Compliance

Everything in this section is a draft for counsel to approve. The flow is
built so that the person starts every exchange and gets one reply per
request, which Twilio's consent guidance classes as "Implied /
Conversational" consent that "permits direct responses only; no proactive
messaging." The flow stays inside that. Nothing here decides the legal
position under the TCPA, state law, or the CTIA guidelines.

### Call to action (print, slides, signature)

> **Text MEET to (8XX) XXX-XXXX** to get a link to book a meeting with
> Spaarke. One reply per text. Msg & data rates may apply. Reply STOP to opt
> out, HELP for help. Terms: spaarke.com/sms. Privacy: spaarke.com/privacy.

Twilio requires the terms and privacy links near the call to action and the
"rates may apply" phrase. On a slide or sign where space is short, the first
sentence stays and the rest moves to a footer line on the same surface.

### Program terms (the /sms page)

> **Spaarke meeting links.** Text MEET to (8XX) XXX-XXXX and we will reply
> with one text containing a link to book a meeting with the Spaarke team.
> You get one reply for each text you send; we do not send other messages,
> reminders, or marketing by text. Message and data rates may apply. Reply
> STOP to stop receiving replies, START to resume, or HELP for help. For
> help, email contactus@spaarke.com. Carriers are not liable for delayed or
> undelivered messages. See our Privacy Policy for how we handle your
> number.

### Privacy policy paragraph (draft)

> **Text messages.** If you text MEET to our booking number, our messaging
> provider, Twilio, receives your phone number and your message and passes
> them to us so we can reply with a booking link. We do not store your phone
> number in readable form: we keep a one-way, keyed code derived from it so
> we can honor STOP requests, limit repeat replies, and connect a meeting you
> book through the link to your text. We do not keep the text of your
> messages. Twilio keeps its own records of messages it carries. We send only
> replies to texts you send us, and we do not use your number for marketing.
> All the above categories exclude text messaging originator opt-in data and
> consent; this information won’t be shared with any third parties.

The last sentence is the clause Twilio requires word for word in a privacy
policy that mentions data sharing, which ours does. Its "above categories"
wording was written for a sharing section; where it sits is a question for
counsel.

### For counsel
- [ ] Whether a person texting a keyword, answered once, is adequate consent
      for the reply under the TCPA and the FCC's consent revocation rules, and
      whether the "stop texting" handling in FR-08 is enough for revocation
      "by any reasonable means".
- [ ] The call to action, the /sms terms, the HELP text, and the frequency
      wording ("One reply per text" in place of "Message frequency varies").
- [ ] The privacy paragraph, where the required Twilio clause sits, and
      whether Twilio's message logs need their own retention statement.
- [ ] Whether Twilio needs a data processing agreement or a service
      provider listing in the privacy policy's processor section.
- [ ] State laws with their own text message rules (for example Florida and
      Oklahoma "mini-TCPA" statutes), which mostly target marketing texts but
      should be confirmed as not reaching a one-time reply.
- [ ] Retention: how long sender and conversation rows are kept (proposed:
      12 months from last activity, with opt-out flags kept while Twilio
      holds the number).

## Placement

| Surface | What appears | Notes |
|---|---|---|
| Postcard, next print run | The call to action and a QR code to `/go/more-info-2` (redirects to /meet) | The August 2026 cards (`/go/more-info-1`) are printed without a keyword and stay as they are. Card copy uses code `CARD2`. |
| Events | Slide footer, table tent, badge back: "Text MEET to ..." with an event code | One code per event in FR-17's map. The full call to action appears once on the same surface. |
| Email signature | One line: "Book a meeting: text MEET to (8XX) XXX-XXXX or visit spaarke.com/meet" | The signature links to /sms for the terms. Signature code `SIG`. |
| /meet page | A footer line beside "Prefer to write first?" | Lets a reader on a desktop send the link to their own phone. |
| /sms page | The call to action, the terms, the opt-in image | The verification reviewer's view. |

New `/go/` slot: `/go/more-info-2` to `/meet`, `permanent: false`, added to
the comment block in `next.config.ts` when the card goes to print, never
before (an unprinted slot is an unused promise). `/sms` is itself printed, so
it carries the same never-404 rule.

## Technical Constraints

### Tech Stack
- Next.js 16 App Router route handler on Azure Static Web Apps (hybrid),
  TypeScript
- `node:crypto` for HMAC-SHA1 (signature) and HMAC-SHA256 (tokens, phone
  hash)
- `@azure/data-tables` (present); SendGrid (present) for the cap alert
- Twilio Programmable Messaging, toll-free number, Messaging Service with
  Advanced Opt-Out

### Key Decisions
- **Twilio over ACS.** ACS SMS numbers can be acquired only on a resource
  that already has numbers, which Spaarke's does not, and ACS SMS retires on
  2028-09-30.
- **Toll-free over 10DLC.** One verification instead of a brand and a
  campaign, no campaign fee, and a business-looking number for print.
- **TwiML reply over a REST send.** The reply rides on the webhook response,
  so the site holds no API key and makes no outbound call.
- **Advanced Opt-Out for HELP.** The HELP text must name the business and a
  contact, which Twilio's default does not; the route stays silent on
  keywords Twilio answers, so nobody gets two replies. Advanced Opt-Out can
  be switched off only by Twilio support, so turning it on is a one-way step
  the owner takes knowingly.
- **Keyed phone hash, no readable number.** The team gets the booking's
  email address, which is how they reply; the number is not needed for that.
- **Link, not pre-fill.** The token carries a conversation, not personal
  details, so a forwarded link exposes nothing about the person who texted.
- **Hand-written signature check.** About 20 lines with `node:crypto`,
  tested against Twilio's documented example, instead of adding the
  `twilio` package.

## Success Criteria
1. [ ] Spec signed off by the owner. Verify by: sign-off on this branch.
2. [ ] Counsel has approved the Compliance section. Verify by: the counsel
       checklist ticked.
3. [ ] The toll-free number is Verified. Verify by: Twilio console status.
4. [ ] A MEET text from a test phone returns one single-segment reply whose
       link opens /meet with the welcome line. Verify by: live test.
5. [ ] STOP gets only Twilio's reply, and MEET after STOP gets nothing. HELP
       gets the custom text once. Verify by: live test.
6. [ ] In Graph mode, a booking through the link carries
       `smsConversationId`, and the conversation shows `booked`. Verify by:
       the tables after a test booking.
7. [ ] No readable phone number in any table, log, or email. Verify by:
       search after the live test.
8. [ ] `npm run typecheck`, `npm run lint`, `npm run sms:check`, and
       `npm run voice:lint` on changed copy pass. Verify by: CI and local.

## Dependencies

### Prerequisites
- PR #142 merged: this work extends `tokens.ts`, `store.ts`, the book route,
  and `MeetBookingFlow`. The Bookings-mode part (FR-16) works without Graph
  settings.
- The privacy and /sms pages live before the verification is submitted,
  since the reviewer checks them.
- The EIN and the legal business name for the verification.

### External Dependencies
- Twilio paid account, toll-free number, Messaging Service, Advanced
  Opt-Out, Toll-Free Verification
- Key Vault and SWA app settings: `SMS_MODE`, `TWILIO_ACCOUNT_SID`,
  `TWILIO_AUTH_TOKEN`, `TWILIO_AUTH_TOKEN_PREVIOUS` (during rotation only),
  `SMS_WEBHOOK_URL`, `SMS_PUBLIC_NUMBER`, `SMS_LINK_SECRET`,
  `SMS_PHONE_HASH_SECRET`, `SMS_REPLY_HOURLY_CAP`, `SMS_REPLY_DAILY_CAP`
- Table Storage (present)

## Owner Clarifications (from the brief that started this spec)

| Topic | Question | Answer | Impact |
|-------|----------|--------|--------|
| Direction | Inbound, outbound, or both? | Inbound first; outbound cold texting ruled out (TCPA consent, carrier registration) | The site replies only to texts it receives |
| Booking in SMS | Choose a slot by text? | A possible later phase, not this one | The text carries a link to /meet |
| Phone storage | Keep the number? | Hashed or stored per the privacy policy | Keyed hash only (FR-13) |
| Provider | ACS or Twilio? | Verify against current docs | Twilio, toll-free; ACS is closed to new SMS customers |

## Assumptions
- **Volume:** tens to low hundreds of MEET texts a month; the caps in FR-12
  are set well above that and below a level that costs real money.
- **Host:** the reply link uses `https://spaarke.com`. A longer host pushes
  the MEET reply past one segment; the check script catches it.
- **Account:** Spaarke opens its own Twilio account rather than using one
  held by another Spaarke project.
- **Unrecognized text:** gets one nudge per sender per 24 hours (FR-12)
  rather than silence.

## Unresolved Questions
- [ ] Does the team want the phone number itself, to call or text the person
      back? Blocks: FR-13 and the privacy paragraph. The spec assumes no.
- [ ] Is the keyword MEET final, and is a placement code as a second word
      acceptable on print? Blocks: the card copy and FR-17.
- [ ] Who submits the Toll-Free Verification and owns the Twilio account (the
      EIN and a notification email are required)? Blocks: FR-02.
- [ ] Counsel review of the Compliance section. Blocks: going live.

---

*AI-optimized specification. Original design: task brief, 2026-11-13.*
