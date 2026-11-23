"use client";

import { useId } from "react";
import { SHOW_NETWORK_VALUE, structure, type StructureBlock, type StructureGroup } from "@/app/services/content";
import { useAudience } from "./audience";

/**
 * "What is Managed Legal Operations" diagram, from the structure visual
 * handoff (notes/mso-structure-visual), simplified at the owner's request on
 * 2026-11-22, then rebuilt to the owner's diagram spec the same day
 * (spaarke-structure-diagram-spec.md):
 *
 * - The law firm box groups its items under DECIDES (the most weight, with a
 *   lock), HAS A SAY and SHARES IN, and runs the full height of the MSO and
 *   the operator. Spare height goes between the groups.
 * - Connectors: the fee and the firm's input go to the MSO, operations and
 *   technology come back, the operator "owns and runs" the MSO, and (law firm
 *   view, behind SHOW_NETWORK_VALUE) a dashed green arrow carries network
 *   value from the operator to the firm's SHARES IN group.
 *
 * Above md the blocks sit side by side; below it they stack, and the network
 * value arrow runs up a channel on the left. Block heights follow their
 * items, and long items wrap to a second line. The SVG is aria-hidden, so the
 * same content is given to screen readers as text. Site tokens throughout:
 * dark surfaces, site blue for the MSO, green for the operator, amber for
 * money (the handoff's money color), neutral for the firm.
 */

const FEE = "#F2B56B";
const SVC = "#82A5EB";
const INPUT = "#B9B9B4";
const FG = "#F5F5F5";
const FG_MID = "rgba(245,245,245,0.66)";
const FG_LOW = "rgba(245,245,245,0.55)";
const ITEM = "rgba(245,245,245,0.8)";
const ITEM_STRONG = "rgba(245,245,245,0.92)";
const LINE = "rgba(255,255,255,0.14)";
const SEP = "rgba(255,255,255,0.08)";
const BG = "#0a0a0a";
const GREEN = "#5FC79A";

type Rect = [number, number, number, number];
type FlowKind = "fee" | "input" | "svc" | "owns" | "share";
const FLOW_COLOR: Record<FlowKind, string> = { fee: FEE, input: INPUT, svc: SVC, owns: GREEN, share: GREEN };

interface Flow {
  kind: FlowKind;
  d: string;
  /** Pill center. */
  p: [number, number];
  lines: string[];
  /** Pill turned to run along a vertical line (the phone channel). */
  rotate?: boolean;
}

interface Row {
  s: string;
  lines: string[];
  y: number;
}
interface GroupPlan {
  id?: StructureGroup["id"];
  label?: string;
  labelY: number;
  sepY?: number;
  rows: Row[];
  link?: { label: string; href: string; y: number };
}
interface BlockPlan {
  subLines: string[];
  divY: number;
  groups: GroupPlan[];
  /** Natural height, from the block top. */
  h: number;
}

interface Layout {
  w: number;
  h: number;
  wrap: number;
  client: Rect;
  mso: Rect;
  operator: Rect;
  plans: { client: BlockPlan; mso: BlockPlan; operator: BlockPlan };
  flows: Flow[];
}

/* Block metrics, in SVG units, from the block top or the previous baseline. */
const SUB_TOP = 82; // first subtitle baseline
const SUB_GAP = 18; // between subtitle lines
const DIV_PAD = 18; // last subtitle baseline to the divider
const ITEMS_PAD = 28; // divider to the first item, with no group label
const LABEL_PAD = 26; // divider to the first group label
const LABEL_TO_ITEM = 24; // group label to its first item
const ITEM_GAP = 24; // baseline to baseline between items
const WRAP_GAP = 18; // baseline to baseline inside a wrapped item
const LINK_GAP = 21; // item to its link
const GROUP_GAP = 40; // last baseline of a group to the next label
const GROUP_GAP_MAX_EXTRA = 32; // spare height each group gap may take
const PAD_BOTTOM = 28; // last baseline to the block bottom
const OWN_GAP = 64; // between the MSO and the operator, for "Owns and runs"

/** Split an item into at most two lines at the last space that fits. */
function wrapItem(s: string, max: number): string[] {
  if (s.length <= max) return [s];
  const cut = s.lastIndexOf(" ", max);
  return cut > 0 ? [s.slice(0, cut), s.slice(cut + 1)] : [s];
}

/** Subtitles break after a sentence when they can. */
function wrapSub(s: string, max: number): string[] {
  if (s.length <= max) return [s];
  const dot = s.indexOf(". ");
  return dot > 0 && dot < max ? [s.slice(0, dot + 1), s.slice(dot + 2)] : wrapItem(s, max);
}

type AnyGroup = Partial<StructureGroup> & { items: string[] };
function groupsOf(b: StructureBlock): AnyGroup[] {
  return b.groups ?? [{ items: b.items ?? [] }];
}

/**
 * Where each line of a block goes. `slack` is height beyond the natural
 * height, shared out between the groups (up to a cap, so a short list stays
 * together at the top).
 */
function planBlock(b: StructureBlock, top: number, wrap: number, slack = 0): BlockPlan {
  const subLines = wrapSub(b.sub, wrap + 6);
  const divY = top + SUB_TOP + (subLines.length - 1) * SUB_GAP + DIV_PAD;
  const groups = groupsOf(b);
  const extra = groups.length > 1 ? Math.min(GROUP_GAP_MAX_EXTRA, Math.max(0, slack) / (groups.length - 1)) : 0;
  let last = divY;
  const plans: GroupPlan[] = groups.map((g, gi) => {
    const label = g.label;
    let labelY = divY;
    let sepY: number | undefined;
    let y: number;
    if (gi === 0) {
      labelY = divY + LABEL_PAD;
      y = label ? labelY + LABEL_TO_ITEM : divY + ITEMS_PAD;
    } else {
      const gap = GROUP_GAP + extra;
      sepY = Math.round(last + gap / 2 - 2);
      labelY = Math.round(last + gap);
      y = labelY + LABEL_TO_ITEM;
    }
    const rows: Row[] = [];
    for (const s of g.items) {
      const lines = wrapItem(s, wrap);
      rows.push({ s, lines, y });
      last = y + (lines.length - 1) * WRAP_GAP;
      y = last + ITEM_GAP;
    }
    let link: GroupPlan["link"];
    if (g.link) {
      link = { ...g.link, y: last + LINK_GAP };
      last = link.y;
    }
    return { id: g.id, label, labelY, sepY, rows, link };
  });
  return { subLines, divY, groups: plans, h: last + PAD_BOTTOM - top };
}

/** Text center of the SHARES IN item, where the network value arrow lands. */
function shareY(p: BlockPlan) {
  const g = p.groups.find((x) => x.id === "shares");
  return g?.rows[0] ? g.rows[0].y - 4 : null;
}

/** Pill labels on phones break into two short lines. */
const pill = (s: string, max?: number) => (max ? wrapItem(s, max) : [s]);

interface Show {
  input: boolean;
  share: boolean;
}

function wide(c: StructureBlock, m: StructureBlock, o: StructureBlock, show: Show): Layout {
  const wrap = 43;
  const bw = 360;
  const top = 20;
  const cNatural = planBlock(c, top, wrap).h;
  const mso = planBlock(m, top, wrap);
  const opNatural = planBlock(o, 0, wrap).h;
  const h = Math.max(cNatural, mso.h + OWN_GAP + opNatural);
  const opY = top + mso.h + OWN_GAP;
  const client = planBlock(c, top, wrap, h - cNatural);
  const operator = planBlock(o, opY, wrap);
  const f = structure.flows;
  const at = (k: number) => top + Math.round(mso.h * k);
  const [kFee, kIn, kSvc] = show.input ? [0.3, 0.52, 0.76] : [0.4, 0, 0.68];
  const flows: Flow[] = [
    { kind: "fee", d: `M380 ${at(kFee)} H620`, p: [500, at(kFee)], lines: [f.fee] },
    { kind: "svc", d: `M620 ${at(kSvc)} H380`, p: [500, at(kSvc)], lines: [f.services] },
    { kind: "owns", d: `M800 ${opY} V${top + mso.h}`, p: [800, top + mso.h + OWN_GAP / 2], lines: [f.owns] },
  ];
  if (show.input) {
    flows.push({ kind: "input", d: `M380 ${at(kIn)} H620`, p: [500, at(kIn)], lines: pill(f.input, 16) });
  }
  const ys = shareY(client);
  if (show.share && ys !== null) {
    flows.push({ kind: "share", d: `M620 ${ys} H380`, p: [500, ys], lines: [f.share] });
  }
  return {
    w: 1000,
    h: h + 2 * top,
    wrap,
    client: [20, top, bw, h],
    mso: [620, top, bw, mso.h],
    operator: [620, opY, bw, h - mso.h - OWN_GAP],
    plans: { client, mso, operator },
    flows,
  };
}

function tall(c: StructureBlock, m: StructureBlock, o: StructureBlock, show: Show): Layout {
  // With the network value arrow, the blocks move right to leave it a channel.
  const bx = show.share ? 40 : 16;
  const bw = show.share ? 316 : 340;
  const wrap = show.share ? 37 : 38;
  const y0 = 12;
  const client = planBlock(c, y0, wrap);
  const a = y0 + client.h;
  const gap = show.input ? 210 : 180; // room for the flows between the client and the MSO
  const yMso = a + gap;
  const mso = planBlock(m, yMso, wrap);
  const msoEnd = yMso + mso.h;
  const opY = msoEnd + OWN_GAP;
  const operator = planBlock(o, opY, wrap);
  const f = structure.flows;
  const mid = bx + bw / 2;
  // Staggered so the labels do not overlap.
  const flows: Flow[] = show.input
    ? [
        { kind: "fee", d: `M${bx + 50} ${a} V${yMso}`, p: [bx + 50, a + 45], lines: pill(f.fee, 16) },
        { kind: "input", d: `M${mid} ${a} V${yMso}`, p: [mid, a + 105], lines: pill(f.input, 16) },
        { kind: "svc", d: `M${bx + bw - 50} ${yMso} V${a}`, p: [bx + bw - 50, a + 165], lines: pill(f.services, 16) },
      ]
    : [
        { kind: "fee", d: `M120 ${a} V${yMso}`, p: [120, a + 60], lines: pill(f.fee, 16) },
        { kind: "svc", d: `M252 ${yMso} V${a}`, p: [252, a + 120], lines: pill(f.services, 16) },
      ];
  flows.push({ kind: "owns", d: `M${mid} ${opY} V${msoEnd}`, p: [mid, msoEnd + OWN_GAP / 2], lines: [f.owns] });
  const ys = shareY(client);
  if (show.share && ys !== null) {
    const cx = bx / 2;
    flows.push({
      kind: "share",
      d: `M${bx} ${opY + Math.round(operator.h / 2)} H${cx} V${ys} H${bx}`,
      p: [cx, yMso + Math.round(mso.h / 2)],
      lines: [f.share],
      rotate: true,
    });
  }
  return {
    w: 372,
    h: opY + operator.h + 12,
    wrap,
    client: [bx, y0, bw, client.h],
    mso: [bx, yMso, bw, mso.h],
    operator: [bx, opY, bw, operator.h],
    plans: { client, mso, operator },
    flows,
  };
}

export function StructureDiagram() {
  const { audience } = useAudience();
  const { client, mso } = structure.blocks[audience];
  const op = structure.operator;
  const f = structure.flows;
  const firm = audience === "firm";
  const show: Show = { input: firm, share: firm && SHOW_NETWORK_VALUE };
  const equityLink = show.share ? groupsOf(client).find((g) => g.link)?.link : undefined;

  return (
    <div className="border-line-strong rounded-2xl border bg-[rgba(255,255,255,0.02)] p-3 sm:p-5 lg:p-8">
      <div aria-hidden="true" className="mx-auto hidden max-w-[1060px] md:block">
        <Diagram layout={wide(client, mso, op, show)} />
      </div>
      <div aria-hidden="true" className="mx-auto max-w-[420px] md:hidden">
        <Diagram layout={tall(client, mso, op, show)} />
      </div>
      <div className="sr-only">
        <p>
          {client.title} pays {mso.title} a {f.fee.toLowerCase()}
          {show.input ? ` and gives it ${f.input.toLowerCase()}` : ""}. {mso.title} provides{" "}
          {f.services.toLowerCase()} back to {client.title}. {op.title} owns and runs {mso.title}.
          {show.share ? ` ${client.title} shares in network value.` : ""}
        </p>
        {[client, mso, op].map((b) => (
          <div key={b.title}>
            <p>
              {b.title} ({b.eyebrow}): {b.sub}
            </p>
            {groupsOf(b).map((g, i) => (
              <div key={i}>
                {g.label ? <p>{g.label}</p> : null}
                <ul>
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* The diagram's link is mouse-only (the SVG is hidden from assistive tech); this one appears on focus. */}
      {equityLink ? (
        <a
          href={equityLink.href}
          className="sr-only focus:not-sr-only focus:mt-4 focus:inline-block focus:rounded focus:text-[14px] focus:text-[#82A5EB] focus:underline focus:outline-none focus:ring-2 focus:ring-[#5078DC]"
        >
          {equityLink.label}
        </a>
      ) : null}
      {firm ? <p className="text-fg-low mt-4 text-center text-[13px]">{structure.footnote}</p> : null}
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
        {(Object.keys(FLOW_COLOR) as FlowKind[]).map((k) => (
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
            <path d="M0 0 L10 5 L0 10 z" fill={FLOW_COLOR[k]} />
          </marker>
        ))}
      </defs>

      <Block
        rect={L.client}
        b={client}
        plan={L.plans.client}
        stroke="rgba(255,255,255,0.24)"
        fill="#111111"
        accent={FG_LOW}
        dot={FG_LOW}
      />
      <Block
        rect={L.mso}
        b={mso}
        plan={L.plans.mso}
        stroke="rgba(80,120,220,0.75)"
        fill="#0f1422"
        accent={SVC}
        dot={SVC}
      />
      <Block
        rect={L.operator}
        b={structure.operator}
        plan={L.plans.operator}
        stroke="rgba(95,199,154,0.7)"
        fill="#0e1a15"
        accent={GREEN}
        dot={GREEN}
      />

      {/* Lines first, then every pill on top, so a pill is never crossed by a line. */}
      {L.flows.map((fl) => (
        <path
          key={fl.kind}
          d={fl.d}
          fill="none"
          stroke={FLOW_COLOR[fl.kind]}
          strokeWidth="2"
          strokeDasharray={fl.kind === "share" ? "6 5" : undefined}
          markerEnd={`url(#${id}-${fl.kind})`}
        />
      ))}
      {L.flows.map((fl) => (
        <Pill key={fl.kind} flow={fl} width={L.w} />
      ))}
    </svg>
  );
}

function Lock({ x, y, color }: { x: number; y: number; color: string }) {
  // A small padlock whose body sits on the label baseline.
  return (
    <g>
      <path
        d={`M${x + 2} ${y - 6} v-2.5 a2.5 2.5 0 0 1 5 0 v2.5`}
        fill="none"
        stroke={color}
        strokeWidth="1.3"
      />
      <rect x={x} y={y - 6.5} width="9" height="7" rx="1.5" fill={color} />
    </g>
  );
}

function Block({
  rect: [x, y, w, h],
  b,
  plan,
  stroke,
  fill,
  accent,
  dot,
}: {
  rect: Rect;
  b: StructureBlock;
  plan: BlockPlan;
  stroke: string;
  fill: string;
  accent: string;
  dot: string;
}) {
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
      <text x={x + 22} y={y + SUB_TOP} className="font-body" fontSize="13" fill={FG_MID}>
        {plan.subLines.map((l, i) => (
          <tspan key={l} x={x + 22} dy={i === 0 ? 0 : SUB_GAP}>
            {l}
          </tspan>
        ))}
      </text>
      <line x1={x + 22} x2={x + w - 22} y1={plan.divY} y2={plan.divY} stroke={LINE} />
      {plan.groups.map((g, gi) => {
        const strong = g.id === "decides";
        return (
          <g key={g.label ?? gi}>
            {g.sepY !== undefined ? (
              <line x1={x + 22} x2={x + w - 22} y1={g.sepY} y2={g.sepY} stroke={SEP} />
            ) : null}
            {g.label ? (
              <>
                {strong ? <Lock x={x + 22} y={g.labelY} color={FG_MID} /> : null}
                <text
                  x={x + (strong ? 37 : 22)}
                  y={g.labelY}
                  className="font-mono-display"
                  fontSize="10.5"
                  fontWeight="500"
                  letterSpacing="1.3"
                  fill={strong ? FG : accent}
                >
                  {g.label.toUpperCase()}
                </text>
              </>
            ) : null}
            {g.rows.map(({ s, lines, y: first }) => (
              <g key={s}>
                <circle cx={x + 26} cy={first - 4} r="2.5" fill={strong ? FG_MID : dot} />
                <text
                  x={x + 38}
                  y={first}
                  className="font-body"
                  fontSize="13.5"
                  fill={strong ? ITEM_STRONG : ITEM}
                >
                  {lines.map((l, i) => (
                    <tspan key={l} x={x + 38} dy={i === 0 ? 0 : WRAP_GAP}>
                      {l}
                    </tspan>
                  ))}
                </text>
              </g>
            ))}
            {g.link ? (
              <a href={g.link.href} tabIndex={-1}>
                <text
                  x={x + 38}
                  y={g.link.y}
                  className="font-body hover:underline"
                  fontSize="12.5"
                  fontWeight="500"
                  fill={SVC}
                >
                  {g.link.label} →
                </text>
              </a>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

function Pill({ flow, width }: { flow: Flow; width: number }) {
  const color = FLOW_COLOR[flow.kind];
  const n = flow.lines.length;
  const w = Math.round(Math.max(...flow.lines.map((l) => l.length)) * 6.8 + 22);
  const h = 24 + (n - 1) * 16;
  // Kept inside the drawing (a rotated pill sits in its own channel).
  const cx = flow.rotate ? flow.p[0] : Math.min(Math.max(flow.p[0], w / 2 + 4), width - w / 2 - 4);
  const cy = flow.p[1];
  return (
    <g transform={flow.rotate ? `rotate(-90 ${cx} ${cy})` : undefined}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="12" fill={BG} stroke={color} strokeOpacity="0.6" />
      <text
        x={cx}
        y={cy - ((n - 1) * 16) / 2 + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-body"
        fontSize="12.5"
        fontWeight="500"
        fill={FG}
      >
        {flow.lines.map((l, i) => (
          <tspan key={l} x={cx} dy={i === 0 ? 0 : 16}>
            {l}
          </tspan>
        ))}
      </text>
    </g>
  );
}
