# Bylines

This file records who Spaarke pieces are attributed to, the convention that decides which byline goes on which piece, the byline that the published articles use in practice, and the closing contact line.

---

## 1. How bylines work

The default byline on Spaarke pieces is the organization itself. Named bylines apply when the individual's lived experience is the argument: long-form practitioner pieces, LinkedIn posts (which are almost always stronger in a personal voice), and quoted commentary in industry publications. White papers and positioning pieces stay organizational, whereas practitioner essays and first-person operational accounts run under a named byline. The convention is summarized in `spec.md` §7.4, and this file is the active roster.

**What the published articles use.** A local audit on 2026-09-21 (`content-platform/research/2026-09-loi-series/notes/library-audit-local.md`, section 4) found that 18 of the 19 articles in `content/blog/` carry `author: "Spaarke Team"`. The remaining article, `2026-05-11-welcome-to-spaarke`, carries `author: "spaarke"`, and no published article carries a named person. The site prints the `author:` string exactly as it is written (in `src/components/article/ArticleHeader.tsx`, `src/components/PostCard.tsx`, the RSS feed, and the SEO metadata), and it has no lookup from a slug to a display name. "Spaarke Team" is therefore the organizational byline as readers see it, and the welcome article shows a lower-case byline. Earlier versions of this file did not mention the string "Spaarke Team" at all.

**Decision for the current series (September 2026).** For the Legal Operations Intelligence series that is being planned in `content-platform/research/2026-09-loi-series/`, the writer has decided that the byline follows the previous articles. Each article in the series therefore carries `author: "Spaarke Team"`. The named person appears in the closing contact line (section 6), which points to Ralph Schroeder, Founder and CEO.

---

## 2. The `byline:` and `author:` fields

The brief's `byline:` field takes a slug. The accepted values are `spaarke` for the organization and any named slug listed in section 3. Adding a new named byline means adding an entry in section 3 and reassigning the relevant calendar rows from `tbd` to the new slug.

The MDX frontmatter's `author:` field holds the string that the site prints. For the organizational byline that string is "Spaarke Team", which matches the published library. Earlier versions of this file said that `author:` also takes a slug. The site has no slug lookup, so a slug placed in `author:` is printed as the byline, which is how the welcome article came to show "spaarke". It follows that a named byline would need the person's name, written as it should appear, in `author:`. No published article has used a named byline yet, so the rendering on the article page, the index card, and the RSS feed should be checked before the first named piece is published.

---

## 3. Active bylines

Each entry carries a bio of about 80 words, written on-voice for an "About the author" note. No published article carries such a note yet, and the site has no author-bio component, so a bio that is used in an article is written as plain MDX.

### Ralph Schroeder, Founder and CEO
**Slug**: `ralph-schroeder` (used as `byline:` in briefs and in LinkedIn drafts)
**Status**: active

**Bio**:
Ralph Schroeder is the founder and CEO of Spaarke. His work centers on Legal Operations Intelligence, the operational layer above matter and document systems in which data, memory, and inference compound. He argues that legal AI becomes operationally valuable only when it is grounded in a system of record, and that the platform belongs inside the Microsoft tenant that the business already governs. The Spaarke philosophy is AI-directed and human-controlled.

**Topic areas**:
- Legal Operations Intelligence as a category: the Legal IQ stack, the LOI maturity model, and the position of the category relative to matter management and ELM.
- Microsoft-native legal infrastructure: Power Platform, SharePoint Embedded, Outlook, Teams, M365 Copilot, and Azure AI Foundry as one operating layer.
- AI-directed, human-controlled workflows: agentic systems that respect professional judgment.
- The future of legal work, with the emphasis on operating models more than on tools.

**Headshot**: `/images/bylines/ralph-schroeder.jpg` (drop the file at this path)
**LinkedIn**: **TBD — confirm** (with the team)
**Short bio** (280 characters or fewer, for tweet-length attribution):
Ralph Schroeder is the founder and CEO of Spaarke, the Legal Operations Intelligence platform, which is Microsoft-native, AI-directed, and human-controlled.

---

### Future Legal Operations Leader (TBD)
**Slug**: `legal-ops-leader` (used as `byline:` in briefs)
**Status**: placeholder

**Bio**:
This byline is reserved for a practitioner-oriented voice on Spaarke pieces: a legal operations leader who writes about the day-to-day mechanics of legal workflow modernization, billing compliance, intake, collaboration, and service delivery. The role is not yet named. This entry will be populated when the named team member joins. Until then, pieces in this voice are written under the organizational byline.

**Topic areas**:
- Legal workflow modernization: intake, triage, routing, and approvals.
- Billing compliance and the enforcement of outside counsel guidelines.
- Matter intake and the discipline of matter-level collaboration.
- Cross-side collaboration (in-house, outside counsel, and business clients).
- Legal service delivery, meaning how the work runs in practice.

**Headshot**: `/images/bylines/legal-ops-leader.jpg` (drop the file at this path)
**LinkedIn**: **TBD — confirm** (with the team)
**Short bio** (280 characters or fewer, for tweet-length attribution):
Practitioner byline reserved for a Spaarke legal operations leader. Pieces in this voice currently run under the organizational byline until the role is named.

---

### Future Architecture / Platform Engineering Lead (TBD)
**Slug**: `platform-engineering-lead` (used as `byline:` in briefs)
**Status**: placeholder

**Bio**:
This byline is reserved for technical but business-readable writing on Spaarke pieces, covering enterprise architecture, Microsoft integration patterns, operational governance, and secure AI systems. The role is not yet named. This entry will be populated when the named team member joins. Until then, pieces in this voice are written under the organizational byline.

**Topic areas**:
- Enterprise architecture for legal operations: tenancy, identity, and data residency.
- Microsoft integration: Power Platform, SharePoint Embedded, M365 Copilot, and Azure AI Foundry.
- Operational governance: audit, compliance, ethical walls, and matter-level permissions.
- Secure AI systems: grounding, retrieval, agent frameworks, and human-in-the-loop controls.

**Headshot**: `/images/bylines/platform-engineering-lead.jpg` (drop the file at this path)
**LinkedIn**: **TBD — confirm** (with the team)
**Short bio** (280 characters or fewer, for tweet-length attribution):
Architecture byline reserved for a Spaarke platform engineering lead. Pieces in this voice currently run under the organizational byline until the role is named.

---

## 4. Adding a new byline

1. Add an entry in section 3 of this file: full name, role, slug, status, bio, topic areas, headshot path, LinkedIn URL, and short bio.
2. Drop the headshot at `/images/bylines/<slug>.jpg`.
3. The slug becomes valid for `byline:` in briefs, and no other registry needs to be updated. The `author:` value in MDX frontmatter is the display name (section 2).
4. Reassign the relevant `calendar.md` rows from `byline: tbd` to the new slug.
5. Link the byline's LinkedIn URL from any LinkedIn syndication of pieces published under that name.

---

## 5. Calendar bylines status

Three calendar rows are currently `byline: tbd`, because the two placeholder entries in section 3 have not yet been named: `billing-compliance-intelligence` (white paper, June; practitioner byline), `document-management-is-becoming-document-intelligence` (blog post, June; architecture byline), and `embedded-ai-vs-bolted-on-ai` (blog post, July; architecture byline). Until the team members are named, these pieces wait, or they run under the organizational byline if the topic supports it.

---

## 6. The closing contact line

The style guide (section 5, rule 4) allows an author or contact line after the final paragraph, outside the argument, where the brief calls for one. Until September 2026 this file did not define one. The audit found that no published article links to `/contact`, carries a `mailto:` link or a LinkedIn link, or names a person to contact; 15 of the 19 articles end with a `Where to Go Next` heading over internal links.

For the current series, the writer has decided that the closing contact line points to Ralph Schroeder, Founder and CEO. The line follows these conventions:

- It sits after the final paragraph of the article, and after the related-reading links if there are any. It is set apart from the body, for example in italics after a horizontal rule, so that it reads as a note about the article.
- It names the person and the role, and it invites questions or comments about the argument of the article. It carries no offer, and it never uses `Schedule a demo` or `Talk to sales`.
- It is one or two complete sentences, and it contains no em dash.
- It is written as plain MDX in the article body, because the site has no author-bio component.

The contact mechanism was confirmed by the writer on 2026-09-22: the email address ralph.schroeder@spaarke.com and the website https://spaarke.com. Ralph Schroeder's LinkedIn URL remains unconfirmed (section 3) and is not used in the line.

The approved wording:

> *For questions or comments about this article, contact Ralph Schroeder, Founder and CEO of Spaarke, at [ralph.schroeder@spaarke.com](mailto:ralph.schroeder@spaarke.com), or visit [spaarke.com](https://spaarke.com).*

---

*Revised 2026-09-21 (published byline convention, series decision, closing contact line, no em dashes) and 2026-09-22 (contact mechanism confirmed), see git log for history.*
