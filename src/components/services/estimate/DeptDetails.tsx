"use client";

import { useMemo } from "react";
import { deptEstimate as copy } from "@/app/services/content";
import { DEPT_ASSUMPTIONS as A, computeDept, type DeptInputs } from "./dept-model";
import { money, num, pct } from "./format";
import { Waterfall, type WaterfallGroup, type WaterfallStep } from "./Waterfall";
import { FeeYears } from "./FeeYears";
import { DETAILS_ANCHOR } from "./query";
import { Assumptions, Card, CompareTable, DetailsHeading, Muted, Steps, type Row } from "./parts";

/**
 * Legal department "How the estimate works" (behind "See the details"),
 * reworked to the law firm pattern on 2026-11-22: where the savings come from
 * (the base case, then the capacity upside apart from it), the fee over five
 * years, today against with the MSO, the three steps and the assumptions. The
 * structure is the diagram above this section. No equity, ownership or profit
 * share. Every figure follows the inputs.
 */
export function DeptDetails({ inputs }: { inputs: DeptInputs }) {
  const m = useMemo(() => computeDept(inputs), [inputs]);
  const d = copy.details;
  const on = inputs.upside;

  // Annual saving for the whole department, from $0. The base case stands
  // alone; the upside is hatched and bracketed as an assumption.
  const steps: WaterfallStep[] = [
    { label: ["Lower", "MSO fee"], short: ["Lower", "fee"], value: m.feeSaving, kind: "step" },
    { label: ["Base", "case"], short: ["Base", "case"], value: m.feeSaving, kind: "total" },
    { label: ["Work brought", "in-house"], short: ["In-", "house"], value: m.insourced, kind: "upside" },
    { label: ["Routine work", "via the MSO"], short: ["Routine", "work"], value: m.routineSaving, kind: "upside" },
    { label: ["With the", "upside"], short: ["With", "upside"], value: m.feeSaving + m.upsideSaving, kind: "grand" },
  ];
  const groups: WaterfallGroup[] = [
    { label: "Base case", from: 0, to: 1 },
    { label: "Upside (assumption)", from: 2, to: 4 },
  ];

  const rows: Row[] = [
    { label: "Outside counsel", today: money(m.outside), mso: money(m.outside2), better: on },
    { label: "In-house lawyers", today: money(m.lawyerPay), mso: money(m.lawyerPay) },
    { label: "Operations, technology and staff", today: money(m.ops + m.staffPay), mso: money(m.kept), better: true },
    { label: "MSO fees", today: <Muted>-</Muted>, mso: money(m.msoFees) },
    { label: "Total cost of legal", today: money(m.budget), mso: money(m.total2), better: true, total: true },
    { label: "Saving", today: <Muted>-</Muted>, mso: `${money(m.saving)} (${pct(m.savingPct)})`, better: true },
    { label: "Outside counsel share", today: pct(m.outsideShare), mso: pct(m.outsideShare2), better: on },
    { label: "Lawyer hours freed", today: <Muted>-</Muted>, mso: num(m.hoursFreed), better: true },
    { label: "Capital invested", today: <Muted>-</Muted>, mso: "$0" },
  ];

  const howItWorks = [
    `About ${money(m.scope)} of legal operations, technology, e-billing and support work moves to the MSO. Automation and a shared platform cut its running cost by about ${pct(inputs.efficiency)}, and the department pays a fixed or per-unit fee, benchmarked to fair market value, about ${pct(m.feeDiscount)} below today’s cost.`,
    `Lawyers get back about ${pct(A.timeFreed)} of their time, or ${num(m.hoursPerLawyerFreed)} hours each a year. If the department uses ${pct(inputs.redeploy)} of it on routine work now sent to outside counsel, it could save about ${money(m.insourced)} a year. That is part of the optional capacity upside: an assumption, not a result.`,
    `About ${money(m.routineMoved)} of routine outside counsel work, such as standard contracts and NDAs, could go to the MSO’s AI-enabled team at about ${pct(A.routineCost)} of the cost, saving ${money(m.routineSaving)} a year. Your lawyers review and sign off the work. Also part of the capacity upside.`,
  ];

  const assumptions: [string, string][] = [
    ["Budget per in-house lawyer", `Kept between ${money(A.budgetPerLawyerMin)} and ${money(A.budgetPerLawyerMax)}; the budget slider adjusts to the team`],
    ["In-house lawyer", `${money(A.lawyerCost)} a year, including benefits`],
    ["Legal operations or support staff", `${money(A.staffCost)} a year, including benefits`],
    ["Operations and technology spend", `${pct(A.opsShare)} of the budget: tools, e-billing, legal operations vendors and similar costs`],
    ["Outside counsel", `What the budget leaves after the team and operations spend, kept between ${pct(A.outsideMin)} and ${pct(A.outsideMax)} of the budget`],
    ["Moves to the MSO", `${pct(A.msoScope)} of operations spend and support staff cost`],
    [
      "MSO efficiency gain",
      `${pct(inputs.efficiency)} lower running cost on the work that moves, before a platform cost of ${pct(A.platform)}. Basis: published research finds cost reductions near 60% where work is redesigned around AI and under 20% where it is not (BCG; McKinsey); this sits between the two. The gain also caps the fee discount, as the MSO cannot price below its own cost.`,
    ],
    [
      "MSO fee",
      `Fixed or per-unit, ${pct(m.feeDiscount)} below today’s cost of the services that move in the first year and benchmarked to fair market value. It falls ${pct(inputs.glide, 1)} a year as productivity improves and is re-benchmarked every ${A.fmvReset} years. Never a share of legal spend or savings.`,
    ],
    ["Deployment", `Platform deployment and standard migration worth about ${pct(A.deployment)} of the MSO’s cost base, funded by Spaarke.`],
    [
      "Freed lawyer time",
      `${pct(A.timeFreed)} of ${num(A.hoursPerLawyer)} working hours a year, or ${num(m.hoursPerLawyerFreed)} hours per lawyer. Basis: a planning figure for drafting, review and administrative work taken on by automation and AI, to be measured in the pilot.`,
    ],
    [
      "Capacity upside (optional)",
      `${pct(inputs.redeploy)} of freed time used on routine outside counsel work at a blended $${A.outsideRate} an hour, up to ${pct(A.insourceCap)} of outside counsel spend, plus ${pct(A.routineShare)} of outside counsel spend handled by the MSO at ${pct(A.routineCost)} of its cost. Off unless switched on.`,
    ],
    ["Ownership", "None. The department owns no part of the MSO and receives no share of its profit."],
  ];

  return (
    <section id={DETAILS_ANCHOR} aria-labelledby={`${DETAILS_ANCHOR}-title`} className="scroll-mt-24">
      <DetailsHeading id={DETAILS_ANCHOR} title={d.title} />
      <div className="mt-6 space-y-4">
        <Card
          tight
          title={d.bridgeTitle}
          caption={`Annual, for the whole department. The base case is the lower fee alone: ${money(m.feeSaving)} a year. Work brought in-house and routine matters sent to the MSO are the optional capacity upside, an assumption about how freed time and routine work are used, not a result.`}
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
          <Assumptions items={assumptions} />
        </Card>
      </div>
    </section>
  );
}
