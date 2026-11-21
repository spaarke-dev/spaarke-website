"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sankey, sankeyLinkHorizontal, type SankeyLink, type SankeyNode } from "d3-sankey";
import type { NodeKind, SankeyData, SLink, SNode } from "./sankeyData";

/**
 * SVG Sankey for the calculator, ported from the prototype with the site's
 * colors. d3-sankey computes the layout only; rendering is plain SVG.
 *
 * The diagram is drawn at the container's real pixel width, so labels render
 * at their true size instead of being scaled down with a fixed viewBox. The
 * source and right-hand labels sit in reserved gutters outside the flows;
 * labels in the same column are nudged apart so they never overlap. Below
 * WIDE_MIN the diagram drops its text and a labeled list follows it. A table
 * alternative sits under the diagram in a disclosure.
 */

const NODE_W = 14;
const FONT = 13;
/** Rough average glyph width of the body font at FONT px, for gutter sizing. */
const CHAR = 6.9;
/** Minimum vertical distance between label baselines in one column. */
const LINE = 17;
const WIDE_MIN = 560;

type N = SNode;
type L = Omit<SLink, "source" | "target"> & { source: string | number | N; target: string | number | N };

const NODE_FILL: Record<NodeKind, string> = {
  source: "#0a0a0a",
  firm: "#9a9a96",
  mlo: "#5078DC",
  profit: "#2E9E6A",
  savings: "#2E9E6A",
};
const LINK_STROKE: Record<NodeKind, { color: string; opacity: number }> = {
  source: { color: "#9a9a96", opacity: 0.3 },
  firm: { color: "#9a9a96", opacity: 0.3 },
  mlo: { color: "#5078DC", opacity: 0.35 },
  profit: { color: "#2E9E6A", opacity: 0.38 },
  savings: { color: "#2E9E6A", opacity: 0.38 },
};

export const money = (v: number) => {
  const a = Math.abs(v);
  const s =
    a >= 1_000_000
      ? `$${(a / 1_000_000).toFixed(a >= 10_000_000 ? 1 : 2)}M`
      : a < 500
        ? "$0"
        : `$${Math.round(a / 1000)}K`;
  return v < 0 ? `-${s}` : s;
};

/** Width of the element, tracked with a ResizeObserver; 0 until measured. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

/** Pushes label positions apart to at least LINE px, keeping them inside [top, bottom]. */
function spread(ys: number[], top: number, bottom: number) {
  const out = [...ys];
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + LINE);
  const overflow = out.length ? out[out.length - 1] - bottom : 0;
  if (overflow > 0) for (let i = 0; i < out.length; i++) out[i] -= overflow;
  for (let i = 0; i < out.length; i++) out[i] = Math.max(out[i], top + i * LINE);
  return out;
}

/** Legend order follows the flow: source, then each allocation top to bottom, with the fee's parts under the fee. */
function legendOrder<T extends SNode & { y0?: number }>(nodes: T[]) {
  const byY = (a: T, b: T) => (a.y0 ?? 0) - (b.y0 ?? 0);
  const parts = nodes.filter((n) => n.layer === 2).sort(byY);
  const out: T[] = nodes.filter((n) => n.layer === 0);
  for (const n of nodes.filter((m) => m.layer === 1).sort(byY)) {
    out.push(n);
    if (n.id === "fee") out.push(...parts);
  }
  return out;
}

export function Sankey({ data, ariaLabel }: { data: SankeyData; ariaLabel: string }) {
  const { ref, width: measured } = useWidth<HTMLDivElement>();
  const width = measured || 720;
  const wide = width >= WIDE_MIN;
  const height = wide ? 400 : 280;

  // Gutters sized to the longest label in the outer columns (label + value).
  const textLen = (layer: number) =>
    Math.max(0, ...data.nodes.filter((n) => n.layer === layer).map((n) => n.label.length + 8));
  const leftGutter = wide ? Math.ceil(Math.max(...data.nodes.filter((n) => n.layer === 0).map((n) => n.label.length), 8) * CHAR) + 14 : 4;
  const rightGutter = wide ? Math.ceil(textLen(2) * CHAR) + 14 : 4;

  const layout = useMemo(() => {
    const gen = sankey<N, L>()
      .nodeId((d) => d.id)
      .nodeAlign((n) => n.layer)
      .nodeWidth(NODE_W)
      .nodePadding(wide ? 16 : 10)
      // null keeps the input order (d3-sankey supports it; its types do not).
      .nodeSort(null as unknown as (a: SankeyNode<N, L>, b: SankeyNode<N, L>) => number)
      .extent([
        [leftGutter, 8],
        [width - rightGutter, height - 8],
      ]);
    return gen({
      nodes: data.nodes.map((n) => ({ ...n })),
      links: data.links.map((l) => ({ ...l })),
    });
  }, [data, width, height, wide, leftGutter, rightGutter]);

  const path = sankeyLinkHorizontal<N, L>();
  const nodes = layout.nodes as SankeyNode<N, L>[];

  // Label positions per column, spread so they never overlap.
  const labelY = new Map<string, number>();
  for (const layer of [1, 2]) {
    const col = nodes.filter((n) => n.layer === layer).sort((a, b) => (a.y0 ?? 0) - (b.y0 ?? 0));
    const ys = spread(
      col.map((n) => ((n.y0 ?? 0) + (n.y1 ?? 0)) / 2),
      FONT,
      height - 6,
    );
    col.forEach((n, i) => labelY.set(n.id, ys[i]));
  }

  return (
    <figure className="m-0">
      <div ref={ref}>
        <svg
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={ariaLabel}
          className="block"
        >
          <g>
            {(layout.links as SankeyLink<N, L>[]).map((l, i) => {
              const s = l.source as SankeyNode<N, L>;
              const t = l.target as SankeyNode<N, L>;
              const style = LINK_STROKE[t.kind];
              return (
                <path
                  key={`${s.id}-${t.id}-${i}`}
                  d={path(l) ?? undefined}
                  fill="none"
                  stroke={style.color}
                  strokeOpacity={style.opacity}
                  strokeWidth={Math.max(1, l.width ?? 1)}
                  className="motion-safe:transition-opacity hover:[stroke-opacity:0.6]"
                >
                  <title>{`${s.label} → ${t.label}: ${money(l.value)}`}</title>
                </path>
              );
            })}
          </g>
          <g>
            {nodes.map((n) => {
              const x0 = n.x0 ?? 0;
              const x1 = n.x1 ?? 0;
              const y0 = n.y0 ?? 0;
              const y1 = n.y1 ?? 0;
              return (
                <rect
                  key={n.id}
                  x={x0}
                  y={y0}
                  width={x1 - x0}
                  height={Math.max(1, y1 - y0)}
                  fill={NODE_FILL[n.kind]}
                  rx={2}
                >
                  <title>{`${n.label}: ${money(n.value ?? 0)}`}</title>
                </rect>
              );
            })}
          </g>
          {wide ? (
            <g className="font-body" fontSize={FONT}>
              {nodes.map((n) => {
                const x0 = n.x0 ?? 0;
                const x1 = n.x1 ?? 0;
                const mid = ((n.y0 ?? 0) + (n.y1 ?? 0)) / 2;
                if (n.layer === 0) {
                  // Source: two lines in the left gutter.
                  return (
                    <text key={n.id} x={x0 - 8} y={mid - 2} textAnchor="end" fill="#0a0a0a">
                      {n.label}
                      <tspan x={x0 - 8} dy={LINE} fill="rgba(10,10,10,0.6)">
                        {money(n.value ?? 0)}
                      </tspan>
                    </text>
                  );
                }
                const y = labelY.get(n.id) ?? mid;
                // Middle column labels sit beside their node, on a halo so
                // they stay readable where a flow passes behind them.
                return (
                  <text
                    key={n.id}
                    x={x1 + 8}
                    y={y}
                    dy="0.35em"
                    fill="#0a0a0a"
                    stroke={n.layer === 1 ? "#ffffff" : "none"}
                    strokeWidth={4}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                  >
                    {n.label}
                    <tspan dx="6" fill="rgba(10,10,10,0.6)">
                      {money(n.value ?? 0)}
                    </tspan>
                  </text>
                );
              })}
            </g>
          ) : null}
        </svg>
      </div>

      {!wide ? (
        <ul className="mt-4 gap-x-8 text-[14px] sm:columns-2">
          {legendOrder(nodes).map((n) => (
            <li
              key={n.id}
              className={`flex break-inside-avoid items-center gap-2.5 py-1 ${n.layer === 2 ? "pl-5" : ""}`}
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: NODE_FILL[n.kind] }}
              />
              <span className="text-fg">{n.label}</span>
              <span className="text-fg-low ml-auto tabular-nums">{money(n.value ?? 0)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <details className="mt-3">
        <summary className="font-mono-display text-fg-low hover:text-fg cursor-pointer text-[11px] uppercase tracking-[0.14em]">
          View the flows as a table
        </summary>
        <table className="mt-3 w-full border-collapse text-left text-[14px]">
          <caption className="sr-only">{ariaLabel}</caption>
          <thead>
            <tr className="text-fg-low">
              <th className="py-1.5 font-medium">From</th>
              <th className="py-1.5 font-medium">To</th>
              <th className="py-1.5 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.links.map((l, i) => (
              <tr key={i} className="border-line border-t">
                <td className="py-1.5">{data.nodes.find((n) => n.id === l.source)?.label}</td>
                <td className="py-1.5">{data.nodes.find((n) => n.id === l.target)?.label}</td>
                <td className="py-1.5 text-right tabular-nums">{money(l.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
