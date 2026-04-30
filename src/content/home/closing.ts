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
  sub: string;
  ctas: [ClosingCTA, ClosingCTA];
};

export const closingContent: ClosingContent = {
  headline: "See all sides of every matter.",
  sub: "Now accepting early access partners.",
  ctas: [
    { label: "Get access", href: "/access-request", variant: "primary" },
    { label: "Why Spaarke", href: "/why-spaarke", variant: "text", arrow: true },
  ],
};
