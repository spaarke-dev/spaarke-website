"use client";

import { useMemo, type ReactNode } from "react";
import { estimate as copy } from "@/app/services/content";
import { ASSUMPTIONS as A, compute, type EstimateInputs } from "./model";
import { money, num, pct } from "./format";
import { Waterfall, type WaterfallStep } from "./Waterfall";
import { DETAILS_ANCHOR } from "./query";

/**
 * "How the estimate works" (handoff section 3, behind "See the details"):
 * the profit-per-partner bridge, today against with the MSO, the three
 * steps, the structure and the assumptions. Every figure follows the inputs.
 */
export function EstimateDetails({ inputs }: { inputs: EstimateInputs }) {
  const m = useMemo(() => compute(inputs), [inputs]);
  const P = inputs.partners;
  const d = copy.details;

  const steps: WaterfallStep[] = [
    { label: ["Today", ""], short: ["Today", ""], value: m.ppp, kind: "base" },
    { label: ["Lower", "MSO fee"], short: ["Lower", "fee"], value: m.feeSaving / P, kind: "step" },
    { label: ["MSO profit", "share"], short: ["MSO", "share"], value: m.share / P, kind: "step" },
    { label: ["New matters", "(freed time)"], short: ["New", "matters"], value: m.growthProfit / P, kind: "step" },
    { label: ["New client", "services"], short: ["New", "services"], value: m.svcProfit / P, kind: "step" },
    { label: ["With", "the MSO"], short: ["With", "MSO"], value: m.ppp2, kind: "total" },
  ];

  const rows: { label: string; today: ReactNode; mso: string; up?: boolean; total?: boolean }[] = [
    { label: "Revenue", today: money(m.revenue), mso: money(m.revenue2), up: true },
    { label: "Attorney and agent pay", today: money(m.comp), mso: money(m.comp) },
    { label: "Operating cost", today: money(m.opex), mso: money(m.opex2), up: true },
    { label: "Cost of new work", today: <Muted>-</Muted>, mso: money(m.newWorkCost) },
    { label: "MSO profit to the firm", today: <Muted>-</Muted>, mso: money(m.share), up: true },
    { label: "Partner profit", today: money(m.profit), mso: money(m.profit2), up: true, total: true },
    { label: "Profit margin", today: pct(m.margin), mso: pct(m.margin2), up: true },
    { label: "Profit per partner", today: money(m.ppp), mso: money(m.ppp2), up: true },
    { label: "Firm’s equity it can sell", today: <Muted>Little</Muted>, mso: money(m.firmValue), up: true },
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
    ["MSO fee", `Fixed, ${pct(A.feeDiscount)} below today’s cost, set by a fair-market-value study. Never a share of legal fees.`],
    ["Deployment", `Platform deployment and standard migration worth about ${pct(A.deployment)} of the MSO’s cost base, funded by Spaarke in return for its ${pct(1 - A.own)} stake`],
    ["Freed lawyer time", `${pct(A.timeFreed)} of ${num(A.hoursPerLawyer)} hours a year per lawyer, with ${pct(A.redeploy)} used for new matters at ${pct(A.growthFlow)} profit flow-through`],
    ["New client services", `${pct(A.newSvc)} of revenue at a ${pct(A.newSvcMargin)} margin`],
    ["MSO value", `${A.multiple}x annual MSO profit standalone. ${A.platformMultiple}x is an illustrative platform multiple for the roll-up option at exit.`],
  ];

  return (
    <section id={DETAILS_ANCHOR} aria-labelledby={`${DETAILS_ANCHOR}-title`} className="scroll-mt-24">
      <h2
        id={`${DETAILS_ANCHOR}-title`}
        className="font-display text-fg text-[clamp(28px,3.4vw,40px)] font-medium tracking-[-0.02em]"
      >
        {d.title}
      </h2>

      <div className="mt-6 space-y-4">
        <Card tight title={d.bridgeTitle} caption={`Annual profit per partner, once the MSO is running. Up ${money(m.ppp2 - m.ppp)} per partner, or ${money(m.profit2 - m.profit)} for the firm.`}>
          <div className="mt-8">
            <Waterfall steps={steps} label="Profit per partner bridge" />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title={d.tableTitle} caption={d.tableCaption}>
            <table className="mt-5 w-full text-[14px] tabular-nums">
              <thead>
                <tr className="text-fg-low font-mono-display text-[10px] uppercase tracking-[0.14em]">
                  <th scope="col" className="pb-2 text-left font-normal">
                    <span className="sr-only">Line</span>
                  </th>
                  <th scope="col" className="pb-2 text-right font-normal">Today</th>
                  <th scope="col" className="pb-2 pl-3 text-right font-normal text-[#3F5FD9]">With MSO</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className={r.total ? "border-fg/40 border-t font-semibold" : "border-line border-t"}>
                    <th scope="row" className="text-fg py-2.5 pr-3 text-left font-normal">
                      {r.total ? <b className="font-semibold">{r.label}</b> : r.label}
                    </th>
                    <td className="text-fg-mid py-2.5 text-right">{r.today}</td>
                    <td className={`py-2.5 pl-3 text-right font-medium ${r.up ? "text-[#1F7A50]" : "text-fg"}`}>{r.mso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title={d.stepsTitle} caption={d.stepsCaption}>
            <ol className="mt-5 space-y-5">
              {d.steps.map((s, i) => (
                <li key={s} className="grid grid-cols-[32px_1fr] gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono-display flex h-8 w-8 items-center justify-center rounded-full bg-[#5078DC] text-[13px] text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-fg text-[16px] font-semibold">{s}</p>
                    <p className="text-fg-mid mt-1 text-[15px] leading-relaxed">{howItWorks[i]}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <Card title={d.structureTitle} caption={d.structureCaption}>
          <div className="mt-6 grid grid-cols-1 items-stretch gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-3">
            <Box title="Your law firm" body="100% lawyer-owned. Clients, advice and fees stay here." />
            <Arrow label={`Fixed fee ${money(m.fee)}`} />
            <Box title="Your firm’s MSO" body={`Firm owns ${pct(A.own)}. Back office, docketing, IT and finance.`} accent />
            <Arrow label="Platform license" />
            <Box
              title="Spaarke"
              body={`Funds the ${money(m.deploymentFunded)} deployment and runs the technology. Holds ${pct(1 - A.own)} of the MSO.`}
            />
          </div>
        </Card>

        <Card title={d.assumptionsTitle} caption={d.assumptionsCaption}>
          <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
            {assumptions.map(([k, v]) => (
              <li key={k} className="text-fg-mid text-[14px] leading-relaxed">
                <strong className="text-fg font-semibold">{k}:</strong> {v}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}

function Card({ title, caption, tight, children }: { title: string; caption: string; tight?: boolean; children: ReactNode }) {
  return (
    <div className={`border-line rounded-3xl border bg-white md:p-8 ${tight ? "px-3 py-6 sm:p-6" : "p-6"}`}>
      <h3 className="font-display text-fg text-[21px] font-medium tracking-[-0.01em]">{title}</h3>
      <p className="text-fg-mid mt-1.5 text-[14px] leading-relaxed">{caption}</p>
      {children}
    </div>
  );
}

function Box({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: accent ? "#EBF2FF" : "#f6f6f4",
        borderColor: accent ? "rgba(80,120,220,0.35)" : "rgba(10,10,10,0.1)",
      }}
    >
      <p className="text-fg text-[16px] font-semibold">{title}</p>
      <p className="text-fg-mid mt-1.5 text-[14px] leading-relaxed">{body}</p>
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="text-fg-mid flex items-center justify-center gap-2 py-1 text-[13px] md:flex-col md:px-1 md:py-0">
      <span className="text-center font-medium tabular-nums md:max-w-[110px]">{label}</span>
      <span aria-hidden="true" className="text-[18px] text-[#5078DC]">
        <span className="md:hidden">↓</span>
        <span className="hidden md:inline">→</span>
      </span>
    </div>
  );
}

function Muted({ children }: { children: ReactNode }) {
  return <span className="text-fg-low">{children}</span>;
}

