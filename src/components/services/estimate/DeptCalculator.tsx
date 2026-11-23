"use client";

import { useId, useMemo, useState } from "react";
import { deptEstimate as copy } from "@/app/services/content";
import { ADJUSTABLE, ADJUSTABLE_DEFAULTS, maxFeeDiscount, type AdjustableKey } from "./model";
import {
  DEPT_PRESETS,
  DEPT_RANGES,
  budgetBounds,
  computeDept,
  matchDeptPreset,
  normalizeDept,
  type DeptInputs,
  type DeptPresetKey,
  type DeptSize,
} from "./dept-model";
import { money, num, pct } from "./format";
import { Disclaimer, InputsCard, MUTED, Objectives, Slider, SummaryBar, Toggle, type Objective } from "./parts";

/**
 * The legal department MSO value estimate's main section (task 071): the
 * corporate equivalent of EstimateCalculator, reworked to its pattern on
 * 2026-11-22. Department-size presets and sliders, the capacity upside switch
 * (off by default) and the editable assumptions, three objective cards, a
 * summary bar with "See the details", and the disclaimer. No equity figures
 * (design.md section 9). Controlled: the parent owns the inputs.
 */
export function DeptCalculator({
  inputs,
  onChange,
  detailsHref,
  detailsScroll = true,
}: {
  inputs: DeptInputs;
  onChange: (v: DeptInputs) => void;
  detailsHref: string;
  /** False when the link opens the details as a modal over this page. */
  detailsScroll?: boolean;
}) {
  const m = useMemo(() => computeDept(inputs), [inputs]);
  const bounds = budgetBounds(inputs.lawyers, inputs.staff);
  const [open, setOpen] = useState(false);
  const panel = useId();

  // normalizeDept keeps the budget inside the team's bounds and the fee
  // discount inside what the efficiency pays for.
  const set = (next: Partial<DeptInputs>) => onChange(normalizeDept({ ...inputs, ...next }));
  const custom = (Object.keys(ADJUSTABLE) as AdjustableKey[]).some((k) => inputs[k] !== ADJUSTABLE_DEFAULTS[k]);

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
          ? ([[`${money(m.upsideSaving)} a year`, "less outside counsel spend from the capacity upside (an assumption)"]] as [string, string][])
          : []),
      ],
    },
    { ...o3, bullets: copy.lasting.bullets },
  ];

  const fmt = (k: AdjustableKey, v: number) => pct(v, k === "glide" ? 1 : 0);
  const capped = maxFeeDiscount(inputs.efficiency);

  return (
    <div className="space-y-4">
      <InputsCard
        label="Your department"
        presetsLabel={copy.presetsLabel}
        presets={copy.presets}
        active={matchDeptPreset(inputs)}
        onPreset={(k) => set({ ...DEPT_PRESETS[k as DeptPresetKey] })}
        after={
          <div className="border-line mt-7 border-t pt-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <Toggle
                id="dept-upside"
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
                    id={`dept-${k}`}
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
        {(["lawyers", "staff"] as (keyof DeptSize)[]).map((k) => (
          <Slider
            key={k}
            id={`dept-${k}`}
            label={copy.fields[k]}
            value={inputs[k]}
            {...DEPT_RANGES[k]}
            display={String(inputs[k])}
            onChange={(v) => set({ [k]: v })}
          />
        ))}
        <Slider
          id="dept-budget"
          label={copy.fields.budget}
          value={inputs.budget}
          min={bounds.min}
          max={bounds.max}
          step={DEPT_RANGES.budget.step}
          display={money(inputs.budget)}
          onChange={(v) => set({ budget: v })}
        />
      </InputsCard>

      <Objectives items={objectives} label="What the MSO means for this department" />

      <SummaryBar cta={copy.detailsCta} href={detailsHref} scroll={detailsScroll}>
        About <b className="font-semibold">{money(m.feeSaving)} a year</b> {copy.summary.base}
        {inputs.upside ? (
          <>
            {" "}
            {copy.summary.upside[0]} <b className="font-semibold">{money(m.saving)}</b> {copy.summary.upside[1]}
          </>
        ) : null}
      </SummaryBar>

      <Disclaimer>{copy.disclaimer}</Disclaimer>
    </div>
  );
}
