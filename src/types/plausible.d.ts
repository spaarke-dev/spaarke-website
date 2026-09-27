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
  | "Tour Started"
  | "Tour Completed"
  | "Tour Abandoned at Section"
  | "Tour CTA Click"
  | "Article Read"
  | "CTA Click — Get Access"
  | "CTA Click — Contact Us"
  | "CTA Click — See Platform"
  | "Outbound Click — LinkedIn"
  | "AI Source Visit"
  // The article assistant. Task 040. The question these exist to answer is
  // whether the assistant deepens engagement with the articles or replaces it,
  // which is why "Article Engagement" carries an `assistant` property rather
  // than living in a separate funnel.
  | "Assistant Opened"
  | "Assistant Question"
  | "Assistant Answer"
  | "Assistant Error"
  | "Assistant Citation"
  | "Article Engagement";

export type PlausibleProps = Record<string, string | number | boolean>;

export type PlausibleFn = (
  event: PlausibleEventName,
  options?: { props?: PlausibleProps; callback?: () => void },
) => void;

export {};
