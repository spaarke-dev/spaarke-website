# Matter Management — authoring guide

Per-step authoring notes for the **Matter Management** section of the
`full-walkthrough` tour. This file is the source of truth for what each
step should communicate and where the callout should land. Image files
in this directory are gitignored — drop processed final assets into
`public/tours/full-walkthrough/matter-management/`.

See `projects/product-walkthrough-app/tasks/07-matter-management-content.md`
for the surrounding task.

---

## How to fill this in

For each step block: source filename, final asset path, intent, callout
copy, anchor (plain-language hint + the normalized coords once
calibrated), side, notes (mask overrides, crop hints).

Claude reads this guide + the screenshots to write the `TourStep`
config in `src/content/tours/full-walkthrough/matter-management.ts`.
Preview each step at `?section=matter-management&step=N&grid=1` and
ask for adjustments.

---

## Steps

## Step 1 — daily-briefing
**Source**: `01-matter-management-daily-briefing.png` (5120×2880, no SANDBOX)
**Final asset**: `public/tours/full-walkthrough/matter-management/step-1-daily-briefing.webp` (2400×1350)
**Intent**: open the tour with the AI daily briefing — what the user lands on first thing in the morning.
**Callout**:
  title: Your day, summarized by AI
  body:  A real-time briefing surfaces what changed across your matters overnight — activity, priorities, and what to look at next.
  anchor: `{ x: 0.22, y: 0.14 }` — Daily Briefing panel header
  side:   right
**Notes**: first-draft anchor; preview with `?grid=1` and revise if needed.

## Step 2 — daily-briefing-preferences
**Source**: `02-matter-management-daily-briefing-preferences.png` (5120×2880, no SANDBOX)
**Final asset**: `public/tours/full-walkthrough/matter-management/step-2-daily-briefing-preferences.webp` (2400×1350)
**Intent**: show that the briefing is configurable per role — pin/hide cards.
**Callout**:
  title: Tailored to your role
  body:  Choose what your briefing surfaces — pin the cards that matter, hide the ones that don't. Every role gets the view it needs.
  anchor: `{ x: 0.30, y: 0.28 }` — preferences panel
  side:   right
**Notes**: anchor is provisional; revise after `?grid=1` review.

## Step 3 — workspace-overview
**Source**: `03-matter-management-workspace.png` (5120×2880, no SANDBOX)
**Final asset**: `public/tours/full-walkthrough/matter-management/step-3-workspace.webp` (2400×1350)
**Intent**: the user's personal workspace — the everyday home base.
**Callout**:
  title: Your home for every matter
  body:  A configurable personal workspace surfaces the matters, tasks, briefings, and documents your role needs — at a glance, without searching.
  anchor: `{ x: 0.16, y: 0.075 }` — Corporate Workspace dropdown, top-left under header
  side:   right
**Notes**: previously calibrated as the prior step 1; reused here as step 3.

## Step 4 — matter-list
**Source**: `04-matter-management-matter-list-view.png` (5120×2880, no SANDBOX)
**Final asset**: `public/tours/full-walkthrough/matter-management/step-4-matter-list.webp` (2400×1350)
**Intent**: every matter the user has access to, with status, type, and people working it.
**Callout**:
  title: Every active matter, one place
  body:  Matters roll up here with status, type, and the people working them. Filters and saved views match how your team thinks.
  anchor: `{ x: 0.22, y: 0.20 }` — column header / first row of the matter table
  side:   right
**Notes**: anchor placeholder; preview and revise.

## Step 5 — matter-detail
**Source**: `05-matter-managment-details-SANDBOX.png` (5120×2880, SANDBOX masked at default coords)
**Final asset**: `public/tours/full-walkthrough/matter-management/step-5-matter-detail.webp` (2400×1350)
**Intent**: drill into a single matter — overview, calendar, contacts, billing, report card.
**Callout**:
  title: Every matter, end-to-end
  body:  Open any matter to see its overview, calendar, contacts, billing, and report card without leaving the page.
  anchor: `{ x: 0.50, y: 0.30 }` — center of the matter detail panel
  side:   bottom
**Notes**: SANDBOX masked. Anchor is a starting point — likely needs to point at a specific tab or the side panel.

## Step 6 — semantic-search
**Source**: `06-matter-management-semantic-search-SANDBOX.png` (1533×861, SANDBOX masked with custom rect 1240,0,140,35)
**Final asset**: `public/tours/full-walkthrough/matter-management/step-6-semantic-search.webp` (1533×861)
**Intent**: close the section on the AI-search story — natural-language queries across every matter.
**Callout**:
  title: Ask, don't search
  body:  Natural-language search across every matter — pulls answers from records, documents, and AI summaries instead of returning a file list.
  anchor: `{ x: 0.50, y: 0.20 }` — search bar / AI answer area
  side:   bottom
**Notes**: smaller capture (1533-wide) — display dimensions match source. Custom mask coords used because default 5120-based coords don't apply.
