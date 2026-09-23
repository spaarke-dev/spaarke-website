# Fact-check notes: consulting-voice-and-tone

Checked 2026-09-21. Method: WebFetch for open pages; for HBR (paywalled to WebFetch) the full `articleBody` was read from the JSON-LD block in the raw HTML fetched with curl, then quotes were string-matched and counts recomputed with a small script. WebSearch budget was exhausted for this session, so every check was done by fetching the URL given in the finding or in the researcher's notes file (`consulting-voice-and-tone.md`). Raw pages cached in `scratchpad/research/fc/`.

Verdict legend: confirmed / corrected / unverified / refuted.

## 1. HBR contributor guidelines — CORRECTED (minor wording)
- URL https://hbr.org/guidelines-for-authors — "Last updated: June 10, 2026". Signed Amy Bernstein (Editor in Chief, HBR) and Maureen Hoch (Editor, HBR.org). Confirmed.
- Five qualities: Expertise, Evidence, Originality, Usefulness, Good writing. Confirmed.
- "Our readers are smart, skeptical, and busy" — exact.
- LLM quote exact: "The ideas should not be easily replicable by simply asking a large language model (LLM)."
- Correction: the page says "One of the most common reasons we turn down proposals is because the findings or prescriptions aren't surprising." The finding's "The most common rejection reason" overstates it. Use "one of the most common".
- Promotional: "We don't publish pieces ... that come across as promotional of your products or services". Confirmed.
- Seven pitch questions: confirmed (WebFetch summary counted seven).

## 2. strategy+business writers' guidelines — CONFIRMED (one gloss flagged)
- URL https://www.strategy-business.com/press/writers — undated, footer "©2026 PwC. All rights reserved."
- Exact quote confirmed: "We seek clear, accessibly written articles that avoid jargon and approach readers with intelligence, wit, and perspective."
- "We consider articles from 500 to 3,500 words long; we are particularly interested in short, "op ed"–style articles..." Confirmed.
- Readers: "thoughtful and pragmatic, conscious of the role that corporations play in the world at large, and willing to entertain ideas that go beyond conventional wisdom." Confirmed.
- Decline sentence: "We decline articles that seek primarily to market a product, consulting practice, or service, or that are limited to a narrow or functional focus." Confirmed.
- Flag: the word "enterprise" does not appear on the page. "Strategic" is defined as "They propose change or action over the long term, for the sake of sustained competitive advantage or to realize other forms of ongoing value." "Enterprise-level" is the researcher's gloss, not s+b's wording.

## 3. MIT SMR "What We Publish, and Why" + authors page — CONFIRMED
- https://sloanreview.mit.edu/article/what-we-publish-and-why/ — Lisa Burrell, editorial director, September 10, 2019.
- Exact: "Rigor is necessary but not sufficient. Our readers are busy, and they seek utility. We pursue cogent ideas with practical upsides..."
- Evidence list: "lab experiments, field studies, data analysis, deep industry experience, a synthesis of others' findings, or some combination of those things." Confirmed.
- Endnotes: "It's one of the main reasons we include endnotes in a publication for practitioners. Another is to allow our expert authors an easy, inobtrusive way of providing scholarly context for readers who want it." Confirmed.
- https://sloanreview.mit.edu/authors/ — confirmed closure notice: "MIT Sloan Management Review will cease print publication following the magazine's fall issue."; "Our regular digital content will continue through November 2026."; "This winter, MIT Sloan will launch a new, fully digital version..."; page revised September 9, 2026. Corroborated by MIT SMR site nav ("Fall 2026 Issue — MIT SMR's final issue").

## 4. Pyramid Principle — CORRECTED (secondary-source details)
- https://www.barbaraminto.com/ — exact quote confirmed. SCQ wording confirmed: "the unique Situation, Complication, Question Framework (SCQ Framework™) for identifying the question in your reader's mind." Note Minto's own site says SCQ, not SCQA.
- Tom Spencer blog: the post is "Guide for Effective Writing" by Jason Oh, June 21, 2021, now at https://www.spencertom.com/2021/06/21/guide-for-effective-writing/ (tomspencer.com.au refuses connections). It covers pyramid, SCQA (it calls C "Conflict"), answer first, MECE. Confirmed.
- Management Consulted: https://managementconsulted.com/scqa-framework/ metadata datePublished 2022-09-20 (modified 2026-06-01). Date confirmed. I did not read the body in detail.
- Slideworks: https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey — "Updated: Sep 20, 2023"; authors Alexandra Hazard Kampmann and Mats Stigzelius. Quote: "Ideally, they should fit within one or max two lines, up to 15 words." Correction: the source says "up to 15 words", not "under 15 words". Stigzelius is billed "Founder, ex-McKinsey consultant"; the site's templates are billed "created by ex-McKinsey, BCG and Bain consultants". I could not confirm that either named author is ex-BCG.
- Bain caption "Many AI uses by legal groups have already been proven" (Figure 2) confirmed.
- "Thesis within about 250 words" is researcher analysis; not independently measured.

## 5. Em dash density / zero-dash HBR article — CONFIRMED (spot-checked)
- https://hbr.org/2026/09/research-the-true-cost-of-corporate-scandals-talent — Forrest Briscoe and Mark DesJardine, datePublished 2026-09-21T12:05:35Z. articleBody: 1,756 words, 0 em dashes, 0 en dashes, 7 colons, 0 semicolons. Exact match to the claim.
- Quote exact: "People are watching. And when they do not like what they see, they walk."
- My recounts: HBR 2014 article 2.6/1,000 (matches the low end claimed); HBR stop-automating 4.6; HBR 2016-07 Heineman 6.6; Bain 2019 2 dashes in ~1,461 body words = 1.4/1,000 (matches); MIT SMR "When Not to Use AI" roughly 9 to 11/1,000 depending on body boundary (consistent with 11.0).
- Spacing: HBR 2026, 2012, 2004, 2016-07, Bain, Deloitte set closed; MIT SMR and HBR digital 2014-11 and 2016-09 set spaced. Nuance: not all older HBR digital posts are spaced (2016-07 Heineman post is closed).
- Not recounted: Deloitte 1.7 to 5.8, s+b 6.2, HBR upper bound 8.4, and the full 16-article set.

## 6. Four jobs of the em dash / HBR example — CONFIRMED
- https://hbr.org/2026/09/stop-automating-old-processes-design-new-ones-instead — Masha Shunko and Serguei Netessine, datePublished 2026-09-14.
- Exact (U+2014, closed): "If they cannot complete it, they do not have a transformation project—only a technology experiment."
- Original of the second example: "Their prescription for incumbents—rearchitect before you automate—is exactly right." (The colon version is the researcher's rewrite, correctly labeled as such.)
- articleBody: 2,376 words, 20 colons, 11 em dashes, 11 semicolons. "20 colons in 2,376 words" exact.
- The four-jobs taxonomy and substitutes are the researcher's own analysis, not a sourced claim.

## 7. Inline statistic attribution — CONFIRMED
- Exact in HBR 2026-09-14: "BCG's January 2026 "AI Radar," surveying 640 CEOs across 16 markets, reports that corporations expect to roughly double AI spending this year, from 0.8% of revenue to about 1.7%." (I verified HBR's sentence, not BCG's underlying report.)
- HBR 2026-09-21 exact: "Our final sample covers 735 of the largest U.S. public companies over eight years".
- Bain 2019 exact: "Only 20% to 25% of legal departments use AI in at least one area, according to a LexisNexis survey of legal departments, compared with 40% in finance and 54% in human resources." Note the source is a LexisNexis survey as reported by Bain; if reused, attribute to LexisNexis via Bain (2019), and note it is seven years old.
- "No orphan percentages in the corpus" and the numeral-style observations are researcher analysis, not checked across all 16 articles.

## 8. Limiting the claim / concession — CONFIRMED
- HBR 2026-09-14 exact: "...correcting 2.5 million product tags and automating 41,000 supplier-support tickets per month. Those figures demonstrate the scale of the redesigned workflow, not by themselves its business value; that value must ultimately be assessed through..."
- Bain exact: "To be sure, AI still gets a lot of hype from vendors and the technology media, but plenty of cases have delivered substantial business value."

## 9. Named, quantified examples — CONFIRMED (one URL gap, one nuance)
- Bain 2019 (Michael Heric and Neal Goldman, 2019-02-05). Coca-Cola quote exact. JPMorgan: "cut up to 360,000 hours of agreement review by lawyers and loan officers each year" — note "up to" and "each year".
- JPMorgan introduced with "for instance"; Liberty Mutual with "Consider how". Nuance: Liberty Mutual runs two paragraphs, not one.
- Deloitte telecom quote confirmed, but it is in a different Deloitte article from any URL in this finding: https://www.deloitte.com/us/en/insights/topics/talent/knowledge-management-plan.html ("The $9 trillion knowledge exodus", Eyal Cahana and Evan Siegel, displayed 18 June 2026). Full sentence: "a leading European telecommunications provider consolidated four separate knowledge silos serving 19 million customers across 10,000 contact center agents and 600 retail locations."
- HBR 2026-09-14 pairs Deloitte Australia (2025 refund over fabricated references) with Wayfair. Confirmed.

## 10. Headings — CORRECTED (date)
- Deloitte heading "Start with capabilities, not channels" confirmed at the given URL. Title confirmed. Date: page displays "21 Aug. 2026"; JSON-LD datePublished is 2026-08-20T18:30:00Z (midnight IST). Cite the displayed date, 21 August 2026.
- HBR heading "Decision 2: Decide Where Human Authority Remains" confirmed.
- Bain 2019 headings: "Still lagging other functions", "Turning digital hype into practical reality"; bold run-ins "Think big.", "Select your battles carefully.", "Think process.", etc. Confirmed.
- Bain 2026 https://www.bain.com/insights/how-to-architect-for-agentic-ai/ datePublished 2026-05-29. Question H2s each answered by a first sentence that restates the question (e.g., "What is agentic AI architecture?" -> "Agentic AI architecture is an enterprise technology design that..."). Confirmed. The "formatted for AI retrieval" reading is the researcher's inference.
- "No article uses Introduction or Conclusion" — true of every page I opened; not checked across all 16.

## 11. Hedging dialects — CORRECTED (dates)
- Deloitte C-suite article: quote exact; "could be up to 88 times more likely to achieve high ROI..." exact. Displayed date is 18 Dec. 2025 (JSON-LD 2025-12-17T18:30Z). Authors: Dhasmana, Kearns-Manolatos, Parveen, Levin, Smith.
- "Our research suggests that assumption is wrong." exact in HBR 2026-09-21.
- "The scenarios that follow are plausible depictions of future states, not forecasts." exact in https://www.deloitte.com/us/en/insights/topics/technology-management/ai-agents-human-workplace.html ; displayed date 10 Sep. 2026 (JSON-LD 2026-09-09T18:30Z).
- The two-dialect generalization and the recommendation are researcher judgment.

## 12. Endings — CONFIRMED (date nuance)
- HBR 2026-09-14 final sentences exact: "Companies that do that will create better work. Those that do not will simply produce faster messes." Preceded by a ". . ." typographic break, no heading. Confirmed.
- "The goal of the 4A framework is not to be conservative everywhere. It is to be deliberate everywhere." exact.
- MIT SMR https://sloanreview.mit.edu/article/when-not-to-use-ai/ (Benjamin Laker, March 30, 2026) closes: "Let the machine do the lifting, not the leading." Confirmed.
- Deloitte agents article closer exact: "In a future crowded with agents, speed to market will matter, but not as much as trust, governance, and human capabilities." It is the last sentence before the Methodology section. Displayed date 10 Sep. 2026, not 9 Sep.

## 13. Opening patterns — CONFIRMED (Deloitte date nuance)
- HBR 2026-09-21 first sentence exact: "The traditional way companies think about regulatory penalties is almost entirely financial." Reversal line at about word 60.
- HBR 2026-09-17 "The Hidden Costs of Monitoring Employees with AI" (Guido Friebel) opens on a named scene: "Linus Arauz operates 10 points of sale across two large airports..."
- HBR Dec 2004 "First, Empower All the Lawyers" (Larry Downes) opens: "Your company's legal department is broken."
- HBR Jul 2012 "Points of Law" (Danny Ertel and Mark Gordon): "That close relationship is being disrupted." at about word 95.
- HBR 2016-07-25 "How the CFO and General Counsel Can Partner More Effectively" (Heineman): "What receives far less attention is that..." Confirmed.
- Deloitte knowledge article opens with US$6.9 trillion to US$9.6 trillion and "In boardrooms across America, a question is surfacing..." Confirmed; displayed date 18 June 2026 (not 17 June).
- Deloitte C-suite article opens: "Why does artificial intelligence drive bigger returns in some organizations than in others?" Confirmed; displayed 18 Dec. 2025.

## 14. Rhythm measurements — CONFIRMED on the subset I recomputed
- My regex recounts (HBR articleBody): stop-automating avg 15.2 words/sentence, 26% <= 8 words, 13 sentences >= 30 words; scandals 16.9, 18%, 11; monitoring 18.0, 17%, 10; 2014 writing guide 19.0, 24%, 15; Bernoff 2016 16.6, 23%, 5; Downes 2004 15.6, 18%, 2; Ertel/Gordon 2012 24.9, 11%, 51; Heineman 2016 27.8, 10%, 24.
- Heineman is the outlier at about 28 (finding says "about 30"; close enough for regex splitting).
- Bain 2019 body paragraphs (19 paras, 1,461 words) mean 76.9 — matches 77. MIT SMR column about 54 to 57 — matches.
- Quote exact. Bernoff is not quoted in the 2014 HBR piece; his advice is in his own HBR article (https://hbr.org/2016/09/bad-writing-is-destroying-your-companys-productivity, 2016-09-06). Garner is in the 2014 piece.
- Deloitte and s+b paragraph means not recomputed.

## 15. Legal-trained writers / McKinsey Quarterly as model — CONFIRMED
- https://hbr.org/2014/11/how-to-improve-your-business-writing — Carolyn O'Hara, 2014-11-20.
- David McCombie, Harvard Law School to McKinsey: "I was getting feedback that I needed to get to the point more quickly." ... "But in business communications, it's best to start with your conclusion first." Exact.
- Tim Glowa, "strategic marketing consultant": "So he began reading business publications, like McKinsey Quarterly, for style." Exact. Note: Glowa is a marketing consultant, not a McKinsey consultant; "practitioners explicitly treat McKinsey Quarterly as a style model" rests on this single case study.
- Garner: "One of the great diseases of business writing is postponing the message to the middle part of the writing". Exact. Buzzword blacklist ("actionable," "core competency," "impactful," "incentivize"), contractions, and replacing -ion words with action verbs all confirmed.

## Cross-cutting issues
1. Deloitte Insights dates: the researcher used JSON-LD UTC timestamps (all T18:30Z), which land one day before the date Deloitte prints on the page. Printed dates: 21 Aug. 2026 (control plane), 18 Dec. 2025 (C-suite), 10 Sep. 2026 (agents), 18 Jun. 2026 (knowledge). Cite the printed dates.
2. HBR guidelines: "one of the most common reasons", not "the most common reason".
3. Slideworks: "up to 15 words", not "under 15 words"; ex-BCG authorship not confirmed for the named authors.
4. s+b: "enterprise-level" is a gloss; the word is not on the page.
5. Everything that is a direct quote was exact on the character level (after normalizing curly quotes).
