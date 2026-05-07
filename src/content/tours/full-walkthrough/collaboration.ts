import type { TourSection } from "../types";

export const collaboration: TourSection = {
  id: "collaboration",
  label: "Collaboration",
  steps: [
    {
      id: "projects-list-overview",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-1-projects-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke projects list — collaborative workspaces tied to matters",
      },
      callout: {
        title: "Collaboration built into operations",
        body: "Projects organize collaboration around legal work, not disconnected folders. Matters, teams, and operational records stay connected in one workspace, so legal collaboration becomes structured and searchable.",
        anchor: { x: 0.242, y: 0.094 },
        pointer: "left-top",
      },
    },
    {
      id: "projects-list-context",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-1-projects-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke projects list — collaborative workspaces tied to matters",
      },
      callout: {
        title: "Work organized by business context",
        body: "Projects can be categorized by practice area, matter type, and operational ownership. Teams gain visibility into active work across the organization, and operational reporting becomes standardized.",
        anchor: { x: 0.197, y: 0.494 },
        pointer: "top-middle",
      },
    },
    {
      id: "projects-list-ownership",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-1-projects-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke projects list — collaborative workspaces tied to matters",
      },
      callout: {
        title: "Visibility into ownership and activity",
        body: "Track project ownership, staffing, and status directly within the workspace. Teams know who is responsible for operational execution, reducing disconnected communication and shadow workflows.",
        anchor: { x: 0.674, y: 0.165 },
        pointer: "right-top",
      },
    },
    {
      id: "projects-details-workspace",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-2-projects-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke project detail — members, documents, tasks, and discussion in one place",
      },
      callout: {
        title: "One workspace for the entire matter",
        body: "Documents, calendars, contacts, email, and reporting stay connected inside the project. Teams collaborate from one operational source of truth, eliminating fragmented communication across tools and inboxes.",
        anchor: { x: 0.376, y: 0.114 },
        pointer: "left-top",
      },
    },
    {
      id: "projects-details-documents",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-2-projects-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke project detail — members, documents, tasks, and discussion in one place",
      },
      callout: {
        title: "Operational document collaboration",
        body: "Documents remain tied directly to the project and matter. Teams can search, review, preview, and manage work product from one interface, with AI-powered document operations integrated into daily work.",
        anchor: { x: 0.169, y: 0.421 },
        pointer: "bottom-left",
      },
    },
    {
      id: "projects-details-performance",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-2-projects-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke project detail — members, documents, tasks, and discussion in one place",
      },
      callout: {
        title: "Performance and financial visibility",
        body: "Monitor operational health, compliance, spend, and outcomes directly within the workspace. Reporting becomes part of day-to-day legal operations, so leadership gains visibility without separate reporting systems.",
        anchor: { x: 0.672, y: 0.418 },
        pointer: "right-middle",
      },
    },
    {
      id: "projects-details-execution",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-2-projects-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke project detail — members, documents, tasks, and discussion in one place",
      },
      callout: {
        title: "Workspace-driven execution",
        body: "Upcoming tasks, related matters, and operational activity remain connected to the project. Teams coordinate work from a shared operational context, reducing delays caused by disconnected systems.",
        anchor: { x: 0.662, y: 0.694 },
        pointer: "right-middle",
      },
    },
    {
      id: "projects-share-secure",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-3-projects-share.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke share project — privilege-preserving sharing controls for matters and projects",
      },
      callout: {
        title: "Share securely across teams",
        body: "Share projects with internal and external collaborators directly from the workspace. Permissions remain governed centrally, so operational collaboration stays secure and auditable.",
        anchor: { x: 0.549, y: 0.084 },
        pointer: "right-top",
      },
    },
    {
      id: "projects-share-permissions",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-3-projects-share.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke share project — privilege-preserving sharing controls for matters and projects",
      },
      callout: {
        title: "Granular role-based permissions",
        body: "Control read, write, assign, and sharing rights per user or team. Permissions can be tailored to operational responsibility, keeping external collaboration tightly governed.",
        anchor: { x: 0.549, y: 0.371 },
        pointer: "right-top",
      },
    },
    {
      id: "projects-share-control",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-3-projects-share.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke share project — privilege-preserving sharing controls for matters and projects",
      },
      callout: {
        title: "Collaboration without losing control",
        body: "Privileged work remains governed while enabling broader collaboration. Auditability and operational oversight are preserved automatically, and legal operations teams maintain visibility into access decisions.",
        anchor: { x: 0.89, y: 0.924 },
        pointer: "bottom-right",
      },
    },
    {
      id: "secure-workspace-external",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-4-secure-workspace.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace — external workspace exposing only the documents and tasks counsel needs",
      },
      callout: {
        title: "Secure external collaboration",
        body: "Outside counsel and external collaborators receive secure workspace access. Collaboration occurs inside the operational platform instead of email chains, so external work becomes visible and manageable.",
        anchor: { x: 0.67, y: 0.135 },
        pointer: "left-top",
      },
    },
    {
      id: "secure-workspace-activity",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-4-secure-workspace.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace — external workspace exposing only the documents and tasks counsel needs",
      },
      callout: {
        title: "Shared operational activity",
        body: "External users can view assigned tasks, events, and shared project activity. Collaboration stays aligned to operational execution, and teams maintain a unified operational timeline.",
        anchor: { x: 0.67, y: 0.154 },
        pointer: "left-top",
      },
    },
    {
      id: "secure-workspace-documents",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-4-secure-workspace.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace — external workspace exposing only the documents and tasks counsel needs",
      },
      callout: {
        title: "Controlled document access",
        body: "External collaborators only see approved projects and documents. Access remains tied to workspace permissions and operational governance, making information sharing structured and secure.",
        anchor: { x: 0.67, y: 0.544 },
        pointer: "left-top",
      },
    },
    {
      id: "secure-workspace-details-context",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-5-secure-workspace-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace detail — granular permissions and member access scoped to a matter",
      },
      callout: {
        title: "External users work from the same context",
        body: "External collaborators access structured project information directly. Project details, documents, and operational context remain connected, reducing communication overhead and duplicated work.",
        anchor: { x: 0.67, y: 0.154 },
        pointer: "left-top",
      },
    },
    {
      id: "secure-workspace-details-search",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-5-secure-workspace-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace detail — granular permissions and member access scoped to a matter",
      },
      callout: {
        title: "AI-powered document search",
        body: "External users can search project documents using natural language. AI summaries and semantic search accelerate discovery, making shared knowledge easier to navigate.",
        anchor: { x: 0.67, y: 0.154 },
        pointer: "left-top",
      },
    },
    {
      id: "secure-workspace-details-contribute",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-5-secure-workspace-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace detail — granular permissions and member access scoped to a matter",
      },
      callout: {
        title: "Controlled document contribution",
        body: "External collaborators can upload and contribute documents securely. All content remains tied to the operational workspace, and governance and auditability remain intact.",
        anchor: { x: 0.67, y: 0.544 },
        pointer: "left-top",
      },
    },
    {
      id: "secure-workspace-details-operational",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-5-secure-workspace-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace detail — granular permissions and member access scoped to a matter",
      },
      callout: {
        title: "Workspace-level operational collaboration",
        body: "Calendars, contacts, tasks, and communication remain integrated into the project. Collaboration extends beyond files into operational execution, creating a shared operational environment across organizations.",
        anchor: { x: 0.67, y: 0.135 },
        pointer: "left-top",
      },
    },
    {
      id: "teams-app-spaarke",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-6-teams.webp",
        width: 1533,
        height: 857,
        alt: "Spaarke app inside Microsoft Teams — matter-centric chat, files, and tasks in the Teams client",
      },
      callout: {
        title: "Spaarke inside Microsoft Teams",
        body: "Bring operational legal work directly into Microsoft Teams. Access documents, tasks, and collaboration workflows without switching systems — meeting teams where they already work every day.",
        anchor: { x: 0.569, y: 0.383 },
        pointer: "top-middle",
      },
    },
    {
      id: "teams-app-ai",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-6-teams.webp",
        width: 1533,
        height: 857,
        alt: "Spaarke app inside Microsoft Teams — matter-centric chat, files, and tasks in the Teams client",
      },
      callout: {
        title: "AI operational assistance",
        body: "Teams can search documents, identify risks, and review overdue work using AI. AI becomes embedded directly into operational collaboration, so legal work gains operational intelligence inside the collaboration layer.",
        anchor: { x: 0.271, y: 0.669 },
        pointer: "right-middle",
      },
    },
    {
      id: "teams-app-ecosystem",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-6-teams.webp",
        width: 1533,
        height: 857,
        alt: "Spaarke app inside Microsoft Teams — matter-centric chat, files, and tasks in the Teams client",
      },
      callout: {
        title: "Embedded collaboration ecosystem",
        body: "Spaarke integrates directly into the Microsoft 365 collaboration stack. Chat, meetings, files, AI, and operational workflows converge in one experience, reducing friction between legal operations and business collaboration.",
        anchor: { x: 0.463, y: 0.285 },
        pointer: "right-middle",
      },
    },
    {
      id: "transition-to-ai-automation",
      interstitial: true,
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-6-teams.webp",
        width: 1533,
        height: 857,
        alt: "Spaarke Teams app — backdrop for the transition to AI & Automation",
      },
      callout: {
        title: "Next: AI & Automation",
        body: "AI summaries, Copilot-native experiences, and event-driven playbooks — AI that runs across your legal operations, not just drafting.",
      },
    },
  ],
};
