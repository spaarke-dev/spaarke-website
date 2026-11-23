/**
 * Number formats for the MSO value estimate (handoff section 5):
 * $1M and above as $X.XXM (one decimal at $10M and above), $1k and above as
 * $XXXk, percentages as whole numbers.
 */
export function money(v: number, d?: number) {
  const a = Math.abs(v);
  const s = v < 0 ? "-" : "";
  if (a >= 1e6) return `${s}$${(a / 1e6).toFixed(d ?? (a >= 1e7 ? 1 : 2))}M`;
  if (a >= 1e3) return `${s}$${Math.round(a / 1e3)}k`;
  return `${s}$${Math.round(a)}`;
}

export const pct = (v: number, d = 0) => `${(v * 100).toFixed(d)}%`;

/** Hours and counts: rounded to the nearest ten with a thousands separator from 1,000. */
export const num = (v: number) => {
  const r = Math.round(v / 10) * 10;
  return r >= 1000 ? r.toLocaleString("en-US") : Math.round(v).toString();
};

/** Percentage change from b to a, signed. */
export const chg = (a: number, b: number) => {
  const d = (a - b) / b;
  return `${d >= 0 ? "+" : ""}${(d * 100).toFixed(0)}%`;
};
