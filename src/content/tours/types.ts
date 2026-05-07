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
  /**
   * When true, the step renders as a centered "interstitial" modal
   * overlaying a dimmed/blurred screenshot — used for the tour intro,
   * section transitions, and the outro. The callout's `title`, `body`,
   * and optional `cta` are shown inside the centered card; no pointer
   * is rendered.
   */
  interstitial?: boolean;
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

/**
 * Where the pointer sits on the callout box. Format `<edge>-<offset>`:
 * - **edge** — which side of the box the pointer protrudes from.
 * - **offset** — position along that edge.
 *   - For vertical edges (`left` / `right`): `top`, `middle`, `bottom`.
 *   - For horizontal edges (`top` / `bottom`): `left`, `middle`, `right`.
 *
 * The box is auto-positioned so the pointer's tip lands at the anchor.
 * Use `*-top` / `*-left` to align the pointer with the title region of
 * the callout; use `*-bottom` / `*-right` to align with the bottom.
 */
export type PointerPosition =
  | "left-top"
  | "left-middle"
  | "left-bottom"
  | "right-top"
  | "right-middle"
  | "right-bottom"
  | "top-left"
  | "top-middle"
  | "top-right"
  | "bottom-left"
  | "bottom-middle"
  | "bottom-right";

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
  /**
   * Where the pointer sits on the callout box (12-position system).
   * Preferred over the legacy `side` field for new authoring.
   */
  pointer?: PointerPosition;
  /**
   * @deprecated Use `pointer` for richer placement. Maps to:
   * `right` → `left-middle` (box right of anchor, pointer on box's left)
   * `left`  → `right-middle`
   * `top`   → `bottom-middle` (box above anchor, pointer on box's bottom)
   * `bottom`→ `top-middle`
   */
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
