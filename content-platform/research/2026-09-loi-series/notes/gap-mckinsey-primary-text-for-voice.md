# Gap fill: McKinsey primary text, measured the way the HBR corpus was measured

Prepared 2026-09-21 for Spaarke, Deliverable 6 (voice guide). Companion to `consulting-voice-and-tone.md`, which read no McKinsey text and marked its McKinsey conventions as unverified prior knowledge.

House rule reminder: Spaarke bans em dashes. In this file em dashes appear only inside verbatim McKinsey quotations. All researcher prose avoids them.

## 0. Method, access route, and limits (read first)

**How the text was obtained. Be aware of this before relying on it.**
- The brief asked for a real browser session or McKinsey PDFs. No browser tool (built-in browser or Chrome extension) was available in this session. A tool search for them returned nothing.
- WebFetch to mckinsey.com timed out again (60 s). One honest attempt with the locally installed Chrome in headless mode, with no user-agent spoofing or stealth flags, was refused by McKinsey's server (`ERR_HTTP2_PROTOCOL_ERROR`). I stopped there and did not try to disguise the client.
- The text was instead read from **Internet Archive (Wayback Machine) snapshots of the McKinsey pages**, downloaded as raw HTML with `curl` using the `id_` (unmodified original) form of the snapshot URL, then parsed locally. The HTML is what McKinsey's server returned to the archive's crawler, so headings, paragraph breaks, footnotes, exhibit labels, and exhibit alt text are all intact. Every quotation below was string-matched by script against the parsed text (54 of 54 matched).
- The WebFetch tool refuses web.archive.org ("unable to fetch"), so none of this went through the summarizer. That is good for quotation accuracy, but it means the route was direct download from a public archive, not the live site. A human with a browser should spot-check three or four quotations against the live URLs before the voice guide is frozen. I expect them to match: the snapshots are recent (April to September 2026).
- WebSearch budget for the session was already exhausted (200 of 200). Discovery was done with nine Wayback CDX index queries (URL-prefix and keyword filters over mckinsey.com paths) in place of web searches.

**Corpus.** Eleven McKinsey pages parsed in full plus one "About" page. Eight form the measured core (all McKinsey Insights or McKinsey Quarterly articles, 2024 to 2026). Three are supplementary and are reported separately because they are a different genre or date.

| # | Key | Title | Published | Genre | Live URL | Snapshot read |
|---|---|---|---|---|---|---|
| 1 | SOAI26 | The state of AI in 2026: On the road to ROI | 2026-08-25 | Global Survey article | https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai | 20260827200648 |
| 2 | SOAI25 | The state of AI in 2025: Agents, innovation, and transformation | 2025-11-05 | Global Survey article | same URL (earlier edition) | 20260422110404 |
| 3 | SIX | One year of agentic AI: Six lessons from the people doing the work | 2025-09-12 | Practice article (QuantumBlack) | https://www.mckinsey.com/capabilities/quantumblack/our-insights/one-year-of-agentic-ai-six-lessons-from-the-people-doing-the-work | 20260422144441 |
| 4 | ORG | The agentic organization: Contours of the next paradigm for the AI era | 2025-09-26 | Practice article (People and Org) | https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/the-agentic-organization-contours-of-the-next-paradigm-for-the-ai-era | 20260512064921 |
| 5 | ADV | Seizing the agentic AI advantage | 2025-06-13 | Long report with foreword and chapter boxes | https://www.mckinsey.com/capabilities/quantumblack/our-insights/seizing-the-agentic-ai-advantage | 20260725193335 |
| 6 | DATA | Charting a path to the data- and AI-driven enterprise of 2030 | 2024-09-05 | McKinsey Quarterly essay | https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/charting-a-path-to-the-data-and-ai-driven-enterprise-of-2030 | 20251020072156 |
| 7 | COO | How COOs maximize operational impact from gen AI and agentic AI | 2025-03-20 | Practice article (Operations) | https://www.mckinsey.com/capabilities/operations/our-insights/how-coos-maximize-operational-impact-from-gen-ai-and-agentic-ai | 20260125071848 |
| 8 | CORP | Gen AI in corporate functions: Looking beyond efficiency gains (covers legal as one of five functions) | 2024-10-23 | Survey-based practice article (Operations) | https://www.mckinsey.com/capabilities/operations/our-insights/gen-ai-in-corporate-functions-looking-beyond-efficiency-gains | 20260410232229 |
| S1 | BX | Blackstone's Legal & Compliance AI transformation started with technology. It succeeded because it put people first | 2026-06-04 (modified 2026-06-08) | Client case study ("How we help clients"), not an Insights article | https://www.mckinsey.com/capabilities/people-and-organizational-performance/how-we-help-clients/blackstones-legal-and-compliance-ai-transformation-started-with-technology | 20260612165212 |
| S2 | LEGAL21 | Four imperatives for the next-generation legal department | 2021-09-01 (outside the 2024 to 2026 window) | Practice article, the only McKinsey Insights article on the legal department found | https://www.mckinsey.com/industries/financial-services/our-insights/four-imperatives-for-the-next-generation-legal-department | 20260412223331 |
| S3 | GBS | Agentic AI and the future of global business services | 2026-08-11 | Podcast transcript (excluded from style averages) | https://www.mckinsey.com/capabilities/operations/our-insights/agentic-ai-and-the-future-of-global-business-services | 20260821165430 |
| A | ABOUT | About the Quarterly | undated | Official positioning page | https://www.mckinsey.com/quarterly/about-the-quarterly | nearest 2026 snapshot (index lists 20260422081544) |

Snapshot URL pattern: `https://web.archive.org/web/<timestamp>/<live URL>`.

Dates come from each page's `datePublished` structured data. Authors are in the structured data too (for example SOAI26: Dan Tinkoff, Lieven Van der Veken, Michael Chui; SIX: Lareina Yee, Michael Chui, Roger Roberts, with Stephen Xu in the bio line).

**What was counted.** Body = paragraphs, list items, and block quotes from after the H1 to before the author bios, including sidebars and "About the research" boxes, excluding author bios, acknowledgments, "edited by" lines, related-article lists, footnote text, and exhibit images. Sentence splitting is by regex, so sentence figures are approximate (same caveat as the HBR measurement). Footnotes were separated out and read on their own.

**On the legal-function topic.** A CDX sweep of mckinsey.com for "general-counsel", "legal", "counsel", "lawyer" and "law-firm" URL keys found no McKinsey Insights article on the legal or general counsel function dated 2024 to 2026. What exists: the 2021 article (S2), the 2026 Blackstone case study (S1), CORP (2024), which surveys legal as one of five corporate functions, and a McKinsey Legal department blog called "In the Balance" whose legal operations posts are dated 2021 to 2023 and are written in a first-person blog voice ("Like many of you, I'm a podcast listener"), which is not the McKinsey Insights register. SIX (2025) uses a legal example throughout (an alternative dispute resolution provider's contract review workflow).

---

## 1. Headline numbers (core eight articles, 24,773 words)

| Article | Words | Em dashes | Per 1,000 | Colons | Semicolons | Parentheses | "percent" | "%" | Mean sentence (words) | % sentences of 8 words or fewer | % of 30 words or more | Mean paragraph (words) | Sentences per paragraph | "we/our/us" per 1,000 | "you/your" per 1,000 | Contractions per 1,000 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SOAI26 (2026-08) | 2,476 | 11 | 4.4 | 6 | 2 | 30 | 45 | 0 | 23.1 | 6.5 | 26.2 | 67.3 | 2.8 | 0.8 | 0.0 | 0.8 |
| SOAI25 (2025-11) | 2,534 | 17 | 6.7 | 15 | 2 | 24 | 28 | 0 | 27.5 | 0.0 | 41.3 | 75.7 | 2.7 | 7.1 | 0.0 | 1.2 |
| SIX (2025-09) | 2,587 | 9 | 3.5 | 5 | 1 | 23 | 2 | 0 | 19.9 | 9.2 | 14.6 | 60.0 | 2.8 | 3.9 | 0.4 | 4.6 |
| ORG (2025-09) | 3,332 | 27 | 8.1 | 14 | 13 | 11 | 10 | 0 | 22.1 | 4.0 | 20.5 | 74.1 | 3.3 | 5.7 | 1.5 | 1.5 |
| ADV (2025-06) | 6,945 | 88 | 12.7 | 49 | 14 | 51 | 21 | 0 | 19.4 | 16.5 | 16.2 | 63.7 | 2.9 | 1.3 | 0.1 | 2.6 |
| DATA (2024-09) | 2,699 | 9 | 3.3 | 5 | 6 | 23 | 4 | 0 | 23.5 | 13.9 | 27.0 | 63.2 | 2.5 | 1.1 | 0.0 | 2.2 |
| COO (2025-03) | 2,804 | 14 | 5.0 | 10 | 3 | 15 | 10 | 0 | 23.2 | 9.9 | 27.3 | 69.6 | 2.9 | 0.7 | 0.0 | 3.6 |
| CORP (2024-10) | 1,396 | 2 | 1.4 | 5 | 0 | 15 | 18 | 0 | 24.5 | 3.5 | 29.8 | 75.5 | 3.0 | 13.6 | 0.0 | 1.4 |
| **Pooled** | 24,773 | 177 | **7.1** (5.0 without ADV; median article 4.7) | 4.4 per 1,000 | 1.7 per 1,000 | 7.8 per 1,000 | **138** | **0** | mean of means 22.9 | | | 60 to 76 | 2.5 to 3.3 | 3.3 | 0.3 | 2.3 |

Supplementary: BX case study 1,135 words, 18 em dashes (15.9 per 1,000), mean sentence 18.1, mean paragraph 46 words, one "%" ("30%+"). LEGAL21 1,716 words, 1 em dash (0.6 per 1,000), mean sentence 21.4, zero contractions, zero "you". GBS podcast transcript 3,127 words, 2.6 em dashes per 1,000, "we" 15.4 and "you" 14.7 per 1,000, contractions 18.9 per 1,000 (spoken register, excluded).

---

## 2. Findings by question

### 2.1 Em dashes: count and substitutes

- **McKinsey uses em dashes routinely.** Every core article has them: 1.4 to 12.7 per 1,000 words, median 4.7, pooled 7.1 (5.0 if the long report ADV is left out). This sits on top of the HBR range already measured (0 to 8.4 in HBR, 11.0 in one MIT SMR column, typical 2 to 7). **There is no McKinsey versus HBR conflict on the em dash: both use it at about one per 150 to 300 words.** Spaarke's ban is a house choice, and it costs nothing in register: CORP (2024-10-23) runs 1,396 words with two dashes and LEGAL21 runs 1,716 words with one.
- **Typography:** always closed, never spaced (0 spaced instances in 177). Same as HBR magazine, Deloitte, and Bain. Em dashes also appear in headings: "Gen AI is everywhere—except in company P&L" (ADV, 2025-06-13).
- **Density tracks genre and author, not house rule.** The highest densities are the two most promotional, exhortatory pieces: ADV (12.7) and the Blackstone case study (15.9). Survey and analytical pieces sit at 1.4 to 6.7. That is a useful observation for an AI drafting agent: high dash density correlates with the sales-adjacent end of McKinsey's output.
- **Jobs the dash does** (133 dash-bearing sentences classified by script, then eyeballed): 43 sentences use a **pair** of dashes for an inserted aside, definition, or list; 90 use a **single** trailing dash, of which about 15 introduce a gloss or list ("—such as", "—from", "—including", "—particularly"), about 19 deliver a reversal or punch ("—but", "—yet", "—not", "—it"), and the rest are trailing elaborations or appositives. These are the same four jobs found in HBR.
  - Paired aside: "However, many companies—particularly smaller ones—have yet to integrate AI deeply across their workflows." (SOAI25, 2025-11-05)
  - Trailing elaboration: "In some cases, they are even retrenching—rehiring people where agents have failed." (SIX, 2025-09-12)
  - Reversal or punch: "This pivot cannot be delegated—it must be initiated and led by the CEO." (ADV, 2025-06-13)
- **What McKinsey itself uses for the same jobs, without a dash** (these are the substitutes to teach the agent, each with a McKinsey example):
  1. **Parentheses, heavily: 7.8 per 1,000 words, more frequent than the em dash.** They carry definitions, "that is" and "such as" glosses, the exact figure behind a rounded one, exhibit references, and whole parenthetical sentences. "Forty percent of respondents from large organizations (those with annual revenues of more than $1 billion) report scaling AI agents, up from 27 percent last year." (SOAI26, 2026-08-25). Also: "About four in ten respondents (37 percent) report that AI has contributed positively to their organizations’ EBIT" (SOAI26).
  2. **The colon (4.4 per 1,000), with a capital letter when a full sentence follows.** "A year into the agentic AI revolution, one lesson is clear: It takes hard work to do it well." (SIX). Lower case follows the colon only when a fragment or list follows ("...five pillars of the enterprise: business model; operating model; governance; ..." in ORG). This rule was consistent across all eight articles (colon plus capital: 71 instances; colon plus lower case: 34, fragments or lists in every case inspected).
  3. **The semicolon (1.7 per 1,000)** for balanced clauses, for series whose items contain commas, and even in a heading where HBR would reach for a dash: "It’s not about the agent; it’s about the workflow" (SIX heading). Also "High performers pursue growth and/or innovation alongside efficiency; they fundamentally redesign workflows" (SOAI26).
  4. **A comma plus an appositive or "such as"**, and **a new short sentence** ("But there’s more to be done." in COO).

### 2.2 "percent" is spelled out: verified

- **138 instances of the word "percent" and zero "%" signs in the running text of the eight core articles.** The prior-knowledge claim in the voice notes is now verified. It also holds in the 2021 legal article.
- Exceptions seen: one "30%+" in the 2026 Blackstone client case study (a different template and looser edit: "the expected reviewer productivity gains of 30%+"), and "%" inside a cited database title in a footnote ("Employment by sector (%)").
- Related number conventions, all verified on the corpus:
  - A number that starts a sentence is spelled out, including with percent: "Forty percent of respondents...", "Thirty-seven percent...", "Sixty-five percent...", "Eight in ten respondents say AI has improved their productivity" (SOAI26).
  - One through ten are spelled out in running text ("ten agent squads", "three to ten years", "two to five people"); 11 and above are numerals ("15 themes", "118 US C-suite executives", "276 senior leaders"). With "percent", money, and exhibit numbers, numerals are always used ("5 percent", "$1 billion"). A script search found no free-standing digit from 1 to 10 outside those cases, dates, and product names.
  - Ranges use "to", never an en dash: "20 to 40 percent", "$2.6 trillion to $4.4 trillion" (ADV). En dashes appear only in compound modifiers ("human–agent", "COO–CIO", "gen AI–related") and in one footnote date range.
  - Proportions are often given as words with the exact figure in parentheses: "Nearly a third of respondents (32 percent)".
  - "gen AI" is defined once, "generative AI (gen AI)", then used throughout (DATA, CORP). "EBIT" is used without definition.
- **Difference from HBR:** HBR, Deloitte, Bain, BCG, and strategy+business all use numerals with the % sign. McKinsey is the outlier. See section 3 for the one-rule recommendation.

### 2.3 Exhibit reference convention: verified and more specific than assumed

- Form: **"(Exhibit 1)" in parentheses, capital E, numeral, at the end of the sentence that states the finding, inside the final period.** "44 percent now report that AI is scaling across their enterprise, up from 38 percent a year ago (Exhibit 1)." (SOAI26). SOAI26 has 17 numbered exhibits and every one is cited this way, in order.
- When an article or a sidebar has only one exhibit, it is **"(exhibit)", lower case and unnumbered**: "Multiagent systems can achieve even more (exhibit)." (COO, 2025-03-20). SIX and both State of AI sidebars do the same.
- The sentence carrying the reference states the insight. The text never says "as the chart below shows" or "see Exhibit 1 for". Mid-sentence placement occurs when the finding is mid-sentence: "the majority are still in the experimenting or piloting stages (Exhibit 1), with approximately one-third reporting..." (SOAI25).
- Sidebars are cited as "(see sidebar “Eval types”)" (SIX); the comma after "sidebar" is inconsistent across articles.
- On the page, each exhibit carries an eyebrow label ("Exhibit 17") and a **full-sentence, message-bearing title** (read from the image alt text): "Larger companies lead the way in scaling AI beyond pilots." (SOAI25). Another: "IT is furthest along the road of active gen AI adoption, while finance may be in pilot purgatory." (CORP). So the action-title doctrine is real and visible, but it lives on the exhibits more consistently than on the section headings.
- **Difference from HBR:** HBR writes "As shown in exhibit 1" in running text; Deloitte "(figure 1)"; Bain 2019 "(see Figure 1)"; BCG "(See Exhibit 1.)" per the summarizer. McKinsey's parenthetical end-of-sentence form is the least intrusive.

### 2.4 Opening paragraph and thesis placement

- **No scene-setting anecdotes.** None of the eight core articles opens on a named person or story (HBR's O3 pattern). The Blackstone case study does, but that is a case study.
- **The thesis is in the first paragraph, often the first sentence, and always inside roughly the first 100 to 300 words.**
  - SIX: the first paragraph is one 19-word sentence that is the thesis: "A year into the agentic AI revolution, one lesson is clear: It takes hard work to do it well."
  - ORG: a three-sentence first paragraph that ends by coining the term: "We call it the agentic organization."
  - COO: a slogan plus colon: "Better, faster, easier, cheaper: That’s the promise of gen AI." The complication arrives in paragraph three with two survey figures, and the answer ("That’s where the COO plays a critical role") with a "First... Second... Third" preview by about word 330.
  - DATA: situation in four sentences, then "At the center of it all is data."
  - SOAI26: situation paragraph, then a one-line turn, "However, enterprise-level financial impact hasn’t followed the same trajectory.", then the so-what in paragraph four: "The experience of a small group of high performers points to a path forward."
  - CORP: thesis in paragraph three: "The potential of generative AI is too great, and the risks too significant, for today’s approach to continue."
- **Survey pieces and reports put a boxed summary before the first paragraph**: "Key takeaways" (SOAI26, seven bullets, each a bold message sentence followed by its numbers), "Key findings" (SOAI25), "At a glance" (ADV). The answer-first doctrine is applied literally: the reader gets the findings before the prose starts.
- **An explicit purpose or roadmap sentence is normal**, which HBR mostly avoids: "this article is intended to help executives think through seven essential priorities" (DATA); "In this article, we share early signals from our work with pioneering companies" (ORG). Method is disclosed in the same zone: "To understand the early lessons, we recently dug into more than 50 agentic AI builds we’ve led at McKinsey, as well as dozens of others in the marketplace." (SIX).
- A typographic habit: the first two to five words of the article and of each sidebar are set as a bold lead-in ("**Nearly a decade** into McKinsey’s survey research..."). It is decoration, not a heading.
- **Difference from HBR:** HBR features often delay the thesis behind two or three paragraphs of scene or tension. McKinsey does not. Both land the thesis within about 250 to 300 words, so one rule can cover both (section 3).

### 2.5 Heading style: sentence case always; message-bearing only in some genres

- **Sentence case without exception**, with a capital after a colon ("Stop ‘AI slop’: Invest in evaluations and build trust with users"). HBR uses title case. Deloitte and Bain match McKinsey.
- **The "McKinsey headings are action titles" claim is only partly true.** Classified across the eight articles:
  - Survey articles use **full-sentence finding headings**: "Use of AI is deepening as organizations move beyond experimentation, with large enterprises leading the way" (SOAI26, 16 words). SOAI26 has eight message headings and two box labels; SOAI25 has seven message headings.
  - The "lessons" article uses **short message or imperative headings**: "Agents aren’t always the answer", "The best use case is the reuse case", "Make it easy to track and verify every step" (SIX).
  - ORG uses **numbered labels at the top level** ("1. Business model", "3. Governance") and **full message sentences at the subhead level**: "Agents control agents through embedded guardrails", "Human accountability and oversight remain".
  - Operations practice articles use **plain labels and gerund phrases**: "Data governance", "Change management", "Mitigating risk", "Ensuring gen AI creates real business value" (COO); "Where we are now", "Efficiency versus effectiveness" (CORP). LEGAL21 uses four gerund headings that repeat its four imperatives word for word.
  - The McKinsey Quarterly essay uses **allusive phrases**: "Everything, everywhere, all at once", "Data leadership: It takes a village" (DATA).
- Headings never say "Introduction". "Conclusion" appears once, in the long multi-chapter report (ADV), not in any article.
- Standard box labels recur: "Key takeaways", "About the research", "About the authors", "Spotlight".

### 2.6 How statistics are attributed (the largest real difference from HBR)

Three distinct McKinsey patterns, all verified:

1. **Own survey data: name the instrument in the text, frame every number as what respondents report, and put sample, dates, and weighting in an "About the research" box.**
   - In text: "The latest McKinsey Global Survey on the state of AI reveals a landscape defined by both wider use" (SOAI25). Numbers are never stated as facts about companies; they are "respondents say their organizations...". Year-over-year comparison is given in the same sentence ("up from 27 percent last year"). Constructed categories are defined inline (AI high performers: EBIT impact of 5 percent or more plus "significant" value, about 6 percent of respondents).
   - In the box at the end: "The online survey was in the field from May 4 to June 8, 2026, and garnered responses from 1,719 participants in 97 nations" and "To adjust for differences in response rates, the data are weighted by the contribution of each respondent’s nation to global GDP." (SOAI26). The 2025 edition uses the identical template: "The online survey was in the field from June 25 to July 29, 2025, and garnered responses from 1,993 participants in 105 nations".
   - Caveats go to footnotes, in plain words: a SOAI26 footnote says the authors rechecked the year-over-year result on "the 552 respondents who completed the survey in both 2025 and 2026".
   - Smaller surveys give the sample inline: "In a recent McKinsey survey of 118 US C-suite executives, only 19 percent said that gen AI increased their company’s revenue by more than 5 percent." (COO). CORP puts it in a sidebar near the top ("We surveyed 276 senior leaders within those functions.") and gives the formal citation in a footnote: "2024 McKinsey Corporate Functions CXO Survey, conducted Apr 10–May 30, 2024, n = 276."
   - A legal-function data point from that survey, usable by the series with attribution to McKinsey's 2024 Corporate Functions CXO Survey (n = 276, April 10 to May 30, 2024, published 2024-10-23): "Customer care, HR, and legal are in the middle of the pack, with around a quarter of respondents actively using the technology."
2. **Own prior research: a light in-text tag plus a footnote.** "Fewer than 10 percent of use cases deployed ever make it past the pilot stage, according to McKinsey research." (ADV). "McKinsey estimates that the technology has the potential to unlock $2.6 trillion to $4.4 trillion in additional value" (ADV). Footnote form: “Title,” McKinsey, Month D, YYYY. Often vague in text ("a recent McKinsey survey", DATA) with the specifics only in the note.
3. **Third-party data: the source is frequently NOT named in the sentence at all. It sits in a numbered footnote.** "Only half of chief data and analytics officers, for example, feel they are able to drive innovation using data." (DATA) carries a footnote reading "Thomas H. Davenport, Randy Bean, and Richard Wang, CDO agenda 2024: Navigating data and generative AI frontiers, AWS, 2023." Likewise "nearly 70 percent of Fortune 500 companies, for example, use Microsoft 365 Copilot." (ADV) is sourced only in a note: "Satya Nadella, “Microsoft Fiscal Year 2025 First Quarter Earnings Conference Call,” Microsoft, October 30, 2024." Footnote format is Author(s), “Article title,” Publisher, Month D, YYYY; reports and databases in plain or italic title, with "accessed Month YYYY" for live data ("Marian L. Tupy and Ronald Bailey, “The changing nature of work,” Human Progress, March 1, 2023.").
4. **Client examples are anonymized with specifics, no source**: "Consider an alternative dispute resolution service provider that was working to modernize its contract review workflows." (SIX); "a global bank"; "One European utility provider... three million customers" (ORG). Experience claims are tagged "In our experience": "In our experience, this helps to virtually eliminate 30 to 50 percent of the nonessential work typically required." (SIX).

**Difference from HBR:** HBR has no footnotes on the page, so it attributes fully inline (who, instrument, sample, date in the sentence). McKinsey has footnotes and an "About the research" box, so its sentences are lighter and sometimes carry no source name. An AI drafting agent told to "write like McKinsey" without footnote infrastructure will produce orphan statistics. See section 3.

### 2.7 Sentence and paragraph length

- **Sentences are longer and flatter than HBR's.** Mean 19.4 to 27.5 words per article (mean of means 22.9) against HBR's 15 to 25. Sentences of 30 words or more make up 15 to 41 percent of each article. Short sentences (eight words or fewer) are 0 to 16.5 percent, typically 4 to 10 percent, against HBR's 10 to 25 percent. SOAI25 has no sentence of eight words or fewer in 92 sentences and a mean of 27.5. The punchiest McKinsey prose is in ADV and the Blackstone case study ("The time for exploration is ending. The time for transformation is now.").
- **Paragraphs average 60 to 76 words but only 2.5 to 3.3 sentences.** The word count matches the Deloitte, Bain, MIT SMR, and s+b range already measured (50 to 77), but McKinsey gets there with fewer, longer sentences. One-sentence paragraphs exist (0 to 11 per article) and are used for a pivot or to introduce a list.
- Sentence-initial "And", "But", "Yet", "So" open 2 to 7.5 percent of sentences, so conjunction openers are allowed but modest.
- Contractions: present in every core article but light (pooled 2.3 per 1,000; 0.8 in SOAI26 up to 4.6 in SIX). LEGAL21 has none. HBR digital pieces use them more freely.
- Hedging is light: "could/may/might" run 0.8 to 5.0 per 1,000 words, and the survey pieces hedge by reporting verb ("respondents report") instead of by modal. Practice articles lean on obligation: "must/should/need to" run up to 5.9 per 1,000 (ADV, DATA) and 7.0 in LEGAL21.
- The corrective frame ("not just X but Y", "rather than", "instead of") appears 0 to 2.4 times per 1,000 words, well below the 2026 HBR process article that used it more than a dozen times. No exclamation marks anywhere. Questions are rare in analytical pieces (0 to 2) and cluster in the exhortatory ones (12 in ADV).

### 2.8 How articles close

- **Short, unheaded, forward-looking synthesis of one or two paragraphs. No "Conclusion" heading in articles** (only in the chaptered report ADV).
- The dominant formula is "the winners will be those that...":
  - "are likely to be those that transform their businesses, not just adopt AI tools." (SOAI26, last sentence, which runs 45 words in full)
  - "we are certain that the organizations that adapt and learn faster will be the early winners in this agentic era" (ORG)
  - "But unless companies approach their agentic programs with learning in mind (and in practice), they’re likely to repeat mistakes and slow their progress." (SIX, a conditional warning)
  - "This is at the heart of the COO’s role, and its future." (COO)
  - "But by sticking to the most important priorities and understanding the essence of the issues facing them, data leaders can navigate a path to a data-driven enterprise." (DATA)
- Variants: ORG closes with a headed how-to section ("How to start the journey") containing three named shifts and a list of first steps before the final paragraph. CORP ends on a three-item bold-imperative list with no paragraph after it. LEGAL21 ends on a summary that restates its four imperatives, which is the move the HBR-based guidance (T25) says to avoid. Survey articles place the "About the research" box after the close.
- After the close come a fixed credit block: author names with role and office, "The authors wish to thank...", and "This article was edited by [name], a senior editor in the [city] office." No sales call to action in six of eight; SIX ends with a demo-request email line for QuantumBlack Labs, and ADV embeds an "About QuantumBlack" box and says "McKinsey has a proven Rewired playbook", so the no-promotion norm is weaker at McKinsey than at HBR.
- **Difference from HBR:** HBR ends on a consequence, often a contrasted pair under 20 words, after a typographic break. McKinsey's closes are blander and longer, with the aphoristic close reserved for reports. Both avoid the summary close in their best pieces.

### 2.9 Use of "we" (and "you")

- **"We", "our", "us" appear in every article, pooled 3.3 per 1,000 words, ranging from 0.7 (COO) to 13.6 (CORP).** "We" always means the authors or the firm in one of four roles:
  1. Researchers: "We surveyed 276 senior leaders within those functions." (CORP); "In every function we asked about" (SOAI26).
  2. Experienced advisers: "In our experience..." (SIX, ORG); "As one business leader told us" (SIX).
  3. Position-takers: "Specifically, we believe that companies should establish structures and processes that enable them to do three things:" (CORP); "we recommend that a legal department understand and categorize which business activities drive the legal workload" (LEGAL21); "We encourage leaders to think through three radical shifts" (ORG).
  4. Coiners of terms: "We call it the agentic organization." (ORG); "We call this the “gen AI paradox.”" (ADV).
- The firm also refers to itself in the third person, sometimes in the same article: "McKinsey’s experience working with early adopters indicates that AI agents can unlock significant value." (ORG); "McKinsey estimates that..." (COO, ADV).
- **"You" is almost absent: 7 instances in 24,773 words (0.3 per 1,000), five of them in one bullet of ORG.** The reader is addressed in the third person by role: "leaders", "companies", "CEOs must", "COOs already know", "data leaders need to", "general counsels should". First person singular does not appear outside quotations.
- **Difference from HBR:** HBR and MIT SMR columns address "you" throughout; McKinsey does not. This is the clearest voice split between the two.

### 2.10 McKinsey's own statement of audience (primary, undated page)

"Our focus is the busy executive: We strive to make our content relevant for all senior leaders, regardless of their industry, role, or geography." (About the Quarterly, https://www.mckinsey.com/quarterly/about-the-quarterly). No public McKinsey style guide was found.

---

## 3. Where McKinsey and HBR conflict, and the single rule to state

| # | Convention | McKinsey (measured here) | HBR (measured earlier) | Recommended single rule for the Spaarke voice guide | Basis |
|---|---|---|---|---|---|
| 1 | Percent | Word "percent", 138 to 0 in running text | Numeral plus % | **Pick one and lint it.** If the guide names McKinsey first, write "percent" with a numeral ("22 percent"), spell out a number that starts a sentence ("Forty percent"), and keep % for tables and charts. If Spaarke already publishes with %, keep % and say so explicitly, because an agent told "McKinsey register" will otherwise drift to "percent". | Verified conflict. The choice is the researcher's recommendation, not a sourced rule. |
| 2 | Numbers one to ten | Spelled out, except with percent, money, exhibit numbers | AP-like, similar | Spell out one through ten; numerals from 11; numerals always with percent and currency; "20 to 40 percent" for ranges (no en dash). | McKinsey verified; no conflict found. |
| 3 | Em dash | Used, closed, median 4.7 per 1,000 | Used, 0 to 8.4 per 1,000 | **No conflict between the models. Spaarke's ban stands as a house rule.** Teach the McKinsey substitutes in this order: parentheses for glosses and exact figures; colon plus capitalized sentence for the payoff; semicolon for the balanced reversal; a new short sentence for the punch. | Verified. Substitutes are McKinsey's own frequent devices. |
| 4 | Capital after colon | Capital if a full sentence follows; lower case for fragments and lists (consistent) | Mostly capital, not fully consistent | Adopt the McKinsey rule as written. | Verified. |
| 5 | Headings | Sentence case always; message sentences in survey and lessons pieces, labels in practice pieces | Title case; tied to framework | **Sentence case, message-bearing, 4 to 12 words**, with a capital after a colon. Do not claim "McKinsey always uses action titles"; say "McKinsey's best pieces do, and its exhibit titles always do." | Verified conflict on case; McKinsey matches Deloitte and Bain. |
| 6 | Exhibit reference | "(Exhibit 1)" at sentence end; "(exhibit)" when only one | "As shown in exhibit 1" in running text | **"(Exhibit 1)" at the end of the sentence that states the finding; "(exhibit)" if there is only one; exhibit title is a full-sentence finding.** | Verified. |
| 7 | Statistic attribution | Own survey named in text, details in a box; third-party sources often only in footnotes | Everything inline: who, instrument, sample, date | **Use the HBR inline rule as the default** (source, instrument, year in the sentence; sample where it matters), because Spaarke mostly cites other people's data and web articles may lack footnotes. Borrow two McKinsey habits: (a) respondent framing, "X percent of respondents say", never "X percent of legal departments are"; (b) for Spaarke's own surveys, an "About the research" box with field dates, n, geography, and weighting. Never leave a number whose source lives only in a footnote. | Verified conflict. Recommendation is the researcher's. |
| 8 | Thesis placement | First paragraph, often first sentence; boxed key takeaways on data pieces; explicit "In this article, we..." roadmap allowed | Often after two or three paragraphs of scene; roadmap rare | **Thesis inside the first 150 words and never later than paragraph three.** Allow one HBR-style scene only if it is under 120 words. For data-heavy pieces, add a "Key takeaways" box of three to seven message sentences with their numbers. Skip "In this article, we will". | Both verified; rule reconciles them. |
| 9 | Pronouns | "We" for authors as researchers, advisers, and position-takers; reader in third person by role; "you" about 0.3 per 1,000 | "We" plus frequent "you" | **"We" for Spaarke's evidence and positions ("we believe", "in our experience", "we recommend"); address readers by role ("general counsel", "legal operations leaders") in analysis; reserve "you" for a closing checklist or diagnostic questions.** This is the McKinsey pattern with one HBR allowance. | Verified conflict. |
| 10 | Sentence length | Mean about 23 words, few short sentences | Mean 15 to 25, 10 to 25 percent short sentences | **Target a mean of 18 to 22 words with at least 10 percent of sentences at eight words or fewer.** McKinsey's flatter rhythm is the weaker model; HBR's long, long, short is more readable and is what the dash-free rewrites produce anyway. | Both measured. Target is the researcher's. |
| 11 | Paragraphs | 60 to 76 words, about three sentences | Not measurable for HBR; sibling firms 50 to 77 | Three to five sentences, 50 to 80 words. No conflict. | Measured. |
| 12 | Close | One or two unheaded paragraphs, "the organizations that... will" formula; sometimes ends on an action list; "Conclusion" only in reports | Consequence, contrasted pair, short last sentence | **No "Conclusion" heading, no summary restatement; end on a consequence in a final sentence under 25 words.** McKinsey's formulaic "winners will be those that" close should be rationed because it is also a machine-prose tell. | Both verified. |
| 13 | Contractions | Light (about 2 per 1,000) | Freer in digital pieces | Allow, sparingly (it's, don't, won't); none in research-report passages. | Measured. |
| 14 | Promotion | Mostly absent, but report-style pieces plug the practice | Absent | Keep the HBR standard: the company appears only as a data source. | Observed. |

---

## 4. Corrections to the earlier voice notes (`consulting-voice-and-tone.md`)

- T14 and section 9: "McKinsey's house style spells out 'percent' (researcher's prior knowledge, not verified)". **Now verified**, 138 to 0 across eight articles from 2024 to 2026.
- T24: "McKinsey, '(Exhibit 1)' (prior knowledge, not verified)". **Verified**, with the added "(exhibit)" single-exhibit form and the end-of-sentence placement.
- T4 and section 2: the implication that McKinsey articles use message headings throughout is **too strong**. True for survey and lessons pieces and for subheads in ORG; false for operations practice articles and the Quarterly essay, which use labels and allusive phrases. Exhibit titles are the consistent home of the action title.
- T13: McKinsey does **not** follow "who, instrument, sample, date in the same sentence". It splits attribution between text, footnote, and an "About the research" box. The T13 rule is an HBR rule and should be labeled as such.
- T23: confirmed for "we"; the observation that consulting-firm pieces "reserve 'you' for headings and closing questions" is, for McKinsey, even stricter: "you" is close to absent.
- T8: add McKinsey as the long-sentence end of the range (mean about 23; one survey article at 27.5 with no short sentences).
- Section 4.1 table: add the eight McKinsey rows from section 1 above. The reading "typical density is 2 to 7 per 1,000 words" holds for McKinsey articles; the report and the case study run 12 to 16.

---

## 5. Gaps and cautions

- **Not read from the live site.** All McKinsey text came from Internet Archive snapshots (timestamps in section 0). mckinsey.com refused WebFetch (timeout) and an undisguised headless Chrome request (protocol error); no browser tool was available. A human should spot-check three or four quotations on the live pages. The WebFetch tool also refuses web.archive.org, so no second, independent read of the snapshots was possible.
- **No web searches were possible** (session budget exhausted at 200). Article discovery used Wayback CDX index queries, so the selection is a convenience sample of well-archived, prominent articles, weighted toward AI topics and QuantumBlack authors. It has one McKinsey Quarterly piece and no McKinsey Global Institute report.
- **No 2024 to 2026 McKinsey Insights article on the legal or general counsel function was found.** The legal material is a 2021 article, a 2026 client case study, a 2024 cross-function survey article that includes legal, and McKinsey Legal's 2021 to 2023 blog. Absence in an index sweep is not proof that none exists.
- **Exhibit source lines and notes were not read**: they are inside the exhibit images. Only the eyebrow label and the alt-text title were available. Whether McKinsey exhibits carry a "Source:" line with survey name and n could not be verified from text.
- **No McKinsey style guide or editor statement on prose style** was found; "About the Quarterly" is a positioning page and is undated.
- **BCG remains unread in primary form.** This task did not revisit it.
- Sentence statistics are approximate (regex splitting; bold run-in list labels such as "Retrieval accuracy." count as short sentences, which slightly inflates the short-sentence share in SIX, ADV, DATA, and COO).
- The SOAI26 and SOAI25 editions share one URL. The live page now shows the 2026 edition; the 2025 edition is reachable only through an earlier snapshot.
- The em dash job classification was scripted on the opening words after the dash and then eyeballed; the split between "reversal" and "other trailing" is indicative, not exact.

## 6. Working files (scratch, not deliverables)

Parsed text, footnotes, and metrics are in `C:/Users/RALPHS~1/AppData/Local/Temp/claude/c--code-files-spaarke-website/aa6b682a-4844-485c-99e0-cb2228b928c3/scratchpad/mck/` (`*.txt`, `*.notes.txt`, `metrics.json`, `emdash.txt`, `qual.txt`, `extra.txt`, plus the scripts `extract.py` and `measure.py`). No file in any git repository was modified.
