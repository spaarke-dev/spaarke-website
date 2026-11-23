"use client";

import { useMemo } from "react";
import { estimate as copy } from "@/app/services/content";
import { ASSUMPTIONS as A, compute, type EstimateInputs } from "./model";
import { money, num, pct } from "./format";
import { Waterfall, type WaterfallGroup, type WaterfallStep } from "./Waterfall";
import { FeeYears } from "./FeeYears";
import { DETAILS_ANCHOR } from "./query";
import { Assumptions, Card, CompareTable, DetailsHeading, Muted, Steps, type Row } from "./parts";

/**
 * Law firm "How the estimate works" (behind "See the details"), reworked to
 * the owner's value page change list (2026-11-22): where the savings come
 * from (the base case, then the capacity upside apart from it), the fee over
 * five years, today against with the MSO, the three steps and the
 * assumptions. No MSO profit share or equity figure. Every figure follows the
 * inputs; the disclaimer sits with each numeric card (row 20).
 */
export function EstimateDetails({ inputs }: { inputs: EstimateInputs }) {
  const m = useMemo(() => compute(inputs), [inputs]);
  const P = inputs.partners;
  const d = copy.details;
  const on = inputs.upside;

  // Rows 1, 2 and 12: annual saving for the whole firm, from $0. The base case
  // stands alone; the upside is hatched and bracketed as an assumption.
  const steps: WaterfallStep[] = [
    { label: ["Lower", "MSO fee"], short: ["Lower", "fee"], value: m.feeSaving, kind: "step" },
    { label: ["Base", "case"], short: ["Base", "case"], value: m.feeSaving, kind: "total" },
    { label: ["New matters", "(freed time)"], short: ["New", "matters"], value: m.growthProfit, kind: "upside" },
    { label: ["New client", "services"], short: ["New", "svcs"], value: m.svcProfit, kind: "upside" },
    { label: ["With the", "upside"], short: ["With", "upside"], value: m.feeSaving + m.upsideProfit, kind: "grand" },
  ];
  const groups: WaterfallGroup[] = [
    { label: "Base case", from: 0, to: 1 },
    { label: "Upside (assumption)", from: 2, to: 4 },
  ];

  // Row 3: no MSO profit or equity rows; profit, margin and profit per partner follow the remaining rows.
  const rows: Row[] = [
    { label: "Revenue", today: money(m.revenue), mso: money(m.revenue2), better: on },
    { label: "Pay for other lawyers and professionals", today: money(m.comp), mso: money(m.comp) },
    { label: "Operating cost, including the MSO fee", today: money(m.opex), mso: money(m.opex2), better: true },
    ...(on ? [{ label: "Cost of new work", today: <Muted>-</Muted>, mso: money(m.newWorkCost) }] : []),
    { label: "Partner profit", today: money(m.profit), mso: money(m.profit2), better: true, total: true },
    { label: "Profit margin", today: pct(m.margin), mso: pct(m.margin2), better: true },
    { label: "Profit per partner", today: money(m.ppp), mso: money(m.ppp2), better: true },
  ];

  // Rows 4 and 5.
  const howItWorks = [
    `About ${money(m.scope)} of back office, docketing, IT and finance moves to the MSO. Automation and a shared platform cut its running cost by about ${pct(inputs.efficiency)}, and the firm pays a fixed or per-unit fee, benchmarked to fair market value, about ${pct(m.feeDiscount)} below today’s cost.`,
    `Lawyers get back about ${pct(A.timeFreed)} of their time, or ${num(m.hoursPerLawyerFreed)} hours each a year. If the firm uses ${pct(inputs.redeploy)} of it for new matters and adds new client services, revenue could grow by about ${money(m.upsideRev)}. That is the optional capacity upside: an assumption, not a result.`,
    d.equityStep,
  ];

  // Rows 7, 8, 13, 14 and 21.
  const assumptions: [string, string][] = [
    ["Revenue per lawyer", `Kept between ${money(A.revPerLawyerMin)} and ${money(A.revPerLawyerMax)}; the revenue slider adjusts to the headcount`],
    ["Profit per partner today", `${money(A.ppp)}, adjusted where needed to keep operating cost between ${pct(A.opexMin)} and ${pct(A.opexMax)} of revenue and profit per partner between ${money(A.pppMin)} and ${money(A.pppMax)}`],
    ["Cost per other lawyer or legal professional", `${money(A.attyComp)}, including benefits`],
    ["Operating cost", "Revenue less partner profit and pay for other lawyers. Covers staff, docketing, IT, finance, occupancy and insurance."],
    ["Moves to the MSO", `${pct(A.msoScope)} of operating cost. Occupancy, insurance and similar costs stay with the firm.`],
    [
      "MSO efficiency gain",
      `${pct(inputs.efficiency)} lower running cost on the work that moves, before a platform cost of ${pct(A.platform)}. Basis: published research finds cost reductions near 60% where work is redesigned around AI and under 20% where it is not (BCG; McKinsey); this sits between the two. The gain also caps the fee discount, as the MSO cannot price below its own cost.`,
    ],
    [
      "MSO fee",
      `Fixed or per-unit, ${pct(m.feeDiscount)} below today’s cost in the first year and benchmarked to fair market value. It falls ${pct(inputs.glide, 1)} a year as productivity improves and is re-benchmarked every ${A.fmvReset} years. Never a share of legal fees.`,
    ],
    ["Deployment", `Platform deployment and standard migration worth about ${pct(A.deployment)} of the MSO’s cost base, funded by Spaarke.`],
    [
      "Freed lawyer time",
      `${pct(A.timeFreed)} of ${num(A.hoursPerLawyer)} working hours a year, or ${num(m.hoursPerLawyerFreed)} hours per lawyer. Basis: a planning figure for drafting, review and administrative work taken on by automation and AI, to be measured in the pilot.`,
    ],
    [
      "Capacity upside (optional)",
      `${pct(inputs.redeploy)} of freed time used for new matters at ${pct(A.growthFlow)} profit flow-through, plus new client services worth ${pct(A.newSvc)} of revenue at a ${pct(A.newSvcMargin)} margin. Off unless switched on.`,
    ],
  ];

  return (
    <section id={DETAILS_ANCHOR} aria-labelledby={`${DETAILS_ANCHOR}-title`} className="scroll-mt-24">
      <DetailsHeading id={DETAILS_ANCHOR} title={d.title} />
      <div className="mt-6 space-y-4">
        <Card
          tight
          title={d.bridgeTitle}
          caption={`Annual, for the whole firm. The base case is the lower fee alone: ${money(m.feeSaving)} a year, or ${money(m.feeSaving / P)} per partner. New matters and new client services are the optional capacity upside, an assumption about how freed time is used, not a result.`}
          note={copy.note}
        >
          <div className="mt-8">
            <Waterfall
              steps={steps}
              floor={0}
              label="Annual saving bridge"
              groups={groups}
              legend={[
                { kind: "step", label: "Cost saving (base case)" },
                { kind: "upside", label: "Capacity upside (assumption)" },
              ]}
            />
          </div>
        </Card>

        <Card
          tight
          title={d.feeTitle}
          caption={`The fixed or per-unit fee against today’s cost of the work that moves, in today’s dollars. The fee falls ${pct(inputs.glide, 1)} a year as productivity improves and is re-benchmarked to fair market value every ${A.fmvReset} years. About ${money(m.fiveYearSaving)} saved over five years.`}
          note={copy.note}
        >
          <div className="px-3 sm:px-0">
            <FeeYears
              today={m.scope}
              fees={m.feeByYear}
              savings={m.savingByYear}
              reviewEvery={A.fmvReset}
              label="MSO fee by year against today’s cost"
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title={d.tableTitle} caption={on ? d.tableCaption.upside : d.tableCaption.base} note={copy.note}>
            <CompareTable rows={rows} />
          </Card>
          <Card title={d.stepsTitle} caption={d.stepsCaption}>
            <Steps titles={d.steps} bodies={howItWorks} />
          </Card>
        </div>

        <Card title={d.assumptionsTitle} caption={d.assumptionsCaption}>
          <Assumptions items={assumptions} tag={d.validate} />
        </Card>
      </div>
    </section>
  );
}
