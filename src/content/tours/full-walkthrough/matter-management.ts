import type { TourSection } from "../types";

export const matterManagement: TourSection = {
  id: "matter-management",
  label: "Matter Management",
  steps: [
    {
      id: "tour-intro",
      interstitial: true,
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-3-workspace.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Corporate Workspace — representative view used as the backdrop for the tour intro",
      },
      callout: {
        title: "A guided walkthrough of Spaarke",
        body: "Spaarke unifies legal operations across matter management, documents, collaboration, AI, and spend — built natively on Microsoft. The next 100 steps walk through how it fits together. Use the arrow keys or click to advance.",
      },
    },
    {
      id: "daily-briefing-summary",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-1-daily-briefing.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Daily Briefing — AI-generated rollup of activity, priorities, and matter updates across the user's portfolio",
      },
      callout: {
        title: "Your day, summarized by AI",
        body: "AI-generated briefings surface overdue work, upcoming deadlines, and recent matter activity. Prioritize what needs attention without opening every matter, and start the day with operational context already assembled.",
        anchor: { x: 0.31, y: 0.169 },
        pointer: "left-top",
      },
    },
    {
      id: "daily-briefing-attention",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-1-daily-briefing.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Daily Briefing — AI-generated rollup of activity, priorities, and matter updates across the user's portfolio",
      },
      callout: {
        title: "Work that needs attention",
        body: "Overdue tasks and approaching deadlines are grouped automatically. Each item links directly back to the underlying matter and work item — reducing missed deadlines and improving operational visibility.",
        anchor: { x: 0.321, y: 0.567 },
        pointer: "left-middle",
      },
    },
    {
      id: "daily-briefing-connected",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-1-daily-briefing.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Daily Briefing — AI-generated rollup of activity, priorities, and matter updates across the user's portfolio",
      },
      callout: {
        title: "Connected to every matter",
        body: "Activity updates roll up from tasks, filings, reviews, emails, and events. The briefing continuously updates as work changes — one view across the full legal operation.",
        anchor: { x: 0.733, y: 0.503 },
        pointer: "right-middle",
      },
    },
    {
      id: "daily-briefing-preferences-role",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-2-daily-briefing-preferences.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Daily Briefing preferences — configurable cards and surfaces tailored to a role",
      },
      callout: {
        title: "Tailored to your role",
        body: "Configure what appears in your briefing feed. Surface the updates most relevant to your practice and responsibilities — every user gets a personalized operational view.",
        anchor: { x: 0.631, y: 0.226 },
        pointer: "right-top",
      },
    },
    {
      id: "daily-briefing-preferences-signal",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-2-daily-briefing-preferences.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Daily Briefing preferences — configurable cards and surfaces tailored to a role",
      },
      callout: {
        title: "Control the signal",
        body: "Turn channels on or off by activity type. Focus on deadlines, documents, emails, assignments, or matter activity — reducing noise without losing visibility.",
        anchor: { x: 0.631, y: 0.489 },
        pointer: "right-top",
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
        title: "Your legal operations workspace",
        body: "A configurable workspace for matters, tasks, documents, and updates. Bring together the information your team uses every day — and reduce context switching across disconnected systems.",
        anchor: { x: 0.201, y: 0.122 },
        pointer: "top-left",
      },
    },
    {
      id: "workspace-actions",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-3-workspace.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Corporate Workspace — Get Started cards, Quick Summary stats, Latest Updates feed, To Do list, and Active Documents",
      },
      callout: {
        title: "Work starts here",
        body: "Launch common actions directly from the workspace. Create matters, assign work, and summarize documents in one click — AI and workflow tools are built directly into daily operations.",
        anchor: { x: 0.319, y: 0.322 },
        pointer: "top-middle",
      },
    },
    {
      id: "workspace-priorities",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-3-workspace.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Corporate Workspace — Get Started cards, Quick Summary stats, Latest Updates feed, To Do list, and Active Documents",
      },
      callout: {
        title: "Priorities in real time",
        body: "Active work, deadlines, and documents update continuously. Smart scoring highlights what requires immediate attention — keeping teams aligned on operational priorities.",
        anchor: { x: 0.354, y: 0.757 },
        pointer: "left-middle",
      },
    },
    {
      id: "matter-list-overview",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-4-matter-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matters list — toolbar, columns, and matter records across the firm",
      },
      callout: {
        title: "Every matter, one system",
        body: "View all active matters across the organization. Track matter type, practice area, ownership, and status — one operational system instead of disconnected spreadsheets and folders.",
        anchor: { x: 0.082, y: 0.221 },
        pointer: "left-top",
      },
    },
    {
      id: "matter-list-views",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-4-matter-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matters list — toolbar, columns, and matter records across the firm",
      },
      callout: {
        title: "Views built for legal teams",
        body: "Filter and organize matters by practice, client, team, or workflow. Save personalized views for different legal operations roles — surfacing exactly the information your team needs.",
        anchor: { x: 0.85, y: 0.142 },
        pointer: "top-right",
      },
    },
    {
      id: "matter-detail-record",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-5-matter-detail.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter detail — overview tab with calendar, contacts, billing, and report card panels",
      },
      callout: {
        title: "The complete matter record",
        body: "Every matter brings together documents, tasks, contacts, deadlines, billing, and reporting. Teams work from a shared operational view — context stays connected across the lifecycle of the matter.",
        anchor: { x: 0.365, y: 0.167 },
        pointer: "left-top",
      },
    },
    {
      id: "matter-detail-documents",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-5-matter-detail.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter detail — overview tab with calendar, contacts, billing, and report card panels",
      },
      callout: {
        title: "Documents tied to the work",
        body: "Documents remain connected to the matter they belong to. Search, preview, and collaborate without leaving the matter — preserving context, history, and auditability.",
        anchor: { x: 0.124, y: 0.454 },
        pointer: "bottom-left",
      },
    },
    {
      id: "matter-detail-performance",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-5-matter-detail.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter detail — overview tab with calendar, contacts, billing, and report card panels",
      },
      callout: {
        title: "Operational performance visibility",
        body: "Track budgets, compliance, performance grades, and upcoming deadlines. Financial and operational insights live beside the legal work — see matter health at a glance.",
        anchor: { x: 0.243, y: 0.296 },
        pointer: "left-middle",
      },
    },
    {
      id: "semantic-search-ask",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-6-semantic-search.webp",
        width: 1533,
        height: 861,
        alt: "Spaarke semantic search — natural-language query across matters with AI-ranked results",
      },
      callout: {
        title: "Ask, don't search",
        body: "Natural-language search across matters, documents, projects, and invoices. AI surfaces relationships and relevance instead of keyword matches — find information based on meaning and context.",
        anchor: { x: 0.275, y: 0.289 },
        pointer: "left-middle",
      },
    },
    {
      id: "semantic-search-discover",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-6-semantic-search.webp",
        width: 1533,
        height: 861,
        alt: "Spaarke semantic search — natural-language query across matters with AI-ranked results",
      },
      callout: {
        title: "Discover connected information",
        body: "Visual relationship graphs expose related files and matter connections. Identify similar work, linked documents, and operational patterns — moving beyond folders and static search results.",
        anchor: { x: 0.569, y: 0.306 },
        pointer: "left-middle",
      },
    },
    {
      id: "semantic-search-tune",
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-6-semantic-search.webp",
        width: 1533,
        height: 861,
        alt: "Spaarke semantic search — natural-language query across matters with AI-ranked results",
      },
      callout: {
        title: "Tune AI relevance",
        body: "Adjust thresholds, clustering, and similarity scoring. Refine how semantic results are grouped and surfaced — designed for large-scale enterprise legal repositories.",
        anchor: { x: 0.815, y: 0.229 },
        pointer: "right-middle",
      },
    },
    {
      id: "transition-to-documents-email",
      interstitial: true,
      screenshot: {
        src: "/tours/full-walkthrough/matter-management/step-6-semantic-search.webp",
        width: 1533,
        height: 861,
        alt: "Spaarke semantic search — backdrop for the transition to Documents & Email",
      },
      callout: {
        title: "Next: Documents & Email",
        body: "Every document and email connected to its matter, AI-summarized, and discoverable through semantic search — so knowledge is reusable, not buried.",
      },
    },
  ],
};
