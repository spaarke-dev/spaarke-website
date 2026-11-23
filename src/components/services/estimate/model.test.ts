import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ADJUSTABLE_DEFAULTS,
  ASSUMPTIONS,
  DEFAULT_INPUTS,
  PRESETS,
  compute,
  maxFeeDiscount,
  normalize,
  revenueBounds,
  type EstimateInputs,
  type PresetKey,
} from "./model";

const at = (k: PresetKey, more: Partial<EstimateInputs> = {}): EstimateInputs => ({
  ...DEFAULT_INPUTS,
  ...PRESETS[k],
  ...more,
});

/**
 * Today's figures are the handoff's golden values (notes/calculator-sample,
 * 2026-11-22). The gains follow the value page change list the same day: no
 * MSO profit share, so the mid-size firm's lift is the $257k cost saving, or
 * about $707k with the capacity upside ($360k new matters, $90k new client
 * services).
 */
const golden: Record<PresetKey, Record<string, number>> = {
  small: { margin: 0.46, ppp: 536667, hoursFreed: 1190, feeSaving: 63000, upsideProfit: 175000 },
  mid: { margin: 0.361, ppp: 650000, hoursFreed: 2040, feeSaving: 256800, growthProfit: 360000, svcProfit: 90000, upsideProfit: 450000 },
  large: { margin: 0.312, ppp: 650000, hoursFreed: 5100, feeSaving: 805200, upsideProfit: 1250000 },
};

for (const [k, g] of Object.entries(golden) as [PresetKey, Record<string, number>][]) {
  test(`estimate: expected values for the ${k} preset`, () => {
    const m = compute(at(k));
    const got = m as unknown as Record<string, number>;
    for (const [f, v] of Object.entries(g)) {
      const tol = v < 1 ? 0.001 : 1;
      assert.ok(Math.abs(got[f] - v) <= tol, `${k}.${f}: expected ${v}, got ${got[f]}`);
    }
  });
}

test("estimate: the base case is the cost saving alone; the upside adds new matters and new client services", () => {
  const base = compute(at("mid"));
  assert.equal(base.profit2 - base.profit, base.feeSaving);
  assert.equal(base.revenue2, base.revenue);
  assert.equal(base.newWorkCost, 0);
  const up = compute(at("mid", { upside: true }));
  assert.ok(Math.abs(up.profit2 - up.profit - 706_800) < 1);
  assert.ok(Math.abs(up.revenue2 - up.revenue - 630_000) < 1);
});

test("estimate GUARDRAIL: no MSO profit share or equity value in the model", () => {
  const m = compute(at("mid", { upside: true })) as unknown as Record<string, unknown>;
  for (const k of ["share", "ebitda", "firmValue", "firmValuePlatform", "value", "spaarkeShare"]) {
    assert.equal(m[k], undefined, `${k} should not exist`);
  }
});

test("estimate GUARDRAIL: revenue and profit per partner are clamped", () => {
  const edge = compute(at("mid", { partners: 2, attorneys: 18, revenue: 60_000_000 }));
  assert.equal(edge.revenue, 24_000_000);
  assert.equal(edge.ppp, 1_500_000);
});

test("estimate GUARDRAIL: the MSO fee sits below today's cost, never a share of revenue or legal fees", () => {
  for (const k of Object.keys(PRESETS) as PresetKey[]) {
    const m = compute(at(k));
    assert.ok(Math.abs(m.fee - m.scope * (1 - ADJUSTABLE_DEFAULTS.feeDiscount)) < 1e-6);
    assert.ok(m.fee < m.scope);
  }
  // Same operating cost, different revenue assumptions: the fee does not move.
  const a = compute(at("mid"));
  const b = compute(at("mid"), { ...ASSUMPTIONS, newSvc: 0.05 });
  assert.equal(a.fee, b.fee);
});

test("estimate: the fee discount is capped by what the MSO's efficiency pays for", () => {
  assert.equal(maxFeeDiscount(0.3), 0.2); // 22% would fit, the slider tops out at 20%
  assert.ok(Math.abs(maxFeeDiscount(0.15) - 0.07) < 1e-9);
  const m = compute(at("mid", { efficiency: 0.15, feeDiscount: 0.2 }));
  assert.ok(Math.abs(m.feeDiscount - 0.07) < 1e-9);
});

test("estimate: five years of the fee follow the glide path", () => {
  const m = compute(at("mid", { glide: 0.05 }));
  assert.equal(m.feeByYear.length, 5);
  assert.ok(Math.abs(m.feeByYear[4] - m.fee * 0.95 ** 4) < 1e-6);
  assert.ok(m.savingByYear.every((s, i) => i === 0 || s > m.savingByYear[i - 1]));
  assert.ok(Math.abs(m.fiveYearSaving - m.savingByYear.reduce((s, v) => s + v, 0)) < 1e-6);
});

test("estimate: normalize clamps URL input to the slider ranges and revenue bounds", () => {
  assert.deepEqual(normalize({}), DEFAULT_INPUTS);
  const n = normalize({ partners: 99, attorneys: -4, revenue: 1, feeDiscount: 0.5, glide: 0.01, upside: true });
  assert.equal(n.partners, 30);
  assert.equal(n.attorneys, 0);
  assert.equal(n.revenue, revenueBounds(30, 0).min);
  assert.equal(n.feeDiscount, 0.2);
  assert.equal(n.glide, 0.03);
  assert.equal(n.upside, true);
  assert.deepEqual(normalize({ partners: Number.NaN }), DEFAULT_INPUTS);
  assert.equal(normalize({ efficiency: 0.15, feeDiscount: 0.2 }).feeDiscount, 0.07);
});
