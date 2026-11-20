# Task 002: Admin guard and shell

**Phase:** 0 (Foundations)
**Status:** done (PR pending merge)
**Estimated:** 3 hours
**Dependencies:** 001
**Tags:** nextjs, react, swa, api, seo, tailwind

## Goal

`/admin` exists in production behind the `admin` role, with a shared guard every admin page and admin route uses, and it is hidden from search.

## Context

FR-01 and FR-02. Every later admin page and route calls the same two functions, so a mistake here is a mistake everywhere. The design follows the decision in `notes/auth-spike.md`.

## Steps

1. Add `src/lib/market/auth.ts`:
   - `readPrincipal(headers)`: decode the base64 `x-ms-client-principal`, validate its shape, return `{ userId, userDetails, identityProvider, roles }` or null.
   - `requireAdmin()` for server components: redirect to `/.auth/login/aad?post_login_redirect_uri=<path>` when signed out, render a 403 page when the role is missing.
   - `requireAdminApi(request)` for route handlers: 401 or 403 JSON responses.
   - `canSeeInvestor(principal)` for FR-02.
   - A development-only principal from `MA_DEV_PRINCIPAL` when `NODE_ENV === "development"`, never in production builds.
2. Add `src/app/admin/layout.tsx`: calls `requireAdmin()`, sets `robots: { index: false, follow: false }`, renders a plain admin header (Home, Contacts, Organizations, Campaigns, Triage, Mailboxes, Import, Sign out to `/.auth/logout`).
3. Add `src/app/admin/page.tsx` as a placeholder home ("Signed in as ...").
4. Update `staticwebapp.config.json` with the route rules the spike kept, plus `X-Robots-Tag: noindex` for `/admin/*` and `/api/admin/*`.
5. Disallow `/admin` and `/api/admin` in `src/app/robots.ts`.
6. Remove the spike routes.
7. Add a check to `scripts/check-market.mts` (create it if missing) that feeds `readPrincipal` a valid header, a malformed one and one without the role.
8. Run `npm run typecheck`, `npm run lint`, `npm run build`.
9. PR through `push-to-github`; verify on the preview environment signed out, signed in without the role, and signed in as Ralph.

## Expected outputs

- `src/lib/market/auth.ts`
- `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`
- `staticwebapp.config.json`, `src/app/robots.ts`
- `scripts/check-market.mts`, `package.json` (`market:check` script)

## Acceptance criteria

- [ ] Signed out: `/admin` redirects to sign-in; `/api/admin/*` returns 401.
- [ ] Signed in without `admin`: 403 on both.
- [ ] Ralph sees the admin home on production after merge.
- [ ] `/admin` is disallowed in robots.txt and sends `noindex`.
- [ ] The dev principal cannot activate in a production build.

## Notes

- UI text follows the voice rules: US spelling, no em dashes.
- Spec references: FR-01, FR-02, FR-15 (acceptance), NFR-07.

## As built

- The header parsing lives in `src/lib/market/principal.ts` (no Next.js imports, so the check script can load it); `auth.ts` holds the guards.
- `/api/admin/*` has no SWA role rule, per the spike decision; the rule there only adds `X-Robots-Tag` and `Cache-Control`. Every admin route handler must start with `requireAdminApi()`.
- Step 6 had nothing to remove: the spike routes were only on the spike branch, which is not merged.
- Admin nav shows unbuilt sections as plain text until their tasks land.
