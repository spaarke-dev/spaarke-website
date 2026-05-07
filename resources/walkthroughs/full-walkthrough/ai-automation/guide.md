# AI & Automation — authoring guide

Per-step authoring notes for the **AI & Automation** section of the
`full-walkthrough` tour. Image files in this directory are gitignored —
processed final assets land in:

`public/tours/full-walkthrough/ai-automation/`

See:

`projects/product-walkthrough-app/tasks/10-ai-automation-content.md`

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

`src/content/tours/full-walkthrough/ai-automation.ts`

Preview each step at:

`?section=ai-automation&step=N&grid=1`

and revise anchors after calibration.

---

# Steps

---

## Step 1 — create-new-matter

**Source**: `01-ai-automation-workspace-create-new-matter-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-1-create-new-matter.webp`

**Intent**: Introduce AI-assisted operational intake from the workspace.

### **Callout 01**

title: Start legal work from one workspace

body:
- Create matters, projects, assignments, and summaries directly from the operational workspace
- AI becomes part of the intake and execution flow
- Reduce operational friction at the start of legal work

anchor:
`{ x: 0.29, y: 0.22 }`

position description:
Get Started cards in workspace dashboard

side:
right

---

### **Callout 02**

title: AI-assisted operational overview

body:
- Workspace dashboards surface workload, active matters, assignments, and operational health
- Teams gain visibility into legal operations in real time
- AI and automation work alongside operational reporting

anchor:
`{ x: 0.73, y: 0.22 }`

position description:
Quick Summary cards

side:
left

---

### **Callout 03**

title: Work organized around execution

body:
- Tasks, updates, deadlines, and active documents remain connected in one operational surface
- Teams coordinate work without switching systems
- Legal operations become proactive instead of reactive

anchor:
`{ x: 0.50, y: 0.63 }`

position description:
Latest Updates, To Do List, and Active Documents sections

side:
top

---

## Step 2 — create-matter-wizard

**Source**: `02-ai-automation-workspace-create-new-matter-wizard-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-2-create-matter-wizard.webp`

**Intent**: Demonstrate AI-driven structured matter intake.

### **Callout 01**

title: AI extracts structured matter details

body:
- Describe the work in plain language or from uploaded content
- AI identifies matter type, practice area, and operational metadata automatically
- Reduce manual intake effort and improve consistency

anchor:
`{ x: 0.56, y: 0.33 }`

position description:
Matter Type and Practice Area AI-assisted fields

side:
right

---

### **Callout 02**

title: Natural language becomes operational data

body:
- AI transforms narrative descriptions into structured legal records
- Matter summaries and contextual details are generated automatically
- Intake becomes faster and more standardized

anchor:
`{ x: 0.58, y: 0.53 }`

position description:
Matter Description field

side:
right

---

### **Callout 03**

title: Guided operational workflow

body:
- Multi-step workflows guide users through intake, staffing, and next actions
- AI and operational processes work together in one experience
- Teams can move from intake to execution without re-entering information

anchor:
`{ x: 0.23, y: 0.34 }`

position description:
Wizard steps navigation panel

side:
right

---

## Step 3 — create-matter-assign-work

**Source**: `03-ai-automation-workspace-create-new-matter-wizard-assign-work-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-3-create-matter-assign-work.webp`

**Intent**: Show operational task orchestration tied to intake.

### **Callout 01**

title: Intake becomes executable work

body:
- Matter intake immediately transitions into assignments, tasks, and scheduling
- Operational execution begins as part of the intake process
- Reduce delays between intake and action

anchor:
`{ x: 0.54, y: 0.28 }`

position description:
Assign Work form details section

side:
right

---

### **Callout 02**

title: Structured staffing and scheduling

body:
- Assign attorneys, paralegals, priorities, and response dates directly within the workflow
- Operational staffing becomes standardized and visible
- Improve coordination across legal teams

anchor:
`{ x: 0.56, y: 0.66 }`

position description:
Scheduling and Resources sections

side:
right

---

### **Callout 03**

title: Operational workflows built into the platform

body:
- Multi-step guided workflows support repeatable operational execution
- Processes can adapt by matter type, practice area, or workflow rules
- AI and automation reinforce operational consistency

anchor:
`{ x: 0.22, y: 0.38 }`

position description:
Wizard workflow step navigation

side:
right

---

## Step 4 — notifications

**Source**: `04-ai-automation-workspace-notifications.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-4-notifications.webp`

**Intent**: Demonstrate proactive operational awareness.

### **Callout 01**

title: Event-driven operational awareness

body:
- Notifications surface deadlines, filings, assignments, and risk signals automatically
- Teams stay informed without relying on manual follow-up
- Operational visibility becomes continuous

anchor:
`{ x: 0.89, y: 0.40 }`

position description:
Notifications side panel

side:
left

---

### **Callout 02**

title: AI-driven updates and prioritization

body:
- Notifications summarize operational changes and provide contextual guidance
- AI highlights what changed and what requires attention
- Reduce operational blind spots and missed deadlines

anchor:
`{ x: 0.90, y: 0.22 }`

position description:
Top notification cards and summaries

side:
left

---

### **Callout 03**

title: Operational dashboards stay connected

body:
- Workspace activity, assignments, tasks, and documents remain synchronized with alerts
- Teams can move directly from notification to action
- Legal operations stay coordinated in real time

anchor:
`{ x: 0.48, y: 0.60 }`

position description:
Underlying workspace activity panels

side:
top

---

## Step 5 — matter-list

**Source**: `05-ai-automation-matter-list-view-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-5-matter-list.webp`

**Intent**: Show AI-enabled operational visibility across matters.

### **Callout 01**

title: Centralized matter operations

body:
- View all active matters from a unified operational surface
- Matter type, practice area, and operational metadata remain searchable and structured
- Teams gain portfolio-level visibility

anchor:
`{ x: 0.44, y: 0.20 }`

position description:
Matter list grid and visible records

side:
right

---

### **Callout 02**

title: AI-ready legal operations

body:
- Every matter becomes available for AI summaries, analysis, and workflow automation
- AI capabilities are integrated directly into operational views
- Teams can access intelligence without leaving the workflow

anchor:
`{ x: 0.91, y: 0.08 }`

position description:
Top command bar and AI actions

side:
left

---

### **Callout 03**

title: Structured operational reporting

body:
- Matters remain categorized and reportable by operational dimensions
- Leadership can analyze work by practice area, matter type, or operational status
- Operational intelligence improves portfolio management

anchor:
`{ x: 0.63, y: 0.20 }`

position description:
Matter Type and Practice Area columns

side:
bottom

---

## Step 6 — matter-list-ai-summary

**Source**: `06-ai-automation-matter-list-view-AI-summary-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-6-matter-list-ai-summary.webp`

**Intent**: Demonstrate embedded AI operational summaries.

### **Callout 01**

title: AI summaries directly in the workflow

body:
- AI generates contextual matter summaries directly from the matter list
- Users gain immediate operational insight without opening records
- Reduce time spent searching through matter details

anchor:
`{ x: 0.33, y: 0.32 }`

position description:
AI Summary popup panel

side:
right

---

### **Callout 02**

title: Operational context surfaced automatically

body:
- AI highlights status, budget, activity, and key matter details
- Summaries update as operational activity changes
- Teams gain faster situational awareness

anchor:
`{ x: 0.37, y: 0.36 }`

position description:
Summary text inside AI popup

side:
right

---

### **Callout 03**

title: Intelligence embedded into list views

body:
- Operational intelligence appears directly where teams manage work
- AI becomes part of day-to-day workflows instead of a separate tool
- Users stay inside the operational system while gaining insight

anchor:
`{ x: 0.23, y: 0.18 }`

position description:
Selected matter row and summary trigger

side:
bottom

---

## Step 7 — m365-copilot

**Source**: `07-ai-automation-M365-copilot.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-7-m365-copilot.webp`

**Intent**: Show Spaarke integrated into Microsoft 365 Copilot.

### **Callout 01**

title: Spaarke inside Microsoft 365

body:
- Access Spaarke AI directly from Microsoft 365 Copilot
- Teams can ask questions about legal work from the tools they already use
- Operational intelligence extends across the Microsoft ecosystem

anchor:
`{ x: 0.63, y: 0.32 }`

position description:
Spaarke AI interface inside Copilot

side:
bottom

---

### **Callout 02**

title: Operational AI assistants

body:
- AI assistants help users identify overdue work, locate documents, and analyze risks
- Legal operations become conversational and context-aware
- Reduce time spent navigating systems manually

anchor:
`{ x: 0.63, y: 0.67 }`

position description:
Prompt suggestion cards

side:
top

---

### **Callout 03**

title: AI agents integrated into daily work

body:
- Specialized agents can support research, analysis, administration, and operational workflows
- AI capabilities become accessible directly within user workflows
- Extend legal operations intelligence across teams

anchor:
`{ x: 0.15, y: 0.42 }`

position description:
Agent navigation rail on left side

side:
right

---

## Step 8 — playbook-list

**Source**: `08-ai-automation-playbook-list-view-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-8-playbook-list.webp`

**Intent**: Introduce AI and automation playbooks as operational workflows.

### **Callout 01**

title: Automation built around legal operations

body:
- Playbooks orchestrate AI analysis, notifications, workflows, and operational actions
- Legal processes become repeatable and scalable
- Automation aligns to operational execution instead of isolated tasks

anchor:
`{ x: 0.43, y: 0.22 }`

position description:
Playbook list grid and active playbooks

side:
right

---

### **Callout 02**

title: AI and workflow working together

body:
- Combine AI analysis with event-driven automation and operational workflows
- Trigger actions from documents, records, schedules, or user activity
- Build intelligent operational systems across legal work

anchor:
`{ x: 0.72, y: 0.23 }`

position description:
Playbook Type, Mode, Trigger Type, and Output columns

side:
left

---

### **Callout 03**

title: Operational automation at scale

body:
- Automate summaries, risk scans, intake, document processing, notifications, and review workflows
- Standardize operational execution across the organization
- Reduce repetitive administrative work

anchor:
`{ x: 0.24, y: 0.54 }`

position description:
Visible playbook rows

side:
right

---

## Step 9 — playbook-details

**Source**: `09-ai-automation-playbook-details-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/ai-automation/step-9-playbook-details.webp`

**Intent**: Show the visual AI orchestration builder.

### **Callout 01**

title: Visual AI workflow orchestration

body:
- Build AI and automation workflows visually using nodes and operational actions
- Connect analysis, updates, outputs, and indexing into repeatable flows
- Reduce dependency on custom-coded workflow logic

anchor:
`{ x: 0.31, y: 0.56 }`

position description:
Workflow canvas and connected nodes

side:
right

---

### **Callout 02**

title: AI configured for operational outcomes

body:
- Configure AI skills, prompts, tools, and outputs directly inside workflow nodes
- Tailor analysis behavior to legal and operational requirements
- AI becomes operationally configurable

anchor:
`{ x: 0.56, y: 0.54 }`

position description:
Node configuration panel and Skills tab

side:
right

---

### **Callout 03**

title: Reusable operational building blocks

body:
- Combine AI analysis, updates, notifications, indexing, and tasks into reusable operational patterns
- Workflows can scale across practice areas and operational teams
- Legal operations become systematized and measurable

anchor:
`{ x: 0.13, y: 0.42 }`

position description:
Node Types toolbox on left side

side:
right
