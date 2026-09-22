# Consulting and management-review voice and tone: research notes

Prepared 2026-09-21 for Spaarke. Purpose: a practical guide an AI drafting agent can follow to write long-form legal operations articles in the register of HBR, McKinsey, BCG, Bain, Deloitte Insights, MIT Sloan Management Review, and strategy+business.

House rule reminder: Spaarke bans em dashes. In this file, em dashes appear only inside verbatim quotations from the sources, because section 4 has to show honestly how the sources punctuate. Every sentence written by the researcher avoids them.

## 0. Method, corpus, and limits (read this first)

**Searches run:** 9 successful web searches (HBR contributor guidelines; MIT SMR author guidelines; McKinsey Publishing editorial style; Minto Pyramid and SCQA; MIT SMR guideline wording; strategy+business writers' guidelines; McKinsey action titles and "so what" headings; McKinsey legal and general counsel articles; HBR general counsel articles). Two further searches were refused because the shared session search budget (200 calls) was exhausted, so later discovery relied on index pages, sitemaps, and known URLs.

**Pages fetched and read in full text (raw HTML downloaded and parsed locally, so quotations are checked against the source text):**

| # | Publisher | Title | Date | URL |
|---|---|---|---|---|
| 1 | HBR (official guidance) | Harvard Business Review's Guidelines for Contributors | last updated 2026-06-10 | https://hbr.org/guidelines-for-authors |
| 2 | strategy+business (official guidance) | Writers' Guidelines | undated (page footer ©2026 PwC) | https://www.strategy-business.com/press/writers |
| 3 | MIT SMR (official, editor's letter) | What We Publish, and Why, by Lisa Burrell | 2019-09-10 | https://sloanreview.mit.edu/article/what-we-publish-and-why/ |
| 4 | MIT SMR (official) | Author Guidelines page (now a closure notice) | updated 2026-09-09 | https://sloanreview.mit.edu/authors/ |
| 5 | Barbara Minto (primary) | Minto Pyramid Principle concept page | undated | https://www.barbaraminto.com/ |
| 6 | HBR | Stop Automating Old Processes. Design New Ones Instead. (Shunko, Netessine) | 2026-09-14 | https://hbr.org/2026/09/stop-automating-old-processes-design-new-ones-instead |
| 7 | HBR | The Hidden Costs of Monitoring Employees with AI (Friebel) | 2026-09-17 | https://hbr.org/2026/09/the-hidden-costs-of-monitoring-employees-with-ai |
| 8 | HBR | Research: The True Cost of Corporate Scandals? Talent. (Briscoe, DesJardine) | 2026-09-21 | https://hbr.org/2026/09/research-the-true-cost-of-corporate-scandals-talent |
| 9 | HBR | Points of Law: Unbundling Corporate Legal Services to Unlock Value (Ertel, Gordon) | 2012-07 (July to August 2012 magazine) | https://hbr.org/2012/07/points-of-law-unbundling-corporate-legal-services-to-unlock-value |
| 10 | HBR | How the CFO and General Counsel Can Partner More Effectively (Heineman) | 2016-07-25 | https://hbr.org/2016/07/how-the-cfo-and-general-counsel-can-partner-more-effectively |
| 11 | HBR | First, Empower All the Lawyers (Downes) | 2004-12 | https://hbr.org/2004/12/first-empower-all-the-lawyers |
| 12 | HBR | The Rise of the General Counsel (Heineman) | 2012-09-27 | https://hbr.org/2012/09/the-rise-of-the-general-counsel |
| 13 | HBR | The Science of Strong Business Writing (Birchard) | 2021-07 (July to August 2021 magazine) | https://hbr.org/2021/07/the-science-of-strong-business-writing |
| 14 | HBR | Bad Writing Is Destroying Your Company's Productivity (Bernoff) | 2016-09-06 | https://hbr.org/2016/09/bad-writing-is-destroying-your-companys-productivity |
| 15 | HBR | How to Improve Your Business Writing (O'Hara) | 2014-11-20 | https://hbr.org/2014/11/how-to-improve-your-business-writing |
| 16 | Deloitte Insights | How the right mix of C-suite leadership can drive outsized AI returns | 2025-12-17 | https://www.deloitte.com/us/en/insights/topics/digital-transformation/c-suite-leadership-ai-returns.html |
| 17 | Deloitte Insights | How will AI agents fit into the human workplace? | 2026-09-09 | https://www.deloitte.com/us/en/insights/topics/technology-management/ai-agents-human-workplace.html |
| 18 | Deloitte Insights | The $9 trillion knowledge exodus (Cahana, Siegel) | 2026-06-17 | https://www.deloitte.com/us/en/insights/topics/talent/knowledge-management-plan.html |
| 19 | Deloitte Insights | The next tech infrastructure advantage is intelligence orchestration | 2026-08-20 | https://www.deloitte.com/us/en/insights/topics/technology-management/enterprise-ai-control-plane.html |
| 20 | Bain & Company | Corporate Legal Eagles Start to Embrace Artificial Intelligence | 2019-02-05 | https://www.bain.com/insights/corporate-legal-eagles-start-to-embrace-artificial-intelligence/ |
| 21 | Bain & Company | How to Architect for Agentic AI | 2026-05-29 | https://www.bain.com/insights/how-to-architect-for-agentic-ai/ |
| 22 | MIT SMR | When Not to Use AI (Laker) | 2026-03-30 | https://sloanreview.mit.edu/article/when-not-to-use-ai/ |
| 23 | MIT SMR | Auditing Algorithmic Risk (O'Neil, Appel, Tyner-Monroe) | 2024-06-11 | https://sloanreview.mit.edu/article/auditing-algorithmic-risk/ |
| 24 | MIT SMR / BCG | Responsible AI Means Knowing the Limits of Agent Autonomy | 2026-09-08 | https://sloanreview.mit.edu/article/responsible-ai-means-knowing-the-limits-of-agent-autonomy/ |
| 25 | strategy+business | Why do large projects go over budget? | 2023-06-19 | https://www.strategy-business.com/article/Why-do-large-projects-go-over-budget |
| 26 | strategy+business | Power moves (interview with Michael Pollitt) | 2026-02-11 | https://www.strategy-business.com/article/Power-moves |
| 27 | Slideworks (secondary, ex-McKinsey and ex-BCG authors) | How to Write Slide Action Titles Like McKinsey | 2023-06-05, updated 2023-09-20 | https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey |
| 28 | Tom Spencer blog (secondary, guest author Jason Oh) | Guide for Effective Writing | 2021-06-21 | https://www.spencertom.com/2021/06/21/guide-for-effective-writing/ |
| 29 | Management Consulted (secondary, training vendor) | SCQA Framework | 2022-09-20, modified 2026 | https://managementconsulted.com/scqa-framework/ |

**Read only through the fetch tool's summarizer (quotes NOT independently checked, treat as medium confidence):** BCG, "Are You Generating Value from AI? The Widening Gap," 2025-09-30, https://www.bcg.com/publications/2025/are-you-generating-value-from-ai-the-widening-gap ; ModelThinkers, "Minto Pyramid & SCQA," undated, https://modelthinkers.com/mental-model/minto-pyramid-scqa ; Avery Content, "Four ways to achieve McKinsey-style content" (Lois Bennett, dated "Sep 27," year not shown), https://www.averycontent.com/blog/mckinsey-style-content .

**Important limit: McKinsey.com could not be read.** Four requests to mckinsey.com through the fetch tool timed out. I then made one direct download attempt (it never connected) and one attempt through a public reader proxy, which returned an explicit "403 Access Denied." At that point it was clear the site refuses automated access, so I stopped and tried no further routes (no caches, archives, or other proxies). Consequence: there are no verbatim McKinsey Insights or McKinsey Quarterly quotations in this file. McKinsey-specific observations are labeled either "secondary source" or "researcher's prior knowledge, not verified this session." The sibling consulting-firm corpus (Bain, Deloitte, BCG via summarizer) and HBR articles stand in. A human with a browser should spot-check section 3 against three or four McKinsey articles before the guide is treated as final.

**HBR access note:** HBR article pages expose the article text in the page's structured data as one unbroken block. That was enough for openings, closings, sentence-level analysis, and punctuation counts, but paragraph breaks inside HBR articles are not visible in that block, so paragraph-length figures below come from Deloitte, Bain, MIT SMR, and strategy+business only.

---

## 1. What the publications say they want (official guidance)

### 1.1 Harvard Business Review
Source: "Harvard Business Review's Guidelines for Contributors," signed by Amy Bernstein (editor in chief) and Maureen Hoch (editor, HBR.org), last updated 2026-06-10. https://hbr.org/guidelines-for-authors (primary)

- Five qualities: expertise, evidence, originality, usefulness, good writing.
- On the reader. Quote: "The best HBR articles are persuasive and a pleasure to read." The next sentence calls readers "smart, skeptical, and busy" and warns what happens if the problem is unclear or interest is not captured right away. Quote: "they will move on to something else."
- On evidence. Quote: "Referring to supporting research is one good way to do this; describing relevant examples is another."
- On originality. Quote: "One of the most common reasons we turn down proposals is because the findings or prescriptions aren’t surprising."
- On AI. Quote: "The ideas should not be easily replicable by simply asking a large language model (LLM)."
- On usefulness. Quote: "If you can explain your thinking so that a senior leader understands how to apply it in a real situation, that will make it more powerful."
- On promotion: HBR does not publish pieces that "come across as promotional of your products or services."
- The seven pitch questions are a usable pre-draft checklist for any Spaarke brief: central message; what is important, useful, or counterintuitive; what is new; why senior leaders need it and how it applies today; source of authority; research and examples; experience drawn on.
- Note the guidelines page itself uses em dashes (4 in the page body) and semicolons (2).

### 1.2 strategy+business (PwC)
Source: "Writers' Guidelines," undated, ©2026 PwC. https://www.strategy-business.com/press/writers (primary)

- The one-sentence register definition. Quote: "We seek clear, accessibly written articles that avoid jargon and approach readers with intelligence, wit, and perspective."
- On readers. Quote: "Our readers are thoughtful and pragmatic, conscious of the role that corporations play in the world at large, and willing to entertain ideas that go beyond conventional wisdom."
- On promotion. Quote: "We decline articles that seek primarily to market a product, consulting practice, or service, or that are limited to a narrow or functional focus."
- Length: 500 to 3,500 words. Advice to would-be authors: read a dozen or more articles first.

### 1.3 MIT Sloan Management Review
Sources: Lisa Burrell (editorial director), "What We Publish, and Why," 2019-09-10, https://sloanreview.mit.edu/article/what-we-publish-and-why/ (primary); author guidelines page, updated 2026-09-09, https://sloanreview.mit.edu/authors/ (primary).

- Three criteria: ideas for an increasingly digital world; evidence-based thinking; accessible frameworks and recommendations.
- Quote: "Rigor is necessary but not sufficient. Our readers are busy, and they seek utility."
- Quote: "Some articles are more why than how."
- On evidence. Quote: "Compelling arguments can draw on lab experiments, field studies, data analysis, deep industry experience, a synthesis of others’ findings, or some combination of those things."
- On endnotes as a credibility signal. Quote: "It’s one of the main reasons we include endnotes in a publication for practitioners."
- Style mechanics (from the search result summary of MIT SMR's endnote style page, https://sloanreview.mit.edu/endnotes/, not fetched): superscript endnotes rather than author-date citations; AP style for body text; Chicago for endnotes.
- **News that affects sourcing:** the author guidelines page no longer carries guidelines. Quote: "MIT Sloan Management Review will cease print publication following the magazine’s fall issue. Our regular digital content will continue through November 2026." The page says a fully digital successor launches "this winter." Detailed MIT SMR author guidance (length, article types) is therefore not retrievable from the primary page as of 2026-09-21. The support-site copy redirects to a login.

### 1.4 Deloitte Insights
Source: "About Deloitte Insights," page modified 2026-08-28. https://www.deloitte.com/us/en/insights/about/about-deloitte-insights.html (primary)
- No public style guidance. Positioning statement only: "proprietary research and deep analysis." Every Deloitte article credits named editors, designers, and knowledge-services staff at the foot, which confirms a professional edit desk behind the prose (seen in item 16, 2025-12-17).

### 1.5 McKinsey
- No primary source reached (see limits above). Secondary: Avery Content (agency blog, year unknown) reports that McKinsey calls the function publishing, not marketing, and staffs it with former journalists. Treat as vendor commentary. https://www.averycontent.com/blog/mckinsey-style-content
- Evidence that practitioners treat McKinsey Quarterly as a style model, from HBR (2014-11-20): a consultant profiled in the piece "began reading business publications, like McKinsey Quarterly, for style." https://hbr.org/2014/11/how-to-improve-your-business-writing
- Same HBR piece, a former McKinsey consultant trained as a lawyer, on the difference between legal and business structure. Quote: "But in business communications, it’s best to start with your conclusion first." This is directly relevant to Spaarke's readers and writers, many of whom were trained in legal writing, which builds to the conclusion.

---

## 2. Structural doctrine: Pyramid Principle, SCQA, answer first, action titles

- **Primary statement of the principle** (Barbara Minto's own site, undated). Quote: "The Minto Pyramid Principle says that your thinking will be easy for a reader to grasp if you present the ideas organized as a pyramid under a single point." https://www.barbaraminto.com/
- Minto's site calls the introduction device the "Situation, Complication, Question Framework (SCQ Framework™)" whose job is "identifying the question in your reader's mind." The popular label SCQA adds the Answer. The 1996 textbook edition supersedes the 1987 book (same source).
- **Working rules as taught in consulting** (secondary, Tom Spencer blog, guest post by Jason Oh, 2021-06-21, https://www.spencertom.com/2021/06/21/guide-for-effective-writing/): start with the answer; group and summarize supporting arguments; order the support logically (inductive grouping is more common in business writing than deductive chains); make each grouping MECE (mutually exclusive, collectively exhaustive). Quote: "The basic case you are making should be comprehensible to someone who just glances through the titles and subtitles of your document."
- **SCQA in one line each** (secondary, Management Consulted, 2022-09-20, https://managementconsulted.com/scqa-framework/): Situation is context the reader already accepts; Complication is what changed or what is going wrong; Question is what the complication forces the reader to ask; Answer is the recommendation. The same source says SCQA frames the introduction while the pyramid organizes the body.
- **Action titles ("so-what" headings)** (secondary, Slideworks, authors ex-McKinsey and ex-BCG, updated 2023-09-20, https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey). Quote: "An action title is the most important point of the slide, formulated as a short, simple sentence." Rules given: under 15 words, never more than two lines, active voice, a takeaway rather than a topic, specific and ideally quantified. The test: a reader who reads only the titles should get the whole argument. Quote: "During our years at McKinsey and BCG, title quality was reviewed as carefully as the analysis itself."
- **How the doctrine shows up in published articles (my observation from the corpus):** the articles rarely use pure deck-style sentence headings. They apply the doctrine in three softer ways: (1) the thesis appears within the first 100 to 250 words; (2) headings are message-bearing phrases or imperatives, not topic labels; (3) exhibit captions are full-sentence action titles. Example of (3), a Bain figure caption (2019-02-05). Quote: "Many AI uses by legal groups have already been proven" https://www.bain.com/insights/corporate-legal-eagles-start-to-embrace-artificial-intelligence/
- **A limit on answer-first** (ModelThinkers, via summarizer, undated): if the reader rejects the top-line answer, the support may go unread, and answer-first can reduce the sense of co-discovery. This is one reason HBR feature articles often delay the thesis by two or three paragraphs of scene or tension (see opening patterns in section 6).

---

## 3. Twenty-four teachable traits, each with a real example

Format: trait, instruction for the drafting agent, one verbatim example (30 words or fewer), source, date.

### Structure

**T1. State the thesis early and plainly, in one sentence the reader could repeat.**
Instruction: by the end of the third paragraph the reader must know the claim. Use a plain verb such as recommend, argue, find, or believe.
Quote: "We recommend treating the workflow, not the individual task, as the object of redesign."
HBR, Shunko and Netessine, 2026-09-14. https://hbr.org/2026/09/stop-automating-old-processes-design-new-ones-instead

**T2. Build the introduction as Situation, Complication, (implied) Question, Answer.**
Instruction: open with what the reader already accepts, then turn. The turn is usually one short sentence.
Quote (the turn, after a four-sentence situation paragraph): "That close relationship is being disrupted."
Quote (the answer, two paragraphs later): "Corporations should aim higher."
HBR, Ertel and Gordon, 2012-07. https://hbr.org/2012/07/points-of-law-unbundling-corporate-legal-services-to-unlock-value

**T3. Preview the framework as a counted, parallel list, then deliver it in the same order with the same labels.**
Instruction: "three decisions," "four failure modes," "five steps." Count once, keep the labels identical in the preview, the headings, and the close.
Quote: "This method then asks managers to make three decisions: what should change, where human authority should remain, and how the process should respond when the model is uncertain or wrong."
HBR, 2026-09-14 (same URL as T1).

**T4. Headings carry a message or an instruction, not a topic.**
Instruction: write "Start with capabilities, not channels," never "Capabilities." Three house variants were observed: HBR uses title case and ties headings to the framework ("Decision 2: Decide Where Human Authority Remains"); Deloitte uses sentence case and message phrases; Bain's 2019 piece uses sentence-case gerund phrases ("Turning digital hype into practical reality").
Quote (Deloitte H3): "Start with capabilities, not channels"
Deloitte Insights, 2026-08-20. https://www.deloitte.com/us/en/insights/topics/technology-management/enterprise-ai-control-plane.html
Newer variant: Bain's 2026 piece uses question headings answered in the first sentence beneath them ("Why legacy enterprise systems struggle with agentic AI" followed by "Legacy enterprise systems struggle with agentic AI because..."), which reads as written for AI search extraction. Bain, 2026-05-29. https://www.bain.com/insights/how-to-architect-for-agentic-ai/

**T5. Inside a section, use bold run-in imperatives for parallel recommendations.**
Instruction: each item starts with a two-to-seven-word imperative sentence, then two to five sentences of explanation with one example.
Quote: "Think big. A digital vision should be ambitious, though it can build on prior successes."
Bain, 2019-02-05. https://www.bain.com/insights/corporate-legal-eagles-start-to-embrace-artificial-intelligence/
Also MIT SMR, 2026-09-08. Quote: "Calibrate autonomy according to the stakes, not capabilities." https://sloanreview.mit.edu/article/responsible-ai-means-knowing-the-limits-of-agent-autonomy/

**T6. Open each section with a bridge that names what was just settled and what comes next.**
Instruction: one or two sentences. No "In this section we will."
Quote: "Naming the outcome-producing workflow tells you what to redesign. Deciding where AI stops and human authority begins tells you how to govern the redesign."
HBR, 2026-09-14 (same URL as T1).
A lighter signpost is also acceptable once per article. Quote: "Let’s look first at why corporate legal services have been relatively slow to embrace the disruptive change that’s in the air." HBR, 2012-07 (same URL as T2).

**T7. Close each section with a compact takeaway sentence.**
Instruction: the last sentence of a section restates the point in fewer than 20 words, often as a balanced pair.
Quote: "The goal of the 4A framework is not to be conservative everywhere. It is to be deliberate everywhere."
HBR, 2026-09-14 (same URL as T1).

### Sentences and paragraphs

**T8. Medium sentences by default, with short declaratives for emphasis.**
Measured on this corpus (researcher's count, automated sentence splitting, so approximate): mean sentence length fell between about 15 and 25 words in 14 of 16 articles; the exceptions were Ben Heineman's 2016 HBR essay (about 30) and the MIT SMR panel report (inflated by long quotations). Eight of nine HBR pieces put 10 to 25 percent of their sentences at eight words or fewer (Heineman: 4 percent). Every article also carried sentences of 30 words or more, from about 1 percent of sentences in MIT SMR's management column to about half in Heineman's essay. The rhythm is long, long, short.
Quote: "People are watching. And when they do not like what they see, they walk."
HBR, Briscoe and DesJardine, 2026-09-21. https://hbr.org/2026/09/research-the-true-cost-of-corporate-scandals-talent

**T9. Paragraphs of roughly 50 to 80 words, three to six sentences, topic sentence first.**
Measured: mean paragraph length 50 to 77 words across Deloitte (three articles), Bain 2019, MIT SMR column, and strategy+business; the MIT SMR panel report ran longer (about 100) because it strings quotations. One-sentence paragraphs appear, but rarely, and only for a pivot or a question.
Quote (a six-word topic sentence that the paragraph then proves): "Governance is one barrier to scaling."
Bain, 2026-05-29. https://www.bain.com/insights/how-to-architect-for-agentic-ai/

**T10. The corrective frame ("not X, but Y") is the signature move. Use it, but ration it.**
Instruction: the publications use it to overturn a default assumption, usually once or twice per section. The 2026 HBR process article uses it more than a dozen times, which is a lot even for HBR. Because the pattern is also a widely recognized marker of machine-written prose, the drafting agent should cap it (suggested: at most one per 400 words, never in consecutive paragraphs) and vary the syntax. That cap is the researcher's recommendation, not a sourced rule.
Quote: "These are not edge cases. They are the work."
HBR, 2026-09-14 (same URL as T1).

**T11. Use a question to pivot, never to pad.**
Instruction: at most one or two per article, placed at the end of the opening or at a section turn, and answered immediately.
Quote: "But how do we know that these systems are working as intended?"
MIT SMR, O'Neil, Appel, Tyner-Monroe, 2024-06-11. https://sloanreview.mit.edu/article/auditing-algorithmic-risk/

**T12. Plain verbs, concrete nouns, contractions where the venue allows, one vivid image at a time.**
Observed: HBR digital pieces, MIT SMR columns, and Bain use contractions freely ("it’s," "don’t," "weren’t"); research-report pieces (HBR's 2026 "Research:" article, Deloitte) mostly write "do not." Metaphors appear once and are not extended.
Quote: "In Lean terms, automating muda merely produces cheaper muda."
HBR, 2026-09-14 (same URL as T1).
Writing-coach support (Bryan Garner, quoted in HBR 2014-11-20): use contractions, replace "-ion" nouns with verbs, cut prepositions. https://hbr.org/2014/11/how-to-improve-your-business-writing

### Evidence, numbers, examples

**T13. Attribute every statistic inline: who, what instrument, how many, when.**
Instruction: source name, study name, sample, and date go in the same sentence as the number. No orphan percentages.
Quote: "BCG’s January 2026 “AI Radar,” surveying 640 CEOs across 16 markets, reports that corporations expect to roughly double AI spending this year, from 0.8% of revenue to about 1.7%."
HBR, 2026-09-14 (same URL as T1).

**T14. Give a number its comparison in the same breath (a base, a peer, or a before and after).**
Quote: "Only 20% to 25% of legal departments use AI in at least one area, according to a LexisNexis survey of legal departments"
(The sentence continues with the comparison: 40 percent in finance and 54 percent in human resources, per Bain surveys.)
Bain, 2019-02-05. https://www.bain.com/insights/corporate-legal-eagles-start-to-embrace-artificial-intelligence/
Number formatting observed: HBR, Deloitte, Bain, BCG, and strategy+business all use numerals with the % sign in running text. MIT SMR spells out a number at the start of a sentence ("Seventy-two percent of our panelists..."), and Deloitte does the same ("Ninety-two percent of surveyed organizations..."). Deloitte writes currency as "US$6.9 trillion." McKinsey's house style spells out "percent" (researcher's prior knowledge, not verified this session).

**T15. Tell the reader what a number does and does not prove.**
Instruction: after an impressive figure, add one sentence of interpretation or limitation. This is where the register earns trust.
Quote: "Those figures demonstrate the scale of the redesigned workflow, not by themselves its business value"
HBR, 2026-09-14 (same URL as T1).

**T16. Disclose method in one or two plain sentences, in the body, early.**
Quote: "Our final sample covers 735 of the largest U.S. public companies over eight years"
HBR, 2026-09-21. https://hbr.org/2026/09/research-the-true-cost-of-corporate-scandals-talent
Deloitte does the same (survey of 550 leaders, April and May 2025, stated in the third paragraph; 2025-12-17). Longer methodology goes in a box or endnote, never in the opening.

**T17. Examples are named, quantified, and short: one paragraph, three beats (situation, action, measured result).**
Instruction: introduce with "Consider," "for instance," or simply the company name. One example per point. Give the result as a before-and-after.
Quote: "Coca-Cola launched a self-service portal that reduced contract-drafting time for many matters from up to 10 hours to around 15 minutes."
Bain, 2019-02-05. https://www.bain.com/insights/corporate-legal-eagles-start-to-embrace-artificial-intelligence/

**T18. When the client cannot be named, anonymize with specifics (sector, region, scale), not with vagueness.**
Quote: "For example, a leading European telecommunications provider consolidated four separate knowledge silos serving 19 million customers across 10,000 contact center agents and 600 retail locations."
Deloitte Insights, Cahana and Siegel, 2026-06-17. https://www.deloitte.com/us/en/insights/topics/talent/knowledge-management-plan.html

**T19. Pair a failure case with a success case and say exactly what differs.**
Quote: "The Deloitte–Wayfair contrast is not about who used AI and who did not. Both did. It is about the scope of the intervention."
HBR, 2026-09-14 (same URL as T1).

**T20. Cite quietly: endnotes or inline attribution, never author-date parentheses and never a literature review.**
Observed: Deloitte and MIT SMR use superscript endnotes (news sources, surveys, papers); HBR attributes inline and keeps citations out of the finished piece (its guidelines require "rigorous citations (though these may not appear in the finished piece)"). For Spaarke, inline attribution plus linked sources is the closest web equivalent.
Quote: "It’s one of the main reasons we include endnotes in a publication for practitioners."
MIT SMR, Burrell, 2019-09-10. https://sloanreview.mit.edu/article/what-we-publish-and-why/

### Stance and voice

**T21. Hedge by scope, not by reflex. Be exact about what is known, then commit.**
Two dialects were observed. HBR authors commit hard and limit scope with a precise qualifier. Quote: "Our research suggests that assumption is wrong." HBR, 2026-09-21. https://hbr.org/2026/09/research-the-true-cost-of-corporate-scandals-talent
Firm-published research hedges more, with "could," "may," "appears to," and "tend to." Quote: "Taken together, these patterns suggest that AI-driven business outcomes peak when decision rights are distributed among complementary leaders." Deloitte Insights, 2025-12-17. https://www.deloitte.com/us/en/insights/topics/digital-transformation/c-suite-leadership-ai-returns.html
The honest-scope sentence is a model worth copying. Quote: "The scenarios that follow are plausible depictions of future states, not forecasts." Deloitte Insights, 2026-09-09. https://www.deloitte.com/us/en/insights/topics/technology-management/ai-agents-human-workplace.html
Guidance for the agent: one hedge per claim at most; put the hedge on the verb ("suggests," "tends to"), never stack ("may potentially help to"). Deloitte's density of "could" and "might" reads as legal caution and is the least attractive feature of that house style; do not imitate it.

**T22. Concede the counterargument in one sentence, then answer it with evidence.**
Quote: "To be sure, AI still gets a lot of hype from vendors and the technology media, but plenty of cases have delivered substantial business value"
Bain, 2019-02-05. https://www.bain.com/insights/corporate-legal-eagles-start-to-embrace-artificial-intelligence/

**T23. Pronouns: "we" for the authors and their evidence, "you" for advice, "leaders" or "organizations" for description. "I" only to establish standing.**
Quote ("we" as experienced authors): "In our experience, behavior change often is more challenging than making the technology work or finding the funds for investment." Bain, 2019-02-05 (same URL as T22).
Quote ("we" taking a position): "It’s our belief that corporate legal departments are in danger of missing an important opportunity." HBR, 2012-07 (same URL as T2).
Quote ("you" as provocation): "Your company’s legal department is broken." HBR, Downes, 2004-12. https://hbr.org/2004/12/first-empower-all-the-lawyers
Observed split: consulting-firm pieces prefer third person ("leaders can begin by examining...") and reserve "you" for headings and closing questions; HBR and MIT SMR columns address "you" throughout. The company's services are never mentioned in the body.

**T24. Refer to exhibits in passing, in parentheses, and let the exhibit title carry the message.**
Observed forms: Deloitte, lower case in parentheses, "(figure 1)"; Bain 2019, "(see Figure 1)"; HBR, in running text, "As shown in exhibit 1, they can:"; BCG, a separate parenthetical sentence "(See Exhibit 1.)" (BCG form via fetch summarizer, medium confidence); McKinsey, "(Exhibit 1)" (researcher's prior knowledge, not verified this session). The sentence before the reference states the finding; the text never says "the chart below shows."
Quote: "The resulting four futures (figure 1) are designed to help leaders imagine the conditions their organizations could face"
Deloitte Insights, 2026-09-09. https://www.deloitte.com/us/en/insights/topics/technology-management/ai-agents-human-workplace.html

### Endings

**T25. End on consequence, not summary. No "Conclusion" heading.**
Instruction: the final section is short (60 to 150 words). It returns to the opening frame, states the stakes, and often closes with a contrasted pair of futures and a last sentence under 20 words. HBR marks the turn with a typographic break (". . .") instead of a heading; Deloitte uses a forward-looking heading ("What’s next for C-suite AI leadership?", "Pressure-testing your strategy for a future you can’t predict").
Quote: "Companies that do that will create better work. Those that do not will simply produce faster messes."
HBR, 2026-09-14 (same URL as T1).
Quote: "Let the machine do the lifting, not the leading."
MIT SMR, Laker, 2026-03-30. https://sloanreview.mit.edu/article/when-not-to-use-ai/
Quote: "In a future crowded with agents, speed to market will matter, but not as much as trust, governance, and human capabilities."
Deloitte Insights, 2026-09-09 (same URL as T24).

**T26. Hand the reader a tool before leaving: a diagnostic question set, a checklist, or a fill-in sentence.**
Quote: "If a pilot cannot name the guardrails that make its primary KPI safe, it is not ready for scaling."
HBR, 2026-09-14 (same URL as T1). The same article ends its body with a fill-in-the-blank sentence for any team proposing a pilot, and an exhibit that gives one diagnostic question per failure mode.

(That is 26 traits. If the guide needs a shorter list, T5, T11, T20, and T26 are the most dispensable; T1, T3, T4, T13, T15, T17, T21, and T25 carry the register.)

---

## 4. Punctuation habits, with an honest account of em dashes

### 4.1 Do these publications use em dashes? Yes, all of them, routinely.
Researcher's counts on the downloaded article text (em dashes per 1,000 words):

| Article | Date | Words | Em dashes | Per 1,000 words |
|---|---|---|---|---|
| MIT SMR, When Not to Use AI | 2026-03-30 | 1,087 | 12 | 11.0 |
| HBR, The Science of Strong Business Writing | 2021-07 | 2,629 | 22 | 8.4 |
| HBR, Heineman on CFO and GC | 2016-07-25 | 1,362 | 9 | 6.6 |
| HBR, Bernoff on bad writing | 2016-09-06 | 929 | 6 | 6.5 |
| s+b, Why do large projects go over budget? | 2023-06-19 | 972 | 6 | 6.2 |
| Deloitte, C-suite leadership and AI returns | 2025-12-17 | 860 | 5 | 5.8 |
| HBR, First, Empower All the Lawyers (abstract-length text) | 2004-12 | 516 | 3 | 5.8 |
| HBR, Hidden Costs of Monitoring Employees with AI | 2026-09-17 | 1,588 | 9 | 5.7 |
| HBR, Stop Automating Old Processes | 2026-09-14 | 2,376 | 11 | 4.6 |
| HBR, Points of Law | 2012-07 | 4,011 | 15 | 3.7 |
| Deloitte, knowledge exodus | 2026-06-17 | 2,816 | 8 | 2.8 |
| HBR, How to Improve Your Business Writing | 2014-11-20 | 1,523 | 4 | 2.6 |
| MIT SMR and BCG panel report | 2026-09-08 | 2,016 | 4 | 2.0 |
| Deloitte, intelligence orchestration | 2026-08-20 | 4,784 | 8 | 1.7 |
| Bain, Corporate Legal Eagles | 2019-02-05 | 1,461 | 2 | 1.4 |
| HBR, The True Cost of Corporate Scandals | 2026-09-21 | 1,756 | 0 | 0.0 |

Reading of the table: typical density is 2 to 7 per 1,000 words, roughly one every 150 to 500 words. The official guideline pages of HBR, MIT SMR, and strategy+business also use them. Typography differs by house: HBR magazine, Deloitte, Bain, and strategy+business set the dash closed; MIT SMR and HBR's digital-only posts of 2014 and 2016 set it with spaces (AP style).

**The useful finding for Spaarke:** one of the newest HBR pieces in the sample (2026-09-21, 1,756 words) contains no em dashes at all and is fully in register. Bain's 2019 legal article has two. So the register does not depend on the mark. The em dash in this genre does four jobs, and each has a clean substitute.

### 4.2 The four jobs and their replacements (real sentences, then restructured)

**Job 1: the inserted aside (a pair of dashes).** Replace with parentheses, or promote the aside to the end after a colon.
- Original: "Their prescription for incumbents—rearchitect before you automate—is exactly right." (HBR, 2026-09-14, https://hbr.org/2026/09/stop-automating-old-processes-design-new-ones-instead)
- Colon: Their prescription for incumbents is exactly right: rearchitect before you automate.
- Parentheses: Their prescription for incumbents (rearchitect before you automate) is exactly right.

**Job 2: the inserted list or gloss.** Replace with parentheses, or with "such as" and commas, or split.
- Original: "When the right leaders—think the chief technology officer, chief financial officer, and chief strategy officer—own certain and share other aspects of technology investment decisions" (Deloitte, 2025-12-17, https://www.deloitte.com/us/en/insights/topics/digital-transformation/c-suite-leadership-ai-returns.html)
- Parentheses: When the right leaders (the chief technology officer, chief financial officer, and chief strategy officer) own certain and share other aspects of technology investment decisions...
- Two sentences: Three leaders matter most: the chief technology officer, the chief financial officer, and the chief strategy officer. When they own certain aspects of technology investment decisions and share others...

**Job 3: the punch or reversal at the end of a sentence.** Replace with a period (two sentences), a semicolon, or a comma.
- Original: "If they cannot complete it, they do not have a transformation project—only a technology experiment." (HBR, 2026-09-14, same URL as above)
- Two sentences: If they cannot complete it, they do not have a transformation project. They have a technology experiment.
- Comma: If they cannot complete it, they do not have a transformation project, only a technology experiment.
- Original: "Falling cost isn’t a reason to surveil—it’s a reason to choose more carefully than ever." (HBR, 2026-09-17, https://hbr.org/2026/09/the-hidden-costs-of-monitoring-employees-with-ai)
- Semicolon: Falling cost isn’t a reason to surveil; it’s a reason to choose more carefully than ever.
- Original: "Governance can't be bolted on after the fact because agents don't just generate outputs—they take actions." (Bain, 2026-05-29, https://www.bain.com/insights/how-to-architect-for-agentic-ai/)
- Two sentences: Governance can't be bolted on after the fact, because agents don't just generate outputs. They take actions.

**Job 4: the trailing elaboration or consequence.** Replace with a comma plus a reduced clause, a new sentence, or "and."
- Original: "Traditionally, big law firms and corporate legal departments have enjoyed a close relationship—one that is based on both trust and regulation." (HBR, 2012-07, https://hbr.org/2012/07/points-of-law-unbundling-corporate-legal-services-to-unlock-value)
- Comma: Traditionally, big law firms and corporate legal departments have enjoyed a close relationship, one based on both trust and regulation.
- Original: "But when the CFO had full decision-making authority, that figure jumped to 42%—meaning these companies were more than two times as likely to outperform on profitability (figure 2)." (Deloitte, 2025-12-17, same URL as above)
- Two sentences: But when the CFO had full decision-making authority, that figure jumped to 42%. Those companies were more than twice as likely to outperform on profitability (figure 2).
- Original: "Those questions reinsert accountability — and accountability sharpens judgment." (MIT SMR, 2026-03-30, https://sloanreview.mit.edu/article/when-not-to-use-ai/)
- Comma: Those questions reinsert accountability, and accountability sharpens judgment.

Verdict: in every case the restructured sentence is at least as clear, and the two-sentence versions are usually stronger because they produce the short declarative the genre likes anyway (T8). Avoid replacing every dash with a comma; that produces run-ons. Decide which of the four jobs the dash was doing, then pick the matching substitute.

### 4.3 Other punctuation habits observed
- **The colon is the workhorse.** It sets up a payoff, a list, or a definition, and it is the natural em-dash substitute. HBR 2026-09-14 uses 20 colons in 2,376 words. Quote: "The lesson is simple: redesign the workflow, not just the task." Capitalization after a colon: MIT SMR, Deloitte, and most HBR text capitalize when a full sentence follows ("Many leaders are already anticipating significant change: In a Deloitte study of senior managers and above"); HBR is not perfectly consistent (the quoted sentence above is lower case). Pick one rule and hold it.
- **The semicolon is alive** in HBR and Bain for balanced clauses and for complex list items. Quote: "Everyone agrees that a human should be in the loop; almost no one specifies what that means." (HBR, 2026-09-14). Bain's 2026 article uses semicolons to end bulleted list items.
- **Serial (Oxford) comma:** used by HBR, Deloitte, MIT SMR, s+b, and Bain in 2026 ("orchestration, governance, and trusted data"). Bain's 2019 piece omitted it ("speed, accuracy and responsiveness"), so Bain's style has changed.
- **Parentheses** are used for abbreviations on first use, exhibit references, and short factual asides, including whole parenthetical sentences. Quote: "(About a third of that is email.)" (HBR, Bernoff, 2016-09-06, https://hbr.org/2016/09/bad-writing-is-destroying-your-companys-productivity)
- **Inline numbered lists** inside a sentence, "(1) ... ; (2) ... ; (3) ... ; and (4) ...", appear in HBR's 2012 legal services article to preview a four-part agenda.
- **Exclamation marks:** none in authorial prose in any of the target-publication articles; the four found are all inside quoted speech or quoted test phrases.
- **Quotation marks for coined terms** on first use only ("nexus skills," "double-hatting" in Deloitte, 2025-12-17), then dropped.
- **En dashes** appear in number ranges and compound modifiers ("1930–31," "fossil fuel–producing"). If the house ban covers only em dashes, ranges can stay; otherwise write "from 1930 to 1931."

---

## 5. What these publications avoid

Sourced from the guidelines:
- **Promotion.** HBR will not publish work that comes "across as promotional of your products or services"; s+b declines "articles that seek primarily to market a product, consulting practice, or service." (URLs in section 1.) In the consulting-firm articles read here, the firm's services never appear in the body; the firm appears only as the source of data ("Deloitte’s 2025 Tech Value Survey found...") and in author bios.
- **Jargon.** s+b: "avoid jargon." Garner's "buzzword blacklist," quoted in HBR (2014-11-20), names "actionable," "core competency," "impactful," and "incentivize."
- **Unsurprising conclusions.** HBR's most common reason for rejection (section 1.1).
- **Ideas a language model could produce unaided.** HBR, 2026-06-10. This is a direct warning for an AI drafting workflow: the differentiating content must come from Spaarke's own data, cases, and point of view.
- **Narrow functional focus** without a strategic frame (s+b). For legal operations this means tying every tactic to enterprise outcomes: risk, cost, speed, and the business's trust in legal.
- **Stereotypes and language that diminishes any group** (HBR).
- **A buried point.** Quote (Garner, in HBR 2014-11-20): "One of the great diseases of business writing is postponing the message to the middle part of the writing"
- **Empty intensifiers and cheerleading.** Bernoff (HBR, 2016-09-06) dissects a CEO memo for four uses of "incredible" in one paragraph. Quote: "All that cheerleading reads like misdirection."
- **Passive constructions that hide the actor.** Quote (Bernoff): "Conversely, inexact and passive language reflects gaps in thinking."

Observed by the researcher in the corpus (absences):
- No heading called "Introduction" or "Conclusion." No "In today's fast-paced world" openings. No dictionary definitions as openers.
- No literature review, no author-date citations, no "this paper contributes."
- No first-person-singular storytelling unless it establishes the right to speak (Friebel's "As a professor of human resources who has specialized in..." in HBR, 2026-09-17).
- No unattributed statistics. No statistics without a date or sample when the authors own the data.
- No exclamation marks, no emoji, no rhetorical-question chains (the maximum seen was three questions in a row, in two openings: Deloitte 2026-09-09 and HBR 2026-09-21).
- No extended metaphors. One image, used once.
- No calls to action to contact the firm inside the article body. Deloitte puts "Continue the conversation" contacts after the article.
- Little bullet-point fragmentation in HBR and MIT SMR: bullets hold parallel items only, and argument stays in paragraphs. Deloitte and Bain 2026 use more bullets and tables.

A caution the agent should know: a secondary consulting blog in this very corpus opens a section with "In this blog post, we will explore..." (Slideworks). That is exactly the register marker that separates vendor blogging from the target publications. Do not write it.

---

## 6. Five model opening patterns (plus two spares)

Each is described as a recipe, with the real opening line.

**O1. The data tension.** Two or three sourced numbers that pull against each other in the first paragraph; the gap is the complication. Then a historical echo to show the problem is structural, then the thesis by paragraph three.
Quote: "Companies are rapidly increasing AI investment, but enterprise returns remain elusive."
HBR, 2026-09-14. https://hbr.org/2026/09/stop-automating-old-processes-design-new-ones-instead

**O2. The received view, then the reversal.** Describe how everyone currently thinks, in short flat sentences that mimic routine; end the paragraph on the hidden assumption; open the next paragraph by overturning it with your evidence.
Quote: "The traditional way companies think about regulatory penalties is almost entirely financial."
Reversal, one paragraph later: "Our research suggests that assumption is wrong."
HBR, 2026-09-21. https://hbr.org/2026/09/research-the-true-cost-of-corporate-scandals-talent

**O3. The named scene.** A real person with a concrete operating problem and a decision that defies the obvious answer; about 120 words; then widen to the general management question and the author's standing.
Quote: "Control, he concluded, would cost him more than it would ever save him."
HBR, Friebel, 2026-09-17. https://hbr.org/2026/09/the-hidden-costs-of-monitoring-employees-with-ai

**O4. The direct provocation.** Second person, present tense, a blunt claim about the reader's own organization, escalated over three sentences ("At best... At worst..."), then the turn to opportunity.
Quote: "Your company’s legal department is broken."
HBR, Downes, 2004-12. https://hbr.org/2004/12/first-empower-all-the-lawyers
Use with care for a general counsel audience; it works only if the next sentences show the author understands why.

**O5. The big number and the boardroom question.** One large, sourced, time-bound figure; then the question leaders are asking; then two paragraphs narrowing to the gap between awareness and action, with a second statistic.
Quote: "In boardrooms across America, a question is surfacing with increasing urgency: What happens when the most experienced people retire, and take decades of nearly irreplaceable knowledge with them?"
Deloitte Insights, 2026-06-17. https://www.deloitte.com/us/en/insights/topics/talent/knowledge-management-plan.html

**Spare O6. Classic SCQA.** A full paragraph of agreed situation, a one-sentence complication, new options, the authors' belief, and a numbered agenda. See T2 (HBR, 2012-07).

**Spare O7. The neglected relationship.** "Everyone studies X. What receives far less attention is Y."
Quote: "This critical alliance needs and deserves much greater analysis and application."
HBR, Heineman, 2016-07-25. https://hbr.org/2016/07/how-the-cfo-and-general-counsel-can-partner-more-effectively
Note: Heineman's essay averages about 30 words per sentence and is the stiffest prose in the sample. Borrow the move, not the sentence length.

**Spare O8. The plain question.** Quote: "Why does artificial intelligence drive bigger returns in some organizations than in others?" Deloitte Insights, 2025-12-17. https://www.deloitte.com/us/en/insights/topics/digital-transformation/c-suite-leadership-ai-returns.html

---

## 7. Tone guidance: confident, measured, specific, collegial

The target reader, in the publications' own words: "smart, skeptical, and busy" (HBR, 2026-06-10); "thoughtful and pragmatic" (s+b); "busy, and they seek utility" (MIT SMR, 2019-09-10). Write to a peer who will check your numbers and who has heard every vendor pitch.

**Confident.** Take a position and use verbs of commitment: we recommend, we find, the lesson is, leaders should. State the claim before the support. Example: "Trust is not a communication campaign. It is an operating design." (HBR, 2026-09-14, https://hbr.org/2026/09/stop-automating-old-processes-design-new-ones-instead). Confidence comes from the evidence that follows, not from adjectives.

**Measured.** Say how far the evidence goes. Concede the best objection once (T22). Interpret your own numbers skeptically (T15). Scope predictions (T21). Example: "And each will acknowledge that this is a work in progress." (HBR, 2012-07, https://hbr.org/2012/07/points-of-law-unbundling-corporate-legal-services-to-unlock-value)

**Specific.** Names, dates, counts, durations, and before-and-after figures in place of adjectives (T13, T14, T17, T18). "from up to 10 hours to around 15 minutes" does the work that "dramatically faster" cannot.

**Collegial.** The author stands beside the reader, looking at the problem, not above the reader. Devices: "in our experience," "let’s look first at," "you," advice framed as questions to ask your own team, and credit to other thinkers by name (the 2026 HBR article credits Michael Hammer and a recent HBR article by other authors before adding its own contribution). s+b asks for "intelligence, wit, and perspective"; a little dry wit is welcome, once or twice per piece ("cheaper muda," "faster messes").

**How this differs from marketing copy:**
| Marketing copy | Target register |
|---|---|
| Benefit claims with superlatives | Claims sized by evidence, with limits stated |
| The company is the hero | The reader's decision is the subject; the firm appears only as a data source |
| Urgency by exhortation ("act now") | Urgency by consequence (what happens to those who do not act, shown with a case) |
| Unattributed or vendor statistics | Statistics with source, sample, and date; third-party and own data distinguished |
| Problem, product, call to action | Situation, complication, answer, how to apply it, stakes |
| Adjectives: powerful, seamless, cutting-edge | Nouns and numbers |
| Ends with a call to contact sales | Ends with a consequence or a tool the reader can use alone |

**How this differs from academic prose:**
| Academic prose | Target register |
|---|---|
| Builds to the conclusion | Conclusion first, or by paragraph three |
| Literature review up front | Prior work credited in a clause, where it is used |
| Hedges stacked for safety | One calibrated hedge per claim |
| Method section | Method in two plain sentences; detail in a note |
| Passive voice, nominalizations | Active voice, named actors |
| Author-date citations | Inline attribution or endnotes |
| Topic headings | Message headings |
| Contribution to theory | What a leader should do on Monday |
| Third person throughout | "We" and "you" |

**Two dialects inside the register, and a recommendation.** HBR and MIT SMR author-driven pieces are warmer, more direct, use "you," and commit harder. Firm-published research (Deloitte above all) is cooler, third person, more hedged, more bulleted, and heavier on proprietary survey data. For Spaarke, a small company writing to expert practitioners, the HBR dialect fits better: a clear point of view, earned with specifics, in a collegial voice. Borrow from the firm dialect only its discipline about exhibits, methodology disclosure, and message headings.

---

## 8. Distinct viewpoints and tensions found

1. **Answer first versus narrative hook.** Minto doctrine and business-writing coaches (Garner) say lead with the conclusion. HBR features often spend two or three paragraphs on a scene or a tension first. Both deliver the thesis inside roughly 250 words. A critique recorded by ModelThinkers is that answer-first can lose readers who reject the headline claim.
2. **Austere advice versus actual practice.** The coaches say short sentences and simple words. The published articles average about 20 words per sentence and regularly run past 30. The real discipline is variation and one idea per sentence, not brevity as such.
3. **Commitment versus caution.** HBR academics state findings flatly; consulting firms wrap the same kind of claim in "could" and "may." Readers notice. The Deloitte sentence "organizations could be up to 88 times more likely" is both hedged and extravagant, which is the worst of both.
4. **Em dashes.** Universal but not essential (section 4). Density varies from 0 to 11 per 1,000 words within the same publication family.
5. **Headings for humans versus headings for machines.** Bain's 2026 article uses question headings with answer-first sentences that restate the question, evidently for AI search. It is efficient for retrieval and noticeably more repetitive to read than Bain's 2019 piece. Spaarke should decide deliberately which reader it is formatting for.
6. **The "not X, but Y" frame.** A hallmark of HBR argument and also a hallmark of machine prose in 2026. The publications get away with it because the X is a real, attributed belief. The agent should only use the frame when it can name who believes X.
7. **LLM-replicable ideas.** HBR's 2026 guideline draws the line explicitly. Voice alone will not make an article fit the genre; original evidence will.

---

## 9. Gaps

- **No McKinsey primary text.** mckinsey.com refused automated access. No McKinsey Insights or McKinsey Quarterly article was read, and no McKinsey editorial or style statement was reached (McKinsey Publishing guides page and About the Quarterly page both timed out). The brief asked for at least eight articles "from McKinsey Insights or McKinsey Quarterly and HBR"; the corpus has eleven HBR articles, four Deloitte, two Bain, three MIT SMR, two strategy+business, and zero McKinsey. McKinsey-specific conventions noted above (spelled-out "percent," "(Exhibit 1)" references) come from the researcher's prior knowledge and need a human spot check.
- **BCG:** only one article, read through a summarizing tool; bcg.com returned 403 to direct download. BCG quotations are unverified. The tool's one offered "em dash sentence" contained no em dash, so its verbatim reliability is doubtful.
- **MIT SMR detailed author guidelines** (length, article types, tone rules) are no longer on the primary page, which now carries the closure notice; the support-site copy requires login.
- **No McKinsey or HBR editor interview** on prose style was found before the search budget ran out. The "analyses by editors or writing coaches" strand is covered by three HBR articles on business writing (Birchard 2021, Bernoff 2016, O'Hara 2014, the last quoting Bryan Garner and MIT's Kara Blackburn) and by ex-consultant secondary sources, none of which analyzes McKinsey Quarterly prose directly.
- **The Pyramid Principle book itself** was not consulted; Minto's site gives only the one-sentence principle. SCQA details come from secondary sources.
- **HBR paragraph lengths** could not be measured (text exposed without paragraph breaks).
- **Sentence statistics are approximate** (regex splitting; headings and table text are mixed into the HBR blocks; the MIT SMR panel piece is distorted by long quotations).
- **Avery Content** article year is unknown; ModelThinkers and barbaraminto.com pages are undated; s+b guidelines are undated.
- **Deloitte Insights has no public style guide**; nothing found for Bain or BCG either.
