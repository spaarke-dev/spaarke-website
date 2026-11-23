"use client";

import type { ReactNode } from "react";
import { money } from "./format";
import type { ShiftData, ShiftRow } from "./shiftData";

/**
 * The calculator's chart (review round 5, 2026-11-21: vertical columns; it
 * replaces round 4's horizontal stacked bars, which replaced the round 3
 * shift chart and the Sankey). Three stacked columns, drawn to one scale,
 * tell the story in steps:
 *  1. Today: every cost line is carried by the firm or department.
 *  2. Move: the chosen functions move to the MSO at today's cost, so the
 *     total does not change yet.
 *  3. Efficiencies: the MSO delivers them for less, so its part shrinks and
 *     the dashed gap (the saving) shows how far the total falls.
 * The cost lines are named on the left, level with their band in the first
 * column. Lines that stay sit at the bottom and the lines that move sit
 * above them, so each band keeps its place from column to column. Heights
 * animate as the assumptions change. Phones list the lines under the chart.
 */

const KEEP = ["#6F6F6B", "#8B8B87"];
const KEEP_MOVING = ["#B9B9B4", "#C9C9C4"];
const MSO_LIGHT = ["#A9BCEF", "#BCCBF3"];
const MSO = ["#3F5FD9", "#5078DC"];
const SAVING = "#2E9E6A";
const MOVE = "motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-out";

/** Column height on wider screens, and on phones (used to decide when a value fits in its band). */
const H = 420;
const H_PHONE = 300;
/** Minimum vertical spacing between labels on the left. */
const LABEL_GAP = 22;

interface Seg {
  key: string;
  label: string;
  value: number;
  fill: string;
  text: string;
  dashed?: string;
  moves?: boolean;
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
  const sum = (f: (r: ShiftRow) => number) => rows.reduce((a, r) => a + f(r), 0);
  const today = sum((r) => r.before);
  const kept = sum((r) => r.keep);
  const movedToday = today - kept;
  const fee = sum((r) => r.mso);
  const saving = Math.max(0, movedToday - fee);
  const max = Math.max(1, today);

  // Lines that stay (or the part of a line that stays) at the bottom, then what moves.
  const stay = rows.filter((r) => r.keep > 0);
  const go = rows.filter((r) => r.before - r.keep > 0);
  const goLabel = (r: ShiftRow) => (r.keep > 0 && r.msoLabel ? r.msoLabel : r.label);

  const staySegs: Seg[] = stay.map((r, i) => ({
    key: `k-${r.id}`,
    label: r.label,
    value: r.keep,
    fill: KEEP[i % 2],
    text: "#fff",
  }));
  const todaySegs: Seg[] = [
    ...staySegs,
    ...go.map((r, i) => ({
      key: `m-${r.id}`,
      label: goLabel(r),
      value: r.before - r.keep,
      fill: KEEP_MOVING[i % 2],
      text: "#3a3a38",
      moves: true,
    })),
  ];

  const stages: { n: number; title: string; body: string; total: number; segs: Seg[]; caption: ReactNode }[] = [
    {
      n: 1,
      title: "Today",
      body: `Every function runs ${clientPlace}.`,
      total: today,
      segs: todaySegs,
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
        ...staySegs,
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
          {client} {money(kept)}
          <br />
          <span className="text-[#3F5FD9]">MSO {money(movedToday)}</span>
        </>
      ),
    },
    {
      n: 3,
      title: "The MSO runs them at scale",
      body: "Shared people, platforms and purchasing lower the cost of each function, so the total falls.",
      total: kept + fee,
      segs: [
        ...staySegs,
        ...go.map((r, i) => ({ key: `m-${r.id}`, label: goLabel(r), value: r.mso, fill: MSO[i % 2], text: "#fff" })),
        { key: "saving", label: "Saving", value: saving, fill: "rgba(46,158,106,0.14)", text: "#1F7A50", dashed: SAVING },
      ],
      caption: (
        <>
          {client} {money(kept)}
          <br />
          <span className="text-[#3F5FD9]">MSO fee {money(fee)}</span>
          <br />
          <span className="font-semibold text-[#1F7A50]">Saving {money(saving)}</span>
        </>
      ),
    },
  ];

  const labels = placeLabels(todaySegs, max);
  const toggles = rows.filter((r) => r.toggle);
  const cols = "grid grid-cols-3 gap-x-3 sm:grid-cols-[minmax(150px,230px)_repeat(3,minmax(0,1fr))] sm:gap-x-6 lg:gap-x-10";

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

      <div className={`${cols} mt-8`}>
        {/* Row 1: column totals. */}
        <div className="hidden sm:block" />
        {stages.map((s) => (
          <p key={s.n} className="font-display text-fg text-center text-[clamp(17px,1.6vw,22px)] font-medium tabular-nums">
            {money(s.total)}
          </p>
        ))}

        {/* Row 2: the cost-line names on the left, then the three columns. */}
        <div className="relative mt-3 hidden sm:block" style={{ height: H }}>
          {labels.map((l) => (
            <div
              key={l.seg.key}
              className="absolute inset-x-0 flex -translate-y-1/2 items-center justify-end gap-2 whitespace-nowrap text-[13px] leading-none"
              style={{ top: l.top }}
            >
              <span className="text-fg min-w-0 truncate">{l.seg.label}</span>
              <span className="text-fg-low tabular-nums">{money(l.seg.value)}</span>
              {l.seg.moves ? <span className="text-[11px] font-medium text-[#3F5FD9]">moves</span> : null}
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: l.seg.fill }} />
            </div>
          ))}
        </div>
        {stages.map((s) => (
          <div
            key={s.n}
            role="presentation"
            className="border-line-strong mt-3 flex h-[300px] flex-col-reverse gap-[2px] border-b sm:h-[420px]"
          >
            {s.segs.map((g) => (
              <Band key={g.key} seg={g} share={g.value / max} />
            ))}
          </div>
        ))}

        {/* Row 3: what each column shows. */}
        <div className="hidden sm:block" />
        {stages.map((s) => (
          <div key={s.n} className="mt-4 min-w-0">
            <p className="flex items-baseline gap-2">
              <span className="font-mono-display text-[12px] text-[#3F5FD9]">0{s.n}</span>
              <span className="font-display text-fg text-[15px] font-medium leading-tight sm:text-[17px]">{s.title}</span>
            </p>
            <p className="text-fg-mid mt-1.5 hidden text-[13px] leading-relaxed sm:block">{s.body}</p>
            <p className="text-fg-mid mt-2 text-[12px] leading-relaxed tabular-nums sm:text-[13px]">{s.caption}</p>
          </div>
        ))}
      </div>

      {/* Phones: the cost lines as a list, since there is no room beside the columns. */}
      <ul className="text-fg-mid mt-6 space-y-1.5 text-[13px] sm:hidden">
        {[...todaySegs].reverse().map((g) => (
          <li key={g.key} className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: g.fill }} />
            <span className="text-fg">{g.label}</span>
            <span className="tabular-nums">{money(g.value)}</span>
            {g.moves ? <span className="text-[11px] font-medium text-[#3F5FD9]">moves</span> : null}
          </li>
        ))}
      </ul>

      <div className="text-fg-mid mt-8 flex flex-wrap gap-x-6 gap-y-2 pb-5 text-[12px]">
        <Key fill={KEEP[0]}>Stays with the {client.toLowerCase()}</Key>
        <Key fill={KEEP_MOVING[0]}>Will move to the MSO</Key>
        <Key fill={MSO_LIGHT[0]}>Moved, at today&rsquo;s cost</Key>
        <Key fill={MSO[0]}>MSO service fee</Key>
        <Key fill="rgba(46,158,106,0.14)" dashed={SAVING}>
          Saving
        </Key>
      </div>

      <div className="border-line-strong border-t-2 pt-5">{result}</div>
    </figure>
  );
}

/**
 * Places each cost-line name level with the middle of its band in the first
 * column, then nudges names apart so none overlap, keeping them inside the
 * column's height. Positions are in pixels from the top.
 */
function placeLabels(segs: Seg[], max: number): { seg: Seg; top: number }[] {
  let below = 0;
  const placed = segs
    .filter((s) => s.value > 0)
    .map((seg) => {
      const mid = below + seg.value / 2;
      below += seg.value;
      return { seg, top: H - (mid / max) * H };
    })
    .sort((a, b) => a.top - b.top);
  for (let i = 1; i < placed.length; i++) {
    placed[i].top = Math.max(placed[i].top, placed[i - 1].top + LABEL_GAP);
  }
  for (let i = placed.length - 1; i >= 0; i--) {
    const limit = i === placed.length - 1 ? H - LABEL_GAP / 2 : placed[i + 1].top - LABEL_GAP;
    placed[i].top = Math.max(LABEL_GAP / 2, Math.min(placed[i].top, limit));
  }
  return placed;
}

function Band({ seg, share }: { seg: Seg; share: number }) {
  const pct = Math.max(0, share) * 100;
  const showValue = (pct / 100) * H_PHONE >= 20;
  return (
    <div
      title={`${seg.label}: ${money(seg.value)}`}
      className={`relative w-full shrink-0 overflow-hidden rounded-[4px] ${MOVE}`}
      style={{
        // Every column sums to today's total, so the 2 px gaps come out of each band.
        height: `max(0px, calc(${pct}% - 2px))`,
        backgroundColor: seg.fill,
        border: seg.dashed ? `1.5px dashed ${seg.dashed}` : undefined,
        display: pct <= 0.05 ? "none" : undefined,
      }}
    >
      {showValue ? (
        <span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[12px] font-semibold tabular-nums sm:text-[13px]"
          style={{ color: seg.text }}
        >
          {money(seg.value)}
        </span>
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
