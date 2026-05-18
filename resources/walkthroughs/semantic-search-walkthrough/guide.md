# Semantic Search — authoring guide

Standalone focused walkthrough. Final URL after sign-in:
`/tour/semantic-search-walkthrough`. Sign-in landing page at
`/semantic-search-walkthrough`.

Image files in this directory are gitignored. Processed final assets
land in:

`public/tours/semantic-search-walkthrough/`

Preview each step at:

`http://localhost:3000/tour/semantic-search-walkthrough?step=N&grid=1`

…and revise anchors after calibration.

---

## Intro interstitial

**Type**: centered modal (no pointer)
**Backdrop**: `01-ai-search-enter-terms-grid-results.png` (dimmed)

**Title**: Spaarke DMS & AI Semantic Search

**Body** (first draft — revise after operator review):

> Spaarke is a matter-centric legal DMS built on Microsoft 365 and powered by AI. Documents, matters, and projects connect through semantic indexing, AI-driven profiling, and interactive relationship graphs — so finding the right document, the right matter, and the right precedent becomes one fast operation instead of three slow ones.

---

## Step 1 — Enter natural language search (callout 1 on screenshot 01)

**Source**: `01-ai-search-enter-terms-grid-results.png`
**Final asset**: `public/tours/semantic-search-walkthrough/step-1-search-results.webp`

**Intent**: Show the search input as the entry point and explain that it understands meaning, not just keywords.

**Title**: Enter natural language search

**Body**: Search the way you think. Type questions, fragments, or contextual phrases — semantic indexing finds documents by meaning, not just by keyword. Powered by Azure AI Search over the SharePoint Embedded document store.

**Anchor**: TBD — on the search input box at the top
**Pointer**: bottom-middle (callout below the input)

---

## Step 2 — Focus by document, file, matter type (callout 2 on screenshot 01)

**Source**: same as Step 1
**Intent**: Filter pills/dropdowns let the user narrow scope without retyping.

**Title**: Focus by document, file, or matter type

**Body**: Narrow results by file type, document type, or matter classification. AI-driven profiling categorizes every document on ingestion, so filters surface the slice you need without manual tagging.

**Anchor**: TBD — on the filter row beneath the search
**Pointer**: bottom-left or bottom-middle

---

## Step 3 — List of documents based on semantic similarity (callout 3 on screenshot 01)

**Source**: same as Step 1
**Intent**: Result list is ranked by semantic relevance.

**Title**: Results ranked by semantic relevance

**Body**: Results ranked by relevance to your query, not just term frequency. Each row shows the source matter, document type, and a relevance score — click through to open, or pivot to the relationship graph.

**Anchor**: TBD — on the result grid (middle of the page)
**Pointer**: right-middle or top-middle

---

## Step 4 — Visual graph of related documents (callout 4 on screenshot 02)

**Source**: `02-ai-search-network-visual.png`
**Final asset**: `public/tours/semantic-search-walkthrough/step-2-network-visual.webp`

**Intent**: Switch from list to graph view — show document relationships visually.

**Title**: Visual graph of related documents

**Body**: Switch from list view to relationship graph to see how documents connect. Nodes are documents; edges are semantic and structural relationships — the precedent chain, the matter cluster, the topic neighborhood.

**Anchor**: TBD — on a prominent node or cluster in the graph
**Pointer**: TBD

---

## Step 5 — Adjust settings to hone your search (callout 5 on screenshot 03)

**Source**: `03-ai-search-adjust-relevance-menu.png`
**Final asset**: `public/tours/semantic-search-walkthrough/step-3-adjust-relevance.webp`

**Intent**: The settings/relevance menu — tune weighting without restarting the search.

**Title**: Tune relevance and scope

**Body**: Adjust relevance weighting, expand or restrict the document set, and refine by metadata. Settings persist per session so iterating on a search doesn't restart it.

**Anchor**: TBD — on the open settings/relevance panel
**Pointer**: left-middle (callout to the right of the panel)

---

## Step 6 — Open document views from each node (callout 6 on screenshot 04)

**Source**: `04-ai-search-view-document-preview.png`
**Final asset**: `public/tours/semantic-search-walkthrough/step-4-document-preview.webp`

**Intent**: Click a node → in-place preview without leaving the workspace.

**Title**: Preview any document in place

**Body**: Click any node in the graph to preview the document — title, key fields, summary — without leaving the workspace. Pivot from any document to its related cluster in one click.

**Anchor**: TBD — on the open preview pane
**Pointer**: TBD

---

## Step 7 — Full document contains all information (callout 7 on screenshot 05)

**Source**: `05-ai-search-document-details.png`
**Final asset**: `public/tours/semantic-search-walkthrough/step-5-document-details.webp`

**Intent**: Document detail page — one view shows source, OCR, profile, relationships.

**Title**: Every document, fully indexed

**Body**: Open the document detail page to see everything: source content, OCR text, structured extractions, AI summary, profile fields, and the matter or project the document belongs to.

**Anchor**: TBD — on the document title / main content area
**Pointer**: TBD

---

## Step 8 — AI auto-generated profile fields (callout 8 on screenshot 05)

**Source**: same as Step 7
**Intent**: Profile fields auto-extracted on ingestion.

**Title**: AI auto-generated profile fields

**Body**: Profile fields — document type, jurisdiction, parties, key dates, monetary amounts — are extracted automatically on ingestion. No manual tagging required; corrections flow back to improve future extractions.

**Anchor**: TBD — on the profile fields section
**Pointer**: TBD

---

## Step 9 — Automatically maps similar documents (callout 9 on screenshot 05)

**Source**: same as Step 7
**Intent**: Each document carries a list of its semantic neighbors.

**Title**: Similar-document mapping per record

**Body**: Every document carries a list of its semantically similar peers, identified at ingestion. Use it to find precedents, surface duplicates, or trace the evolution of a document across versions and matters.

**Anchor**: TBD — on the similar-documents section
**Pointer**: TBD

---

## Step 10 — Easily find and visualize related documents (callout 10 on screenshot 06)

**Source**: `06-ai-search-similar-documents.png`
**Final asset**: `public/tours/semantic-search-walkthrough/step-6-similar-documents.webp`

**Intent**: From a single document, pivot to its full relationship cluster.

**Title**: Pivot to the relationship cluster

**Body**: Pivot from any document to its full relationship cluster. The graph view shows directly-similar documents, transitively related documents, and the matters that connect them.

**Anchor**: TBD — on the main relationship view
**Pointer**: TBD

---

## Step 11 — Focus with semantic controls and types (callout 11 on screenshot 06)

**Source**: same as Step 10
**Intent**: Filter the relationship view by similarity threshold and type.

**Title**: Focus with semantic and type controls

**Body**: Filter the relationship view by similarity threshold, document type, or matter — narrow the cluster to just what's relevant to the task at hand.

**Anchor**: TBD — on the controls/filters area
**Pointer**: TBD

---

## Outro interstitial

**Type**: centered modal (no pointer)
**Backdrop**: `06-ai-search-similar-documents.png` (dimmed)

**Title**: Ready to see Spaarke in action?

**Body**: Get hands-on access to the full platform. We'll set up a tailored demo for your firm or legal department.

**CTA primary**: `Get access` → `/access-request`
**CTA secondary**: `Why Spaarke` → `/why-spaarke`

(Matches the outro pattern from `full-walkthrough/spend-performance.ts`.)
