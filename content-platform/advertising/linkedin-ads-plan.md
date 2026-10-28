---
slug: linkedin-ads-plan
status: draft                      # draft | approved | active | retro
owner: rs
window:
  start: "**TBD — confirm**"
  end: "**TBD — confirm**"
procedure: linkedin-ads-procedure.md
---

# LinkedIn advertising plan

The plan for paid LinkedIn support of the campaign and content program. The
standing rules, definitions, and steps are in
[`linkedin-ads-procedure.md`](linkedin-ads-procedure.md). This file decides
what we pay to promote, to whom, in what order, and how we judge it.

Budgets, targeting lists, and account identifiers are not in this file. They
are kept in the private archive. Where a figure belongs here, the file says
**TBD — confirm** and the owner fills it in the archive.

---

## 1. Purpose

Organic LinkedIn reaches the people who already follow us. Paid reaches the
people we choose. The program needs two things paid can do and organic
cannot:

1. **Put the work in front of named job titles and accounts** at legal
   departments and law firms, in the markets we sell into.
2. **Turn attention into contact**, through gated assets and a design partner
   offer, so interest becomes a conversation we can follow up.

Paid is not a substitute for the content program. A weak asset promoted with
money is a weak asset that cost more.

## 2. Objectives

| # | Objective | Measured by | Target |
|---|---|---|---|
| 1 | Reach the primary audience with the overview and the Method series | Reach and frequency within the defined audience | **TBD — confirm** |
| 2 | Generate design partner and overview leads | Qualified leads, cost per qualified lead | **TBD — confirm** |
| 3 | Learn what works before scaling | A documented baseline per route and format by the end of phase 2 | Baseline recorded |
| 4 | Grow the retargetable audience | Size of the engagement audiences (each above 300 members) | **TBD — confirm** |

Pre-commit to what to measure, not to numbers, until phase 1 produces a
baseline (the same rule the campaign files use).

## 3. Audiences

The personas come from `voice/audience-personas.md`. Each audience is defined
in the private archive; this table records the definition rule only.

| Audience | Persona | Built from | Used in |
|---|---|---|---|
| A1: legal operations leaders | legal-operations (primary) | Job function and seniority, titles, company size | Overview, Method series, design partners |
| A2: law firm operations leaders | firm-operations-leader (co-primary) | Titles at law firms, firm size | Method series, firm-specific creative |
| A3: general counsel and senior counsel | corporate-counsel (secondary) | Titles, company size | Architecture and AI-lifecycle assets |
| A4: corporate IT | corporate-it (secondary) | Titles, company size | Architecture and trust assets |
| A5: named accounts | any | Company list upload | Design partner outreach, account-based phase |
| W2: ad and page engagers | any | Engagement audiences (document opens, video views, form opens) | Retargeting |

A1 and A2 are the launch audiences. A3 and A4 follow only when a campaign
aimed at them is live. There is no site-visitor audience (W1): it needs the
Insight Tag, which the owner decided on 2026-10-28 not to install (procedure
section 5.1).

## 4. Routes and formats by asset

This is the core table. Each row is a paid support decision, tied to an
existing campaign file.

| Asset | Campaign | Route | Format | Objective | Audience | Priority |
|---|---|---|---|---|---|---|
| Spaarke overview carousel (PDF) | 2026-11 Design Partner Program (the organic post stays in 2026-10 The Spaarke Method) | B | Document ad, first four slides shown, remainder gated by Lead Gen Form | Lead generation | A1, A2 | **First paid test; ready to build, not launched** |
| Founder syndication posts for the Method series (text or single-image posts only) | 2026-10 The Spaarke Method | C | Thought Leader Ad (with the founder's approval per post) | Engagement | A1, A2 | High |
| Method article 1 and later phase articles | 2026-10 The Spaarke Method | A | Single image to the article | Website visits | A1, A2 | Medium |
| Design partner program | 2026-11 Design Partner Program | A, B, D | Single image to `/design-partners`; Lead Gen Form; later Conversation ad to the named list | Lead generation | A5, A1, A2 | High |
| Legal Operations Intelligence series (five articles) | 2026-06 Legal Operations Intelligence | A | Single image per article, rotated | Website visits | A1 | Medium |
| State of Legal Operations field report (white paper or report, October) | open | B | Document ad with Lead Gen Form | Lead generation | A1 | High when published |
| Billing compliance intelligence white paper | 2026-06 Architecture and Trust (as scheduled) | B | Document ad with Lead Gen Form | Lead generation | A1, A3 | When published |
| Retargeting of ad and page engagers | all | E | Single image or Document ad | Lead generation | W2 | Phase 2 |
| Architecture and trust articles | 2026-06 Architecture and Trust | A | Single image | Website visits | A3, A4 | Low; only if the campaign is re-run |
| Video walkthrough | none | C | Video | Engagement | A1 | Deferred until a walkthrough exists |
| Event ad | none | C, B | Event ad | Registration | A1 | Deferred until an event exists |

Document ads and Thought Leader Ads are the first two formats because the
program already produces the assets for them (carousel PDFs, founder posts)
and they need no new production. Two limits from LinkedIn shape the table.
A post that carries a document is not eligible for a Thought Leader Ad, so
the carousel runs as a Document ad from the company page, not from the
founder's profile. And a lead form on a Thought Leader Ad is unconfirmed, so
founder posts are for reach and engagement, and lead capture runs through
Document ads and single image ads.

## 5. Phases

### Phase 0: foundation (before any new spend)

- [ ] Confirm ad account, company page link, billing, and roles in Campaign
      Manager (private archive)
- [ ] PR #124 merged, so `/design-partners` and the revised privacy policy
      are live (the Lead Gen Form links to both)
- [x] Insight Tag: not installed (owner decision, 2026-10-28; procedure 5.1).
      Leads are counted in LinkedIn; site actions are read in Plausible
- [ ] Apply the UTM convention (procedure section 5.1) to the overview
      Document ad and to the Lead Gen Form's thank-you link
- [ ] Build A1 and A2 and confirm each is at least 300 after location
- [ ] Decide where Lead Gen Form leads are kept and who replies (procedure
      7.5)
- [x] *Paid support* section in the campaign template and in the Spaarke
      Method and Design Partner Program campaign files (2026-10-28)
- [x] Paid label `type:paid-linkedin` and the Issue convention in
      `github-setup.md` (2026-10-28)

Gate: the owner confirms phase 0 is complete.

### Phase 1: baseline (the first four to six weeks)

- Read the running carousel Document Ad: delivery, completion, lead count,
  cost per lead, and above all lead quality
- Add the Thought Leader Ads for founder syndication posts on the Method
  series (eligible post types only, with the founder's approval of each)
- Send traffic to `/design-partners` with a single image ad and a Lead Gen
  Form, to compare the two routes (A and B) on the same offer. Without the
  Insight Tag, route A's applications are counted in Plausible and the
  applications table by UTM, not in Campaign Manager
- Run two to four creative variants per campaign, one variable at a time
- Weekly reports; one decision per week

Gate: a recorded baseline for each route and format used, and a decision on
which to scale, change, or stop.

### Phase 2: retarget and extend

- Start Route E on W2 with the best performing offer
- Add the State of Legal Operations report and the white paper as gated
  Document ads when they publish
- Extend the Method series articles to the paid mix as each phase article
  publishes
- Test a Lookalike audience once a seed list is large enough

Gate: retargeting cost and conversion recorded; the owner approves the
phase 3 scope.

### Phase 3: account-based and inbox

- Upload the named account list (A5) and run account-based creative
- Run a Conversation or Message ad to the design partner shortlist, with a
  personal tone and a small list
- Review inbox results carefully; stop at the first sign of audience
  irritation

### Phase 4: steady state

- A standing quarterly review of the paid program against this plan
- Paid support attached to each new campaign at the planning stage, as a
  default question in the campaign template
- Retire formats that have not earned their cost

Phase dates are **TBD — confirm** and depend on the October to November
cadence in the campaign calendar.

## 6. Build structure

Each row of section 4 becomes campaigns, ad sets, and ads as the procedure
sets out in section 3 of [`linkedin-ads-procedure.md`](linkedin-ads-procedure.md).
The rule in short: one LinkedIn campaign per Spaarke campaign file and per
objective, one ad set per audience and route, two to four ads per ad set.

| LinkedIn campaign | Objective | Ad sets | Ads |
|---|---|---|---|
| `2026-11-design-partner-program / leadgen` | Lead generation | `A1-legalops / B / document`, `A2-firmops / B / document`; later `A5-accounts / B / image` | Overview carousel PDF, gated, two to four hook variants; later a single image to the offer |
| `2026-10-the-spaarke-method / visits` | Website visits | `A1-legalops / A / image`, `A2-firmops / A / image` | One image per phase article |
| `2026-10-the-spaarke-method / reach` | Engagement | `A1-legalops / C / thoughtleader`, `A2-firmops / C / thoughtleader` | Approved founder posts |

The LinkedIn names are given as the procedure sets them. The audiences are
defined in the private archive. The campaign already in Campaign Manager as
"Spaarke Overview" (Lead generation) becomes
`2026-11-design-partner-program / leadgen`, and its draft ad set "Spaarke
Overview Presentation" becomes `A1-legalops / B / document`. The overview
Document ad sits in the Design Partner Program campaign because its leads are
design partner prospects; the organic carousel post stays an asset of The
Spaarke Method.

## 7. How this fits the campaign and content plan

| Layer | Existing | What paid adds |
|---|---|---|
| Campaign | `campaigns/<slug>.md`, one per theme, owns distribution choices | A *Paid support* section: which assets, which route, which audience, and the paid window |
| Calendar | `calendar.md`, one row per piece | An optional *Paid* column showing whether the piece has paid support, and its status |
| Pipeline | GitHub Project, Issues, Milestones | One Issue per paid campaign, in the same Milestone as the campaign, with the paid label |
| Piece | `articles/<slug>/` | Ad copy is drafted as part of the piece's `tasks.md` (a paid-support gate), and passes the same voice sweeps |
| Pacing | Two organic LinkedIn posts per week is the sustainable rate | Paid does not change the organic cadence. It sets a separate cap on active paid campaigns at one time per audience (**TBD — confirm**) so audiences are not saturated. |

Sequencing rule: **organic first, then paid.** A piece publishes, runs
organically for a few days, and paid support starts for pieces that earned
engagement or that are designed for conversion (gated assets, the design
partner offer). Document and Thought Leader posts that earn organic engagement
are the strongest candidates for sponsoring.

Paid support is decided when the campaign is planned, not after launch, so the
asset table and the paid table are written together.

## 8. Budget and governance

| Item | Where |
|---|---|
| Total program budget | Private archive; **TBD — confirm** |
| Budget per campaign | Private archive; set in the ad brief and approved by the owner |
| Test allocation | A fixed share of the program budget held back for tests and not committed to a campaign; **TBD — confirm** |
| Spend cap | Lifetime budget with an end date on every campaign; no open-ended daily budgets |
| Approvals | The owner approves the brief and budget, and approves each ad before launch |
| Reporting | Weekly operator report; monthly review with the owner; retro in the campaign file at close |

Stop rules, to be set from the phase 1 baseline: pause a campaign when cost
per qualified lead exceeds an owner-approved ceiling for two consecutive
weeks, or when frequency passes an owner-approved ceiling. Both ceilings are
**TBD — confirm**.

## 9. Open decisions

| # | Decision | Owner | Needed by |
|---|---|---|---|
| 1 | Total paid budget and test allocation | rs | Before phase 1 expands beyond the running ad |
| 2 | Markets and locations to target | rs | Phase 0 |
| 3 | ~~Does the Design Partner Program get its own campaign file and Milestone?~~ Decided 2026-10-28: yes. `campaigns/2026-11-design-partner-program.md`, Milestone 7 | rs | Done |
| 4 | Lead handling: where leads are kept, who replies, and the response time | rs | Phase 0 |
| 5 | Which founder or practitioner posts are approved for Thought Leader Ads | rs | Phase 1 |
| 6 | Whether named-account lists can be uploaded (consent and lawful basis) | rs | Phase 3 |
| 7 | Quality definition: what counts as a qualified lead | rs | Phase 1 |
| 8 | Confirm in Campaign Manager the items marked **[UI]** in the procedure (current minimum budgets, menu labels after the October 2025 rename) | operator | Phase 0 |
| 9 | ~~Insight Tag on the site?~~ Decided 2026-10-28: no. Engagement audiences only; see procedure 5.1 | rs | Done |
| 10 | Whether the carousel's advisory group wording matches the site's Design Partner Program name in all paid copy (the site redirects `/advisory-group` to `/design-partners`) | rs | Phase 1 |

## 10. Success review

Filled in at the end of phase 1 and again at each quarterly review.

| Question | Answer |
|---|---|
| Which route and format produced the best cost per qualified lead? | |
| Which audience produced the best lead quality? | |
| Did paid lift organic results for the same pieces? | |
| What did we stop, and why? | |
| What is the plan for the next quarter? | |
