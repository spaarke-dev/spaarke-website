import { normalize, type EstimateInputs } from "./model";

/**
 * URL helpers for /services/estimate. Server-safe (no "use client"), so the
 * route pages can read the inputs from the query string.
 */

export const ESTIMATE_PATH = "/services/estimate";
export const DETAILS_ANCHOR = "how-the-estimate-works";

export function toQuery(v: EstimateInputs) {
  return `partners=${v.partners}&attorneys=${v.attorneys}&revenue=${v.revenue}`;
}

export function estimateHref(v: EstimateInputs) {
  return `${ESTIMATE_PATH}?${toQuery(v)}`;
}

type Raw = Record<string, string | string[] | undefined>;

/** Inputs from the details page's query string, clamped; null if none given. */
export function fromQuery(q: Raw): EstimateInputs | null {
  const one = (k: string) => {
    const v = q[k];
    const s = Array.isArray(v) ? v[0] : v;
    return s === undefined || s === "" ? undefined : Number(s);
  };
  const partners = one("partners");
  const attorneys = one("attorneys");
  const revenue = one("revenue");
  if (partners === undefined && attorneys === undefined && revenue === undefined) return null;
  return normalize({ partners, attorneys, revenue });
}
