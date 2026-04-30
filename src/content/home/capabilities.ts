/**
 * Section 4 — Capabilities (zigzag) + Microsoft foundation card.
 *
 * Light slab continues from Section 3 (no break).
 *
 * Five capability rows in alternating image-left/image-right layout.
 * Bullet copy per the mockup (tighter than the brief's longer prose).
 *
 * Microsoft foundation card uses seven logos (M365 Apps + Outlook both
 * included per latest decision; brief said Outlook, mockup showed M365 Apps).
 */

export type Capability = {
  number: string;
  name: string;
  body: string;
  bullets: [string, string, string];
  screenshot: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  imagePosition: "left" | "right";
};

export type FoundationLogo = {
  name: string;
  src: string;
  alt: string;
};

export type FoundationCard = {
  eyebrow: string;
  heading: string;
  body: string;
  logos: [
    FoundationLogo,
    FoundationLogo,
    FoundationLogo,
    FoundationLogo,
    FoundationLogo,
    FoundationLogo,
    FoundationLogo,
  ];
};

export type CapabilitiesContent = {
  capabilities: [Capability, Capability, Capability, Capability, Capability];
  foundation: FoundationCard;
};

export const capabilitiesContent: CapabilitiesContent = {
  capabilities: [
    {
      number: "01",
      name: "Operations",
      body: "Matters, projects, tasks, and people — the operational backbone for the legal team and the work they own.",
      bullets: ["Daily briefing", "Smart to-dos", "Performance tracking"],
      screenshot: {
        src: "/brand/capabilities/operations.png",
        alt: "Spaarke Operations dashboard — corporate workspace with quick summary, latest updates, my to-do list, and active documents",
        width: 1800,
        height: 1100,
      },
      imagePosition: "right",
    },
    {
      number: "02",
      name: "Documents & Knowledge",
      body: "Every document, email, and contract — connected, searchable, and AI-aware. Built on SharePoint Embedded with Azure AI semantic search and Find Similar.",
      bullets: ["Matter-aware search", "SharePoint-native", "Privilege-safe AI"],
      screenshot: {
        src: "/brand/capabilities/documents.png",
        alt: "Spaarke document record — overview, analysis, and similar-document panel powered by Azure AI semantic search",
        width: 1800,
        height: 1100,
      },
      imagePosition: "left",
    },
    {
      number: "03",
      name: "Collaboration",
      body: "Secure shared workspaces for outside counsel, business clients, and anyone working a matter — without sending another email attachment.",
      bullets: ["Shared matters", "Tasks & invoices", "Cross-firm access"],
      screenshot: {
        src: "/brand/capabilities/collaboration.png",
        alt: "Spaarke external workspace — shared documents and projects accessible to outside counsel",
        width: 1800,
        height: 1100,
      },
      imagePosition: "right",
    },
    {
      number: "04",
      name: "Agents & Automation",
      body: "AI agents, automated workflows, and event-driven rules — the operational intelligence that runs in the background and shows up in Copilot.",
      bullets: ["Copilot-native", "Azure AI Foundry", "Context-aware"],
      screenshot: {
        src: "/brand/capabilities/automation.png",
        alt: "Spaarke playbook builder — visual workflow editor with AI analysis and decision nodes",
        width: 1800,
        height: 1100,
      },
      imagePosition: "left",
    },
    {
      number: "05",
      name: "Spend & Performance",
      body: "Invoices, budgets, OCG compliance, and matter outcomes — the financial and operational truth about every matter and every firm.",
      bullets: ["OCG compliance", "Spend signals", "Cross-firm view"],
      screenshot: {
        src: "/brand/capabilities/spend-performance.png",
        alt: "Spaarke matter scorecard — performance grades, financial metrics, and upcoming tasks",
        width: 1800,
        height: 1100,
      },
      imagePosition: "right",
    },
  ],
  foundation: {
    eyebrow: "Built on Microsoft",
    heading: "Microsoft, end to end.",
    body: "Spaarke runs natively on the Microsoft tools your team already uses, inside the security perimeter your IT team already approved. No new identity, no parallel governance.",
    logos: [
      { name: "Power Platform", src: "/brand/logos/powerplatform-scalable.svg", alt: "Microsoft Power Platform" },
      { name: "SharePoint", src: "/brand/logos/sharepoint-512.png", alt: "Microsoft SharePoint" },
      { name: "Microsoft 365 Apps", src: "/brand/logos/microsoft-365-apps-logo.png", alt: "Microsoft 365 Apps" },
      { name: "Outlook", src: "/brand/logos/outlook-512.png", alt: "Microsoft Outlook" },
      { name: "Teams", src: "/brand/logos/Microsoft_Office_Teams.svg", alt: "Microsoft Teams" },
      { name: "Microsoft 365 Copilot", src: "/brand/logos/microsoft-365-copilot-badge.svg", alt: "Microsoft 365 Copilot" },
      { name: "Azure AI Foundry", src: "/brand/logos/azure-256x256-padded.png", alt: "Azure AI Foundry" },
    ],
  },
};
