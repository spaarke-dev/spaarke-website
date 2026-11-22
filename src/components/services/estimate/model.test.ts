import { test } from "node:test";
import assert from "node:assert/strict";
import { ASSUMPTIONS, PRESETS, compute, normalize, revenueBounds, type PresetKey } from "./model";

/** Golden values from notes/calculator-sample/model.test.js (handoff 2026-11-22). */
const golden: Record<PresetKey, Record<string, number>> = {
  small: { margin: 0.46, margin2: 0.509, ppp: 536667, ppp2: 634900, hoursFreed: 1190, deploymentFunded: 63000, share: 56700, firmValue: 340200, firmValuePlatform: 567000, profitGain: 294700 },
  mid: { margin: 0.361, margin2: 0.435, ppp: 650000, ppp2: 837584, hoursFreed: 2040, deploymentFunded: 256800, share: 231120, firmValue: 1386720, firmValuePlatform: 2311200, profitGain: 937920 },
  large: { margin: 0.312, margin2: 0.396, ppp: 650000, ppp2: 881657, hoursFreed: 5100, deploymentFunded: 805200, share: 724680, firmValue: 4348080, firmValuePlatform: 7246800, profitGain: 2779880 },
};

for (const [k, g] of Object.entries(golden) as [PresetKey, Record<string, number>][]) {
  test(`estimate: golden values for the ${k} preset`, () => {
    const m = compute(PRESETS[k]);
    const got: Record<string, number> = { ...m, profitGain: m.profit2 - m.profit };
    for (const [f, v] of Object.entries(g)) {
      const tol = v < 1 ? 0.001 : 1;
      assert.ok(Math.abs(got[f] - v) <= tol, `${k}.${f}: expected ${v}, got ${got[f]}`);
    }
  });
}

test("estimate GUARDRAIL: revenue and profit per partner are clamped", () => {
  const edge = compute({ partners: 2, attorneys: 18, revenue: 60_000_000 });
  assert.equal(edge.revenue, 24_000_000);
  assert.equal(edge.ppp, 1_500_000);
});

test("estimate GUARDRAIL: the MSO fee is cost-based, never a share of revenue or legal fees", () => {
  for (const k of Object.keys(PRESETS) as PresetKey[]) {
    const m = compute(PRESETS[k]);
    assert.ok(Math.abs(m.fee - m.scope * (1 - ASSUMPTIONS.feeDiscount)) < 1e-6);
    assert.ok(m.fee < m.scope, "the fee sits below today's cost of the functions that move");
  }
  // Same operating cost, different revenue: the fee does not move.
  const a = compute({ partners: 5, attorneys: 7, revenue: 9_000_000 });
  const b = compute({ partners: 5, attorneys: 7, revenue: 9_000_000 }, { ...ASSUMPTIONS, newSvc: 0.05 });
  assert.equal(a.fee, b.fee);
});

test("estimate: normalize clamps URL input to the slider ranges and revenue bounds", () => {
  assert.deepEqual(normalize({}), PRESETS.mid);
  assert.deepEqual(normalize({ partners: 99, attorneys: -4, revenue: 1 }), {
    partners: 30,
    attorneys: 0,
    revenue: revenueBounds(30, 0).min,
  });
  assert.deepEqual(normalize({ partners: Number.NaN }), PRESETS.mid);
});
