# Design partner page: design

Status: approved by the writer, 2026-10-21. `/design-to-spec
projects/overview-landing-page` turns this into `spec.md`, and
`project-pipeline` produces the plan and tasks.

## 1. Purpose

The LinkedIn carousel `spaarke-overview-carousel` (Issue #123) ends on two
asks: "Which decision would you start with?" and an invitation to join the
group of organizations that help shape Spaarke. Today the only way to answer
either is a LinkedIn comment or message. This page gives the carousel, its
follow-up posts, the contact form, and the printed postcard campaign one
destination that does two jobs.

1. **Recruit design partners.** Design partners are legal operations
   leaders in law departments and law firms who contribute product
   direction, functional requirements, and user feedback. In return they
   help set the direction of the product, get early access to new
   capabilities, and use Spaarke free of charge. The application form is
   the lead capture.
2. **Hand over the overview.** A reader can page through the nine slides and
   download the PDF. The download is open, with no form in front of it: the
   same PDF is free on LinkedIn, so a gate would cost readers and return
   nothing.

Success is measured by applications received, PDF downloads, and how many of
each arrive from LinkedIn, the contact form, and the postcard, read through
the site's existing attribution.

## 2. The program's name

The program is the **Spaarke Design Partner Program**, and its members are
**design partners**. "Design partner program" is the term software companies
use for exactly this arrangement: organizations that shape a product while
it is being built, contribute requirements and feedback, and receive early
and free access in return. The alternative, "customer advisory board",
describes a council of existing paying customers that meets periodically to
advise on strategy. Spaarke's partners are not yet customers and do more than
advise, so that term would describe them less accurately.

The name replaces "design community" in the contact form and is used in
every new piece. The overview carousel keeps "advisory group" (section 8).

## 3. Route and entry points

- **Page:** `/design-partners` (`src/app/design-partners/page.tsx`), named
  after the program.
- **`/advisory-group`:** a permanent redirect to `/design-partners`, so the
  writer's preferred address and the words already used in the carousel both
  lead to the page.
- **LinkedIn:** posts link to
  `https://www.spaarke.com/design-partners?utm_source=linkedin&utm_medium=social&utm_campaign=spaarke-overview`.
  The carousel post can go out before the page ships and be edited to add
  the link afterwards.
- **Postcard (approved):** `/go/more-info-1` changes its temporary redirect
  in `next.config.ts` from the homepage to `/design-partners`. It stays
  temporary, so the printed path never 404s and can move again later.
  Next.js passes the query string through a redirect, so the card's UTM
  parameters survive.
- **Contact form (approved):** the reason "Join design community" becomes
  "Join the design partner program". When a visitor picks it, the form shows
  a line pointing to `/design-partners`, where the application asks for the
  details that make it useful. The contact form still accepts the message,
  so nobody who prefers it is turned away.

## 4. Page structure

The page uses the v2 primitives (`Slab`, `Shell`, `Eyebrow`, `Heading`,
`Lede`, `Button`) and the dark tone with the brand glow, as `/access-request`
and `/contact` do, so it reads as part of the site and not a separate
microsite.

1. **Hero.** Eyebrow "Spaarke Design Partner Program". Headline "Legal runs
   on decisions. Help us make them intelligent." Lede: "Spaarke design
   partners are legal operations leaders in law departments and law firms
   who work with our product team while we build. Partners shape what
   Spaarke does next, get early access to new capabilities, and use Spaarke
   free of charge." Two actions: "Apply to become a design partner", which
   scrolls to the form, and "Download the overview (PDF)".
2. **What partners contribute and receive.** Two short lists in the
   writer's terms.
   - **Partners contribute:** product direction, functional requirements,
     and feedback from the people who will use the platform.
   - **Partners receive:** a direct say in the product's direction, early
     access to new capabilities, and free access to Spaarke.
3. **The overview.** The nine carousel slides as images, in a horizontal
   strip that swipes on a phone and shows several slides at once on a
   desktop, each with its alt text, and the download button under the strip.
   Assets go in `public/design-partners/`: `spaarke-overview.pdf` and
   `slide-01.png` to `slide-09.png`, rendered from the approved carousel
   source (WebP versions if the PNG weight is too high).
4. **The application.** The two-column layout from `/access-request`: on the
   left, what happens after applying; on the right, the form.
5. **Further reading.** Links to The Spaarke Method article and to
   `/contact`.

The copy above is a first draft. All page copy follows the content voice
rules and goes through `npm run voice:lint` before review.

## 5. The form

| Field | Required | Notes |
|---|---|---|
| First name, last name | yes | 1 to 100 characters each |
| Work email | yes | same check as the other forms |
| Organization | yes | |
| Role or title | yes | |
| Organization type | yes | Law department, Law firm, Other |
| The decision you would start with | no | free text, up to 500 characters; this is the carousel's question |
| Consent | yes | the same consent checkbox and privacy link as the demo request form |

Spam and abuse protection is the same as the other forms: invisible
reCAPTCHA, the shared per-IP rate limit, and server-side validation that
mirrors the client.

On success the form is replaced by a confirmation: "Thank you. The Spaarke
team will reply by email." Notifications go to contactus@spaarke.com, and the
team replies from there.

## 6. What is reused, and what is new

The page needs one new API route, one new table, and one new email. Almost
everything else exists.

**Reused as it is**
- `src/components/primitives` for layout and type, and `InlineAlert` and
  `FormField` for form states.
- `src/lib/rate-limit.ts`, `src/lib/ip-hash.ts`, `src/lib/logger.ts`
  (`trackEvent`, `trackException`).
- `src/lib/attribution.ts` (`submissionProps`), so applications carry the
  same entry referrer, landing page, AI source, and UTM fields as every
  other lead.
- `src/lib/analytics.ts` (`track`) for Plausible events.
- The reCAPTCHA client pattern from `DemoRequestForm.tsx` and
  `EarlyReleaseForm.tsx`.
- The SendGrid setup in `src/lib/email.ts`, which already sends the
  contact, early-release, and demo-request notifications to
  contactus@spaarke.com.

**Reused as a pattern (copied shape, new code)**
- `POST /api/design-partners` follows `src/app/api/early-release/route.ts`:
  rate limit, validate, verify reCAPTCHA, write the row, send the email,
  track the event.
- `saveDesignPartnerApplication()` in `src/lib/storage.ts` follows
  `saveDemoRequestLead()`: it creates the table on first use and never
  throws, so a storage failure cannot lose the submission silently. The
  table is `DesignPartnerApplications`.
- `sendDesignPartnerNotification()` in `src/lib/email.ts` follows
  `sendEarlyReleaseNotification()`.
- `DesignPartnerForm.tsx` follows `DemoRequestForm.tsx`, with fewer fields.

**Small changes to existing files**
- `src/lib/contact.ts`: rename the reason (section 3). `ContactForm.tsx`
  shows the pointer line when it is chosen.
- `next.config.ts`: the `/go/more-info-1` destination, and the
  `/advisory-group` redirect.
- `src/types/plausible.d.ts`: two event names, "Overview Download" and
  "Design Partner Submit".
- `src/lib/reports/daily.ts`: a section counting the day's applications,
  alongside the demo requests and contact messages it already reports.
- `src/app/sitemap.ts`, page metadata, and an Open Graph image (1200 by 630)
  cut from the carousel cover.

**A cleanup the work makes easy (optional)**
- `verifyCaptcha()` is copied in at least three routes. Moving it to
  `src/lib/captcha.ts` and importing it in the new route and the existing
  ones removes the duplication. It is not required for the page.

**Considered and not chosen**
- Sending applications through the demo-request route. That route forwards
  to the platform's registration service, which creates an evaluation
  registration in Dataverse. A design partner application is not a request
  for evaluation access, and routing it there would create registrations
  nobody asked for.
- Using only the contact form. It cannot capture organization type or the
  starting decision as fields, which are what make the applications useful
  to sort.

## 7. Out of scope

- Gating the PDF behind a form.
- Writing applications to the CRM or Dataverse. The table and the email are
  the record until the team decides where design partners are managed.
- An automated reply or email sequence to the applicant.
- The program's terms (how long free access lasts, how many users, what a
  partner signs). The page states the benefits without terms; the team
  settles terms with each partner.
- Posting to LinkedIn (manual, per the content rules).

## 8. The carousel's wording (decided)

The carousel and its post keep "advisory group" ("Join our advisory group" on
slide 9; "We are forming an advisory group of legal operations leaders" in
the post), as the writer decided on 2026-10-21. The `/advisory-group`
redirect lands those readers on `/design-partners`, and the page's lede
explains the program in full. Later posts use the program's name.

## 9. Delivery

A feature branch (`feat/design-partner-page`) from `origin/main`, a pull
request, and the Azure Static Web Apps preview environment for review before
merge. Checks: `npm run typecheck`, `npm run lint`, `npm run build`, voice
lint on the page copy, a test submission on the preview with the
`STORAGE_ACCOUNT_CONNECTION` and SendGrid settings present, the redirects
(`/advisory-group`, `/go/more-info-1` with its query string), and the page
at phone width. The PDF and slide images are public assets and contain only
the approved carousel content.
