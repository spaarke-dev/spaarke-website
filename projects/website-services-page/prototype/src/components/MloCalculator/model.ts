/**
 * Pure calculation model for the MLO calculator. No React, no I/O.
 *
 * COMPLIANCE RULES BAKED IN (design.md 7.2):
 *  - The MLO fee is units of service x unit price, derived from the COST of the functions moved.
 *    It is never a percentage of revenue, legal fees or profit. There is deliberately no input
 *    that could make it one, and tests assert the fee does not change with revenue pressure.
 *  - Revenue changes only through the stated fee-pressure scenario.
 *  - No equity values, returns or terms exist anywhere in this model.
 *
 * Every number is ILLUSTRATIVE. Defaults live in defaults.ts and must be set with finance and counsel.
 */

/* ------------------------------ Law firm ------------------------------ */

export const FIRM_FUNCTIONS = ['staff', 'technology', 'facilities', 'finance', 'marketing'] as const;
export type FirmFunction = (typeof FIRM_FUNCTIONS)[number];
export type FirmCostId = 'attorneyComp' | FirmFunction | 'other';

export interface FirmInputs {
  /** Annual revenue in dollars at today's pricing. */
  revenue: number;
  /** Baseline cost of each category as a fraction of baseline revenue. */
  costPct: Record<FirmCostId, number>;
  /** Technology capital spend as a fraction of baseline revenue. */
  capexPct: number;
  /** Which operating functions move to the MLO. */
  moved: Record<FirmFunction, boolean>;
  /** MLO unit price is this much below the firm's own internal cost (0 to 1). */
  priceAdvantage: number;
  /** Revenue erosion in the scenario (0 to 1). Applies equally with and without the MLO. */
  feePressure: number;
  /** One-time transition cost as a fraction of baseline revenue, charged only if something moves. */
  transitionCostPct: number;
}

export interface Totals {
  revenue: number;
  opex: number;
  capex: number;
  /** Distributable profit after opex and capex (cash basis). */
  profit: number;
  margin: number;
}

export interface LaneItem {
  id: string;
  value: number;
}

export interface FirmResult {
  baseline: Totals;
  withMlo: Totals;
  /** Total MLO service fee. Independent of revenue. */
  fee: number;
  /** Items that stay on the firm's side (opex lines and any retained capex). */
  firmLane: LaneItem[];
  /** How the MLO fee breaks down across the functions it delivers. */
  mloLane: LaneItem[];
  delta: { opex: number; capex: number; profit: number; profitPct: number };
  /** Year-one profit after the one-time transition cost. */
  yearOneProfit: number;
  transitionCost: number;
  /** True when costs exceed revenue in the scenario. */
  underwater: boolean;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function totals(revenue: number, opex: number, capex: number): Totals {
  const profit = revenue - opex - capex;
  return { revenue, opex, capex, profit, margin: revenue > 0 ? profit / revenue : 0 };
}

export function computeFirm(input: FirmInputs): FirmResult {
  const adv = clamp(input.priceAdvantage, 0, 1);
  const pressure = clamp(input.feePressure, 0, 1);
  const base = input.revenue;
  const scenarioRevenue = base * (1 - pressure);

  const cost = (id: FirmCostId) => input.costPct[id] * base;
  const capex = input.capexPct * base;
  const allIds: FirmCostId[] = ['attorneyComp', ...FIRM_FUNCTIONS, 'other'];

  // Without MLO: costs stay fixed in dollars while revenue falls under the scenario.
  const baselineOpex = sum(allIds.map(cost));
  const baseline = totals(scenarioRevenue, baselineOpex, capex);

  // With MLO.
  const movedIds = FIRM_FUNCTIONS.filter((f) => input.moved[f]);
  const techMoved = input.moved.technology;
  const movedBase: LaneItem[] = movedIds.map((id) => ({
    id,
    // Technology capex moves into the service fee along with technology opex.
    value: cost(id) + (id === 'technology' ? capex : 0),
  }));
  const mloLane: LaneItem[] = movedBase.map((m) => ({ id: m.id, value: m.value * (1 - adv) }));
  const fee = sum(mloLane.map((m) => m.value));

  const firmLane: LaneItem[] = allIds
    .filter((id) => id === 'attorneyComp' || id === 'other' || !input.moved[id as FirmFunction])
    .map((id) => ({ id, value: cost(id) }));
  const retainedCapex = techMoved ? 0 : capex;
  if (retainedCapex > 0) firmLane.push({ id: 'capex', value: retainedCapex });

  const retainedOpex = sum(firmLane.filter((i) => i.id !== 'capex').map((i) => i.value));
  const withMlo = totals(scenarioRevenue, retainedOpex + fee, retainedCapex);

  const transitionCost = movedIds.length > 0 ? input.transitionCostPct * base : 0;

  return {
    baseline,
    withMlo,
    fee,
    firmLane,
    mloLane,
    delta: {
      opex: withMlo.opex - baseline.opex,
      capex: withMlo.capex - baseline.capex,
      profit: withMlo.profit - baseline.profit,
      profitPct: baseline.profit !== 0 ? (withMlo.profit - baseline.profit) / Math.abs(baseline.profit) : 0,
    },
    yearOneProfit: withMlo.profit - transitionCost,
    transitionCost,
    underwater: withMlo.profit < 0 || baseline.profit < 0,
  };
}

/* ------------------------------ Corporate ------------------------------ */

export const CORP_FUNCTIONS = ['ops', 'technology'] as const;
export type CorpFunction = (typeof CORP_FUNCTIONS)[number];
export type CorpCostId = 'outside' | 'internal' | CorpFunction | 'other';

export interface CorpInputs {
  /** Annual operating legal budget in dollars. */
  budget: number;
  /** Baseline share of the operating budget by category (should sum to 1). */
  shares: Record<CorpCostId, number>;
  /** Technology capital spend as a fraction of the operating budget. */
  capexPct: number;
  /** Which operating functions move to the MLO. */
  moved: Record<CorpFunction, boolean>;
  /** MLO unit price is this much below the department's own internal cost (0 to 1). */
  priceAdvantage: number;
  /** Share of outside counsel spend that is routine work the MLO's technology and services can handle (0 to 1). */
  shiftedShare: number;
  /** What the MLO charges for that shifted work, as a fraction of the outside counsel cost displaced (0 to 1). */
  mloCostRatio: number;
  /** Matters per year, for cost per matter. */
  matterCount: number;
}

export interface CorpResult {
  baselineTotal: number;
  withMloTotal: number;
  savings: number;
  savingsPct: number;
  outsideBaseline: number;
  outsideWithMlo: number;
  capexBaseline: number;
  capexWithMlo: number;
  fee: number;
  costPerMatterBaseline: number;
  costPerMatterWithMlo: number;
  /** Items that stay on the department's side. */
  deptLane: LaneItem[];
  /** How the MLO fee breaks down. */
  mloLane: LaneItem[];
}

export function computeCorporate(input: CorpInputs): CorpResult {
  const adv = clamp(input.priceAdvantage, 0, 1);
  const shifted = clamp(input.shiftedShare, 0, 1);
  const ratio = clamp(input.mloCostRatio, 0, 1);
  const b = input.budget;
  const cost = (id: CorpCostId) => input.shares[id] * b;
  const capex = input.capexPct * b;

  const baselineTotal = b + capex;
  const outsideBaseline = cost('outside');
  const displaced = outsideBaseline * shifted;
  const outsideWithMlo = outsideBaseline - displaced;
  const shiftedCost = displaced * ratio;

  const movedIds = CORP_FUNCTIONS.filter((f) => input.moved[f]);
  const techMoved = input.moved.technology;
  const mloLane: LaneItem[] = movedIds.map((id) => ({
    id,
    value: (cost(id) + (id === 'technology' ? capex : 0)) * (1 - adv),
  }));
  if (shiftedCost > 0) mloLane.push({ id: 'shifted', value: shiftedCost });
  const fee = sum(mloLane.map((m) => m.value));

  const deptLane: LaneItem[] = [
    { id: 'outside', value: outsideWithMlo },
    { id: 'internal', value: cost('internal') },
    { id: 'other', value: cost('other') },
    ...CORP_FUNCTIONS.filter((f) => !input.moved[f]).map((id) => ({ id: id as string, value: cost(id) })),
  ];
  const retainedCapex = techMoved ? 0 : capex;
  if (retainedCapex > 0) deptLane.push({ id: 'capex', value: retainedCapex });

  const withMloTotal = sum(deptLane.map((i) => i.value)) + fee;
  const savings = baselineTotal - withMloTotal;
  const matters = Math.max(1, input.matterCount);

  return {
    baselineTotal,
    withMloTotal,
    savings,
    savingsPct: baselineTotal > 0 ? savings / baselineTotal : 0,
    outsideBaseline,
    outsideWithMlo,
    capexBaseline: capex,
    capexWithMlo: retainedCapex,
    fee,
    costPerMatterBaseline: baselineTotal / matters,
    costPerMatterWithMlo: withMloTotal / matters,
    deptLane,
    mloLane,
  };
}
