# Design Partner Page: AI Implementation Specification

> **Status**: Ready for Implementation
> **Created**: 2026-10-21
> **Source**: design.md

## Executive Summary

A new page at `/design-partners` recruits legal operations leaders into the
Spaarke Design Partner Program and hands over the LinkedIn overview carousel
as an open PDF download. It is the single destination for the carousel, later
posts, the contact form, and the printed postcard (`/go/more-info-1`).
Applications are stored in Azure Table Storage and emailed to the team,
reusing the site's existing form, spam, attribution, and notification code.

## Scope

### In Scope
- Page `/design-partners` with hero, contribute/receive lists, slide strip
  with PDF download, application form, and further reading.
- `POST /api/design-partners` route, table `DesignPartnerApplications`,
  and a SendGrid notification.
- Redirects: `/advisory-group` to `/design-partners` (permanent);
  `/go/more-info-1` to `/design-partners` (temporary, replaces `/`).
- Contact form reason renamed to "Join the design partner program", with a
  pointer to the page when chosen.
- Plausible events, the daily report section, sitemap entry, metadata, and
  an Open Graph image.
- Public assets: the carousel PDF and nine slide images.

### Out of Scope
- Gating the PDF behind a form.
- Writing applications to the CRM or Dataverse, or calling the BFF
  registration service.
- An automated reply or email sequence to the applicant.
- Program terms (duration, user counts, agreement) on the page.
- Changing the carousel's "advisory group" wording.
- Posting to LinkedIn.

### Affected Areas
- `src/app/design-partners/page.tsx` (new): the page.
- `src/components/DesignPartnerForm.tsx` (new): the form.
- `src/components/` (new, optional): a slide strip component if the page
  file grows too large.
- `src/app/api/design-partners/route.ts` (new): the API route.
- `src/lib/storage.ts`: `saveDesignPartnerApplication()`.
- `src/lib/email.ts`: `sendDesignPartnerNotification()`.
- `src/lib/contact.ts`, `src/components/ContactForm.tsx`: the reason rename.
- `next.config.ts`: two redirects.
- `src/types/plausible.d.ts`: two event names.
- `src/lib/reports/daily.ts`: a design partner section.
- `src/app/sitemap.ts`: the new route.
- `public/design-partners/`: `spaarke-overview.pdf`, `slide-01` to
  `slide-09` images, and the Open Graph image.

## Requirements

### Functional Requirements

1. **FR-01 Page route.** `/design-partners` renders in the dark tone with
   the brand glow, built from the v2 primitives (`Slab`, `Shell`, `Eyebrow`,
   `Heading`, `Lede`, `Button`), matching `/access-request`. It is dynamic,
   as `/access-request` is, because the reCAPTCHA site key is read at request
   time (changed 2026-10-22 during task 020). Acceptance: its layout matches
   `/access-request` at desktop and phone widths.
2. **FR-02 Hero.** Eyebrow "Spaarke Design Partner Program", headline "Legal
   runs on decisions. Help us make them intelligent.", the lede from
   design.md section 4, and two actions: "Apply to become a design partner"
   (scrolls to the form anchor) and "Download the overview (PDF)".
   Acceptance: both actions work with keyboard and pointer.
3. **FR-03 Contribute and receive.** Two lists. Partners contribute product
   direction, functional requirements, and user feedback. Partners receive a
   direct say in the product's direction, early access to new capabilities,
   and free access to Spaarke. Acceptance: copy matches, voice lint passes.
4. **FR-04 Slide strip.** The nine slides as images in a horizontal strip
   with scroll snap: one slide wide on a phone, several on desktop. Each
   image has the alt text from the carousel's `draft.md`. Images use
   `next/image` with fixed 1080 by 1350 dimensions and lazy loading.
   Acceptance: swipes on a phone without horizontal page scroll; every image
   has alt text.
5. **FR-05 PDF download.** A link to `/design-partners/spaarke-overview.pdf`
   with the `download` attribute, under the strip and in the hero. Clicking
   it fires the Plausible event "Overview Download" with a `location`
   property (`hero` or `strip`). Acceptance: the file downloads, and the
   event appears in Plausible.
6. **FR-06 Application form.** `DesignPartnerForm` with the fields in the
   table below, client validation matching the server, invisible reCAPTCHA,
   the consent checkbox and privacy link from `DemoRequestForm`, and
   `submissionProps()` attribution fields. On success the form is replaced by
   "Thank you. The Spaarke team will reply by email." and fires "Design
   Partner Submit". On failure an `InlineAlert` shows the error and the
   entered values are kept. Acceptance: valid submission shows the
   confirmation; invalid input shows field errors without a request.

   | Field | Key | Required | Rule |
   |---|---|---|---|
   | First name | `firstName` | yes | 1 to 100 characters |
   | Last name | `lastName` | yes | 1 to 100 characters |
   | Work email | `email` | yes | same check as the other forms |
   | Organization | `organization` | yes | 1 to 200 characters |
   | Role or title | `role` | yes | 1 to 100 characters |
   | Organization type | `organizationType` | yes | `Law department`, `Law firm`, `Other` |
   | The decision you would start with | `startingDecision` | no | up to 500 characters |
   | Consent | `consent` | yes | must be true |

7. **FR-07 API route.** `POST /api/design-partners` follows
   `src/app/api/early-release/route.ts`: rate limit by IP hash, validate,
   verify reCAPTCHA, save the row, send the email, track the event with
   `trackEvent`. Returns 200 on success, 400 on validation failure, 429 when
   rate limited, 400 with `CAPTCHA_FAILED` on failed reCAPTCHA (as every
   existing form route does; changed from 403 on 2026-10-22), and 500 only
   when both storage and email fail. Acceptance: each status is
   reachable in a local test.
8. **FR-08 Storage.** `saveDesignPartnerApplication()` in
   `src/lib/storage.ts` follows `saveDemoRequestLead()`: creates
   `DesignPartnerApplications` on first use, never throws, and logs failures
   with `trackException`. The row holds every form field, the attribution
   fields, the IP hash, and the submission time. Acceptance: a row appears in
   the table after a test submission on the preview.
9. **FR-09 Notification.** `sendDesignPartnerNotification()` in
   `src/lib/email.ts` follows `sendEarlyReleaseNotification()`, sends to
   `CONTACT_EMAIL_TO` (contactus@spaarke.com) from `SENDGRID_FROM_EMAIL`, sets
   reply-to to the applicant, and lists every field and the attribution.
   Acceptance: the email arrives at contactus@spaarke.com and replying
   addresses the applicant.
10. **FR-10 Redirects.** In `next.config.ts`, `/advisory-group` redirects
    permanently to `/design-partners`, and `/go/more-info-1` changes
    destination from `/` to `/design-partners` and stays temporary. Query
    strings pass through. Acceptance: both redirects resolve on the preview,
    and `/go/more-info-1?utm_source=postcard` arrives with its query.
11. **FR-11 Contact form reason.** In `src/lib/contact.ts`, "Join design
    community" becomes "Join the design partner program". When it is
    selected, `ContactForm` shows a line linking to `/design-partners`. The
    form still submits. Acceptance: server validation accepts the new value
    and rejects the old one.
12. **FR-12 Analytics.** "Overview Download" and "Design Partner Submit" are
    added to the event union in `src/types/plausible.d.ts`. Acceptance:
    typecheck passes with both `track` calls.
13. **FR-13 Daily report.** `src/lib/reports/daily.ts` adds a section
    counting the day's rows in `DesignPartnerApplications`, beside the
    existing demo request and contact sections. Acceptance: the report
    renders with zero and with one application.
14. **FR-14 Discovery.** `/design-partners` is added to `src/app/sitemap.ts`.
    The page has a title, description, canonical URL, and an Open Graph
    image of 1200 by 630 cut from the carousel cover. Acceptance: the meta
    tags render in the built HTML.
15. **FR-15 Assets.** The PDF is copied from
    `content-platform/articles/spaarke-overview-carousel/spaarke-overview-carousel.pdf`.
    The slide images are rendered by `render.mjs` from the approved
    `source.html` in the private research folder and copied in; the HTML
    itself stays out of this repo. Acceptance: nine images and one PDF in
    `public/design-partners/`, with no HTML source committed.

### Non-Functional Requirements
- **NFR-01 Voice.** All page copy passes `npm run voice:lint` with no
  errors: no em or en dashes, no AI-tell constructions, and the services
  positioning rules in the voice guide.
- **NFR-02 Accessibility.** Labels on every field, visible focus, alt text on
  every slide, the strip operable by keyboard, colour contrast at WCAG AA.
- **NFR-03 Performance.** Slide images lazy-load below the hero; the total
  image weight is under 2 MB (WebP if PNG exceeds it). The page stays static.
- **NFR-04 Abuse.** The shared per-IP rate limit, invisible reCAPTCHA, and
  server-side validation that mirrors the client. No raw IP is stored.
- **NFR-05 Privacy.** Only the listed fields and the existing attribution
  data are stored. The consent text and privacy link match the demo form.
- **NFR-06 Phone width.** No horizontal page scroll at 360 px, with a 16 px
  side gutter.

## Technical Constraints

### Tech Stack
- Next.js 16.1.6 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS v4 (`@theme inline`, no config file)
- Azure Static Web Apps (hybrid SSG and SSR), API routes in the Next.js app
- Azure Table Storage via `@azure/data-tables` (`STORAGE_ACCOUNT_CONNECTION`)
- SendGrid via `@sendgrid/mail` (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`,
  `CONTACT_EMAIL_TO`)
- reCAPTCHA (`RECAPTCHA_SECRET_KEY` and the existing site key)
- Application Insights via `src/lib/logger.ts`; Plausible via
  `src/lib/analytics.ts`

### Key Decisions
- Copy the early-release route's shape, not the demo-request route: the
  demo-request route creates Dataverse registrations through the BFF.
- The PDF is open, not gated.
- The table and the email are the record of applications.
- The program is named "Design Partner Program"; the overview carousel keeps
  "advisory group", and `/advisory-group` redirects to the page.
- `verifyCaptcha()` is currently copied in `contact`, `early-release`, and
  `registration/demo-request`. The new route copies it as well; extracting
  it to `src/lib/captcha.ts` is optional and out of the critical path.

## Success Criteria

1. [ ] `/design-partners` renders on the SWA preview at desktop and 360 px.
   Verify by: manual review of the preview.
2. [ ] A test application lands in `DesignPartnerApplications` and arrives
   at contactus@spaarke.com. Verify by: submitting on the preview.
3. [ ] The PDF downloads and both Plausible events fire. Verify by: the
   Plausible realtime view.
4. [ ] `/advisory-group` and `/go/more-info-1?utm_source=postcard` land on
   the page with the query intact. Verify by: curl on the preview.
5. [ ] The contact form accepts the renamed reason and shows the pointer.
   Verify by: manual test.
6. [ ] `npm run typecheck`, `npm run lint`, `npm run build` pass. Verify by:
   CI on the PR.
7. [ ] Page copy passes voice lint with no errors. Verify by:
   `npm run voice:lint` on the page copy.
8. [ ] No carousel HTML source is committed. Verify by: reviewing the PR's
   file list.

## Dependencies

### Prerequisites
- The approved carousel PDF (exists).
- Slide images rendered from `source.html` with `render.mjs` (local, private).

### External Dependencies
- SWA app settings already present for the other forms:
  `STORAGE_ACCOUNT_CONNECTION`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`,
  `CONTACT_EMAIL_TO`, `RECAPTCHA_SECRET_KEY`, and the reCAPTCHA site key.
  Confirm they are set for the preview environment as well.
- Plausible site (exists).

## Owner Clarifications

| Topic | Question | Answer | Impact |
|-------|----------|--------|--------|
| Program | What is the advisory group? | Solution partners who contribute product direction, functional requirements, and user feedback; they help direct the product and get early and free access. | Page copy (FR-02, FR-03) |
| Name | What should the program be called? | An accurate, industry-standard name: Design Partner Program. | Route, copy, contact reason |
| Notifications | Where do applications go? | contactus@spaarke.com | FR-09 uses `CONTACT_EMAIL_TO` |
| Postcard | Point `/go/more-info-1` at the page? | Yes. | FR-10 |
| Route | Which address? | Name the page to match the program: `/design-partners`, with `/advisory-group` redirecting. | FR-01, FR-10 |
| Carousel | Change "advisory group" in the carousel? | No, keep it. | Out of scope; redirect covers it |

## Assumptions

- **`CONTACT_EMAIL_TO`**: assumed to be contactus@spaarke.com in production,
  as for the other forms. Affects FR-09.
- **Rate limit**: the shared limit used by early-release applies unchanged.
- **Image format**: PNG unless total weight exceeds 2 MB, then WebP.
- **Open Graph image**: cut from the carousel cover slide at 1200 by 630.
- **Captcha extraction**: not done in this project unless time allows.

## Unresolved Questions

- None blocking.

---

*AI-optimized specification. Original design: design.md*
