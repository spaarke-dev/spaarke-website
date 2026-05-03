/**
 * Section 2 — The gap (Demand is rising. Resources are not.)
 *
 * Stats per the v2 mockup decision (mockup version supersedes the v1.4 brief).
 */

export type GapStat = {
  value: string;
  label: string;
  detail: string;
  source: string;
};

export type GapContent = {
  heading: { line1: string; line2: string };
  intro: string;
  stats: [GapStat, GapStat, GapStat, GapStat];
};

export const gapContent: GapContent = {
  heading: {
    line1: "Demand is rising.",
    line2: "Resources are not.",
  },
  intro:
    "Legal departments and their outside counsel are working harder than ever — and operating with less of the data they need to do it well.",
  stats: [
    {
      value: "77%",
      label: "report increasing workloads",
      detail:
        "— while business clients seek greater visibility and quicker turnaround",
      source: "Axiom 2026 Global In-House Legal Study",
    },
    {
      value: "60%",
      label: "lack outside counsel guidelines",
      detail: "—and where they exist, 87% report enforcement is light",
      source: "LegalBillReview / In-House Connect, 2025",
    },
    {
      value: "79%",
      label: "must reduce outside counsel spend",
      detail: "—but 57% can’t quantify the savings they achieve",
      source: "LegalBillReview / In-House Connect, 2025",
    },
    {
      value: "1 in 5",
      label: "have reached AI maturity",
      detail:
        "— even as 75% have raised AI budgets and 66% are accelerating adoption.",
      source: "Axiom 2025 Legal AI Report",
    },
  ],
};
