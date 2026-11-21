/**
 * Turns calculator inputs and model results into the cost rows behind the
 * stacked-bar chart (review round 4, 2026-11-21; first built for the round 3
 * shift chart). Each row is one cost line: what it costs today, what the
 * client still carries, and the MSO service fee for the part that moved,
 * smaller by the price advantage. The fee math matches model.ts exactly
 * (tests check the sums).
 */
import { CORP_LABELS, FIRM_LABELS } from "./defaults";
import {
  CORP_FUNCTIONS,
  FIRM_FUNCTIONS,
  type CorpFunction,
  type CorpInputs,
  type CorpResult,
  type FirmFunction,
  type FirmInputs,
  type FirmResult,
} from "./model";

export interface ShiftRow {
  id: string;
  label: string;
  /** Today's cost of the line, carried by the client. */
  before: number;
  /** What the client still carries for the line. */
  keep: number;
  /** The MSO service fee for the line (0 when it stays). */
  mso: number;
  /** Label on the MSO side when it differs from `label`. */
  msoLabel?: string;
  /** The function this row's toggle moves; absent for lines that always stay. */
  toggle?: string;
  /** Moves with another function's toggle (technology capital spend). */
  follows?: string;
}

export interface ShiftResult {
  label: string;
  /** Today's value (profit) or 0 (savings). */
  before: number;
  after: number;
}

export interface ShiftData {
  rows: ShiftRow[];
  result: ShiftResult;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function firmShift(inp: FirmInputs, r: FirmResult): ShiftData {
  const adv = clamp01(inp.priceAdvantage);
  const rev = inp.revenue;
  const line = (id: string, before: number, moved: boolean, extra: Partial<ShiftRow> = {}): ShiftRow => ({
    id,
    label: FIRM_LABELS[id] ?? id,
    before,
    keep: moved ? 0 : before,
    mso: moved ? before * (1 - adv) : 0,
    ...extra,
  });
  const fn = (id: FirmFunction) =>
    line(id, inp.costPct[id] * rev, inp.moved[id], { toggle: id });

  const rows: ShiftRow[] = [
    line("attorneyComp", inp.costPct.attorneyComp * rev, false),
    ...FIRM_FUNCTIONS.flatMap((id) =>
      id === "technology"
        ? [fn(id), line("capex", inp.capexPct * rev, inp.moved.technology, { follows: "technology" })]
        : [fn(id)],
    ),
    line("other", inp.costPct.other * rev, false),
  ];
  return {
    rows,
    result: { label: "Distributable profit", before: r.baseline.profit, after: r.withMlo.profit },
  };
}

export function corporateShift(inp: CorpInputs, r: CorpResult): ShiftData {
  const adv = clamp01(inp.priceAdvantage);
  const b = inp.budget;
  const cost = (id: keyof CorpInputs["shares"]) => inp.shares[id] * b;
  const line = (id: string, before: number, moved: boolean, extra: Partial<ShiftRow> = {}): ShiftRow => ({
    id,
    label: CORP_LABELS[id] ?? id,
    before,
    keep: moved ? 0 : before,
    mso: moved ? before * (1 - adv) : 0,
    ...extra,
  });
  const fn = (id: CorpFunction) => line(id, cost(id), inp.moved[id], { toggle: id });
  const shiftedFee = r.mloLane.find((m) => m.id === "shifted")?.value ?? 0;

  const rows: ShiftRow[] = [
    {
      id: "outside",
      label: CORP_LABELS.outside,
      before: r.outsideBaseline,
      keep: r.outsideWithMlo,
      mso: shiftedFee,
      msoLabel: CORP_LABELS.shifted,
    },
    line("internal", cost("internal"), false),
    ...CORP_FUNCTIONS.flatMap((id) =>
      id === "technology"
        ? [fn(id), line("capex", inp.capexPct * b, inp.moved.technology, { follows: "technology" })]
        : [fn(id)],
    ),
    line("other", cost("other"), false),
  ];
  return { rows, result: { label: "Savings", before: 0, after: r.savings } };
}
