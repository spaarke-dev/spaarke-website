"use client";

import { useId } from "react";
import { structure, type StructureBlock } from "@/app/services/content";
import { useAudience } from "./audience";

/**
 * "What is Managed Legal Operations" diagram, from the structure visual
 * handoff (notes/mso-structure-visual), simplified at the owner's request on
 * 2026-11-22: the client block and its MSO, the fee flowing to the MSO and
 * operations and technology flowing back. Second review the same day: the
 * Spaarke MSO operator sits under the MSO in green, supporting it with no
 * arrow, and the client block runs the full height of the two.
 *
 * Above md the blocks sit side by side; below it they stack. Block heights
 * follow their items, and long items wrap to a second line. The SVG is
 * aria-hidden, so the same content is given to screen readers as text.
 * Site tokens throughout: dark surfaces, site blue for the MSO, green for
 * the operator, amber for money (the handoff's money color).
 */

const FEE = "#F2B56B";
const SVC = "#82A5EB";
const FG = "#F5F5F5";
const FG_MID = "rgba(245,245,245,0.66)";
const FG_LOW = "rgba(245,245,245,0.55)";
const ITEM = "rgba(245,245,245,0.8)";
const LINE = "rgba(255,255,255,0.14)";
const BG = "#0a0a0a";
const GREEN = "#5FC79A";

type Rect = [number, number, number, number];
interface Flow {
  d: string;
  p: [number, number];
}
interface Layout {
  w: number;
  h: number;
  client: Rect;
  mso: Rect;
  operator: Rect;
  fee: Flow;
  services: Flow;
  /** Characters per item line before it wraps. */
  wrap: number;
}

/* Block metrics, in SVG units. */
const ITEMS_TOP = 128; // first item baseline, from the block top
const ITEM_GAP = 24; // baseline to baseline between items
const WRAP_GAP = 18; // baseline to baseline inside a wrapped item
const PAD_BOTTOM = 28; // last baseline to the block bottom

/** Split an item into at most two lines at the last space that fits. */
function wrapItem(s: string, max: number): string[] {
  if (s.length <= max) return [s];
  const cut = s.lastIndexOf(" ", max);
  return cut > 0 ? [s.slice(0, cut), s.slice(cut + 1)] : [s];
}

function blockHeight(b: StructureBlock, max: number) {
  const lines = b.items.map((i) => wrapItem(i, max).length);
  const body = lines.reduce((sum, n) => sum + ITEM_GAP + (n - 1) * WRAP_GAP, -ITEM_GAP);
  return ITEMS_TOP + body + PAD_BOTTOM;
}

const STACK_GAP = 20; // between the MSO and the operator

function wide(client: StructureBlock, mso: StructureBlock, op: StructureBlock): Layout {
  const wrap = 43;
  const bw = 360;
  const msoH = blockHeight(mso, wrap);
  const opH = blockHeight(op, wrap);
  const h = Math.max(blockHeight(client, wrap), msoH + STACK_GAP + opH);
  const top = 20;
  const yFee = top + Math.round(msoH * 0.4);
  const ySvc = top + Math.round(msoH * 0.68);
  return {
    w: 1000,
    h: h + 2 * top,
    client: [20, top, bw, h],
    mso: [620, top, bw, msoH],
    operator: [620, top + msoH + STACK_GAP, bw, h - msoH - STACK_GAP],
    fee: { d: `M380 ${yFee} H620`, p: [500, yFee] },
    services: { d: `M620 ${ySvc} H380`, p: [500, ySvc] },
    wrap,
  };
}

function tall(client: StructureBlock, mso: StructureBlock, op: StructureBlock): Layout {
  const wrap = 38;
  const clientH = blockHeight(client, wrap);
  const msoH = blockHeight(mso, wrap);
  const opH = blockHeight(op, wrap);
  const gap = 180; // room for the two flows between the client and the MSO
  const y0 = 12;
  const yMso = y0 + clientH + gap;
  const a = y0 + clientH;
  return {
    w: 372,
    h: yMso + msoH + STACK_GAP + opH + 12,
    client: [16, y0, 340, clientH],
    mso: [16, yMso, 340, msoH],
    operator: [16, yMso + msoH + STACK_GAP, 340, opH],
    // Staggered so the two labels do not overlap.
    fee: { d: `M120 ${a} V${yMso}`, p: [120, a + 60] },
    services: { d: `M252 ${yMso} V${a}`, p: [252, a + 120] },
    wrap,
  };
}

export function StructureDiagram() {
  const { audience } = useAudience();
  const { client, mso } = structure.blocks[audience];
  const op = structure.operator;
  const { fee, services } = structure.flows;

  return (
    <div className="border-line-strong rounded-2xl border bg-[rgba(255,255,255,0.02)] p-3 sm:p-5 lg:p-8">
      <div aria-hidden="true" className="mx-auto hidden max-w-[1060px] md:block">
        <Diagram layout={wide(client, mso, op)} />
      </div>
      <div aria-hidden="true" className="mx-auto max-w-[420px] md:hidden">
        <Diagram layout={tall(client, mso, op)} />
      </div>
      <div className="sr-only">
        <p>
          {client.title} pays {mso.title} a {fee.toLowerCase()}, and {mso.title} provides{" "}
          {services.toLowerCase()} back to {client.title}. {op.title} supports {mso.title}.
        </p>
        {[client, mso, op].map((b) => (
          <div key={b.title}>
            <p>
              {b.title} ({b.eyebrow}): {b.sub}
            </p>
            <ul>
              {b.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Diagram({ layout: L }: { layout: Layout }) {
  const { audience } = useAudience();
  const { client, mso } = structure.blocks[audience];
  const id = useId().replace(/:/g, "");

  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} className="block h-auto w-full">
      <defs>
        {(
          [
            ["fee", FEE],
            ["svc", SVC],
          ] as const
        ).map(([k, c]) => (
          <marker
            key={k}
            id={`${id}-${k}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={c} />
          </marker>
        ))}
      </defs>

      <Block
        rect={L.client}
        b={client}
        wrap={L.wrap}
        stroke="rgba(255,255,255,0.24)"
        fill="#111111"
        accent={FG_LOW}
        dot={FG_LOW}
      />
      <Block
        rect={L.mso}
        b={mso}
        wrap={L.wrap}
        stroke="rgba(80,120,220,0.75)"
        fill="#0f1422"
        accent={SVC}
        dot={SVC}
      />
      <Block
        rect={L.operator}
        b={structure.operator}
        wrap={L.wrap}
        stroke="rgba(95,199,154,0.7)"
        fill="#0e1a15"
        accent={GREEN}
        dot={GREEN}
      />

      <FlowLine flow={L.fee} color={FEE} marker={`url(#${id}-fee)`} label={structure.flows.fee} />
      <FlowLine flow={L.services} color={SVC} marker={`url(#${id}-svc)`} label={structure.flows.services} />
    </svg>
  );
}

function Block({
  rect: [x, y, w, h],
  b,
  wrap,
  stroke,
  fill,
  accent,
  dot,
}: {
  rect: Rect;
  b: StructureBlock;
  wrap: number;
  stroke: string;
  fill: string;
  accent: string;
  dot: string;
}) {
  // Each item's lines and first baseline, worked out before rendering.
  const rows = b.items.reduce<{ s: string; lines: string[]; y: number }[]>((acc, s) => {
    const prev = acc[acc.length - 1];
    const yy = prev ? prev.y + ITEM_GAP + (prev.lines.length - 1) * WRAP_GAP : y + ITEMS_TOP;
    return [...acc, { s, lines: wrapItem(s, wrap), y: yy }];
  }, []);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" fill={fill} stroke={stroke} />
      <text
        x={x + 22}
        y={y + 30}
        className="font-mono-display"
        fontSize="10.5"
        fontWeight="500"
        letterSpacing="1.3"
        fill={accent}
      >
        {b.eyebrow.toUpperCase()}
      </text>
      <text x={x + 22} y={y + 60} className="font-display" fontSize="20" fontWeight="500" fill={FG}>
        {b.title}
      </text>
      <text x={x + 22} y={y + 82} className="font-body" fontSize="13" fill={FG_MID}>
        {b.sub}
      </text>
      <line x1={x + 22} x2={x + w - 22} y1={y + 100} y2={y + 100} stroke={LINE} />
      {rows.map(({ s, lines, y: first }) => {
        return (
          <g key={s}>
            <circle cx={x + 26} cy={first - 4} r="2.5" fill={dot} />
            <text x={x + 38} y={first} className="font-body" fontSize="13.5" fill={ITEM}>
              {lines.map((l, i) => (
                <tspan key={l} x={x + 38} dy={i === 0 ? 0 : WRAP_GAP}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function FlowLine({
  flow,
  color,
  marker,
  label,
}: {
  flow: Flow;
  color: string;
  marker: string;
  label: string;
}) {
  const w = Math.round(label.length * 6.8 + 22);
  return (
    <g>
      <path d={flow.d} fill="none" stroke={color} strokeWidth="2" markerEnd={marker} />
      <rect
        x={flow.p[0] - w / 2}
        y={flow.p[1] - 12}
        width={w}
        height="24"
        rx="12"
        fill={BG}
        stroke={color}
        strokeOpacity="0.6"
      />
      <text
        x={flow.p[0]}
        y={flow.p[1] + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-body"
        fontSize="12.5"
        fontWeight="500"
        fill={FG}
      >
        {label}
      </text>
    </g>
  );
}
