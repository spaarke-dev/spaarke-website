"use client";

import { useMemo } from "react";
import { estimate as copy } from "@/app/services/content";
import { ASSUMPTIONS as A, INPUT_RANGES, PRESETS, compute, matchPreset, revenueBounds, type EstimateInputs, type PresetKey } from "./model";
import { chg, money, num, pct } from "./format";
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

  const [o1, o2, o3] = copy.objectives;
  const objectives: Objective[] = [
    {
      ...o1,
      big: `${pct(m.margin)} → ${pct(m.margin2)}`,
      cap: "profit margin",
      facts: [
        [pct(m.msoCostReduction), "lower cost to run the back office"],
        [`${money(m.feeSaving)} a year`, "saved on day one through a fixed fee below today’s cost"],
        [chg(m.ppp2, m.ppp), `profit per partner, ${money(m.ppp)} to ${money(m.ppp2)}`],
      ],
    },
    {
      ...o2,
      big: num(m.hoursFreed),
      cap: "lawyer hours freed a year",
      facts: [
        [money(m.deploymentFunded), "AI platform and migration funded by Spaarke, not the firm"],
        [`${chg(m.revenue2, m.revenue)} revenue`, `${money(m.revenue2 - m.revenue)} from new matters and new client services`],
        ["Kept current", "platform upgrades included, with a market-parity commitment"],
      ],
    },
    {
      ...o3,
      big: money(m.firmValue),
      cap: "equity stake in your MSO",
      facts: [
        [`${money(m.share)} a year`, `the firm’s ${pct(A.own)} share of MSO profit`],
        [`Up to ${money(m.firmValuePlatform)}`, `if the stake rolls into the Spaarke platform at ${A.platformMultiple}x`],
        ["$0", "cash invested by the firm"],
      ],
    },
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

      <SummaryBar cta={copy.detailsCta} href={detailsHref} scroll={detailsScroll}>
        For a firm like this, partner profit rises by about{" "}
        <b className="font-semibold">{money(m.profit2 - m.profit)} a year</b>, and the firm builds an equity stake worth
        about <b className="font-semibold">{money(m.firmValue)}</b> without putting in any cash.
      </SummaryBar>

      <Disclaimer>{copy.disclaimer}</Disclaimer>
    </div>
  );
}
