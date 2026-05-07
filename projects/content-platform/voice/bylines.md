# Bylines

Who Spaarke pieces are attributed to, and the convention that decides
which byline goes on which piece.

---

## 1. How bylines work

The default byline on Spaarke pieces is the organization itself
(`spaarke`). Named bylines apply when the individual's lived
experience is the argument — long-form practitioner pieces, LinkedIn
posts (almost always stronger in a personal voice), and quoted
commentary in industry publications. White papers and positioning
pieces stay organizational; practitioner essays and first-person
operational accounts run under a named byline. The convention is
summarized in `spec.md` §7.4; this file is the active roster.

---

## 2. The slug convention

The brief's `byline:` field and the MDX frontmatter's `author:` field
take a slug. Accepted values are `spaarke` plus any named slug listed
in §3 below. Adding a new named byline means adding an entry here and
reassigning the relevant calendar rows from `tbd` to the new slug.

---

## 3. Active bylines

### Ralph Schroeder, Founder & CEO
**Slug**: `ralph-schroeder` (used as `author:` in frontmatter, `byline:` in briefs)
**Status**: active

**Bio** (~80 words, written on-voice for the closing-paragraph "About the author" use case):
Ralph Schroeder is the founder and CEO of Spaarke. His work centers on Legal Operations Intelligence — the operational layer above matter and document systems where data, memory, and inference compound. He argues that legal AI becomes operationally valuable only when it is grounded in a system of record, not bolted on, and that the platform belongs inside the Microsoft tenant the business already governs. The Spaarke philosophy is plainspoken: AI-directed, human-controlled.

**Topic areas**:
- Legal Operations Intelligence as a category — the IQ Stack, the LOI maturity model, and where it sits relative to matter management and ELM
- Microsoft-native legal infrastructure — Power Platform, SharePoint Embedded, Outlook, Teams, M365 Copilot, Azure AI Foundry as one operating layer
- AI-directed, human-controlled workflows — agentic systems that respect professional judgment
- The future of legal work — operating models, not tools

**Headshot**: `/images/bylines/ralph-schroeder.jpg` (drop the file at this path)
**LinkedIn**: `<TBD — confirm with team>`
**Short bio (≤ 280 chars)** — for tweet-length attribution:
Ralph Schroeder is the founder and CEO of Spaarke, the Legal Operations Intelligence platform — Microsoft-native, AI-directed, human-controlled.

---

### Future Legal Operations Leader (TBD)
**Slug**: `legal-ops-leader` (used as `author:` in frontmatter, `byline:` in briefs)
**Status**: placeholder

**Bio** (~80 words, written on-voice for the closing-paragraph "About the author" use case):
This byline is reserved for a practitioner-oriented voice on Spaarke pieces — a legal operations leader writing about the day-to-day mechanics of legal workflow modernization, billing compliance, intake, collaboration, and service delivery. The role is not yet named. This entry will be populated when the named team member joins. Until then, pieces in this voice are written under the organizational `spaarke` byline.

**Topic areas**:
- Legal workflow modernization — intake, triage, routing, approvals
- Billing compliance and outside counsel guideline enforcement
- Matter intake and matter-level collaboration discipline
- Cross-side collaboration (in-house, outside counsel, business clients)
- Legal service delivery — how the work actually runs

**Headshot**: `/images/bylines/legal-ops-leader.jpg` (drop the file at this path)
**LinkedIn**: `<TBD — confirm with team>`
**Short bio (≤ 280 chars)** — for tweet-length attribution:
Practitioner byline reserved for a Spaarke legal operations leader. Pieces in this voice currently run under the organizational byline pending the role being named.

---

### Future Architecture / Platform Engineering Lead (TBD)
**Slug**: `platform-engineering-lead` (used as `author:` in frontmatter, `byline:` in briefs)
**Status**: placeholder

**Bio** (~80 words, written on-voice for the closing-paragraph "About the author" use case):
This byline is reserved for technical but business-readable writing on Spaarke pieces — enterprise architecture, Microsoft integration patterns, operational governance, and secure AI systems. The role is not yet named. This entry will be populated when the named team member joins. Until then, pieces in this voice are written under the organizational `spaarke` byline.

**Topic areas**:
- Enterprise architecture for legal operations — tenancy, identity, data residency
- Microsoft integration — Power Platform, SharePoint Embedded, M365 Copilot, Azure AI Foundry
- Operational governance — audit, compliance, ethical walls, matter-level permissions
- Secure AI systems — grounding, retrieval, agent frameworks, human-in-the-loop controls

**Headshot**: `/images/bylines/platform-engineering-lead.jpg` (drop the file at this path)
**LinkedIn**: `<TBD — confirm with team>`
**Short bio (≤ 280 chars)** — for tweet-length attribution:
Architecture byline reserved for a Spaarke platform engineering lead. Pieces in this voice currently run under the organizational byline pending the role being named.

---

## 4. Adding a new byline

1. Add an entry in §3 of this file: full name, role, slug, status, bio, topic areas, headshot path, LinkedIn URL, and short bio.
2. Drop the headshot at `/images/bylines/<slug>.jpg`.
3. The slug becomes valid for `byline:` in briefs and `author:` in MDX frontmatter — no other registry to update.
4. Reassign the relevant `calendar.md` rows from `byline: tbd` to the new slug.
5. Link the byline's LinkedIn URL from any LinkedIn syndication of pieces published under that name.

---

## 5. Calendar bylines status

Three calendar rows are currently `byline: tbd`, pending the two TBD entries above being named: `billing-compliance-intelligence` (white paper, June; practitioner byline), `document-management-is-becoming-document-intelligence` (blog post, June; architecture byline), and `embedded-ai-vs-bolted-on-ai` (blog post, July; architecture byline). Until the team members are named, these pieces wait or run under the organizational `spaarke` byline if the topic supports it.

---

*Locked 2026-05-07 — see git log for history.*
