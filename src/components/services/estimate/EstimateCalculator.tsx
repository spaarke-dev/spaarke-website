"use client";

import Link from "next/link";
import { useMemo } from "react";
import { estimate as copy } from "@/app/services/content";
import { ASSUMPTIONS as A, INPUT_RANGES, PRESETS, compute, matchPreset, revenueBounds, type EstimateInputs } from "./model";
import { chg, money, num, pct } from "./format";

/**
 * The MSO value estimate's main section (handoff section 3): firm-size
 * presets, three sliders, three objective cards, a summary bar with "See the
 * details", and the disclaimer. Controlled: the parent owns the inputs.
 * Used on /services (law firm view) and on /services/estimate.
 */

const BTN =
  "inline-flex shrink-0 items-center gap-2 rounded-full bg-[#5078DC] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#3F5FD9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] focus-visible:ring-offset-2 motion-safe:hover:scale-[1.02]";

type Fact = [value: string, text: string];

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
  const active = matchPreset(inputs);

  const set = (k: keyof EstimateInputs, v: number) => {
    const next = { ...inputs, [k]: v };
    const b = revenueBounds(next.partners, next.attorneys);
    next.revenue = Math.min(Math.max(next.revenue, b.min), b.max);
    onChange(next);
  };

  const objectives: { big: string; cap: string; facts: Fact[] }[] = [
    {
      big: `${pct(m.margin)} → ${pct(m.margin2)}`,
      cap: "profit margin",
      facts: [
        [pct(m.msoCostReduction), "lower cost to run the back office"],
        [`${money(m.feeSaving)} a year`, "saved on day one through a fixed fee below today’s cost"],
        [chg(m.ppp2, m.ppp), `profit per partner, ${money(m.ppp)} to ${money(m.ppp2)}`],
      ],
    },
    {
      big: num(m.hoursFreed),
      cap: "lawyer hours freed a year",
      facts: [
        [money(m.deploymentFunded), "AI platform and migration funded by Spaarke, not the firm"],
        [`${chg(m.revenue2, m.revenue)} revenue`, `${money(m.revenue2 - m.revenue)} from new matters and new client services`],
        ["Kept current", "platform upgrades included, with a market-parity commitment"],
      ],
    },
    {
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
      {/* Inputs */}
      <section aria-label="Your firm" className="border-line rounded-3xl border bg-white p-6 md:p-8">
        <div role="group" aria-label="Firm size" className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="text-fg-low text-[13px]">{copy.presetsLabel}</span>
          <div className="flex flex-wrap gap-2">
            {copy.presets.map((p) => {
              const on = active === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onChange({ ...PRESETS[p.key] })}
                  className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] ${
                    on
                      ? "border-[#5078DC] bg-[#5078DC] text-white"
                      : "border-line-strong text-fg hover:border-[#5078DC] hover:text-[#3F5FD9]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
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
        </div>
      </section>

      {/* Objectives */}
      <section aria-live="polite" aria-label="What the MSO means for this firm" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {objectives.map((o, i) => (
          <article key={copy.objectives[i].title} className="border-line flex flex-col rounded-3xl border bg-white p-6 md:p-7">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="font-mono-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5078DC] text-[13px] text-white"
              >
                {i + 1}
              </span>
              <h3 className="font-display text-fg text-[22px] font-medium tracking-[-0.01em]">{copy.objectives[i].title}</h3>
            </div>
            <p className="text-fg-mid mt-2 text-[15px] leading-snug">{copy.objectives[i].question}</p>
            <div className="border-line mt-5 border-b pb-5">
              <p className="font-display text-[clamp(34px,4vw,44px)] font-medium leading-none tracking-[-0.02em] text-[#3F5FD9] tabular-nums">
                {o.big}
              </p>
              <p className="text-fg-mid mt-2 text-[14px]">{o.cap}</p>
            </div>
            <ul className="mt-5 space-y-3">
              {o.facts.map(([v, t]) => (
                <li key={t} className="text-[14px] leading-snug">
                  <b className="text-fg block font-semibold tabular-nums">{v}</b>
                  <span className="text-fg-mid">{t}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* Summary */}
      <section className="flex flex-col gap-5 rounded-3xl border border-[rgba(80,120,220,0.35)] bg-[#EBF2FF] p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <p className="text-fg max-w-[70ch] text-[17px] leading-relaxed">
          For a firm like this, partner profit rises by about{" "}
          <b className="font-semibold">{money(m.profit2 - m.profit)} a year</b>, and the firm builds an equity stake
          worth about <b className="font-semibold">{money(m.firmValue)}</b> without putting in any cash.
        </p>
        <Link href={detailsHref} scroll={detailsScroll} aria-haspopup={detailsScroll ? undefined : "dialog"} className={BTN}>
          {copy.detailsCta}
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <p className="text-fg-low text-[12px] leading-relaxed">{copy.disclaimer}</p>
    </div>
  );
}

function Slider(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <label htmlFor={props.id} className="text-fg flex items-baseline justify-between gap-3 text-[14px] font-medium">
        <span>{props.label}</span>
        <output htmlFor={props.id} className="font-mono-display shrink-0 text-[14px] tabular-nums text-[#3F5FD9]">
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
        className="mt-3 w-full cursor-pointer accent-[#5078DC]"
      />
    </div>
  );
}
