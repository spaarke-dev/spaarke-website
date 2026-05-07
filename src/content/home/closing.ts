/**
 * Section 6 — Closing CTA
 *
 * The page exhales. Single-line headline (canonical tagline, bookends
 * with hero), subtle radial vignette behind the type, then a
 * Take-tour mini form with an inline "See platform" link.
 */

export type ClosingContent = {
  headline: string;
  /** Large positioning line under the headline — split across 2 lines. */
  tagline: { line1: string; line2: string };
};

export const closingContent: ClosingContent = {
  headline: "See all sides of every matter.",
  tagline: {
    line1: "Unify your systems. Activate your AI.",
    line2: "Work with full context.",
  },
};
