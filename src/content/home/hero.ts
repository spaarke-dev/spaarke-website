/**
 * Section 1 — Hero
 */

export type HeroCTA = {
  label: string;
  href?: string;
  action?: "open-demo-modal";
  variant: "primary" | "outline";
};

export type HeroContent = {
  headline: { line1: string; line2: string };
  subhead: string;
  ctas: [HeroCTA, HeroCTA];
  screenshot: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export const heroContent: HeroContent = {
  headline: { line1: "See all sides of", line2: "every matter." },
  subhead:
    "The shared platform for legal departments, business stakeholders, and outside counsel.",
  ctas: [
    { label: "Watch demo", action: "open-demo-modal", variant: "outline" },
    { label: "Get access", href: "/access-request", variant: "primary" },
  ],
  screenshot: {
    src: "/brand/hero/hero-workspace-dark.png",
    alt: "Spaarke Corporate Counsel workspace — dashboard with matters, projects, and Copilot panel",
    width: 2400,
    height: 1500,
  },
};
