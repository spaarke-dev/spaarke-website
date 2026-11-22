"use client";

import { useMemo } from "react";
import { estimate as copy } from "@/app/services/content";
import { ASSUMPTIONS as A, INPUT_RANGES, PRESETS, compute, matchPreset, revenueBounds, type EstimateInputs, type PresetKey } from "./model";
import { money, num, pct } from "./format";
import { Disclaimer, InputsCard, Objectives, Slider, SummaryBar, type Objective } from "./parts";

/**
 * The law firm MSO value estimate's main section (handoff section 3):
 * firm-size presets, three sliders, three objective cards, a summary bar with
 * "See the details", and the disclaimer. Controlled: the parent owns the
 * inputs. Used on /services (law firm view) and on /services/estimate.
 */
export function EstimateCalculator({
  inputs,
  onChange,
  detailsHref,
  detailsScroll = true,
}: {
  inputs: EstimateInputs;
  onChange: (v: EstimateInputs) => void;
  detailsHref: string;
  /** False when the link opens the details as a modal over this page. */
  detailsScroll?: boolean;
}) {
  const m = useMemo(() => compute(inputs), [inputs]);
  const bounds = revenueBounds(inputs.partners, inputs.attorneys);

  const set = (k: keyof EstimateInputs, v: number) => {
    const next = { ...inputs, [k]: v };
    const b = revenueBounds(next.partners, next.attorneys);
    next.revenue = Math.min(Math.max(next.revenue, b.min), b.max);
    onChange(next);
  };

  // Change list 2026-11-22, rows 27 to 32. Card 1 leads with dollars saved;
  // margin and profit per partner are out. The formulas are the current
  // model's until the rebuilt calculator lands (rows 28 and 33).
  const [o1, o2, o3] = copy.objectives;
  const objectives: Objective[] = [
    {
      ...o1,
      big: money(m.feeSaving),
      cap: "saved a year on the work that moves to the MSO",
      facts: [
        [pct(m.msoCostReduction), "lower cost to run the back office"],
        [`${pct(A.feeDiscount)} below today’s cost`, "a fixed or per-unit fee, benchmarked to fair market value"],
      ],
    },
    {
      ...o2,
      big: num(m.hoursFreed),
      cap: `lawyer hours freed a year (assumes ${num(A.hoursPerLawyer * A.timeFreed)} hours per lawyer)`,
      facts: [
        [money(m.deploymentFunded), "AI platform and migration funded by Spaarke, not the firm"],
        ["Kept current", "Technology upgrades included at no extra charge"],
      ],
    },
    { ...o3, bullets: copy.equity.bullets, link: copy.equity.link },
  ];

  return (
    <div className="space-y-4">
      <InputsCard
        label="Your firm"
        presetsLabel={copy.presetsLabel}
        presets={copy.presets}
        active={matchPreset(inputs)}
        onPreset={(k) => onChange({ ...PRESETS[k as PresetKey] })}
      >
        <Slider
          id="est-partners"
          label={copy.fields.partners}
          value={inputs.partners}
          {...INPUT_RANGES.partners}
          display={String(inputs.partners)}
          onChange={(v) => set("partners", v)}
        />
        <Slider
          id="est-attorneys"
          label={copy.fields.attorneys}
          value={inputs.attorneys}
          {...INPUT_RANGES.attorneys}
          display={String(inputs.attorneys)}
          onChange={(v) => set("attorneys", v)}
        />
        <Slider
          id="est-revenue"
          label={copy.fields.revenue}
          value={inputs.revenue}
          min={bounds.min}
          max={bounds.max}
          step={INPUT_RANGES.revenue.step}
          display={money(inputs.revenue)}
          onChange={(v) => set("revenue", v)}
        />
      </InputsCard>

      <Objectives items={objectives} label="What the MSO means for this firm" />

      {/* Row 33: no equity figure. */}
      <SummaryBar cta={copy.detailsCta} href={detailsHref} scroll={detailsScroll}>
        About <b className="font-semibold">{money(m.feeSaving)} a year</b> {copy.summary}
      </SummaryBar>

      <Disclaimer>{copy.disclaimer}</Disclaimer>
    </div>
  );
}
