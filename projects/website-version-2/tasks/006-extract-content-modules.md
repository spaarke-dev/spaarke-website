# Task 006: Extract content to typed modules

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 1.5 hours
**Dependencies:** 005
**Tags:** content, types, separation-of-concerns

## Goal

Move all visible copy out of component JSX and into typed content modules at `src/content/`. Components import data; they don't hardcode strings. This separates content from presentation so marketing/product can update copy without touching components.

## Context

Hardcoded copy is the biggest extensibility miss in the prototype — every label, stat, bullet, source citation lives inside JSX. v1.4 brief has lots of copy with strict canonical phrases ("See all sides of every matter.", "Legal Operations Intelligence", "Legal IQ", retired words). Putting this in typed modules means:
- One source of truth per copy region
- Type errors catch missing fields
- Marketing edits don't risk breaking layout
- Future I18n is straightforward

## Steps

1. Create `src/content/` folder structure:
   ```
   src/content/
   ├── nav.ts                ← top nav items + footer columns
   ├── notification-bar.ts   ← banner copy + link
   ├── home/
   │   ├── hero.ts           ← eyebrow, H1, subhead, CTAs, trust strip
   │   ├── gap.ts            ← heading, intro, 4 stats with sources
   │   ├── pillars.ts        ← Section 3 umbrella heading + 3 pillar cards
   │   ├── capabilities.ts   ← Section 4 5 capability rows + Microsoft foundation
   │   ├── loi-diagram.ts    ← Section 5 heading, intro, icon labels
   │   └── closing.ts        ← Section 6 headline, sub, CTAs
   └── footer.ts             ← columns, CTA panel, bottom strip
   ```

2. Define typed shapes (one example):
   ```ts
   // src/content/home/gap.ts
   export type GapStat = {
     value: string;          // e.g. "77%"
     label: string;          // e.g. "of in-house teams face increasing workload"
     detail: string;         // e.g. "— while business clients seek..."
     source: string;         // e.g. "Axiom 2026 Global In-House Legal Study"
   };

   export type GapContent = {
     heading: string;
     intro: string;
     stats: [GapStat, GapStat, GapStat, GapStat];  // exactly 4
     closing?: string;
   };

   export const gapContent: GapContent = {
     heading: "Demand is rising. Visibility isn't.",
     intro: "Legal departments and their outside counsel are working harder than ever — and operating with less of the data they need to do it well.",
     stats: [
       { value: "77%", label: "of in-house teams face increasing workload", detail: "— while business clients seek greater visibility and quicker turnaround", source: "Axiom 2026 Global In-House Legal Study" },
       { value: "60%", label: "lack outside counsel guidelines", detail: "—and where they exist, 87% report enforcement is light", source: "LegalBillReview / In-House Connect, 2025" },
       { value: "79%", label: "are pressured to cut outside counsel spend", detail: "—but 57% can't quantify the savings they achieve", source: "LegalBillReview / In-House Connect, 2025" },
       { value: "1 in 5", label: "legal departments has reached AI maturity", detail: "— even as 75% have raised AI budgets and 66% are accelerating adoption.", source: "Axiom 2025 Legal AI Report" },
     ],
   };
   ```

3. Source the actual copy from:
   - **Hero, Gap, Pillars, Capabilities, LOI, Closing**: [creative brief v1.4](../spaarke-home-page-creative-brief-v1.4.md) §"The home page" + the [mockup screenshots](../v2%20mockup%20screenshots/) (mockup wins on stats and bullet phrasing per decisions log)
   - **Nav**: brief §"Navigation" — but right side is "Contact us + Sign in" per latest decision (Get access lives elsewhere)
   - **Footer**: brief §"Footer" — Platform / Company / Legal columns + Get access CTA panel
   - **Notification bar**: existing site has the banner copy; reuse or refine

4. Each module exports a typed const. Components import the const.

5. Run `npx tsc --noEmit` — confirm types compile.

6. Commit: `feat(v2): extract home page content to typed modules`.

7. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- `src/content/` populated with typed modules covering all visible copy on home page + global chrome
- Each module has a TypeScript type definition + a typed const

## Acceptance Criteria

- [ ] All home page copy lives in `src/content/`, not inline in components
- [ ] Each content module has a typed export
- [ ] TypeScript strict checks pass
- [ ] Stats are typed as a 4-tuple (so missing/extra is a compile error)
- [ ] Capability list is typed as a 5-tuple
- [ ] Pillar cards typed as a 3-tuple
- [ ] Microsoft foundation logos typed as a string-array of asset paths

## Notes

- Resist creating a content management abstraction. Plain typed constants are sufficient for a marketing site of this size.
- If a future page needs MDX-style rich content (more than headings + paragraphs), extend with `next-mdx-remote` rather than reinventing.
- Keep content files small — one section per file, not one giant `home.ts`.
- Brief mentions Insights cards on the home page (was Section 7 in v1.1) but v1.4 dropped that section — confirm before adding any Insights-on-home content.
