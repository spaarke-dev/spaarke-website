# Collaboration — authoring guide

Per-step authoring notes for the **Collaboration** section of the
`full-walkthrough` tour. Image files in this directory are gitignored —
processed final assets land in:

`public/tours/full-walkthrough/collaboration/`

See:

`projects/product-walkthrough-app/tasks/09-collaboration-content.md`

for the surrounding task.

---

# How to fill this in

For each step block include:
- source filename
- final asset path
- walkthrough intent
- callout copy
- normalized anchor coordinates
- preferred callout side
- implementation notes

Claude reads this guide + screenshots to build the `TourStep`
configuration in:

`src/content/tours/full-walkthrough/collaboration.ts`

Preview each step at:

`?section=collaboration&step=N&grid=1`

and revise anchors after calibration.

---

# Steps

---

## Step 1 — projects-list

**Source**: `01-collaboration-projects-list-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/collaboration/step-1-projects-list.webp`

**Intent**: Introduce collaborative projects as structured operational workspaces.

### **Callout 01**

title: Collaboration built into operations

body:
- Projects organize collaboration around legal work, not disconnected folders
- Matters, teams, and operational records stay connected in one workspace
- Legal collaboration becomes structured and searchable

anchor:
`{ x: 0.25, y: 0.20 }`

position description:
Projects grid and first visible rows

side:
right

---

### **Callout 02**

title: Work organized by business context

body:
- Projects can be categorized by practice area, matter type, and operational ownership
- Teams gain visibility into active work across the organization
- Operational reporting becomes standardized

anchor:
`{ x: 0.54, y: 0.20 }`

position description:
Practice Area and Project Type columns

side:
bottom

---

### **Callout 03**

title: Visibility into ownership and activity

body:
- Track project ownership, staffing, and status directly within the workspace
- Teams know who is responsible for operational execution
- Reduce disconnected communication and shadow workflows

anchor:
`{ x: 0.76, y: 0.20 }`

position description:
Owner column and active project records

side:
left

---

## Step 2 — projects-details

**Source**: `02-collaboration-projects-details-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/collaboration/step-2-projects-details.webp`

**Intent**: Show the project workspace as a unified operational hub.

### **Callout 01**

title: One workspace for the entire matter

body:
- Documents, calendars, contacts, email, and reporting stay connected inside the project
- Teams collaborate from one operational source of truth
- Eliminate fragmented communication across tools and inboxes

anchor:
`{ x: 0.30, y: 0.10 }`

position description:
Top navigation tabs and project workspace header

side:
bottom

---

### **Callout 02**

title: Operational document collaboration

body:
- Documents remain tied directly to the project and matter
- Teams can search, review, preview, and manage work product from one interface
- AI-powered document operations remain integrated into daily work

anchor:
`{ x: 0.37, y: 0.56 }`

position description:
Documents section and document list

side:
right

---

### **Callout 03**

title: Performance and financial visibility

body:
- Monitor operational health, compliance, spend, and outcomes directly within the workspace
- Reporting becomes part of day-to-day legal operations
- Leadership gains visibility without separate reporting systems

anchor:
`{ x: 0.82, y: 0.34 }`

position description:
Performance Grades and Financial Metrics panels

side:
left

---

### **Callout 04**

title: Workspace-driven execution

body:
- Upcoming tasks, related matters, and operational activity remain connected to the project
- Teams coordinate work from a shared operational context
- Reduce delays caused by disconnected systems

anchor:
`{ x: 0.82, y: 0.72 }`

position description:
Upcoming Tasks panel on lower-right side

side:
left

---

## Step 3 — projects-share

**Source**: `03-collaboration-projects-share.png`  
**Final asset**: `public/tours/full-walkthrough/collaboration/step-3-projects-share.webp`

**Intent**: Demonstrate secure collaboration and privilege-aware sharing.

### **Callout 01**

title: Share securely across teams

body:
- Share projects with internal and external collaborators directly from the workspace
- Permissions remain governed centrally
- Operational collaboration stays secure and auditable

anchor:
`{ x: 0.74, y: 0.18 }`

position description:
Manage share access section inside share panel

side:
left

---

### **Callout 02**

title: Granular role-based permissions

body:
- Control read, write, assign, and sharing rights per user or team
- Permissions can be tailored to operational responsibility
- External collaboration stays tightly governed

anchor:
`{ x: 0.86, y: 0.28 }`

position description:
Permissions checklist in right-side panel

side:
left

---

### **Callout 03**

title: Collaboration without losing control

body:
- Privileged work remains governed while enabling broader collaboration
- Auditability and operational oversight are preserved automatically
- Legal operations teams maintain visibility into access decisions

anchor:
`{ x: 0.78, y: 0.05 }`

position description:
Share records panel header and controls

side:
bottom

---

## Step 4 — secure-workspace

**Source**: `04-collaboration-secure-workspace.png`  
**Final asset**: `public/tours/full-walkthrough/collaboration/step-4-secure-workspace.webp`

**Intent**: Introduce external collaboration through secure workspaces.

### **Callout 01**

title: Secure external collaboration

body:
- Outside counsel and external collaborators receive secure workspace access
- Collaboration occurs inside the operational platform instead of email chains
- External work becomes visible and manageable

anchor:
`{ x: 0.43, y: 0.10 }`

position description:
Workspace header and My Workspace overview

side:
bottom

---

### **Callout 02**

title: Shared operational activity

body:
- External users can view assigned tasks, events, and shared project activity
- Collaboration stays aligned to operational execution
- Teams maintain a unified operational timeline

anchor:
`{ x: 0.58, y: 0.22 }`

position description:
Recent Activity and Upcoming Events panels

side:
right

---

### **Callout 03**

title: Controlled document access

body:
- External collaborators only see approved projects and documents
- Access remains tied to workspace permissions and operational governance
- Information sharing becomes structured and secure

anchor:
`{ x: 0.52, y: 0.68 }`

position description:
My Documents section and shared document list

side:
right

---

## Step 5 — secure-workspace-details

**Source**: `05-collaboration-secure-workspace-details.png`  
**Final asset**: `public/tours/full-walkthrough/collaboration/step-5-secure-workspace-details.webp`

**Intent**: Show detailed external workspace collaboration and AI-enabled access.

### **Callout 01**

title: External users work from the same context

body:
- External collaborators access structured project information directly
- Project details, documents, and operational context remain connected
- Reduce communication overhead and duplicated work

anchor:
`{ x: 0.41, y: 0.29 }`

position description:
Project Information panel

side:
right

---

### **Callout 02**

title: AI-powered document search

body:
- External users can search project documents using natural language
- AI summaries and semantic search accelerate discovery
- Shared knowledge becomes easier to navigate

anchor:
`{ x: 0.45, y: 0.60 }`

position description:
AI search and document search section

side:
right

---

### **Callout 03**

title: Controlled document contribution

body:
- External collaborators can upload and contribute documents securely
- All content remains tied to the operational workspace
- Governance and auditability remain intact

anchor:
`{ x: 0.67, y: 0.73 }`

position description:
Upload Document button and document table

side:
left

---

### **Callout 04**

title: Workspace-level operational collaboration

body:
- Calendars, contacts, tasks, and communication remain integrated into the project
- Collaboration extends beyond files into operational execution
- Create a shared operational environment across organizations

anchor:
`{ x: 0.33, y: 0.22 }`

position description:
Workspace navigation tabs under project title

side:
bottom

---

## Step 6 — teams-app

**Source**: `06-collaboration-teams.png`  
**Final asset**: `public/tours/full-walkthrough/collaboration/step-6-teams.webp`

**Intent**: Close the section with Microsoft Teams integration and AI collaboration.

### **Callout 01**

title: Spaarke inside Microsoft Teams

body:
- Bring operational legal work directly into Microsoft Teams
- Access documents, tasks, and collaboration workflows without switching systems
- Meet teams where they already work every day

anchor:
`{ x: 0.57, y: 0.30 }`

position description:
Spaarke AI interface inside Teams

side:
bottom

---

### **Callout 02**

title: AI operational assistance

body:
- Teams can search documents, identify risks, and review overdue work using AI
- AI becomes embedded directly into operational collaboration
- Legal work gains operational intelligence inside the collaboration layer

anchor:
`{ x: 0.63, y: 0.67 }`

position description:
Suggested prompts and AI action cards

side:
top

---

### **Callout 03**

title: Embedded collaboration ecosystem

body:
- Spaarke integrates directly into the Microsoft 365 collaboration stack
- Chat, meetings, files, AI, and operational workflows converge in one experience
- Reduce friction between legal operations and business collaboration

anchor:
`{ x: 0.18, y: 0.42 }`

position description:
Microsoft Teams navigation rail

side:
right
