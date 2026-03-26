# Article 6: Tenant Dedicated Deployment — The New On-Premises

> **Read `content/EDITORIAL-PLAN.md` first** for voice guidelines, tag taxonomy, template structure, and cross-reference rules.

## Metadata

| Field | Value |
|-------|-------|
| **Published** | 2026-02-08 |
| **Posted** | 2026-04-01 |
| **Phase** | 2 — Platform & Architecture |
| **Word Count** | 1,200–1,400 |
| **Author** | Spaarke Team |

## Tags

```yaml
tags:
  organization: [corporate-legal]
  function: [it, operations, executive]
  topic: [compliance, ai-copilot]
  theme: [tenant-dedicated-deployment, microsoft-ecosystem, data-sovereignty, platform, buyer-enablement]
```

## Purpose

Define and own the "Tenant Dedicated Deployment" concept. This article bridges IT and legal audiences — it makes the deployment model concrete for both. This is the definitive reference for the concept introduced in Article 4.

## Card Summary / Why This Matters

> For decades, "on-premises" meant control. You owned the servers, you controlled the data, you managed the perimeter. Then cloud SaaS promised simplicity — but quietly moved your most sensitive data to someone else's infrastructure. Tenant Dedicated Deployment is the third option: the control of on-premises with the simplicity of cloud, deployed entirely within your organization's own Microsoft 365 environment.

## Structure

### 1. Why This Matters (~150 words)
IT leaders and legal leaders are often stuck choosing between control (on-prem) and agility (SaaS). Tenant Dedicated Deployment eliminates the tradeoff. As introduced in "Why We Built on Microsoft" (Article 4), Spaarke's platform choice was strategic — this article explains the deployment model that makes it real.

### 2. A Brief History of Deployment (~250 words)
Frame as an evolution, not a revolution:

**On-Premises (1990s–2010s)**
- Full control. Your servers, your data center, your perimeter.
- But: high capital cost, slow update cycles, heavy IT burden, scaling limitations

**Multi-Tenant SaaS (2010s–present)**
- Agility. Lower upfront cost, automatic updates, rapid deployment.
- But: your data on shared infrastructure, limited customization, data commingling, compliance ambiguity, vendor dependency

**Tenant Dedicated Deployment (now)**
- Your own M365 tenant. Cloud-native. Your control. Your data boundary.
- Updates delivered through the platform. No infrastructure to manage.
- Combines on-prem control with SaaS simplicity — without the compromises of either

### 3. How It Works (~300 words)
Spaarke is built on Microsoft Power Platform and deploys directly into the customer's M365 tenant.

Technical specifics (business-accessible language):
- **Data stays within the tenant boundary** — Dataverse stores all Spaarke data within your M365 environment
- **Security policies apply automatically** — Conditional Access, MFA, DLP rules, and compliance configurations are inherited
- **Entra ID manages access** — same identity system your IT team already governs
- **Updates delivered through Power Platform** — no manual patching, no maintenance windows your IT team must schedule
- **No separate infrastructure** — no VMs to manage, no databases to maintain, no vendor servers to trust
- Connect to data sovereignty (Article 5) — this architecture is what makes true data sovereignty possible

### 4. What This Means for IT (~250 words)
Speak to IT stakeholders directly:
- Familiar governance model — same tools, same policies, same audit trails
- Entra ID/Azure AD for identity and access management — no separate user directory
- Microsoft Purview for data governance — classification, retention, and DLP cover Spaarke data natively
- No new vendor infrastructure to audit or penetration test
- Licensing aligns with existing Microsoft enterprise agreements
- Preview the detailed IT Q&A in Article 14 — "For a complete technical brief, including security, licensing, and common IT questions, see our IT Architecture & Deployment Q&A."

### 5. What This Means for Legal (~200 words)
Speak to legal stakeholders:
- Data never leaves the organization — privilege concerns addressed architecturally, not just contractually
- AI capabilities via M365 Copilot operate within the same tenant boundary — no data sent to external AI services
- Compliance is structural, not promissory — you are not relying on a vendor's pledge; your own policies enforce it
- Connect to data sovereignty themes from Article 5

### 6. Where to Go Next
- Back-references: "Why We Built on Microsoft" (Article 4) and "Your Legal Data Belongs to You" (Article 5)
- Forward tease: Article 14 (IT Q&A) for the complete technical deep dive

## Key Phrases
- **Tenant Dedicated Deployment** — the definitive definition lives in this article
- "The control of on-premises with the simplicity of cloud"
- "Compliance is structural, not promissory"

## Cross-References
- **Can reference**: Articles 1, 2, 3, 4, 5
- **Will be referenced by**: Articles 8, 12, 14, 15
- **Forward tease**: Article 14 (IT Q&A)
