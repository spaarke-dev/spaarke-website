# Content type: white paper

Calibration for white-paper drafts. Read alongside `voice/style-guide.md` (the universal voice rules) and `voice/brand-positioning.md`. This doc adjusts the dial for the most formal format Spaarke ships.

---

## 1. Purpose

White papers do three things for Spaarke that no other format does. They build authority over the long term — the kind that gets cited back to us by analysts, reposted by legal-ops practitioners, and forwarded inside committees we are not in the room for. They equip sales conversations with reference material a buyer can hand to a skeptical CFO or CIO without losing credibility. And they anchor the quarterly content cadence: one white paper per quarter is the structural commitment that forces an honest, evidence-led look at a topic the blog can only graze.

White papers are not lead magnets. We do not gate them. The argument is that downloadable PDFs read like research, indexable HTML reads like a position. We ship both.

## 2. Length and structure

Target: 2,500–5,000 words. Sweet spot ~3,500. Below 2,500, the format is a long blog post wearing a tie; above 5,000, the reader stops at the executive summary.

Required sections, in order:

1. **Executive summary** — 200–350 words. The argument compressed. Stands alone for the GC who reads only this section.
2. **Context / setup** — what's true in the market that makes the argument worth making. Cited where claims are quantitative.
3. **Numbered argument sections** — 3–5 of them. Each is a sub-claim of the thesis with its own evidence. Numbered (not just H2'd) so readers and the prose can refer back ("see §3").
4. **Conclusion** — 250–400 words. Restates the thesis with the weight of the evidence behind it. No new claims.
5. **Action steps** — 3–5 concrete steps the reader can take this quarter. Not "buy Spaarke." Diagnostic moves a competent legal-ops director could run on Monday morning.

Heavy use of headings, lists, and callouts is expected. White papers reward scanning.

## 3. Voice calibration

Defer to `voice/style-guide.md` for the baseline. White-paper-specific calibration:

- **Cadence**: more formal than blog. Paragraphs 4–6 sentences (vs. 3–5 for blog).
- **Byline**: organizational ("Spaarke" or "Spaarke Research") — never a named team member. The argument is institutional.
- **Pronouns**: third-person and named roles ("the GC," "in-house counsel"). First-person plural sparingly, to mark editorial judgment.
- **Evidence-led**: the style-guide rule "no claims without a defense" is absolute here, not aspirational.

Still operator-grade — never academic for academic's sake.

## 4. Citation style

**House style: footnotes, numbered sequentially, listed at the end of the paper under "Sources."** Inline parenthetical citations are reserved for the few cases where the source is the subject of the sentence ("CLOC's Core 12 framework").

Acceptable sources, in rough order of preference: peer-reviewed or government data → established industry research (CLOC, ACC, BTI, Thomson Reuters Institute, Gartner, Forrester) → reputable trade publications (Law.com, Artificial Lawyer, ACC Docket) → vendor research only when the methodology is published. Unsourced numbers and "studies show" are disqualifying.

Citation count minimum: 8 distinct sources for a 3,000-word paper. More if the argument leans on data.

## 5. Visual treatment

- **Diagrams** are welcome and often required. The Legal IQ stack, the five capability modules, deployment topology — these are easier to argue with a diagram than with prose. Reference the existing Spaarke diagram library before commissioning new art.
- **Callout boxes** for key statistics. One per section, max. Pulls the eye for the scanner; the prose still has to earn the claim.
- **Tables** for comparisons (capability matrices, framework alignments). Use sparingly — a table with three rows is a list pretending to be a table.
- **No clip-art, no stock photography of suited professionals shaking hands, no AI-generated diagrams that hallucinate connections.** If we can't draw it accurately, we don't include it.
- Cover page is plain typography over the Spaarke gradient. Title sets the argument; subtitle locates it. Hero treatment for the cover and the HTML lead image follows `voice/visual-identity.md`; the brief's `# Hero graphic` section captures the prompt.

## 6. CTA convention

Low-pressure, always. White papers earn trust; they do not close.

Acceptable closes:
- "Talk to our team."
- "Read the companion blog post: [title]."
- "Download the supporting data appendix."
- A pointer to the next paper in a series.

Unacceptable: "Schedule a demo," "Get pricing," "Start your free trial." Anything that snaps a reader from research-mode to sales-mode at the bottom of a 3,500-word piece breaks the contract the format makes.

## 7. Brief frontmatter

White-paper briefs add the following fields on top of the universal frontmatter (see `spec.md` §6):

```yaml
---
type: white-paper
executive_summary_length: 300       # target words for the exec summary
citation_count_minimum: 8           # floor; more if the topic warrants
companion_pieces:                   # blog posts / LinkedIn posts that ship alongside
  - blog: <slug>
  - linkedin: <slug>
sources_in_scope:                   # named sources the brief commits to using
  - CLOC Core 12
  - ACC Maturity Model 2.0
diagrams_required: [iq-stack, deployment-topology]
download_asset: pdf                 # pdf | html-only | both
---
```

T10 builds the brief template from these fields.

## 8. Common pitfalls

- **Citation theatre.** Footnoting the obvious ("Microsoft 365 is widely used in enterprises¹") to bulk the sources list. Cite what's contestable, not what's wallpaper.
- **The vendor closer.** A paper that argues for category-level change for 3,000 words and then ends with "Spaarke can help" undoes itself. Land on the argument; let the platform pages sell.
- **Slogan recitation.** "Built for AI across the lifecycle" name-checked mid-paragraph is filler. Use the positioning to organize; don't recite it.
- **Academic drift.** Section 3.2.1 sub-headings, "this paper argues," 80-word topic sentences. Not a journal article.

## 9. Worked example

**Brief sketch** (hypothetical): *Q3 2026 — "OCG enforcement intelligence: closing the gap between policy and practice."*

Audience `legal-ops-director` primary, `corporate-counsel` secondary. Thesis: most legal departments enforce OCG terms after the invoice arrives, not before; the intelligence layer that catches violations on the way in pays for itself in two billing cycles. Length 3,200 words. Structure: exec summary (300 w) → context (the gap, with BTI 2025 data) → §1 where enforcement fails → §2 four failure modes → §3 what "enforcement intelligence" means architecturally → §4 implementation pattern → conclusion → action steps. Eleven citations across CLOC, ACC, BTI, Thomson Reuters Institute, practitioner observation, and a critical read of three vendor papers.

The brief feeds the structure: §2's four failure modes are the four supporting claims; the exec summary writes itself once §1–§4 are tight; the action steps drop out of the §4 pattern. Companions: a 1,400-word blog post pulling the failure modes, and a 7-slide LinkedIn carousel.

---

*Locked 2026-05-07 — see git log for history.*
