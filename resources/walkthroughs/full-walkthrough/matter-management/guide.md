# Matter Management — authoring guide

Per-step authoring notes for the **Matter Management** section of the
`full-walkthrough` tour. This file is the source of truth for what each
step should communicate and where the callout should land. Image files
in this directory are gitignored — drop processed final assets into
`public/tours/full-walkthrough/matter-management/`.

See `projects/product-walkthrough-app/tasks/07-matter-management-content.md`
for the surrounding task.

---

## How to fill this in

For each step block: source filename, final asset path, intent, callout
copy, anchor (plain-language hint + the normalized coords once
calibrated), side, notes (mask overrides, crop hints).

Claude reads this guide + the screenshots to write the `TourStep`
config in `src/content/tours/full-walkthrough/matter-management.ts`.

Preview each step at:

`?section=matter-management&step=N&grid=1`

and revise anchors after calibration.

---

# Steps

---

## Step 1 — daily-briefing

**Source**: `01-matter-management-daily-briefing.png`  
**Final asset**: `public/tours/full-walkthrough/matter-management/step-1-daily-briefing.webp`

**Intent**: Introduce the AI-powered daily briefing as the operational command center for legal work.

### **Callout 01**

title: Your day, summarized by AI

body:
- AI-generated briefings surface overdue work, upcoming deadlines, and recent matter activity
- Prioritize what needs attention without opening every matter
- Start the day with operational context already assembled

anchor:
`{ x: 0.22, y: 0.14 }`

position description:
Daily Briefing modal header and top activity section

side:
right

---

### **Callout 02**

title: Work that needs attention

body:
- Overdue tasks and approaching deadlines are grouped automatically
- Each item links directly back to the underlying matter and work item
- Reduce missed deadlines and improve operational visibility

anchor:
`{ x: 0.30, y: 0.33 }`

position description:
Center-left overdue tasks list inside the modal

side:
right

---

### **Callout 03**

title: Connected to every matter

body:
- Activity updates roll up from tasks, filings, reviews, emails, and events
- The briefing continuously updates as work changes
- One view across the full legal operation

anchor:
`{ x: 0.38, y: 0.64 }`

position description:
Tasks Due Soon section in lower half of modal

side:
right

---

## Step 2 — daily-briefing-preferences

**Source**: `02-matter-management-daily-briefing-preferences.png`  
**Final asset**: `public/tours/full-walkthrough/matter-management/step-2-daily-briefing-preferences.webp`

**Intent**: Show that the daily briefing adapts to the user, role, and priorities.

### **Callout 01**

title: Tailored to your role

body:
- Configure what appears in your briefing feed
- Surface the updates most relevant to your practice and responsibilities
- Every user gets a personalized operational view

anchor:
`{ x: 0.74, y: 0.29 }`

position description:
Preferences flyout panel on right side

side:
left

---

### **Callout 02**

title: Control the signal

body:
- Turn channels on or off by activity type
- Focus on deadlines, documents, emails, assignments, or matter activity
- Reduce noise without losing visibility

anchor:
`{ x: 0.77, y: 0.39 }`

position description:
Toggle switches inside preferences panel

side:
left

---

## Step 3 — workspace-overview

**Source**: `03-matter-management-workspace.png`  
**Final asset**: `public/tours/full-walkthrough/matter-management/step-3-workspace.webp`

**Intent**: Present the workspace as the user’s operational home base.

### **Callout 01**

title: Your legal operations workspace

body:
- A configurable workspace for matters, tasks, documents, and updates
- Bring together the information your team uses every day
- Reduce context switching across disconnected systems

anchor:
`{ x: 0.16, y: 0.075 }`

position description:
Corporate Workspace title and top section

side:
right

---

### **Callout 02**

title: Work starts here

body:
- Launch common actions directly from the workspace
- Create matters, assign work, and summarize documents in one click
- AI and workflow tools are built directly into daily operations

anchor:
`{ x: 0.27, y: 0.20 }`

position description:
Get Started action cards

side:
bottom

---

### **Callout 03**

title: Priorities in real time

body:
- Active work, deadlines, and documents update continuously
- Smart scoring highlights what requires immediate attention
- Teams stay aligned on operational priorities

anchor:
`{ x: 0.28, y: 0.68 }`

position description:
My To Do List panel in lower-left quadrant

side:
right

---

## Step 4 — matter-list

**Source**: `04-matter-management-matter-list-view.png`  
**Final asset**: `public/tours/full-walkthrough/matter-management/step-4-matter-list.webp`

**Intent**: Show centralized matter management across the organization.

### **Callout 01**

title: Every matter, one system

body:
- View all active matters across the organization
- Track matter type, practice area, ownership, and status
- One operational system instead of disconnected spreadsheets and folders

anchor:
`{ x: 0.24, y: 0.18 }`

position description:
Matter grid headers and first rows

side:
right

---

### **Callout 02**

title: Views built for legal teams

body:
- Filter and organize matters by practice, client, team, or workflow
- Save personalized views for different legal operations roles
- Surface exactly the information your team needs

anchor:
`{ x: 0.84, y: 0.11 }`

position description:
Filter by keyword and filter controls in top-right of grid

side:
left

---

## Step 5 — matter-detail

**Source**: `05-matter-managment-details-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/matter-management/step-5-matter-detail.webp`

**Intent**: Show the full operational record for a single matter.

### **Callout 01**

title: The complete matter record

body:
- Every matter brings together documents, tasks, contacts, deadlines, billing, and reporting
- Teams work from a shared operational view
- Context stays connected across the lifecycle of the matter

anchor:
`{ x: 0.37, y: 0.30 }`

position description:
Main matter information section in upper-left content area

side:
right

---

### **Callout 02**

title: Documents tied to the work

body:
- Documents remain connected to the matter they belong to
- Search, preview, and collaborate without leaving the matter
- Preserve context, history, and auditability

anchor:
`{ x: 0.42, y: 0.62 }`

position description:
Documents grid in center of page

side:
right

---

### **Callout 03**

title: Operational performance visibility

body:
- Track budgets, compliance, performance grades, and upcoming deadlines
- Financial and operational insights live beside the legal work
- See matter health at a glance

anchor:
`{ x: 0.83, y: 0.30 }`

position description:
Performance grades and financial metrics panels on right side

side:
left

---

## Step 6 — semantic-search

**Source**: `06-matter-management-semantic-search-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/matter-management/step-6-semantic-search.webp`

**Intent**: Close with AI-powered semantic discovery and relationship intelligence.

### **Callout 01**

title: Ask, don't search

body:
- Natural-language search across matters, documents, projects, and invoices
- AI surfaces relationships and relevance instead of keyword matches
- Find information based on meaning and context

anchor:
`{ x: 0.14, y: 0.28 }`

position description:
AI Search input area in left sidebar

side:
right

---

### **Callout 02**

title: Discover connected information

body:
- Visual relationship graphs expose related files and matter connections
- Identify similar work, linked documents, and operational patterns
- Move beyond folders and static search results

anchor:
`{ x: 0.54, y: 0.43 }`

position description:
Center network graph visualization

side:
right

---

### **Callout 03**

title: Tune AI relevance

body:
- Adjust thresholds, clustering, and similarity scoring
- Refine how semantic results are grouped and surfaced
- Designed for large-scale enterprise legal repositories

anchor:
`{ x: 0.88, y: 0.25 }`

position description:
Right-side configuration and relevance controls panel

side:
left