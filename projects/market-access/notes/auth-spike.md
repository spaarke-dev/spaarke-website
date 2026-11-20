# Auth spike (task 001): findings and decision

Tested 2026-11-19 on the preview environment of draft PR #163 (closed without merging), using the pre-configured Microsoft Entra provider with no custom registration. Signed-out tests used curl. Signed-in tests ran in a browser, signed in as Ralph with the `admin` role.

## Findings

| # | Question | Result |
|---|---|---|
| 1 | Do route rules guard hybrid pages and route handlers? | **Yes.** Signed out, `/admin`, `/admin/spike`, `/admin/spike/`, `/admin%2Fspike`, an RSC request (`RSC: 1`, `?_rsc=`) and `/api/admin/whoami` all get the SWA 401 before Next.js runs. `/api/Admin/whoami` also gets a 401, because SWA matches routes case-insensitively. `/Admin/spike` returns the Next.js 404 since no route exists there, so changing case does not bypass the rule. |
| 2 | Signed in without the role? | **403**, SWA's own HTML page, returned before Next.js runs (tested with a rule that requires a role nobody has, on both a page path and an API path). |
| 3 | Does `x-ms-client-principal` reach server components and route handlers? | **Yes, both.** The decoded principal holds `identityProvider` (`aad`), `userId`, `userDetails` (the sign-in address) and `userRoles` (`admin`, `anonymous`, `authenticated`). There is no `claims` array. SWA also sends `x-ms-client-principal-id`, `-name`, `-idp` and `x-ms-auth-token`. |
| 4 | Can a visitor forge the principal? | **No.** A forged `x-ms-client-principal` sent to a route without a rule is stripped, so Next.js receives none. Forged `-id` and `-idp` headers are overwritten with `anonymous` and `azureStaticWebApps`. The server check can trust the header. |
| 5 | Does a 401 `responseOverrides` redirect disturb existing routes? | **No.** It rewrites only 401s that SWA itself generates. `/api/reports/daily` still returns its own JSON 401. SWA fills in `post_login_redirect_uri=.referrer` with the requested path, so a signed-out visit to `/admin/spike` redirects to sign-in and then returns to `/admin/spike`. However, it would also turn SWA's 401 on `/api/admin/*` into a 302, which API callers should not get. |
| 6 | Do production invitations apply on a preview environment? | **Yes.** The `admin` role from the production invitation appeared on the PR preview. |
| 7 | How long do Table Storage writes take from a route handler? | createTable takes 98 ms the first time and 11 ms after that; upserts take 6 to 11 ms, and a delete takes 7 to 8 ms. The 1,500 ms `recordActivitySafe` timeout leaves wide headroom. |

Other findings:
- `/.auth/login/aad` works without a tenant ID in config.
- With a route rule, `/.auth/login/github` returns 404.
- A signed-in request carries about 3.7 KB of headers: the auth cookie is about 320 bytes and `x-ms-auth-token` about 1.1 KB, well under the backend's 16 KB limit (a 12 KB cookie passes; 16 KB gets a 431).

One unexplained failure: Ralph's first signed-in attempt in Chrome returned SWA's plain-text "Backend call failure" on both admin routes. The same account and routes worked in a second browser minutes later. If it comes back, compare the request headers with `/api/market/spike-unguarded?sizes=1` (spike branch) and check the backend logs.

## Decision

- **Provider:** the pre-configured Microsoft Entra provider. Roles (`admin`, later `investor`) are assigned by invitation in the portal. No tenant ID, client ID or secret goes in git or app settings.
- **Pages:** route rules on `/admin` and `/admin/*` with `allowedRoles: ["admin"]`, plus a global 401 override that redirects to `/.auth/login/aad?post_login_redirect_uri=.referrer`. Signed out, a visit goes to sign-in; signed in without the role, SWA returns 403. The admin layout calls `requireAdmin()` as a second check, and every admin page that reads data calls it again, because a layout does not re-render on client navigation.
- **API:** no `allowedRoles` rule on `/api/admin/*`, so the 401 override cannot turn API answers into redirects. Every handler starts with `requireAdminApi()` and returns a JSON 401 or 403. This is safe because SWA strips forged principal headers (question 4). A rule on `/api/admin/*` adds only `X-Robots-Tag: noindex`.
- **GitHub sign-in** stays blocked with a 404 rule on `/.auth/login/github`.
