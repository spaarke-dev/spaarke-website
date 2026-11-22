"use client";

import { useMemo } from "react";
import { deptEstimate as copy } from "@/app/services/content";
import { DEPT_ASSUMPTIONS as A, computeDept, type DeptInputs } from "./dept-model";
import { money, num, pct } from "./format";
import { Waterfall, type WaterfallStep } from "./Waterfall";
import { DETAILS_ANCHOR } from "./query";
import { Assumptions, Card, CompareTable, DetailsHeading, Muted, Steps, Structure, type Row } from "./parts";

/**
 * Legal department "How the estimate works" (task 071): the bridge from
 * today's total cost of legal to the cost with the MSO, today against with
 * the MSO, the three steps, the structure and the assumptions.
 */
export function DeptDetails({ inputs }: { inputs: DeptInputs }) {
  const m = useMemo(() => computeDept(inputs), [inputs]);
  const d = copy.details;

  const steps: WaterfallStep[] = [
    { label: ["Today", ""], short: ["Today", ""], value: m.budget, kind: "base" },
    { label: ["Lower", "MSO fee"], short: ["Lower", "fee"], value: -m.feeSaving, kind: "step" },
    { label: ["Work brought", "in-house"], short: ["In-", "house"], value: -m.insourced, kind: "step" },
    { label: ["Routine work", "via the MSO"], short: ["Routine", "work"], value: -m.routineSaving, kind: "step" },
    { label: ["With", "the MSO"], short: ["With", "MSO"], value: m.total2, kind: "total" },
  ];

  const rows: Row[] = [
    { label: "Outside counsel", today: money(m.outside), mso: money(m.outside2), better: true },
    { label: "In-house lawyers", today: money(m.lawyerPay), mso: money(m.lawyerPay) },
    { label: "Operations, technology and staff", today: money(m.ops + m.staffPay), mso: money(m.kept), better: true },
    { label: "MSO fees", today: <Muted>-</Muted>, mso: money(m.msoFees) },
    { label: "Total cost of legal", today: money(m.budget), mso: money(m.total2), better: true, total: true },
    { label: "Saving", today: <Muted>-</Muted>, mso: `${money(m.saving)} (${pct(m.savingPct)})`, better: true },
    { label: "Outside counsel share", today: pct(m.outsideShare), mso: pct(m.outsideShare2), better: true },
    { label: "Lawyer hours freed", today: <Muted>-</Muted>, mso: num(m.hoursFreed), better: true },
    { label: "Capital invested", today: <Muted>-</Muted>, mso: "$0" },
  ];

  const howItWorks = [
    `About ${money(m.scope)} of legal operations, technology, e-billing and support work moves to the MSO. Automation and a shared platform cut its running cost by ${pct(A.efficiency)}, and the department pays a fixed fee of ${money(m.fee)}, ${pct(A.feeDiscount)} less than today.`,
    `Lawyers get back about ${pct(A.timeFreed)} of their time. Using half of it on routine work now sent to outside counsel saves about ${money(m.insourced)} a year.`,
    `About ${money(m.routineMoved)} of routine outside counsel work, such as standard contracts and NDAs, goes to the MSO’s AI-enabled team at about ${pct(A.routineCost)} of the cost, saving ${money(m.routineSaving)} a year. Your lawyers review and sign off the work.`,
  ];

  const assumptions: [string, string][] = [
    ["Budget per in-house lawyer", `Kept between ${money(A.budgetPerLawyerMin)} and ${money(A.budgetPerLawyerMax)}; the budget slider adjusts to the team`],
    ["In-house lawyer", `${money(A.lawyerCost)} a year, including benefits`],
    ["Legal operations or support staff", `${money(A.staffCost)} a year, including benefits`],
    ["Operations and technology spend", `${pct(A.opsShare)} of the budget: tools, e-billing, legal operations vendors and similar costs`],
    ["Outside counsel", `What the budget leaves after the team and operations spend, kept between ${pct(A.outsideMin)} and ${pct(A.outsideMax)} of the budget`],
    ["Moves to the MSO", `${pct(A.msoScope)} of operations spend and support staff cost`],
    ["MSO efficiency", `${pct(A.efficiency)} lower running cost, plus a Spaarke platform license of ${pct(A.platform)} of that cost`],
    ["MSO fee", `Fixed, ${pct(A.feeDiscount)} below today’s cost of the services that move, benchmarked to fair market value. Never a share of legal spend or savings.`],
    ["Deployment", `Platform deployment and standard migration worth about ${pct(A.deployment)} of the MSO’s cost base, funded by Spaarke`],
    ["Freed lawyer time", `${pct(A.timeFreed)} of ${num(A.hoursPerLawyer)} hours a year per lawyer, with ${pct(A.redeploy)} used on routine outside counsel work at a blended $${A.outsideRate} an hour, up to ${pct(A.insourceCap)} of outside counsel spend`],
    ["Routine work", `${pct(A.routineShare)} of outside counsel spend handled by the MSO at ${pct(A.routineCost)} of its cost`],
    ["Ownership", "None. The department owns no part of the MSO and receives no share of its profit."],
  ];

  return (
    <section id={DETAILS_ANCHOR} aria-labelledby={`${DETAILS_ANCHOR}-title`} className="scroll-mt-24">
      <DetailsHeading id={DETAILS_ANCHOR} title={d.title} />
      <div className="mt-6 space-y-4">
        <Card
          tight
          title={d.bridgeTitle}
          caption={`Annual total cost of legal, once the MSO is running. Down ${money(m.saving)}, or ${pct(m.savingPct)}.`}
        >
          <div className="mt-8">
            <Waterfall steps={steps} floor={0.8} label="Total cost of legal bridge" />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title={d.tableTitle} caption={d.tableCaption}>
            <CompareTable rows={rows} />
          </Card>
          <Card title={d.stepsTitle} caption={d.stepsCaption}>
            <Steps titles={d.steps} bodies={howItWorks} />
          </Card>
        </div>

        <Card title={d.structureTitle} caption={d.structureCaption}>
          <Structure
            boxes={[
              { title: "Your legal department", body: "Legal advice, decisions and privileged work stay here." },
              { title: "The MSO", body: "Run by Spaarke for the department. Legal operations, technology, e-billing and routine work." },
              {
                title: "Spaarke",
                body: `Funds the ${money(m.deploymentFunded)} deployment, runs the technology and carries the operating risk.`,
              },
            ]}
            arrows={[`Fixed fee ${money(m.fee)}`, "Platform license"]}
          />
        </Card>

        <Card title={d.assumptionsTitle} caption={d.assumptionsCaption}>
          <Assumptions items={assumptions} />
        </Card>
      </div>
    </section>
  );
}
