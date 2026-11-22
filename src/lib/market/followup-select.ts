import type { MemberStatus } from "@/lib/market/campaigns";

/**
 * Which campaign members a bulk follow-up picks (FR-11). Pure, so the
 * campaign page can show the count before anything is created.
 */
export type Selection = {
  /** Members whose effective status is one of these; all when empty. */
  statuses: MemberStatus[];
  group?: string;
  tag?: string;
};

export function matchesSelection(
  member: { status: MemberStatus; group?: string; tags: readonly string[] },
  sel: Selection,
): boolean {
  if (sel.statuses.length && !sel.statuses.includes(member.status)) return false;
  if (sel.group && member.group !== sel.group) return false;
  if (sel.tag && !member.tags.some((t) => t.toLowerCase() === sel.tag!.toLowerCase())) return false;
  return true;
}
