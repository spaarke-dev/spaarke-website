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

## The human test submission, 2026-11-12

`main` was merged into the branch first (`996d142`, 25 commits), and the
preview redeployed from it.

- The first attempt failed in the browser with "We couldn't verify the
  reCAPTCHA". The site key allowed only `spaarke.com`, so Google answered
  "Invalid domain for site key" on the preview hostname. The writer added
  the preview hostname to the key's domains.
- The second attempt succeeded at 20:19 UTC. The row landed in
  `DesignPartnerApplications` (partition `design-partner`), and the writer
  confirmed the mail at contactus@spaarke.com with reply-to set to the
  applicant.
- The test row was deleted straight after; the table was left empty.
- Not checked: the Plausible events (no access from this session) and the
  daily report listing (the row was gone before the report ran).

Production checks after the merge are in `launch-verification.md`.
