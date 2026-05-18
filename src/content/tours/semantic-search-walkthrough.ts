import type { Tour } from "./types";

/**
 * Standalone focused walkthrough — Semantic Search.
 *
 * Single capability area, not multi-section like the full walkthrough.
 * Sign-in landing at /semantic-search-walkthrough; tour at
 * /tour/semantic-search-walkthrough.
 *
 * Anchor coordinates are first-draft placeholders — author will tune
 * them via the local preview at:
 *   /tour/semantic-search-walkthrough?step=N&grid=1
 */
export const semanticSearchWalkthrough: Tour = {
  slug: "semantic-search-walkthrough",
  title: "Spaarke Semantic Search",
  description:
    "How Spaarke's AI semantic search finds documents by meaning, maps their relationships, and connects them back to matters.",
  sections: [
    {
      id: "semantic-search",
      label: "Semantic Search",
      steps: [
        // ────────────────────────────────────────────────────────────
        // INTRO interstitial
        // ────────────────────────────────────────────────────────────
        {
          id: "intro",
          interstitial: true,
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-1-search-results.webp",
            width: 2400,
            height: 1350,
            alt: "Spaarke AI semantic search — results grid as backdrop for the walkthrough intro",
          },
          callout: {
            title: "The Spaarke DMS & Semantic Search Module",
            body: "The Legal IQ platform that lives in your Microsoft 365 tenant — your data, your governance, your existing permissions.",
            bullets: [
              "Powered by SharePoint Embedded",
              "AI-driven auto-profiling",
              "Semantic indexing by Azure AI Search",
              "OCR + structured extraction",
              "Interactive relationship graphs",
              "Similar-document discovery",
              "One-to-many document-to-matter mapping",
            ],
          },
        },

        // ────────────────────────────────────────────────────────────
        // Screenshot 1 — search results grid (3 callouts)
        // ────────────────────────────────────────────────────────────
        {
          id: "enter-search",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-1-search-results.webp",
            width: 2400,
            height: 1350,
            alt: "Spaarke AI semantic search — natural-language query input above a results grid",
          },
          callout: {
            title: "Enter natural language search",
            body: "Search the way you think. Type questions, fragments, or contextual phrases — semantic indexing finds documents by meaning, not just by keyword. Powered by Azure AI Search over the SharePoint Embedded document store.",
            anchor: { x: 0.217, y: 0.299 },
            pointer: "left-middle",
          },
        },
        {
          id: "focus-filters",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-1-search-results.webp",
            width: 2400,
            height: 1350,
            alt: "Spaarke AI semantic search — filter row beneath the search input",
          },
          callout: {
            title: "Focus by document, file, or matter type",
            body: "Narrow results by file type, document type, or matter classification. AI-driven profiling categorizes every document on ingestion, so filters surface the slice you need without manual tagging.",
            anchor: { x: 0.215, y: 0.512 },
            pointer: "left-top",
          },
        },
        {
          id: "results-ranked",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-1-search-results.webp",
            width: 2400,
            height: 1350,
            alt: "Spaarke AI semantic search — results grid ranked by semantic relevance",
          },
          callout: {
            title: "Results ranked by semantic relevance",
            body: "Results ranked by relevance to your query, not just term frequency. Each row shows the source matter, document type, and a relevance score — click through to open, or pivot to the relationship graph.",
            anchor: { x: 0.379, y: 0.550 },
            pointer: "top-left",
          },
        },

        // ────────────────────────────────────────────────────────────
        // Screenshot 2 — network visual (1 callout)
        // ────────────────────────────────────────────────────────────
        {
          id: "network-visual",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-2-network-visual.webp",
            width: 2259,
            height: 1216,
            alt: "Spaarke semantic search — interactive relationship graph of documents",
          },
          callout: {
            title: "Visual graph of related documents",
            body: "Switch from list view to relationship graph to see how documents connect. Nodes are documents; edges are semantic and structural relationships — the precedent chain, the matter cluster, the topic neighborhood.",
            anchor: { x: 0.381, y: 0.299 },
            pointer: "right-top",
          },
        },

        // ────────────────────────────────────────────────────────────
        // Screenshot 3 — adjust relevance (1 callout)
        // ────────────────────────────────────────────────────────────
        {
          id: "tune-relevance",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-3-adjust-relevance.webp",
            width: 2400,
            height: 1350,
            alt: "Spaarke semantic search — relevance settings panel open",
          },
          callout: {
            title: "Tune relevance and scope",
            body: "Adjust relevance weighting, expand or restrict the document set, and refine by metadata. Settings persist per session so iterating on a search doesn't restart it.",
            anchor: { x: 0.837, y: 0.199 },
            pointer: "right-top",
          },
        },

        // ────────────────────────────────────────────────────────────
        // Screenshot 4 — document preview (1 callout)
        // ────────────────────────────────────────────────────────────
        {
          id: "preview-from-node",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-4-document-preview.webp",
            width: 2400,
            height: 1350,
            alt: "Spaarke semantic search — document preview pane opened from a graph node",
          },
          callout: {
            title: "Preview any document in place",
            body: "Click any node in the graph to preview the document — title, key fields, summary — without leaving the workspace. Pivot from any document to its related cluster in one click.",
            anchor: { x: 0.421, y: 0.142 },
            pointer: "right-top",
          },
        },

        // ────────────────────────────────────────────────────────────
        // Screenshot 5 — document details (3 callouts)
        // ────────────────────────────────────────────────────────────
        {
          id: "document-fully-indexed",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-5-document-details.webp",
            width: 2035,
            height: 1166,
            alt: "Spaarke document details — full record with source, OCR, profile, and relationships",
          },
          callout: {
            title: "Every document, fully indexed",
            body: "Open the document detail page to see everything: source content, OCR text, structured extractions, AI summary, profile fields, and the matter or project the document belongs to.",
            anchor: { x: 0.381, y: 0.533 },
            pointer: "top-middle",
          },
        },
        {
          id: "ai-profile-fields",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-5-document-details.webp",
            width: 2035,
            height: 1166,
            alt: "Spaarke document details — AI auto-generated profile fields",
          },
          callout: {
            title: "AI auto-generated profile fields",
            body: "Profile fields — document type, jurisdiction, parties, key dates, monetary amounts — are extracted automatically on ingestion. No manual tagging required; corrections flow back to improve future extractions.",
            anchor: { x: 0.635, y: 0.504 },
            pointer: "right-top",
          },
        },
        {
          id: "similar-mapping",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-5-document-details.webp",
            width: 2035,
            height: 1166,
            alt: "Spaarke document details — automatically mapped similar documents",
          },
          callout: {
            title: "Similar-document mapping per record",
            body: "Every document carries a list of its semantically similar peers, identified at ingestion. Use it to find precedents, surface duplicates, or trace the evolution of a document across versions and matters.",
            anchor: { x: 0.635, y: 0.198 },
            pointer: "right-top",
          },
        },

        // ────────────────────────────────────────────────────────────
        // Screenshot 6 — similar documents view (2 callouts)
        // ────────────────────────────────────────────────────────────
        {
          id: "relationship-cluster",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-6-similar-documents.webp",
            width: 1915,
            height: 1080,
            alt: "Spaarke semantic search — relationship cluster view for a single document",
          },
          callout: {
            title: "Pivot to the relationship cluster",
            body: "Pivot from any document to its full relationship cluster. The graph view shows directly-similar documents, transitively related documents, and the matters that connect them.",
            anchor: { x: 0.381, y: 0.533 },
            pointer: "top-middle",
          },
        },
        {
          id: "semantic-controls",
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-6-similar-documents.webp",
            width: 1915,
            height: 1080,
            alt: "Spaarke semantic search — semantic and type controls on the relationship view",
          },
          callout: {
            title: "Focus with semantic and type controls",
            body: "Filter the relationship view by similarity threshold, document type, or matter — narrow the cluster to just what's relevant to the task at hand.",
            anchor: { x: 0.787, y: 0.203 },
            pointer: "right-top",
          },
        },

        // ────────────────────────────────────────────────────────────
        // OUTRO interstitial (matches full-walkthrough/spend-performance final step)
        // ────────────────────────────────────────────────────────────
        {
          id: "outro",
          interstitial: true,
          screenshot: {
            src: "/tours/semantic-search-walkthrough/step-6-similar-documents.webp",
            width: 1915,
            height: 1080,
            alt: "Spaarke semantic search — relationship cluster as backdrop for the walkthrough outro",
          },
          callout: {
            title: "Ready to see Spaarke in action?",
            body: "Get hands-on access to the full platform. We'll set up a tailored demo for your firm or legal department.",
            cta: { label: "Get access", href: "/access-request" },
            ctaSecondary: { label: "Why Spaarke", href: "/why-spaarke" },
          },
        },
      ],
    },
  ],
};
