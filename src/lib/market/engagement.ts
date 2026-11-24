/**
 * The link scanner filter (FR-10, task 051), ported from the private
 * `track.py` of the TLTF outreach. Pure: it takes one member's brief reads and
 * Ask AI clicks and says which of them a person made.
 *
 * Corporate mail gateways (Safe Links, Mimecast, Proofpoint) open every link
 * in an email within seconds of delivery, so most raw hits are machines:
 *  - The first hit on a member's links marks delivery. Anything in the quiet
 *    window after it is a scanner, which also drops a slower gateway's second
 *    pass a few minutes later.
 *  - Clicks less than 5 seconds apart form a burst. A burst of more than one
 *    click (usually both AI buttons at once) is a scanner; a person clicks one
 *    button, once.
 *  - A click whose recipient code a gateway rewrote (the brief key still
 *    found the member) is a scanner, and so is a burst within a second of it.
 *  - A brief read within 30 seconds after a scanner burst came from it.
 * Hits before the member's email was sent are tests and are left out.
 */

/** The TLTF quiet window: 15 minutes, as in `track.py` (spec, Assumptions). */
export const QUIET_MS = 15 * 60_000;
/** Clicks closer than this belong to one burst. */
export const BURST_MS = 5_000;
/** A brief read this soon after a scanner burst was made by that scanner. */
export const READ_AFTER_BURST_MS = 30_000;
/** A burst this close to a rewritten-code click came from the same gateway. */
export const REWRITTEN_MS = 1_000;

export type Hit = {
  kind: "click" | "read";
  /** Milliseconds since the epoch. */
  at: number;
  /** A click that arrived with a recipient code nobody has (a gateway rewrote it). */
  rewritten?: boolean;
};

export type EngagementOptions = {
  /** When the member's email went out; earlier hits are tests. */
  since?: number;
  /** Rewritten-code clicks seen elsewhere at these times (campaign-wide, when known). */
  rewrittenAt?: readonly number[];
};

/**
 * The hits a person made: the first click of each human burst, and the brief
 * reads outside the quiet window that no scanner burst explains. Order: by time.
 */
export function engagedHits(hits: readonly Hit[], opts: EngagementOptions = {}): Hit[] {
  const since = opts.since ?? -Infinity;
  const inWindow = hits.filter((h) => h.at >= since).sort((a, b) => a.at - b.at);
  const rewrittenAt = [...(opts.rewrittenAt ?? []), ...inWindow.filter((h) => h.rewritten).map((h) => h.at)];
  const counted = inWindow.filter((h) => !h.rewritten);
  if (!counted.length) return [];

  const anchor = counted[0].at;
  const clicks = counted.filter((h) => h.kind === "click");
  const reads = counted.filter((h) => h.kind === "read");

  const human: Hit[] = [];
  const scannerStarts: number[] = [];
  let i = 0;
  while (i < clicks.length) {
    const burst = [clicks[i]];
    while (i + burst.length < clicks.length && clicks[i + burst.length].at - burst[burst.length - 1].at <= BURST_MS) {
      burst.push(clicks[i + burst.length]);
    }
    const t0 = burst[0].at;
    const scanner =
      burst.length > 1 || t0 - anchor < QUIET_MS || rewrittenAt.some((g) => Math.abs(t0 - g) <= REWRITTEN_MS);
    if (scanner) scannerStarts.push(t0);
    else human.push(burst[0]);
    i += burst.length;
  }

  const people = reads.filter(
    (r) => r.at - anchor >= QUIET_MS && !scannerStarts.some((b) => r.at - b >= 0 && r.at - b <= READ_AFTER_BURST_MS),
  );
  return [...human, ...people].sort((a, b) => a.at - b.at);
}
