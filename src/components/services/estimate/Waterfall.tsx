"use client";

import { money } from "./format";

export interface WaterfallStep {
  label: [string, string];
  /** Short labels for narrow screens (handoff acceptance 4). */
  short: [string, string];
  value: number;
  kind: "base" | "step" | "total";
}

const COLORS = { base: "#8B8B87", step: "#5078DC", total: "#2E9E6A" };

/** A tick step that gives four to six gridlines over the range. */
function tickStep(range: number) {
  for (const s of [25_000, 50_000, 100_000, 200_000, 250_000, 500_000, 1_000_000, 2_000_000]) {
    if (range / s <= 6) return s;
  }
  return 5_000_000;
}

/** Bar extents: the base and total stand on the axis; each step floats on the running total. */
function placeBars(steps: WaterfallStep[], yMin: number) {
  const out: (WaterfallStep & { lo: number; hi: number; text: string })[] = [];
  let run = 0;
  for (const s of steps) {
    const lo = s.kind === "step" ? run : yMin;
    const hi = s.kind === "step" ? run + s.value : s.value;
    if (s.kind !== "total") run = s.kind === "base" ? s.value : hi;
    out.push({ ...s, lo, hi, text: s.kind === "step" ? `+${money(s.value)}` : money(s.value) });
  }
  return out;
}

/**
 * Profit-per-partner bridge (handoff section 3, details 1): today, each
 * source of extra profit floating on the running total, then the total with
 * the MSO. The y-axis starts near 70% of today's figure, as in the
 * reference. Values sit above the bars. Plain HTML so it reflows with the
 * page; bars animate as the inputs change.
 */
export function Waterfall({ steps, label }: { steps: WaterfallStep[]; label: string }) {
  const base = steps[0].value;
  const total = steps[steps.length - 1].value;
  const yMin = Math.floor((base * 0.7) / 50_000) * 50_000;
  const st = tickStep(total * 1.08 - yMin);
  const yMax = Math.ceil((total * 1.08) / st) * st;
  const range = yMax - yMin;
  const ticks: number[] = [];
  for (let v = Math.ceil(yMin / st) * st; v <= yMax; v += st) ticks.push(v);
  const at = (v: number) => ((v - yMin) / range) * 100;

  const bars = placeBars(steps, yMin);

  return (
    <figure aria-label={label}>
      <div className="grid grid-cols-[38px_1fr] sm:grid-cols-[56px_1fr]">
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
          <div className="absolute inset-0 grid grid-cols-6 gap-1 sm:gap-4">
            {bars.map((b) => (
              <div key={b.label.join(" ")} className="relative">
                <div
                  className="absolute left-1/2 w-full max-w-[84px] -translate-x-1/2 rounded-[4px] transition-all duration-500 ease-out"
                  style={{
                    bottom: `${at(b.lo)}%`,
                    height: `max(2px, ${at(b.hi) - at(b.lo)}%)`,
                    backgroundColor: COLORS[b.kind],
                  }}
                />
                <span
                  className="text-fg absolute left-1/2 -translate-x-1/2 whitespace-nowrap pb-1 text-[10px] font-bold tabular-nums transition-all duration-500 ease-out sm:text-[12px]"
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
        <div className="border-line grid grid-cols-6 gap-1 border-t pt-2 sm:gap-4">
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
