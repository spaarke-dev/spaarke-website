# Preview verification (task 031)

Preview: https://ambitious-bay-0fb5bb10f-124.1.azurestaticapps.net, built from
commit b6635f5 on 2026-10-22.

| Check | Result |
|---|---|
| `GET /design-partners` | 200 |
| `/advisory-group` | 308 to `/design-partners` |
| `/go/more-info-1?utm_source=postcard&utm_medium=print` | 307 to `/design-partners` with the query intact |
| PDF | 200, `application/pdf`, 1,575,103 bytes |
| Slide image through `next/image` | 200 |
| Canonical and Open Graph image | `https://spaarke.com/design-partners`, `/design-partners/og.png` (host from `SITE_URL`, as on every page) |
| Sitemap | lists `/design-partners` |
| reCAPTCHA site key on the page | present |
| No captcha token | 400 `CAPTCHA_FAILED`, so the secret is set on the preview |
| Invalid token | 400 `CAPTCHA_FAILED` |
| Empty body | 400 `VALIDATION_ERROR` with field errors |

## Still to check

- A real application through the browser: the confirmation, the row in
  `DesignPartnerApplications`, and the mail at contactus@spaarke.com with
  reply-to set to the applicant. It needs a person, because the invisible
  reCAPTCHA must pass, and it writes to the production table and inbox.
- The "Design Partner Submit" and "Overview Download" events in Plausible.
- The next daily report lists the application.
- Delete the test row afterwards.
