import type { Visibility } from "@/lib/market/types";

/**
 * FR-02: records marked `investor` are left out of every list, search, count
 * and export unless the signed-in user has the `investor` role. Every read in
 * the admin area goes through one of these.
 */

export const INVESTOR_ROLE = "investor";

export function canSeeInvestor(roles: readonly string[]): boolean {
  return roles.includes(INVESTOR_ROLE);
}

export function isVisibleTo(record: { visibility?: Visibility | string }, roles: readonly string[]): boolean {
  // A missing value is treated as investor, so a malformed row hides rather than leaks.
  const v = record.visibility ?? "investor";
  return v === "general" || canSeeInvestor(roles);
}

export function filterVisible<T extends { visibility?: Visibility | string }>(
  records: readonly T[],
  roles: readonly string[],
): T[] {
  return records.filter((r) => isVisibleTo(r, roles));
}

/** OData fragment for a table query, or undefined when nothing is excluded. */
export function visibilityFilter(roles: readonly string[]): string | undefined {
  return canSeeInvestor(roles) ? undefined : "visibility eq 'general'";
}

/** Investor is the wider of the two: once a record is investor it stays so. */
export function widen(a: Visibility, b: Visibility | undefined): Visibility {
  return a === "investor" || b === "investor" ? "investor" : "general";
}
