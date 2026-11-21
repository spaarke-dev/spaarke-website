import { describe, expect, it } from 'vitest';
import { CORP_DEFAULTS, FIRM_DEFAULTS } from './defaults';
import { computeCorporate, computeFirm, type CorpInputs, type FirmInputs } from './model';
import { corporateSankey, firmSankey } from './sankeyData';

const noMoves = { staff: false, technology: false, facilities: false, finance: false, marketing: false };
const approx = (a: number, b: number) => expect(a).toBeCloseTo(b, 4);

function outflow(data: { links: { source: string; target: string; value: number }[] }, id: string) {
  return data.links.filter((l) => l.source === id).reduce((a, l) => a + l.value, 0);
}
function inflow(data: { links: { source: string; target: string; value: number }[] }, id: string) {
  return data.links.filter((l) => l.target === id).reduce((a, l) => a + l.value, 0);
}

describe('firm model', () => {
  it('with nothing moved, results equal today', () => {
    const r = computeFirm({ ...FIRM_DEFAULTS, moved: noMoves });
    approx(r.withMlo.profit, r.baseline.profit);
    approx(r.withMlo.opex, r.baseline.opex);
    approx(r.withMlo.capex, r.baseline.capex);
    expect(r.fee).toBe(0);
    expect(r.transitionCost).toBe(0);
  });

  it('baseline margin matches the default cost structure (22%)', () => {
    const r = computeFirm({ ...FIRM_DEFAULTS, moved: noMoves });
    approx(r.baseline.margin, 0.22);
  });

  it('revenue = opex + capex + profit in every scenario', () => {
    for (const feePressure of [0, 0.1, 0.2]) {
      const r = computeFirm({ ...FIRM_DEFAULTS, feePressure });
      for (const t of [r.baseline, r.withMlo]) approx(t.revenue, t.opex + t.capex + t.profit);
    }
  });

  it('moving technology converts capex into the service fee', () => {
    const r = computeFirm({ ...FIRM_DEFAULTS, moved: { ...noMoves, technology: true }, priceAdvantage: 0 });
    expect(r.withMlo.capex).toBe(0);
    approx(r.fee, (0.06 + 0.03) * FIRM_DEFAULTS.revenue);
    approx(r.withMlo.profit, r.baseline.profit); // zero price advantage: same total cash, different line
  });

  it('a price advantage raises profit by exactly the saving', () => {
    const base = computeFirm({ ...FIRM_DEFAULTS, priceAdvantage: 0 });
    const adv = computeFirm({ ...FIRM_DEFAULTS, priceAdvantage: 0.2 });
    approx(adv.withMlo.profit - base.withMlo.profit, base.fee * 0.2);
  });

  it('GUARDRAIL: the fee is independent of revenue pressure and tracks cost, not revenue', () => {
    const a = computeFirm({ ...FIRM_DEFAULTS, feePressure: 0 });
    const b = computeFirm({ ...FIRM_DEFAULTS, feePressure: 0.2 });
    approx(a.fee, b.fee);
  });

  it('GUARDRAIL: the model input has no fee-as-percentage-of-revenue field', () => {
    const keys = Object.keys(FIRM_DEFAULTS);
    expect(keys.some((k) => /feePct|feeRate|revenueShare|percentOfRevenue/i.test(k))).toBe(false);
  });

  it('fee pressure hurts profit with and without the MLO, and the MLO cushions it', () => {
    const r = computeFirm({ ...FIRM_DEFAULTS, feePressure: 0.15 });
    expect(r.baseline.profit).toBeLessThan(computeFirm({ ...FIRM_DEFAULTS }).baseline.profit);
    expect(r.withMlo.profit).toBeGreaterThan(r.baseline.profit);
  });

  it('transition cost applies only when something moves', () => {
    const moved = computeFirm(FIRM_DEFAULTS);
    expect(moved.transitionCost).toBeCloseTo(0.02 * FIRM_DEFAULTS.revenue);
    expect(moved.yearOneProfit).toBeCloseTo(moved.withMlo.profit - moved.transitionCost);
  });

  it('flags a scenario where costs exceed revenue', () => {
    const inputs: FirmInputs = { ...FIRM_DEFAULTS, moved: noMoves, feePressure: 0.2, costPct: { ...FIRM_DEFAULTS.costPct, attorneyComp: 0.5 } };
    expect(computeFirm(inputs).underwater).toBe(true);
  });

  it('Sankey flows conserve value', () => {
    const r = computeFirm({ ...FIRM_DEFAULTS, feePressure: 0.1 });
    const d = firmSankey(r);
    approx(outflow(d, 'revenue'), r.withMlo.revenue);
    approx(inflow(d, 'fee'), outflow(d, 'fee'));
    approx(inflow(d, 'fee'), r.fee);
  });
});

describe('corporate model', () => {
  it('shares sum to one in the defaults', () => {
    const s = Object.values(CORP_DEFAULTS.shares).reduce((a, b) => a + b, 0);
    approx(s, 1);
  });

  it('with nothing moved or shifted, savings are zero', () => {
    const r = computeCorporate({ ...CORP_DEFAULTS, moved: { ops: false, technology: false }, shiftedShare: 0 });
    approx(r.savings, 0);
    approx(r.withMloTotal, r.baselineTotal);
  });

  it('savings are never negative while the MLO price is at or below internal cost', () => {
    for (const adv of [0, 0.1, 0.3]) {
      for (const ratio of [0.2, 0.6, 1]) {
        const r = computeCorporate({ ...CORP_DEFAULTS, priceAdvantage: adv, mloCostRatio: ratio });
        expect(r.savings).toBeGreaterThanOrEqual(-1e-6);
      }
    }
  });

  it('default case: matches the hand calculation', () => {
    const r = computeCorporate(CORP_DEFAULTS);
    approx(r.baselineTotal, 25_750_000);
    approx(r.fee, 4_750_000);
    approx(r.withMloTotal, 24_250_000);
    approx(r.savings, 1_500_000);
  });

  it('moving technology removes retained capex', () => {
    const r = computeCorporate(CORP_DEFAULTS);
    expect(r.capexWithMlo).toBe(0);
    expect(r.capexBaseline).toBeGreaterThan(0);
  });

  it('Sankey flows conserve value', () => {
    const r = computeCorporate(CORP_DEFAULTS);
    const d = corporateSankey(r);
    approx(outflow(d, 'budget'), r.baselineTotal);
    approx(inflow(d, 'fee'), outflow(d, 'fee'));
  });

  it('cost per matter falls when savings are positive', () => {
    const r = computeCorporate({ ...CORP_DEFAULTS } as CorpInputs);
    expect(r.costPerMatterWithMlo).toBeLessThan(r.costPerMatterBaseline);
  });
});
