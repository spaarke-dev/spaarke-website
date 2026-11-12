---
slug: 2026-11-design-partner-program
name: Design Partner Program
status: planned                    # planned | scheduled | active | complete | retro
date_range:
  start: "**TBD — confirm**"       # the day the overview Document ad launches, after PR #124 puts /design-partners live
  launch: "**TBD — confirm**"
  end: "**TBD — confirm**"         # the Document ad runs with a lifetime budget and an end date (procedure 7.2)
owner: rs
milestone: "2026-11 Design Partner Program (GitHub milestone 7)"
theme: "Invite legal departments and law firms to help direct Spaarke as design partners, with early and free access in return for product direction, requirements, and feedback."
audience: legal-ops-director       # co-primary: firm-operations-leader; A5 named accounts in phase 3
---

# Design Partner Program

## Theme

Spaarke is building a Legal Operations Intelligence platform with the people
who will use it. The Design Partner Program asks a small number of legal
departments and law firms to contribute product direction, functional
requirements, and user feedback, and gives them early access, free access, and
a hand in what gets built first. Every asset in this campaign leads to one
action: an application at `/design-partners`, or a Lead Gen Form on LinkedIn
that starts the same conversation.

This is the program's conversion campaign. The content campaigns (The Spaarke
Method, Legal Operations Intelligence) build the argument; this one asks the
reader to act on it.

## Why now

The overview carousel and the design partner page are ready together, and
the Spaarke Method series has set out how an engagement works. A reader who
has seen the argument now has a concrete next step.

## Narrative arc

1. **The overview carousel** (organic post, then the gated Document ad).
   Legal runs on decisions; Spaarke makes them intelligent. Ends with an
   invitation to help shape the platform.
2. **The design partner page** (`/design-partners`). The nine slides, the PDF,
   what partners contribute and receive, and the application.
3. **The Spaarke Method** (linked from the page). How the work with a partner
   is organized.
4. **A reply from the team**, by email, within two working days (procedure
   7.5).

## Assets

| Date | Type | Slug | Status | Channel(s) | Notes |
|---|---|---|---|---|---|
| **TBD — confirm** | site page | `/design-partners` | review | website | PR #124; live when it merges. `/advisory-group` and `/go/more-info-1` redirect here |
| **TBD — confirm** | linkedin-ad | overview-document-ad | brief | linkedin (paid) | the carousel PDF as a gated Document ad; see Paid support |
| **TBD — confirm** | linkedin-lead-form | general lead form | approved | linkedin (paid) | "Make every legal decision intelligent"; reusable across campaigns |
| **TBD — confirm** | linkedin-ad | design-partner-image-ad | planned | linkedin (paid) | phase 1: single image to `/design-partners`, to compare with the form route |
| **TBD — confirm** | linkedin-ad | design-partner-conversation-ad | planned | linkedin (paid) | phase 3: a Conversation ad to a named shortlist |

The organic carousel post is an asset of `2026-10-the-spaarke-method`, Issue
#123.

## Distribution sequence

| Date | Channel | Action |
|---|---|---|
| **TBD — confirm** | website | Merge PR #124 after the test application; `/design-partners` and the revised privacy policy go live |
| **TBD — confirm** | linkedin | Post the overview carousel to the company page (organic; Issue #123) |
| **TBD — confirm** | linkedin (paid) | Launch the overview Document ad, after the pre-launch checklist (procedure 7.3) and the owner's approval |
| Launch plus 48 hours | linkedin (paid) | Delivery, disapproval, form, and landing page check |
| Weekly | linkedin (paid) | Download leads, reply within two working days, record fit; weekly report with one decision |

## Paid support

Rules: `advertising/linkedin-ads-procedure.md`. Plan:
`advertising/linkedin-ads-plan.md`. Budgets, audience lists, and account
identifiers are in the private archive.

| Asset | Route | Format | Objective | Audience | Window | Status |
|---|---|---|---|---|---|---|
| Overview carousel PDF | B | Document ad, four preview pages, the rest gated by the Lead Gen Form | Lead generation | A1, then A2 | **TBD — confirm** | brief |
| `/design-partners` | A | Single image | Website visits | A1, A2 | Phase 1 | planned |
| Design partner shortlist | D | Conversation ad | Lead generation | A5 | Phase 3 | planned |

### Ad brief: overview Document ad

| Field | Value |
|---|---|
| Issue | [#127](https://github.com/spaarke-dev/spaarke-website/issues/127) |
| Asset | `spaarke-overview-carousel.pdf`, nine pages, 1080 by 1350 |
| LinkedIn campaign | `2026-11-design-partner-program / leadgen` (rename of the existing "Spaarke Overview" campaign, Lead generation) |
| Ad sets | `A1-legalops / B / document` (rename of the draft "Spaarke Overview Presentation"; confirm its format is Document); `A2-firmops / B / document` later, so cost per lead can be compared |
| Audience A1 | United States; job function Legal at Director, VP, CXO, Owner, Partner, or titles General Counsel, Chief Legal Officer, Deputy and Associate General Counsel, legal operations head, director, or manager; company size 501 and above; at least 50,000 members |
| Placement | LinkedIn feed only. Audience Expansion off; LinkedIn Audience Network off |
| Bidding and budget | Maximum delivery for the first two weeks, then a cost cap near the observed cost per lead. Lifetime budget and end date in the private archive |
| Ad name | `overview-doc-decisions-question` |
| Introductory text | Your legal team makes thousands of decisions. What does it learn from them? These nine slides show how Spaarke brings your data, rules, and people into one model, so AI proposes and your team decides. |
| Document title | Spaarke overview: legal runs on decisions |
| Preview pages | 4: cover, problem, ontology, architecture. The invoice review example is the first gated page |
| Lead Gen Form | the general form; thank-you link `https://www.spaarke.com/design-partners?utm_source=linkedin&utm_medium=paid&utm_campaign=2026-11-design-partner-program&utm_content=lead-form` |
| What counts as a result | A lead from the form; a qualified lead is one whose title and organization match A1 or A2 (owner to confirm, plan decision 7) |
| Measurement | Leads and cost per lead in Campaign Manager; qualified share from the weekly follow-up; no Insight Tag |
| Success measure | Recorded at the end of phase 1: cost per qualified lead and the number of design partner conversations |

## Success metrics

Tracked at retro. Do not pre-commit to numbers; pre-commit to what to measure.

- Design partner applications on the site, by source (Plausible and the
  `DesignPartnerApplications` table)
- Lead Gen Form leads, and the share that are qualified
- Cost per qualified lead, by ad set
- Design partner conversations held, and partners signed
- Overview PDF downloads from `/design-partners`

## Retro

Filled in after `complete`.
