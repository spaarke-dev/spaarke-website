/**
 * Section 5 — Introducing Legal Operations Intelligence
 *
 * Strategic visual: Spaarke container (left) → arrow → M365 Copilot badge (right).
 * Reused across decks, RFPs, analyst conversations.
 *
 * 8 capability icons in 2x4 grid inside the Spaarke container — best-mapped
 * from the available SVGs (mockup is the visual reference).
 */

export type LOIIcon = {
  src: string;
  label: string; // accessible name
};

export type LOIContent = {
  heading: { line1: string; line2: string };
  intro: string;
  spaarkeContainer: {
    eyebrow: string;
    wordmark: { src: string; alt: string };
    icons: [LOIIcon, LOIIcon, LOIIcon, LOIIcon, LOIIcon, LOIIcon, LOIIcon, LOIIcon];
  };
  copilot: {
    src: string;
    alt: string;
    tag: string;
  };
};

export const loiContent: LOIContent = {
  heading: {
    line1: "Introducing",
    line2: "Legal Operations Intelligence",
  },
  intro:
    "Spaarke is the legal IQ layer that makes Copilot, your AI agents, and your existing systems fluent in legal work. Decisions, workflows, performance, partnership — not just drafting.",
  spaarkeContainer: {
    eyebrow: "Legal IQ Platform",
    wordmark: {
      src: "/brand/logos/spaarke-logo-white.svg",
      alt: "Spaarke",
    },
    icons: [
      { src: "/brand/icons/email.svg", label: "Email" },
      { src: "/brand/icons/playbook.svg", label: "Playbook" },
      { src: "/brand/icons/event.svg", label: "Calendar" },
      { src: "/brand/icons/matter.svg", label: "Matter" },
      { src: "/brand/icons/kpiassessment.svg", label: "Performance" },
      { src: "/brand/icons/task.svg", label: "Tasks" },
      { src: "/brand/icons/teams.svg", label: "People" },
      { src: "/brand/icons/document.svg", label: "Documents" },
    ],
  },
  copilot: {
    src: "/brand/logos/microsoft-365-copilot-badge.svg",
    alt: "Microsoft 365 Copilot",
    tag: "M365",
  },
};
