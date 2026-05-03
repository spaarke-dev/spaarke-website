/**
 * Section 5 — Built for the operating model of modern legal teams.
 *
 * Centered Spaarke platform mockup (8 capability icons in 2x4 grid) on
 * a light slab. The earlier diagram form (Spaarke → arrow → Copilot
 * badge) was retired here.
 */

export type LOIIcon = {
  src: string;
  label: string; // accessible name
};

export type LOIContent = {
  heading: { line1: string; line2: string };
  intro: { line1: string; line2: string };
  spaarkeContainer: {
    eyebrow: string;
    wordmark: { src: string; alt: string };
    icons: [LOIIcon, LOIIcon, LOIIcon, LOIIcon, LOIIcon, LOIIcon, LOIIcon, LOIIcon];
  };
};

export const loiContent: LOIContent = {
  heading: {
    line1: "Spaarke is built to work",
    line2: "how you work.",
  },
  intro: {
    line1:
      "Your matters, projects, emails, documents, business requests, invoices, and",
    line2: "outside counsel collaboration are connected in a single platform.",
  },
  spaarkeContainer: {
    eyebrow: "Legal IQ Platform",
    wordmark: {
      src: "/brand/logos/spaarke-logo-white.svg",
      alt: "Spaarke",
    },
    icons: [
      { src: "/brand/icons/email.svg", label: "Email" },
      { src: "/brand/icons/playbook.svg", label: "Requests" },
      { src: "/brand/icons/matter.svg", label: "Matters" },
      { src: "/brand/icons/project.svg", label: "Projects" },
      { src: "/brand/icons/kpiassessment.svg", label: "Metrics" },
      { src: "/brand/icons/task.svg", label: "Tasks" },
      { src: "/brand/icons/teams.svg", label: "Counsel" },
      { src: "/brand/icons/document.svg", label: "Documents" },
    ],
  },
};
