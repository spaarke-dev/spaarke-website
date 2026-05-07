import type { TourSection } from "../types";

export const matterManagement: TourSection = {
  id: "matter-management",
  label: "Matter Management",
  steps: [
    {
      id: "daily-briefing",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-1-daily-briefing.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Daily Briefing — AI-generated rollup of activity, priorities, and matter updates across the user's portfolio",
      },
      callout: {
        title: "Your day, summarized by AI",
        body: "A real-time briefing surfaces what changed across your matters overnight — activity, priorities, and what to look at next.",
        anchor: { x: 0.22, y: 0.14 },
        side: "right",
      },
    },
    {
      id: "daily-briefing-preferences",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-2-daily-briefing-preferences.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Daily Briefing preferences — configurable cards and surfaces tailored to a role",
      },
      callout: {
        title: "Tailored to your role",
        body: "Choose what your briefing surfaces — pin the cards that matter, hide the ones that don't. Every role gets the view it needs.",
        anchor: { x: 0.30, y: 0.28 },
        side: "right",
      },
    },
    {
      id: "workspace-overview",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-3-workspace.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Corporate Workspace — Get Started cards, Quick Summary stats, Latest Updates feed, To Do list, and Active Documents",
      },
      callout: {
        title: "Your home for every matter",
        body: "A configurable personal workspace surfaces the matters, tasks, briefings, and documents your role needs — at a glance, without searching.",
        anchor: { x: 0.16, y: 0.075 },
        side: "right",
      },
    },
    {
      id: "matter-list",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-4-matter-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matters list — toolbar, columns, and matter records across the firm",
      },
      callout: {
        title: "Every active matter, one place",
        body: "Matters roll up here with status, type, and the people working them. Filters and saved views match how your team thinks.",
        anchor: { x: 0.22, y: 0.20 },
        side: "right",
      },
    },
    {
      id: "matter-detail",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-5-matter-detail.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter detail — overview tab with calendar, contacts, billing, and report card panels",
      },
      callout: {
        title: "Every matter, end-to-end",
        body: "Open any matter to see its overview, calendar, contacts, billing, and report card without leaving the page.",
        anchor: { x: 0.50, y: 0.30 },
        side: "bottom",
      },
    },
    {
      id: "semantic-search",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-6-semantic-search.webp",
        width: 1533,
        height: 861,
        alt: "Spaarke semantic search — natural-language query across matters with AI-ranked results",
      },
      callout: {
        title: "Ask, don't search",
        body: "Natural-language search across every matter — pulls answers from records, documents, and AI summaries instead of returning a file list.",
        anchor: { x: 0.50, y: 0.20 },
        side: "bottom",
      },
    },
  ],
};
