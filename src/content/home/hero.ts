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
  headline: string;
  subhead: string;
  ctas: [HeroCTA, HeroCTA];
  trustStrip: string;
  screenshot: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export const heroContent: HeroContent = {
  headline: "See all sides of every matter.",
  subhead:
    "The shared platform for legal departments, business stakeholders, and outside counsel.",
  ctas: [
    { label: "Watch demo", action: "open-demo-modal", variant: "outline" },
    { label: "Get access", href: "/access-request", variant: "primary" },
  ],
  trustStrip:
    "Built on Microsoft 365 · Copilot-native · Azure AI Foundry — OpenAI, Anthropic, and any frontier model",
  screenshot: {
    src: "/brand/hero/hero-workspace-dark.png",
    alt: "Spaarke Corporate Counsel workspace — dashboard with matters, projects, and Copilot panel",
    width: 2400,
    height: 1500,
  },
};
