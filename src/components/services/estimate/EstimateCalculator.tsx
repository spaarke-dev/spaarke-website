"use client";

import { useId, useMemo, useState } from "react";
import { estimate as copy } from "@/app/services/content";
import {
  ADJUSTABLE,
  ADJUSTABLE_DEFAULTS,
  INPUT_RANGES,
  PRESETS,
  compute,
  matchPreset,
  maxFeeDiscount,
  normalize,
  revenueBounds,
  type AdjustableKey,
  type EstimateInputs,
  type FirmSize,
  type PresetKey,
} from "./model";
import { money, num, pct } from "./format";
import { Disclaimer, InputsCard, MUTED, Objectives, Slider, SummaryBar, Toggle, type Objective } from "./parts";

/**
 * The law firm MSO value estimate's main section (handoff section 3, reworked
 * to the owner's value page change list, 2026-11-22): firm-size presets and
 * sliders, the capacity upside switch (off by default) and the editable
 * assumptions, three objective cards, a summary bar with "See the details",
 * and the disclaimer. Controlled: the parent owns the inputs. Used on
 * /services (law firm view) and on /services/estimate. Every figure comes
 * from compute(); none is written into the copy.
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
  const [open, setOpen] = useState(false);
  const panel = useId();

  // normalize keeps the revenue inside the headcount's bounds and the fee
  // discount inside what the efficiency pays for.
  const set = (next: Partial<EstimateInputs>) => onChange(normalize({ ...inputs, ...next }));
  const custom = (Object.keys(ADJUSTABLE) as AdjustableKey[]).some((k) => inputs[k] !== ADJUSTABLE_DEFAULTS[k]);

  // Value page rows 9 to 11: card 1 drops the MSO's own cost reduction, card
  // 2 drops the deployment figure, and the upside shows only when it is on.
  const [o1, o2, o3] = copy.objectives;
  const objectives: Objective[] = [
    {
      ...o1,
      big: money(m.feeSaving),
      cap: "saved a year on the work that moves to the MSO",
      facts: [
        [`${pct(m.feeDiscount)} below today’s cost`, "a fixed or per-unit fee, benchmarked to fair market value"],
        [`${money(m.fiveYearSaving)} over five years`, `as the fee falls ${pct(inputs.glide, 1)} a year with productivity`],
      ],
    },
    {
      ...o2,
      big: num(m.hoursFreed),
      cap: `lawyer hours freed a year (assumes ${num(m.hoursPerLawyerFreed)} hours per lawyer)`,
      facts: [
        ["Funded by Spaarke", "AI platform and migration"],
        ["Kept current", "Technology upgrades included at no extra charge"],
        ...(inputs.upside
          ? ([[`+${money(m.upsideProfit)} a year`, "capacity upside from new matters and new client services (an assumption)"]] as [string, string][])
          : []),
      ],
    },
    { ...o3, bullets: copy.equity.bullets, link: copy.equity.link },
  ];

  const fmt = (k: AdjustableKey, v: number) => pct(v, k === "glide" ? 1 : 0);
  const capped = maxFeeDiscount(inputs.efficiency);

  return (
    <div className="space-y-4">
      <InputsCard
        label="Your firm"
        presetsLabel={copy.presetsLabel}
        presets={copy.presets}
        active={matchPreset(inputs)}
        onPreset={(k) => set({ ...PRESETS[k as PresetKey] })}
        after={
          <div className="border-line mt-7 border-t pt-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <Toggle
                id="est-upside"
                label={copy.upside.label}
                note={copy.upside.note}
                checked={inputs.upside}
                onChange={(v) => set({ upside: v })}
              />
              <div className="flex shrink-0 items-center gap-4">
                {custom ? (
                  <button
                    type="button"
                    onClick={() => set(ADJUSTABLE_DEFAULTS)}
                    className={`${MUTED} text-[14px] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]`}
                  >
                    {copy.assumptionsToggle.reset}
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panel}
                  onClick={() => setOpen(!open)}
                  className="border-line-strong text-fg rounded-full border px-4 py-2 text-[14px] font-medium transition-colors hover:border-[#5078DC] hover:text-[#3F5FD9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]"
                >
                  {open ? copy.assumptionsToggle.close : copy.assumptionsToggle.open}
                </button>
              </div>
            </div>
            <div id={panel} hidden={!open} className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {(Object.keys(ADJUSTABLE) as AdjustableKey[]).map((k) => (
                  <Slider
                    key={k}
                    id={`est-${k}`}
                    label={copy.adjustable[k]}
                    value={inputs[k]}
                    {...ADJUSTABLE[k]}
                    max={k === "feeDiscount" ? capped : ADJUSTABLE[k].max}
                    display={fmt(k, inputs[k])}
                    onChange={(v) => set({ [k]: v })}
                  />
                ))}
              </div>
              <p className={`${MUTED} mt-4 text-[13px]`}>{copy.capNote}</p>
            </div>
          </div>
        }
      >
        {(["partners", "attorneys"] as (keyof FirmSize)[]).map((k) => (
          <Slider
            key={k}
            id={`est-${k}`}
            label={copy.fields[k]}
            value={inputs[k]}
            {...INPUT_RANGES[k]}
            display={String(inputs[k])}
            onChange={(v) => set({ [k]: v })}
          />
        ))}
        <Slider
          id="est-revenue"
          label={copy.fields.revenue}
          value={inputs.revenue}
          min={bounds.min}
          max={bounds.max}
          step={INPUT_RANGES.revenue.step}
          display={money(inputs.revenue)}
          onChange={(v) => set({ revenue: v })}
        />
      </InputsCard>

      <Objectives items={objectives} label="What the MSO means for this firm" />

      {/* Value page row 11 and change list row 33: no equity figure; the upside only when on. */}
      <SummaryBar cta={copy.detailsCta} href={detailsHref} scroll={detailsScroll}>
        About <b className="font-semibold">{money(m.feeSaving)} a year</b> {copy.summary.base}
        {inputs.upside ? (
          <>
            {" "}
            {copy.summary.upside[0]} <b className="font-semibold">{money(m.profit2 - m.profit)}</b>{" "}
            {copy.summary.upside[1]}
          </>
        ) : null}
      </SummaryBar>

      <Disclaimer>{copy.disclaimer}</Disclaimer>
    </div>
  );
}
