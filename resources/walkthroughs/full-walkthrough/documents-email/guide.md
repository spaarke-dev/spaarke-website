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

Preview each step at:

`?section=documents-email&step=N&grid=1`

and revise anchors after calibration.

---

# Steps

---

## Step 1 — document-ai-summary

**Source**: `01-documents-emails-workspace-document-AI-summary-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/documents-email/step-1-document-ai-summary.webp`

**Intent**: Introduce AI-powered document intelligence directly inside the workspace.

### **Callout 01**

title: AI reads every document

body:
- Documents are automatically summarized as they enter the system
- AI extracts key concepts, parties, obligations, and matter context
- Teams understand document relevance without manually reviewing every file

anchor:
`{ x: 0.73, y: 0.60 }`

position description:
AI Summary flyout panel on right side of workspace

side:
left

---

### **Callout 02**

title: Documents tied to operations

body:
- Documents remain connected to tasks, matters, and active work
- Legal teams work from operational context, not disconnected files
- AI insights appear directly where work is happening

anchor:
`{ x: 0.70, y: 0.74 }`

position description:
Active Documents panel in lower-right workspace section

side:
left

---

### **Callout 03**

title: Prioritize work visually

body:
- Smart scoring highlights urgent work and review activity
- AI-assisted workflows help teams focus on operational priorities
- Reduce missed deadlines and unmanaged document review

anchor:
`{ x: 0.22, y: 0.72 }`

position description:
My To Do List panel in lower-left workspace section

side:
right

---

## Step 2 — document-upload-profile

**Source**: `02-document-emails-workspace-document-upload-profile-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/documents-email/step-2-document-upload-profile.webp`

**Intent**: Demonstrate automated document profiling and metadata extraction during upload.

### **Callout 01**

title: Upload and profile automatically

body:
- Upload documents directly into the workspace
- AI generates summaries, metadata, and searchable profiles automatically
- Reduce manual tagging and document intake overhead

anchor:
`{ x: 0.45, y: 0.26 }`

position description:
Document Profile panel in center modal

side:
right

---

### **Callout 02**

title: AI extraction pipeline

body:
- Playbooks process files through extraction, profiling, indexing, and classification steps
- Structured document intelligence is generated automatically
- Designed for scalable enterprise document operations

anchor:
`{ x: 0.45, y: 0.43 }`

position description:
Profile execution log and extraction details in center content area

side:
right

---

### **Callout 03**

title: Guided intake workflow

body:
- Multi-step upload flows standardize how documents enter the system
- Associate files to matters and projects during intake
- Preserve governance and operational consistency

anchor:
`{ x: 0.23, y: 0.28 }`

position description:
Steps navigation panel on left side of upload modal

side:
right

---

## Step 3 — document-list

**Source**: `03-documents-emails-list-view.png`  
**Final asset**: `public/tours/full-walkthrough/documents-email/step-3-document-list.webp`

**Intent**: Show centralized enterprise document management and indexing.

### **Callout 01**

title: A unified document system

body:
- Manage documents, emails, exhibits, invoices, and filings in one repository
- Every document remains tied to operational context and metadata
- Eliminate disconnected file shares and folders

anchor:
`{ x: 0.25, y: 0.20 }`

position description:
Document list grid and first rows

side:
right

---

### **Callout 02**

title: Search-ready by design

body:
- Documents are indexed automatically for semantic and AI search
- Search visibility is managed directly within the operational workspace
- Enterprise repositories become fully discoverable

anchor:
`{ x: 0.66, y: 0.24 }`

position description:
Search Indexed column with toggle controls

side:
left

---

### **Callout 03**

title: Legal operations workflows

body:
- Bulk import, export, reporting, and automation tools are built into document management
- Workflows integrate directly with legal operational processes
- Teams manage document operations at enterprise scale

anchor:
`{ x: 0.49, y: 0.06 }`

position description:
Top command bar with workflow and import/export actions

side:
bottom

---

## Step 4 — document-detail

**Source**: `04-documents-emails-document-details-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/documents-email/step-4-document-detail.webp`

**Intent**: Present the intelligent document record experience.

### **Callout 01**

title: More than a file viewer

body:
- Every document has a full operational record
- AI summaries, metadata, and linked relationships stay attached to the file
- Teams work from structured document intelligence

anchor:
`{ x: 0.29, y: 0.18 }`

position description:
Main document viewer and document header

side:
right

---

### **Callout 02**

title: AI-generated document profile

body:
- AI creates concise summaries and operational context automatically
- Surface document meaning, not just filenames
- Improve understanding across large repositories

anchor:
`{ x: 0.82, y: 0.70 }`

position description:
Profile and Summary panels on right side

side:
left

---

### **Callout 03**

title: Find related work instantly

body:
- Similar documents and related work are surfaced automatically
- Identify precedents, templates, and connected materials
- Semantic relationships replace folder-based discovery

anchor:
`{ x: 0.82, y: 0.30 }`

position description:
Similar Documents visualization panel on upper-right

side:
left

---

## Step 5 — similar-documents

**Source**: `05-documents-emails-similar-documents-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/documents-email/step-5-similar-documents.webp`

**Intent**: Highlight semantic relationship discovery and document intelligence.

### **Callout 01**

title: Discover connected documents

body:
- AI identifies semantic relationships across documents and matters
- Surface similar work product, precedents, and related communications
- Move beyond keyword and folder searching

anchor:
`{ x: 0.44, y: 0.40 }`

position description:
Center semantic relationship graph

side:
right

---

### **Callout 02**

title: Relationship-aware intelligence

body:
- Relationships can include semantic similarity, shared matters, projects, emails, or threads
- Visualize how information connects across the legal operation
- Operational knowledge becomes discoverable

anchor:
`{ x: 0.84, y: 0.58 }`

position description:
Relationship Types settings panel on right side

side:
left

---

### **Callout 03**

title: Adjustable similarity controls

body:
- Tune semantic thresholds and relationship depth dynamically
- Refine how AI surfaces related information
- Built for enterprise-scale legal repositories

anchor:
`{ x: 0.84, y: 0.27 }`

position description:
Visualization Settings controls panel

side:
left

---

## Step 6 — word-edit

**Source**: `06-documents-email-word-edit.png`  
**Final asset**: `public/tours/full-walkthrough/documents-email/step-6-word-edit.webp`

**Intent**: Show seamless Microsoft Word integration and collaborative editing.

### **Callout 01**

title: Work directly in Word

body:
- Open and edit documents directly in Microsoft Word
- Legal teams continue working in familiar Microsoft tools
- Spaarke remains connected to the operational record behind the file

anchor:
`{ x: 0.49, y: 0.08 }`

position description:
Microsoft Word toolbar and document title area

side:
bottom

---

### **Callout 02**

title: AI inside the document

body:
- Copilot and AI-powered tools assist directly within the drafting experience
- Summaries and contextual assistance appear beside the document
- Reduce context switching during legal drafting

anchor:
`{ x: 0.42, y: 0.18 }`

position description:
Summary by Copilot section near top of document

side:
right

---

### **Callout 03**

title: Collaboration stays connected

body:
- Comments, review workflows, and document activity remain tied to the matter
- Teams collaborate without leaving the Microsoft ecosystem
- Preserve governance and operational visibility

anchor:
`{ x: 0.88, y: 0.24 }`

position description:
Comments panel on right side of Word window

side:
left

---

## Step 7 — email-list

**Source**: `07-documents-emails-email-list.png`  
**Final asset**: `public/tours/full-walkthrough/documents-email/step-7-email-list.webp`

**Intent**: Demonstrate email management as part of the operational system.

### **Callout 01**

title: Email as operational data

body:
- Emails become part of the operational record, not isolated inboxes
- Messages stay connected to matters, projects, and workflows
- Search and reporting extend across communication history

anchor:
`{ x: 0.28, y: 0.22 }`

position description:
Email grid and first visible rows

side:
right

---

### **Callout 02**

title: Centralized communication history

body:
- Capture inbound and outbound communications automatically
- Preserve institutional knowledge and operational continuity
- Eliminate fragmented email trails across individuals

anchor:
`{ x: 0.13, y: 0.10 }`

position description:
All Incoming Email page header

side:
right

---

### **Callout 03**

title: Enterprise filtering and reporting

body:
- Organize communications by sender, matter, attachments, and metadata
- Operational reporting extends into communication workflows
- Built for enterprise-scale legal operations

anchor:
`{ x: 0.83, y: 0.08 }`

position description:
Filter by keyword and filter controls in upper-right

side:
left

---

## Step 8 — outlook-add-in

**Source**: `08-documents-email-outlook-add-in.png`  
**Final asset**: `public/tours/full-walkthrough/documents-email/step-8-outlook-add-in.webp`

**Intent**: Close the section with Outlook integration and direct operational capture.

### **Callout 01**

title: Save directly from Outlook

body:
- Capture emails and attachments into Spaarke without leaving Outlook
- Associate communications to the correct matter during intake
- Reduce manual filing and operational overhead

anchor:
`{ x: 0.88, y: 0.50 }`

position description:
Spaarke Outlook add-in panel on right side

side:
left

---

### **Callout 02**

title: Matter-aware email capture

body:
- Add document names, descriptions, and metadata during email capture
- Emails immediately become searchable operational records
- Preserve legal context from the moment communication arrives

anchor:
`{ x: 0.87, y: 0.62 }`

position description:
Document Details section inside Outlook add-in

side:
left

---

### **Callout 03**

title: Attachments stay connected

body:
- Save attachments directly into the operational document system
- Documents remain linked to the originating communication
- AI and semantic search can immediately process captured content

anchor:
`{ x: 0.88, y: 0.84 }`

position description:
Attachments section inside Outlook add-in

side:
left
