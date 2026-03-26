# Article 14: Spaarke for Your IT Team — Architecture & Deployment Q&A

> **Read `content/EDITORIAL-PLAN.md` first** for voice guidelines, tag taxonomy, template structure, and cross-reference rules.

## Metadata

| Field | Value |
|-------|-------|
| **Published** | 2026-03-28 |
| **Posted** | 2026-04-01 |
| **Phase** | 5 — Product & Buyer Enablement |
| **Word Count** | 1,600–2,000 |
| **Author** | Spaarke Team |

## Tags

```yaml
tags:
  organization: [corporate-legal]
  function: [it, operations, executive]
  topic: [compliance, ai-copilot, dms, workflow]
  theme: [tenant-dedicated-deployment, microsoft-ecosystem, data-sovereignty, buyer-enablement, platform]
```

## Purpose

Buyer enablement. Removes IT as a blocker in the evaluation process. This article is designed to be handed directly to IT leadership — it answers the questions they will ask before approving a new platform. Written for a technical audience but in clear, direct language.

## Card Summary / Why This Matters

> When legal operations evaluates a new platform, IT needs to weigh in — and rightly so. This article is designed to answer the questions your IT team will ask about Spaarke: how it deploys, where data lives, what it requires, and how it fits within your existing Microsoft infrastructure. Consider it a technical brief you can hand directly to your IT leadership.

## Structure

### 1. Why This Matters (~150 words)
IT alignment is critical for successful platform adoption. Spaarke was designed with IT requirements in mind from day one — not as an afterthought. This article consolidates the technical details introduced across earlier articles (4, 5, 6) into a single IT-focused reference.

### 2. Architecture Overview (~300 words)
Spaarke is built on **Microsoft Power Platform** and deploys within the customer's **M365 tenant**.

Key architecture points:
- **Runtime**: Power Apps (model-driven and canvas apps) on Dataverse
- **Data layer**: Microsoft Dataverse — all Spaarke data stored within the tenant's Dataverse environment
- **AI layer**: M365 Copilot integration — AI operates within the tenant boundary
- **Document storage**: SharePoint Online — native integration, no separate DMS
- **Communication**: Teams and Outlook — notifications, collaboration, and workflow triggers
- **Automation**: Power Automate — workflow engine for routing, approvals, and integrations
- **Analytics**: Power BI — embedded dashboards and reporting

No external infrastructure. No data egress. Runs alongside existing M365 services.

Reference Article 6 (Tenant Dedicated Deployment) for the business context of this architecture.

### 3. Deployment Model (~300 words)
**Tenant Dedicated Deployment** explained for a technical audience:

- **Provisioning**: Spaarke is deployed as a managed solution into the customer's Dataverse environment
- **Environments**: Supports standard Power Platform environment strategy (dev/test/prod)
- **Timeline**: Typical deployment in [specify if known, otherwise "weeks, not months"]
- **IT requirements**: M365 tenant with Power Platform licenses, Dataverse capacity, Copilot licenses (for AI features)
- **Spaarke responsibilities**: Solution deployment, configuration, data model setup, initial training
- **Customer IT responsibilities**: Environment provisioning, user access configuration, security policy review

No separate infrastructure to stand up. No VMs, no databases, no networking configuration.

### 4. Security & Compliance (~300 words)
Spaarke inherits the customer's existing M365 security posture:

- **Identity**: Microsoft Entra ID (Azure AD) — SSO, MFA, Conditional Access policies apply automatically
- **Data governance**: Microsoft Purview — data classification, sensitivity labels, retention policies, DLP all cover Spaarke data natively
- **Access control**: Dataverse security roles — granular role-based access control within the application
- **Encryption**: Data encrypted at rest and in transit via Microsoft's standard M365 encryption (customer-managed keys supported)
- **Audit**: Unified audit log — Spaarke activities visible in Microsoft 365 compliance center
- **Compliance**: Inherits tenant-level compliance certifications (SOC 2, ISO 27001, HIPAA, FedRAMP, GDPR, etc.)

No additional security perimeter to manage. No separate vendor security assessment required beyond standard Power Platform review.

### 5. Integration Points (~250 words)
Native M365 integrations:

- **M365 Copilot**: Spaarke exposes structured legal data to Copilot — users can query matter data, spend information, and institutional knowledge through natural language in Copilot
- **SharePoint**: Document libraries for matter documents — native versioning, metadata, and co-authoring
- **Outlook**: Email capture, notification delivery, calendar integration for deadlines
- **Teams**: Matter channels, collaboration spaces, notification bots
- **Power Automate**: Workflow engine — matter routing, approval chains, notification triggers, external system connectors
- **Power BI**: Embedded analytics and executive dashboards
- **Dataverse Web API**: REST API for custom integrations and data exchange

### 6. Licensing & Requirements (~200 words)
Be direct and specific:

**Microsoft prerequisites:**
- Microsoft 365 E3 or E5 (or equivalent)
- Power Apps per-user or per-app licenses
- Dataverse storage capacity (specify approximate per-user requirements)
- M365 Copilot licenses (for AI features — optional for core platform)

**Spaarke licensing:**
- [Specify model: per-user, tiered, etc.]
- [Specify what is included vs. add-on]

**Important**: This should be clear and direct. No "contact us for pricing" evasion. If specific pricing is not finalized, describe the model structure clearly.

### 7. Common IT Questions (~300 words)
Q&A format — direct questions, direct answers:

- **Data residency**: Where is data stored? → In your M365 tenant, governed by your tenant's data residency configuration
- **Backup/Recovery**: → Standard Dataverse backup (system backups every 24 hours, manual backup on demand, point-in-time restore)
- **Uptime SLA**: → Inherits Microsoft's Power Platform SLA (99.9%)
- **Admin controls**: → Power Platform admin center — environment management, capacity monitoring, DLP policies
- **User provisioning**: → Entra ID — assign security roles in Dataverse, no separate user management
- **Audit logging**: → Microsoft 365 unified audit log, plus Dataverse audit tables for data-level changes
- **Update cadence**: → Managed solution updates delivered through Dataverse solution management; customer controls timing of updates
- **Support model**: → [Specify tiers, response times, channels]
- **Multi-environment**: → Supports dev/test/prod environment strategy per Power Platform best practices
- **Data migration**: → Import tools for existing matter data, spend data, and document libraries

### 8. Where to Go Next
- Back-references: "Tenant Dedicated Deployment" (Article 6) for the business case, "Why We Built on Microsoft" (Article 4) for strategic context, "Your Legal Data Belongs to You" (Article 5) for data sovereignty

## Cross-References
- **Can reference**: All prior articles (1-13)
- **Will be referenced by**: Article 15
- **Shared themes**: Tenant Dedicated Deployment, Microsoft Ecosystem, Data Sovereignty & Control, Buyer Enablement
