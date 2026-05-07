# Spend & Performance — authoring guide

Per-step authoring notes for the **Spend & Performance** section of the
`full-walkthrough` tour. Image files in this directory are gitignored —
processed final assets land in:

`public/tours/full-walkthrough/spend-performance/`

See:

`projects/product-walkthrough-app/tasks/11-spend-performance-content.md`

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

`src/content/tours/full-walkthrough/spend-performance.ts`

Preview each step at:

`?section=spend-performance&step=N&grid=1`

and revise anchors after calibration.

---

# Steps

---

## Step 1 — matter-details

**Source**: `01-spend-performance-matter-details-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/spend-performance/step-1-matter-details.webp`

**Intent**: Demonstrate operational and financial visibility directly on the matter.

### **Callout 01**

title: Financial visibility built into the matter

body:
- Budget, spend, documents, and upcoming work appear directly within the matter workspace
- Legal operations teams no longer need disconnected finance systems to understand matter health
- Operational and financial context stay connected

anchor:
`{ x: 0.74, y: 0.42 }`

position description:
Financial Metrics and Upcoming Tasks panels

side:
left

---

### **Callout 02**

title: Matter-centric document intelligence

body:
- Documents remain tied directly to the matter and operational workflow
- Teams can search, review, preview, and analyze matter files from one location
- Operational execution and knowledge stay unified

anchor:
`{ x: 0.40, y: 0.63 }`

position description:
Documents section and document list

side:
right

---

### **Callout 03**

title: Performance surfaced operationally

body:
- Matter performance indicators help teams monitor budget controls, compliance, and outcomes
- Legal operations becomes measurable and visible in real time
- Leadership gains operational insight without manual reporting

anchor:
`{ x: 0.80, y: 0.28 }`

position description:
Performance Grades gauges

side:
left

---

### **Callout 04**

title: Operational context stays centralized

body:
- Matter details, assignments, documents, spend, and deadlines remain connected in one operational workspace
- Users work from a unified legal operations platform instead of disconnected systems
- Reduce context switching across legal teams

anchor:
`{ x: 0.39, y: 0.24 }`

position description:
Matter Information section

side:
bottom

---

## Step 2 — matter-report-card

**Source**: `02-spend-performance-matter-report-card-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/spend-performance/step-2-matter-report-card.webp`

**Intent**: Show matter-level KPI scoring, compliance, and operational assessment.

### **Callout 01**

title: One operational scorecard per matter

body:
- Budget compliance, guideline adherence, and outcome performance are tracked together
- Stakeholders gain a shared operational understanding of matter health
- Performance becomes measurable and standardized

anchor:
`{ x: 0.51, y: 0.24 }`

position description:
Performance Areas section

side:
bottom

---

### **Callout 02**

title: KPI-driven legal operations

body:
- Assessments capture measurable operational performance indicators across matters
- Legal teams can evaluate compliance, efficiency, and outcomes consistently
- Operational reporting becomes data-driven

anchor:
`{ x: 0.48, y: 0.58 }`

position description:
KPI Assessments grid

side:
top

---

### **Callout 03**

title: Track operational trends over time

body:
- Performance history provides visibility into operational changes and trends
- Teams can identify recurring issues and improve process execution
- Historical scoring supports operational accountability

anchor:
`{ x: 0.79, y: 0.58 }`

position description:
Grade and Created On columns

side:
left

---

### **Callout 04**

title: Compliance and outcomes measured together

body:
- Financial compliance and operational outcomes remain connected
- Teams can evaluate legal work using operational and business metrics together
- Improve visibility into legal operations performance

anchor:
`{ x: 0.72, y: 0.24 }`

position description:
Outcome Compliance and Budget Compliance metrics

side:
left

---

## Step 3 — matter-billing

**Source**: `03-spend-performance-matter-billing-SANDBOX.png`  
**Final asset**: `public/tours/full-walkthrough/spend-performance/step-3-matter-billing.webp`

**Intent**: Demonstrate integrated billing, budgeting, and spend visibility.

### **Callout 01**

title: Matter-centric billing and spend

body:
- Invoices, budgets, and financial metrics remain directly connected to the matter
- Legal operations teams gain immediate visibility into spend activity
- Financial oversight becomes part of operational execution

anchor:
`{ x: 0.53, y: 0.29 }`

position description:
Financials summary section

side:
bottom

---

### **Callout 02**

title: Budget visibility in real time

body:
- Monitor total budget, remaining budget, invoice volume, and utilization continuously
- Teams can identify financial risk earlier in the workflow
- Budget management becomes proactive instead of retrospective

anchor:
`{ x: 0.73, y: 0.32 }`

position description:
Budget and utilization metrics

side:
left

---

### **Callout 03**

title: Every invoice tied to operational context

body:
- Invoices remain linked to the matter, operational workflow, and related activity
- Teams can review financial history directly from the matter workspace
- Operational and financial data stay unified

anchor:
`{ x: 0.46, y: 0.61 }`

position description:
Invoices grid and invoice records

side:
top

---

### **Callout 04**

title: Budgets managed alongside execution

body:
- Budgets are maintained as operational records connected to ongoing legal work
- Financial governance becomes integrated into day-to-day operations
- Improve visibility into spend planning and execution

anchor:
`{ x: 0.46, y: 0.88 }`

position description:
Budgets section

side:
top

---

### **Callout 05**

title: Operational reporting built into finance workflows

body:
- Reporting, workflow actions, and operational processes remain available directly inside billing workflows
- Legal spend management becomes operationally actionable
- Teams can move from analysis to execution without leaving the platform

anchor:
`{ x: 0.82, y: 0.60 }`

position description:
Invoice command bar actions

side:
left
