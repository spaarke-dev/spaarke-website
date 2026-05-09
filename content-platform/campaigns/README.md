# Campaigns

A campaign is a coordinated push around a theme — a hero asset
(usually a flagship article or launch event) plus the supporting
articles, LinkedIn posts, company-page posts, and outreach that
amplify it over a defined window.

This directory is the operating layer above `calendar.md`. The
calendar tracks *cadence* (one row per piece, what's planned for
when). Campaigns track *coordination* (which pieces fit together,
in what order, on which channels, to make a coherent push).

---

## Campaign calendar

| Campaign | Status | Window | Launch | Theme | Primary audience | Cadence | Milestone |
|---|---|---|---|---|---|---|---|
| [2026-05 Spaarke Launch](2026-05-spaarke-launch.md) | active | May 11 – May 31 | **May 11** | Introduce Spaarke and the Legal Operations Intelligence category | corporate-counsel | ~3 LI/wk (launch sprint) | [#1](https://github.com/spaarke-dev/spaarke-website/milestone/1) |
| [2026-06 Architecture and Trust](2026-06-architecture-and-trust.md) | planned | Jun 1 – Jun 30 | Jun 2 | How Spaarke runs structurally — Microsoft-native, customer tenant, data sovereignty, IT trust | corporate-it | ~2 LI/wk | [#2](https://github.com/spaarke-dev/spaarke-website/milestone/2) |
| [2026-07 AI Across the Lifecycle](2026-07-ai-across-the-lifecycle.md) | planned | Jul 1 – Jul 31 | Jul 7 | How AI shows up in legal — what attorneys need to know, grounding, engagement-boundary | corporate-counsel | ~1.6 LI/wk | [#3](https://github.com/spaarke-dev/spaarke-website/milestone/3) |
| [2026-08 Operating Model and Spend](2026-08-operating-model-and-spend.md) | planned | Aug 1 – Sep 30 (8-week window) | Aug 4 | Spend visibility, institutional memory, breaking the silo, the LOI maturity model | legal-operations | ~1 LI/wk | [#4](https://github.com/spaarke-dev/spaarke-website/milestone/4) |
| *2026-Q4 (TBD)* | — | — | — | Open — likely a continuation of Operating Model + the first major white paper as a standalone push | TBD | — | — |

**Asset summary:** 14 new pieces across the 4 campaigns + 15 LinkedIn syndications of existing-library articles + the Welcome launch. Each of the 16 already-published articles has a designated re-promotion slot; new Phase 2 calendar pieces are interleaved so cadence stays sustainable.

**Pacing principle:** ~2 LinkedIn posts per week is sustainable, 3/week is launch-only, 1/week is conservative. The 8-week August/September window is intentionally lower-cadence — leaves room for new ideas to land between the planned pieces.

---

## When to create a campaign

Create a campaign file when:

- A flagship article is launching and needs a 2–4 week amplification
  window (Welcome to Spaarke, a major white paper, a product
  announcement).
- A theme spans multiple pieces and benefits from being sequenced
  rather than dripped (e.g., June's architecture-and-trust arc:
  Why-Microsoft → TDD → Your-Legal-Data → IT-Team).
- An existing-library article merits a re-promotion moment (e.g.,
  $20B Blind Spot tied to a quarterly CFO-conversation push).

A LinkedIn post that stands alone — no flagship, no theme, no
sequence — does not need its own campaign file. It goes in the
calendar.

## File layout

Each campaign is one file: `<YYYY-MM>-<slug>.md`. The month is the
campaign's *launch* month, not its end month — campaigns often
extend past their launch window.

- `_template-campaign.md` — copy this when starting a new campaign.
- `2026-05-spaarke-launch.md` — the inaugural campaign.
- `2026-06-architecture-and-trust.md` — June arc.
- ... and so on.

## How campaigns interact with the calendar

The calendar is the schedule of *what publishes when*. A campaign
references calendar entries by slug — it doesn't duplicate them.
When a campaign is active, the calendar rows it covers carry an
optional `Campaign` column linking back.

If a piece is in a campaign, the campaign file is authoritative for
distribution choices (which LinkedIn posts, which channels, which
dates). The calendar tracks the underlying publish date and status.

## States

A campaign moves through five states. Update the file's `status:`
frontmatter field as it progresses.

| State | Meaning |
|---|---|
| **planned** | Theme and assets identified; dates and distribution being worked out |
| **scheduled** | Assets locked, dates set, distribution sequence finalized |
| **active** | Launch has happened; we're inside the amplification window |
| **complete** | Window closed; assets in evergreen rotation |
| **retro** | Post-campaign review captured at the bottom of the file |

## Pacing principle

Existing articles and new articles share the same pipeline. Two
LinkedIn posts per week is the sustainable rate; three is a push
week (launch, milestone). Five is a sprint and is not sustainable.

When designing a campaign, total the LinkedIn posts across all
assets and divide by the date range. If the result is more than
3/week, either extend the window or move pieces to a later
campaign.
