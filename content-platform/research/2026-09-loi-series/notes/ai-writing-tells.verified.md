# Verification notes: track "ai-writing-tells"

Checked 2026-09-21. Method: direct fetch of each source (WebFetch, or curl of raw HTML/wikitext when the fetch model would not quote verbatim). The session's WebSearch budget was already exhausted, so primary sources were located by following citations and by Crossref / OpenAlex / Wayback lookups. Cached downloads are in `_factcheck_cache_ai-writing-tells/` next to this file.

Verdict key: confirmed = seen with my own eyes on a credible page; corrected = substance right, a detail wrong; unverified = could not see it; refuted = source contradicts.

Summary: 15 findings. 11 confirmed, 4 corrected (5, 7, 10, 11), 0 refuted. Sub-items still unverified: Barron's raw counts (about 50 to 200+) and "Fortune 500 filings" framing; The Economist article body (paywalled); tropes.fyi "launched Feb 2026"; Yakura affiliation (not shown on the arXiv abstract page).

---

## 1. Wikipedia "Signs of AI writing" is the catalog; signs are symptoms not the problem — CONFIRMED
- URL: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing (raw wikitext read). Latest revision seen: 21 September 2026, 14:31 (MrPersonHumanGuy, "Rule of three" example).
- Quote exact: "Please do not merely treat these signs as the problems to be fixed; that could just make detection harder." It is bolded in the lead. Preceding sentence: "The patterns listed here are also only potential signs of a problem, not the problem itself."
- Caution exact: "Not all text featuring these indicators is AI-generated, as the large language models that power AI chatbots are trained on human writing, including Wikipedia."
- Section names: the top-level heading is "Language and grammar" (not "Language"). Content, Language and grammar, Style all present with the sub-tells named (Undue emphasis on significance; Superficial analyses with "-ing" phrases; Promotional language; Vague attributions; "Despite its... faces several challenges" outline-like conclusions; AI vocabulary; Avoidance of basic copulatives "serves as/stands as"; Negative parallelisms with three subtypes; Rule of three; Title case; Overuse of boldface; Inline-header vertical lists; Overuse of em dashes).
- WikiProject AI Cleanup page first revision: 2023-12-04 (Wikipedia API). "Formed 2023" is right.
- Caveats to carry: the page has an {{update}} banner dated August 2026 ("the most recent models"); it calls itself "descriptive, not prescriptive" and a field guide for Wikipedia, noting "some may not apply in a non-Wikipedia context". "Most complete" is the researcher's judgement, not a sourced fact.

## 2. AI vocabulary shifts by model era; delve receded — CONFIRMED
- Same URL, section "High density of 'AI vocabulary' words".
- Era table verbatim:
  - 2023 to mid-2024 (GPT-4): Additionally, boasts, bolstered, crucial, delve, emphasizing, enduring, garner, intricate/intricacies, interplay, key, landscape, meticulous/meticulously, pivotal, underscore, tapestry, testament, valuable, vibrant
  - Mid-2024 to mid-2025 (GPT-4o): align with, bolstered, crucial, emphasizing, enhance, enduring, fostering, highlighting, pivotal, showcasing, underscore, vibrant
  - Mid-2025 and on (GPT-5): emphasizing, enhance, highlighting, showcasing (plus words from the "Canned emphasis on notability..." section)
- Delve sentence exact: "the word delve was famously overused by ChatGPT in 2023 and early 2024, but became less frequent later in 2024, then dropped off sharply in 2025." (cites Washington Post 2025-11-13 and Geng and Trotta, ACL Findings 2025).
- Quote exact: "One or two of these words appearing in an edit may be coincidental, but an edit (post-2022) introducing lots of them, lots of times, is one of the strongest tells for AI use."
- Extra: "a word being overused by AI does not imply that its synonyms are also overused." Grok "continues to overuse underscore as of 2026."

## 3. Kobak et al.: at least 13.5% of 2024 PubMed abstracts LLM-processed — CONFIRMED
- arXiv 2406.07016 (v1 2024-06-11; v5 2025-07-03). Journal ref: Science Advances 11(27), 2 July 2025, DOI 10.1126/sciadv.adt3813 (Crossref shows issue date 2025-07-04).
- Seen in arXiv HTML v5: "over 15 million biomedical abstracts from 2010-2024" (15.1M); "at least 13.5% of 2024 abstracts were processed with LLMs"; "reaching 40% for some subcorpora"; excess words rose "to 454" in 2024 (190 in 2021); "out of all 379 excess style words in 2024, 66% were verbs and 14% were adjectives"; delves r=28.0, underscores r=13.8, showcasing r=10.7; potential (delta 0.052), findings (0.041), crucial (0.037). Discussion: highest lower bounds "above 30%".
- Precision note: the 66% / 14% split applies to the 379 style words, not to all 454 excess words. Authors are Kobak, González-Márquez, Horvát, Lause.

## 4. Reinhart et al.: present participial clauses at 2 to 5 times human rate — CONFIRMED
- arXiv 2410.16107 (v1 2024-10-21, v2 2025-08-21). PNAS 122(8) e2422455122, DOI 10.1073/pnas.2422455122; Crossref publication date 2025-02-18. The finding's "2025-08-21" is only the arXiv v2 date.
- Seen: "the instruction-tuned LLMs used present participial clauses at 2 to 5 times the rate of human text"; GPT-4o 5.3x (d=1.38); "that" clauses as subject 2.6x; nominalizations 2.1x; phrasal coordination 1.9x; agentless passive "at roughly half the rate"; "informationally dense, noun-heavy style". Table 1 GPT-4o: camaraderie 162, tapestry 155, intricate 119, underscore 107.
- Quote is mid-sentence in the paper: "Also, instruction tuning appears to make the model output less human, not more: the Llama 3 base models use features at rates similar to human texts..." Use lower-case "instruction" or bracket the capital.

## 5. Russell, Karpinska, Iyyer: frequent LLM users are near-perfect detectors — CORRECTED (quote)
- arXiv 2501.15654 (v1 2025-01-26); ACL 2025 long paper, pp. 5342-5373, DOI 10.18653/v1/2025.acl-long.267.
- Numbers all seen: 300 articles; majority vote of five experts "misclassifies only 1 of 300"; nonexperts avg TPR 56.7%, FPR 52.5% in text (51.7 in the table); experts avg TPR 92.7%, FPR 4.0%. Clue shares: Vocabulary 53.1%, Sentence Structure 35.9%, Grammar & Punctuation 24.8%, Originality 23.7%, Quotes 22.3%, Clarity 19.5%, Formatting 15.0%, Conclusions 13.1%.
- Quote is NOT exact. Actual: "The quotes also feel fake, every expert speaks the same way and it's too homogenous with the text."
- Caveat that matters for the em dash argument: the Grammar & Punctuation category is defined as "AI-generated text is usually grammatically perfect (also avoiding dashes and ellipses), while human-written text often contains minor errors." In this study (GPT-4o, Claude 3.5 Sonnet, o1-Pro articles) dashes were read as a human marker.
- Formatting definition is "fully capitalized headings, bolded lists, paragraphs of similar length". Sentence structure definition names "not only ... but also" and "consistently listing three items".
- The last sentence of the finding (Spaarke's readers are accurate judges) is inference, not in the paper.

## 6. Freeburg: em dash rate is model-specific — CONFIRMED
- arXiv 2603.27006, single author E. M. Freeburg, submitted 2026-03-27, "14 pages, 3 tables", no journal ref, no peer review indicated.
- Seen: GPT-4.1 10.62 (9.10 under suppression), Claude Opus 4.6 9.09 (0.19), Claude Sonnet 4 8.29, Claude Haiku 3.5 7.51, DeepSeek V3 6.95 (5.41), GPT-4o Mini 4.16, GPT-4o 4.12, Gemini 2.5 Pro 3.53 (0.00), GPT-5.4 1.43, Gemini 2.5 Flash 1.28, Llama 3.1 8B and 3.3 70B Instruct 0.00. Human baseline: eight published essays, 57,232 words, weighted mean 3.23 (median 3.83; range 0.33-17.12). Quote exact: "the em dash is markdown leaking into prose".
- "50-fold human range" is the researcher's arithmetic (17.12 / 0.33 = 52), not a phrase in the paper. The human baseline is tiny (eight essays).

## 7. Wikipedia em dash tell is about placement — CORRECTED (the "unidentified" study is identified)
- Same Wikipedia page, section "Overuse of em dashes". Quote exact. Full sentence: "While human editors and writers often use em dashes, LLM output uses them more often than nonprofessional human-written text of the same genre, and uses them in places where humans are more likely to use commas, parentheses, colons, or (misused) hyphens (-) and en dashes."
- The July 2026 study is cited on the page: The Economist, "How to spot AI writing", 30 July 2026, https://www.economist.com/culture/2026/07/30/how-to-spot-ai-writing. Wikipedia's sentence: "A July 2026 study found that of contemporary models only Claude used em dashes more than professional writers, and ChatGPT used them less." I could not open The Economist (403, no Wayback copy), so the underlying figures are unverified.
- Wikipedia says AI em dashes are "usually surrounded by spaces" (finding says "often").
- New since the research: a September 2026 banner in this section says the sign "seems to be less common in current LLM output" and may be moved to historical indicators. The section also says: "This sign is most useful when taken in combination with other indicators, not by itself."

## 8. OpenAI treated the em dash habit as a defect — CONFIRMED
- TechCrunch, Sarah Perez, 2025-11-14. Full Altman quote (X): "Small-but-happy win: If you tell ChatGPT not to use em-dashes in your custom instructions, it finally does what it's supposed to do!" The finding's quote is an exact substring.
- TechCrunch list: "school papers, emails, comments, customer service chats, LinkedIn posts, online forums, ad copy, and more." Default unchanged: "it won't necessarily eliminate the em dash from its output by default".
- Second source named on Wikipedia: Benj Edwards, Ars Technica, 2025-11-14, tying the change to GPT-5.1.

## 9. Style authorities: every em dash function has a more formal substitute — CONFIRMED
- The Punctuation Guide (undated): "the em dash can take the place of commas, parentheses, or colons"; "dashes are always more emphatic than commas"; "Dashes are considered less formal than parentheses; they are also more intrusive"; "The dash is less formal than the colon"; "best limited to two appearances per sentence".
- CMOS Q&A, item URL: https://www.chicagomanualofstyle.org/qanda/data/faq/topics/HyphensEnDashesEmDashes/faq0181.html (18th ed., 2024). "You're right that a semicolon or a period might be better than a dash in that example." and "Because dashes are so flexible, they tend to be overused. When in doubt, edit them out." Same answer also says "a dash really can be used in place of just about any mark of punctuation", so "authorities agree" is a fair synthesis, not a quote.
- Wikipedia "Dash": spaced en dash is house style for "the Penguin Group, the Cambridge University Press, and Routledge" ("this convention is not universal"; OUP uses the unspaced em dash); two-hyphen proxy "a widespread convention in the typewriting era"; en dash "commonly used to indicate a closed range of values".

## 10. Em dash is weak evidence; SlopDetector and The Ringer — CORRECTED (one quote, one characterization)
- SlopDetector, "Is the Em Dash an AI Tell? We Measured Dash Density Across Human vs AI Texts", dated Jul 31, 2026. Numbers seen: Huckleberry Finn 10.13, Moby-Dick 8.12, Walden 4.27, Pride and Prejudice 0.00 (3.47 any dash), pooled 4.76 em dashes per 1,000 over 702,939 words; GPT-4.1 10.62 (from Freeburg). "A dash is a keystroke, not a thought." is exact. "weighted deliberately low" is on the page.
- Not on the page: "much smaller and noisier than the myth suggests". Actual wording: "yes, there's a real gap. It's just a lot smaller and a lot noisier than 'AI uses em dashes and humans don't.'"
- Not supported as of today: the page does not contain the string "peer" at all. It labels Freeburg "(arXiv, 2026)", "a controlled study", "the cleanest public measurement we found". The claim that the vendor calls it peer-reviewed should be dropped (it may have been edited since the researcher read it).
- The Ringer: "Stop AI-Shaming Our Precious, Kindly Em Dashes—Please", Brian Phillips, 2025-08-20, https://www.theringer.com/2025/08/20/pop-culture/em-dash-use-ai-artificial-intelligence-chatgpt-google-gemini. Seen: "the prevalence of em dashes in AI-generated text is a sign of how reliant the AI companies are on the human writers they want to replace."
- Judgement note: the human comparators are nineteenth-century novels, not business prose.

## 11. Negative parallelism, three times more frequent, spreading in corporate text — CORRECTED (attribution and corpus)
- The Atlantic, Will Oremus, "The Most Famous AI Writing Tic Is Also the Most Mysterious", published 2026-07-12 (modified 2026-07-13). I pulled the opening paragraphs directly (paywalled after that).
- The 3x figure is not The Atlantic's. Text: "Researchers at Pangram, which makes an AI-detection tool, estimate that Not just X but Y sentences appear three times as often in AI writing as they do in human writing." Pangram's page (https://www.pangram.com/supporting-evidence, "9 Signs of AI Writing, Backed by Data"): "AI uses phrases that fit this template three times as often as humans." (Same page: rule-of-three triads "about four times as often as humans".) So: vendor estimate, and for the "not just X but Y" subtype.
- Barron's: The Atlantic says "its appearance in corporate communications more than quadrupled from 2023 to 2025." The Barron's piece is Shaina Mishkin, "AI Is Changing How Companies Talk to Shareholders. Here Is the Red Flag for Readers.", 2026-04-14, https://www.barrons.com/articles/ai-corporate-communications-shareholders-red-flag-63211618 (paywalled). Its visible lede names "company conference calls, shareholder letters, news releases, and other corporate communications". The raw counts (about 50 to 200+) and "Fortune 500 filings" were NOT seen; use "corporate communications, more than quadrupled 2023-2025 (Barron's, via The Atlantic)".
- Washington Post, Merrill, Chen, Kumer, 2025-11-13 (Wayback copy 2026-01-25): "It frequently uses versions of the phrase 'not just X, but Y,' which appeared in 6 percent of chats in July." Corpus: 328,744 GPT-4o messages from 37,929 shared conversations, May 2024 to end of July 2025. Note "chats", not "messages"; July is July 2025.
- "has shown no signs of abating" is verbatim in The Atlantic, in contrast with delve ("have come and gone").
- "Most durable tell" is the researcher's gloss; The Atlantic says "perhaps the best-known tic of AI writing".
- Wikipedia "Negative parallelism" article: one-source stub (tagged {{One source}} July 2026) relying on the Atlantic piece. Do not cite it; cite The Atlantic / Pangram / WaPo.

## 12. Juzek and Ward: cause points to human-feedback training — CONFIRMED
- arXiv 2412.11385, 2024-12-16, COLING 2025 (ACL Anthology 2025.coling-main.426). Quote exact. 21 focal words. Hedge in the abstract: "While the model testing is consistent with RLHF playing a role, our experimental results suggest that participants may be reacting differently to 'delve' than to other focal words."
- Follow-up arXiv 2508.01930, 2025-08-03, accepted at BIAS 2025 (ECML PKDD): Llama; "participants systematically prefer text variants that include certain words"; "LHF workers versus LLM users".
- Sean Goedecke, "Why do AI models use so many em-dashes?", 2025-10-30, https://www.seangoedecke.com/em-dashes/: late-1800s / early-1900s print books, about 30% more em dashes than contemporary prose.

## 13. Practitioner catalogs (tropes.fyi, Rough at Sea) — CONFIRMED (launch month unverified)
- tropes.fyi (by ossama.is). Quote exact, but it lives on https://tropes.fyi/tropes-md (end of tropes.md), not the home page. All named tropes exist in the directory: Negative parallelism, Em-dash addiction, "The X? A Y.", False ranges, Short punchy fragments, "Here's the kicker", "Let's break this down", Title case headings, Bold-first bullets, Fractal summaries, Signposted conclusion, tie-back. Home page now says "49 tropes, 10 behaviours" (v2, 2026-08-14).
- "Launched Feb 2026" not confirmed: the changelog's oldest entry is 2026-03-14.
- Useful for the replacement guide: that changelog entry says double-hyphen dashes (--) are "now detected separately from em-dashes, since AI-generated text increasingly uses them as a substitute."
- Rough at Sea, "The LLM-ism Dictionary: A Field Guide to the Tics, Tells, and Templates of AI Writing", Aug 15, 2026, https://roughatsea.com/notes/the-llm-ism-dictionary. Seen: "The colon epiphany" (85), "Suspiciously even paragraph lengths" (101), "Every thought receives a landing sentence" (90), "Conclusion echo" (92), "The agency ending" (199), "statistically well-behaved". Entry 86 says: "The em dash is not an AI tell."

## 14. Yakura et al.: AI vocabulary entering human speech — CONFIRMED
- arXiv 2409.01754, v1 2024-09-03, v4 2026-07-16; still a preprint. Abstract: delve, showcase, boast, intricacies, meticulous "increased abruptly in spontaneous human speech"; "737,083 hours of conversation from 824,634 podcast episodes"; "A preregistered experiment (N = 496)".
- Max Planck affiliation not shown on the abstract page (not checked further). "Vocabulary judgments will increasingly misfire" is inference; Wikipedia's Caveats section makes the same point citing this paper.

## 15. Cardon and Coman: heavy AI assistance lowers perceived sincerity — CONFIRMED (percentages via secondary source only)
- HR Dive, Laurel Kalser, 2025-08-21: 1,100 full-time U.S. professionals; "More than 8 in 10" saw supervisors as sincere at low assistance; "Only 40% to 52%" at high assistance.
- Primary: Cardon, P. and Coman, A., "Professionalism and Trustworthiness in AI-Assisted Workplace Writing: The Benefits and Drawbacks of Writing With AI", International Journal of Business Communication, online 2025-07-16, vol. 63 no. 4, DOI 10.1177/23294884251350599. Abstract (Crossref/OpenAlex) confirms "a survey was conducted of 1,100 working professionals", a 2 x 4 design, and that at "medium- to high-levels of AI assistance" respondents "question the authorship, confidence, caring, sincerity, and ability of senders". The percentages are not in the abstract.
- Design caveat: respondents were told the level of AI assistance behind a congratulatory team email. It measures reaction to known AI use, not detection through style. The analogy to published thought leadership is the researcher's.
