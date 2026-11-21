"use client";

import { useMemo } from "react";
import { sankey, sankeyLinkHorizontal, type SankeyLink, type SankeyNode } from "d3-sankey";
import type { NodeKind, SankeyData, SLink, SNode } from "./sankeyData";

/**
 * SVG Sankey for the calculator, ported from the prototype with the site's
 * colors. d3-sankey computes the layout only; rendering is plain SVG. A
 * table alternative sits under the diagram in a disclosure.
 */

const W = 920;
const H = 430;
const NODE_W = 14;

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
    a >= 1_000_000 ? `$${(a / 1_000_000).toFixed(a >= 10_000_000 ? 1 : 2)}M` : `$${Math.round(a / 1000)}K`;
  return v < 0 ? `-${s}` : s;
};

export function Sankey({ data, ariaLabel }: { data: SankeyData; ariaLabel: string }) {
  const layout = useMemo(() => {
    const gen = sankey<N, L>()
      .nodeId((d) => d.id)
      .nodeAlign((n) => n.layer)
      .nodeWidth(NODE_W)
      .nodePadding(14)
      // null keeps the input order (d3-sankey supports it; its types do not).
      .nodeSort(null as unknown as (a: SankeyNode<N, L>, b: SankeyNode<N, L>) => number)
      .extent([
        [4, 6],
        [W - 4, H - 6],
      ]);
    return gen({
      nodes: data.nodes.map((n) => ({ ...n })),
      links: data.links.map((l) => ({ ...l })),
    });
  }, [data]);

  const path = sankeyLinkHorizontal<N, L>();

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full"
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
          {(layout.nodes as SankeyNode<N, L>[]).map((n) => {
            const x0 = n.x0 ?? 0;
            const x1 = n.x1 ?? 0;
            const y0 = n.y0 ?? 0;
            const y1 = n.y1 ?? 0;
            const lastLayer = n.layer === 2;
            const tx = lastLayer ? x0 - 8 : x1 + 8;
            return (
              <g key={n.id}>
                <rect x={x0} y={y0} width={x1 - x0} height={Math.max(1, y1 - y0)} fill={NODE_FILL[n.kind]} rx={2} />
                <text
                  x={tx}
                  y={(y0 + y1) / 2}
                  dy="0.35em"
                  textAnchor={lastLayer ? "end" : "start"}
                  fontSize={15}
                  fill="#0a0a0a"
                  stroke="#ffffff"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  className="font-body"
                >
                  {n.label}
                  <tspan dx="6" fill="rgba(10,10,10,0.6)">
                    {money(n.value ?? 0)}
                  </tspan>
                </text>
              </g>
            );
          })}
        </g>
      </svg>
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
