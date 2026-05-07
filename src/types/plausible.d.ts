declare global {
  interface Window {
    plausible?: PlausibleFn & { q?: unknown[]; o?: Record<string, unknown> };
  }
}

export type PlausibleEventName =
  | "Take Tour Submit"
  | "Get Access Submit"
  | "Demo Request Submit"
  | "Contact Submit"
  | "Tour Section Enter"
  | "Tour Section Complete"
  | "Tour Complete"
  | "Article Read"
  | "CTA Click — Get Access"
  | "CTA Click — Contact Us"
  | "CTA Click — See Platform"
  | "Outbound Click — LinkedIn"
  | "AI Source Visit";

export type PlausibleProps = Record<string, string | number | boolean>;

export type PlausibleFn = (
  event: PlausibleEventName,
  options?: { props?: PlausibleProps; callback?: () => void },
) => void;

export {};
