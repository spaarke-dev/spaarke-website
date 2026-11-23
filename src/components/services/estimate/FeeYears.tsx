"use client";

import { money } from "./format";
import { MUTED } from "./parts";

/**
 * Five years of the MSO fee against today's cost of the work that moves
 * (value page row 13). Bars are the fee each year, falling by the glide path;
 * the dashed line is today's cost; the saving sits under each year. A marker
 * after year three shows the fair-market-value review. The axis starts at $0.
 * Plain HTML, like the waterfall, so it reflows and animates.
 */
export function FeeYears({
  today,
  fees,
  savings,
  reviewEvery,
  label,
}: {
  today: number;
  fees: number[];
  savings: number[];
  reviewEvery: number;
  label: string;
}) {
  // Headroom above today's cost for its label and the review marker's.
  const top = today * 1.28;
  const at = (v: number) => (v / top) * 100;
  const cols = { gridTemplateColumns: `repeat(${fees.length}, minmax(0, 1fr))` };

  return (
    <figure aria-label={label} className="mt-8">
      <div className="relative h-[200px] sm:h-[260px]">
        {/* Today's cost */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 border-t-2 border-dashed border-[rgba(10,10,10,0.45)]"
          style={{ bottom: `${at(today)}%` }}
        >
          <span className={`${MUTED} absolute -top-6 left-0 text-[12px] sm:text-[13px]`}>
            Today’s cost <b className="text-fg font-semibold tabular-nums">{money(today)}</b>
          </span>
        </div>
        <div className="absolute inset-0 grid gap-2 sm:gap-6" style={cols}>
          {fees.map((f, i) => (
            <div key={i} className="relative">
              {/* The fair-market-value review sits between years. */}
              {i > 0 && i % reviewEvery === 0 ? (
                <div aria-hidden="true" className="absolute -left-1 bottom-0 top-5 border-l-2 border-dotted border-[#C77A1E] sm:-left-3">
                  <span className="font-mono-display absolute -top-5 left-1.5 whitespace-nowrap text-[9px] uppercase tracking-[0.1em] text-[#8A5410] sm:text-[10px]">
                    FMV review
                  </span>
                </div>
              ) : null}
              <div
                className="absolute bottom-0 left-1/2 w-full max-w-[84px] -translate-x-1/2 rounded-t-[4px] bg-[#5078DC] transition-all duration-500 ease-out"
                style={{ height: `${at(f)}%` }}
              />
              <span
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pb-1 text-[10px] font-bold tabular-nums text-white transition-all duration-500 ease-out sm:text-[12px]"
                style={{ bottom: `calc(${at(f)}% - 22px)` }}
              >
                {money(f)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-line grid gap-2 border-t pt-2 sm:gap-6" style={cols}>
        {savings.map((s, i) => (
          <div key={i} className="text-center leading-tight">
            <span className="text-fg block text-[11px] font-medium sm:text-[13px]">Year {i + 1}</span>
            <span className="block text-[10px] font-semibold tabular-nums text-[#1F7A50] sm:text-[12px]">saves {money(s)}</span>
          </div>
        ))}
      </div>
      <ul className="sr-only">
        {fees.map((f, i) => (
          <li key={i}>
            Year {i + 1}: fee {money(f)}, saving {money(savings[i])} against today’s cost of {money(today)}
          </li>
        ))}
      </ul>
    </figure>
  );
}
