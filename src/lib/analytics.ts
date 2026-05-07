import type { PlausibleEventName, PlausibleProps } from "@/types/plausible";

export function track(event: PlausibleEventName, props?: PlausibleProps): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  try {
    window.plausible(event, props ? { props } : undefined);
  } catch {
    // Swallow — analytics must never break user flow.
  }
}
