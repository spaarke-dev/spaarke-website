# Content type: white paper

This document calibrates the house voice for white-paper drafts. Read it alongside `voice/style-guide.md` (the universal voice rules), `voice/examples/consulting-register.md` (the positive model), `voice/examples/ai-tells.md` (the constructions to find and remove), and `voice/brand-positioning.md`. It adjusts the register for the most formal format Spaarke ships.

---

## 1. Purpose

White papers do three things for Spaarke that no other format does. First, they build authority over the long term: the kind of authority that leads analysts to cite us, legal-ops practitioners to repost us, and committee members to forward our work in meetings we do not attend. Second, they equip sales conversations with reference material that a buyer can hand to a skeptical CFO or CIO without losing credibility. Third, they anchor the quarterly content cadence. One white paper per quarter is the structural commitment that forces an honest, evidence-led examination of a topic that a blog post can only touch.

We do not use white papers as lead magnets, and we do not gate them. A downloadable PDF reads like research and an indexable HTML page reads like a position, so we ship both.

## 2. Length and structure

A white paper has no fixed upper length limit. Length follows the argument and the evidence, as it does for long-form articles (`style-guide.md` §6), and the brief sets the target for each paper. Most papers need at least 2,500 words, because a shorter piece is a long blog post in formal dress. Many papers run between 3,000 and 5,000 words, and a paper whose topic requires more room should take it. Two conditions apply at any length. Every section must advance the argument, so padding is cut. The executive summary must stand alone, because some readers of a long paper stop there.

The required sections, in order, are as follows:

1. **Executive summary**: 200 to 350 words. It compresses the argument, and it stands alone for the GC who reads only this section.
2. **Context and setup**: what is true in the market that makes the argument worth making. Quantitative claims are cited.
3. **Numbered argument sections**: three to five is typical, and a longer paper may need more. Each section is a sub-claim of the thesis with its own evidence. The sections are numbered as well as headed, so that readers and the prose can refer back ("see §3").
4. **Closing section**: 250 to 400 words. It states what follows from the argument for the reader, such as a decision to make, a risk that grows, or a question that remains open. It introduces no new evidence, it does not restate the paper (the executive summary has that job), and it carries no "Conclusion" heading (`style-guide.md` §5, rule 25).
5. **Action steps**: three to five concrete steps that the reader can take this quarter. The steps are diagnostic moves that a competent legal-ops director could run on Monday morning, and none of them is "buy Spaarke."

White papers use more headings than articles do. Each heading states the point of its section in sentence case, so that a reader who scans only the headings can follow the argument (`style-guide.md` §4). Lists, tables, and callouts serve reference material, such as steps, comparisons, and key statistics. The argument itself is carried in paragraphs, and bold lead-in bullets do not carry it (`style-guide.md` §5, rule 26).

## 3. Voice calibration

Defer to `voice/style-guide.md` for the baseline. Sections 4 and 5 of that guide apply in full, including the ban on em dashes and the ban on the constructions listed in `voice/examples/ai-tells.md`. The paper remains operator-grade and is never academic for its own sake. The white-paper-specific calibration is as follows:

- **Cadence**: more formal than a blog post. Paragraphs typically run four to six sentences, each with a topic sentence, development, and evidence, and their length varies with the argument. Short sentences are used only when they carry content, and a one-sentence paragraph appears only as a lead-in to a list, a quotation, or an exhibit.
- **Contractions**: none. Write "do not" and "it is."
- **Byline**: organizational ("Spaarke" or "Spaarke Research") and never a named team member, because the argument is institutional.
- **Pronouns**: the third person and named roles ("the GC," "in-house counsel"). Use the first-person plural sparingly, to mark Spaarke's evidence, positions, and editorial judgment.
- **Evidence**: the style-guide rule "no claims without a defense" is absolute in a white paper.

## 4. Citation style

**House style: footnotes, numbered sequentially and listed at the end of the paper under "Sources."** Inline parenthetical citations are reserved for the few cases in which the source is the subject of the sentence ("CLOC's Core 12 framework"). When a statistic carries the argument, the sentence also names the source, the instrument, the year, and the sample where it matters, and the following sentence interprets the number (`style-guide.md` §3). The footnote then holds the full reference.

Acceptable sources, in rough order of preference, are peer-reviewed or government data; established industry research (CLOC, ACC, BTI, Thomson Reuters Institute, Gartner, Forrester); reputable trade publications (Law.com, Artificial Lawyer, ACC Docket); and vendor research, which is acceptable only when the methodology is published. Unsourced numbers and "studies show" are disqualifying.

The citation minimum is eight distinct sources for a 3,000-word paper. A paper needs more if it is longer or if the argument leans on data.

## 5. Visual treatment

- **Diagrams** are welcome and often required. The Legal IQ stack, the five capability modules, and the deployment topology are easier to argue with a diagram than with prose. Consult the existing Spaarke diagram library before commissioning new art.
- **Callout boxes** present key statistics, with a maximum of one per section. A callout draws the eye of a reader who is scanning, and the prose must still earn the claim.
- **Tables** present comparisons, such as capability matrices and framework alignments. Use them sparingly, because a table with three rows is a list in the wrong format.
- **Exhibits** are cited in the form "(Exhibit 1)" at the end of the sentence that states the finding, and the exhibit's own title states the finding as a full sentence (`style-guide.md` §4).
- **No clip art, no stock photography of suited professionals shaking hands, and no AI-generated diagrams that hallucinate connections.** If we cannot draw something accurately, we do not include it.
- **The cover page** is plain typography over the Spaarke gradient. The title sets the argument, and the subtitle locates it. Hero treatment for the cover and the HTML lead image follows `voice/visual-identity.md`, and the brief's `# Hero graphic` section captures the prompt.

## 6. CTA convention

The CTA is always low-pressure, because a white paper earns trust and does not close a sale.

Acceptable closes:
- A contact line after the final section and outside the argument, where the brief calls for one (`style-guide.md` §5, rule 4).
- "Read the companion blog post: [title]."
- "Download the supporting data appendix."
- A pointer to the next paper in a series.

Unacceptable closes include "Schedule a demo," "Talk to sales," "Get pricing," and "Start your free trial." Any line that moves a reader from research mode to sales mode at the foot of a long paper breaks the contract that the format makes.

## 7. Brief frontmatter

White-paper briefs add the following fields on top of the universal frontmatter (see `spec.md` §6), and T10 builds the brief template from these fields:

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

## 8. Common pitfalls

- **Citation theatre.** The writer footnotes the obvious ("Microsoft 365 is widely used in enterprises¹") to enlarge the sources list. Cite what a reader could contest, and leave common knowledge uncited.
- **The vendor closer.** A paper that argues for category-level change for 3,000 words and then ends with "Spaarke can help" undoes itself. End on the consequence of the argument, and leave the selling to the platform pages.
- **Slogan recitation.** "Built for AI across the lifecycle" name-checked in the middle of a paragraph is filler. Use the positioning to organize the argument, and do not recite it.
- **Academic drift.** Sub-headings numbered to the level of "Section 3.2.1", the phrase "this paper argues," and 80-word topic sentences belong in a journal article. A white paper is written for practitioners.
- **The summary closer.** A final section that restates the paper adds nothing that the executive summary has not already given the reader. Close on consequence.
- **Length as a target.** A paper is as long as its evidence requires. The removal of the fixed cap makes room for topics that need it, and padding is still cut at any length.

## 9. Worked example

**Brief sketch** (hypothetical): *Q3 2026, "OCG enforcement intelligence: closing the gap between policy and practice."*

The audience is `legal-ops-director` (primary) and `corporate-counsel` (secondary). The thesis is that most legal departments enforce OCG terms only after the invoice arrives, and that an intelligence layer that catches violations on the way in pays for itself in two billing cycles. The brief sets the length at 3,200 words. The structure runs in this order: the executive summary (300 words); the context, which describes the gap with BTI 2025 data; §1, where enforcement fails; §2, the four failure modes; §3, what "enforcement intelligence" means architecturally; §4, the implementation pattern; the closing section; and the action steps. The paper carries eleven citations across CLOC, ACC, BTI, Thomson Reuters Institute, practitioner observation, and a critical reading of three vendor papers.

The brief feeds the structure. The four failure modes in §2 are the four supporting claims, the executive summary is straightforward to write once §1 to §4 are tight, and the action steps follow from the pattern in §4. The companion pieces are a 1,400-word blog post that draws on the failure modes and a seven-slide LinkedIn carousel.

---

*Revised 2026-09-21 (consulting register, no em dashes, no fixed length cap), see git log for history.*
