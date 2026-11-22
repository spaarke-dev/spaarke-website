"use client";

import { useMemo } from "react";
import { deptEstimate as copy } from "@/app/services/content";
import {
  DEPT_ASSUMPTIONS as A,
  DEPT_PRESETS,
  DEPT_RANGES,
  budgetBounds,
  computeDept,
  matchDeptPreset,
  type DeptInputs,
  type DeptPresetKey,
} from "./dept-model";
import { money, num, pct } from "./format";
import { Disclaimer, InputsCard, Objectives, Slider, SummaryBar, type Objective } from "./parts";

/**
 * The legal department MSO value estimate's main section (task 071): the
 * corporate equivalent of EstimateCalculator, with department-size presets,
 * three sliders, three objective cards, a summary bar and the disclaimer.
 * No equity figures (design.md section 9).
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

  const set = (k: keyof DeptInputs, v: number) => {
    const next = { ...inputs, [k]: v };
    const b = budgetBounds(next.lawyers, next.staff);
    next.budget = Math.min(Math.max(next.budget, b.min), b.max);
    onChange(next);
  };

  const [o1, o2, o3] = copy.objectives;
  const objectives: Objective[] = [
    {
      ...o1,
      big: `-${pct(m.savingPct)}`,
      cap: "total cost of legal",
      facts: [
        [`${money(m.feeSaving)} a year`, "saved on day one through a fixed fee below today’s cost"],
        [`${money(m.outside - m.outside2)} a year`, "less spent on outside counsel"],
        [`${money(m.saving)} a year`, `saved in all, ${money(m.budget)} to ${money(m.total2)}`],
      ],
    },
    {
      ...o2,
      big: num(m.hoursFreed),
      cap: "lawyer hours freed a year",
      facts: [
        [money(m.insourced), "of routine outside counsel work brought back in-house with the freed time"],
        [money(m.routineMoved), `of routine work handled by the MSO at about ${pct(A.routineCost)} of its outside cost`],
        ["Kept current", "platform upgrades included, with a market-parity commitment"],
      ],
    },
    {
      ...o3,
      big: money(m.savingYears),
      cap: `saved over ${A.years} years`,
      facts: [
        [money(m.deploymentFunded), "AI platform and migration funded by Spaarke, not the department"],
        [`${money(m.fee)} a year`, "fixed fee, agreed in advance, so the budget is predictable"],
        ["$0", "capital invested by the department"],
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <InputsCard
        label="Your department"
        presetsLabel={copy.presetsLabel}
        presets={copy.presets}
        active={matchDeptPreset(inputs)}
        onPreset={(k) => onChange({ ...DEPT_PRESETS[k as DeptPresetKey] })}
      >
        <Slider
          id="dept-lawyers"
          label={copy.fields.lawyers}
          value={inputs.lawyers}
          {...DEPT_RANGES.lawyers}
          display={String(inputs.lawyers)}
          onChange={(v) => set("lawyers", v)}
        />
        <Slider
          id="dept-staff"
          label={copy.fields.staff}
          value={inputs.staff}
          {...DEPT_RANGES.staff}
          display={String(inputs.staff)}
          onChange={(v) => set("staff", v)}
        />
        <Slider
          id="dept-budget"
          label={copy.fields.budget}
          value={inputs.budget}
          min={bounds.min}
          max={bounds.max}
          step={DEPT_RANGES.budget.step}
          display={money(inputs.budget)}
          onChange={(v) => set("budget", v)}
        />
      </InputsCard>

      <Objectives items={objectives} label="What the MSO means for this department" />

      <SummaryBar cta={copy.detailsCta} href={detailsHref} scroll={detailsScroll}>
        For a department like this, the total cost of legal falls by about{" "}
        <b className="font-semibold">{money(m.saving)} a year</b>, about{" "}
        <b className="font-semibold">{money(m.savingYears)}</b> over {A.years} years, and lawyers get back about{" "}
        {num(m.hoursFreed)} hours a year without any capital spend.
      </SummaryBar>

      <Disclaimer>{copy.disclaimer}</Disclaimer>
    </div>
  );
}
