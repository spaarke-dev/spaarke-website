# Task 071: Legal department MSO value estimate

**Phase:** 3 - Calculator
**Status:** complete (draft)
**Dependencies:** 070
**Tags:** react, tailwind, model, accessibility

## Goal

Build the legal department equivalent of the law firm MSO value estimate (task 070), at the owner's request on 2026-11-22. It replaces the round 5 cost calculator in the legal department view of the financial section, and `/services/estimate?audience=corporate` carries its details page and modal.

## Model (`src/components/services/estimate/dept-model.ts`)

Inputs: in-house lawyers, legal operations and support staff, and the annual legal budget including outside counsel. Presets: small (5 / 3 / $6M), mid-size (15 / 10 / $25M, the default) and large (50 / 35 / $90M).

Today: the team costs $320k per lawyer and $130k per staff member. Operations and technology take 12% of the budget, and outside counsel is what is left, kept between 15% and 70% of the budget. The budget slider is kept between $600k and $3M per lawyer, and high enough to cover the team.

With the MSO, the levers are the same as the law firm model:

1. 60% of operations spend and support staff cost moves to the MSO for a fixed fee 10% below today's cost. The MSO runs it at 30% lower cost plus an 8% platform license.
2. 10% of lawyer time is freed; half of it brings routine outside counsel work in-house at a blended $450 an hour, capped at 20% of outside spend.
3. 8% of outside counsel spend is routine work the MSO handles at 50% of its cost, with the department's lawyers reviewing it.

Mid-size result: total cost of legal $25.0M to $23.5M, a saving of $1.47M a year (6%), $4.40M over three years. This is in line with the round 5 cost calculator's $1.50M.

**No equity.** The department owns no part of the MSO and gets no share of its profit (design.md section 9). The third card is "Lasting value": the three-year saving, the deployment Spaarke funds, the fixed fee and $0 capital. A guardrail test checks that the model has no equity, stake, ownership, value or profit outputs.

## Steps

1. Write the model and its tests (reference values, the three savings sum to the total, the guardrails)
2. Move the shared UI into `parts.tsx` and let the waterfall show savings (steps down) and any number of bars
3. Build `DeptCalculator` and `DeptDetails` with the copy in `content.ts` (`deptEstimate`)
4. Make the details page, the modal and the shared inputs audience-aware
5. Check at 1440 px and 375 px, and confirm the law firm view is unchanged

## Open

- Finance to replace the assumptions (task 051). The reference values in `dept-model.test.ts` change with them.
- Counsel to review "routine work handled by the MSO", with lawyers reviewing it, against the boundary language.
- The round 5 corporate calculator (`calculator/`) is no longer on the page. Its code and tests stay until the owner signs off the estimate (task 060).
