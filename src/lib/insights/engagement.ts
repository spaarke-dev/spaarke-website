/**
 * Whether this reader used the assistant on this page, and how far they got.
 *
 * The open question about this feature is whether it deepens engagement with the
 * articles or replaces it. Nobody knows, including the people who built it, which
 * is why the comparison is instrumented rather than assumed.
 *
 * **The comparison is a property on an existing event, not a new funnel.** The
 * article tracker already fires when a reader engages; it now carries whether the
 * assistant was used, so the answer is a breakdown of one event rather than a join
 * across two. A join is the version that never gets run.
 *
 * The flag is module state, which is correct here: it is per page load, it must
 * not survive a navigation, and it must never be written anywhere.
 */

let used = false;

export function markAssistantUsed(): void {
  used = true;
}

export function assistantUsed(): boolean {
  return used;
}

/** Reset on navigation, so the next article starts clean. */
export function resetAssistantUsed(): void {
  used = false;
}

/**
 * Buckets, because analytics properties with unbounded values are properties
 * nobody can group by. These are the boundaries the thresholds in
 * `notes/measurement.md` are written against, so changing them invalidates the
 * baseline rather than improving it.
 */
export function depthBucket(fraction: number): string {
  if (fraction >= 0.9) return "90-100";
  if (fraction >= 0.75) return "75-90";
  if (fraction >= 0.5) return "50-75";
  if (fraction >= 0.25) return "25-50";
  return "0-25";
}

export function secondsBucket(seconds: number): string {
  if (seconds >= 600) return "600+";
  if (seconds >= 180) return "180-600";
  if (seconds >= 60) return "60-180";
  if (seconds >= 15) return "15-60";
  return "0-15";
}
