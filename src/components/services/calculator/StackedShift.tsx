"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { money } from "./format";
import type { ShiftData, ShiftRow } from "./shiftData";

/**
 * The calculator's chart (review round 4, 2026-11-21; replaces the shift
 * chart, which replaced the Sankey). Three stacked bars, drawn to one scale,
 * tell the story in steps:
 *  1. Today: every cost line is carried by the firm or department.
 *  2. Move: the chosen functions move to the MSO at today's cost, so the
 *     total does not change yet.
 *  3. Efficiencies: the MSO delivers them for less, so its part shrinks and
 *     the gap (the saving) shows how far the total falls.
 * Segments keep their place from bar to bar, so the eye follows each
 * function across. Widths animate as the assumptions change.
 */

const KEEP = ["#6F6F6B", "#8B8B87"];
const KEEP_MOVING = ["#B9B9B4", "#C9C9C4"];
const MSO_LIGHT = ["#A9BCEF", "#BCCBF3"];
const MSO = ["#3F5FD9", "#5078DC"];
const SAVING = "#2E9E6A";
const MOVE = "motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out";

interface Seg {
  key: string;
  label: string;
  value: number;
  fill: string;
  text: string;
  dashed?: string;
}

export function StackedShift({
  data,
  client,
  clientPlace,
  moved,
  onToggle,
  result,
}: {
  data: ShiftData;
  /** "Law firm" or "Legal department". */
  client: string;
  /** "inside the firm" or "inside the legal department". */
  clientPlace: string;
  moved: Record<string, boolean>;
  onToggle: (fn: string, on: boolean) => void;
  result: ReactNode;
}) {
  const { rows } = data;
  // Bar width in pixels, so a segment shows its text only when the text fits.
  const barRef = useRef<HTMLDivElement>(null);
  const [barPx, setBarPx] = useState(0);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBarPx(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const sum = (f: (r: ShiftRow) => number) => rows.reduce((a, r) => a + f(r), 0);
  const today = sum((r) => r.before);
  const kept = sum((r) => r.keep);
  const movedToday = today - kept;
  const fee = sum((r) => r.mso);
  const saving = Math.max(0, movedToday - fee);
  const max = Math.max(1, today);

  // Lines that stay (or the part of a line that stays) first, then what moves.
  const stay = rows.filter((r) => r.keep > 0);
  const go = rows.filter((r) => r.before - r.keep > 0);
  const goLabel = (r: ShiftRow) => (r.keep > 0 && r.msoLabel ? r.msoLabel : r.label);

  const staySegs = (): Seg[] =>
    stay.map((r, i) => ({ key: `k-${r.id}`, label: r.label, value: r.keep, fill: KEEP[i % 2], text: "#fff" }));

  const stages: { n: number; title: string; body: string; total: number; segs: Seg[]; caption: ReactNode }[] = [
    {
      n: 1,
      title: "Today",
      body: `Every function runs ${clientPlace}.`,
      total: today,
      segs: [
        ...staySegs(),
        ...go.map((r, i) => ({
          key: `m-${r.id}`,
          label: goLabel(r),
          value: r.before - r.keep,
          fill: KEEP_MOVING[i % 2],
          text: "#3a3a38",
        })),
      ],
      caption: (
        <>
          {client} {money(today)}
        </>
      ),
    },
    {
      n: 2,
      title: "Move functions to the MSO",
      body: "The chosen functions move at today’s cost. The total does not change yet.",
      total: today,
      segs: [
        ...staySegs(),
        ...go.map((r, i) => ({
          key: `m-${r.id}`,
          label: goLabel(r),
          value: r.before - r.keep,
          fill: MSO_LIGHT[i % 2],
          text: "#1d3a99",
        })),
      ],
      caption: (
        <>
          {client} {money(kept)} <Dot /> <span className="text-[#3F5FD9]">MSO {money(movedToday)}</span>
        </>
      ),
    },
    {
      n: 3,
      title: "The MSO runs them at scale",
      body: "Shared people, platforms and purchasing lower the cost of each function, so the total falls.",
      total: kept + fee,
      segs: [
        ...staySegs(),
        ...go.map((r, i) => ({ key: `m-${r.id}`, label: goLabel(r), value: r.mso, fill: MSO[i % 2], text: "#fff" })),
        {
          key: "saving",
          label: "Saving",
          value: saving,
          fill: "rgba(46,158,106,0.14)",
          text: "#1F7A50",
          dashed: SAVING,
        },
      ],
      caption: (
        <>
          {client} {money(kept)} <Dot /> <span className="text-[#3F5FD9]">MSO fee {money(fee)}</span> <Dot />{" "}
          <span className="font-semibold text-[#1F7A50]">Saving {money(saving)}</span>
        </>
      ),
    },
  ];

  const toggles = rows.filter((r) => r.toggle);

  return (
    <figure className="m-0">
      <figcaption className="sr-only">
        Total cost today, after moving the chosen functions to the MSO, and after the MSO&rsquo;s efficiencies: saving{" "}
        {money(saving)} a year.
      </figcaption>

      <fieldset className="border-line border-b pb-6">
        <legend className="font-mono-display text-fg-low mb-3 text-[10px] uppercase tracking-[0.14em]">
          Functions the MSO delivers
        </legend>
        <div className="flex flex-wrap gap-x-7 gap-y-3">
          {toggles.map((r) => (
            <label key={r.id} className="text-fg inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium">
              <input
                type="checkbox"
                checked={moved[r.toggle!] ?? false}
                onChange={(e) => onToggle(r.toggle!, e.target.checked)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-[#5078DC]"
              />
              {r.label}
            </label>
          ))}
        </div>
        {rows.some((r) => r.follows) ? (
          <p className="text-fg-low mt-3 text-[12px]">Technology capital spend moves with technology.</p>
        ) : null}
      </fieldset>

      <ol className="mt-2">
        {stages.map((s) => (
          <li
            key={s.n}
            className="border-line grid grid-cols-1 gap-x-8 gap-y-3 border-b py-6 last:border-b-0 md:grid-cols-[230px_1fr]"
          >
            <div>
              <p className="flex items-baseline gap-2.5">
                <span className="font-mono-display text-[12px] text-[#3F5FD9]">0{s.n}</span>
                <span className="font-display text-fg text-[18px] font-medium leading-tight">{s.title}</span>
              </p>
              <p className="text-fg-mid mt-1.5 text-[13px] leading-relaxed">{s.body}</p>
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-fg-mid text-[13px] tabular-nums">{s.caption}</p>
                <p className="font-display text-fg shrink-0 text-[18px] font-medium tabular-nums">
                  {money(s.total)}
                </p>
              </div>
              <div ref={s.n === 1 ? barRef : undefined} className="mt-2 flex h-14 w-full gap-[2px]" role="presentation">
                {s.segs.map((g) => (
                  <Segment key={g.key} seg={g} share={g.value / max} barPx={barPx} />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="text-fg-mid flex flex-wrap gap-x-6 gap-y-2 pb-5 text-[12px]">
        <Key fill={KEEP[0]}>Stays with the {client.toLowerCase()}</Key>
        <Key fill={MSO_LIGHT[0]}>Moved to the MSO at today&rsquo;s cost</Key>
        <Key fill={MSO[0]}>MSO service fee</Key>
        <Key fill="rgba(46,158,106,0.14)" dashed={SAVING}>
          Saving
        </Key>
        <span>Hover a segment for its name and cost.</span>
      </div>

      <div className="border-line-strong border-t-2 pt-5">{result}</div>
    </figure>
  );
}

function Segment({ seg, share, barPx }: { seg: Seg; share: number; barPx: number }) {
  const pct = Math.max(0, share) * 100;
  const px = (pct / 100) * barPx;
  const valueText = money(seg.value);
  // Rough text widths at 13 px semibold and 11 px, plus the side padding.
  const showValue = px >= valueText.length * 8 + 22;
  const showLabel = showValue && px >= seg.label.length * 6 + 22;
  return (
    <div
      title={`${seg.label}: ${money(seg.value)}`}
      className={`relative h-full min-w-0 overflow-hidden rounded-[4px] ${MOVE}`}
      style={{
        // Every bar sums to today's total, so the 2 px gaps come out of each segment.
        width: `max(0px, calc(${pct}% - 2px))`,
        flex: "none",
        backgroundColor: seg.fill,
        border: seg.dashed ? `1.5px dashed ${seg.dashed}` : undefined,
        display: pct <= 0.05 ? "none" : undefined,
      }}
    >
      {showValue ? (
        <div className="absolute inset-0 flex flex-col justify-center px-2.5" style={{ color: seg.text }}>
          {showLabel ? <span className="whitespace-nowrap text-[11px] leading-tight opacity-90">{seg.label}</span> : null}
          <span className="whitespace-nowrap text-[13px] font-semibold leading-tight tabular-nums">{valueText}</span>
        </div>
      ) : null}
    </div>
  );
}

function Key({ fill, dashed, children }: { fill: string; dashed?: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="inline-block h-3 w-5 rounded-[3px]"
        style={{ backgroundColor: fill, border: dashed ? `1.5px dashed ${dashed}` : undefined }}
      />
      {children}
    </span>
  );
}

function Dot() {
  return <span className="text-fg-low">·</span>;
}
