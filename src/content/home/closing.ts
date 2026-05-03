/**
 * Section 6 — Closing CTA
 *
 * The page exhales. Single-line headline (canonical tagline, bookends with hero),
 * subtle radial vignette behind the type, two CTAs.
 */

export type ClosingCTA = {
  label: string;
  href: string;
  variant: "primary" | "text";
  arrow?: boolean;
};

export type ClosingContent = {
  headline: string;
  /** Large positioning line under the headline — split across 2 lines. */
  tagline: { line1: string; line2: string };
  ctas: [ClosingCTA, ClosingCTA];
};

export const closingContent: ClosingContent = {
  headline: "See all sides of every matter.",
  tagline: {
    line1: "Unify your systems. Activate your AI.",
    line2: "Work with full context.",
  },
  ctas: [
    { label: "Get access", href: "/access-request", variant: "primary" },
    { label: "Why Spaarke", href: "/why-spaarke", variant: "text", arrow: true },
  ],
};
