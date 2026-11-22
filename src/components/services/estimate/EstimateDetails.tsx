"use client";

import { useMemo } from "react";
import { estimate as copy } from "@/app/services/content";
import { ASSUMPTIONS as A, compute, type EstimateInputs } from "./model";
import { money, num, pct } from "./format";
import { Waterfall, type WaterfallGroup, type WaterfallStep } from "./Waterfall";
import { DETAILS_ANCHOR } from "./query";
import { Assumptions, Card, CompareTable, DetailsHeading, Muted, Steps, Structure, type Row } from "./parts";

/**
 * Law firm "How the estimate works" (handoff section 3, behind "See the
 * details"): the profit-per-partner bridge, today against with the MSO, the
 * three steps, the structure and the assumptions. Every figure follows the
 * inputs.
 */
export function EstimateDetails({ inputs }: { inputs: EstimateInputs }) {
  const m = useMemo(() => compute(inputs), [inputs]);
  const P = inputs.partners;
  const d = copy.details;

  const steps: WaterfallStep[] = [
    { label: ["Today", ""], short: ["Today", ""], value: m.ppp, kind: "base" },
    { label: ["Lower", "MSO fee"], short: ["Lower", "fee"], value: m.feeSaving / P, kind: "step" },
    { label: ["MSO profit", "share"], short: ["MSO", "share"], value: m.share / P, kind: "step" },
    { label: ["New matters", "(freed time)"], short: ["Freed", "time"], value: m.growthProfit / P, kind: "step" },
    { label: ["New client", "services"], short: ["New", "svcs"], value: m.svcProfit / P, kind: "step" },
    { label: ["With", "the MSO"], short: ["With", "MSO"], value: m.ppp2, kind: "total" },
    // Owner review 2026-11-22: the equity stake joins the chart, per partner, as in the earlier five-year chart.
    { label: ["MSO equity", "per partner"], short: ["MSO", "equity"], value: m.firmValue / P, kind: "equity" },
    { label: ["Profit and", "equity"], short: ["Plus", "equity"], value: m.ppp2 + m.firmValue / P, kind: "grand" },
  ];

  const groups: WaterfallGroup[] = [
    { label: `Annual profit · +${money(m.ppp2 - m.ppp)}`, from: 1, to: 4 },
    { label: "Equity", from: 6, to: 6 },
  ];

  const rows: Row[] = [
    { label: "Revenue", today: money(m.revenue), mso: money(m.revenue2), better: true },
    { label: "Attorney and agent pay", today: money(m.comp), mso: money(m.comp) },
    { label: "Operating cost", today: money(m.opex), mso: money(m.opex2), better: true },
    { label: "Cost of new work", today: <Muted>-</Muted>, mso: money(m.newWorkCost) },
    { label: "MSO profit to the firm", today: <Muted>-</Muted>, mso: money(m.share), better: true },
    { label: "Partner profit", today: money(m.profit), mso: money(m.profit2), better: true, total: true },
    { label: "Profit margin", today: pct(m.margin), mso: pct(m.margin2), better: true },
    { label: "Profit per partner", today: money(m.ppp), mso: money(m.ppp2), better: true },
    { label: "Firm’s equity it can sell", today: <Muted>Little</Muted>, mso: money(m.firmValue), better: true },
  ];

  const howItWorks = [
    `About ${money(m.scope)} of back office, docketing, IT and finance moves to the MSO. Automation and a shared platform cut its running cost by ${pct(A.efficiency)}, and the firm pays a fixed fee of ${money(m.fee)}, ${pct(A.feeDiscount)} less than today.`,
    `Lawyers get back about ${pct(A.timeFreed)} of their time. Using half of it for new matters, plus new client services, adds about ${money(m.revenue2 - m.revenue)} of revenue.`,
    `The MSO earns about ${money(m.ebitda)} a year. The firm keeps ${pct(A.own)} of it and owns ${pct(A.own)} of an asset worth about ${money(m.value)}, without investing cash.`,
  ];

  const assumptions: [string, string][] = [
    ["Revenue per lawyer", `Kept between ${money(A.revPerLawyerMin)} and ${money(A.revPerLawyerMax)}; the revenue slider adjusts to the headcount`],
    ["Profit per partner today", `${money(A.ppp)}, adjusted where needed to keep operating cost between ${pct(A.opexMin)} and ${pct(A.opexMax)} of revenue and profit per partner between ${money(A.pppMin)} and ${money(A.pppMax)}`],
    ["Cost per other attorney or patent agent", `${money(A.attyComp)}, including benefits`],
    ["Operating cost", "Revenue less partner profit and attorney pay. Covers staff, docketing, IT, finance, occupancy and insurance."],
    ["Moves to the MSO", `${pct(A.msoScope)} of operating cost. Occupancy, insurance and similar costs stay with the firm.`],
    ["MSO efficiency", `${pct(A.efficiency)} lower running cost, plus a Spaarke platform license of ${pct(A.platform)} of that cost`],
    ["MSO fee", `Fixed, ${pct(A.feeDiscount)} below today’s cost, benchmarked to fair market value. Never a share of legal fees.`],
    ["Deployment", `Platform deployment and standard migration worth about ${pct(A.deployment)} of the MSO’s cost base, funded by Spaarke in return for its ${pct(1 - A.own)} stake`],
    ["Freed lawyer time", `${pct(A.timeFreed)} of ${num(A.hoursPerLawyer)} hours a year per lawyer, with ${pct(A.redeploy)} used for new matters at ${pct(A.growthFlow)} profit flow-through`],
    ["New client services", `${pct(A.newSvc)} of revenue at a ${pct(A.newSvcMargin)} margin`],
    ["MSO value", `${A.multiple}x annual MSO profit standalone. ${A.platformMultiple}x is an illustrative platform multiple for the roll-up option at exit.`],
  ];

  return (
    <section id={DETAILS_ANCHOR} aria-labelledby={`${DETAILS_ANCHOR}-title`} className="scroll-mt-24">
      <DetailsHeading id={DETAILS_ANCHOR} title={d.title} />
      <div className="mt-6 space-y-4">
        <Card
          tight
          title={d.bridgeTitle}
          caption={`Annual profit per partner once the MSO is running, then the firm’s equity stake in its MSO, per partner. Profit is up ${money(m.ppp2 - m.ppp)} per partner a year, or ${money(m.profit2 - m.profit)} for the firm, and the stake is worth about ${money(m.firmValue / P)} per partner.`}
        >
          <div className="mt-8">
            <Waterfall
              steps={steps}
              label="Profit per partner and equity bridge"
              groups={groups}
              legend={[
                { kind: "step", label: "Added profit each year" },
                { kind: "equity", label: "Equity stake, illustrative" },
              ]}
            />
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
              { title: "Your law firm", body: "100% lawyer-owned. Clients, advice and fees stay here." },
              { title: "Your firm’s MSO", body: `Firm owns ${pct(A.own)}. Back office, docketing, IT and finance.` },
              {
                title: "Spaarke",
                body: `Funds the ${money(m.deploymentFunded)} deployment and runs the technology. Holds ${pct(1 - A.own)} of the MSO.`,
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
