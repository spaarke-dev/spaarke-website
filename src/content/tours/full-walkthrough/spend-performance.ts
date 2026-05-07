import type { TourSection } from "../types";

export const spendPerformance: TourSection = {
  id: "spend-performance",
  label: "Spend & Performance",
  steps: [
    {
      id: "matter-details",
      screenshot: {
        src: "/tours/full-walkthrough/spend-performance/step-1-matter-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter detail — financial panel showing budget, spend, and performance signals at a glance",
      },
      callout: {
        title: "Spend, on the matter itself",
        body: "Budget, actual spend, and outside counsel performance live on the matter — no jumping to a separate finance system to see the numbers.",
        anchor: { x: 0.32, y: 0.30 },
        side: "right",
      },
    },
    {
      id: "matter-report-card",
      screenshot: {
        src: "/tours/full-walkthrough/spend-performance/step-2-matter-report-card.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter report card — combined scorecard of budget, spend, performance grades, and risk signals",
      },
      callout: {
        title: "One scorecard per matter",
        body: "A single report card combines budget, spend, performance grades, and risk signals — so any stakeholder reads the matter the same way.",
        anchor: { x: 0.40, y: 0.32 },
        side: "right",
      },
    },
    {
      id: "matter-billing",
      screenshot: {
        src: "/tours/full-walkthrough/spend-performance/step-3-matter-billing.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke billing summary — invoices rolled up to matter, project, and counsel with spend trends",
      },
      callout: {
        title: "Every invoice rolls up here",
        body: "Invoices flow into their matter, project, and counsel — so spend trends, OCG compliance, and counsel performance are one click away.",
        anchor: { x: 0.30, y: 0.35 },
        side: "right",
      },
    },
  ],
};
