# Handoff: paid LinkedIn program

Written 2026-10-26; restarted 2026-11-12, after the design partner page went
live. Delete this file once the open items below are closed. Budgets,
audiences, and account identifiers are in the private archive
(`C:\code_files\spaarke-research\2026-11-legal-ai-accelerator\build-sheet.md`
and `C:\code_files\spaarke-research\linkedin-carousel\lead-gen\HANDOFF.md`).

## State on 2026-11-12

| Item | Track | State | Blocks launch |
|---|---|---|---|
| Accelerator founder post, Thought Leader Ad (`2026-11-legal-ai-accelerator / reach`) | Brand | Live since 2026-11-04, one ad set for A1 and A2, ends 2026-11-30 | Nothing |
| Next brand ad, from 2026-12-01 | Brand | Not chosen (plan decision 12) | The owner picks a founder post; it is posted organically first |
| Accelerator brief and readiness checklist Document ads (`2026-11-legal-ai-accelerator / leadgen`) | Lead gen | Both Lead Gen Forms built 2026-11-04; the ads did not launch | Build or finish the ads, the pre-launch checklist, the owner's approval. Lead handling (plan decision 4) should be settled first |
| Accelerator scoping offer to W2 | Lead gen | Not built | W2 passes 300; the hero recut to 1200 by 627 |
| Design Partner overview Document ad (`2026-11-design-partner-program / leadgen`, Issue #127) | Lead gen | Ad brief ready; the campaign and draft ad set exist under their old names; the general Lead Gen Form is built | Starts 2026-12-19 by the owner's decision. Before then: the carousel posted (Issue #123), the renames, the form settings, the ad, the checklist, approval |
| Method series Thought Leader Ads and article ads | Brand | Planned, never built | Candidates for the brand track |

The site no longer blocks anything: `/design-partners` and the revised privacy
policy went live with PR #124 on 2026-11-12.

## Decisions on 2026-11-12

- **Launch order.** The accelerator lead ads go first and run to 2026-12-18.
  The Design Partner Document ad starts 2026-12-19, so A1 sees one lead gen
  offer at a time.
- **Budget rule kept.** Every LinkedIn campaign keeps a lifetime budget and
  an end date. Continuity comes from approving the next campaign in each
  track before the current one ends (plan section 5, procedure 2.6).
- **PR #133** (the accelerator paid plan) is folded into the restart PR and
  merges with it.

Earlier decisions stand: no Insight Tag (2026-10-28), the Design Partner
Program has its own campaign and Milestone 7 (2026-10-28), and paid runs as
two standing tracks (2026-11-04).

## Next manual steps in Campaign Manager

These are the owner's to do by hand. Nothing here launches, posts, or spends
without the owner.

**Now: the accelerator lead campaign**

1. Open `2026-11-legal-ai-accelerator / leadgen`. Build the ad sets and ads
   in Draft if they are not built: the brief ads `brief / v1-week`,
   `brief / v2-capital`, and `brief / v3-exact` to A1 and A2, and the
   checklist ads `checklist / v1-it` and `checklist / v2-legal` to A4. Paste
   the copy from the campaign file's *Ad briefs* unchanged.
2. Set the lifetime budgets and the end date 2026-12-18 from the private build
   sheet. The budget was set for a 2026-11-04 start, so confirm it still fits
   the shorter window.
3. Confirm who replies to leads and from which address (plan decision 4).
4. Submit a test lead through each form, then delete it from the count.
5. Run the pre-launch checklist (build sheet section 6), approve, and set the
   campaign Active.
6. Two days later, check delivery and disapprovals.

**By 2026-11-30: the next brand ad**

7. Choose the founder post to sponsor from 2026-12-01 (plan decision 12),
   post it organically, and build its Thought Leader Ad in Draft with a
   lifetime budget and an end date. Approve it to start on 2026-12-01.
8. Move any unspent reach budget to the best lead ad set, as the build sheet
   says.

**By 2026-12-18: the Design Partner Document ad**

9. Post the overview carousel to the company page some days before
   2026-12-19 (Issue #123), with the link
   `https://www.spaarke.com/design-partners?utm_source=linkedin&utm_medium=social&utm_campaign=spaarke-overview`.
   Then run the ship step in
   `content-platform/articles/spaarke-overview-carousel/tasks.md` section 6.
10. Rename the "Spaarke Overview" campaign to
    `2026-11-design-partner-program / leadgen` and the draft ad set "Spaarke
    Overview Presentation" to `A1-legalops / B / document / 202612`; confirm
    its format is Document.
11. In the general Lead Gen Form, set the thank-you link to
    `https://www.spaarke.com/design-partners?utm_source=linkedin&utm_medium=paid&utm_campaign=2026-11-design-partner-program&utm_content=lead-form`,
    and confirm the optional updates checkbox and the hidden field
    `source=linkedin-lead-form`. Submit a test lead.
12. Build the ad `overview-doc-decisions-question` from the ad brief in
    `campaigns/2026-11-design-partner-program.md`, with four preview pages.
13. Set the lifetime budget and an end date (plan decision 13), run the
    pre-launch checklist (procedure 7.3), approve, and schedule the start for
    2026-12-19.

## Open items

Items marked **[UI]** in the procedure (section 9) still need a look in
Campaign Manager: current minimum budgets, auction mechanics, Lead Gen Forms
on Thought Leader Ads, the flexible versus standard creation method, and the
menu labels after the rename.

Owner decisions still open (plan section 10): total budget and test
allocation, target markets, lead handling, the brand ad from 2026-12-01, the
Design Partner Document ad's end date and its successor, which founder posts
are approved for Thought Leader Ads, the qualified-lead definition,
named-account uploads, and the advisory group wording in paid copy.
