# Launch verification (task 090)

PR #124 merged on 2026-11-12 as `f9b7c23`. The production deploy from `main`
finished the same afternoon. Every check below ran against
https://www.spaarke.com after that deploy.

## Routes

| Check | Result |
|---|---|
| `GET /design-partners` | 200 |
| `/advisory-group?utm_source=test` | 308 to `/design-partners?utm_source=test`, query intact |
| `/go/more-info-1?utm_source=postcard` | 307 to `/design-partners?utm_source=postcard`, query intact |
| `/design-partners/spaarke-overview.pdf` | 200, `application/pdf` |
| `/privacy` | 200, includes the LinkedIn lead forms section |
| `/contact` | offers "Join the design partner program" and, from `main`, "Book an accelerator scoping session" |
| `/accelerator` | 200 (merged in from `main` before the PR merged) |
| Sitemap | lists `/design-partners` |

## Spec success criteria

| # | Criterion | Result |
|---|---|---|
| 1 | Renders at desktop and 360 px | Pass. Checked on the preview in task 031; Lighthouse mobile in production shows no layout shift (CLS 0) |
| 2 | A test application lands in the table and at contactus@spaarke.com | Pass. Submitted on the preview on 2026-11-12 at 20:19 UTC. The row was stored and the writer confirmed the email and its reply-to. The row was then deleted |
| 3 | The PDF downloads and both Plausible events fire | PDF passes. The Plausible events were not checked, because this session has no Plausible access |
| 4 | Both redirects keep the query string | Pass, in production |
| 5 | The contact form accepts the renamed reason | Pass. The reason is in the shared list the server validates against |
| 6 | Typecheck, lint, build | Pass. Typecheck and build were rerun locally after the merge from `main`; CI built and deployed |
| 7 | Page copy passes voice lint | Pass in task 020; the copy did not change since |
| 8 | No carousel HTML committed | Pass. The PR file list has no carousel or `source.html` files |

Not done: the check that the next daily report lists the application. The
test row was deleted before the report ran, so that check has nothing to find.
The report section was checked on the preview in task 031 against the empty
table.

## Lighthouse, production, 2026-11-12

Lighthouse 12.6.1, headless Chrome.

| Category | Mobile | Desktop |
|---|---|---|
| Performance | 79 | 98 |
| Accessibility | 95 | 95 |
| Best practices | 79 | 78 |
| SEO | 100 | 92 |

Mobile LCP 3.6 s, TBT 280 ms, CLS 0. Desktop LCP 0.9 s, CLS 0.

The task asks for accessibility and SEO at 95 or above. Accessibility meets
it. Desktop SEO at 92 comes from one audit, "robots.txt is not valid", which
does not hold up: `/robots.txt` allows everything and names the sitemap, and
the mobile run passed the same audit. Treat it as a fetch failure in that run.

What the audits flagged, none of it blocking:

- **Color contrast.** The site-wide button blue `#5078DC` with white 14 px
  text measures 4.14:1, short of 4.5:1. It is the header "Get access" button
  as well as the page's two calls to action, so the fix belongs in the
  design tokens, not this page. The inline links in `text-cta-blue`
  (`#4060DC`) on the near-black background measure 3.69:1. The 10 px
  reCAPTCHA notice in `#646464` measures 3.34:1.
- **Heading order.** One `h3` follows a heading more than one level above it.
- **Third-party cookie.** `_GRECAPTCHA`, which the privacy policy already
  names.

## After the launch

- The preview hostname
  `ambitious-bay-0fb5bb10f-124.1.azurestaticapps.net` was added to the
  reCAPTCHA key's domains for the test. Remove it in the reCAPTCHA admin
  console now that the preview is gone.
