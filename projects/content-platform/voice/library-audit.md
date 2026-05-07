# Library audit: existing blog corpus

**Phase**: 0 (T01)
**Scope**: every `.mdx` file in `content/blog/` as of 2026-05-06
**Calibration**: T00 §1 — McKinsey Quarterly, HBR, Stripe blog, Microsoft WorkLab/Fabric, BCG, Thomson Reuters Institute. Operator-grade, structured, plainspoken, analytically defensible — closer to McKinsey/HBR than to startup marketing.

The existing library is a mostly cohesive series under the "Spaarke Team" byline that defines the Legal Operations Intelligence (LOI) category and the IQ Stack (Data → Memory → Inference). Almost every piece is directionally on-voice. The exception is one early launch post predating the LOI thesis that reads in a different register entirely.

---

## Article inventory

| Slug | Date | Title | Persona fit | Voice rating | Notes |
|---|---|---|---|---|---|
| what-is-legal-operations-intelligence | 2026-01-04 | What Is Legal Operations Intelligence? | GC, Legal Ops Director | ✅ | Category-defining piece; concrete opener, taut argument, distinguishes from adjacent categories cleanly. |
| the-iq-stack | 2026-01-11 | The IQ Stack: Data, Memory, Inference | Legal Ops Director, GC | ✅ | Sharpest architectural piece; pithy contrasts ("documents capture outcomes / memory captures negotiation dynamics"). |
| loi-maturity-model | 2026-01-18 | From Reactive to Predictive: How LOI Aligns with Legal Operations Maturity | Legal Ops Director | ✅ | Cites CLOC, ACC, Gartner by name; complements rather than competes; defensible diagnostic. |
| why-we-built-on-microsoft | 2026-01-25 | Why We Built on Microsoft (and Why It Matters for Legal) | CIO, GC | ✅ | Frames platform choice as governance, not preference; "Operation within Microsoft" line earns its weight. |
| welcome-to-spaarke | 2026-02-01 | Welcome to Spaarke | general | ⚠ | Pre-LOI launch post; "ignite innovation," "spark," generic services list — does not match current voice. |
| your-legal-data-belongs-to-you | 2026-02-01 | Your Legal Data Belongs to You | GC, CIO | ✅ | "Most cannot fully map their own data flows" lands; seven-question checklist is concrete and usable. |
| tenant-dedicated-deployment | 2026-02-08 | Tenant Dedicated Deployment: The New On-Premises | CIO, GC | ✅ | History-of-deployment frame is structured and earned; "structural, not promissory" line is reusable. |
| what-attorneys-need-to-know-about-ai | 2026-02-15 | What Attorneys Need to Know About AI Architecture | GC, attorneys | ✅ | Three-decision frame; concrete scenarios (litigation strategy doc, contracts comparison) instead of abstractions. |
| ai-without-giving-away-the-keys | 2026-02-22 | AI Without Giving Away the Keys | GC, CIO | ◐ | Strong argument; title metaphor a touch breezier than the McKinsey/HBR target; otherwise on-voice. |
| the-ai-readiness-gap | 2026-03-01 | The AI Readiness Gap in Legal Departments | Legal Ops Director, GC | ✅ | "Plausible bad output" is a memorable formulation; sequencing argument is operator-grade. |
| the-20b-blind-spot | 2026-03-07 | The $20B Blind Spot: Why Legal Spend Is Still a Black Box | GC, CFO-adjacent | ✅ | Five structural problems are specific and reinforce each other; CFO-conversation reframe lands. |
| institutional-knowledge | 2026-03-14 | Institutional Knowledge Is Walking Out the Door | Legal Ops Director, GC | ✅ | Four named scenarios (litigator, contract manager, ops lead, IP paralegal) anchor the argument in the concrete. |
| breaking-the-silo | 2026-03-21 | Breaking the Silo Between Legal, Finance, and the Business | Legal Ops Director, GC | ✅ | Cross-functional argument; three concrete scenarios (M&A, Q3 forecast, BU re-negotiating) carry the case. |
| legal-ops-is-not-it-for-lawyers | 2026-03-25 | Legal Ops Is Not IT for Lawyers | Legal Ops Director | ✅ | "COO of the legal function" framing is on-thesis; metrics ladder (cost avoidance, time to insight, predictive accuracy) is sharp. |
| spaarke-for-your-it-team | 2026-03-28 | Spaarke for Your IT Team: Architecture & Deployment Q&A | CIO | ◐ | Reference doc, drier than narrative pieces; ◐ reflects fit-for-purpose, not weakness. |
| spaarke-feature-specification | 2026-03-31 | The Spaarke Platform: Feature Specification | CIO, Legal Ops Director | ◐ | Feature catalog by IQ Stack; structurally disciplined but reads as spec, not thought leadership. ◐ for fit. |

**Counts**: ✅ 12, ◐ 3, ⚠ 1.

The single ⚠ is `welcome-to-spaarke` — a launch announcement written before the LOI thesis solidified. It uses generic services-firm language ("strategic consulting," "innovation workshops") that appears nowhere else in the library and does not match the team's "yes, this is us" calibration. A refresh under the new voice is a Phase 1+ task; the post can be retired or rewritten as a direct introduction to the LOI thesis.

The two ◐ ratings (`spaarke-for-your-it-team`, `spaarke-feature-specification`) are not weak pieces — they are reference documents (IT-evaluation Q&A and a capability catalog), and their drier register is appropriate for that role. They are noted ◐ rather than ✅ because they should not be held up as exemplary thought-leadership prose. They are exemplary *reference material*, a different content-type problem.

The remaining twelve articles form a tightly linked LOI series and consistently hit the calibration target.

---

## Patterns observed

### Recurring strengths across the strong (✅) articles

1. **Opens with a concrete observation, not a generic claim.** The ✅ pieces almost never open with "In today's fast-paced legal environment…" or "AI is transforming legal." They open with a named scene ("Consider the legal department of a Fortune 500 company"), a specific data point (>85% of Fortune 500 on M365; ~20% legal workforce turnover), or a direct provocation ("This is not an article about legal operations. It is an article about business operations…"). The reader is inside the argument by paragraph two.

2. **Two-noun framings carry the argument.** "Data-rich and insight-poor." "Structural, not promissory." "Reactive to predictive." "Functional maturity vs. intelligence depth." "Reporting vs. intelligence." These compressed contrasts let the reader hold the thesis in working memory and let the article relitigate it across sections without losing the through-line. The strongest pieces have at least one such framing in the title or opening paragraph.

3. **Defends category claims with named external frameworks, not vibes.** The library cites by name: CLOC Core 12, ACC Maturity Model 2.0, Gartner's Legal Operations Maturity Model, SimpleLegal/Onit, Wolters Kluwer's 94% data-difficulty stat, the Center for American Progress 100–213% replacement-cost figure, the >50% Copilot-adoption stat. This is the McKinsey/HBR move of grounding new vocabulary inside the existing professional landscape rather than asserting a new category from outside it.

4. **Concrete operational scenarios instead of abstractions.** `institutional-knowledge` opens with four named roles (the litigator, the contract manager, the legal ops lead, the IP paralegal) and what specifically walked out the door with each. `breaking-the-silo` does the same with M&A diligence, Q3 forecasting, and a business unit re-negotiating ground already won. `what-attorneys-need-to-know-about-ai` uses litigation-strategy-document and contracts-comparison scenarios. These specifics convert platitudes into arguments a reader can audit.

5. **Side-by-side language to make a distinction precise.** Name the old/generic version, then the new/grounded version, in parallel sentences. "Generic AI: 'Similar matters typically cost between $200K and $500K.' / IQ Stack Inference: 'Based on 200 similar matters your department has handled, this one will likely cost $280K…'" The same pattern appears in `the-20b-blind-spot` (Reporting vs. Intelligence) and `legal-ops-is-not-it-for-lawyers` ("We processed 4,000 invoices" vs. "We identified $2.1 million in billing anomalies"). One of the library's most reliable rhetorical patterns.

6. **Closes with a pointer to where to go next, not a sales CTA.** The "Where to Go Next" sections link to other library pieces framed by what they answer, not by funnel position. No "Schedule a demo," no "Talk to sales." The closes earn trust by pointing to more substance — which fits the McKinsey/HBR calibration.

7. **Active, declarative sentences with controlled rhythm.** Mostly active voice. Mid-length sentences interrupted by short ones for emphasis ("This is not a hypothesis." "The tool is not the bottleneck. The data architecture is."). One-sentence paragraphs reserved for emphasis after a longer build. Paragraphs typically run 3–5 sentences.

8. **Bolded lead-in phrases organize lists into arguments.** Lists are not bullet dumps. They use the **Bolded phrase.** + plain-language explanation pattern ("**Predictive spend management.** Instead of waiting for invoices to arrive…"). This converts what would be a feature list into a sequence of small arguments — a major reason the spec/feature pieces still read as prose rather than catalog.

### Recurring weaknesses (specific, library-wide)

1. **Marketing-flavored superlatives bleed in.** "Transformative," "categorically different," "the difference is not incremental — it is categorical," and "transforms how legal departments operate" appear in nearly every piece. Once or twice per article they read as earned; when two or three stack inside a section, the writing slides toward the "breathless" register the style guide will want to avoid. The strongest passages prove the claim with a comparison; weaker passages assert it.

2. **The IQ Stack is name-dropped without always earning the reference.** Cross-linking to `the-iq-stack` is part of the series strategy — but several articles invoke "Data → Memory → Inference" or "the flywheel" mid-section as if reciting a creed rather than using it structurally. `the-ai-readiness-gap` and `breaking-the-silo` are strongest because they actually *use* the three-layer frame to organize the argument; weaker passages gesture at it.

3. **Low-entropy series boilerplate at the head and foot of articles.** Most pieces open with a "Throughout this series, we…" or "In our previous article, we introduced…" recap and close with a near-identical "Where to Go Next." The recap-opener buys cohesion at the cost of a flat first paragraph. A McKinsey/HBR-aligned target would spend the first paragraph on the hook of *this* piece and weave the connective tissue into the body.

4. **Consultantisms slip in.** "Strategic value," "compounding intelligence," "the foundation on which X must be built," "operational rigor," and "value creation" recur. Most uses are defensible because they're paired with a concrete consequence — but several paragraphs in the back half of `legal-ops-is-not-it-for-lawyers` and the closes of `the-iq-stack` and `tenant-dedicated-deployment` lean on abstract phrasing where a concrete example would be sharper.

### Voice elements for `voice/style-guide.md` to capture

- Two-noun contrast framings as a default rhetorical move.
- Side-by-side "generic vs. grounded" examples whenever a category claim is introduced.
- Concrete named scenarios (the litigator, the contract manager, the M&A team) rather than abstract roles.
- Named external frameworks (CLOC, ACC, Gartner, etc.) when a structural claim is made.
- Bolded lead-in phrases on lists; one-sentence paragraphs reserved for emphasis.
- "Where to Go Next" closes that point to substance, not funnel.
- Things-we-don't-do, lifted from this library's restraint: no exclamation points, no rhetorical questions in titles, no "Imagine if…" openers, no demo CTAs, no "AI-powered everything," no "transform your legal department."

---

## Recommended source material

Five strongest candidates for `voice/examples/good-articles.md` (T08). Each pointer names paragraphs by landmark sentences so T08 can extract precisely.

### Article: `what-is-legal-operations-intelligence`

- **Why included**: Cleanest example of the category-definition move — opens with a concrete scene, names the structural problem, introduces the new vocabulary, distinguishes it from adjacent categories, and earns the close. If a reader has time for one piece, this is the one that defines the voice.
- **Suggested extracts**:
  - Opening (paragraphs 1–4, "Consider the legal department of a Fortune 500…" through "And it has a name.") — concrete-scene opener and patient setup before naming the new term.
  - "What Legal Operations Intelligence Is" — the three Data/Memory/Inference bullets and the "It is worth distinguishing LOI from adjacent categories…" paragraph — distinguishes a new category from neighbors (legal tech, legal analytics, AI for lawyers) without straw-manning.
  - "Why Now: Three Converging Forces" — opener plus the three bolded sub-points — bolded-lead-in-phrase list carrying argument rather than feature dump.

### Article: `the-iq-stack`

- **Why included**: Tightest architectural piece in the library. Each layer has its own voice (Data is operational; Memory is reflective; Inference is comparative), and "How the Three Layers Compound" is the clearest articulation of the flywheel in the corpus.
- **Suggested extracts**:
  - Layer 2 (Memory), the three "Documents capture outcomes / Documents capture snapshots / Documents are static" contrasts — canonical parallel-construction-with-bold pattern.
  - The "Generic AI vs. IQ Stack Inference" side-by-side in Layer 3 — clearest example of the side-by-side comparison move.
  - "How the Three Layers Compound" — describes a system effect in prose without reaching for "synergy."

### Article: `the-20b-blind-spot`

- **Why included**: Strongest example of a financial argument written for a non-financial reader. The "Reporting vs. Intelligence" contrast in the back half is reusable as a model for any future "what does this actually look like" passage.
- **Suggested extracts**:
  - "The Last Department Without a Dashboard" — grounds a category claim in a comparison the reader already accepts (marketing CAC, procurement variance) before extending it to legal.
  - The five structural problems (fragmented billing, inconsistent coding, manual review, no spend-to-outcome link, benchmark blindness) — list specific enough that each item is independently defensible.
  - "From Reporting to Intelligence" — the cleanest single instance of the side-by-side voice pattern.

### Article: `institutional-knowledge`

- **Why included**: The most concrete piece in the library. The four named roles in "The Hidden Cost of Knowledge Loss" do more argumentative work than pages of abstract claims would. The model for writing about people-driven legal-ops problems without being maudlin or generic.
- **Suggested extracts**:
  - The four scenarios in "The Hidden Cost of Knowledge Loss" — concrete operational characters carrying the argument.
  - "Why Documents Are Not Memory," the "documents capture what was decided / memory captures why" passage — definitional distinction inside two parallel sentences.
  - Closing: "The cost is invisible on any single day. Over a decade, it is enormous." — controlled-rhythm close: a long claim followed by a short, declarative landing.

### Article: `the-ai-readiness-gap`

- **Why included**: Cleanest example of the library's argument structure: name the gap, define it precisely, explain why the obvious fix won't work, sequence the right approach, point to the next step. "Plausible bad output" is reusable across the broader content platform.
- **Suggested extracts**:
  - "The Readiness Gap Defined," the five-bullet symptom list — diagnostic specific without being exhaustive.
  - The "AI does not produce intelligence. It produces confident-sounding noise…" through "It is *plausible* bad output" passage — controlled-emphasis voice and willingness to coin a phrase the rest of the argument can use.
  - "Why Tools Alone Will Not Close It" opener: "An AI tool layered on fragmented data gives you fragmented answers — faster." — characteristic single-sentence move: counterintuitive operational truth in one breath.

---

## Notes for downstream tasks

- T02 (style-guide) should treat the ✅ pieces as the corpus to imitate and the ⚠ Welcome post as the corpus to avoid.
- T03 (brand-positioning) can lift the LOI category definition almost directly from `what-is-legal-operations-intelligence` and `the-iq-stack`.
- T04 (audience-personas) is well-supported: the library writes consistently to GCs, Legal Ops Directors, and CIOs and almost never confuses their concerns.
- T08 (examples curation) should mine the five articles above first.
- The taxonomy review (Phase 1) should note that the ⚠ Welcome post uses a flat string-array tag format (`["news", "updates", "company"]`) where the rest of the library uses the structured `organization/function/topic/theme` format. `src/lib/blog.ts` accepts both and routes the flat form into `theme`, but the inconsistency matters for the taxonomy audit.

---

**Audited**: 16. **Counts**: ✅ 12 / ◐ 3 / ⚠ 1.

---

*Locked 2026-05-07 — see git log for history.*
