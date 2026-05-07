# Documents & Email — authoring guide

Per-step authoring notes for the **Documents & Email** section of the
`full-walkthrough` tour. This file is the source of truth for what each
step should communicate and where the callout should land. Image files
in this directory are gitignored — drop processed final assets into
`public/tours/full-walkthrough/documents-email/`.

See `projects/product-walkthrough-app/tasks/08-documents-email-content.md`
for the surrounding task.

---

## How to fill this in

For each step block: source filename, final asset path, intent, callout
copy, anchor (plain-language hint + normalized coords once calibrated),
side, notes (mask overrides, crop hints).

Claude reads this guide + the screenshots to write the `TourStep`
config in `src/content/tours/full-walkthrough/documents-email.ts`.
Preview each step at `?section=documents-email&step=N&grid=1` and
ask for adjustments.

---

## Steps

## Step 1 — document-ai-summary
**Source**: `01-documents-emails-workspace-document-AI-summary-SANDBOX.png` (5120×2880, SANDBOX masked at default coords)
**Final asset**: `public/tours/full-walkthrough/documents-email/step-1-document-ai-summary.webp` (2400×1350)
**Intent**: open the section on the AI-summary story — every document gets a structured summary.
**Callout**:
  title: Every document, summarized
  body:  AI generates a structured summary for every document — key terms, parties, and the matter context it belongs to — so you skip the skim.
  anchor: `{ x: 0.40, y: 0.30 }` — AI summary panel
  side:   right
**Notes**: SANDBOX masked. Anchor placeholder — preview and revise.

## Step 2 — document-upload-profile
**Source**: `02-document-emails-workspace-document-upload-profile-SANDBOX.png` (5120×2880, SANDBOX masked at default coords)
**Final asset**: `public/tours/full-walkthrough/documents-email/step-2-document-upload-profile.webp` (2400×1350)
**Intent**: show the upload-and-auto-profile flow — drop a file, AI fills in metadata.
**Callout**:
  title: Drop a file, get a profile
  body:  Upload a document and Spaarke fills in the summary, metadata, and matter linkage automatically. No manual tagging.
  anchor: `{ x: 0.30, y: 0.40 }` — upload area / generated profile fields
  side:   right
**Notes**: SANDBOX masked. Anchor placeholder.

## Step 3 — document-list
**Source**: `03-documents-emails-list-view.png` (5120×2880, no SANDBOX)
**Final asset**: `public/tours/full-walkthrough/documents-email/step-3-document-list.webp` (2400×1350)
**Intent**: documents list — all documents tied to the matter, with metadata + version history.
**Callout**:
  title: Every document, in context
  body:  All documents tied to their matter, with metadata, version history, and the people who touched them — without leaving the matter page.
  anchor: `{ x: 0.22, y: 0.20 }` — list header / first row
  side:   right
**Notes**: anchor placeholder.

## Step 4 — document-detail
**Source**: `04-documents-emails-document-details-SANDBOX.png` (5120×2880, SANDBOX masked at default coords)
**Final asset**: `public/tours/full-walkthrough/documents-email/step-4-document-detail.webp` (2400×1350)
**Intent**: open the document record — full profile, AI summary, version history, comments.
**Callout**:
  title: Open the record, not just the file
  body:  Each document has a full record — AI summary, metadata, version history, comments, and matter linkage — so context never leaves the file.
  anchor: `{ x: 0.32, y: 0.32 }` — document record header / summary card
  side:   right
**Notes**: SANDBOX masked. Anchor placeholder.

## Step 5 — similar-documents
**Source**: `05-documents-emails-similar-documents-SANDBOX.png` (5120×2880, SANDBOX masked at default coords)
**Final asset**: `public/tours/full-walkthrough/documents-email/step-5-similar-documents.webp` (2400×1350)
**Intent**: find-similar — semantic search across matters surfaces past work.
**Callout**:
  title: Find what you've drafted before
  body:  Semantic search surfaces similar documents across every matter and counsel — past work and precedents on demand.
  anchor: `{ x: 0.50, y: 0.40 }` — similar-documents panel / results list
  side:   bottom
**Notes**: SANDBOX masked. Anchor placeholder.

## Step 6 — word-edit
**Source**: `06-documents-email-word-edit.png` (1533×861, no SANDBOX)
**Final asset**: `public/tours/full-walkthrough/documents-email/step-6-word-edit.webp` (1533×861)
**Intent**: Office integration — save Word/Excel/PowerPoint to Spaarke from inside the Office apps.
**Callout**:
  title: Save to Spaarke from Word
  body:  Save Word, Excel, and PowerPoint files directly to the right matter from inside the Office apps your team already uses.
  anchor: `{ x: 0.50, y: 0.10 }` — Spaarke ribbon button / save dialog
  side:   bottom
**Notes**: smaller capture (1533-wide) — display dimensions match source.

## Step 7 — email-list
**Source**: `07-documents-emails-email-list.png` (5120×2880, no SANDBOX)
**Final asset**: `public/tours/full-walkthrough/documents-email/step-7-email-list.webp` (2400×1350)
**Intent**: emails captured into the matter live alongside documents.
**Callout**:
  title: Emails belong to the matter
  body:  Emails captured from Outlook live alongside documents on the matter — searchable, AI-summarized, and tied to the people working it.
  anchor: `{ x: 0.22, y: 0.22 }` — email list header / first row
  side:   right
**Notes**: anchor placeholder.

## Step 8 — outlook-add-in
**Source**: `08-documents-email-outlook-add-in.png` (1533×861, no SANDBOX)
**Final asset**: `public/tours/full-walkthrough/documents-email/step-8-outlook-add-in.webp` (1533×861)
**Intent**: capture from Outlook — close the section on the email-capture story.
**Callout**:
  title: Capture from Outlook
  body:  Save emails to the right matter, project, or document set directly from Outlook — no copy-paste, no attachments.
  anchor: `{ x: 0.50, y: 0.40 }` — save-to-Spaarke pane in Outlook
  side:   left
**Notes**: smaller capture (1533-wide). Anchor placeholder.
