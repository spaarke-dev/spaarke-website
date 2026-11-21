import { useMemo } from 'react';
import { sankey, sankeyLinkHorizontal, type SankeyLink, type SankeyNode } from 'd3-sankey';
import type { SankeyData, SLink, SNode } from './sankeyData';

const W = 920;
const H = 430;
const NODE_W = 14;

type N = SNode;
type L = Omit<SLink, 'source' | 'target'> & { source: string | number | N; target: string | number | N };

export const money = (v: number) => {
  const a = Math.abs(v);
  const s = a >= 1_000_000 ? `$${(a / 1_000_000).toFixed(a >= 10_000_000 ? 1 : 2)}M` : `$${Math.round(a / 1000)}K`;
  return v < 0 ? `-${s}` : s;
};

export function Sankey({ data, ariaLabel }: { data: SankeyData; ariaLabel: string }) {
  const layout = useMemo(() => {
    const gen = sankey<N, L>()
      .nodeId((d) => d.id)
      .nodeAlign((n) => n.layer)
      .nodeWidth(NODE_W)
      .nodePadding(14)
      .nodeSort(null)
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
    <figure className="sankey">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} preserveAspectRatio="xMidYMid meet">
        <g className="sankey-links">
          {(layout.links as SankeyLink<N, L>[]).map((l, i) => {
            const s = l.source as SankeyNode<N, L>;
            const t = l.target as SankeyNode<N, L>;
            return (
              <path
                key={`${s.id}-${t.id}-${i}`}
                d={path(l) ?? undefined}
                strokeWidth={Math.max(1, l.width ?? 1)}
                className={`link link-${t.kind}`}
              >
                <title>{`${s.label} → ${t.label}: ${money(l.value)}`}</title>
              </path>
            );
          })}
        </g>
        <g className="sankey-nodes">
          {(layout.nodes as SankeyNode<N, L>[]).map((n) => {
            const x0 = n.x0 ?? 0;
            const x1 = n.x1 ?? 0;
            const y0 = n.y0 ?? 0;
            const y1 = n.y1 ?? 0;
            const lastLayer = n.layer === 2;
            const tx = lastLayer ? x0 - 8 : x1 + 8;
            return (
              <g key={n.id}>
                <rect x={x0} y={y0} width={x1 - x0} height={Math.max(1, y1 - y0)} className={`node node-${n.kind}`} />
                <text x={tx} y={(y0 + y1) / 2} dy="0.35em" textAnchor={lastLayer ? 'end' : 'start'} className="node-label">
                  {n.label}
                  <tspan className="node-value" dx="6">
                    {money(n.value ?? 0)}
                  </tspan>
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <figcaption className="visually-hidden">
        <table>
          <caption>{ariaLabel}</caption>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.links.map((l, i) => (
              <tr key={i}>
                <td>{data.nodes.find((n) => n.id === l.source)?.label}</td>
                <td>{data.nodes.find((n) => n.id === l.target)?.label}</td>
                <td>{money(l.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
