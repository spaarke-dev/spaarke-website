"use client";

import type { CSSProperties, ReactNode } from "react";
import { money } from "./format";
import type { ShiftData, ShiftRow } from "./shiftData";

/**
 * The calculator's chart (review round 3, 2026-11-21; replaces the Sankey).
 * The client is on the left and the MSO on the right, with the cost lines
 * down the middle. Client bars grow left from the middle; MSO bars grow
 * right. Ticking a function moves its bar across: the dashed outline is
 * today's cost and the solid bar is the fee the MSO charges for it, so the
 * gap is the saving. Every bar is drawn to one scale, so bars resize as the
 * assumptions change; the revenue or budget slider scales every line
 * together and changes the dollar figures.
 */

const COLORS = {
  client: "#8b8b87",
  mso: "#5078DC",
  result: "#2E9E6A",
  ghostClient: "rgba(10,10,10,0.35)",
  ghostMso: "rgba(80,120,220,0.65)",
  ghostResult: "rgba(46,158,106,0.7)",
};
/** The longest bar fills this share of its half, leaving room for its value. */
const FILL = 0.74;
const MOVE = "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out";

/** Grid: client half, labels, MSO half. Phones put the label on its own line above the two halves. */
const ROW = "grid grid-cols-2 items-center gap-x-3 sm:grid-cols-[1fr_minmax(170px,220px)_1fr] sm:gap-x-4";

export function ShiftChart({
  data,
  client,
  clientSub,
  msoSub,
  moved,
  onToggle,
}: {
  data: ShiftData;
  client: string;
  clientSub: string;
  msoSub: string;
  moved: Record<string, boolean>;
  onToggle: (fn: string, on: boolean) => void;
}) {
  const { rows, result } = data;
  const max = Math.max(1, ...rows.flatMap((r) => [r.before, r.keep, r.mso]), result.before, result.after);
  const w = (v: number) => `${(Math.max(0, v) / max) * FILL * 100}%`;

  return (
    <figure className="m-0">
      <figcaption className="sr-only">
        Cost lines for the {client.toLowerCase()} and the MSO. Tick a function to move it to the MSO.
      </figcaption>

      {/* Column heads */}
      <div className={`${ROW} border-line-strong border-b pb-4`}>
        <div className="order-2 text-right sm:order-1">
          <p className="font-display text-fg text-[18px] font-medium leading-tight">{client}</p>
          <p className="text-fg-low mt-0.5 text-[13px] tabular-nums">{clientSub}</p>
        </div>
        <p className="font-mono-display text-fg-low order-1 col-span-2 text-center text-[10px] uppercase leading-relaxed tracking-[0.14em] sm:order-2 sm:col-span-1">
          Tick a function to move it
        </p>
        <div className="order-3">
          <p className="font-display text-[18px] font-medium leading-tight text-[#3F5FD9]">
            Management Services Organization
          </p>
          <p className="text-fg-low mt-0.5 text-[13px] tabular-nums">{msoSub}</p>
        </div>
      </div>

      <ul>
        {rows.map((r) => (
          <li key={r.id} className={`${ROW} border-line border-b py-2.5`}>
            <Half side="left">
              <Bar side="left" ghost={r.keep < r.before ? w(r.before) : null} fill={w(r.keep)} color={COLORS.client} ghostColor={COLORS.ghostClient} />
              <Value side="left" at={w(Math.max(r.before, r.keep))} show={r.keep > 0}>
                {money(r.keep)}
              </Value>
            </Half>
            <Label row={r} moved={moved} onToggle={onToggle} />
            <Half side="right">
              <Bar side="right" ghost={r.mso > 0 ? w(r.before - r.keep) : null} fill={w(r.mso)} color={COLORS.mso} ghostColor={COLORS.ghostMso} />
              <Value side="right" at={w(Math.max(r.before - r.keep, r.mso))} show={r.mso > 0}>
                {money(r.mso)}
              </Value>
            </Half>
          </li>
        ))}
        <li className={`${ROW} border-line-strong border-t-2 pt-4`}>
          <Half side="left">
            <Bar side="left" ghost={result.before > 0 ? w(result.before) : null} fill={w(result.after)} color={COLORS.result} ghostColor={COLORS.ghostResult} />
            <Value side="left" at={w(Math.max(result.before, result.after))} show strong>
              {money(result.after)}
            </Value>
          </Half>
          <div className="order-1 col-span-2 text-center sm:order-2 sm:col-span-1">
            <p className="text-fg text-[15px] font-semibold">{result.label}</p>
            {result.before > 0 ? (
              <p className="text-fg-low text-[12px] tabular-nums">Today {money(result.before)}</p>
            ) : null}
            <p className="text-fg-low text-[12px] tabular-nums sm:hidden">With the MSO {money(result.after)}</p>
          </div>
          <div className="order-3" />
        </li>
      </ul>

      <Legend />
    </figure>
  );
}

function Half({ side, children }: { side: "left" | "right"; children: ReactNode }) {
  return <div className={`relative h-7 ${side === "left" ? "order-2 sm:order-1" : "order-3"}`}>{children}</div>;
}

function Bar({
  side,
  ghost,
  fill,
  color,
  ghostColor,
}: {
  side: "left" | "right";
  ghost: string | null;
  fill: string;
  color: string;
  ghostColor: string;
}) {
  const anchor: CSSProperties = side === "left" ? { right: 0 } : { left: 0 };
  return (
    <>
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 rounded-[4px] border border-dashed ${MOVE}`}
        style={{ ...anchor, width: ghost ?? "0%", borderColor: ghostColor, opacity: ghost ? 1 : 0 }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-y-[3px] rounded-[3px] ${MOVE}`}
        style={{ ...anchor, width: fill, backgroundColor: color }}
      />
    </>
  );
}

function Value({
  side,
  at,
  show,
  strong,
  children,
}: {
  side: "left" | "right";
  at: string;
  show: boolean;
  strong?: boolean;
  children: ReactNode;
}) {
  const pos: CSSProperties = side === "left" ? { right: `calc(${at} + 8px)` } : { left: `calc(${at} + 8px)` };
  return (
    <span
      className={`absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-[13px] tabular-nums sm:block ${MOVE} ${
        strong ? "text-fg font-semibold" : "text-fg-mid"
      }`}
      style={{ ...pos, opacity: show ? 1 : 0 }}
    >
      {children}
    </span>
  );
}

function Label({
  row,
  moved,
  onToggle,
}: {
  row: ShiftRow;
  moved: Record<string, boolean>;
  onToggle: (fn: string, on: boolean) => void;
}) {
  const onMso = row.mso > 0 && row.keep === 0;
  const name = onMso && row.msoLabel ? row.msoLabel : row.label;
  return (
    <div className="order-1 col-span-2 flex flex-col items-center text-center sm:order-2 sm:col-span-1">
      {row.toggle ? (
        <label className="text-fg inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium leading-snug">
          <input
            type="checkbox"
            checked={moved[row.toggle] ?? false}
            onChange={(e) => onToggle(row.toggle!, e.target.checked)}
            className="h-4 w-4 shrink-0 cursor-pointer accent-[#5078DC]"
          />
          {name}
        </label>
      ) : (
        <p className="text-fg-mid text-[14px] leading-snug">{name}</p>
      )}
      {row.follows ? <p className="text-fg-low text-[11px]">Moves with technology</p> : null}
      {row.msoLabel && row.mso > 0 ? <p className="text-fg-low text-[11px]">Partly moved: {row.msoLabel}</p> : null}
      {/* Phones: the values sit under the label, since the halves are narrow. */}
      <p className="text-fg-low text-[12px] tabular-nums sm:hidden">
        {row.keep > 0 ? `Keeps ${money(row.keep)}` : ""}
        {row.keep > 0 && row.mso > 0 ? " · " : ""}
        {row.mso > 0 ? `MSO ${money(row.mso)}` : ""}
      </p>
    </div>
  );
}

function Legend() {
  const item = "inline-flex items-center gap-2";
  const swatch = "inline-block h-3 w-5 rounded-[3px]";
  return (
    <div className="text-fg-mid mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px]">
      <span className={item}>
        <span className={swatch} style={{ backgroundColor: COLORS.client }} /> Cost the client keeps
      </span>
      <span className={item}>
        <span className={swatch} style={{ backgroundColor: COLORS.mso }} /> MSO service fee
      </span>
      <span className={item}>
        <span className={`${swatch} border border-dashed`} style={{ borderColor: COLORS.ghostClient }} /> Cost today (the gap is the saving)
      </span>
    </div>
  );
}
