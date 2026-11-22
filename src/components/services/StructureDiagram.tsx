"use client";

import { useId } from "react";
import { structure, type StructureBlock } from "@/app/services/content";
import { useAudience } from "./audience";

/**
 * "What is Managed Legal Operations" diagram, from the structure visual
 * handoff (notes/mso-structure-visual), simplified at the owner's request on
 * 2026-11-22: the client block and its MSO only, a fixed fee flowing to the
 * MSO and captive services flowing back. No tabs, legend or captions.
 *
 * Above md the blocks sit side by side; below it they stack. The SVG is
 * aria-hidden, so the same content is given to screen readers as text.
 * Site tokens throughout: dark surfaces, site blue for the MSO, amber for
 * money (the handoff's money color).
 */

const FEE = "#F2B56B";
const SVC = "#82A5EB";
const FG = "#F5F5F5";
const FG_MID = "rgba(245,245,245,0.66)";
const FG_LOW = "rgba(245,245,245,0.55)";
const ITEM = "rgba(245,245,245,0.8)";
const LINE = "rgba(255,255,255,0.14)";
const BG = "#0a0a0a";

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
  fee: Flow;
  services: Flow;
}

const WIDE: Layout = {
  w: 900,
  h: 300,
  client: [20, 20, 330, 260],
  mso: [550, 20, 330, 260],
  fee: { d: "M350 110 H550", p: [450, 110] },
  services: { d: "M550 190 H350", p: [450, 190] },
};

const TALL: Layout = {
  w: 372,
  h: 676,
  client: [16, 12, 340, 236],
  mso: [16, 428, 340, 236],
  fee: { d: "M120 248 V428", p: [120, 338] },
  services: { d: "M252 428 V248", p: [252, 338] },
};

export function StructureDiagram() {
  const { audience } = useAudience();
  const { client, mso } = structure.blocks[audience];
  const { fee, services } = structure.flows;

  return (
    <div className="border-line-strong rounded-2xl border bg-[rgba(255,255,255,0.02)] p-3 sm:p-5 lg:p-8">
      <div
        aria-hidden="true"
        className="mx-auto hidden max-w-[1000px] md:block"
      >
        <Diagram layout={WIDE} />
      </div>
      <div aria-hidden="true" className="mx-auto max-w-[420px] md:hidden">
        <Diagram layout={TALL} />
      </div>
      <div className="sr-only">
        <p>
          {client.title} pays {mso.title} a {fee.toLowerCase()}, and {mso.title}{" "}
          provides {services.toLowerCase()} back to {client.title}.
        </p>
        {[client, mso].map((b) => (
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
        stroke="rgba(255,255,255,0.24)"
        fill="#111111"
        accent={FG_LOW}
        dot={FG_LOW}
      />
      <Block
        rect={L.mso}
        b={mso}
        stroke="rgba(80,120,220,0.75)"
        fill="#0f1422"
        accent={SVC}
        dot={SVC}
      />

      <FlowLine
        flow={L.fee}
        color={FEE}
        marker={`url(#${id}-fee)`}
        label={structure.flows.fee}
      />
      <FlowLine
        flow={L.services}
        color={SVC}
        marker={`url(#${id}-svc)`}
        label={structure.flows.services}
      />
    </svg>
  );
}

function Block({
  rect: [x, y, w, h],
  b,
  stroke,
  fill,
  accent,
  dot,
}: {
  rect: Rect;
  b: StructureBlock;
  stroke: string;
  fill: string;
  accent: string;
  dot: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        fill={fill}
        stroke={stroke}
      />
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
      <text
        x={x + 22}
        y={y + 60}
        className="font-display"
        fontSize="20"
        fontWeight="500"
        fill={FG}
      >
        {b.title}
      </text>
      <text
        x={x + 22}
        y={y + 82}
        className="font-body"
        fontSize="13"
        fill={FG_MID}
      >
        {b.sub}
      </text>
      <line
        x1={x + 22}
        x2={x + w - 22}
        y1={y + 100}
        y2={y + 100}
        stroke={LINE}
      />
      {b.items.map((s, i) => {
        const yy = y + 128 + i * 24;
        return (
          <g key={s}>
            <circle cx={x + 26} cy={yy - 4} r="2.5" fill={dot} />
            <text
              x={x + 38}
              y={yy}
              className="font-body"
              fontSize="13.5"
              fill={ITEM}
            >
              {s}
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
  const w = label.length * 6.8 + 22;
  return (
    <g>
      <path
        d={flow.d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        markerEnd={marker}
      />
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
