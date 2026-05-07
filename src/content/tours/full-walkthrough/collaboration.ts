import type { TourSection } from "../types";

export const collaboration: TourSection = {
  id: "collaboration",
  label: "Collaboration",
  steps: [
    {
      id: "projects-list",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-1-projects-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke projects list — collaborative workspaces tied to matters",
      },
      callout: {
        title: "Projects, not just folders",
        body: "Each project is a workspace tied to its matter — invite-only, role-aware, and connected to the underlying records.",
        anchor: { x: 0.22, y: 0.20 },
        side: "right",
      },
    },
    {
      id: "projects-details",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-2-projects-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke project detail — members, documents, tasks, and discussion in one place",
      },
      callout: {
        title: "One context for the whole team",
        body: "Members, documents, tasks, and discussion live on the project — no email threads, no shadow folders, no losing the trail.",
        anchor: { x: 0.32, y: 0.30 },
        side: "right",
      },
    },
    {
      id: "projects-share",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-3-projects-share.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke share project — privilege-preserving sharing controls for matters and projects",
      },
      callout: {
        title: "Share without losing privilege",
        body: "Share entire projects with internal and external collaborators while preserving privilege, role, and audit trail on every action.",
        anchor: { x: 0.50, y: 0.30 },
        side: "bottom",
      },
    },
    {
      id: "secure-workspace",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-4-secure-workspace.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace — external workspace exposing only the documents and tasks counsel needs",
      },
      callout: {
        title: "Outside counsel, inside one space",
        body: "Give outside counsel and clients direct access to the documents and tasks they need — not another email attachment, not a separate portal.",
        anchor: { x: 0.30, y: 0.25 },
        side: "right",
      },
    },
    {
      id: "secure-workspace-details",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-5-secure-workspace-details.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke secure workspace detail — granular permissions and member access scoped to a matter",
      },
      callout: {
        title: "Granular by design",
        body: "Permissions scoped per workspace, per role, per document — so external collaborators see exactly what they should and nothing more.",
        anchor: { x: 0.40, y: 0.35 },
        side: "right",
      },
    },
    {
      id: "teams-app",
      screenshot: {
        src: "/tours/full-walkthrough/collaboration/step-6-teams.webp",
        width: 1533,
        height: 857,
        alt: "Spaarke app inside Microsoft Teams — matter-centric chat, files, and tasks in the Teams client",
      },
      callout: {
        title: "Spaarke, where your team already is",
        body: "The Spaarke app inside Microsoft Teams brings matter chat, files, and tasks to where your team already collaborates every day.",
        anchor: { x: 0.50, y: 0.30 },
        side: "bottom",
      },
    },
  ],
};
