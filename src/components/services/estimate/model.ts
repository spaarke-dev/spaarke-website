/**
 * Spaarke firm-MSO value model. Started as a TypeScript port of
 * projects/website-services-page/notes/calculator-sample/model.js (handoff
 * 2026-11-22), then reworked to the owner's value page change list the same
 * day (spaarke-value-page-change-list.md):
 *
 * - The firm's MSO is a wholly owned Spaarke subsidiary. The firm stays 100%
 *   lawyer-owned and gets no MSO profit share, and no equity is valued here
 *   (rows 1 to 8).
 * - The base case is the cost saving alone. New matters and new client
 *   services are an optional "capacity upside", off by default (row 11).
 * - Visitors can change the fee discount, the MSO efficiency gain, the share
 *   of freed time used and the fee glide path (rows 13 and 15).
 * - A five-year view of the fee: it falls by the glide path each year and is
 *   re-benchmarked to fair market value every three years (row 13).
 *
 * No React, no DOM. model.test.ts holds the expected values.
 */

export const ASSUMPTIONS = {
  ppp: 650_000, // representative profit per equity partner
  attyComp: 210_000, // loaded cost per other lawyer or legal professional
  opexMin: 0.3, // operating cost kept between 30% and 55% of revenue
  opexMax: 0.55,
  pppMin: 300_000, // profit per partner kept between $300k and $1.5M
  pppMax: 1_500_000,
  revPerLawyerMin: 400_000, // revenue slider limited to $400k-$1.2M per lawyer
  revPerLawyerMax: 1_200_000,
  msoScope: 0.6, // share of operating cost that moves to the MSO
  platform: 0.08, // platform cost inside the MSO, as a share of the scope's cost
  deployment: 0.1, // Spaarke-funded deployment and migration, as a share of scope
  hoursPerLawyer: 1700, // annual working hours per lawyer, for "hours freed"
  timeFreed: 0.1, // lawyer time freed by automation and AI
  growthFlow: 0.8, // share of new-matter revenue that reaches profit
  newSvc: 0.02, // new client services, as a share of revenue
  newSvcMargin: 0.5,
  years: 5, // the fee view
  fmvReset: 3, // the fee is re-benchmarked to fair market value every three years
};

export type Assumptions = typeof ASSUMPTIONS;

/** The assumptions a visitor can change (row 15), with their defaults and ranges. */
export const ADJUSTABLE = {
  /** MSO fee, below today's cost of the work that moves. */
  feeDiscount: { def: 0.1, min: 0.05, max: 0.2, step: 0.01 },
  /** MSO running-cost reduction on that work. */
  efficiency: { def: 0.3, min: 0.15, max: 0.45, step: 0.01 },
  /** Share of freed lawyer time used for new matters (capacity upside only). */
  redeploy: { def: 0.5, min: 0, max: 1, step: 0.05 },
  /** Yearly fee reduction from productivity, 3% to 5% (row 13). */
  glide: { def: 0.03, min: 0.03, max: 0.05, step: 0.005 },
} as const;

export type AdjustableKey = keyof typeof ADJUSTABLE;

export interface FirmSize {
  partners: number;
  attorneys: number;
  revenue: number;
}

export interface EstimateInputs extends FirmSize, Record<AdjustableKey, number> {
  /** Capacity upside on: new matters and new client services count (row 11). */
  upside: boolean;
}

export type PresetKey = "small" | "mid" | "large";

export const PRESETS: Record<PresetKey, FirmSize> = {
  small: { partners: 3, attorneys: 4, revenue: 3_500_000 },
  mid: { partners: 5, attorneys: 7, revenue: 9_000_000 },
  large: { partners: 12, attorneys: 18, revenue: 25_000_000 },
};

export const ADJUSTABLE_DEFAULTS = Object.fromEntries(
  Object.entries(ADJUSTABLE).map(([k, v]) => [k, v.def]),
) as Record<AdjustableKey, number>;

export const DEFAULT_INPUTS: EstimateInputs = { ...PRESETS.mid, ...ADJUSTABLE_DEFAULTS, upside: false };

export const INPUT_RANGES: Record<keyof FirmSize, { min: number; max: number; step: number }> = {
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

/**
 * The deepest fee discount the MSO's efficiency pays for: below that the MSO
 * would run at a loss. Rounded down to the slider step.
 */
export function maxFeeDiscount(efficiency: number, A: Assumptions = ASSUMPTIONS) {
  const r = ADJUSTABLE.feeDiscount;
  const cap = Math.floor((efficiency - A.platform) / r.step + 1e-9) * r.step;
  return Math.min(r.max, Math.max(r.min, cap));
}

export function compute(input: EstimateInputs, A: Assumptions = ASSUMPTIONS) {
  const P = input.partners;
  const L = input.partners + input.attorneys;
  const b = revenueBounds(input.partners, input.attorneys, A);
  const R = Math.min(Math.max(input.revenue, b.min), b.max);
  const comp = input.attorneys * A.attyComp;
  const feeDiscount = Math.min(input.feeDiscount, maxFeeDiscount(input.efficiency, A));

  // Today: operating cost = revenue - partner profit - other lawyers' pay, within plausible bounds
  let opex = R - P * A.ppp - comp;
  opex = Math.min(Math.max(opex, R * A.opexMin), R * A.opexMax);
  const ppp = Math.min(Math.max((R - comp - opex) / P, A.pppMin), A.pppMax);
  opex = R - comp - ppp * P;
  const profit = R - comp - opex;

  // Base case: the work that moves costs the firm less (no MSO profit share)
  const scope = opex * A.msoScope;
  const fee = scope * (1 - feeDiscount);
  const feeSaving = scope - fee;
  const deploymentFunded = scope * A.deployment;

  // Capacity: hours freed, and the optional upside from using them
  const hoursPerLawyerFreed = A.hoursPerLawyer * A.timeFreed;
  const hoursFreed = L * hoursPerLawyerFreed;
  const growthRev = R * A.timeFreed * input.redeploy;
  const growthProfit = growthRev * A.growthFlow;
  const svcRev = R * A.newSvc;
  const svcProfit = svcRev * A.newSvcMargin;
  const upsideRev = growthRev + svcRev;
  const upsideProfit = growthProfit + svcProfit;

  // With the MSO, base case unless the upside is on
  const on = input.upside;
  const revenue2 = R + (on ? upsideRev : 0);
  const opex2 = opex - feeSaving; // firm operating cost, including the MSO fee
  const newWorkCost = on ? upsideRev - upsideProfit : 0;
  const profit2 = profit + feeSaving + (on ? upsideProfit : 0);

  // Five years of the fee, in today's dollars: it falls by the glide path each
  // year; every three years it is re-benchmarked to fair market value, which
  // the estimate takes to confirm the glide path.
  const feeByYear = Array.from({ length: A.years }, (_, i) => fee * (1 - input.glide) ** i);
  const savingByYear = feeByYear.map((f) => scope - f);
  const fiveYearSaving = savingByYear.reduce((s, v) => s + v, 0);

  return {
    revenue: R,
    comp,
    opex,
    profit,
    ppp,
    margin: profit / R,
    feeDiscount,
    scope,
    fee,
    feeSaving,
    deploymentFunded,
    hoursPerLawyerFreed,
    hoursFreed,
    growthRev,
    growthProfit,
    svcRev,
    svcProfit,
    upsideRev,
    upsideProfit,
    revenue2,
    opex2,
    newWorkCost,
    profit2,
    ppp2: profit2 / P,
    margin2: profit2 / revenue2,
    feeByYear,
    savingByYear,
    fiveYearSaving,
  };
}

export type Estimate = ReturnType<typeof compute>;

/**
 * Clamp inputs to the slider ranges, the revenue to the headcount's bounds
 * and the fee discount to what the efficiency pays for. Used for URL input
 * and for every change from the controls.
 */
export function normalize(input: Partial<EstimateInputs>): EstimateInputs {
  const clamp = (v: number | undefined, r: { min: number; max: number; step: number }, fallback: number) => {
    if (v === undefined || !Number.isFinite(v)) return fallback;
    const stepped = Math.round(v / r.step) * r.step;
    return Math.min(Math.max(stepped, r.min), r.max);
  };
  const partners = clamp(input.partners, INPUT_RANGES.partners, PRESETS.mid.partners);
  const attorneys = clamp(input.attorneys, INPUT_RANGES.attorneys, PRESETS.mid.attorneys);
  const b = revenueBounds(partners, attorneys);
  const revenue = Math.min(Math.max(clamp(input.revenue, INPUT_RANGES.revenue, PRESETS.mid.revenue), b.min), b.max);
  // Rounded to clear floating-point noise from the steps.
  const adj = (k: AdjustableKey) => Math.round(clamp(input[k], ADJUSTABLE[k], ADJUSTABLE[k].def) * 1000) / 1000;
  const efficiency = adj("efficiency");
  const feeDiscount = Math.min(adj("feeDiscount"), maxFeeDiscount(efficiency));
  return {
    partners,
    attorneys,
    revenue,
    feeDiscount: Math.round(feeDiscount * 1000) / 1000,
    efficiency,
    redeploy: adj("redeploy"),
    glide: adj("glide"),
    upside: input.upside === true,
  };
}

/** The preset that exactly matches these inputs' firm size, if any. */
export function matchPreset(input: FirmSize): PresetKey | null {
  for (const k of Object.keys(PRESETS) as PresetKey[]) {
    const p = PRESETS[k];
    if (p.partners === input.partners && p.attorneys === input.attorneys && p.revenue === input.revenue) return k;
  }
  return null;
}
