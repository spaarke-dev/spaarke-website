# Task 001: Auth spike on a preview environment

**Phase:** 0 (Foundations)
**Status:** done (findings in `notes/auth-spike.md`)
**Estimated:** 3 hours (plus Ralph's sign-in on the preview URL)
**Dependencies:** none
**Tags:** swa, azure, nextjs, api, config

## Goal

A short note, `projects/market-access/notes/auth-spike.md`, that answers each question below with evidence from a real preview environment, and ends in a decision on how `/admin` and `/api/admin` are guarded. The spike code is throwaway and is removed or replaced by task 002.

## Context

FR-01 needs `/admin/*` and `/api/admin/*` guarded by Entra sign-in and the `admin` role. The spec assumes `staticwebapp.config.json` route rules protect hybrid Next.js routes, with a server check of `x-ms-client-principal` as the fallback. Microsoft documents only partial support for `staticwebapp.config.json` in hybrid Next.js apps, so this has to be tested, not assumed.

A custom Entra registration in `staticwebapp.config.json` needs an `openIdIssuer` URL that contains the tenant ID, which NFR-01 keeps out of git. The pre-configured Microsoft Entra provider (`/.auth/login/aad`) needs no registration, and roles can be assigned by invitation, so it is the first option to test.

## Questions

1. Signed out, does a route rule with `allowedRoles: ["admin"]` stop a request to a hybrid page (`/admin/spike`) and to a route handler (`/api/admin/whoami`)? What status comes back?
2. Signed in without the role, is the answer 403?
3. Does `x-ms-client-principal` reach a route handler and a server component (`headers()`), and does it carry `userRoles` with the invitation role?
4. If a visitor sends a forged `x-ms-client-principal` header to a route that has no rule, does SWA strip or overwrite it before Next.js sees it?
5. Does a `responseOverrides` entry for 401 (redirect to sign-in) change the 401 that `/api/reports/daily` returns for a bad token? The daily report workflow depends on that 401.
6. Do invitations made for the production environment apply on a preview environment, or does the spike need its own?
7. Cost: how long does a single Table Storage upsert take from a route handler on the preview environment? (Feeds the 1,500 ms timeout in task 012.)

## Steps

1. Branch `feat/market-access-auth-spike` from `origin/main`.
2. Add `src/app/admin/spike/page.tsx` (server component that prints the decoded principal) and `src/app/api/admin/whoami/route.ts` (returns the decoded principal as JSON, or 401). Add `src/app/api/market/spike-unguarded/route.ts` with no rule, which echoes whether `x-ms-client-principal` arrived. Add a timing probe that does one upsert to a `MaSpikeDev` table. All marked `noindex`.
3. Add `routes` to `staticwebapp.config.json`:
   - `/admin/*` and `/api/admin/*` with `allowedRoles: ["admin"]`;
   - block `/.auth/login/github` (404), so only Entra sign-in is offered.
   Leave `responseOverrides` out for the first deploy.
4. Open a draft PR, so the SWA workflow builds a preview environment. Record the preview URL.
5. From a shell, test questions 1, 4 and 5 with `curl -i` (signed out, forged header, bad bearer token on `/api/reports/daily` of the preview).
6. Ask Ralph to: invite his work account with the `admin` role (Azure portal, Static Web App, Role management, Invite, provider Microsoft Entra ID), sign in on the preview URL, open `/admin/spike` and `/api/admin/whoami`, and then do the same with a second account that has no role. Write the steps for him in the PR description; do not change role assignments yourself.
7. Add the 401 override in a second commit, redeploy, and repeat the test for question 5.
8. Write `notes/auth-spike.md`: each question, what was run, the result, and the decision. Close the draft PR without merging (task 002 carries the real code), or mark it as the base for 002 if that is simpler.
9. Update `TASK-INDEX.md` and `current-task.md`.

## Expected outputs

- `projects/market-access/notes/auth-spike.md`: questions, evidence, decision
- A closed (or converted) draft PR with the spike routes

## Acceptance criteria

- [ ] Each of the seven questions has an answer backed by a recorded request and response.
- [ ] The decision names the provider (pre-configured or custom), whether route rules stay, and the exact server check every admin page and route will run.
- [ ] No tenant ID, mailbox address or secret is committed.

## Notes

- Forged-header behavior (question 4) decides whether the server check alone is safe. If SWA passes a forged header through on routes without a rule, the server check must only trust the header on routes that also have a rule, and task 002 keeps the rules.
- Next.js 16 renames `middleware.ts` to `proxy.ts`. A proxy check is optional; the layout and per-route checks are the guard.
- Spec references: FR-01, NFR-01, Assumptions (SWA route auth).
