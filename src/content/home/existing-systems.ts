/**
 * Section 3 — Existing systems can't meet the needs.
 *
 * Three expandable cards. Each has a short summary visible by default
 * and a long-form explanation revealed by the "Read more" toggle.
 */

export type ExistingSystemsCard = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

export type ExistingSystemsContent = {
  heading: { line1: string; line2: string };
  subhead: string;
  cards: [ExistingSystemsCard, ExistingSystemsCard, ExistingSystemsCard];
};

export const existingSystemsContent: ExistingSystemsContent = {
  heading: {
    line1: "Existing systems",
    line2: "can't meet the needs.",
  },
  subhead:
    "AI is advancing—but it's not integrated into the systems and workflows that drive legal work.",
  cards: [
    {
      id: "ai-shift",
      title: "AI is forcing a shift in how legal operates.",
      summary:
        "The question is no longer where to apply it—but how it integrates into systems, workflows, and the way legal work is resourced and executed.",
      detail:
        "Legal teams are rapidly adopting AI across drafting, review, research, and knowledge workflows. These initiatives demonstrate clear value, but they remain constrained by fragmented systems and incomplete data access. Without integration into the core platforms that manage matters, documents, collaboration, and spend, AI cannot influence how work is coordinated or resourced. The real opportunity—and challenge—is embedding AI into the operating model that governs how legal work gets done.",
    },
    {
      id: "legacy-systems",
      title: "Legacy systems weren't built for AI.",
      summary:
        "Enterprise legal platforms have evolved to manage matters, billing, and operations—but their underlying structures weren't designed for AI to access and operate across the full context of legal work.",
      detail:
        "Legal management systems have expanded to support matters, billing, and operations, while documents and collaboration often live in separate platforms—whether Microsoft 365 or third-party systems. As AI capabilities are introduced, they are layered onto these environments, limiting access to the full context of legal work. At the same time, teams expect AI to operate within tools like Outlook, Teams, Word, and SharePoint—something these systems were not designed to support.",
    },
    {
      id: "ai-drafting",
      title: "AI drafting tools aren't systems of record.",
      summary:
        "Standalone AI tools are rapidly being adopted for drafting, review, and analysis—but they operate alongside legal systems, not within them.",
      detail:
        "Many AI tools integrate with Word, document management systems, and other applications, and are beginning to introduce agent-based workflows. While these capabilities improve specific tasks, they do not operate as a system of record for matters, documents, decisions, and spend. Without that foundation, AI remains disconnected from the full context and coordination of legal work.",
    },
  ],
};
