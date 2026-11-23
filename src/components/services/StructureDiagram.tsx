"use client";

import { useId, type ComponentType } from "react";
import { DataTrending16Regular, Gavel16Regular, Megaphone16Regular } from "@fluentui/react-icons";
import { SHOW_NETWORK_VALUE, structure, type StructureBlock, type StructureGroup } from "@/app/services/content";
import { useAudienceMaybe, type Audience } from "./audience";

/**
 * "What is Managed Legal Operations" diagram, from the structure visual
 * handoff (notes/mso-structure-visual), simplified at the owner's request on
 * 2026-11-22, then rebuilt to the owner's diagram spec the same day
 * (spaarke-structure-diagram-spec.md):
 *
 * - The law firm box groups its items under DECIDES (the most weight), HAS A
 *   SAY and SHARES IN, each with an icon (gavel, megaphone, trend), and runs
 *   the full height of the MSO and the operator. Spare height goes between
 *   the groups.
 * - Connector labels are two lines, spread evenly down the MSO. The network
 *   value arrow is centered on the operator. (Owner, 2026-11-22; the "vary by
 *   state" footnote is out, as no state restriction applies.)
 * - Connectors: the fee and the firm's input go to the MSO, operations and
 *   technology come back, the operator "owns and runs" the MSO, and (law firm
 *   view, behind SHOW_NETWORK_VALUE) a dashed green arrow carries network
 *   value from the operator to the firm's SHARES IN group.
 *
 * Above md the blocks sit side by side; below it they stack, and the network
 * value arrow runs up a channel on the left. Block heights follow their
 * items, and long items wrap to a second line. The SVG is aria-hidden, so the
 * same content is given to screen readers as text. Site tokens throughout:
 * site blue for the MSO, green for the operator, amber for money (the
 * handoff's money color), neutral for the firm. Dark on /services; light on
 * the estimate page, which is one light theme (value page row 18).
 */

type Rect = [number, number, number, number];
type FlowKind = "fee" | "input" | "svc" | "owns" | "share";
type Tone = "dark" | "light";
type BlockColors = { stroke: string; fill: string; accent: string };

interface Palette {
  fg: string;
  fgMid: string;
  item: string;
  itemStrong: string;
  line: string;
  sep: string;
  pillBg: string;
  link: string;
  flow: Record<FlowKind, string>;
  client: BlockColors;
  mso: BlockColors;
  operator: BlockColors;
}

const PALETTES: Record<Tone, Palette> = {
  dark: {
    fg: "#F5F5F5",
    fgMid: "rgba(245,245,245,0.66)",
    item: "rgba(245,245,245,0.8)",
    itemStrong: "rgba(245,245,245,0.92)",
    line: "rgba(255,255,255,0.14)",
    sep: "rgba(255,255,255,0.08)",
    pillBg: "#0a0a0a",
    link: "#82A5EB",
    flow: { fee: "#F2B56B", input: "#B9B9B4", svc: "#82A5EB", owns: "#5FC79A", share: "#5FC79A" },
    client: { stroke: "rgba(255,255,255,0.24)", fill: "#111111", accent: "rgba(245,245,245,0.55)" },
    mso: { stroke: "rgba(80,120,220,0.75)", fill: "#0f1422", accent: "#82A5EB" },
    operator: { stroke: "rgba(95,199,154,0.7)", fill: "#0e1a15", accent: "#5FC79A" },
  },
  light: {
    fg: "#0a0a0a",
    fgMid: "rgba(10,10,10,0.72)",
    item: "rgba(10,10,10,0.84)",
    itemStrong: "rgba(10,10,10,0.94)",
    line: "rgba(10,10,10,0.12)",
    sep: "rgba(10,10,10,0.08)",
    pillBg: "#ffffff",
    link: "#3F5FD9",
    flow: { fee: "#B86A12", input: "#77776F", svc: "#3F5FD9", owns: "#1F7A50", share: "#1F7A50" },
    client: { stroke: "rgba(10,10,10,0.22)", fill: "#f6f6f4", accent: "rgba(10,10,10,0.68)" },
    mso: { stroke: "rgba(80,120,220,0.6)", fill: "#EBF2FF", accent: "#3F5FD9" },
    operator: { stroke: "rgba(31,122,80,0.5)", fill: "#EAF6EF", accent: "#1F7A50" },
  },
};

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
    return { id: g.id, label, labelY, sepY, rows };
  });
  return { subLines, divY, groups: plans, h: last + PAD_BOTTOM - top };
}

/** Text center of the SHARES IN item, where the network value arrow lands. */
function shareY(p: BlockPlan) {
  const g = p.groups.find((x) => x.id === "shares");
  return g?.rows[0] ? g.rows[0].y - 4 : null;
}

const GROUP_ICON: Record<StructureGroup["id"], ComponentType<{ className?: string }>> = {
  decides: Gavel16Regular,
  say: Megaphone16Regular,
  shares: DataTrending16Regular,
};

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
  // Spread evenly down the MSO: quarters with three flows, thirds with two.
  const n = show.input ? 4 : 3;
  const at = (i: number) => top + Math.round((mso.h * i) / n);
  const flows: Flow[] = [
    { kind: "fee", d: `M380 ${at(1)} H620`, p: [500, at(1)], lines: f.fee },
    { kind: "svc", d: `M620 ${at(n - 1)} H380`, p: [500, at(n - 1)], lines: f.services },
    { kind: "owns", d: `M800 ${opY} V${top + mso.h}`, p: [800, top + mso.h + OWN_GAP / 2], lines: f.owns },
  ];
  if (show.input) {
    flows.push({ kind: "input", d: `M380 ${at(2)} H620`, p: [500, at(2)], lines: f.input });
  }
  if (show.share) {
    // Centered on the operator.
    const ys = opY + Math.round((h - mso.h - OWN_GAP) / 2);
    flows.push({ kind: "share", d: `M620 ${ys} H380`, p: [500, ys], lines: f.share });
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
        { kind: "fee", d: `M${bx + 50} ${a} V${yMso}`, p: [bx + 50, a + 45], lines: f.fee },
        { kind: "input", d: `M${mid} ${a} V${yMso}`, p: [mid, a + 105], lines: f.input },
        { kind: "svc", d: `M${bx + bw - 50} ${yMso} V${a}`, p: [bx + bw - 50, a + 165], lines: f.services },
      ]
    : [
        { kind: "fee", d: `M120 ${a} V${yMso}`, p: [120, a + 60], lines: f.fee },
        { kind: "svc", d: `M252 ${yMso} V${a}`, p: [252, a + 120], lines: f.services },
      ];
  flows.push({ kind: "owns", d: `M${mid} ${opY} V${msoEnd}`, p: [mid, msoEnd + OWN_GAP / 2], lines: f.owns });
  const ys = shareY(client);
  if (show.share && ys !== null) {
    const cx = bx / 2;
    flows.push({
      kind: "share",
      d: `M${bx} ${opY + Math.round(operator.h / 2)} H${cx} V${ys} H${bx}`,
      p: [cx, yMso + Math.round(mso.h / 2)],
      // One line here: the channel is too narrow for two.
      lines: [f.share.join(" ")],
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

/**
 * `audience` is for pages outside the /services audience switch (the estimate
 * page); `tone` picks the dark or light palette; `sharesHref` links the
 * SHARES IN item to the equity card where the page has one (round 2, row 4).
 */
export function StructureDiagram({
  audience: forced,
  tone = "dark",
  sharesHref,
}: { audience?: Audience; tone?: Tone; sharesHref?: string } = {}) {
  const fromPage = useAudienceMaybe();
  const audience = forced ?? fromPage ?? "firm";
  const pal = PALETTES[tone];
  const { client, mso } = structure.blocks[audience];
  const op = structure.operator;
  const f = Object.fromEntries(
    Object.entries(structure.flows).map(([k, v]) => [k, v.join(" ").toLowerCase()]),
  ) as Record<keyof typeof structure.flows, string>;
  const firm = audience === "firm";
  const show: Show = { input: firm, share: firm && SHOW_NETWORK_VALUE };

  return (
    <div
      className={`border-line-strong rounded-2xl border p-3 sm:p-5 lg:p-8 ${tone === "light" ? "bg-white" : "bg-[rgba(255,255,255,0.02)]"}`}
    >
      <div aria-hidden="true" className="mx-auto hidden max-w-[1060px] md:block">
        <Diagram layout={wide(client, mso, op, show)} audience={audience} pal={pal} sharesHref={sharesHref} />
      </div>
      <div aria-hidden="true" className="mx-auto max-w-[420px] md:hidden">
        <Diagram layout={tall(client, mso, op, show)} audience={audience} pal={pal} sharesHref={sharesHref} />
      </div>
      <div className="sr-only">
        <p>
          {client.title} pays {mso.title} a {f.fee}
          {show.input ? ` and gives it ${f.input}` : ""}. {mso.title} provides {f.services} back to{" "}
          {client.title}. {op.title} owns and runs {mso.title}.
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
    </div>
  );
}

function Diagram({
  layout: L,
  audience,
  pal,
  sharesHref,
}: {
  layout: Layout;
  audience: Audience;
  pal: Palette;
  sharesHref?: string;
}) {
  const { client, mso } = structure.blocks[audience];
  const id = useId().replace(/:/g, "");

  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} className="block h-auto w-full">
      <defs>
        {(Object.keys(pal.flow) as FlowKind[]).map((k) => (
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
            <path d="M0 0 L10 5 L0 10 z" fill={pal.flow[k]} />
          </marker>
        ))}
      </defs>

      <Block rect={L.client} b={client} plan={L.plans.client} colors={pal.client} pal={pal} sharesHref={sharesHref} />
      <Block rect={L.mso} b={mso} plan={L.plans.mso} colors={pal.mso} pal={pal} />
      <Block rect={L.operator} b={structure.operator} plan={L.plans.operator} colors={pal.operator} pal={pal} />

      {/* Lines first, then every pill on top, so a pill is never crossed by a line. */}
      {L.flows.map((fl) => (
        <path
          key={fl.kind}
          d={fl.d}
          fill="none"
          stroke={pal.flow[fl.kind]}
          strokeWidth="2"
          strokeDasharray={fl.kind === "share" ? "6 5" : undefined}
          markerEnd={`url(#${id}-${fl.kind})`}
        />
      ))}
      {L.flows.map((fl) => (
        <Pill key={fl.kind} flow={fl} width={L.w} pal={pal} />
      ))}
    </svg>
  );
}

/** A group's icon, 14 units square, sitting on the label baseline. */
function GroupIcon({ id, x, y, color }: { id: StructureGroup["id"]; x: number; y: number; color: string }) {
  const Icon = GROUP_ICON[id];
  return (
    <g transform={`translate(${x} ${y - 11}) scale(0.875)`} style={{ color }}>
      <Icon />
    </g>
  );
}

function Block({
  rect: [x, y, w, h],
  b,
  plan,
  colors: { stroke, fill, accent },
  pal,
  sharesHref,
}: {
  rect: Rect;
  b: StructureBlock;
  plan: BlockPlan;
  colors: BlockColors;
  pal: Palette;
  sharesHref?: string;
}) {
  const dot = accent;
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
      <text x={x + 22} y={y + 60} className="font-display" fontSize="20" fontWeight="500" fill={pal.fg}>
        {b.title}
      </text>
      <text x={x + 22} y={y + SUB_TOP} className="font-body" fontSize="13" fill={pal.fgMid}>
        {plan.subLines.map((l, i) => (
          <tspan key={l} x={x + 22} dy={i === 0 ? 0 : SUB_GAP}>
            {l}
          </tspan>
        ))}
      </text>
      <line x1={x + 22} x2={x + w - 22} y1={plan.divY} y2={plan.divY} stroke={pal.line} />
      {plan.groups.map((g, gi) => {
        const strong = g.id === "decides";
        return (
          <g key={g.label ?? gi}>
            {g.sepY !== undefined ? (
              <line x1={x + 22} x2={x + w - 22} y1={g.sepY} y2={g.sepY} stroke={pal.sep} />
            ) : null}
            {g.label ? (
              <>
                {g.id ? <GroupIcon id={g.id} x={x + 21} y={g.labelY} color={strong ? pal.fgMid : accent} /> : null}
                <text
                  x={x + (g.id ? 40 : 22)}
                  y={g.labelY}
                  className="font-mono-display"
                  fontSize="10.5"
                  fontWeight="500"
                  letterSpacing="1.3"
                  fill={strong ? pal.fg : accent}
                >
                  {g.label.toUpperCase()}
                </text>
              </>
            ) : null}
            {g.rows.map(({ s, lines, y: first }) => {
              // Mouse-only (the SVG is hidden from assistive tech); the page's
              // "How equity value is calculated" link is the keyboard route.
              const href = g.id === "shares" ? sharesHref : undefined;
              const text = (
                <text
                  x={x + 38}
                  y={first}
                  className={`font-body ${href ? "underline-offset-2 hover:underline" : ""}`}
                  fontSize="13.5"
                  fill={href ? pal.link : strong ? pal.itemStrong : pal.item}
                >
                  {lines.map((l, i) => (
                    <tspan key={l} x={x + 38} dy={i === 0 ? 0 : WRAP_GAP}>
                      {l}
                    </tspan>
                  ))}
                </text>
              );
              return (
                <g key={s}>
                  <circle cx={x + 26} cy={first - 4} r="2.5" fill={strong ? pal.fgMid : dot} />
                  {href ? (
                    <a href={href} tabIndex={-1}>
                      {text}
                    </a>
                  ) : (
                    text
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

function Pill({ flow, width, pal }: { flow: Flow; width: number; pal: Palette }) {
  const color = pal.flow[flow.kind];
  const n = flow.lines.length;
  const w = Math.round(Math.max(...flow.lines.map((l) => l.length)) * 6.8 + 22);
  const h = 24 + (n - 1) * 16;
  // Kept inside the drawing (a rotated pill sits in its own channel).
  const cx = flow.rotate ? flow.p[0] : Math.min(Math.max(flow.p[0], w / 2 + 4), width - w / 2 - 4);
  const cy = flow.p[1];
  return (
    <g transform={flow.rotate ? `rotate(-90 ${cx} ${cy})` : undefined}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="12" fill={pal.pillBg} stroke={color} strokeOpacity="0.6" />
      <text
        x={cx}
        y={cy - ((n - 1) * 16) / 2 + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-body"
        fontSize="12.5"
        fontWeight="500"
        fill={pal.fg}
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
