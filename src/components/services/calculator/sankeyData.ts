/**
 * Turns model results into Sankey nodes and links.
 * Columns (layer): 0 = source, 1 = allocation (firm/department items + MLO fee), 2 = functions the MLO delivers.
 */
import { CORP_LABELS, FIRM_LABELS } from './defaults';
import type { CorpResult, FirmResult } from './model';

export type NodeKind = 'source' | 'firm' | 'mlo' | 'profit' | 'savings';

export interface SNode {
  id: string;
  label: string;
  kind: NodeKind;
  layer: 0 | 1 | 2;
}
export interface SLink {
  source: string;
  target: string;
  value: number;
}
export interface SankeyData {
  nodes: SNode[];
  links: SLink[];
}

const EPS = 1; // ignore flows under one dollar

function build(nodes: SNode[], links: SLink[]): SankeyData {
  const live = links.filter((l) => l.value > EPS);
  const used = new Set(live.flatMap((l) => [l.source, l.target]));
  return { nodes: nodes.filter((n) => used.has(n.id)), links: live };
}

export function firmSankey(r: FirmResult): SankeyData {
  const nodes: SNode[] = [{ id: 'revenue', label: 'Revenue', kind: 'source', layer: 0 }];
  const links: SLink[] = [];

  for (const item of r.firmLane) {
    nodes.push({ id: item.id, label: FIRM_LABELS[item.id] ?? item.id, kind: 'firm', layer: 1 });
    links.push({ source: 'revenue', target: item.id, value: item.value });
  }
  if (r.fee > EPS) {
    nodes.push({ id: 'fee', label: 'MSO service fee', kind: 'mlo', layer: 1 });
    links.push({ source: 'revenue', target: 'fee', value: r.fee });
    for (const m of r.mloLane) {
      const id = `mlo-${m.id}`;
      nodes.push({ id, label: FIRM_LABELS[m.id] ?? m.id, kind: 'mlo', layer: 2 });
      links.push({ source: 'fee', target: id, value: m.value });
    }
  }
  nodes.push({ id: 'profit', label: 'Distributable profit', kind: 'profit', layer: 1 });
  links.push({ source: 'revenue', target: 'profit', value: Math.max(0, r.withMlo.profit) });
  return build(nodes, links);
}

export function corporateSankey(r: CorpResult): SankeyData {
  const nodes: SNode[] = [{ id: 'budget', label: 'Baseline legal spend', kind: 'source', layer: 0 }];
  const links: SLink[] = [];

  for (const item of r.deptLane) {
    nodes.push({ id: item.id, label: CORP_LABELS[item.id] ?? item.id, kind: 'firm', layer: 1 });
    links.push({ source: 'budget', target: item.id, value: item.value });
  }
  if (r.fee > EPS) {
    nodes.push({ id: 'fee', label: 'MSO service fee', kind: 'mlo', layer: 1 });
    links.push({ source: 'budget', target: 'fee', value: r.fee });
    for (const m of r.mloLane) {
      const id = `mlo-${m.id}`;
      nodes.push({ id, label: CORP_LABELS[m.id] ?? m.id, kind: 'mlo', layer: 2 });
      links.push({ source: 'fee', target: id, value: m.value });
    }
  }
  nodes.push({ id: 'savings', label: 'Savings', kind: 'savings', layer: 1 });
  links.push({ source: 'budget', target: 'savings', value: Math.max(0, r.savings) });
  return build(nodes, links);
}
