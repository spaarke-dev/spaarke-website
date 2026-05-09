# Campaigns

A campaign is a coordinated push around a theme — a hero asset
(usually a flagship article or launch event) plus the supporting
articles, LinkedIn posts, company-page posts, and outreach that
amplify it over a defined window.

This directory is the operating layer above `calendar.md`. The
calendar tracks *cadence* (one row per piece, what's planned for
when). Campaigns track *coordination* (which pieces fit together,
in what order, on which channels, to make a coherent push).

## See the full campaign list

The campaign calendar — every campaign with its window, theme,
audience, and milestone link — lives at
[`calendar.md`](calendar.md). Bookmark that page; it's the
single-pane overview.

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
