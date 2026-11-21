"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/primitives";
import { useAudience } from "../audience";
import { CORP_DEFAULTS, CORP_LABELS, FIRM_DEFAULTS, FIRM_LABELS, ILLUSTRATIVE_NOTE } from "./defaults";
import {
  CORP_FUNCTIONS,
  FIRM_FUNCTIONS,
  computeCorporate,
  computeFirm,
  type CorpInputs,
  type FirmInputs,
} from "./model";
import { Sankey, money } from "./Sankey";
import { corporateSankey, firmSankey } from "./sankeyData";

/**
 * The financial opportunity calculator (design.md section 7), ported from
 * the prototype. The model, defaults and Sankey mapping are unchanged; this
 * file only restyles the controls and results for the site.
 *
 * Guardrails kept from the prototype: there is no input for a fee as a share
 * of revenue, legal fees or profit, and the illustrative note sits beside the
 * numbers. Defaults are placeholders until finance sets them.
 */

const pct = (v: number, d = 0) => `${(v * 100).toFixed(d)}%`;
const signed = (v: number) => `${v >= 0 ? "+" : "-"}${money(Math.abs(v))}`;

function Slider(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={props.id} className="text-fg flex items-baseline justify-between gap-3 text-[14px] font-medium">
        <span>{props.label}</span>
        <output htmlFor={props.id} className="font-mono-display shrink-0 text-[13px] tabular-nums text-[#3F5FD9]">
          {props.display}
        </output>
      </label>
      <input
        id={props.id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer accent-[#5078DC]"
      />
      {props.hint ? <p className="text-fg-low mt-1 text-[12px]">{props.hint}</p> : null}
    </div>
  );
}

function Chips<T extends string>(props: {
  legend: string;
  options: readonly T[];
  labels: Record<string, string>;
  value: Record<T, boolean>;
  onChange: (v: Record<T, boolean>) => void;
}) {
  return (
    <fieldset>
      <legend className="text-fg mb-2 text-[14px] font-medium">{props.legend}</legend>
      <div className="flex flex-wrap gap-2">
        {props.options.map((f) => {
          const on = props.value[f];
          return (
            <label
              key={f}
              className="font-body inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-[13px] transition-colors focus-within:ring-2 focus-within:ring-[#5078DC] focus-within:ring-offset-1"
              style={
                on
                  ? { backgroundColor: "#5078DC", borderColor: "#5078DC", color: "#ffffff" }
                  : { backgroundColor: "#ffffff", borderColor: "rgba(10,10,10,0.16)", color: "#0a0a0a" }
              }
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={on}
                onChange={(e) => props.onChange({ ...props.value, [f]: e.target.checked })}
              />
              {props.labels[f]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Kpi(props: { label: string; value: string; was?: string; delta?: string; good?: boolean | null }) {
  const deltaColor = props.good === true ? "#1F7A50" : props.good === false ? "#B3412E" : "rgba(10,10,10,0.6)";
  return (
    <div className="border-line rounded-2xl border bg-white p-4">
      <p className="font-mono-display text-fg-low text-[10px] uppercase tracking-[0.14em]">{props.label}</p>
      <p className="font-display text-fg mt-2 text-[26px] font-medium leading-none tabular-nums tracking-tight">
        {props.value}
      </p>
      {props.was ? <p className="text-fg-low mt-2 text-[12px] tabular-nums">Today: {props.was}</p> : null}
      {props.delta ? (
        <p className="mt-0.5 text-[13px] font-semibold tabular-nums" style={{ color: deltaColor }}>
          {props.delta}
        </p>
      ) : null}
    </div>
  );
}

function Layout(props: { controls: ReactNode; sankey: ReactNode; kpis: ReactNode; note: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
      <div className="border-line space-y-6 rounded-3xl border bg-white p-6">
        <p className="font-mono-display inline-block rounded-full bg-[rgba(80,120,220,0.12)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#3F5FD9]">
          Illustrative
        </p>
        {props.controls}
      </div>
      <div className="min-w-0">
        <div className="border-line rounded-3xl border bg-white p-4 md:p-6">{props.sankey}</div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">{props.kpis}</div>
        <div className="text-fg-mid mt-4 space-y-2 text-[14px] leading-relaxed">{props.note}</div>
        <p className="text-fg-low mt-3 text-[12px] leading-relaxed">{ILLUSTRATIVE_NOTE}</p>
      </div>
    </div>
  );
}

function FirmCalculator() {
  const [inp, setInp] = useState<FirmInputs>(FIRM_DEFAULTS);
  const r = useMemo(() => computeFirm(inp), [inp]);
  const data = useMemo(() => firmSankey(r), [r]);
  const set = <K extends keyof FirmInputs>(k: K, v: FirmInputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  return (
    <Layout
      controls={
        <>
          <Slider
            id="f-rev"
            label="Annual revenue"
            value={inp.revenue}
            min={5_000_000}
            max={100_000_000}
            step={1_000_000}
            display={money(inp.revenue)}
            onChange={(v) => set("revenue", v)}
          />
          <Slider
            id="f-adv"
            label="MSO unit price below your internal cost"
            value={inp.priceAdvantage}
            min={0}
            max={0.4}
            step={0.01}
            display={pct(inp.priceAdvantage)}
            onChange={(v) => set("priceAdvantage", v)}
            hint="Placeholder range."
          />
          <Slider
            id="f-press"
            label="Fee pressure scenario"
            value={inp.feePressure}
            min={0}
            max={0.2}
            step={0.01}
            display={inp.feePressure === 0 ? "None" : `-${pct(inp.feePressure)} revenue`}
            onChange={(v) => set("feePressure", v)}
            hint="Applied equally with and without the MSO."
          />
          <Chips
            legend="Functions delivered by the MSO"
            options={FIRM_FUNCTIONS}
            labels={FIRM_LABELS}
            value={inp.moved}
            onChange={(v) => set("moved", v)}
          />
        </>
      }
      sankey={<Sankey data={data} ariaLabel="Where revenue goes, with the selected functions delivered by an MSO" />}
      kpis={
        <>
          <Kpi label="Revenue" value={money(r.withMlo.revenue)} />
          <Kpi
            label="Operating expense"
            value={money(r.withMlo.opex)}
            was={money(r.baseline.opex)}
            delta={signed(r.delta.opex)}
            good={r.delta.opex <= 0}
          />
          <Kpi
            label="Capital spend"
            value={money(r.withMlo.capex)}
            was={money(r.baseline.capex)}
            delta={signed(r.delta.capex)}
            good={r.delta.capex <= 0}
          />
          <Kpi
            label="Distributable profit"
            value={money(r.withMlo.profit)}
            was={money(r.baseline.profit)}
            delta={`${signed(r.delta.profit)} (${pct(r.delta.profitPct)})`}
            good={r.delta.profit >= 0}
          />
          <Kpi label="Profit margin" value={pct(r.withMlo.margin, 1)} was={pct(r.baseline.margin, 1)} />
        </>
      }
      note={
        <>
          {r.underwater ? (
            <p className="font-semibold text-[#B3412E]">
              In this scenario costs exceed revenue. Profit is shown as zero in the diagram.
            </p>
          ) : null}
          <p>
            Technology moves from a capital project to a
            predictable operating cost. One-time transition cost: {money(r.transitionCost)}; year-one profit after
            transition: {money(r.yearOneProfit)}.
          </p>
        </>
      }
    />
  );
}

function CorporateCalculator() {
  const [inp, setInp] = useState<CorpInputs>(CORP_DEFAULTS);
  const r = useMemo(() => computeCorporate(inp), [inp]);
  const data = useMemo(() => corporateSankey(r), [r]);
  const set = <K extends keyof CorpInputs>(k: K, v: CorpInputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  return (
    <Layout
      controls={
        <>
          <Slider
            id="c-budget"
            label="Annual legal operating budget"
            value={inp.budget}
            min={2_000_000}
            max={150_000_000}
            step={1_000_000}
            display={money(inp.budget)}
            onChange={(v) => set("budget", v)}
          />
          <Slider
            id="c-shift"
            label="Routine outside counsel work the MSO can handle"
            value={inp.shiftedShare}
            min={0}
            max={0.3}
            step={0.01}
            display={pct(inp.shiftedShare)}
            onChange={(v) => set("shiftedShare", v)}
          />
          <Slider
            id="c-adv"
            label="MSO unit price below your internal cost"
            value={inp.priceAdvantage}
            min={0}
            max={0.4}
            step={0.01}
            display={pct(inp.priceAdvantage)}
            onChange={(v) => set("priceAdvantage", v)}
            hint="Placeholder range."
          />
          <Slider
            id="c-matters"
            label="Matters per year"
            value={inp.matterCount}
            min={100}
            max={10000}
            step={100}
            display={inp.matterCount.toLocaleString("en-US")}
            onChange={(v) => set("matterCount", v)}
          />
          <Chips
            legend="Functions delivered by the MSO"
            options={CORP_FUNCTIONS}
            labels={CORP_LABELS}
            value={inp.moved}
            onChange={(v) => set("moved", v)}
          />
        </>
      }
      sankey={
        <Sankey data={data} ariaLabel="Where the legal budget goes, with the selected functions delivered by an MSO" />
      }
      kpis={
        <>
          <Kpi
            label="Total cost of legal"
            value={money(r.withMloTotal)}
            was={money(r.baselineTotal)}
            delta={`${signed(-r.savings)} (${pct(-r.savingsPct, 1)})`}
            good={r.savings >= 0}
          />
          <Kpi
            label="Outside counsel spend"
            value={money(r.outsideWithMlo)}
            was={money(r.outsideBaseline)}
            delta={signed(r.outsideWithMlo - r.outsideBaseline)}
            good
          />
          <Kpi
            label="Capital spend"
            value={money(r.capexWithMlo)}
            was={money(r.capexBaseline)}
            delta={signed(r.capexWithMlo - r.capexBaseline)}
            good={r.capexWithMlo <= r.capexBaseline}
          />
          <Kpi
            label="Cost per matter"
            value={money(r.costPerMatterWithMlo)}
            was={money(r.costPerMatterBaseline)}
          />
        </>
      }
      note={
        <p>
          Savings are the part of today&rsquo;s spend that is no longer needed. Corporate arrangements have no
          ownership or equity element.
        </p>
      }
    />
  );
}

/** Law firm and corporate calculators share one frame and flip with the page-wide switch. */
export function Calculator({ cta }: { cta: { label: string; href: string } }) {
  const { audience } = useAudience();
  return (
    <div>
      {audience === "firm" ? <FirmCalculator key="firm" /> : <CorporateCalculator key="corporate" />}
      <div className="mt-8">
        <Button variant="primary" href={cta.href} arrow>
          {cta.label}
        </Button>
      </div>
    </div>
  );
}
