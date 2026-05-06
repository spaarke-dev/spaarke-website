/**
 * Section 1 — Hero
 */

export type HeroContent = {
  headline: { line1: string; line2: string };
  subhead: string;
  /**
   * Secondary positioning line, rendered as one paragraph in two voices:
   * `strong` (full-strength fg) followed inline by `muted` (fg-mid).
   */
  kicker: { strong: string; muted: string };
  screenshot: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export const heroContent: HeroContent = {
  headline: { line1: "Legal Operations", line2: "Intelligence." },
  subhead:
    "A unified platform built natively on Microsoft—connecting legal work, data, and AI across matters, documents, spend, and collaboration.",
  kicker: {
    strong: "Built for AI across the entire lifecycle.",
    muted: "Not bolted on.",
  },
  screenshot: {
    src: "/brand/hero/hero-workspace-dark.png",
    alt: "Spaarke Corporate Counsel workspace — dashboard with matters, projects, and Copilot panel",
    width: 2400,
    height: 1500,
  },
};
