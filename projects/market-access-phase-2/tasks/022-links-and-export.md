# Task 022: Links and export

**Phase:** 2 (Codes, briefs and links)
**Status:** not-started
**Estimated:** 3 hours
**Dependencies:** 021
**Tags:** nextjs, react, api

## Goal

The campaign page shows each coded member's links, and "Export links" downloads them as a CSV for writing the emails.

## Context

FR-05. With the export, Ralph can paste each person's links into an Outlook message, so every read and click counts for that person.

## Steps

1. `GET /api/admin/campaigns/[slug]/links`: for each coded member the admin can see, email, name, organization, group, template label, code, and:
   - the brief link (`/brief/<key>`), with the key read from `PrivateBriefs` by the member's label;
   - an Ask AI link for each provider, from `askLink(provider, code, key)`;
   - a tagged link to the site page Ralph enters, with `utm_source=email`, `utm_medium=outreach`, `utm_campaign=<slug>` and `src=<code>`.
   Answer with `Cache-Control: no-store`.
2. On the campaign page: a "Links" section with the site page field, a table (code, name, copy buttons), and "Export links".
3. Build the CSV in the browser with a byte order mark so Excel opens it as UTF-8; never write it on the server.
4. Audit `campaign.export` with the count only.
5. Checks: the links for a coded member, investor members left out for an admin without the role, a member without a brief left with an empty brief link.
6. In the browser against Azurite: open an exported brief link and an Ask AI link, and confirm both count for that member.
7. Update TASK-INDEX.md.

## Expected outputs

- `src/app/api/admin/campaigns/[slug]/links/route.ts`
- A links component on the campaign page
- Additions to `scripts/check-market.mts`

## Acceptance criteria

- [ ] The export opens in Excel with one row per coded member the admin can see.
- [ ] A click on an exported Ask AI link counts for that member.
- [ ] The export is never saved on the server or in the repo.

## Notes

- The site page field accepts only spaarke.com paths, so the export cannot carry a link elsewhere.
- Spec references: FR-05, NFR-01, NFR-02.
