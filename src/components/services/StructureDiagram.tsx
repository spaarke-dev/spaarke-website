"use client";

import { useId, useState, type CSSProperties } from "react";
import {
  structure,
  type StructureEdge,
  type StructureEdgeKey,
  type StructureNode,
  type StructureEdgeType,
  type StructureNodeKey,
  type StructureView,
} from "@/app/services/content";
import { useAudience } from "./audience";
import { PillTabs } from "./PillTabs";

/**
 * The MSO structure visual (handoff 2026-11-22, notes/mso-structure-visual),
 * ported from the handoff's vanilla JS to JSX for the dark "What is Managed
 * Legal Operations" band. It replaces the allocation diagram.
 *
 * Five tabs (the full picture, ownership, direction, money, value) dim the
 * edges and nodes that do not belong to the view, and swap the three caption
 * cards. Above md the wide layout (1130 x 640) shows; below it the tall one
 * (372 x 1330). The diagrams are aria-hidden: the caption cards carry the
 * meaning for screen readers.
 *
 * Mapped to the site: surfaces, lines and text use the dark band tokens;
 * the MSO accent is the site blue (#5078DC / #82A5EB) in place of the
 * handoff's indigo. The five edge colors are the handoff's, because each one
 * is a meaning in the legend.
 */

const EDGE: Record<StructureEdgeType, string> = {
  own: "#B69CFF",
  money: "#F2B56B",
  svc: "#8A93A8",
  ctrl: "#F07AA8",
  value: "#3FD0B0",
};
const BLUE = "#82A5EB";
const TEAL = EDGE.value;
const FG = "#F5F5F5";
const FG_MID = "rgba(245,245,245,0.66)";
const FG_LOW = "rgba(245,245,245,0.55)";
const ITEM = "rgba(245,245,245,0.8)";
const LINE = "rgba(255,255,255,0.14)";
const SURFACE = "#111111";
const BG = "#0a0a0a";

type Rect = [number, number, number, number];
interface EdgeLayout {
  d: string;
  p: [number, number];
  both?: boolean;
  rot?: boolean;
}
interface Layout {
  w: number;
  h: number;
  short?: boolean;
  nodes: Record<StructureNodeKey, Rect>;
  brace: { r: Rect; lx: number; ly: number };
  edges: Record<StructureEdgeKey, EdgeLayout>;
}

/** Coordinates from the handoff, unchanged. */
const WIDE: Layout = {
  w: 1130,
  h: 640,
  nodes: {
    clients: [40, 24, 130, 64],
    partners: [190, 24, 130, 64],
    firm: [40, 150, 280, 300],
    mso: [470, 150, 280, 300],
    spaarke: [860, 150, 230, 250],
    network: [860, 490, 230, 80],
  },
  brace: { r: [24, 124, 312, 350], lx: 120, ly: 474 },
  edges: {
    fees: { d: "M105 88 V150", p: [105, 119] },
    ownFirm: { d: "M255 88 V150", p: [255, 119] },
    fee: { d: "M320 205 H470", p: [395, 205] },
    svc: { d: "M470 255 H320", p: [395, 255] },
    direct: { d: "M320 335 H470", p: [395, 335] },
    lic: { d: "M750 205 H860", p: [805, 205] },
    plat: { d: "M860 255 H750", p: [805, 255] },
    deploy: { d: "M860 300 H750", p: [805, 300] },
    ownMso: { d: "M860 345 H750", p: [805, 345] },
    equity: {
      d: "M860 380 H818 C806 380 800 388 800 400 V552 C800 562 794 566 784 566 H266 C256 566 250 560 250 550 V452",
      p: [525, 566],
    },
    net: { d: "M975 490 V400", p: [975, 445], both: true },
  },
};

const TALL: Layout = {
  w: 372,
  h: 1330,
  short: true,
  nodes: {
    clients: [16, 12, 150, 60],
    partners: [182, 12, 150, 60],
    firm: [16, 130, 316, 236],
    mso: [16, 574, 316, 236],
    spaarke: [16, 974, 316, 212],
    network: [16, 1244, 316, 70],
  },
  brace: { r: [8, 118, 332, 260], lx: 174, ly: 118 },
  edges: {
    fees: { d: "M91 72 V130", p: [91, 101] },
    ownFirm: { d: "M257 72 V130", p: [257, 101] },
    fee: { d: "M60 366 V574", p: [60, 460] },
    svc: { d: "M290 574 V366", p: [290, 480] },
    direct: { d: "M176 366 V574", p: [176, 440] },
    lic: { d: "M56 810 V974", p: [56, 870] },
    plat: { d: "M136 974 V810", p: [136, 920] },
    ownMso: { d: "M216 974 V810", p: [216, 870] },
    deploy: { d: "M296 974 V810", p: [296, 920] },
    equity: { d: "M332 1080 H352 V250 H334", p: [352, 680], rot: true },
    net: { d: "M174 1244 V1186", p: [174, 1215], both: true },
  },
};

/** Nodes faded in each view (not "all"), per audience. */
const DIM: Record<"firm" | "corporate", Record<Exclude<StructureView, "all">, StructureNodeKey[]>> = {
  firm: {
    own: ["clients", "network"],
    ctrl: ["clients", "network", "spaarke"],
    money: ["partners", "network"],
    value: ["clients"],
  },
  corporate: {
    own: ["clients", "partners", "network"],
    ctrl: ["clients", "partners", "network", "spaarke"],
    money: ["clients", "network"],
    value: ["clients", "partners"],
  },
};

const FADE: CSSProperties = { transition: "opacity 350ms ease" };

export function StructureDiagram() {
  const { audience } = useAudience();
  const [view, setView] = useState<StructureView>("all");
  const captions = structure.captions[audience][view];
  const legend = structure.legend[audience];

  return (
    <div>
      <PillTabs
        items={structure.views}
        value={view}
        onChange={setView}
        label="Structure views"
        controls="structure-captions"
      />

      <div className="border-line-strong mt-6 rounded-2xl border bg-[rgba(255,255,255,0.02)] p-3 sm:p-5 lg:p-7">
        <div aria-hidden="true" className="hidden md:block">
          <Diagram layout={WIDE} view={view} />
        </div>
        <div aria-hidden="true" className="mx-auto max-w-[420px] md:hidden">
          <Diagram layout={TALL} view={view} />
        </div>
        <ul className="text-fg-mid mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px]">
          {(Object.keys(legend) as StructureEdgeType[]).map((t) => (
            <li key={t} className="flex items-center gap-2">
              <svg aria-hidden="true" width="18" height="2" className="shrink-0">
                <line
                  x1="0"
                  y1="1"
                  x2="18"
                  y2="1"
                  stroke={EDGE[t]}
                  strokeWidth="2"
                  strokeDasharray={t === "value" ? "4 3" : undefined}
                />
              </svg>
              {legend[t]}
            </li>
          ))}
        </ul>
      </div>

      <div
        id="structure-captions"
        role="tabpanel"
        aria-live="polite"
        className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {captions.map(([title, body]) => (
          <div
            key={`${view}-${title}`}
            className="border-line-strong rounded-2xl border bg-[rgba(255,255,255,0.03)] p-6 motion-safe:animate-[services-fade_250ms_ease-out]"
          >
            <h3 className="font-mono-display text-[11px] uppercase tracking-[0.16em]" style={{ color: BLUE }}>
              {title}
            </h3>
            <p className="text-fg mt-3 text-[15px] leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Diagram({ layout: L, view }: { layout: Layout; view: StructureView }) {
  const { audience } = useAudience();
  const nodes: Record<StructureNodeKey, StructureNode> = structure.nodes[audience];
  const edges: Record<StructureEdgeKey, StructureEdge> = structure.edges[audience];
  const id = useId().replace(/:/g, "");
  const dim = view === "all" ? [] : DIM[audience][view];
  const edgeOn = (t: StructureEdgeType, also?: StructureEdgeType) => view === "all" || t === view || also === view;
  const braceLabel = structure.brace[audience];
  const b = L.brace;
  const bw = braceLabel.length * 7.6 + 24;

  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} className="block h-auto w-full">
      <defs>
        {(Object.keys(EDGE) as StructureEdgeType[]).map((t) => (
          <marker
            key={t}
            id={`${id}-a-${t}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={EDGE[t]} />
          </marker>
        ))}
      </defs>

      {/* What the firm owns / what the department keeps */}
      <g style={{ ...FADE, opacity: view === "all" || view === "value" ? 1 : 0.1 }}>
        <rect
          x={b.r[0]}
          y={b.r[1]}
          width={b.r[2]}
          height={b.r[3]}
          rx="18"
          fill="rgba(63,208,176,0.035)"
          stroke={TEAL}
          strokeDasharray="4 6"
          strokeWidth="1.2"
        />
        <rect x={b.lx - bw / 2} y={b.ly - 11} width={bw} height="22" rx="11" fill={BG} />
        <text
          x={b.lx}
          y={b.ly + 4}
          textAnchor="middle"
          className="font-mono-display"
          fontSize="10.5"
          fontWeight="500"
          letterSpacing="1.3"
          fill={TEAL}
        >
          {braceLabel.toUpperCase()}
        </text>
      </g>

      {(Object.keys(L.nodes) as StructureNodeKey[]).map((k) => {
        const n = nodes[k];
        const [x, y, w, h] = L.nodes[k];
        const small = !n.items;
        const kind = k === "mso" ? "mso" : k === "spaarke" ? "spaarke" : k === "firm" ? "firm" : "small";
        const stroke =
          kind === "mso"
            ? "rgba(80,120,220,0.75)"
            : kind === "spaarke"
              ? "rgba(63,208,176,0.5)"
              : kind === "firm"
                ? "rgba(255,255,255,0.24)"
                : LINE;
        const fill = kind === "mso" ? "#0f1422" : SURFACE;
        const accent = kind === "mso" ? BLUE : kind === "spaarke" ? TEAL : FG_LOW;
        return (
          <g key={k} style={{ ...FADE, opacity: dim.includes(k) ? 0.35 : 1 }}>
            {k === "network" ? (
              <>
                <rect x={x + 12} y={y + 12} width={w} height={h} rx="14" fill="#161616" stroke={LINE} />
                <rect x={x + 6} y={y + 6} width={w} height={h} rx="14" fill="#161616" stroke={LINE} />
              </>
            ) : null}
            <rect x={x} y={y} width={w} height={h} rx="14" fill={fill} stroke={stroke} />
            {small ? (
              <>
                <text x={x + 16} y={y + (h > 62 ? 28 : 26)} className="font-display" fontSize="15" fontWeight="500" fill={FG}>
                  {n.title}
                </text>
                <text x={x + 16} y={y + (h > 62 ? 48 : 45)} className="font-body" fontSize="12.5" fill={FG_MID}>
                  {n.sub}
                </text>
              </>
            ) : (
              <>
                <text
                  x={x + 20}
                  y={y + 28}
                  className="font-mono-display"
                  fontSize="10.5"
                  fontWeight="500"
                  letterSpacing="1.3"
                  fill={accent}
                >
                  {n.eyebrow?.toUpperCase()}
                </text>
                <text x={x + 20} y={y + 56} className="font-display" fontSize="19" fontWeight="500" fill={FG}>
                  {n.title}
                </text>
                <text x={x + 20} y={y + 77} className="font-body" fontSize="12.5" fill={FG_MID}>
                  {n.sub}
                </text>
                <line x1={x + 20} x2={x + w - 20} y1={y + 94} y2={y + 94} stroke={LINE} />
                {n.items?.map((s, i) => {
                  const yy = y + 120 + i * 24;
                  return (
                    <g key={s}>
                      <circle cx={x + 24} cy={yy - 4} r="2.5" fill={kind === "firm" ? FG_LOW : accent} />
                      <text x={x + 36} y={yy} className="font-body" fontSize="13" fill={ITEM}>
                        {s}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </g>
        );
      })}

      {(Object.keys(L.edges) as StructureEdgeKey[]).map((k) => {
        const E = edges[k];
        const g = L.edges[k];
        const color = EDGE[E.t];
        const label = (L.short && E.short) || E.label;
        const w = label.length * 6.4 + 18;
        const marker = `url(#${id}-a-${E.t})`;
        return (
          <g key={k} style={{ ...FADE, opacity: edgeOn(E.t, E.also) ? 1 : 0.1 }}>
            <path
              d={g.d}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeDasharray={E.t === "value" ? "6 5" : undefined}
              markerEnd={marker}
              markerStart={g.both ? marker : undefined}
            />
            <g transform={g.rot ? `rotate(-90 ${g.p[0]} ${g.p[1]})` : undefined}>
              <rect
                x={g.p[0] - w / 2}
                y={g.p[1] - 11}
                width={w}
                height="22"
                rx="11"
                fill={BG}
                stroke={color}
                strokeOpacity="0.6"
              />
              <text
                x={g.p[0]}
                y={g.p[1] + 0.5}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-body"
                fontSize="11.5"
                fontWeight="500"
                fill={FG}
              >
                {label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
