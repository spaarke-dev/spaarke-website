import { ADJUSTABLE, normalize, type AdjustableKey, type EstimateInputs } from "./model";
import { normalizeDept, type DeptInputs } from "./dept-model";

/**
 * URL helpers for /services/estimate. Server-safe (no "use client"), so the
 * route pages can read the inputs from the query string.
 *
 * Law firm:         /services/estimate?partners=5&attorneys=7&revenue=9000000
 *                   (plus upside=1, fee, eff, use and glide when changed)
 * Legal department: /services/estimate?audience=corporate&lawyers=15&staff=10&budget=25000000
 */

export const ESTIMATE_PATH = "/services/estimate";
export const DETAILS_ANCHOR = "how-the-estimate-works";

export type EstimateAudience = "firm" | "corporate";

/** Query keys for the adjustable assumptions, written only when changed. */
const ADJ_KEYS: Record<AdjustableKey, string> = { feeDiscount: "fee", efficiency: "eff", redeploy: "use", glide: "glide" };

export function toQuery(v: EstimateInputs) {
  let q = `partners=${v.partners}&attorneys=${v.attorneys}&revenue=${v.revenue}`;
  if (v.upside) q += "&upside=1";
  for (const k of Object.keys(ADJ_KEYS) as AdjustableKey[]) {
    if (v[k] !== ADJUSTABLE[k].def) q += `&${ADJ_KEYS[k]}=${v[k]}`;
  }
  return q;
}

export function toDeptQuery(v: DeptInputs) {
  return `audience=corporate&lawyers=${v.lawyers}&staff=${v.staff}&budget=${v.budget}`;
}

export function estimateHref(v: EstimateInputs) {
  return `${ESTIMATE_PATH}?${toQuery(v)}`;
}

export function deptEstimateHref(v: DeptInputs) {
  return `${ESTIMATE_PATH}?${toDeptQuery(v)}`;
}

type Raw = Record<string, string | string[] | undefined>;

const one = (q: Raw, k: string) => {
  const v = q[k];
  const s = Array.isArray(v) ? v[0] : v;
  return s === undefined || s === "" ? undefined : s;
};
const n = (q: Raw, k: string) => {
  const s = one(q, k);
  return s === undefined ? undefined : Number(s);
};

/** Law firm inputs from the query string, clamped; null if none given. */
export function fromQuery(q: Raw): EstimateInputs | null {
  const partners = n(q, "partners");
  const attorneys = n(q, "attorneys");
  const revenue = n(q, "revenue");
  const adj = Object.fromEntries(
    (Object.keys(ADJ_KEYS) as AdjustableKey[]).map((k) => [k, n(q, ADJ_KEYS[k])]),
  ) as Partial<Record<AdjustableKey, number>>;
  const upside = one(q, "upside") === "1";
  const any = [partners, attorneys, revenue, ...Object.values(adj)].some((v) => v !== undefined) || upside;
  if (!any) return null;
  return normalize({ partners, attorneys, revenue, ...adj, upside });
}

/** Legal department inputs from the query string, clamped; null if none given. */
export function fromDeptQuery(q: Raw): DeptInputs | null {
  const lawyers = n(q, "lawyers");
  const staff = n(q, "staff");
  const budget = n(q, "budget");
  if (lawyers === undefined && staff === undefined && budget === undefined) return null;
  return normalizeDept({ lawyers, staff, budget });
}

/** Which estimate a query string asks for, and its inputs. */
export function parseEstimateQuery(q: Raw) {
  const audience: EstimateAudience = one(q, "audience") === "corporate" ? "corporate" : "firm";
  return { audience, firm: fromQuery(q), dept: fromDeptQuery(q) };
}
