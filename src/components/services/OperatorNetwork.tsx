"use client";

import { useState } from "react";
import { network, type NetworkSize } from "@/app/services/content";
import { useAudience } from "./audience";
import { PillTabs } from "./PillTabs";

/**
 * The operator and member network (handoff 2026-11-22,
 * notes/mso-operator-network), converted from the handoff's light section to
 * the dark band and ported to JSX. It replaces NetworkDiagram and the four
 * network blocks.
 *
 * Spaarke sits at the hub inside a ring of six capabilities; members sit
 * around it, each with its own MSO. Three step tabs set the network size
 * (1, 3 or 8 members; phones show at most six). Hovering a ring segment
 * highlights its card and the other way round. At full size pulses run
 * along the operator spokes (not under reduced motion). Every MSO pill is
 * the site blue.
 *
 * Owner review 2026-11-22: no numbers, capability titles only, and the two
 * panels (what your firm can offer, what your firm owns) removed.
 */

const BLUE = "#5078DC";
const BLUE_LT = "#82A5EB";
const TEAL = "#3FD0B0";
const FG = "#F5F5F5";
const FG_MID = "rgba(245,245,245,0.66)";
const FG_LOW = "rgba(245,245,245,0.55)";
const BG = "#0a0a0a";
const SURFACE = "#111111";

interface Cfg {
  w: number;
  h: number;
  cy: number;
  r0: number;
  r1: number;
  rx: number;
  ry: number;
  bw: number;
  bh: number;
  mw: number;
  inline?: boolean;
  angles: number[];
  /** Ring label size and line spacing. */
  ringSize: number;
  ringGap: number;
  ring: [0, 1];
}

const WIDE: Cfg = {
  w: 1130,
  h: 700,
  cy: 350,
  r0: 112,
  r1: 212,
  rx: 470,
  ry: 300,
  bw: 176,
  bh: 48,
  mw: 64,
  angles: [-90, 0, 180, -42, -138, 42, 138, 90],
  ringSize: 12.5,
  ringGap: 16,
  ring: [0, 1],
};
const TALL: Cfg = {
  w: 372,
  h: 600,
  cy: 300,
  r0: 66,
  r1: 112,
  rx: 128,
  ry: 262,
  bw: 124,
  bh: 52,
  mw: 44,
  inline: true,
  angles: [-90, -22, 202, 22, 158, 90],
  ringSize: 0,
  ringGap: 0,
  ring: [0, 1],
};

/** Round SVG coordinates so server and browser render the same strings. */
const r2 = (v: number) => Math.round(v * 100) / 100;

export function OperatorNetwork() {
  const { audience } = useAudience();
  const [size, setSize] = useState<NetworkSize>(1);
  const [hot, setHot] = useState<number | null>(null);
  const flywheel = network.flywheel[audience];

  return (
    <div>
      <PillTabs
        items={network.steps[audience].map((s) => ({
          id: s.size,
          label: s.label,
        }))}
        value={size}
        onChange={setSize}
        label="Network size"
      />

      <div className="border-line-strong mt-6 rounded-2xl border bg-[rgba(255,255,255,0.02)] p-3 sm:p-5 lg:p-7">
        <div aria-hidden="true" className="hidden md:block">
          <Hub cfg={WIDE} size={size} hot={hot} setHot={setHot} />
        </div>
        <div aria-hidden="true" className="mx-auto max-w-[420px] md:hidden">
          <Hub cfg={TALL} size={size} hot={hot} setHot={setHot} />
        </div>
        <ul className="text-fg-mid mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px]">
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-0.5 w-[18px] shrink-0 bg-[rgba(255,255,255,0.4)]"
            />
            {network.legend.agreement}
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-0.5 w-[18px] shrink-0"
              style={{ backgroundColor: BLUE }}
            />
            {network.legend.operator}
          </li>
        </ul>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {network.capabilities.map((c, i) => (
          <li
            key={c.title}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            className="rounded-2xl border px-5 py-4 transition-[border-color,box-shadow] duration-200"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              borderColor: hot === i ? BLUE : "rgba(255,255,255,0.18)",
              boxShadow:
                hot === i ? "0 0 0 3px rgba(80,120,220,0.25)" : undefined,
            }}
          >
            <h3 className="text-fg text-[16px] font-medium">{c.title}</h3>
          </li>
        ))}
      </ul>

      <p className="mt-8 flex flex-col items-center gap-2 text-[14px] md:flex-row md:flex-wrap md:justify-center md:gap-x-3">
        {flywheel.map((f, i) => (
          <span key={f} className="contents">
            {i > 0 ? (
              <span
                aria-hidden="true"
                className="rotate-90 md:rotate-0"
                style={{ color: BLUE_LT }}
              >
                →
              </span>
            ) : null}
            <span className="border-line-strong text-fg rounded-full border px-3.5 py-1.5 text-center">
              {f}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}

/* Hub diagram ---------------------------------------------------------- */

function arc(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
) {
  const pt = (r: number, a: number) =>
    `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `M${pt(r1, a0)} A${r1} ${r1} 0 ${big} 1 ${pt(r1, a1)} L${pt(r0, a1)} A${r0} ${r0} 0 ${big} 0 ${pt(r0, a0)} Z`;
}

function Hub({
  cfg,
  size,
  hot,
  setHot,
}: {
  cfg: Cfg;
  size: NetworkSize;
  hot: number | null;
  setHot: (i: number | null) => void;
}) {
  const { audience } = useAudience();
  const members = network.members[audience];
  const you = network.you[audience];
  const caps = network.capabilities;
  const cx = cfg.w / 2;
  const cy = cfg.cy;
  const n = caps.length;
  const t0 = cy - (cfg.inline ? 12 : 22);

  return (
    <svg viewBox={`0 0 ${cfg.w} ${cfg.h}`} className="block h-auto w-full">
      <defs>
        <radialGradient id={`hubfill-${cfg.w}`}>
          <stop offset="0%" stopColor="rgba(80,120,220,0.22)" />
          <stop offset="100%" stopColor="rgba(80,120,220,0)" />
        </radialGradient>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={cfg.r1 + 18}
        fill="none"
        stroke="rgba(130,165,235,0.2)"
      />

      {cfg.angles.map((deg, i) => {
        const kind = members[i];
        const isYou = i === 0;
        const a = (deg * Math.PI) / 180;
        const px = r2(cx + cfg.rx * Math.cos(a));
        const py = r2(cy + cfg.ry * Math.sin(a));
        let qx = r2(cx + (cfg.r1 + 44) * Math.cos(a));
        let qy = r2(cy + (cfg.r1 + 44) * Math.sin(a));
        if (cfg.inline) {
          qx = px;
          qy = py;
        }
        const hx = r2(cx + cfg.r1 * Math.cos(a));
        const hy = r2(cy + cfg.r1 * Math.sin(a));
        const off = i >= size;
        const name = isYou
          ? cfg.inline
            ? you.short
            : you.long
          : network.clientLabel[kind];
        const fade = { transition: "opacity 450ms ease" };
        return (
          <g key={i}>
            <g style={{ ...fade, opacity: off ? 1 : 0 }}>
              <line
                x1={hx}
                y1={hy}
                x2={px}
                y2={py}
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1.2"
                strokeDasharray="3 5"
              />
              <rect
                x={px - cfg.bw / 2}
                y={py - cfg.bh / 2}
                width={cfg.bw}
                height={cfg.bh}
                rx="10"
                fill={BG}
                stroke="rgba(255,255,255,0.22)"
                strokeDasharray="4 5"
              />
              <text
                x={px}
                y={py}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-body"
                fontSize="11.5"
                fill={FG_LOW}
              >
                Next member
              </text>
            </g>
            <g style={{ ...fade, opacity: off ? 0 : 1 }}>
              <line
                x1={hx}
                y1={hy}
                x2={qx}
                y2={qy}
                stroke={BLUE}
                strokeWidth="1.6"
              />
              {!cfg.inline ? (
                <>
                  <line
                    x1={qx}
                    y1={qy}
                    x2={px}
                    y2={py}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1.4"
                  />
                  {size === 8 && !off ? (
                    <circle
                      r="3.5"
                      fill={BLUE_LT}
                      opacity="0.9"
                      className="motion-reduce:hidden"
                    >
                      <animateMotion
                        dur={`${2.4 + i * 0.17}s`}
                        repeatCount="indefinite"
                        path={`M${hx} ${hy} L${qx} ${qy}`}
                      />
                    </circle>
                  ) : null}
                </>
              ) : null}
              <rect
                x={px - cfg.bw / 2}
                y={py - cfg.bh / 2}
                width={cfg.bw}
                height={cfg.bh}
                rx="10"
                fill={SURFACE}
                stroke={isYou ? TEAL : "rgba(255,255,255,0.24)"}
                strokeWidth={isYou ? 2 : 1}
              />
              {cfg.inline ? (
                <>
                  <text
                    x={px}
                    y={py - 10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-body"
                    fontSize="13"
                    fontWeight="500"
                    fill={FG}
                  >
                    {name}
                  </text>
                  <rect
                    x={px - cfg.mw / 2}
                    y={py + 3}
                    width={cfg.mw}
                    height="18"
                    rx="5"
                    fill={BLUE}
                  />
                  <text
                    x={px}
                    y={py + 12.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-body"
                    fontSize="11.5"
                    fontWeight="600"
                    fill="#fff"
                  >
                    MSO
                  </text>
                </>
              ) : (
                <>
                  <text
                    x={px}
                    y={py - 8}
                    textAnchor="middle"
                    className="font-mono-display"
                    fontSize="9"
                    fontWeight="500"
                    letterSpacing="1.1"
                    fill={isYou ? TEAL : FG_LOW}
                  >
                    {isYou ? "YOU" : "MEMBER"}
                  </text>
                  <text
                    x={px}
                    y={py + 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-body"
                    fontSize="13.5"
                    fontWeight="500"
                    fill={FG}
                  >
                    {name}
                  </text>
                  <rect
                    x={qx - cfg.mw / 2}
                    y={qy - 13}
                    width={cfg.mw}
                    height="26"
                    rx="7"
                    fill={BLUE}
                  />
                  <text
                    x={qx}
                    y={qy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-body"
                    fontSize="11.5"
                    fontWeight="600"
                    fill="#fff"
                  >
                    MSO
                  </text>
                </>
              )}
            </g>
          </g>
        );
      })}

      {caps.map((c, i) => {
        const a0 = -Math.PI / 2 - Math.PI / n + (i * 2 * Math.PI) / n;
        const a1 = a0 + (2 * Math.PI) / n;
        const am = (a0 + a1) / 2;
        const lr = (cfg.r0 + cfg.r1) / 2;
        const lx = r2(cx + lr * Math.cos(am));
        const ly = r2(cy + lr * Math.sin(am));
        const on = hot === i;
        return (
          <g
            key={c.title}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            className="cursor-default"
          >
            <path
              d={arc(cx, cy, cfg.r0, cfg.r1, a0, a1)}
              fill={
                on
                  ? "rgba(80,120,220,0.42)"
                  : i % 2
                    ? "rgba(80,120,220,0.22)"
                    : "rgba(80,120,220,0.15)"
              }
              stroke={BG}
              strokeWidth="3"
              style={{ transition: "fill 300ms" }}
            />
            {/* Phones: no ring labels; they would be too small, and the cards below name each one. */}
            {!cfg.inline &&
              cfg.ring.map((line, j) => (
                <text
                  key={j}
                  x={lx}
                  y={
                    ly +
                    (j === 0 ? -cfg.ringGap / 2 : cfg.ringGap / 2) +
                    cfg.ringSize / 3
                  }
                  textAnchor="middle"
                  className="font-body"
                  fontSize={cfg.ringSize}
                  fontWeight="600"
                  fill={FG}
                >
                  {c.ring[j]}
                </text>
              ))}
          </g>
        );
      })}

      <circle
        cx={cx}
        cy={cy}
        r={cfg.r0 - 6}
        fill={BG}
        stroke={BLUE}
        strokeWidth="1.5"
      />
      <circle cx={cx} cy={cy} r={cfg.r0 - 6} fill={`url(#hubfill-${cfg.w})`} />
      <text
        x={cx}
        y={t0}
        textAnchor="middle"
        className="font-display"
        fontSize={cfg.inline ? 22 : 26}
        fontWeight="500"
        fill={FG}
      >
        Spaarke
      </text>
      <text
        x={cx}
        y={t0 + 22}
        textAnchor="middle"
        className="font-mono-display"
        fontSize="10.5"
        fontWeight="500"
        letterSpacing="1.4"
        fill={BLUE_LT}
      >
        MSO OPERATOR
      </text>
      {!cfg.inline ? (
        <>
          <text
            x={cx}
            y={t0 + 46}
            textAnchor="middle"
            className="font-body"
            fontSize="12.5"
            fill={FG_MID}
          >
            Owns and runs
          </text>
          <text
            x={cx}
            y={t0 + 63}
            textAnchor="middle"
            className="font-body"
            fontSize="12.5"
            fill={FG_MID}
          >
            every member’s MSO
          </text>
        </>
      ) : null}
    </svg>
  );
}
