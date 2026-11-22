import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEPT_ASSUMPTIONS,
  DEPT_PRESETS,
  budgetBounds,
  computeDept,
  normalizeDept,
  type DeptPresetKey,
} from "./dept-model";

/**
 * Reference values for the legal department estimate (task 071). Set from
 * the model on 2026-11-22; change them only with a deliberate change to the
 * assumptions, and record it in notes/review-notes.md.
 */
const golden: Record<DeptPresetKey, Record<string, number>> = {
  small: { outside: 3_290_000, scope: 666_000, feeSaving: 66_600, hoursFreed: 850, insourced: 191_250, routineSaving: 131_600, total2: 5_610_550, saving: 389_450, deploymentFunded: 66_600 },
  mid: { outside: 15_900_000, scope: 2_580_000, feeSaving: 258_000, hoursFreed: 2550, insourced: 573_750, routineSaving: 636_000, total2: 23_532_250, saving: 1_467_750, deploymentFunded: 258_000 },
  large: { outside: 58_650_000, scope: 9_210_000, feeSaving: 921_000, hoursFreed: 8500, insourced: 1_912_500, routineSaving: 2_346_000, total2: 84_820_500, saving: 5_179_500, deploymentFunded: 921_000 },
};

for (const [k, g] of Object.entries(golden) as [DeptPresetKey, Record<string, number>][]) {
  test(`dept estimate: reference values for the ${k} preset`, () => {
    const m = computeDept(DEPT_PRESETS[k]) as unknown as Record<string, number>;
    for (const [f, v] of Object.entries(g)) assert.ok(Math.abs(m[f] - v) <= 1, `${k}.${f}: expected ${v}, got ${m[f]}`);
  });
}

test("dept estimate: the saving is the sum of the three sources", () => {
  for (const k of Object.keys(DEPT_PRESETS) as DeptPresetKey[]) {
    const m = computeDept(DEPT_PRESETS[k]);
    assert.ok(Math.abs(m.saving - (m.feeSaving + m.insourced + m.routineSaving)) < 1e-6);
    assert.ok(Math.abs(m.lawyerPay + m.staffPay + m.ops + m.outside - m.budget) < 1e-6, "today's lines add up to the budget");
  }
});

test("dept estimate GUARDRAIL: no equity, ownership or profit share for legal departments", () => {
  const keys = Object.keys(computeDept(DEPT_PRESETS.mid));
  for (const k of keys) assert.doesNotMatch(k, /equity|stake|own|share(?!2?$)|value|ebitda|profit/i, `unexpected output ${k}`);
  const aKeys = Object.keys(DEPT_ASSUMPTIONS);
  for (const k of aKeys) assert.doesNotMatch(k, /equity|stake|own|multiple/i, `unexpected assumption ${k}`);
});

test("dept estimate GUARDRAIL: the MSO fee is fixed below today's cost, never a share of the budget or legal fees", () => {
  const a = computeDept(DEPT_PRESETS.mid);
  assert.ok(Math.abs(a.fee - a.scope * (1 - DEPT_ASSUMPTIONS.feeDiscount)) < 1e-6);
  // Changing outside counsel economics leaves the operations fee unchanged.
  const b = computeDept(DEPT_PRESETS.mid, { ...DEPT_ASSUMPTIONS, outsideRate: 900, routineShare: 0.2 });
  assert.equal(a.fee, b.fee);
});

test("dept estimate GUARDRAIL: inputs are clamped to plausible bounds", () => {
  assert.deepEqual(normalizeDept({}), DEPT_PRESETS.mid);
  const n = normalizeDept({ lawyers: 2, staff: 60, budget: 1_000_000 });
  assert.equal(n.budget, budgetBounds(2, 60).min);
  const m = computeDept({ lawyers: 10, staff: 0, budget: 300_000_000 });
  assert.equal(m.budget, 30_000_000);
  assert.ok(m.outside <= m.budget * DEPT_ASSUMPTIONS.outsideMax + 1e-6);
});
