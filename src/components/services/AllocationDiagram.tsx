"use client";

import type { ReactNode } from "react";
import {
  ArrowDown16Regular,
  ArrowUp16Regular,
  Briefcase24Regular,
  Building24Regular,
  Calculator24Regular,
  DataBarVertical24Regular,
  DataPie24Regular,
  DocumentSignature28Regular,
  DocumentText24Regular,
  Flow24Regular,
  Gavel24Regular,
  Handshake24Regular,
  LockClosed24Regular,
  Megaphone24Regular,
  People24Regular,
  PeopleTeam24Regular,
  PersonAdd24Regular,
  PersonSupport24Regular,
  Receipt24Regular,
  Server24Regular,
  Signature24Regular,
  Sparkle24Regular,
  Wallet24Regular,
} from "@fluentui/react-icons";
import { howItWorks, type AllocationItem } from "@/app/services/content";
import { useAudience } from "./audience";

/**
 * Functional allocation diagram (design.md 4.4 and 6.1), reworked in review
 * round 3 (2026-11-21) for a dark band:
 *  - the client panel on top and the Management Services Organization below,
 *    the same size (equal grid rows);
 *  - each function is a row with an icon, its name and a one-line
 *    explanation, instead of pill tags that read like buttons;
 *  - the services agreement between them is a labeled block, with services
 *    flowing up to the client and a cost-based fee flowing down to the MSO;
 *  - no build animation and no hover state: everything is visible at once.
 */

const ICONS: Record<string, ReactNode> = {
  // Law firm keeps
  "Partners and associates": <Briefcase24Regular />,
  "Client relationships": <Handshake24Regular />,
  "Client data": <LockClosed24Regular />,
  "Billings and revenue": <Receipt24Regular />,
  "Partner and professional compensation": <Wallet24Regular />,
  // Legal department keeps
  "Lawyers and privileged work": <Briefcase24Regular />,
  "Legal strategy": <Gavel24Regular />,
  "Outside counsel relationships": <Handshake24Regular />,
  "Company data": <LockClosed24Regular />,
  "Decisions and sign-off": <Signature24Regular />,
  // MSO takes on (law firm)
  "Non-attorney staff": <People24Regular />,
  "Technical staff": <PersonSupport24Regular />,
  "IT systems": <Server24Regular />,
  "Accounting and finance": <Calculator24Regular />,
  Marketing: <Megaphone24Regular />,
  "HR and talent": <PersonAdd24Regular />,
  "Facilities and vendors": <Building24Regular />,
  "Legal technology and AI": <Sparkle24Regular />,
  // MSO takes on (legal department)
  "Legal operations": <Flow24Regular />,
  "Matter and spend management": <DataBarVertical24Regular />,
  "Contract operations": <DocumentText24Regular />,
  "Vendor and panel management": <PeopleTeam24Regular />,
  "Technology and AI platform": <Sparkle24Regular />,
  "Reporting and benchmarking": <DataPie24Regular />,
};

export function AllocationDiagram() {
  const { audience } = useAudience();
  const keeps = howItWorks.keeps[audience];
  const takes = howItWorks.takes[audience];
  const sides = howItWorks.sideLabel[audience];

  return (
    // Equal 1fr rows keep both panels the height of the taller one.
    <div className="grid" style={{ gridTemplateRows: "1fr auto 1fr" }}>
      <Panel title={sides.client} subtitle={keeps.title} items={keeps.items} tone="client" />
      <Agreement client={sides.client} />
      <Panel title={sides.mso} subtitle={takes.title} items={takes.items} tone="operator" />
    </div>
  );
}

function Agreement({ client }: { client: string }) {
  const side = "font-mono-display hidden items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.7)] md:flex";
  return (
    <div className="relative grid grid-cols-1 items-center py-8 md:grid-cols-[1fr_auto_1fr] md:gap-8">
      {/* The spine joining the two panels. */}
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(130,165,235,0.5)]" />
      <p className={`${side} justify-end`}>
        <ArrowUp16Regular aria-hidden="true" className="text-[#82A5EB]" />
        Services to the {client.toLowerCase()}
      </p>
      <div className="relative mx-auto flex items-center gap-4 rounded-2xl border border-[rgba(130,165,235,0.55)] bg-[#0f1424] px-6 py-4 shadow-[0_0_40px_rgba(80,120,220,0.25)]">
        <span aria-hidden="true" className="text-[#82A5EB]">
          <DocumentSignature28Regular />
        </span>
        <div>
          <p className="font-display text-fg text-[clamp(20px,1.8vw,26px)] font-medium leading-tight tracking-[-0.01em]">
            Services agreement
          </p>
          <p className="text-fg-mid mt-0.5 text-[13px]">Fee set by the cost of the services, never by legal fees</p>
        </div>
      </div>
      <p className={side}>
        <ArrowDown16Regular aria-hidden="true" className="text-[#82A5EB]" />
        Cost-based fee to the MSO
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  items,
  tone,
}: {
  title: string;
  subtitle: string;
  items: AllocationItem[];
  tone: "client" | "operator";
}) {
  const operator = tone === "operator";
  return (
    <div
      className="rounded-3xl border p-6 md:p-8"
      style={{
        backgroundColor: operator ? "rgba(80, 120, 220, 0.14)" : "rgba(255, 255, 255, 0.04)",
        borderColor: operator ? "rgba(130, 165, 235, 0.5)" : "rgba(255, 255, 255, 0.16)",
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-display text-fg text-[clamp(22px,2vw,28px)] font-medium tracking-[-0.01em]">{title}</p>
        <p
          className="font-mono-display text-[11px] uppercase tracking-[0.16em]"
          style={{ color: operator ? "#82A5EB" : "rgba(255,255,255,0.55)" }}
        >
          {subtitle}
        </p>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.label} className="flex gap-3 border-t border-[rgba(255,255,255,0.1)] pt-4">
            <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: operator ? "#82A5EB" : "rgba(255,255,255,0.7)" }}>
              {ICONS[item.label] ?? <Briefcase24Regular />}
            </span>
            <div className="min-w-0">
              <p className="text-fg text-[15px] font-medium leading-snug">{item.label}</p>
              <p className="text-fg-mid mt-1 text-[13px] leading-relaxed">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * "Every structure is tailored": three illustrative clients and the services
 * each chose. Hidden from the page in review round 2; kept for task 060.
 */
export function ServiceMenu() {
  const { audience } = useAudience();
  const services = howItWorks.takes[audience].items.map((i) => i.label);
  const examples = howItWorks.tailored.examples[audience];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[300px] border-collapse text-left">
        <caption className="sr-only">Services chosen by three illustrative clients</caption>
        <thead>
          <tr>
            <th scope="col" className="font-mono-display text-fg-low pb-3 text-[11px] font-normal uppercase tracking-[0.14em]">
              Service
            </th>
            {examples.map((e) => (
              <th
                key={e.name}
                scope="col"
                className="font-mono-display text-fg-low pb-3 text-center text-[11px] font-normal uppercase tracking-[0.14em]"
              >
                {e.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s} className="border-t border-[rgba(10,10,10,0.08)]">
              <th scope="row" className="text-fg py-2 pr-4 text-[14px] font-normal">
                {s}
              </th>
              {examples.map((e) => {
                const on = e.chosen.includes(s);
                return (
                  <td key={e.name} className="py-2 text-center">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: on ? "#5078DC" : "transparent", border: on ? "none" : "1px solid rgba(10,10,10,0.2)" }}
                    />
                    <span className="sr-only">{on ? "Included" : "Not included"}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
