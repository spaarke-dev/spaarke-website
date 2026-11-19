# Task 032: Organizations

**Phase:** 3 (Admin pages)
**Status:** not-started
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

- [ ] Two contacts at the same company domain list under one organization (FR-04 acceptance).
- [ ] An override moves a domain's contacts to the chosen organization.

## Notes

- Spec references: FR-04, FR-15, NFR-06.
