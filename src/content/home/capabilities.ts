/**
 * Section 4 — Capabilities (sticky-stack feature carousel) +
 * Microsoft foundation card.
 *
 * Each capability renders as one sticky module: capability title +
 * one-line description, a screenshot on the left, and a clickable
 * feature list on the right. Selecting a feature swaps the screenshot.
 *
 * Screenshots are static-imported from /resources/screenshots/* so
 * /resources stays the single source of truth (no public/ copy).
 */

import type { StaticImageData } from "next/image";

import matterRecordDetails from "../../../resources/screenshots/matter-record-details.jpeg";
import myWorkspace from "../../../resources/screenshots/matter-management/my-workspace-light.png";
import dailyBriefing from "../../../resources/screenshots/matter-management/daily-briefing-light.png";
import smartToDo from "../../../resources/screenshots/matter-management/to-do-light.png";
import quickCreate from "../../../resources/screenshots/matter-management/quick-create-new-matters-light.png";

import documentRecord from "../../../resources/screenshots/documents/document-record-partial-light.png";
import similarDocuments from "../../../resources/screenshots/documents/similar-documents-light.png";
import similarGraph from "../../../resources/screenshots/documents/similar-documents-graph-view-light.png";
import outlookSave from "../../../resources/screenshots/documents/outlook-save-to-spaarke-light.png";
import wordSave from "../../../resources/screenshots/documents/word-save-to-spaarke-light.png";

import secureProjectWorkspace from "../../../resources/screenshots/collaboration/secure-project-workspace-light.png";
import outsideCounselAccess from "../../../resources/screenshots/collaboration/outside-counsel-access-light.png";
import wordCoCreation from "../../../resources/screenshots/collaboration/word-co-creation-light.png";
import shareMatters from "../../../resources/screenshots/collaboration/share-matters-light.png";
import teamsSpaarkeApp from "../../../resources/screenshots/collaboration/teams-spaarke-app.png";

import aiMatterSummaries from "../../../resources/screenshots/ai-and-automation/AI generated matter summaries-light.png";
import m365CopilotIntegration from "../../../resources/screenshots/ai-and-automation/M365-copilot-integration.png";
import documentSummaries from "../../../resources/screenshots/ai-and-automation/document-summaries-light.png";
import wordAiCopilot from "../../../resources/screenshots/ai-and-automation/word-ai-copilot-light.png";
import aiPlaybooks from "../../../resources/screenshots/ai-and-automation/ai-and-automation-playbooks-light.png";

import outsideCounselReportCard from "../../../resources/screenshots/spend-and-performance/Outside-counsel-report-card-light.png";
import financialPerformanceMetrics from "../../../resources/screenshots/spend-and-performance/financial-performance-metrics-light.png";
import billingSummary from "../../../resources/screenshots/spend-and-performance/billing-summary-light.png";
import budgetTracking from "../../../resources/screenshots/spend-and-performance/budget-tracking-light.png";
import powerbiDashboards from "../../../resources/screenshots/spend-and-performance/powerbi-dashboards-light.png";

export type CapabilityFeature = {
  /** Stable key for React + active-feature state. */
  id: string;
  name: string;
  description: string;
  screenshot: {
    image: StaticImageData;
    alt: string;
  };
};

export type Capability = {
  /** Anchor id used by /platform deep-links. */
  id: string;
  name: string;
  description: string;
  features: CapabilityFeature[];
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
  capabilities: Capability[];
  foundation: FoundationCard;
};

export const capabilitiesContent: CapabilitiesContent = {
  capabilities: [
    {
      id: "matter-management",
      name: "Matter Management",
      description:
        "A unified system for managing matters with complete visibility into work, documents, collaboration, and external counsel.",
      features: [
        {
          id: "matter-records",
          name: "Matter and project records",
          description:
            "Comprehensive matter and project records with AI-generated summaries and full visibility into work, documents, and external counsel.",
          screenshot: {
            image: matterRecordDetails,
            alt: "Spaarke matter record — overview, calendar, contacts, email, billing, and report card with matter information panel",
          },
        },
        {
          id: "personal-workspaces",
          name: "Personal workspaces",
          description:
            "Configurable personal workspaces surface the information, activity, and insights each user needs to stay on top of their work.",
          screenshot: {
            image: myWorkspace,
            alt: "Spaarke My Workspace — configurable surfaces showing the information and activity each user needs",
          },
        },
        {
          id: "daily-briefings",
          name: "Daily briefings report",
          description:
            "AI-generated daily briefings provide a real-time view of work, activity, and priorities across all matters.",
          screenshot: {
            image: dailyBriefing,
            alt: "Spaarke daily briefing — AI-generated real-time view of work, activity, and priorities across matters",
          },
        },
        {
          id: "smart-to-do",
          name: "Smart 'To Do'",
          description:
            "A smart AI monitored to-do system that connects tasks to the underlying work — matters, documents, events, and projects.",
          screenshot: {
            image: smartToDo,
            alt: "Spaarke Smart To Do — AI monitored task list connected to matters, documents, events, and projects",
          },
        },
        {
          id: "ai-quick-create",
          name: "AI quick create",
          description:
            "AI-powered quick create turns input into fully structured records with summaries and contextual profiles.",
          screenshot: {
            image: quickCreate,
            alt: "Spaarke AI quick create — turns natural-language input into fully structured matter records",
          },
        },
      ],
    },
    {
      id: "documents-email",
      name: "Documents & Email",
      description:
        "Every document and email connected to its matter, AI-summarized, and discoverable through semantic search.",
      features: [
        {
          id: "document-records",
          name: "Document records",
          description:
            "Rich document profiles with AI-generated summaries, metadata, version history, and the matter context they belong to.",
          screenshot: {
            image: documentRecord,
            alt: "Spaarke document record — AI-summarized profile with metadata, version history, and matter linkage",
          },
        },
        {
          id: "find-similar",
          name: "Find similar",
          description:
            "Azure AI semantic search surfaces similar documents across every matter and counsel — past work, on demand.",
          screenshot: {
            image: similarDocuments,
            alt: "Spaarke Find Similar — semantic-search results showing documents related to the current record",
          },
        },
        {
          id: "relationship-graph",
          name: "Relationship graph",
          description:
            "Visualize how documents relate so you can discover precedents, prior work, and conflicts at a glance.",
          screenshot: {
            image: similarGraph,
            alt: "Spaarke document relationship graph — visual map of similar documents and their connections",
          },
        },
        {
          id: "email-capture",
          name: "Email capture",
          description:
            "Save emails to the right matter, project, or document set without leaving Outlook.",
          screenshot: {
            image: outlookSave,
            alt: "Spaarke save-to-Spaarke add-in for Outlook — capture an email to its matter or document set",
          },
        },
        {
          id: "office-integration",
          name: "Office integration",
          description:
            "Save Word, Excel, and PowerPoint files directly to Spaarke from inside the Office apps your team already uses.",
          screenshot: {
            image: wordSave,
            alt: "Spaarke save-to-Spaarke add-in for Microsoft Word — save documents directly to a matter from Word",
          },
        },
      ],
    },
    {
      id: "collaboration",
      name: "Collaboration",
      description:
        "Secure shared workspaces for everyone working a matter — internal teams, business clients, and outside counsel, in one place.",
      features: [
        {
          id: "secure-workspaces",
          name: "Secure project workspaces",
          description:
            "Granular workspaces for matters, projects, and deals — invite-only, role-aware, and connected to the underlying work.",
          screenshot: {
            image: secureProjectWorkspace,
            alt: "Spaarke secure project workspace — invite-only collaborative space tied to a matter",
          },
        },
        {
          id: "outside-counsel-access",
          name: "Outside counsel access",
          description:
            "Give outside counsel direct, secure access to the documents and tasks they need — without sending another email attachment.",
          screenshot: {
            image: outsideCounselAccess,
            alt: "Spaarke outside counsel access — external workspace exposing only the documents and tasks counsel need",
          },
        },
        {
          id: "word-co-creation",
          name: "Word co-creation and editing",
          description:
            "Co-author Word documents in place — multiple stakeholders, real-time edits, every version anchored to its matter.",
          screenshot: {
            image: wordCoCreation,
            alt: "Spaarke + Microsoft Word co-creation — multiple authors editing a document inside its matter",
          },
        },
        {
          id: "shared-matters",
          name: "Shared matters and projects",
          description:
            "Share entire matters and projects with internal and external collaborators while preserving privilege and audit trails.",
          screenshot: {
            image: shareMatters,
            alt: "Spaarke shared matters and projects — collaborators view with privilege-preserving sharing controls",
          },
        },
        {
          id: "teams-app",
          name: "Teams app collaboration",
          description:
            "The Spaarke app inside Microsoft Teams brings matter chat, files, and tasks to where your team already collaborates.",
          screenshot: {
            image: teamsSpaarkeApp,
            alt: "Spaarke app inside Microsoft Teams — matter-centric chat, files, and tasks within the Teams client",
          },
        },
      ],
    },
    {
      id: "ai-automation",
      name: "AI & Automation",
      description:
        "AI summaries, Copilot-native experiences, and event-driven playbooks — operational intelligence that runs in the background.",
      features: [
        {
          id: "matter-summaries",
          name: "AI generated matter summaries",
          description:
            "Real-time AI summaries for every matter — current status, recent activity, and what to look at next.",
          screenshot: {
            image: aiMatterSummaries,
            alt: "Spaarke AI-generated matter summary — status, recent activity, and AI-surfaced priorities",
          },
        },
        {
          id: "m365-copilot",
          name: "M365 Copilot integration",
          description:
            "Spaarke shows up natively in Microsoft 365 Copilot so your team can ask questions about matters from anywhere.",
          screenshot: {
            image: m365CopilotIntegration,
            alt: "Microsoft 365 Copilot answering a matter-context question using Spaarke as a knowledge source",
          },
        },
        {
          id: "document-profiles",
          name: "Auto created document profiles",
          description:
            "AI generates a structured profile for every uploaded document — summary, key terms, parties, and matter linkage.",
          screenshot: {
            image: documentSummaries,
            alt: "Spaarke auto-generated document profile — AI summary, key terms, and matter linkage",
          },
        },
        {
          id: "word-copilot",
          name: "Document drafting with Word Copilot",
          description:
            "Draft directly inside Word using Copilot grounded in the matter's documents, precedents, and prior work.",
          screenshot: {
            image: wordAiCopilot,
            alt: "Word with Copilot drafting a document grounded in the matter's content via Spaarke",
          },
        },
        {
          id: "playbooks",
          name: "AI and automation playbooks",
          description:
            "Visual playbooks turn legal processes into automations — AI analysis, conditional routing, and matter-aware actions.",
          screenshot: {
            image: aiPlaybooks,
            alt: "Spaarke playbook builder — visual AI and automation workflow with decision and action nodes",
          },
        },
      ],
    },
    {
      id: "spend-performance",
      name: "Spend & Performance",
      description:
        "The financial and operational truth about every matter and every firm — invoices, budgets, OCG compliance, and outcomes.",
      features: [
        {
          id: "counsel-metrics",
          name: "Outside counsel performance metrics",
          description:
            "Score and benchmark outside counsel on cost, cycle time, OCG compliance, and matter outcomes.",
          screenshot: {
            image: outsideCounselReportCard,
            alt: "Spaarke outside counsel report card — performance grades for cost, timeliness, and compliance",
          },
        },
        {
          id: "matter-report-cards",
          name: "Matter report cards",
          description:
            "A single matter scorecard that combines budget, spend, performance grades, and risk signals at a glance.",
          screenshot: {
            image: financialPerformanceMetrics,
            alt: "Spaarke matter report card — financial performance metrics across budget, spend, and outcomes",
          },
        },
        {
          id: "billing-rollup",
          name: "Billing to matter roll-up data",
          description:
            "Every invoice rolled up to its matter, project, and counsel — so spend trends are always one click away.",
          screenshot: {
            image: billingSummary,
            alt: "Spaarke billing summary — invoices rolled up to matter, project, and counsel with spend trends",
          },
        },
        {
          id: "budget-tracking",
          name: "Budget setup and tracking",
          description:
            "Set matter budgets, track actual against forecast, and get alerted before a matter goes over.",
          screenshot: {
            image: budgetTracking,
            alt: "Spaarke budget tracking — actual versus forecast spend for a matter with overage alerts",
          },
        },
        {
          id: "powerbi-dashboards",
          name: "Power BI dashboards",
          description:
            "Power BI dashboards built directly on Spaarke data — cross-matter spend, performance, and operational analytics.",
          screenshot: {
            image: powerbiDashboards,
            alt: "Spaarke Power BI dashboards — cross-matter spend, performance, and operational analytics",
          },
        },
      ],
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
