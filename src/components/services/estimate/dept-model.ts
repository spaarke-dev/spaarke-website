/**
 * Legal department MSO value model: the corporate equivalent of model.ts
 * (task 071, 2026-11-22). Same shape and the same MSO levers as the law firm
 * model (60% of the operating scope moves, 30% efficiency, an 8% platform
 * license, a fixed fee 10% below today's cost, Spaarke-funded deployment, 10%
 * of lawyer time freed). The department owns nothing in the MSO and receives
 * no share of its profit: the design rules out any equity for corporates
 * (design.md section 9). Its value is a lower total cost of legal.
 *
 * The figures are representative placeholders until finance sets them
 * (task 051). No React, no DOM.
 */

export const DEPT_ASSUMPTIONS = {
  lawyerCost: 320_000, // loaded annual cost per in-house lawyer
  staffCost: 130_000, // loaded annual cost per legal operations or support staff member
  opsShare: 0.12, // technology, tools, e-billing and other operating spend, as share of budget
  outsideMin: 0.15, // outside counsel kept between 15% and 70% of the budget
  outsideMax: 0.7,
  budgetPerLawyerMin: 600_000, // budget slider limited to $600k-$3M per in-house lawyer
  budgetPerLawyerMax: 3_000_000,
  msoScope: 0.6, // share of operating spend and support staff cost that moves to the MSO
  efficiency: 0.3, // MSO running-cost reduction on that scope
  platform: 0.08, // Spaarke platform license, as share of scope cost
  feeDiscount: 0.1, // MSO fee set 10% below today's cost
  deployment: 0.1, // Spaarke-funded deployment and migration, as share of scope
  hoursPerLawyer: 1700, // annual working hours per lawyer, for "hours freed"
  timeFreed: 0.1, // lawyer time freed by automation and AI
  redeploy: 0.5, // share of freed time used on work now sent to outside counsel
  outsideRate: 450, // blended hourly rate of the routine outside counsel work brought in-house
  insourceCap: 0.2, // at most 20% of outside counsel spend is brought in-house
  routineShare: 0.08, // share of outside counsel spend that is routine work the MSO can handle
  routineCost: 0.5, // the MSO handles that work at half its outside counsel cost
  years: 3, // horizon for the cumulative saving
};

export type DeptAssumptions = typeof DEPT_ASSUMPTIONS;

export interface DeptInputs {
  lawyers: number;
  staff: number;
  budget: number;
}

export type DeptPresetKey = "small" | "mid" | "large";

export const DEPT_PRESETS: Record<DeptPresetKey, DeptInputs> = {
  small: { lawyers: 5, staff: 3, budget: 6_000_000 },
  mid: { lawyers: 15, staff: 10, budget: 25_000_000 },
  large: { lawyers: 50, staff: 35, budget: 90_000_000 },
};

export const DEPT_RANGES: Record<keyof DeptInputs, { min: number; max: number; step: number }> = {
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

  // Today: outside counsel is what the budget leaves after the team and operating spend, within bounds
  const outside = Math.min(Math.max(B - people - B * A.opsShare, B * A.outsideMin), B * A.outsideMax);
  const ops = B - people - outside;

  // Objective 1: lower cost. Operating spend and support work move to the MSO for a fixed fee.
  const scope = (ops + staffPay) * A.msoScope;
  const fee = scope * (1 - A.feeDiscount);
  const feeSaving = scope - fee;
  const msoCost = scope * (1 - A.efficiency) + scope * A.platform;
  const deploymentFunded = scope * A.deployment;

  // Objective 2: capacity. Freed lawyer time brings routine outside work in-house;
  // the MSO handles another slice of routine work at lower cost.
  const hoursFreed = input.lawyers * A.hoursPerLawyer * A.timeFreed;
  const insourced = Math.min(hoursFreed * A.redeploy * A.outsideRate, outside * A.insourceCap);
  const routineMoved = outside * A.routineShare;
  const routineFee = routineMoved * A.routineCost;
  const routineSaving = routineMoved - routineFee;

  // With the MSO
  const outside2 = outside - insourced - routineMoved;
  const kept = ops + staffPay - scope; // operating spend and staff cost that stay in the department
  const msoFees = fee + routineFee;
  const total2 = lawyerPay + kept + outside2 + msoFees;
  const saving = B - total2;

  return {
    budget: B,
    lawyerPay,
    staffPay,
    people,
    ops,
    outside,
    outsideShare: outside / B,
    scope,
    fee,
    feeSaving,
    msoCost,
    msoCostReduction: 1 - msoCost / scope,
    deploymentFunded,
    hoursFreed,
    insourced,
    routineMoved,
    routineFee,
    routineSaving,
    outside2,
    outsideShare2: outside2 / total2,
    kept,
    msoFees,
    total2,
    saving,
    savingPct: saving / B,
    savingYears: saving * A.years,
  };
}

export type DeptEstimate = ReturnType<typeof computeDept>;

/** Clamp inputs to the slider ranges and the budget to the team's bounds. */
export function normalizeDept(input: Partial<DeptInputs>): DeptInputs {
  const clampStep = (v: number | undefined, k: keyof DeptInputs, fallback: number) => {
    const r = DEPT_RANGES[k];
    if (v === undefined || !Number.isFinite(v)) return fallback;
    return Math.min(Math.max(Math.round(v / r.step) * r.step, r.min), r.max);
  };
  const lawyers = clampStep(input.lawyers, "lawyers", DEPT_PRESETS.mid.lawyers);
  const staff = clampStep(input.staff, "staff", DEPT_PRESETS.mid.staff);
  const b = budgetBounds(lawyers, staff);
  const budget = Math.min(Math.max(clampStep(input.budget, "budget", DEPT_PRESETS.mid.budget), b.min), b.max);
  return { lawyers, staff, budget };
}

export function matchDeptPreset(input: DeptInputs): DeptPresetKey | null {
  for (const k of Object.keys(DEPT_PRESETS) as DeptPresetKey[]) {
    const p = DEPT_PRESETS[k];
    if (p.lawyers === input.lawyers && p.staff === input.staff && p.budget === input.budget) return k;
  }
  return null;
}
