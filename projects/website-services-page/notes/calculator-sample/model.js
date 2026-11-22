/*
 * Spaarke firm-MSO value model (framework-agnostic, no DOM).
 * Single source of truth for the website estimate. Port as-is to TypeScript.
 * Works in the browser (window.SpaarkeMSO) and in Node (module.exports).
 */
(function (root) {
  const ASSUMPTIONS = {
    ppp: 650000,            // representative profit per equity partner, US IP boutique
    attyComp: 210000,       // loaded cost per non-partner attorney or patent agent
    opexMin: 0.30,          // operating cost kept between 30% and 55% of revenue
    opexMax: 0.55,
    pppMin: 300000,         // profit per partner kept between $300k and $1.5M
    pppMax: 1500000,
    revPerLawyerMin: 400000, // revenue slider limited to $400k-$1.2M per lawyer
    revPerLawyerMax: 1200000,
    msoScope: 0.60,         // share of operating cost that moves to the MSO
    efficiency: 0.30,       // MSO running-cost reduction on that scope
    platform: 0.08,         // Spaarke platform licence, as share of scope cost
    feeDiscount: 0.10,      // MSO fee set 10% below today's cost (FMV study)
    deployment: 0.10,       // Spaarke-funded deployment and migration, as share of scope
    own: 0.75,              // firm's share of its MSO (Spaarke 25%)
    hoursPerLawyer: 1700,   // annual working hours per lawyer, for "hours freed"
    timeFreed: 0.10,        // lawyer time freed by automation and AI
    redeploy: 0.50,         // share of freed time used for new matters
    growthFlow: 0.80,       // share of new-matter revenue that reaches profit
    newSvc: 0.02,           // new client services, as share of revenue
    newSvcMargin: 0.50,
    multiple: 6,            // standalone firm-MSO valuation multiple
    platformMultiple: 10,   // illustrative multiple if the stake rolls into the platform at exit
  };

  const PRESETS = {
    small: { partners: 3, attorneys: 4, revenue: 3500000 },
    mid:   { partners: 5, attorneys: 7, revenue: 9000000 },
    large: { partners: 12, attorneys: 18, revenue: 25000000 },
  };

  const INPUT_RANGES = {
    partners:  { min: 1, max: 30, step: 1 },
    attorneys: { min: 0, max: 60, step: 1 },
    revenue:   { min: 1000000, max: 60000000, step: 250000 },
  };

  /** Revenue bounds for a given headcount, rounded to the slider step. */
  function revenueBounds(partners, attorneys, A = ASSUMPTIONS) {
    const lawyers = partners + attorneys, st = INPUT_RANGES.revenue.step;
    const lo = Math.max(INPUT_RANGES.revenue.min, Math.ceil(lawyers * A.revPerLawyerMin / st) * st);
    const hi = Math.max(lo, Math.min(INPUT_RANGES.revenue.max, Math.floor(lawyers * A.revPerLawyerMax / st) * st));
    return { min: lo, max: hi };
  }

  function compute(input, A = ASSUMPTIONS) {
    const P = input.partners, L = input.partners + input.attorneys;
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
    const opex2 = opex - feeSaving;                       // firm operating cost incl. MSO fee
    const newWorkCost = (growthRev - growthProfit) + (svcRev - svcProfit);
    const profit2 = R2 - comp - opex2 - newWorkCost + share;

    // Objective 3: long-term value
    const value = ebitda * A.multiple;
    const firmValue = value * A.own;
    const firmValuePlatform = share * A.platformMultiple;

    return {
      revenue: R, comp, opex, profit, ppp, margin: profit / R,
      scope, fee, feeSaving, msoCost, msoCostReduction: 1 - msoCost / scope, ebitda, share,
      hoursFreed, growthRev, growthProfit, svcRev, svcProfit, deploymentFunded,
      revenue2: R2, opex2, newWorkCost, profit2, ppp2: profit2 / P, margin2: profit2 / R2,
      value, firmValue, firmValuePlatform, spaarkeShare: ebitda - share,
    };
  }

  const api = { ASSUMPTIONS, PRESETS, INPUT_RANGES, revenueBounds, compute };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SpaarkeMSO = api;
})(typeof window !== 'undefined' ? window : globalThis);
