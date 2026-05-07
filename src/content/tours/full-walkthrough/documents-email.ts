import type { TourSection } from "../types";

export const documentsEmail: TourSection = {
  id: "documents-email",
  label: "Documents & Email",
  steps: [
    {
      id: "document-ai-summary",
      screenshot: {
        src: "/tours/full-walkthrough/documents-email/step-1-document-ai-summary.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke document workspace — AI-generated summary panel for the active document",
      },
      callout: {
        title: "Every document, summarized",
        body: "AI generates a structured summary for every document — key terms, parties, and the matter context it belongs to — so you skip the skim.",
        anchor: { x: 0.40, y: 0.30 },
        side: "right",
      },
    },
    {
      id: "document-upload-profile",
      screenshot: {
        src: "/tours/full-walkthrough/documents-email/step-2-document-upload-profile.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke document upload — drop a file in and Spaarke auto-creates a profile with summary, metadata, and matter linkage",
      },
      callout: {
        title: "Drop a file, get a profile",
        body: "Upload a document and Spaarke fills in the summary, metadata, and matter linkage automatically. No manual tagging.",
        anchor: { x: 0.30, y: 0.40 },
        side: "right",
      },
    },
    {
      id: "document-list",
      screenshot: {
        src: "/tours/full-walkthrough/documents-email/step-3-document-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke documents list — every document tied to its matter, with metadata and version history",
      },
      callout: {
        title: "Every document, in context",
        body: "All documents tied to their matter, with metadata, version history, and the people who touched them — without leaving the matter page.",
        anchor: { x: 0.22, y: 0.20 },
        side: "right",
      },
    },
    {
      id: "document-detail",
      screenshot: {
        src: "/tours/full-walkthrough/documents-email/step-4-document-detail.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke document record — full profile with AI summary, metadata, version history, and matter linkage",
      },
      callout: {
        title: "Open the record, not just the file",
        body: "Each document has a full record — AI summary, metadata, version history, comments, and matter linkage — so context never leaves the file.",
        anchor: { x: 0.32, y: 0.32 },
        side: "right",
      },
    },
    {
      id: "similar-documents",
      screenshot: {
        src: "/tours/full-walkthrough/documents-email/step-5-similar-documents.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke find-similar — Azure AI semantic search surfacing related documents across matters",
      },
      callout: {
        title: "Find what you've drafted before",
        body: "Semantic search surfaces similar documents across every matter and counsel — past work and precedents on demand.",
        anchor: { x: 0.50, y: 0.40 },
        side: "bottom",
      },
    },
    {
      id: "word-edit",
      screenshot: {
        src: "/tours/full-walkthrough/documents-email/step-6-word-edit.webp",
        width: 1533,
        height: 861,
        alt: "Spaarke + Microsoft Word — save a Word document directly to its matter from inside Word",
      },
      callout: {
        title: "Save to Spaarke from Word",
        body: "Save Word, Excel, and PowerPoint files directly to the right matter from inside the Office apps your team already uses.",
        anchor: { x: 0.50, y: 0.10 },
        side: "bottom",
      },
    },
    {
      id: "email-list",
      screenshot: {
        src: "/tours/full-walkthrough/documents-email/step-7-email-list.webp",
        width: 2400,
        height: 1350,
        alt: "Spaarke emails view — emails captured into the matter alongside documents",
      },
      callout: {
        title: "Emails belong to the matter",
        body: "Emails captured from Outlook live alongside documents on the matter — searchable, AI-summarized, and tied to the people working it.",
        anchor: { x: 0.22, y: 0.22 },
        side: "right",
      },
    },
    {
      id: "outlook-add-in",
      screenshot: {
        src: "/tours/full-walkthrough/documents-email/step-8-outlook-add-in.webp",
        width: 1533,
        height: 861,
        alt: "Spaarke save-to-Spaarke add-in for Outlook — capture an email to its matter without leaving the inbox",
      },
      callout: {
        title: "Capture from Outlook",
        body: "Save emails to the right matter, project, or document set directly from Outlook — no copy-paste, no attachments.",
        anchor: { x: 0.50, y: 0.40 },
        side: "left",
      },
    },
  ],
};
