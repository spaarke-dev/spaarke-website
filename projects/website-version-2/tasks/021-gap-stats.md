# Task 021: Section 2 — Gap stats

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 2 hours
**Dependencies:** 013, 006
**Tags:** component, home

## Context

Build per [mockup `home_02.jpg`](../v2%20mockup%20screenshots/home_02.jpg).

**Layout:**
- Dark slab (`<Slab tone="dark">`)
- Top hairline border above the section
- Two-column grid: heading + intro paragraph (left, ~1fr) | 2×2 stat grid (right, ~1.6fr)
- Mobile (≤960): stack heading above stats

**Copy** (from `src/content/home/gap.ts`, created in Task 006 — uses **mockup version** of stats, not v1.4 brief):

**Heading (left):** "Demand is rising. Visibility isn't." (use `&rsquo;` for the apostrophe)

**Intro paragraph (left):** "Legal departments and their outside counsel are working harder than ever — and operating with less of the data they need to do it well."

**Stats (2×2 grid, right):**

| Position | Number | Label | Detail | Source |
|---|---|---|---|---|
| TL | 77% | of in-house teams face increasing workload | — while business clients seek greater visibility and quicker turnaround | Axiom 2026 Global In-House Legal Study |
| TR | 60% | lack outside counsel guidelines | —and where they exist, 87% report enforcement is light | LegalBillReview / In-House Connect, 2025 |
| BL | 79% | are pressured to cut outside counsel spend | —but 57% can't quantify the savings they achieve | LegalBillReview / In-House Connect, 2025 |
| BR | 1 in 5 | legal departments has reached AI maturity | — even as 75% have raised AI budgets and 66% are accelerating adoption. | Axiom 2025 Legal AI Report |

**Type treatment per stat cell:**
- Big number: large fluid clamp (~`clamp(40px, 4.4vw, 60px)`), weight 500, line-height 1.0, tight tracking
- Label: 15-17px, weight 500
- Detail: text-mid color, 14px
- Source attribution: mono italic, 11px, low text color, uppercase letter-spacing 0.04em

## Acceptance (will expand when Phase 2 begins)

- [ ] Four stats render with mockup numbers, labels, sources
- [ ] Top hairline border present above section
- [ ] Two-column layout at desktop, stacked at ≤960
- [ ] Source attribution mono italic styling correct
- [ ] Content sourced from `src/content/home/gap.ts`
- [ ] No regression in adjacent slabs (Hero above, Pillars below)
