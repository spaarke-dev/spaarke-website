# Task 023: Section 5 — Legal Operations Intelligence diagram

**Phase:** 2 — Home Sections
**Status:** not-started (stub — to be expanded when Phase 2 begins)
**Estimated:** 5 hours
**Dependencies:** 013, 004, 006
**Tags:** component, home, diagram, strategic-asset

## Context

Build per [mockup `home_04.jpg`](../v2%20mockup%20screenshots/home_04.jpg). v1.4 brief flags this as **the most strategic visual on the home page** — it gets reused in decks, RFPs, analyst conversations, IT security reviews. Invest in polish.

**Layout:**
- Pure dark slab (`<Slab tone="dark">`)
- Centered heading + intro paragraph
- Diagram below: Spaarke container (left) → arrow → M365 Copilot badge (right)

**Copy** (from `src/content/home/loi-diagram.ts`):
- **Heading** (two lines, centered): "Introducing" / "Legal Operations Intelligence" (the second line stays one line via `white-space: nowrap` on desktop; `<br/>` between)
- **Intro paragraph** (centered, max ~60ch, text-mid color): "Spaarke is the legal IQ layer that makes Copilot, your AI agents, and your existing systems fluent in legal work. Decisions, workflows, performance, partnership — not just drafting."

**Diagram structure** (per mockup):
- **Left**: Spaarke platform container — rounded dark surface with hairline border, subtle blue accent treatment. Inside: 2×4 grid of capability icons. Above the grid: a "spaarke" wordmark with workspace chrome (search bar, Copilot pill, profile dot)
- **Middle**: Animated arrow flowing left-to-right with a blue accent gradient (Spaarke Blue → Copilot multi-color). Subtle motion or static if reduced-motion.
- **Right**: M365 Copilot badge (`public/brand/logos/microsoft-365-copilot-badge.svg`) sized prominently, with "M365" tag in a black pill below, and a soft radial multi-color glow behind

**8 icons in the 2×4 grid** — best-mapped from `resources/icons/` (judgment call per latest decision; will be placed at `public/brand/icons/` in Task 004):

| Position | Icon (best match from available SVGs) |
|---|---|
| Row 1, Col 1 | `email.svg` (envelope) |
| Row 1, Col 2 | `playbook.svg` (or `analysis.svg`) |
| Row 1, Col 3 | `event.svg` (calendar) |
| Row 1, Col 4 | `matter.svg` (briefcase/bag) |
| Row 2, Col 1 | `kpiassessment.svg` (gauge) |
| Row 2, Col 2 | `task.svg` (checkmark) |
| Row 2, Col 3 | `teams.svg` (or `contact.svg` — people) |
| Row 2, Col 4 | `document.svg` |

(Final mapping confirmed during implementation; mockup is the visual reference.)

**Mobile (≤960):**
- Stack vertically: Spaarke container above arrow above Copilot badge
- Icon grid may collapse to 4×2 if needed

**A11y:**
- Diagram has `role="img"` with `aria-label` describing the relationship
- Each icon has accessible name; decorative ones use `aria-hidden="true"`
- Reduced motion: arrow becomes static

## Acceptance (will expand when Phase 2 begins)

- [ ] Heading, intro paragraph render centered
- [ ] Spaarke container renders with chrome bar (wordmark, search, Copilot pill, profile)
- [ ] 8 icons in 2×4 grid render correctly
- [ ] Arrow renders with accent gradient; respects reduced-motion
- [ ] Copilot badge sized correctly with M365 tag and radial glow
- [ ] Mobile stacks vertically
- [ ] A11y: diagram has accessible label; reduced-motion honored
- [ ] Content sourced from `src/content/home/loi-diagram.ts`
- [ ] Asset paths verified (icons at `public/brand/icons/`, copilot badge at `public/brand/logos/`)
