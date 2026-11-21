"use client";

import { useEffect, useState } from "react";
import { network } from "@/app/services/content";
import { useAudience, useInView } from "./audience";

/**
 * Operator network diagram (design.md 4.5 and 6.2). Spaarke, the operating
 * company, sits in the center with its capabilities; client and MLO pairs sit
 * around it. Gray lines are the services agreement between a client and its
 * MLO; blue lines are operator services from Spaarke to each MLO. Pairs enter
 * one by one, lines draw in, then a pulse travels along the blue lines. Under
 * reduced motion the final state shows with no pulse. Below md the SVG is
 * replaced by a stacked version, because its labels would be too small.
 */

const W = 1000;
const H = 660;
const CX = W / 2;
const CY = H / 2;
const HUB_R = 168;
const RX = 380;
const RY = 255;
const CLIENT_W = 128;
const MLO_W = 72;
const GAP = 14;
const BOX_H = 40;

const BLUE = "#5078DC";
const BLUE_SOFT = "#82A5EB";
const GRAY = "rgba(255,255,255,0.32)";

type Pair = {
  key: number;
  clientX: number;
  mloX: number;
  y: number;
  /** Operator line, MLO box edge to the hub's rim. */
  line: { x1: number; y1: number; x2: number; y2: number; length: number };
};

function layout(count: number): Pair[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const px = CX + RX * Math.cos(angle);
    const py = CY + RY * Math.sin(angle);
    const groupW = CLIENT_W + GAP + MLO_W;
    const left = px - groupW / 2;
    // The MLO box sits on the side nearer the hub.
    const onLeft = px < CX;
    const clientX = onLeft ? left : left + MLO_W + GAP;
    const mloX = onLeft ? left + CLIENT_W + GAP : left;
    const mx = mloX + MLO_W / 2;
    const my = py;
    const startX = onLeft ? mloX + MLO_W : mloX;
    const dx = CX - mx;
    const dy = CY - my;
    const d = Math.hypot(dx, dy);
    const x2 = CX - (dx / d) * HUB_R;
    const y2 = CY - (dy / d) * HUB_R;
    // Rounded so the server and the browser print identical attributes
    // (their trig results can differ in the last digits).
    const r = (v: number) => Math.round(v * 100) / 100;
    return {
      key: i,
      clientX: r(clientX),
      mloX: r(mloX),
      y: r(py - BOX_H / 2),
      line: { x1: r(startX), y1: r(my), x2: r(x2), y2: r(y2), length: r(Math.hypot(x2 - startX, y2 - my)) },
    };
  });
}

const PAIRS = layout(network.pairCount);
const STAGGER = 260;

export function NetworkDiagram() {
  const { audience } = useAudience();
  const labels = network.pairLabel[audience];
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const [built, setBuilt] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = requestAnimationFrame(() => setBuilt(true));
    return () => cancelAnimationFrame(id);
  }, [inView]);

  const show = built || reduced;
  const pulseDelay = PAIRS.length * STAGGER + 600;

  return (
    <div ref={ref}>
      <div
        className="hidden overflow-hidden rounded-3xl border md:block"
        style={{
          backgroundColor: "#111111",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Spaarke, the MSO operator, at the center with ${network.hub.capabilities.join(", ")}. Around it, ${PAIRS.length} pairs of ${labels.client} and ${labels.mlo}, each joined by a services agreement, and each ${labels.mlo} connected to Spaarke by operator services.`}
        >
          <defs>
            <radialGradient id="svc-hub" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="rgba(130,165,235,0.22)" />
              <stop offset="100%" stopColor="rgba(80,120,220,0.06)" />
            </radialGradient>
          </defs>

          {/* Operator lines (blue), drawn in after their pair appears. */}
          {PAIRS.map((p, i) => (
            <g key={`op-${p.key}`}>
              <line
                x1={p.line.x1}
                y1={p.line.y1}
                x2={p.line.x2}
                y2={p.line.y2}
                stroke={BLUE}
                strokeWidth={2}
                strokeDasharray={p.line.length}
                strokeDashoffset={show ? 0 : p.line.length}
                style={{
                  transition: reduced ? "none" : `stroke-dashoffset 600ms ease-out ${i * STAGGER + 200}ms`,
                }}
              />
              {!reduced && show && (
                <line
                  x1={p.line.x1}
                y1={p.line.y1}
                x2={p.line.x2}
                y2={p.line.y2}
                  stroke={BLUE_SOFT}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray="6 114"
                  className="motion-safe:animate-[services-pulse_2.4s_linear_infinite]"
                  style={{ animationDelay: `${pulseDelay + i * 180}ms`, opacity: 0.9 }}
                />
              )}
            </g>
          ))}

          {/* Hub */}
          <circle cx={CX} cy={CY} r={HUB_R} fill="url(#svc-hub)" stroke={BLUE} strokeWidth={1.5} />
          <text x={CX} y={CY - 100} textAnchor="middle" className="font-display" fill="#ffffff" fontSize={30} fontWeight={600}>
            {network.hub.title}
          </text>
          <text
            x={CX}
            y={CY - 74}
            textAnchor="middle"
            fill={BLUE_SOFT}
            fontSize={12}
            letterSpacing="0.16em"
            className="font-mono-display"
          >
            {network.hub.subtitle.toUpperCase()}
          </text>
          {network.hub.capabilities.map((c, i) => (
            <text key={c} x={CX} y={CY - 40 + i * 22} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize={15} className="font-body">
              {c}
            </text>
          ))}

          {/* Pairs */}
          {PAIRS.map((p, i) => (
            <g
              key={`pair-${p.key}`}
              style={{
                opacity: show ? 1 : 0,
                transition: reduced ? "none" : `opacity 400ms ease-out ${i * STAGGER}ms`,
              }}
            >
              {/* Agreement line (gray) between client and MLO */}
              <line
                x1={Math.min(p.clientX, p.mloX) + (p.clientX < p.mloX ? CLIENT_W : MLO_W)}
                x2={Math.max(p.clientX, p.mloX)}
                y1={p.y + BOX_H / 2}
                y2={p.y + BOX_H / 2}
                stroke={GRAY}
                strokeWidth={1.5}
              />
              <rect x={p.clientX} y={p.y} width={CLIENT_W} height={BOX_H} rx={10} fill="#1a1a1a" stroke={GRAY} />
              <text x={p.clientX + CLIENT_W / 2} y={p.y + BOX_H / 2} dy="0.35em" textAnchor="middle" fill="#ffffff" fontSize={14} className="font-body">
                {labels.client}
              </text>
              <rect x={p.mloX} y={p.y} width={MLO_W} height={BOX_H} rx={10} fill={BLUE} />
              <text x={p.mloX + MLO_W / 2} y={p.y + BOX_H / 2} dy="0.35em" textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600} className="font-body">
                {labels.mlo}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Phone version: hub card and a list of pairs. */}
      <div className="md:hidden">
        <div className="rounded-3xl border p-6 text-center" style={{ borderColor: BLUE, background: "rgba(80,120,220,0.10)" }}>
          <p className="font-display text-fg text-2xl font-semibold">{network.hub.title}</p>
          <p className="font-mono-display mt-1 text-[11px] uppercase tracking-[0.16em]" style={{ color: BLUE_SOFT }}>
            {network.hub.subtitle}
          </p>
          <ul className="text-fg-mid mt-4 space-y-1.5 text-[15px]">
            {network.hub.capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="mx-auto h-6 w-0.5" style={{ background: BLUE }} aria-hidden="true" />
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PAIRS.map((p) => (
            <li key={p.key} className="flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.1)] p-2">
              <span className="text-fg flex-1 rounded-lg border border-[rgba(255,255,255,0.3)] px-3 py-2 text-center text-[14px]">{labels.client}</span>
              <span className="h-px w-3" style={{ background: GRAY }} aria-hidden="true" />
              <span className="rounded-lg px-3 py-2 text-[14px] font-semibold text-white" style={{ background: BLUE }}>
                {labels.mlo}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Legend */}
      <ul className="text-fg-mid mt-6 flex flex-col gap-3 text-[14px] sm:flex-row sm:gap-8">
        <li className="flex items-center gap-3">
          <span className="inline-block h-px w-8" style={{ background: GRAY, height: 2 }} aria-hidden="true" />
          {network.legend.agreement}
        </li>
        <li className="flex items-center gap-3">
          <span className="inline-block w-8" style={{ background: BLUE, height: 2 }} aria-hidden="true" />
          {network.legend.operator}
        </li>
      </ul>
    </div>
  );
}
