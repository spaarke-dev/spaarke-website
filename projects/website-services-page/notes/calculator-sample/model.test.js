// Run: node model.test.js  (golden values the website port must reproduce)
const M = require('./model.js');
const golden = {
  small: { margin: 0.460, margin2: 0.509, ppp: 536667, ppp2: 634900, hoursFreed: 1190, deploymentFunded: 63000, share: 56700, firmValue: 340200, firmValuePlatform: 567000, profitGain: 294700 },
  mid:   { margin: 0.361, margin2: 0.435, ppp: 650000, ppp2: 837584, hoursFreed: 2040, deploymentFunded: 256800, share: 231120, firmValue: 1386720, firmValuePlatform: 2311200, profitGain: 937920 },
  large: { margin: 0.312, margin2: 0.396, ppp: 650000, ppp2: 881657, hoursFreed: 5100, deploymentFunded: 805200, share: 724680, firmValue: 4348080, firmValuePlatform: 7246800, profitGain: 2779880 },
};
let fail = 0;
for (const [k, g] of Object.entries(golden)) {
  const m = M.compute(M.PRESETS[k]);
  const got = { ...m, profitGain: m.profit2 - m.profit };
  for (const [f, v] of Object.entries(g)) {
    const tol = v < 1 ? 0.001 : 1;
    if (Math.abs(got[f] - v) > tol) { fail++; console.log(`FAIL ${k}.${f}: expected ${v}, got ${got[f]}`); }
  }
}
// Guardrails
const edge = M.compute({ partners: 2, attorneys: 18, revenue: 60000000 });
if (edge.revenue !== 24000000 || edge.ppp !== 1500000) { fail++; console.log('FAIL guardrails', edge.revenue, edge.ppp); }
console.log(fail ? `${fail} failures` : 'All golden values match');
process.exit(fail ? 1 : 0);
