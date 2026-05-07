import type { TourSection } from "../types";

export const aiAutomation: TourSection = {
  id: "ai-automation",
  label: "AI & Automation",
  steps: [
    // Step 1 — create-new-matter (3 callouts)
    {
      id: "create-new-matter-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-1-create-new-matter.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke workspace — Create New Matter card, the entry point for AI quick create",
      },
      callout: {
        title: "Start legal work from one workspace",
        body: "Create matters, projects, assignments, and summaries directly from the operational workspace. AI becomes part of the intake and execution flow, reducing operational friction at the start of legal work.",
        anchor: { x: 0.29, y: 0.22 },
        side: "right",
      },
    },
    {
      id: "create-new-matter-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-1-create-new-matter.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke workspace — Create New Matter card, the entry point for AI quick create",
      },
      callout: {
        title: "AI-assisted operational overview",
        body: "Workspace dashboards surface workload, active matters, assignments, and operational health. Teams gain visibility into legal operations in real time, with AI and automation working alongside operational reporting.",
        anchor: { x: 0.73, y: 0.22 },
        side: "left",
      },
    },
    {
      id: "create-new-matter-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-1-create-new-matter.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke workspace — Create New Matter card, the entry point for AI quick create",
      },
      callout: {
        title: "Work organized around execution",
        body: "Tasks, updates, deadlines, and active documents remain connected in one operational surface. Teams coordinate work without switching systems, so legal operations become proactive instead of reactive.",
        anchor: { x: 0.50, y: 0.63 },
        side: "top",
      },
    },

    // Step 2 — create-matter-wizard (3 callouts)
    {
      id: "create-matter-wizard-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-2-create-matter-wizard.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke AI Quick Create wizard — natural-language input becoming a structured matter record",
      },
      callout: {
        title: "AI extracts structured matter details",
        body: "Describe the work in plain language or from uploaded content. AI identifies matter type, practice area, and operational metadata automatically — reducing manual intake effort and improving consistency.",
        anchor: { x: 0.56, y: 0.33 },
        side: "right",
      },
    },
    {
      id: "create-matter-wizard-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-2-create-matter-wizard.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke AI Quick Create wizard — natural-language input becoming a structured matter record",
      },
      callout: {
        title: "Natural language becomes operational data",
        body: "AI transforms narrative descriptions into structured legal records. Matter summaries and contextual details are generated automatically, making intake faster and more standardized.",
        anchor: { x: 0.58, y: 0.53 },
        side: "right",
      },
    },
    {
      id: "create-matter-wizard-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-2-create-matter-wizard.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke AI Quick Create wizard — natural-language input becoming a structured matter record",
      },
      callout: {
        title: "Guided operational workflow",
        body: "Multi-step workflows guide users through intake, staffing, and next actions. AI and operational processes work together in one experience, so teams can move from intake to execution without re-entering information.",
        anchor: { x: 0.23, y: 0.34 },
        side: "right",
      },
    },

    // Step 3 — create-matter-assign-work (3 callouts)
    {
      id: "create-matter-assign-work-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-3-create-matter-assign-work.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Quick Create — wizard step assigning work and creating tasks alongside the new matter",
      },
      callout: {
        title: "Intake becomes executable work",
        body: "Matter intake immediately transitions into assignments, tasks, and scheduling. Operational execution begins as part of the intake process, reducing delays between intake and action.",
        anchor: { x: 0.54, y: 0.28 },
        side: "right",
      },
    },
    {
      id: "create-matter-assign-work-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-3-create-matter-assign-work.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Quick Create — wizard step assigning work and creating tasks alongside the new matter",
      },
      callout: {
        title: "Structured staffing and scheduling",
        body: "Assign attorneys, paralegals, priorities, and response dates directly within the workflow. Operational staffing becomes standardized and visible, improving coordination across legal teams.",
        anchor: { x: 0.56, y: 0.66 },
        side: "right",
      },
    },
    {
      id: "create-matter-assign-work-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-3-create-matter-assign-work.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke Quick Create — wizard step assigning work and creating tasks alongside the new matter",
      },
      callout: {
        title: "Operational workflows built into the platform",
        body: "Multi-step guided workflows support repeatable operational execution. Processes can adapt by matter type, practice area, or workflow rules — and AI and automation reinforce operational consistency.",
        anchor: { x: 0.22, y: 0.38 },
        side: "right",
      },
    },

    // Step 4 — notifications (3 callouts)
    {
      id: "notifications-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-4-notifications.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke AI notifications — event-driven alerts on matter changes, deadlines, and risk signals",
      },
      callout: {
        title: "Event-driven operational awareness",
        body: "Notifications surface deadlines, filings, assignments, and risk signals automatically. Teams stay informed without relying on manual follow-up, so operational visibility becomes continuous.",
        anchor: { x: 0.89, y: 0.40 },
        side: "left",
      },
    },
    {
      id: "notifications-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-4-notifications.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke AI notifications — event-driven alerts on matter changes, deadlines, and risk signals",
      },
      callout: {
        title: "AI-driven updates and prioritization",
        body: "Notifications summarize operational changes and provide contextual guidance. AI highlights what changed and what requires attention, reducing operational blind spots and missed deadlines.",
        anchor: { x: 0.90, y: 0.22 },
        side: "left",
      },
    },
    {
      id: "notifications-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-4-notifications.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke AI notifications — event-driven alerts on matter changes, deadlines, and risk signals",
      },
      callout: {
        title: "Operational dashboards stay connected",
        body: "Workspace activity, assignments, tasks, and documents remain synchronized with alerts. Teams can move directly from notification to action, keeping legal operations coordinated in real time.",
        anchor: { x: 0.48, y: 0.60 },
        side: "top",
      },
    },

    // Step 5 — matter-list (3 callouts)
    {
      id: "matter-list-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-5-matter-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matters list — cross-matter view ready for AI-generated summaries on each row",
      },
      callout: {
        title: "Centralized matter operations",
        body: "View all active matters from a unified operational surface. Matter type, practice area, and operational metadata remain searchable and structured, giving teams portfolio-level visibility.",
        anchor: { x: 0.44, y: 0.20 },
        side: "right",
      },
    },
    {
      id: "matter-list-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-5-matter-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matters list — cross-matter view ready for AI-generated summaries on each row",
      },
      callout: {
        title: "AI-ready legal operations",
        body: "Every matter becomes available for AI summaries, analysis, and workflow automation. AI capabilities are integrated directly into operational views, so teams can access intelligence without leaving the workflow.",
        anchor: { x: 0.91, y: 0.08 },
        side: "left",
      },
    },
    {
      id: "matter-list-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-5-matter-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matters list — cross-matter view ready for AI-generated summaries on each row",
      },
      callout: {
        title: "Structured operational reporting",
        body: "Matters remain categorized and reportable by operational dimensions. Leadership can analyze work by practice area, matter type, or operational status — improving portfolio management.",
        anchor: { x: 0.63, y: 0.20 },
        side: "bottom",
      },
    },

    // Step 6 — matter-list-ai-summary (3 callouts)
    {
      id: "matter-list-ai-summary-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-6-matter-list-ai-summary.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter list with AI summary — real-time AI-generated rollup of recent activity and priorities",
      },
      callout: {
        title: "AI summaries directly in the workflow",
        body: "AI generates contextual matter summaries directly from the matter list. Users gain immediate operational insight without opening records, reducing time spent searching through matter details.",
        anchor: { x: 0.33, y: 0.32 },
        side: "right",
      },
    },
    {
      id: "matter-list-ai-summary-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-6-matter-list-ai-summary.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter list with AI summary — real-time AI-generated rollup of recent activity and priorities",
      },
      callout: {
        title: "Operational context surfaced automatically",
        body: "AI highlights status, budget, activity, and key matter details. Summaries update as operational activity changes, giving teams faster situational awareness.",
        anchor: { x: 0.37, y: 0.36 },
        side: "right",
      },
    },
    {
      id: "matter-list-ai-summary-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-6-matter-list-ai-summary.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke matter list with AI summary — real-time AI-generated rollup of recent activity and priorities",
      },
      callout: {
        title: "Intelligence embedded into list views",
        body: "Operational intelligence appears directly where teams manage work. AI becomes part of day-to-day workflows instead of a separate tool — users stay inside the operational system while gaining insight.",
        anchor: { x: 0.23, y: 0.18 },
        side: "bottom",
      },
    },

    // Step 7 — m365-copilot (3 callouts)
    {
      id: "m365-copilot-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-7-m365-copilot.webp",
        width: 1540,
        height: 860,
        alt: "Microsoft 365 Copilot answering a matter-context question grounded in Spaarke",
      },
      callout: {
        title: "Spaarke inside Microsoft 365",
        body: "Access Spaarke AI directly from Microsoft 365 Copilot. Teams can ask questions about legal work from the tools they already use, extending operational intelligence across the Microsoft ecosystem.",
        anchor: { x: 0.63, y: 0.32 },
        side: "bottom",
      },
    },
    {
      id: "m365-copilot-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-7-m365-copilot.webp",
        width: 1540,
        height: 860,
        alt: "Microsoft 365 Copilot answering a matter-context question grounded in Spaarke",
      },
      callout: {
        title: "Operational AI assistants",
        body: "AI assistants help users identify overdue work, locate documents, and analyze risks. Legal operations become conversational and context-aware, reducing time spent navigating systems manually.",
        anchor: { x: 0.63, y: 0.67 },
        side: "top",
      },
    },
    {
      id: "m365-copilot-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-7-m365-copilot.webp",
        width: 1540,
        height: 860,
        alt: "Microsoft 365 Copilot answering a matter-context question grounded in Spaarke",
      },
      callout: {
        title: "AI agents integrated into daily work",
        body: "Specialized agents can support research, analysis, administration, and operational workflows. AI capabilities become accessible directly within user workflows, extending legal operations intelligence across teams.",
        anchor: { x: 0.15, y: 0.42 },
        side: "right",
      },
    },

    // Step 8 — playbook-list (3 callouts)
    {
      id: "playbook-list-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-8-playbook-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke playbooks list — visual AI/automation workflows for legal processes",
      },
      callout: {
        title: "Automation built around legal operations",
        body: "Playbooks orchestrate AI analysis, notifications, workflows, and operational actions. Legal processes become repeatable and scalable, with automation aligned to operational execution instead of isolated tasks.",
        anchor: { x: 0.43, y: 0.22 },
        side: "right",
      },
    },
    {
      id: "playbook-list-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-8-playbook-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke playbooks list — visual AI/automation workflows for legal processes",
      },
      callout: {
        title: "AI and workflow working together",
        body: "Combine AI analysis with event-driven automation and operational workflows. Trigger actions from documents, records, schedules, or user activity to build intelligent operational systems across legal work.",
        anchor: { x: 0.72, y: 0.23 },
        side: "left",
      },
    },
    {
      id: "playbook-list-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-8-playbook-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke playbooks list — visual AI/automation workflows for legal processes",
      },
      callout: {
        title: "Operational automation at scale",
        body: "Automate summaries, risk scans, intake, document processing, notifications, and review workflows. Standardize operational execution across the organization and reduce repetitive administrative work.",
        anchor: { x: 0.24, y: 0.54 },
        side: "right",
      },
    },

    // Step 9 — playbook-details (3 callouts)
    {
      id: "playbook-details-callout-1",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-9-playbook-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke playbook builder — visual workflow with decision and action nodes for a matter process",
      },
      callout: {
        title: "Visual AI workflow orchestration",
        body: "Build AI and automation workflows visually using nodes and operational actions. Connect analysis, updates, outputs, and indexing into repeatable flows — reducing dependency on custom-coded workflow logic.",
        anchor: { x: 0.31, y: 0.56 },
        side: "right",
      },
    },
    {
      id: "playbook-details-callout-2",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-9-playbook-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke playbook builder — visual workflow with decision and action nodes for a matter process",
      },
      callout: {
        title: "AI configured for operational outcomes",
        body: "Configure AI skills, prompts, tools, and outputs directly inside workflow nodes. Tailor analysis behavior to legal and operational requirements — AI becomes operationally configurable.",
        anchor: { x: 0.56, y: 0.54 },
        side: "right",
      },
    },
    {
      id: "playbook-details-callout-3",
      screenshot: {
        src: "/tours/full-walkthrough/ai-automation/step-9-playbook-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke playbook builder — visual workflow with decision and action nodes for a matter process",
      },
      callout: {
        title: "Reusable operational building blocks",
        body: "Combine AI analysis, updates, notifications, indexing, and tasks into reusable operational patterns. Workflows can scale across practice areas and operational teams, making legal operations systematized and measurable.",
        anchor: { x: 0.13, y: 0.42 },
        side: "right",
      },
    },
  ],
};
