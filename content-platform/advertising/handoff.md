# Handoff: LinkedIn advertising procedure and plan

Written 2026-10-26 to move this work from the laptop to the desktop. Delete
this file once the open items below are closed.

## State

- Branch: `docs/linkedin-advertising`, cut from `origin/main` (not from the
  `content/legal-operations-ontology` branch, which does not carry the
  campaign files).
- Two documents drafted in this folder:
  - [`linkedin-ads-procedure.md`](linkedin-ads-procedure.md): how LinkedIn
    works, objectives, routes, ad types, the Campaign / Ad set / Ad build
    structure with how-tos, targeting, measurement, creative rules, and the
    operating procedure.
  - [`linkedin-ads-plan.md`](linkedin-ads-plan.md): purpose, objectives,
    audiences, an asset-by-asset route and format table, phases 0 to 4, the
    build structure, how paid fits the campaign and content plan, governance,
    open decisions.
- The procedure was checked against LinkedIn's own help pages and ads guide
  on 2026-10-24. Both files are drafts and have not had the voice lint run.

## Findings that changed the first draft

- LinkedIn renamed two Campaign Manager levels from about October 2025: the
  old campaign group is now **Campaign**, the old campaign is now **Ad set**.
  Ads and the ad account are unchanged. Older help pages and the API may
  still use the old names.
- Thought Leader Ads cannot sponsor posts that carry a document, so the
  overview carousel runs as a Document ad from the company page. A lead form
  on a Thought Leader Ad is unconfirmed.
- A lead-generation Document ad accepts only PDF, and a gated one needs at
  least one preview page.
- LinkedIn allows one objective per campaign. The build rule is therefore one
  LinkedIn campaign per Spaarke campaign file and per objective.

## Open items

Items marked **[UI]** in the procedure (section 9) need a look in Campaign
Manager, which cannot be done from a session:

- [ ] Current minimum daily and lifetime budgets (older pages say $10 and
      $100; the newer page says the interface shows the minimum)
- [ ] Auction mechanics (not described in the help pages read)
- [ ] Whether Lead Gen Forms work on Thought Leader Ads
- [ ] Flexible versus standard ad creation method
- [ ] Exact menu labels after the rename, and effects on the API

Plan decisions for the owner (plan section 9): total budget and test
allocation, target markets, whether the Design Partner Program gets its own
campaign file and milestone (recommended: yes), lead handling, which founder
posts are approved for Thought Leader Ads, the qualified-lead definition.

Follow-on edits the plan calls for, not yet made:

- [ ] A *Paid support* section in `campaigns/_template-campaign.md` and in
      `campaigns/2026-10-the-spaarke-method.md`
- [ ] A *Paid* column in `calendar.md`
- [ ] A paid label in `github-setup.md` and the Project convention
- [ ] `npm run voice:lint` on both files

## Notes

- Budgets, audience lists, and account identifiers stay out of the repo; they
  belong in the private archive.
- The overview carousel (`spaarke-overview-carousel`, Issue #123) is the
  first paid test, running as a gated Document ad. Its posting and ship steps
  are tracked in its own `tasks.md`.
- `projects/overview-landing-page/current-task.md`, which the carousel notes
  cite for the Document Ad setup, was not on `main` and was not read.
- On the desktop: `git fetch origin --prune`, then
  `git checkout docs/linkedin-advertising` (or the merged `main` once the PR
  is in), and run `npm install` if `package.json` changed.
