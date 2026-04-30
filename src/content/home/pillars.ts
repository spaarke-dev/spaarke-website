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
      headline: "One platform for the work, the data, and the AI.",
      operationalClaim:
        "Matters, projects, documents, spend, and AI — connected on one Microsoft 365-native foundation that serves the business, the legal team, and the firms they work with. Replace four point solutions with one platform that knows what a matter is.",
      callback:
        "No more bolt-ons. No more parallel logins. No more which tool was that in again?",
    },
    {
      cardLabel: "All sides.",
      headline: "All sides of the engagement, finally aligned.",
      operationalClaim:
        "Business clients, in-house counsel, and outside counsel — working in shared, secure spaces where the matter, the documents, the tasks, and the outcomes live in one record. Ethical walls and matter-level permissions enforced throughout.",
      callback:
        "Partnership replaces reconciliation. The business gets answers. The team gets visibility. The firms get clarity.",
    },
    {
      cardLabel: "Every matter.",
      headline: "Every matter, every project, every detail.",
      operationalClaim:
        "The full scope of legal work — matters, projects, documents, emails, invoices, deadlines, outcomes — connected, findable, governable. Nothing slips between systems because nothing lives outside the platform.",
      callback:
        "The work itself is the record. Visibility and governance built in, not bolted on.",
    },
  ],
};
