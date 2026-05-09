# Taxonomy — canonical blog tag values

**Phase**: 1 (T11 follow-up). **Source**: audit of `content/blog/*.mdx` frontmatter (16 articles, 2026-01-04 → 2026-03-31), `src/lib/blog.ts`, `voice/audience-personas.md`.

---

## 1. How tags work

Every blog post carries a structured `tags:` block in MDX frontmatter with four categories: **organization** (whose legal function the article is about), **function** (the role spoken to), **topic** (the operational subject), and **theme** (the narrative arc advanced). Tags MUST come from the canonical sets below — authors do not invent new values. The same shape appears in `templates/blog-post/brief.md`. The site uses these tags for filters, related-post heuristics, and the future blog index; drift breaks all three.

---

## 2. The canonical sets

### organization

Whose legal function the article is about. Roughly maps to the persona's organizational context.

| Slug | When to use |
|---|---|
| `corporate-legal` | Articles about in-house corporate legal departments — GC, deputy GC, legal-ops director, legal-tech CIO as the primary audience or subject. The default for most pieces. |
| `law-firm` | Articles about outside counsel — partners, firm operations, firm-side AI and OCG response. Use alongside `corporate-legal` when the piece is explicitly about the corporate–firm relationship. |

### function

The role inside the organization the article speaks to or is about.

| Slug | When to use |
|---|---|
| `executive` | GC, CLO, managing partner, COO — the buyer or senior sponsor. Use when the piece is framed for a person who owns the budget. |
| `operations` | Legal-ops director, head of legal operations, practice management, business analysts on the legal-ops team. The default for operational-rigor pieces. |
| `attorney` | Practicing lawyers — in-house counsel, associates, partners — as users or subjects. Use when the article is about the lawyer's day-to-day or the attorney point of view. |
| `it` | Legal-tech CIO, enterprise architect, IT or security teams who sign off on the Microsoft tenant. Use for architecture, deployment, identity, governance pieces. |
| `finance` | CFO, controller, FP&A — when the piece is explicitly about the legal–finance interface (spend visibility, accruals, e-billing as a finance concern). |

### topic

The operational subject — what the article is *about*, in industry terms.

| Slug | When to use |
|---|---|
| `matter-management` | Matter intake, taxonomy, lifecycle, handoffs, the matter as the unit of work. |
| `legal-spend` | Outside-counsel spend visibility, panel spend, spend analytics, budget defensibility. |
| `e-billing` | Invoice review, OCG enforcement at billing, e-billing systems, LEDES, accruals. (Replaces `invoicing` — same scope, industry term.) |
| `reporting` | Dashboards, KPIs, board-level reporting, the reports a GC hands up. |
| `workflow` | Intake routing, approval flows, automation of legal-ops processes. |
| `compliance` | Privilege, work product, data residency, DLP, audit, regulatory posture inside legal. |
| `dms` | Document management — SharePoint, SharePoint Embedded, document governance, file-level controls. |
| `contracts` | Contract drafting, review, repository, CLM-adjacent topics. |
| `ai-copilot` | Microsoft Copilot, Copilot Studio, AI assistants for legal work. The AI-application topic. |
| `vendor-management` | Outside-counsel and tech-vendor management, panel administration, OCG terms as a vendor-management discipline. |

### theme

Spaarke's recurring narrative — what argument the article advances. Smaller and more controlled than `topic`.

| Slug | When to use |
|---|---|
| `legal-operations-intelligence` | The LOI argument: Spaarke is operational intelligence for the legal function. The umbrella narrative. |
| `iq-stack` | The four-layer Legal IQ stack frame (operational memory → analytics → directed AI → directed agents). Use only when the piece explicitly invokes the stack. |
| `microsoft-ecosystem` | The Microsoft-native argument — Dataverse, SharePoint, Entra, Purview, Copilot. Use for architecture and integration pieces. |
| `tenant-dedicated-deployment` | The customer-tenant deployment story — single-tenant in the customer's Microsoft estate vs multi-tenant SaaS. |
| `data-sovereignty` | Where customer data lives, who can see it, what the AI does and does not learn from it. The privilege-and-control argument. |
| `ai-strategy` | The "AI directed by humans, grounded in your data" narrative — what we say about AI generally, beyond a specific Copilot integration. |
| `operational-memory` | The institutional-knowledge-survives-turnover narrative — handoffs, matter context, the system-of-record argument as memory. |
| `platform` | The platform-not-tool narrative — Spaarke as the system the legal function runs on, vs point solutions. |
| `buyer-enablement` | Pieces written to help a buyer make the case internally (architecture FAQs, IT-team enablement, deployment-model explainers). |

---

## 3. Tags retired

Tags observed in the 16-article audit that are NOT in the canonical set above:

- `function: legal-professional` — appeared in `institutional-knowledge`, `legal-ops-is-not-it-for-lawyers`, `spaarke-feature-specification`. Drift of `attorney`. Every article using it also tags `attorney`. Retag as: drop the entry (already covered by `attorney`).
- `function: business-analyst` — appeared in `the-iq-stack`, `the-ai-readiness-gap`, `breaking-the-silo`, `spaarke-feature-specification`. No matching persona; the BA role on a legal-ops team is part of `operations`. Retag as `operations` (already present in all four; just drop the duplicate).
- `topic: invoicing` — appeared in `the-20b-blind-spot`, `spaarke-feature-specification`. Industry uses `e-billing`. Both articles already tag `e-billing`. Retag as: drop the entry.
- `theme: thought-leadership` — appeared in `what-is-legal-operations-intelligence`, `loi-maturity-model`, `the-20b-blind-spot`, `what-attorneys-need-to-know-about-ai`, `the-ai-readiness-gap`, `institutional-knowledge`, `legal-ops-is-not-it-for-lawyers`. Adds no filtering value (every blog post is thought leadership by intent). Retag as: drop the entry.
- `theme: news` — appeared in `welcome-to-spaarke` (legacy flat-array frontmatter). One-off; no place in the canonical narrative themes. Drop.
- `theme: updates` — appeared in `welcome-to-spaarke`. Same as above. Drop.
- `theme: company` — appeared in `welcome-to-spaarke`. Same as above. Drop. (The `welcome-to-spaarke` rewrite already tracked separately under T11 §4 will tag the replacement piece against the canonical sets.)

---

## 4. Audit table — current state of all 16 articles

The Phase 1 retag work list. Retired tags shown ~~struck through~~. "Needs retag?" is `yes` whenever any retired or legacy entry is present.

| Article slug | organization | function | topic | theme | needs retag? |
|---|---|---|---|---|---|
| `what-is-legal-operations-intelligence` | corporate-legal, law-firm | attorney, operations, executive | matter-management, legal-spend, reporting | legal-operations-intelligence, iq-stack, ~~thought-leadership~~ | yes (drop thought-leadership) |
| `the-iq-stack` | corporate-legal | operations, ~~business-analyst~~, attorney | matter-management, reporting, ai-copilot | iq-stack, legal-operations-intelligence, platform, operational-memory | yes (drop business-analyst) |
| `loi-maturity-model` | corporate-legal | operations, executive, attorney | matter-management, legal-spend, workflow, reporting | legal-operations-intelligence, iq-stack, ~~thought-leadership~~ | yes (drop thought-leadership) |
| `why-we-built-on-microsoft` | corporate-legal | operations, it, executive | compliance, dms, ai-copilot | microsoft-ecosystem, tenant-dedicated-deployment, platform, data-sovereignty | no |
| `welcome-to-spaarke` | (none — legacy) | (none — legacy) | (none — legacy) | ~~news, updates, company~~ | yes (full retag — also flagged for content rewrite) |
| `your-legal-data-belongs-to-you` | corporate-legal, law-firm | attorney, operations, it, executive | compliance, dms, ai-copilot | data-sovereignty, tenant-dedicated-deployment, ai-strategy, microsoft-ecosystem | no |
| `tenant-dedicated-deployment` | corporate-legal | it, operations, executive | compliance, ai-copilot | tenant-dedicated-deployment, microsoft-ecosystem, data-sovereignty, platform, buyer-enablement | no |
| `what-attorneys-need-to-know-about-ai` | corporate-legal, law-firm | attorney, executive, operations | ai-copilot, compliance, legal-spend | ai-strategy, data-sovereignty, microsoft-ecosystem, ~~thought-leadership~~ | yes (drop thought-leadership) |
| `ai-without-giving-away-the-keys` | corporate-legal | attorney, operations, it, executive | ai-copilot, compliance | ai-strategy, microsoft-ecosystem, data-sovereignty, tenant-dedicated-deployment | no |
| `the-ai-readiness-gap` | corporate-legal | operations, executive, attorney, ~~business-analyst~~ | matter-management, reporting, ai-copilot, workflow | ai-strategy, legal-operations-intelligence, iq-stack, ~~thought-leadership~~ | yes (drop business-analyst, thought-leadership) |
| `the-20b-blind-spot` | corporate-legal | operations, finance, executive, attorney | legal-spend, ~~invoicing~~, e-billing, reporting, vendor-management | legal-operations-intelligence, iq-stack, ~~thought-leadership~~ | yes (drop invoicing, thought-leadership) |
| `institutional-knowledge` | corporate-legal, law-firm | attorney, ~~legal-professional~~, operations, executive | matter-management, dms, contracts, vendor-management | operational-memory, iq-stack, legal-operations-intelligence, ~~thought-leadership~~ | yes (drop legal-professional, thought-leadership) |
| `breaking-the-silo` | corporate-legal | operations, finance, executive, ~~business-analyst~~, attorney | reporting, legal-spend, contracts, matter-management, compliance | legal-operations-intelligence, platform, microsoft-ecosystem, iq-stack | yes (drop business-analyst) |
| `legal-ops-is-not-it-for-lawyers` | corporate-legal | operations, executive, attorney, ~~legal-professional~~ | matter-management, workflow, reporting, legal-spend | legal-operations-intelligence, ~~thought-leadership~~, iq-stack, operational-memory | yes (drop legal-professional, thought-leadership) |
| `spaarke-for-your-it-team` | corporate-legal | it, operations, executive | compliance, ai-copilot, dms, workflow | tenant-dedicated-deployment, microsoft-ecosystem, data-sovereignty, buyer-enablement, platform | no |
| `spaarke-feature-specification` | corporate-legal | operations, ~~business-analyst~~, attorney, ~~legal-professional~~, it, executive, finance | matter-management, ~~invoicing~~, e-billing, legal-spend, dms, workflow, contracts, reporting, ai-copilot, compliance, vendor-management | iq-stack, legal-operations-intelligence, platform, microsoft-ecosystem, buyer-enablement | yes (drop business-analyst, legal-professional, invoicing) |

Eleven of 16 articles need a retag pass. Five are clean. The legacy `welcome-to-spaarke` is the only article needing a full retag (and is already on the rewrite list separately).

---

## 5. The retag procedure

For each article where "needs retag?" is `yes`:

1. Open the MDX under `content/blog/` and edit only the frontmatter `tags:` block.
2. Drop the retired entries listed in the table. Do not add tags unless a category is obviously empty.
3. Confirm every remaining value matches a slug in §2 exactly — no spelling variants.
4. For `welcome-to-spaarke`, replace the legacy flat array with a structured `tags:` block once the rewrite drops.
5. Commit as one commit: `chore(content): retag blog library per voice/taxonomy.md`. Tag-only — no body, date, or other frontmatter changes.

---

## 6. Adding a new tag

A new canonical tag is an editorial decision, not a per-piece convenience. The bar is high: a new tag should reflect a new narrative (theme) or a new operational subject the library will return to repeatedly, not a clever way to describe one article.

1. Propose the value in the active review notes file: slug, category, one-line "when to use", at least three real or planned articles that would carry it.
2. Team confirms. Add it to §2 with the same definition; update any affected briefs.
3. If it replaces an existing tag, add the retired tag to §3 and run a retag pass.
4. Commit as a documentation commit, separate from article changes.

Expected cadence: zero to two new tags per quarter. More frequent is drift, not growth.

---

Locked 2026-05-06 — see git log for history.

---

*Locked 2026-05-07 — see git log for history.*
