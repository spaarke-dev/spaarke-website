# Content calendar

Single source of truth for what's planned, drafted, scheduled, and
live across all four content types. Edit this file when a piece
changes state.

Top of file is the current month. Earlier months sit below. Quarter
buckets (e.g., 2026-Q3) hold pieces with a target quarter but no
firm publish date yet.

## 2026-05

| Slug | Type | Publish | Status | Author | Notes |
|---|---|---|---|---|---|
| legal-iq-and-the-future-of-legal-operations | blog-post | 2026-05-19 | brief | rs | Introduces Legal IQ as the operational-intelligence layer; foundational positioning piece |
| legal-ops-after-the-ai-hype-cycle | linkedin-post | 2026-05-20 | brief | rs | Practical observations on the shift from experimentation to operationalization |
| ai-is-moving-from-tools-to-operating-models | blog-post | 2026-05-26 | brief | rs | Why legal AI is evolving beyond drafting assistants into operational orchestration |
| what-legal-departments-actually-need-from-ai | linkedin-post | 2026-05-27 | brief | rs | Legal buyers want operational reliability more than flashy demos |

## 2026-06

| Slug | Type | Publish | Status | Author | Notes |
|---|---|---|---|---|---|
| why-human-in-the-loop-is-a-competitive-advantage | blog-post | 2026-06-02 | brief | rs | Legal organizations will trust AI systems that preserve professional judgment |
| the-problem-with-fragmented-legal-tech | blog-post | 2026-06-09 | brief | rs | Operational fragmentation is now a larger constraint than lack of legal expertise |
| billing-compliance-intelligence | white-paper | 2026-06-16 | brief | tbd | AI-directed billing review and enforcement; practitioner byline (Future Legal Ops Leader) |
| why-microsoft-is-becoming-the-operating-layer-for-legal | blog-post | 2026-06-23 | brief | rs | Strategic importance of Microsoft-native legal infrastructure |
| document-management-is-becoming-document-intelligence | blog-post | 2026-06-30 | brief | tbd | Static repositories evolving into intelligent operational systems; architecture byline |

## 2026-07

| Slug | Type | Publish | Status | Author | Notes |
|---|---|---|---|---|---|
| operational-intelligence-vs-productivity-ai | blog-post | 2026-07-07 | brief | rs | Why workflow intelligence matters more than isolated drafting tools |
| embedded-ai-vs-bolted-on-ai | blog-post | 2026-07-14 | brief | tbd | Why AI systems must be integrated directly into workflows and documents; architecture byline |

## 2026-Q3

| Slug | Type | Publish | Status | Author | Notes |
|---|---|---|---|---|---|
| the-rise-of-ai-directed-legal-workflows | white-paper | 2026-Q3 | brief | rs | Operational architecture for agentic legal systems; target Q3 publish, exact date TBD |
| ai-across-the-engagement | blog-post | 2026-Q3 | idea | rs | The architectural argument for why AI grounding should survive the engagement boundary between in-house and outside counsel. Standalone treatment of the theme introduced in `what-attorneys-need-to-know-about-ai` §Decision Four and woven through `your-legal-data-belongs-to-you` and `tenant-dedicated-deployment`. |
| e-invoicing-and-vida-what-corporate-legal-needs-to-know | blog-post | 2026-Q3 | idea | rs | EU's VAT in the Digital Age (ViDA) directive plus the broader e-invoicing-mandate landscape — operational implications for in-house legal departments. Touched in `spaarke-feature-specification` §Spend & Performance LEDES bullet. |

---

## Idea backlog

Topics flagged during article reviews that are not yet scheduled. Status `idea` rows above are promoted to a publish month when ready. New ideas added below; promote to a dated section when the brief is written.

| Slug | Type | Notes |
|---|---|---|

(Empty — promote ideas from the Q3 idea bucket above as briefs get written, and add new ideas here as they surface during reviews or strategy sessions.)

---

## States

- **brief** — topic identified, brief being written
- **outline** — outline drafted, awaiting approval
- **draft** — draft in progress in `drafts/`
- **review** — draft submitted, edits in progress
- **scheduled** — final, awaiting publish_date
- **published** — live on the channel

## Update protocol

When a piece changes state, edit the row. Use `git commit` with the
commit message format `content: <slug> -> <new state>` so the
calendar has a clear audit trail.

Author column conventions:

- `rs` — Ralph Schroeder (Founder / CEO); strategic and operational
  thought leadership.
- `tbd` — byline not yet assigned; placeholder for the Future Legal
  Operations Leader (practitioner pieces) or the Future Architecture
  / Platform Engineering Lead (technical pieces). Replace with the
  named byline once the team member is in place.
- `spaarke` — organizational byline (default for white papers and
  company posts).

Bootstrap rows are starting positions from `tasks/00-inputs.md` §5.
Refine dates and details as briefs get written.
