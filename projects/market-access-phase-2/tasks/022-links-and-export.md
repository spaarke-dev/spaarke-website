# Task 022: Links and export

**Phase:** 2 (Codes, briefs and links)
**Status:** done
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

- [x] The export opens in Excel with one row per coded member the admin can see.
- [x] A click on an exported Ask AI link counts for that member.
- [x] The export is never saved on the server or in the repo.

## Notes

- The site page field accepts only spaarke.com paths, so the export cannot carry a link elsewhere.
- Spec references: FR-05, NFR-01, NFR-02.

## As built

- `src/lib/market/campaign-links.ts`: `campaignLinks` gives each coded member the user may see (through the cached contact list, so hidden and deleted contacts drop out) their brief link, an Ask AI link for each provider (`src` the code, `k` the key) and, when a page was entered, a tagged page link. A member without an active brief row gets no brief link, and Ask AI then carries the code alone, so turning the briefs off also takes them out of the export. Sorted by name. Audit `campaign.export` with the count.
- `parsePagePath` takes a path or an `https://` spaarke.com address and refuses anything else; tags already in the address are dropped and set again (`utm_source=email`, `utm_medium=outreach`, `utm_campaign=<slug>`, `src=<code>`).
- `src/lib/market/links-csv.ts` (pure, used in the browser): the CSV with a byte order mark and CRLF lines. A cell starting with `=`, `+`, `-` or `@` gets an apostrophe, so a name cannot run as a formula in Excel.
- `GET /api/admin/campaigns/[slug]/links?page=`: `no-store`, and refused when the request comes from another site, since the answer carries brief keys.
- The campaign page has a Links section: the page field, "Show links" (loaded on request, not with the page), a table with copy buttons, and "Export links", which builds the file in the browser.
- Checks: 71 pass with fresh tables. Browser against Azurite: another site refused; two rows; the CSV downloads with the byte order mark and the tagged page link; the exported brief link answers 200 and the Ask AI link redirects to Claude; both count for that member and not the other; axe at desktop (only the header button contrast that predates this work) and at 375 px (none), no sideways scroll.
- One full check run stalled in this block twice and could not be reproduced: the block alone, and the next full run, took a quarter of a second.
