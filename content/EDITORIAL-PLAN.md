# Spaarke Editorial Plan — Article Series

## Overview

This document is the master editorial plan for the Spaarke article series. It serves as a production guide and index for the individual article prompt files in `content/prompts/`. Articles function as the primary product and thought leadership content for Spaarke — there are no separate product pages.

Each article has a dedicated prompt file (`content/prompts/NN-slug.md`) containing the full generation instructions. This document provides the editorial strategy, tag taxonomy, publication schedule, and cross-reference map.

---

## Voice & Tone Guidelines

**Target voice**: McKinsey Quarterly / Harvard Business Review — authoritative, clear, business-familiar. Smart but not stuffy.

- Write for a senior business audience (GCs, CLOs, legal ops leaders, CFOs) who are intelligent but not necessarily technical
- Lead with insight, not jargon
- Use concrete examples and data points over abstract claims
- Avoid legalese and "lawyer voice" — write like a strategist, not a practitioner
- Short paragraphs. Active voice. Direct sentences.
- Contractions are fine. Rhetorical questions sparingly.
- When introducing technical concepts, frame them through business impact first

---

## Article Template Structure

Every article follows this structure:

```
---
title: "[Article Title]"
description: "[SEO meta description — 150-160 chars, keyword-rich, for search results]"
summary: "[Why This Matters text — 100-150 words, used on article cards and for AI extraction]"
date: "[Published date — the logical publication date]"
posted: "[Posted date — when physically posted to the site]"
author: "Spaarke Team"
tags:
  organization: [relevant organization tags]
  function: [relevant function tags]
  topic: [relevant topic/solution area tags]
  theme: [relevant theme tags]
heroImage: "[optional — path to OG/hero image, 1200x630]"
draft: false
---

## Why This Matters

[The summary field content is rendered here automatically as a styled callout
by the PostHeader component. It appears with a "Why This Matters" label,
visually distinct from the article body, and is marked with data-summary
for AI/voice assistant extraction via the speakable schema.]

---

[Article body — see individual article prompt files for structure.

SEO NOTES for article body:
- Use descriptive H2/H3 headings that include target keywords naturally
- First paragraph after each H2 should be a clear, standalone statement
  (AI search engines often extract these as featured snippets)
- Include a natural keyword density for the article's primary topic
- Use bullet/numbered lists for key takeaways (preferred by AI extraction)
- Internal links to other published articles (the "Where to Go Next" section
  plus natural in-body references)
]

---

## Where to Go Next

[1-2 sentences pointing to related published articles. Only reference articles
with an earlier Published date.]
```

---

## Tag Taxonomy

Tags are organized into four categories. Each article should include at least one tag from each category.

### Organization Type
Who is this article most relevant to?

| Tag | Description |
|-----|-------------|
| `corporate-legal` | In-house / corporate law departments |
| `law-firm` | Law firms and outside counsel |
| `both` | Equally relevant to both |

### Function (Reader Role)
Who within the organization should read this?

| Tag | Description |
|-----|-------------|
| `attorney` | Practicing attorneys, GCs, CLOs |
| `legal-professional` | Paralegals, legal assistants, legal analysts |
| `operations` | Legal operations managers and directors |
| `business-analyst` | Business analysts supporting legal |
| `finance` | CFOs, finance teams, procurement |
| `it` | IT leadership, architects, security teams |
| `executive` | C-suite, board members |

### Topic / Solution Area
What functional domain does this article address?

| Tag | Description |
|-----|-------------|
| `matter-management` | Matter intake, tracking, lifecycle |
| `invoicing` | Invoice processing, review, approval |
| `e-billing` | Electronic billing, LEDES, billing guidelines |
| `legal-spend` | Spend analytics, budgets, accruals, forecasting |
| `dms` | Document management, SharePoint integration |
| `workflow` | Workflow automation, routing, approvals |
| `contracts` | Contract lifecycle, negotiation, templates |
| `reporting` | Dashboards, analytics, executive reporting |
| `ai-copilot` | AI capabilities, M365 Copilot integration |
| `compliance` | Regulatory compliance, data governance |
| `vendor-management` | Outside counsel management, panel optimization |

### Theme
What strategic narrative does this article advance?

| Tag | Description |
|-----|-------------|
| `legal-operations-intelligence` | LOI category definition and framework |
| `iq-stack` | Data, Memory, Inference architecture |
| `data-sovereignty` | Data control, privacy, tenant isolation |
| `tenant-dedicated-deployment` | Deployment within customer's own M365 tenant |
| `microsoft-ecosystem` | M365, Power Platform, Azure alignment |
| `ai-strategy` | AI adoption, readiness, architecture decisions |
| `thought-leadership` | Industry perspective, category creation |
| `operational-memory` | Institutional knowledge, organizational context |
| `platform` | Platform approach vs. point solutions |
| `buyer-enablement` | Evaluation, procurement, IT alignment |

---

## Publication Schedule

**Published dates** represent the logical publication date used for sequencing and cross-referencing.
**Posted date** is when articles physically appear on the site: **April 1, 2026** for all articles.

Cross-references must only point to articles with an **earlier Published date**. Articles published on the same date may reference each other.

### Phase 1 — Category Foundation

| # | Published | Title | Prompt File |
|---|-----------|-------|-------------|
| 1 | 2026-01-04 | What is Legal Operations Intelligence? | `01-what-is-legal-operations-intelligence.md` |
| 2 | 2026-01-11 | The IQ Stack: Data, Memory, Inference | `02-the-iq-stack.md` |
| 3 | 2026-01-18 | From Reactive to Predictive: The LOI Maturity Model | `03-loi-maturity-model.md` |

### Phase 2 — Platform & Architecture

| # | Published | Title | Prompt File |
|---|-----------|-------|-------------|
| 4 | 2026-01-25 | Why We Built on Microsoft | `04-why-we-built-on-microsoft.md` |
| 5 | 2026-02-01 | Your Legal Data Belongs to You | `05-your-legal-data-belongs-to-you.md` |
| 6 | 2026-02-08 | Tenant Dedicated Deployment: The New On-Premises | `06-tenant-dedicated-deployment.md` |

### Phase 3 — AI & Strategic Perspective

| # | Published | Title | Prompt File |
|---|-----------|-------|-------------|
| 7 | 2026-02-15 | What Attorneys Need to Know About AI Architecture | `07-what-attorneys-need-to-know-about-ai.md` |
| 8 | 2026-02-22 | AI Without Giving Away the Keys | `08-ai-without-giving-away-the-keys.md` |
| 9 | 2026-03-01 | The AI Readiness Gap in Legal Departments | `09-the-ai-readiness-gap.md` |

### Phase 4 — Operational Depth

| # | Published | Title | Prompt File |
|---|-----------|-------|-------------|
| 10 | 2026-03-07 | The $20B Blind Spot: Why Legal Spend Is Still a Black Box | `10-the-20b-blind-spot.md` |
| 11 | 2026-03-14 | Institutional Knowledge Is Walking Out the Door | `11-institutional-knowledge.md` |
| 12 | 2026-03-21 | Breaking the Silo Between Legal, Finance, and the Business | `12-breaking-the-silo.md` |
| 13 | 2026-03-25 | Legal Ops Is Not IT for Lawyers | `13-legal-ops-is-not-it-for-lawyers.md` |

### Phase 5 — Product & Buyer Enablement

| # | Published | Title | Prompt File |
|---|-----------|-------|-------------|
| 14 | 2026-03-28 | Spaarke for Your IT Team: Architecture & Deployment Q&A | `14-spaarke-for-your-it-team.md` |
| 15 | 2026-03-31 | The Spaarke Platform: Feature Specification | `15-spaarke-feature-specification.md` |

---

## Cross-Reference Theme Map

These thematic threads connect articles across phases. When writing any article, look for natural opportunities to reference other articles sharing the same thread — **only those with earlier Published dates**.

| Theme Thread | Articles |
|---|---|
| **Data Sovereignty & Control** | 1, 4, 5, 6, 7, 8, 14 |
| **IQ Stack / LOI Framework** | 1, 2, 3, 10, 11, 12, 15 |
| **Microsoft Ecosystem** | 4, 5, 6, 8, 14, 15 |
| **AI Strategy & Literacy** | 7, 8, 9, 12 |
| **Operational Memory** | 2, 11, 13 |
| **Business Case / ROI** | 3, 10, 12, 13 |
| **Tenant Dedicated Deployment** | 4, 6, 8, 14 |

**Cross-reference guidelines:**
- **Direct references**: "As we explored in [Article Title]..." — use when building directly on a prior article's concept. Only reference articles with earlier Published dates.
- **Indirect references**: Reuse terminology introduced in earlier articles without explicit citation — this creates conceptual coherence across the series.
- **Forward teases** (sparingly): "We will explore this further in an upcoming article" — only when the next article is in the immediately following publication slot.

---

## Production Notes

### Frontmatter Reference

Each MDX article file uses this frontmatter schema:

```yaml
title: "Article Title"                    # Display title
description: "150-160 char SEO summary"   # Used in <meta description>, search results
summary: "100-150 word Why This Matters"  # Used on article cards, in the summary callout,
                                          # and marked for AI/voice assistant extraction
date: "2026-01-04"                        # Published date (logical sequence date)
posted: "2026-04-01"                      # Posted date (when physically added to site)
author: "Spaarke Team"
tags:
  organization: [corporate-legal]         # See Tag Taxonomy section
  function: [operations, attorney]
  topic: [matter-management, legal-spend]
  theme: [legal-operations-intelligence]
heroImage: "/images/articles/slug.png"    # Optional, 1200x630 for OG
draft: false
```

**Key distinctions:**
- `description` = short, keyword-rich, for search engine result pages (SERPs). Max 160 chars.
- `summary` = the "Why This Matters" narrative. Longer, more compelling, used on cards and for AI extraction.

### For AI Article Generation

When generating any article from its prompt file:
1. Read this editorial plan first to understand the full article ecosystem
2. Read the article's dedicated prompt file in `content/prompts/`
3. Read all previously published articles (those with earlier Published dates) to ensure consistent voice and accurate cross-references
4. Follow the template structure exactly (Why This Matters section, body, Where to Go Next)
5. Use the voice guidelines in this document
6. Apply the tag taxonomy — include tags from all four categories
7. Keep within the target word count specified in the prompt file
8. Use the Published date from the schedule above as the `date` field; use `2026-04-01` as the `posted` field
9. Write a keyword-rich `description` (150-160 chars) AND a longer `summary` (100-150 words) — they serve different purposes

### SEO Guidelines

**Traditional search engine optimization:**
- `description` field: 150-160 characters, includes primary keyword, compelling enough to drive clicks from SERPs
- Title tags: descriptive, include target keyword, under 60 characters when possible
- H2/H3 headings: include topic keywords naturally — headings are heavily weighted by search engines
- Internal linking: every article should link to 2-3 related published articles (earlier Published dates only)
- URL slugs: derived from filename, should be short and keyword-rich
- Structured data: JSON-LD Article schema is generated automatically including `speakable`, `about` entities, `datePublished`, `dateModified`, and `keywords`
- Sitemap: automatically generated, includes all published articles with `lastModified` dates
- RSS feed: automatically generated with structured tag categories

**AI search optimization (AI Overviews, ChatGPT, Perplexity, etc.):**
- `summary` field is marked with `data-summary` attribute and included in the `speakable` schema — AI assistants use these signals to identify extractable content
- First paragraph after each H2 should be a clear, factual, standalone statement — AI search engines extract these as direct answers
- Define key terms explicitly when introducing them (e.g., "Legal Operations Intelligence (LOI) is...") — AI models use definitional sentences for knowledge graphs
- Use structured lists (bullets, numbered) for key takeaways — AI extractors strongly prefer list formats
- The `llms.txt` file at site root provides AI crawlers with a structured overview of Spaarke's identity and content themes
- `about` entities in JSON-LD are auto-generated from topic and theme tags — these help AI models understand article subject matter
- Avoid vague or subjective language in key sentences; prefer concrete, factual claims that AI can confidently extract and cite

### Card Summary Usage

The `summary` field of each article doubles as the article card text on the website. When generating, ensure:
- 100-150 words
- Stands alone without requiring the full article
- Creates enough intrigue to drive click-through
- Frames a problem or insight, not a product pitch
- Written in a way that reads well both as a card excerpt AND as an AI-extracted summary
