/**
 * Client-side wrapper for tour analytics events.
 *
 * All events relay through `/api/tour-event` (see route handler for the
 * rationale). The wrapper:
 * - Sends events with `keepalive: true` so they survive page navigation.
 * - For unload-time events (tour.abandoned), prefers `navigator.sendBeacon`
 *   for the highest reliability the browser offers.
 * - Coerces all property values to strings (App Insights stores them as
 *   strings anyway).
 * - Never throws — analytics failures should not break the tour.
 */

const ENDPOINT = "/api/tour-event";

type EventProperties = Record<string, string | number | boolean | null | undefined>;

function normalize(props: EventProperties | undefined): Record<string, string> {
  if (!props) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined) continue;
    out[k] = String(v);
  }
  return out;
}

/**
 * Fire-and-forget tracking event. Safe to call from anywhere; never
 * throws and never awaits anything blocking.
 */
export function trackTourEvent(name: string, properties?: EventProperties): void {
  try {
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, properties: normalize(properties) }),
      keepalive: true,
    }).catch(() => {
      // Swallow — analytics shouldn't surface errors to users.
    });
  } catch {
    // Defensive: any unexpected throw (e.g., JSON.stringify on a
    // non-serializable value) should not break the tour.
  }
}

/**
 * Variant for events fired during page-unload paths (visibilitychange =
 * hidden, beforeunload). Uses navigator.sendBeacon when available for
 * the most reliable delivery, falls back to keepalive fetch.
 */
export function trackTourEventOnUnload(
  name: string,
  properties?: EventProperties,
): void {
  try {
    const payload = JSON.stringify({ name, properties: normalize(properties) });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon(ENDPOINT, blob);
      if (sent) return;
    }
    // Fallback to keepalive fetch.
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Defensive — analytics must not break navigation.
  }
}
