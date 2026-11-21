"use client";

import { useEffect, useRef, useState } from "react";
import { network, type NetworkClient } from "@/app/services/content";
import { useAudience } from "./audience";

/**
 * Operator network diagram (design.md 4.5 and 6.2). Spaarke, the MSO
 * operator, sits in the center with its capabilities; client and MSO pairs
 * sit around it, law firms and legal departments together, with the
 * visitor's own type emphasized. Gray lines are the services agreement
 * between a client and its MSO; blue lines are operator services from
 * Spaarke to each MSO, with a pulse traveling outward.
 *
 * "The network grows": as the visitor scrolls through the section, pairs
 * join one at a time and the ring re-balances so the pairs stay evenly
 * spaced. Each pair sits on a line out from the hub (MSO nearer the hub,
 * client further out), so a pair can glide to any angle without its boxes
 * swapping sides. The server renders the full network; the browser starts
 * it small only when the diagram is still below the fold. Under reduced
 * motion the full network shows with no pulse. Below md the SVG is replaced
 * by a stacked list, because its labels would be too small.
 */

const W = 1000;
const H = 660;
const CX = W / 2;
const CY = H / 2;
const HUB_R = 168;
/** Ellipse the MSO boxes sit on. */
const RXM = 296;
const RYM = 240;
/** Offset from an MSO box to its client box, outward from the hub. */
const OUT_X = 128;
const OUT_Y = 60;
const CLIENT_W = 140;
const MSO_W = 72;
const BOX_H = 40;
const TWEEN_MS = 700;

const BLUE = "#5078DC";
const BLUE_SOFT = "#82A5EB";
const GRAY = "rgba(255,255,255,0.32)";

/** Evenly spaced angles for n pairs, rotated so every count looks balanced. */
const slot = (i: number, n: number) => -Math.PI / 2 + Math.PI / n + (i * 2 * Math.PI) / n;
const slots = (n: number) => Array.from({ length: n }, (_, i) => slot(i, n));

// Rounded so the server and the browser print identical attributes (their
// trig results can differ in the last digits).
const r2 = (v: number) => Math.round(v * 100) / 100;

function place(a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const mx = CX + RXM * c;
  const my = CY + RYM * s;
  const d = Math.hypot(mx - CX, my - CY);
  return {
    mso: { x: r2(mx), y: r2(my) },
    client: { x: r2(mx + OUT_X * c), y: r2(my + OUT_Y * s) },
    rim: { x: r2(CX + ((mx - CX) / d) * HUB_R), y: r2(CY + ((my - CY) / d) * HUB_R) },
  };
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function NetworkDiagram() {
  const { audience } = useAudience();
  const kinds = network.pairs[audience];
  const own: NetworkClient = audience === "firm" ? "firm" : "department";
  const total = kinds.length;

  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [count, setCount] = useState(total);
  const [angles, setAngles] = useState(() => slots(total));
  const anglesRef = useRef(angles);
  const instant = useRef(false);

  // How many pairs have joined, from how far the diagram has scrolled up.
  const targetCount = () => {
    const el = ref.current;
    if (!el) return total;
    const top = el.getBoundingClientRect().top;
    const vh = window.innerHeight;
    const progress = (vh * 0.85 - top) / (vh * 0.55);
    return Math.min(total, Math.max(1, 1 + Math.floor(progress * total)));
  };

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);
    if (isReduced) return;
    instant.current = true;
    setCount(targetCount());
    const onScroll = () => setCount((c) => Math.max(c, targetCount()));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // targetCount reads only the ref and the window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-balance the ring whenever a pair joins.
  useEffect(() => {
    const to = slots(count);
    if (instant.current) {
      instant.current = false;
      anglesRef.current = to;
      setAngles(to);
      return;
    }
    const from = to.map((t, i) => anglesRef.current[i] ?? t);
    const start = performance.now();
    let id = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / TWEEN_MS);
      const k = ease(t);
      const next = to.map((target, i) => from[i] + (target - from[i]) * k);
      anglesRef.current = next;
      setAngles(next);
      if (t < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [count]);

  const pairs = kinds.slice(0, count).map((kind, i) => ({
    kind,
    emphasized: kind === own,
    ...place(angles[i] ?? slot(i, count)),
  }));
  const firms = kinds.filter((k) => k === "firm").length;

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
          aria-label={`Spaarke, the MSO operator, at the center with ${network.hub.capabilities.join(", ")}. Around it, ${total} client and MSO pairs, ${firms} law firms and ${total - firms} legal departments, each joined to its own MSO by a services agreement, and each MSO connected to Spaarke by operator services.`}
        >
          <defs>
            <radialGradient id="svc-hub" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="rgba(130,165,235,0.22)" />
              <stop offset="100%" stopColor="rgba(80,120,220,0.06)" />
            </radialGradient>
          </defs>

          {/* Lines sit under the boxes: operator lines (blue) from the hub's
              rim to each MSO, agreement lines (gray) from MSO to client. */}
          {pairs.map((p, i) => (
            <g key={`lines-${i}`} className="motion-safe:animate-[services-fade_450ms_ease-out]">
              <line x1={p.mso.x} y1={p.mso.y} x2={p.client.x} y2={p.client.y} stroke={GRAY} strokeWidth={1.5} />
              <line x1={p.rim.x} y1={p.rim.y} x2={p.mso.x} y2={p.mso.y} stroke={BLUE} strokeWidth={2} />
              {!reduced && (
                <line
                  x1={p.rim.x}
                  y1={p.rim.y}
                  x2={p.mso.x}
                  y2={p.mso.y}
                  stroke={BLUE_SOFT}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray="6 114"
                  className="motion-safe:animate-[services-pulse_2.4s_linear_infinite]"
                  style={{ animationDelay: `${600 + i * 180}ms`, opacity: 0.9 }}
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
          {pairs.map((p, i) => (
            <g key={`pair-${i}`} className="motion-safe:animate-[services-fade_450ms_ease-out]">
              <rect
                x={r2(p.client.x - CLIENT_W / 2)}
                y={r2(p.client.y - BOX_H / 2)}
                width={CLIENT_W}
                height={BOX_H}
                rx={10}
                fill={p.emphasized ? "#1f1f1f" : "#151515"}
                stroke={p.emphasized ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)"}
              />
              <text
                x={p.client.x}
                y={p.client.y}
                dy="0.35em"
                textAnchor="middle"
                fill={p.emphasized ? "#ffffff" : "rgba(255,255,255,0.6)"}
                fontSize={14}
                className="font-body"
              >
                {network.clientLabel[p.kind]}
              </text>
              <rect
                x={r2(p.mso.x - MSO_W / 2)}
                y={r2(p.mso.y - BOX_H / 2)}
                width={MSO_W}
                height={BOX_H}
                rx={10}
                fill={BLUE}
                fillOpacity={p.emphasized ? 1 : 0.6}
              />
              <text x={p.mso.x} y={p.mso.y} dy="0.35em" textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight={600} className="font-body">
                {network.msoLabel}
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
          {kinds.map((kind, i) => {
            const emphasized = kind === own;
            return (
              <li key={i} className="flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.1)] p-2">
                <span
                  className="flex-1 rounded-lg border px-3 py-2 text-center text-[14px]"
                  style={{
                    borderColor: emphasized ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
                    color: emphasized ? "#ffffff" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {network.clientLabel[kind]}
                </span>
                <span className="h-px w-3" style={{ background: GRAY }} aria-hidden="true" />
                <span
                  className="rounded-lg px-3 py-2 text-[14px] font-semibold text-white"
                  style={{ background: BLUE, opacity: emphasized ? 1 : 0.6 }}
                >
                  {network.msoLabel}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Legend */}
      <ul className="text-fg-mid mt-6 flex flex-col gap-3 text-[14px] sm:flex-row sm:gap-8">
        <li className="flex items-center gap-3">
          <span className="inline-block w-8" style={{ background: GRAY, height: 2 }} aria-hidden="true" />
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
