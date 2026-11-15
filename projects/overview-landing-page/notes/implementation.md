# Implementation notes, tasks 010 to 030

Built 2026-10-22 in the worktree `spaarke-website-wt-design-partner-page`.

## What was built

| File | What it does |
|---|---|
| `src/lib/design-partners.ts` | Fields, organization types, `normalizeApplication`, `validateApplication`; imported by the form and the route so the rules cannot drift |
| `src/lib/storage.ts` | `saveDesignPartnerApplication()`, table `DesignPartnerApplications`, partition `design-partner`; never throws |
| `src/lib/email.ts` | `sendDesignPartnerNotification()`; reply-to the applicant; says in the body whether the row was saved |
| `src/app/api/design-partners/route.ts` | Rate limit, validate, captcha (8 s timeout), store, email, telemetry flushed before every return |
| `src/lib/reports/daily.ts` | Design partner lines in the Leads section; a missing table reads as zero |
| `src/app/design-partners/page.tsx` | Hero, contribute and receive, slide strip, application |
| `src/components/DesignPartnerForm.tsx` | The form, modelled on `DemoRequestForm` |
| `src/components/SlideStrip.tsx` | Nine slides, scroll snap, alt text per slide, the next slide always peeking |
| `src/components/OverviewDownload.tsx` | PDF link with `download` and the "Overview Download" event |
| `src/lib/contact.ts`, `ContactForm.tsx` | Reason renamed; pointer to the page when chosen |
| `next.config.ts` | `/advisory-group` 308 and `/go/more-info-1` 307 to `/design-partners` |
| `src/types/plausible.d.ts`, `src/app/sitemap.ts` | Two events, one sitemap entry |

## Decisions made while building

- **Captcha failure is 400 `CAPTCHA_FAILED`, not 403.** Every existing form
  route returns that, and the forms read the error code. Spec FR-07 updated.
- **The page is dynamic, not static.** The reCAPTCHA site key is an app
  setting read at request time, as on `/access-request`. Spec FR-01 updated.
- **The route follows the contact route's shape, not early-release's.**
  Storage and email are independent; only losing both returns 500. The
  early-release route awaits its table write bare, so a storage failure there
  skips the email.
- **No confetti on success.** The confirmation is plain text, in the
  register of the rest of the page.

## Checked locally (dev server, no storage or SendGrid settings)

| Check | Result |
|---|---|
| `GET /design-partners` | 200 |
| `/advisory-group` | 308 to `/design-partners` |
| `/go/more-info-1?utm_source=postcard&utm_medium=print` | 307 to `/design-partners?utm_source=postcard&utm_medium=print` |
| PDF | 200, `application/pdf` |
| Invalid body | 400 with all eight field errors |
| Valid body, nothing configured | 500 `INTERNAL_ERROR`: correct, since the application would be lost |
| Rate limit | 429 from the fourth request in a minute |
| `GET /api/design-partners` | 405 |
| Phone emulation at 360 px (DevTools protocol) | `scrollWidth` 360, no element past the viewport |
| `npm run typecheck`, `npm run build` | pass |
| `npm run lint` | no problems in changed files; 11 errors already on `main` in untouched files |
| Voice lint on the page copy | 0 errors |

Headless Chrome's `--window-size` does not lay out below about 500 px, so a
plain screenshot at 375 px looks clipped on every page. Use the DevTools
emulation script (`Emulation.setDeviceMetricsOverride`, `mobile: true`) for
phone checks.

## Left for the preview (task 031)

- A real submission: the row in `DesignPartnerApplications`, the mail at
  contactus@spaarke.com, reply-to, and the form's confirmation.
- `CAPTCHA_FAILED` with the secret set.
- The daily report with one application.
- Both Plausible events in the realtime view.
