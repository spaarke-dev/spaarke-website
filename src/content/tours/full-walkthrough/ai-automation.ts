import type { TourSection } from "../types";

export const aiAutomation: TourSection = {
  id: "ai-automation",
  label: "AI & Automation",
  steps: [
    {
      id: "create-new-matter",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-1-create-new-matter.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke workspace — Create New Matter card, the entry point for AI quick create",
      },
      callout: {
        title: "Start a matter from anything",
        body: "Quick Create takes a few sentences, an email, or a document and turns it into a structured matter — no manual fields.",
        anchor: { x: 0.30, y: 0.22 },
        side: "right",
      },
    },
    {
      id: "create-matter-wizard",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-2-create-matter-wizard.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke AI Quick Create wizard — natural-language input becoming a structured matter record",
      },
      callout: {
        title: "AI fills the form for you",
        body: "Describe the matter in plain language; AI extracts parties, type, jurisdiction, and key facts — then drops them into the right fields.",
        anchor: { x: 0.40, y: 0.40 },
        side: "right",
      },
    },
    {
      id: "create-matter-assign-work",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-3-create-matter-assign-work.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Quick Create — wizard step assigning work and creating tasks alongside the new matter",
      },
      callout: {
        title: "Tasks created, not just matters",
        body: "The wizard suggests the work that comes next — assignments, tasks, and milestones — created alongside the matter so day one is unblocked.",
        anchor: { x: 0.45, y: 0.45 },
        side: "right",
      },
    },
    {
      id: "notifications",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-4-notifications.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke AI notifications — event-driven alerts on matter changes, deadlines, and risk signals",
      },
      callout: {
        title: "Tells you, doesn't wait for you",
        body: "Event-driven alerts surface deadline risks, overdue tasks, and matter changes — before someone has to chase them.",
        anchor: { x: 0.30, y: 0.30 },
        side: "right",
      },
    },
    {
      id: "matter-list",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-5-matter-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matters list — cross-matter view ready for AI-generated summaries on each row",
      },
      callout: {
        title: "Every matter, AI-ready",
        body: "Open the matter list and AI is one click away — summaries, status, risk signals, and what to look at next, on any row.",
        anchor: { x: 0.22, y: 0.22 },
        side: "right",
      },
    },
    {
      id: "matter-list-ai-summary",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-6-matter-list-ai-summary.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter list with AI summary — real-time AI-generated rollup of recent activity and priorities",
      },
      callout: {
        title: "Real-time matter summaries",
        body: "AI generates a status summary for every matter — current activity, recent changes, and AI-surfaced priorities — refreshed in real time.",
        anchor: { x: 0.50, y: 0.45 },
        side: "right",
      },
    },
    {
      id: "m365-copilot",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-7-m365-copilot.webp",
        width: 1540,
        height: 860,
        alt: "Microsoft 365 Copilot answering a matter-context question grounded in Spaarke",
      },
      callout: {
        title: "Spaarke inside M365 Copilot",
        body: "Spaarke shows up natively in Microsoft 365 Copilot — your team can ask questions about matters from anywhere they already work.",
        anchor: { x: 0.50, y: 0.30 },
        side: "bottom",
      },
    },
    {
      id: "playbook-list",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-8-playbook-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke playbooks list — visual AI/automation workflows for legal processes",
      },
      callout: {
        title: "Repeatable, runs itself",
        body: "Playbooks turn legal processes into running automations — AI analysis, conditional routing, and matter-aware actions, end to end.",
        anchor: { x: 0.22, y: 0.22 },
        side: "right",
      },
    },
    {
      id: "playbook-details",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-9-playbook-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke playbook builder — visual workflow with decision and action nodes for a matter process",
      },
      callout: {
        title: "Visual, not code",
        body: "Build playbooks visually — decision nodes, action steps, and AI tasks — without writing automation logic by hand.",
        anchor: { x: 0.40, y: 0.40 },
        side: "right",
      },
    },
  ],
};
