# Task 032: Organizations

**Phase:** 3 (Admin pages)
**Status:** done
**Estimated:** 2 hours
**Dependencies:** 030
**Tags:** nextjs, react, api

## Goal

`/admin/organizations` lists organizations and `/admin/organizations/[id]` shows one with its contacts and recent activity, with edits and the domain override.

## Context

FR-04 and FR-15.

## Steps

1. List page with search and a contact count per organization (visibility-filtered).
2. Detail page: fields, contacts, recent activity across its contacts.
3. Admin API: edit fields; set a domain override that points a domain to another organization and re-links its contacts; audited.

## Expected outputs

- `src/app/admin/organizations/page.tsx`, `src/app/admin/organizations/[id]/page.tsx`
- `src/app/api/admin/organizations/**/route.ts`

## Acceptance criteria

- [x] Two contacts at the same company domain list under one organization (FR-04 acceptance).
- [x] An override moves a domain's contacts to the chosen organization.

## Notes

- Spec references: FR-04, FR-15, NFR-06.

## As built

- `src/lib/market/org-admin.ts`: the list (`loadOrganizations`, with contact counts and last activity from the contacts the user may see), search by name, domain or website (`filterOrganizations`), one organization with its contacts and the latest 25 activities across its 20 most recent contacts (`organizationDetail`), edits by hand (`editOrganization`: name, website, kind, notes, visibility) and domain overrides (`addDomain`, `removeDomain`).
- Kind uses the contact kinds list (prospect, design partner, customer, investor, partner, press, other), or is left unset.
- Adding a domain writes the override row, then moves every contact whose primary email is at that domain. The domain's own organization is removed when nothing is left in it and no other override points at it; its website, kind and notes fill the target's empty fields. Name is not carried over. A general contact moving in makes an investor-only target general, the same rule as `resolveOrganization`.
- Removing a domain deletes the override and sends the domain's contacts in this organization back to an organization of their own, found or created as a new contact's would be (named by the bare domain until edited).
- Refused: free-mail domains, the organization's own domain, a domain already pointed here, and a domain whose current organization the user may not see. Counts in the response leave out contacts the user may not see.
- Audit actions: `organization.edit`, `organization.domain_add`, `organization.merged_into`, `organization.domain_remove`. Rows hold domains and counts, no email addresses.
- Routes: `PATCH /api/admin/organizations/[id]`, `POST` and `DELETE /api/admin/organizations/[id]/domains` with `{ domain }`. `organizationRequest` in `admin-api.ts` returns 404 for an organization the user may not see.
- Pages: `/admin/organizations` and `/admin/organizations/[id]`; the nav link is on; contact pages and the contacts list link to the organization.
- Fix found while testing: the 30-second contacts cache in `queries.ts` was a module-level map, and Next.js loads the module separately for pages and API routes, so an edit cleared the route's copy while the page kept the old list. The map now lives on `globalThis`, one per process. This also makes contact edits show at once on the contacts list.
- Checks: one pure check (domain parsing, edit parsing, search) and one storage check (two contacts at one domain under one organization; counts hide investor contacts; edits; an override moves both contacts at a second domain, folds its organization in and catches the next new contact there; removing it moves them back; investor organizations stay hidden and cannot be moved by an admin without the role; audit rows hold no address). 46 pass.
- Browser, against Azurite: list and search, add and remove a domain from the page (the page updates at once), edit form, error messages for bad input, links from contacts, and both pages at 375 px with no sideways scroll.
