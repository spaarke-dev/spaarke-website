export type SectionId =
  | "matter-management"
  | "documents-email"
  | "collaboration"
  | "ai-automation"
  | "spend-performance";

export type Tour = {
  /** Stable id used in URLs (`/tour/<slug>`). */
  slug: string;
  /** Display title. */
  title: string;
  /** Optional short description shown on the landing screen. */
  description?: string;
  sections: TourSection[];
};

export type TourSection = {
  id: SectionId;
  /** Display label on the capability nav. */
  label: string;
  steps: TourStep[];
};

export type TourStep = {
  id: string;
  screenshot: Screenshot;
  callout: Callout;
  /** Optional click regions; Phase 3. */
  hotspots?: Hotspot[];
};

export type Screenshot = {
  /** Path under `/public`, e.g. "/tours/full-walkthrough/matters-list.png". */
  src: string;
  /** Intrinsic pixel dimensions — used for aspect-ratio. */
  width: number;
  height: number;
  /** Required alt text. */
  alt: string;
};

export type Callout = {
  /** Optional title shown above the body in stronger weight. */
  title?: string;
  /** The callout body copy. */
  body: string;
  /**
   * Position of the callout box, normalized to screenshot dims.
   * `width` is required; `height` is auto if omitted.
   */
  box?: { x: number; y: number; width: number; height?: number };
  /**
   * Where the pointer attaches on the screenshot, normalized.
   * Drives auto-placement of the box if `box` is omitted.
   */
  anchor?: { x: number; y: number };
  /** Which side of the callout the pointer comes out of. */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Optional call-to-action button rendered below the body. Useful for
   * module-transition steps ("Continue to Documents & Email") and
   * tour-completion steps ("Get access").
   */
  cta?: CalloutCta;
};

export type CalloutCta = {
  /** Visible button text. */
  label: string;
  /** Destination URL. Internal paths render as Next `<Link>`; absolute
   * URLs (https://…) render as plain anchor tags with target="_blank". */
  href: string;
};

/**
 * Step navigation controls passed from the parent shell into the
 * callout so prev/next + counter live inline with the callout body.
 */
export type CalloutNav = {
  /** Zero-based step index within the active section. */
  index: number;
  /** Total steps in the active section. */
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export type Hotspot = {
  region: { x: number; y: number; width: number; height: number };
  action: { type: "next" } | { type: "go-to"; stepId: string };
  /** Visible outline + cursor; helps users discover the hotspot. */
  label?: string;
};
