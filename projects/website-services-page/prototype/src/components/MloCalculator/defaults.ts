/**
 * ILLUSTRATIVE defaults and labels. Replace with values set by finance and reviewed by counsel
 * before launch. Labels here are placeholders for the function names counsel approves.
 */
import type { CorpInputs, FirmInputs } from './model';

export const FIRM_DEFAULTS: FirmInputs = {
  revenue: 20_000_000,
  costPct: {
    attorneyComp: 0.38,
    staff: 0.12,
    technology: 0.06,
    facilities: 0.07,
    finance: 0.05,
    marketing: 0.04,
    other: 0.03,
  },
  capexPct: 0.03,
  moved: { staff: true, technology: true, facilities: true, finance: true, marketing: true },
  priceAdvantage: 0.15,
  feePressure: 0,
  transitionCostPct: 0.02,
};

export const CORP_DEFAULTS: CorpInputs = {
  budget: 25_000_000,
  shares: { outside: 0.5, internal: 0.28, ops: 0.09, technology: 0.08, other: 0.05 },
  capexPct: 0.03,
  moved: { ops: true, technology: true },
  priceAdvantage: 0.15,
  shiftedShare: 0.1,
  mloCostRatio: 0.4,
  matterCount: 1200,
};

export const FIRM_LABELS: Record<string, string> = {
  attorneyComp: 'Attorney compensation',
  staff: 'Non-attorney staff',
  technology: 'Technology and IT',
  facilities: 'Facilities',
  finance: 'Accounting and finance',
  marketing: 'Marketing',
  other: 'Other operating costs',
  capex: 'Technology capex',
};

export const CORP_LABELS: Record<string, string> = {
  outside: 'Outside counsel',
  internal: 'Internal legal team',
  ops: 'Legal operations',
  technology: 'Technology and tools',
  other: 'Other',
  capex: 'Technology capex',
  shifted: 'Routine work handled by MLO',
};

export const ILLUSTRATIVE_NOTE =
  'Illustrative only. These figures use placeholder assumptions, are not a projection, forecast or offer, and will differ for every organization. The MLO fee is based on the cost of the services delivered, never on legal fees or revenue.';
