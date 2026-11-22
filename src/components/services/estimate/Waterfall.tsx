"use client";

import { money } from "./format";

export interface WaterfallStep {
  label: [string, string];
  /** Short labels for narrow screens (handoff acceptance 4). */
  short: [string, string];
  value: number;
  /**
   * "equity" is a step drawn hatched (a one-time value, not annual profit);
   * "grand" is a total after the equity step.
   */
  kind: WaterfallKind;
}

export type WaterfallKind = "base" | "step" | "total" | "equity" | "grand";

const EQUITY = "#7F6FE0";

/** Bar fill per kind; equity is hatched, as in the earlier five-year chart. */
const FILL: Record<WaterfallKind, string> = {
  base: "#8B8B87",
  step: "#5078DC",
  total: "#2E9E6A",
  equity: `repeating-linear-gradient(135deg, ${EQUITY} 0 5px, rgba(127,111,224,0.45) 5px 9px)`,
  grand: "#4A4A46",
};

/** A bracket over a run of columns (indices into the steps, inclusive). */
export interface WaterfallGroup {
  label: string;
  from: number;
  to: number;
}

/** A tick step that gives four to six gridlines over the range. */
function tickStep(range: number) {
  for (const s of [25_000, 50_000, 100_000, 200_000, 250_000, 500_000, 1_000_000, 2_000_000, 2_500_000, 5_000_000, 10_000_000]) {
    if (range / s <= 6) return s;
  }
  return 25_000_000;
}

/**
 * Bar extents: the base and total stand on the axis; each step floats on the
 * running total, rising for a gain and falling for a saving (a negative value).
 */
function placeBars(steps: WaterfallStep[], yMin: number) {
  const out: (WaterfallStep & { lo: number; hi: number; text: string })[] = [];
  let run = 0;
  for (const s of steps) {
    if (s.kind === "step" || s.kind === "equity") {
      const next = run + s.value;
      out.push({ ...s, lo: Math.min(run, next), hi: Math.max(run, next), text: `${s.value >= 0 ? "+" : "-"}${money(Math.abs(s.value))}` });
      run = next;
    } else {
      out.push({ ...s, lo: yMin, hi: s.value, text: money(s.value) });
      run = s.value;
    }
  }
  return out;
}

/**
 * A bridge from today to with the MSO (handoff section 3, details 1): today,
 * each source of change floating on the running total, then the total with
 * the MSO. Law firms bridge profit per partner upward; legal departments
 * bridge the total cost of legal downward. The y-axis starts at `floor` times
 * the lower of the two ends (0.7 for firms, as in the reference). Values sit
 * above the bars. Plain HTML so it reflows with the page; bars animate as
 * the inputs change. Optional brackets over runs of columns and a legend
 * (the law firm bridge uses both for its equity step, owner review
 * 2026-11-22).
 */
export function Waterfall({
  steps,
  label,
  floor = 0.7,
  groups,
  legend,
}: {
  steps: WaterfallStep[];
  label: string;
  floor?: number;
  groups?: WaterfallGroup[];
  legend?: { kind: WaterfallKind; label: string }[];
}) {
  const base = steps[0].value;
  const total = steps[steps.length - 1].value;
  const top = Math.max(base, total) * 1.08;
  const roughMin = Math.min(base, total) * floor;
  const st = tickStep(top - roughMin);
  const yMin = Math.floor(roughMin / Math.min(st, 50_000)) * Math.min(st, 50_000);
  const yMax = Math.ceil(top / st) * st;
  const range = yMax - yMin;
  const ticks: number[] = [];
  for (let v = Math.ceil(yMin / st) * st; v <= yMax; v += st) ticks.push(v);
  const at = (v: number) => ((v - yMin) / range) * 100;

  const bars = placeBars(steps, yMin);
  const cols = { gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` };

  return (
    <figure aria-label={label}>
      <div className="grid grid-cols-[38px_1fr] sm:grid-cols-[56px_1fr]">
        {groups ? (
          <>
            <div />
            <div aria-hidden="true" className="mb-4 grid gap-1 sm:gap-4" style={cols}>
              {groups.map((g) => (
                <div
                  key={g.label}
                  className="flex flex-col items-center"
                  style={{ gridColumn: `${g.from + 1} / ${g.to + 2}` }}
                >
                  <span className="font-mono-display text-fg-mid whitespace-nowrap text-[9px] uppercase tracking-[0.12em] sm:text-[11px]">
                    {g.label}
                  </span>
                  <span className="mt-1.5 h-2 w-[calc(100%-8px)] border-x border-t border-[rgba(10,10,10,0.35)]" />
                </div>
              ))}
            </div>
          </>
        ) : null}
        {/* Y axis labels */}
        <div aria-hidden="true" className="relative h-[240px] sm:h-[340px]">
          {ticks.map((t) => (
            <span
              key={t}
              className="text-fg-low absolute right-1.5 translate-y-1/2 sm:right-2 text-[10px] tabular-nums sm:text-[12px]"
              style={{ bottom: `${at(t)}%` }}
            >
              {money(t, 1)}
            </span>
          ))}
        </div>
        {/* Plot */}
        <div className="relative h-[240px] sm:h-[340px]">
          {ticks.map((t) => (
            <div
              key={t}
              aria-hidden="true"
              className="absolute left-0 right-0 h-px bg-[rgba(10,10,10,0.08)]"
              style={{ bottom: `${at(t)}%` }}
            />
          ))}
          <div className="absolute inset-0 grid gap-1 sm:gap-4" style={cols}>
            {bars.map((b) => (
              <div key={b.label.join(" ")} className="relative">
                <div
                  className="absolute left-1/2 w-full max-w-[84px] -translate-x-1/2 rounded-[4px] transition-all duration-500 ease-out"
                  style={{
                    bottom: `${at(b.lo)}%`,
                    height: `max(2px, ${at(b.hi) - at(b.lo)}%)`,
                    background: FILL[b.kind],
                  }}
                />
                {/* Phones: the equity step ends level with the total beside it, so its value sits one line higher. */}
                <span
                  className={`text-fg absolute left-1/2 -translate-x-1/2 whitespace-nowrap pb-1 text-[10px] font-bold tabular-nums transition-all duration-500 ease-out sm:text-[12px] ${b.kind === "equity" ? "-translate-y-[18px] sm:translate-y-0" : ""}`}
                  style={{ bottom: `${at(b.hi)}%` }}
                >
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* X labels */}
        <div />
        <div className="border-line grid gap-1 border-t pt-2 sm:gap-4" style={cols}>
          {bars.map((b) => (
            <span key={b.label.join(" ")} className="text-fg-mid text-center text-[10px] leading-tight sm:text-[12px]">
              <span className="hidden sm:inline">
                {b.label[0]}
                <br />
                {b.label[1]}
              </span>
              <span className="sm:hidden">
                {b.short[0]}
                <br />
                {b.short[1]}
              </span>
            </span>
          ))}
        </div>
      </div>
      {legend ? (
        <ul className="text-fg-mid mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] sm:text-[13px]">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: FILL[l.kind] }} />
              {l.label}
            </li>
          ))}
        </ul>
      ) : null}
      {/* Screen readers get the figures as a list. */}
      <ul className="sr-only">
        {bars.map((b) => (
          <li key={b.label.join(" ")}>
            {b.label.join(" ")}: {b.text}
          </li>
        ))}
      </ul>
    </figure>
  );
}
