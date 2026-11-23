/**
 * Legal department MSO value model: the corporate equivalent of model.ts
 * (task 071, 2026-11-22). The department owns nothing in the MSO and
 * receives no share of its profit: the design rules out any equity for
 * corporates (design.md section 9). Its value is a lower total cost of legal.
 *
 * Reworked the same day to match the law firm estimate (owner, 2026-11-22):
 *
 * - The base case is the lower MSO fee alone. Routine outside counsel work
 *   brought back in-house with freed lawyer time, and routine matters sent to
 *   the MSO, are an optional "capacity upside", off by default.
 * - Visitors can change the fee discount, the MSO efficiency gain (which caps
 *   the discount), the share of freed time used and the fee glide path. They
 *   share the law firm's ranges and defaults (ADJUSTABLE in model.ts).
 * - A five-year view of the fee: it falls by the glide path each year and is
 *   re-benchmarked to fair market value every three years.
 *
 * The figures are representative placeholders until finance sets them
 * (task 051). No React, no DOM.
 */

import { ADJUSTABLE, ADJUSTABLE_DEFAULTS, maxFeeDiscount, type AdjustableKey } from "./model";

export const DEPT_ASSUMPTIONS = {
  lawyerCost: 320_000, // loaded annual cost per in-house lawyer
  staffCost: 130_000, // loaded annual cost per legal operations or support staff member
  opsShare: 0.12, // technology, tools, e-billing and other operating spend, as share of budget
  outsideMin: 0.15, // outside counsel kept between 15% and 70% of the budget
  outsideMax: 0.7,
  budgetPerLawyerMin: 600_000, // budget slider limited to $600k-$3M per in-house lawyer
  budgetPerLawyerMax: 3_000_000,
  msoScope: 0.6, // share of operating spend and support staff cost that moves to the MSO
  platform: 0.08, // platform cost inside the MSO, as share of scope cost (same as the law firm model)
  deployment: 0.1, // Spaarke-funded deployment and migration, as share of scope
  hoursPerLawyer: 1700, // annual working hours per lawyer, for "hours freed"
  timeFreed: 0.1, // lawyer time freed by automation and AI
  outsideRate: 450, // blended hourly rate of the routine outside counsel work brought in-house
  insourceCap: 0.2, // at most 20% of outside counsel spend is brought in-house
  routineShare: 0.08, // share of outside counsel spend that is routine work the MSO can handle
  routineCost: 0.5, // the MSO handles that work at half its outside counsel cost
  years: 5, // the fee view
  fmvReset: 3, // the fee is re-benchmarked to fair market value every three years
};

export type DeptAssumptions = typeof DEPT_ASSUMPTIONS;

export interface DeptSize {
  lawyers: number;
  staff: number;
  budget: number;
}

export interface DeptInputs extends DeptSize, Record<AdjustableKey, number> {
  /** Capacity upside on: work brought in-house and routine matters sent to the MSO count. */
  upside: boolean;
}

export type DeptPresetKey = "small" | "mid" | "large";

export const DEPT_PRESETS: Record<DeptPresetKey, DeptSize> = {
  small: { lawyers: 5, staff: 3, budget: 6_000_000 },
  mid: { lawyers: 15, staff: 10, budget: 25_000_000 },
  large: { lawyers: 50, staff: 35, budget: 90_000_000 },
};

export const DEPT_DEFAULT_INPUTS: DeptInputs = { ...DEPT_PRESETS.mid, ...ADJUSTABLE_DEFAULTS, upside: false };

export const DEPT_RANGES: Record<keyof DeptSize, { min: number; max: number; step: number }> = {
  lawyers: { min: 1, max: 150, step: 1 },
  staff: { min: 0, max: 120, step: 1 },
  budget: { min: 1_000_000, max: 300_000_000, step: 250_000 },
};

/** Budget bounds for a given team, rounded to the slider step. */
export function budgetBounds(lawyers: number, staff: number, A: DeptAssumptions = DEPT_ASSUMPTIONS) {
  const st = DEPT_RANGES.budget.step;
  const people = lawyers * A.lawyerCost + staff * A.staffCost;
  // Enough budget for the team, the operating spend and the minimum outside counsel share.
  const floor = Math.max(lawyers * A.budgetPerLawyerMin, people / (1 - A.opsShare - A.outsideMin));
  const lo = Math.max(DEPT_RANGES.budget.min, Math.ceil(floor / st) * st);
  const hi = Math.max(lo, Math.min(DEPT_RANGES.budget.max, Math.floor((lawyers * A.budgetPerLawyerMax) / st) * st));
  return { min: lo, max: hi };
}

export function computeDept(input: DeptInputs, A: DeptAssumptions = DEPT_ASSUMPTIONS) {
  const b = budgetBounds(input.lawyers, input.staff, A);
  const B = Math.min(Math.max(input.budget, b.min), b.max);
  const lawyerPay = input.lawyers * A.lawyerCost;
  const staffPay = input.staff * A.staffCost;
  const people = lawyerPay + staffPay;
  const feeDiscount = Math.min(input.feeDiscount, maxFeeDiscount(input.efficiency));

  // Today: outside counsel is what the budget leaves after the team and operating spend, within bounds
  const outside = Math.min(Math.max(B - people - B * A.opsShare, B * A.outsideMin), B * A.outsideMax);
  const ops = B - people - outside;

  // Base case: operating spend and support work move to the MSO for a fixed or per-unit fee below today's cost
  const scope = (ops + staffPay) * A.msoScope;
  const fee = scope * (1 - feeDiscount);
  const feeSaving = scope - fee;
  const deploymentFunded = scope * A.deployment;

  // Capacity: hours freed, and the optional upside from using them. Freed
  // lawyer time brings routine outside work in-house; the MSO handles another
  // slice of routine work at lower cost.
  const hoursPerLawyerFreed = A.hoursPerLawyer * A.timeFreed;
  const hoursFreed = input.lawyers * hoursPerLawyerFreed;
  const insourced = Math.min(hoursFreed * input.redeploy * A.outsideRate, outside * A.insourceCap);
  const routineMoved = outside * A.routineShare;
  const routineFee = routineMoved * A.routineCost;
  const routineSaving = routineMoved - routineFee;
  const upsideSaving = insourced + routineSaving;

  // With the MSO, base case unless the upside is on
  const on = input.upside;
  const outside2 = outside - (on ? insourced + routineMoved : 0);
  const kept = ops + staffPay - scope; // operating spend and staff cost that stay in the department
  const msoFees = fee + (on ? routineFee : 0);
  const total2 = lawyerPay + kept + outside2 + msoFees;
  const saving = B - total2;

  // Five years of the fee, in today's dollars: it falls by the glide path each
  // year and is re-benchmarked to fair market value every three years, which
  // the estimate takes to confirm the glide path.
  const feeByYear = Array.from({ length: A.years }, (_, i) => fee * (1 - input.glide) ** i);
  const savingByYear = feeByYear.map((f) => scope - f);
  const fiveYearSaving = savingByYear.reduce((s, v) => s + v, 0);

  return {
    budget: B,
    lawyerPay,
    staffPay,
    people,
    ops,
    outside,
    outsideShare: outside / B,
    feeDiscount,
    scope,
    fee,
    feeSaving,
    deploymentFunded,
    hoursPerLawyerFreed,
    hoursFreed,
    insourced,
    routineMoved,
    routineFee,
    routineSaving,
    upsideSaving,
    outside2,
    outsideShare2: outside2 / total2,
    kept,
    msoFees,
    total2,
    saving,
    savingPct: saving / B,
    feeByYear,
    savingByYear,
    fiveYearSaving,
  };
}

export type DeptEstimate = ReturnType<typeof computeDept>;

/**
 * Clamp inputs to the slider ranges, the budget to the team's bounds and the
 * fee discount to what the efficiency pays for. Used for URL input and for
 * every change from the controls.
 */
export function normalizeDept(input: Partial<DeptInputs>): DeptInputs {
  const clamp = (v: number | undefined, r: { min: number; max: number; step: number }, fallback: number) => {
    if (v === undefined || !Number.isFinite(v)) return fallback;
    return Math.min(Math.max(Math.round(v / r.step) * r.step, r.min), r.max);
  };
  const lawyers = clamp(input.lawyers, DEPT_RANGES.lawyers, DEPT_PRESETS.mid.lawyers);
  const staff = clamp(input.staff, DEPT_RANGES.staff, DEPT_PRESETS.mid.staff);
  const b = budgetBounds(lawyers, staff);
  const budget = Math.min(Math.max(clamp(input.budget, DEPT_RANGES.budget, DEPT_PRESETS.mid.budget), b.min), b.max);
  // Rounded to clear floating-point noise from the steps.
  const adj = (k: AdjustableKey) => Math.round(clamp(input[k], ADJUSTABLE[k], ADJUSTABLE[k].def) * 1000) / 1000;
  const efficiency = adj("efficiency");
  const feeDiscount = Math.min(adj("feeDiscount"), maxFeeDiscount(efficiency));
  return {
    lawyers,
    staff,
    budget,
    feeDiscount: Math.round(feeDiscount * 1000) / 1000,
    efficiency,
    redeploy: adj("redeploy"),
    glide: adj("glide"),
    upside: input.upside === true,
  };
}

/** The preset that exactly matches these inputs' department size, if any. */
export function matchDeptPreset(input: DeptSize): DeptPresetKey | null {
  for (const k of Object.keys(DEPT_PRESETS) as DeptPresetKey[]) {
    const p = DEPT_PRESETS[k];
    if (p.lawyers === input.lawyers && p.staff === input.staff && p.budget === input.budget) return k;
  }
  return null;
}
