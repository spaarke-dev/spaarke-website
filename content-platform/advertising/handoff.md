# Handoff: LinkedIn advertising procedure and plan

Written 2026-10-26 on the laptop; updated 2026-10-28 on the desktop. Delete
this file once the open items below are closed.

## State

- Branch `docs/linkedin-advertising`, PR #126.
- [`linkedin-ads-procedure.md`](linkedin-ads-procedure.md): how LinkedIn
  works, objectives, routes, ad types, the Campaign / Ad set / Ad build
  structure, targeting, measurement, creative rules, and the operating
  procedure. Checked against LinkedIn's help pages on 2026-10-24.
- [`linkedin-ads-plan.md`](linkedin-ads-plan.md): objectives, audiences, the
  asset-by-asset route and format table, phases 0 to 4, the build structure,
  how paid fits the campaign and content plan, governance, open decisions.
- Voice lint: 0 errors on both files.

## Decisions made on 2026-10-28

- **No Insight Tag.** The privacy policy rewrite in PR #124 says the site
  sets no analytics or advertising cookies and has no banner (Clarity runs
  with cookies off). Lead generation ads are measured in LinkedIn;
  retargeting uses engagement audiences only; website-visit ads are read
  through UTM tags in Plausible. Procedure 5.1 and plan sections 3 to 5 now
  say so.
- **The Design Partner Program has its own campaign file and Milestone:**
  `campaigns/2026-11-design-partner-program.md`, Milestone 7. The overview
  Document ad moves there, because its leads are design partner prospects;
  the organic carousel post stays in The Spaarke Method.
- **Nothing is live in LinkedIn yet**: the carousel is not posted and the
  Document ad is not launched.

## Follow-on edits made

- [x] *Paid support* section in `campaigns/_template-campaign.md`, in
      `campaigns/2026-10-the-spaarke-method.md`, and in the new Design
      Partner Program file (with the full ad brief for the Document ad)
- [x] *Paid* column in `calendar.md`, documented under its own heading
- [x] `type:paid-linkedin` label, Milestone 7, and the paid Issue convention
      in `github-setup.md`

## Open items

Items marked **[UI]** in the procedure (section 9) need a look in Campaign
Manager:

- [ ] Current minimum daily and lifetime budgets
- [ ] Auction mechanics
- [ ] Whether Lead Gen Forms work on Thought Leader Ads
- [ ] Flexible versus standard ad creation method
- [ ] Exact menu labels after the rename, and effects on the API

Owner decisions still open (plan section 9): total budget and test
allocation, target markets, lead handling, which founder posts are approved
for Thought Leader Ads, the qualified-lead definition, named-account uploads,
and the advisory group wording in paid copy.

## Launch order for the first paid test

1. Writer: one test application on the PR #124 preview; then merge PR #124
   (`projects/overview-landing-page/current-task.md` has the steps).
2. Writer: post the carousel to the company page (Issue #123).
3. Operator: rename the Campaign Manager campaign and ad set to the plan's
   names, build the ad from the ad brief in the Design Partner Program
   campaign file, and set the Lead Gen Form's thank-you link to the URL in
   that brief.
4. Owner: pre-launch checklist (procedure 7.3), approve, set Active.
