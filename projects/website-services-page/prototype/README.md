# Spaarke Managed Legal Operations (MLO) page: handoff for Claude Code

Prototype package for the MLO marketing page. Companion spec: `../design.md`.
Stack: React 18, TypeScript, Vite, d3-sankey (layout only; rendering is plain SVG), Vitest.

## What is here

| Path | What it is |
|---|---|
| `src/content/mlo.content.ts` | Typed copy for sections 1 to 3 (hero, what is MLO, why now). Audience-dependent fields are `ByAudience<T>`. |
| `src/audience/AudienceContext.tsx` | Site-wide Law Firm / Corporate state. URL param `?audience=firm|corporate` wins, then localStorage, then `firm`. Storage access is wrapped in try/catch. |
| `src/components/AudienceToggle.tsx` | The sticky-header switch (radiogroup, keyboard accessible). |
| `src/components/MloCalculator/model.ts` | Pure calculation model (firm and corporate). No React. |
| `src/components/MloCalculator/model.test.ts` | 18 tests, including the compliance guardrails. |
| `src/components/MloCalculator/defaults.ts` | **Placeholder** defaults and labels. |
| `src/components/MloCalculator/sankeyData.ts` | Model result to Sankey nodes and links. |
| `src/components/MloCalculator/Sankey.tsx` | SVG Sankey with a screen-reader table alternative. |
| `src/components/MloCalculator/MloCalculator.tsx` and `.css` | Sliders, function chips, KPI cards. Flips with the audience toggle. |
| `src/App.tsx`, `src/app.css` | Prototype shell only. Do not port; lift the sections into the site's own layout. |

Commands: `npm install`, `npm run dev`, `npm test`, `npm run build` (typecheck plus build).

## How to integrate into the site repo

1. Copy `src/content`, `src/audience`, `src/components` into the site. Add the `d3-sankey` and `@types/d3-sankey` dependencies.
2. Wrap the page in `<AudienceProvider>` and put `<AudienceToggle />` in the sticky header.
3. Replace the `--mlo-*` CSS custom properties at the top of `MloCalculator.css` with Spaarke brand tokens.
4. Render sections from `mlo.content.ts` using the site's components. Use `orderedStats(audience)` for the section 3 tiles.
5. Mount `<MloCalculator />` in section 6 (`id="financial-opportunity"`).

## Rules the code must keep (do not "simplify" these away)

- **Fee is cost-based, never revenue-based.** `computeFirm` derives the MLO fee from the cost of the functions moved times (1 - priceAdvantage). There is deliberately no input for a fee percentage of revenue, legal fees or profit. Tests `GUARDRAIL: ...` enforce it. Do not add such an input.
- **No equity anywhere.** No equity values, percentages, vesting terms or return claims in copy, charts or the calculator. Corporate arrangements have no equity element.
- **Illustrative labeling.** Every calculator number sits beside `ILLUSTRATIVE_NOTE`. Keep it visible.
- **Boundary line** (`whatIsMlo.boundaryLine`) must appear wherever the structure is explained.
- **Practice-agnostic wording.** No IP-specific headlines or core copy.
- Counsel reviews final copy and the function labels before publication.

## Model summary

Firm: revenue under an optional fee-pressure scenario (costs stay fixed in dollars). Moving a function sends its baseline cost (plus technology capex, if technology moves) to the MLO at a unit price below internal cost. Outputs: revenue, opex, capex, distributable profit after capex, margin, deltas, and year-one profit after a one-time transition cost.
Corporate: baseline spend splits into outside counsel, internal team, legal operations, technology and other, plus capex. The MLO takes moved functions at a unit price below internal cost, and handles an adjustable share of routine outside-counsel work at a fraction of its cost. Outputs: total cost of legal, outside counsel spend, capex, savings, cost per matter. The diagram's "Savings" node makes flows add up to baseline.

## Known gaps and open items

1. **Defaults are placeholders** (cost structure, 15% price advantage, 10% shifted work, 40% MLO cost ratio, 2% transition cost). Finance sets the real ones.
2. **Function labels** in `defaults.ts` are placeholders. Counsel confirms placement of hybrid functions (billing roles, IT touching client data).
3. **Statistics.** Items marked `verification: 'secondary-verify'` came from secondary citations and need the primary report found before launch. Items marked `retrieved-snippet` were seen only as search snippets; confirm in the full report. The Axiom figure is vendor-sourced.
4. **Not built:** section 4 allocation diagram, section 5 network diagram, section 7 timeline, section 3 chart components (the prototype shows big numbers only), hero image, FAQ, footer disclaimers. All are specified in `design.md`.
5. **Sankey polish:** labels in the middle column can overlap link ribbons in some configurations. Check at narrow widths; the design calls for a vertical two-lane layout on mobile, which is not built.
6. **Drag-to-move** between lanes is a planned enhancement; v1 uses chips (accessible).
7. **Sankey animation:** link and node transitions are opacity only. Smooth path morphing is not implemented.
8. Fee-pressure slider is capped at 20% so the default firm stays profitable; the model flags `underwater` if inputs push costs above revenue.
