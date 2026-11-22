/**
 * Spaarke firm-MSO value model. A TypeScript port of
 * projects/website-services-page/notes/calculator-sample/model.js
 * (handoff 2026-11-22), with the logic unchanged. No React, no DOM.
 * model.test.ts holds the golden values the port must reproduce.
 */

export const ASSUMPTIONS = {
  ppp: 650_000, // representative profit per equity partner, US IP boutique
  attyComp: 210_000, // loaded cost per non-partner attorney or patent agent
  opexMin: 0.3, // operating cost kept between 30% and 55% of revenue
  opexMax: 0.55,
  pppMin: 300_000, // profit per partner kept between $300k and $1.5M
  pppMax: 1_500_000,
  revPerLawyerMin: 400_000, // revenue slider limited to $400k-$1.2M per lawyer
  revPerLawyerMax: 1_200_000,
  msoScope: 0.6, // share of operating cost that moves to the MSO
  efficiency: 0.3, // MSO running-cost reduction on that scope
  platform: 0.08, // Spaarke platform license, as share of scope cost
  feeDiscount: 0.1, // MSO fee set 10% below today's cost (benchmarked to fair market value)
  deployment: 0.1, // Spaarke-funded deployment and migration, as share of scope
  own: 0.75, // firm's share of its MSO (Spaarke 25%)
  hoursPerLawyer: 1700, // annual working hours per lawyer, for "hours freed"
  timeFreed: 0.1, // lawyer time freed by automation and AI
  redeploy: 0.5, // share of freed time used for new matters
  growthFlow: 0.8, // share of new-matter revenue that reaches profit
  newSvc: 0.02, // new client services, as share of revenue
  newSvcMargin: 0.5,
  multiple: 6, // standalone firm-MSO valuation multiple
  platformMultiple: 10, // illustrative multiple if the stake rolls into the platform at exit
};

export type Assumptions = typeof ASSUMPTIONS;

export interface EstimateInputs {
  partners: number;
  attorneys: number;
  revenue: number;
}

export type PresetKey = "small" | "mid" | "large";

export const PRESETS: Record<PresetKey, EstimateInputs> = {
  small: { partners: 3, attorneys: 4, revenue: 3_500_000 },
  mid: { partners: 5, attorneys: 7, revenue: 9_000_000 },
  large: { partners: 12, attorneys: 18, revenue: 25_000_000 },
};

export const INPUT_RANGES: Record<keyof EstimateInputs, { min: number; max: number; step: number }> = {
  partners: { min: 1, max: 30, step: 1 },
  attorneys: { min: 0, max: 60, step: 1 },
  revenue: { min: 1_000_000, max: 60_000_000, step: 250_000 },
};

/** Revenue bounds for a given headcount, rounded to the slider step. */
export function revenueBounds(partners: number, attorneys: number, A: Assumptions = ASSUMPTIONS) {
  const lawyers = partners + attorneys;
  const st = INPUT_RANGES.revenue.step;
  const lo = Math.max(INPUT_RANGES.revenue.min, Math.ceil((lawyers * A.revPerLawyerMin) / st) * st);
  const hi = Math.max(lo, Math.min(INPUT_RANGES.revenue.max, Math.floor((lawyers * A.revPerLawyerMax) / st) * st));
  return { min: lo, max: hi };
}

export function compute(input: EstimateInputs, A: Assumptions = ASSUMPTIONS) {
  const P = input.partners;
  const L = input.partners + input.attorneys;
  const b = revenueBounds(input.partners, input.attorneys, A);
  const R = Math.min(Math.max(input.revenue, b.min), b.max);
  const comp = input.attorneys * A.attyComp;

  // Today: operating cost = revenue - partner profit - attorney pay, within plausible bounds
  let opex = R - P * A.ppp - comp;
  opex = Math.min(Math.max(opex, R * A.opexMin), R * A.opexMax);
  const ppp = Math.min(Math.max((R - comp - opex) / P, A.pppMin), A.pppMax);
  opex = R - comp - ppp * P;
  const profit = R - comp - opex;

  // Objective 1: efficiency
  const scope = opex * A.msoScope;
  const fee = scope * (1 - A.feeDiscount);
  const feeSaving = scope - fee;
  const msoCost = scope * (1 - A.efficiency) + scope * A.platform;
  const ebitda = fee - msoCost;
  const share = ebitda * A.own;

  // Objective 2: competitiveness
  const hoursFreed = L * A.hoursPerLawyer * A.timeFreed;
  const growthRev = R * A.timeFreed * A.redeploy;
  const growthProfit = growthRev * A.growthFlow;
  const svcRev = R * A.newSvc;
  const svcProfit = svcRev * A.newSvcMargin;
  const deploymentFunded = scope * A.deployment;

  // With MSO
  const R2 = R + growthRev + svcRev;
  const opex2 = opex - feeSaving; // firm operating cost incl. MSO fee
  const newWorkCost = growthRev - growthProfit + (svcRev - svcProfit);
  const profit2 = R2 - comp - opex2 - newWorkCost + share;

  // Objective 3: long-term value
  const value = ebitda * A.multiple;
  const firmValue = value * A.own;
  const firmValuePlatform = share * A.platformMultiple;

  return {
    revenue: R,
    comp,
    opex,
    profit,
    ppp,
    margin: profit / R,
    scope,
    fee,
    feeSaving,
    msoCost,
    msoCostReduction: 1 - msoCost / scope,
    ebitda,
    share,
    hoursFreed,
    growthRev,
    growthProfit,
    svcRev,
    svcProfit,
    deploymentFunded,
    revenue2: R2,
    opex2,
    newWorkCost,
    profit2,
    ppp2: profit2 / P,
    margin2: profit2 / R2,
    value,
    firmValue,
    firmValuePlatform,
    spaarkeShare: ebitda - share,
  };
}

export type Estimate = ReturnType<typeof compute>;

/**
 * Clamp inputs to the slider ranges and the revenue to the headcount's
 * bounds, as the reference UI does before computing. Used for URL input.
 */
export function normalize(input: Partial<EstimateInputs>): EstimateInputs {
  const clampInt = (v: number | undefined, k: keyof EstimateInputs, fallback: number) => {
    const r = INPUT_RANGES[k];
    if (v === undefined || !Number.isFinite(v)) return fallback;
    const stepped = Math.round(v / r.step) * r.step;
    return Math.min(Math.max(stepped, r.min), r.max);
  };
  const partners = clampInt(input.partners, "partners", PRESETS.mid.partners);
  const attorneys = clampInt(input.attorneys, "attorneys", PRESETS.mid.attorneys);
  const b = revenueBounds(partners, attorneys);
  const revenue = Math.min(Math.max(clampInt(input.revenue, "revenue", PRESETS.mid.revenue), b.min), b.max);
  return { partners, attorneys, revenue };
}

/** The preset that exactly matches these inputs, if any. */
export function matchPreset(input: EstimateInputs): PresetKey | null {
  for (const k of Object.keys(PRESETS) as PresetKey[]) {
    const p = PRESETS[k];
    if (p.partners === input.partners && p.attorneys === input.attorneys && p.revenue === input.revenue) return k;
  }
  return null;
}
