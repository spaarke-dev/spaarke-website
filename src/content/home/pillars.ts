/**
 * Section 3 — Pillars (light slab)
 *
 * Umbrella heading "One platform. All sides. Every matter." also covers
 * Section 4 (which has no standalone heading).
 *
 * Three pillar cards: typography-only, no icons, thin divider between
 * operational claim and callback line.
 */

export type Pillar = {
  cardLabel: string; // "One platform." / "All sides." / "Every matter."
  headline: string;
  operationalClaim: string;
  callback: string;
};

export type PillarsContent = {
  umbrellaHeading: string;
  pillars: [Pillar, Pillar, Pillar];
};

export const pillarsContent: PillarsContent = {
  umbrellaHeading: "One platform. All sides. Every matter.",
  pillars: [
    {
      cardLabel: "One platform.",
      headline: "One platform,\nbuilt for legal.",
      operationalClaim:
        "The work, the people, the documents, and the AI — connected on one Microsoft 365 foundation that serves the business, the legal team, and the firms they work with.",
      callback: "The foundation legal builds on.",
    },
    {
      cardLabel: "All sides.",
      headline: "All sides of the engagement,\nfinally aligned.",
      operationalClaim:
        "Business clients, in-house counsel, and outside counsel — working in shared, secure spaces where the matter, the documents, the tasks, and the outcomes live in one record. Ethical walls and matter-level permissions enforced throughout.",
      callback: "Shared sense of truth across stakeholders.",
    },
    {
      cardLabel: "Every matter.",
      headline: "Every matter,\naccountable end-to-end.",
      operationalClaim:
        "AI agents, automated workflows, performance signals, and spend visibility — connecting every matter to the people responsible, the work in progress, and the outcomes that matter.",
      callback: "Legal work becomes visible, connected, and intelligent.",
    },
  ],
};
