# Task 070: MSO value estimate (new firm calculator)

**Phase:** 3 - Calculator
**Status:** complete (draft)
**Dependencies:** 031
**Tags:** react, tailwind, nextjs-routing, accessibility

## Goal

Replace the law firm calculator on `/services` with the MSO value estimate in `notes/calculator-sample/` (handoff 2026-11-22). The details live on their own page, `/services/estimate`, which also carries the calculator so it works on its own. "See the details" opens that page as a modal over `/services`, scrolled to "How the estimate works".

## Decisions

| Topic | Decision |
|---|---|
| Audience | The estimate is the law firm view only. The model is about partners and firm equity, and the design keeps equity out of the corporate view. The corporate view keeps the cost calculator from round 5. |
| Equity figures | The handoff shows an equity stake, the firm's 75% share, and a 10x roll-up value. The design's guardrail (design.md section 9, "no equity numbers") forbids this. The owner supplied the calculator, so it is built as specified and flagged for counsel in task 051. It must not launch without counsel sign-off. |
| Details route | `/services/estimate`, `noindex`. The inputs travel in the query string (`?partners=5&attorneys=7&revenue=9000000`), so the page works from a shared link. |
| Modal | Next.js intercepting route: `src/app/services/@modal/(.)estimate/`. A soft navigation from `/services` shows the page in a modal; a reload or a direct link shows the full page. Esc, the close button and the backdrop go back to `/services`. |
| Shared state | `src/app/services/layout.tsx` holds the inputs in one provider, so the section and the modal show the same firm and stay in sync both ways. |
| Chart | A hand-built HTML waterfall (no Chart.js), with value labels above the bars and the y-axis starting near 70% of today's profit per partner. Short labels below 640 px. |
| Copy | As in the handoff, with US spelling ("license", not "licence"). Money uses the handoff format (`$257k`, `$1.39M`). |

## Steps

1. Port `model.js` to `src/components/services/estimate/model.ts`, logic unchanged
2. Port the golden-value and guardrail tests; add a test that the MSO fee is cost-based
3. Build the calculator: presets, three sliders, three objective cards, summary bar and disclaimer
4. Build the details: waterfall, comparison table, how it works, structure, assumptions
5. Build `/services/estimate` and the intercepting modal route
6. Swap the firm view of the financial section to the new calculator
7. Check the handoff's acceptance criteria at 1440 px and 375 px

## Expected outputs

- `src/components/services/estimate/` (model, tests, format, state, calculator, details, waterfall, modal)
- `src/app/services/layout.tsx`, `src/app/services/estimate/page.tsx`, `src/app/services/@modal/`

## Acceptance criteria (from the handoff)

1. The ported model passes the golden values and the guardrail test (2 partners, 18 attorneys, $60M input: revenue clamped to $24M, profit per partner $1.5M).
2. The mid preset loads by default and matches handoff section 5 exactly.
3. The details reflect the current inputs.
4. No horizontal scroll at 375 px, and nothing is clipped in the cards, table or chart labels.
5. The disclaimer is visible in the main section.

## Not in scope

- `advanced.html` and `advanced.js` (internal model, never public).
- Corporate estimate. The corporate view keeps the round 5 cost calculator.
