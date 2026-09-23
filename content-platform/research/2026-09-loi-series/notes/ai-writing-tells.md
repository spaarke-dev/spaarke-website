# AI-writing tells and how to remove them

Research notes, compiled 2026-09-21. Track: the signs that make prose sound AI-written, and how to remove them.

Method note. 15 web searches ran before the session-wide search budget was exhausted; about 45 page fetches followed. Several primary pages blocked automated fetching (The Atlantic, Washington Post, Science Advances, PMC, Marketplace, Rolling Stone, Sage). Where that happened the notes say so and rely on the arXiv version or a named secondary source. Quotes were retrieved through a summarizing fetch tool, so each should be checked against the live page before it is printed in an article. All before-and-after examples are invented for this document and are labeled as such; they cite no real data.

House rule applied to these notes: no em dashes, spaced en dashes, spaced hyphens or double hyphens in my own prose. They appear only inside "before" examples and direct quotations.

---

## 1. The main catalogs

### 1.1 Wikipedia, "Signs of AI writing" (WikiProject AI Cleanup)

- URL: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- Status: living document. Most recent revision observed 2026-09-21 14:31 UTC (history page: https://en.wikipedia.org/w/index.php?title=Wikipedia:Signs_of_AI_writing&action=history). WikiProject AI Cleanup was formed in 2023 (https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup).
- Source kind: primary (the catalog itself), community-written, drawn from real examples found on Wikipedia.

Structure of the page (as fetched 2026-09-21): Caveats; Content (undue emphasis on significance, legacy and broader trends; canned emphasis on notability; superficial analyses; promotional language; vague attributions; outline-like conclusions about challenges and future prospects); Language and grammar (high density of "AI vocabulary" words; avoidance of basic copulatives; vague expression of connection; negative parallelisms with three subtypes; rule of three); Style (title case headings; overuse of boldface; inline-header vertical lists; overuse of em dashes; emoji; tables; curly quotes; thematic breaks); Communication intended for the user; Markup; Citations.

Key points and quotes:

1. The list is diagnostic, not a checklist for cosmetic repair. Quote: "Please do not merely treat these signs as the problems to be fixed; that could just make detection harder." The page adds that the patterns are "only potential signs of a problem, not the problem itself." (lead section, fetched 2026-09-21)
2. Not every text with these features is AI-generated, because models are trained on human writing. Quote: "Not all text featuring these indicators is AI-generated, as the large language models that power AI chatbots are trained on human writing, including Wikipedia." (lead)
3. Caveats on detection. Quote: "Humans are notoriously bad at distinguishing human and LLM-generated text." The page says heavy LLM users do much better and that detection software has "non-trivial error rates". (Caveats section)
4. Inflated significance. Quote: "LLM writing often puffs up the importance of the subject matter by adding statements about how arbitrary aspects of the topic represent or contribute to a broader topic." Words to watch include: stands/serves as, is a testament/reminder, crucial/pivotal/vital/key role, underscores/highlights its importance, reflects broader, setting the stage for, represents/marks a shift, evolving landscape, indelible mark, deeply rooted.
5. Present-participle tails ("superficial analyses"). The page describes "attaching a present participle ("-ing") phrase at the end of sentences, sometimes with vague attributions to third parties." Words to watch: highlighting/underscoring/emphasizing, ensuring, reflecting/symbolizing, contributing to, cultivating/fostering, encompassing, enhancing, valuable insights, align/resonate with.
6. Promotional tone. Quote: "LLMs have serious problems keeping a neutral tone." Words to watch: boasts a, vibrant, rich, profound, showcasing, exemplifies, commitment to, nestled, in the heart of, groundbreaking, renowned, diverse array.
7. Vague attribution. Quote: "AI chatbots tend to attribute opinions or claims to some vague authority". Words to watch: Industry reports, Observers have cited, Experts argue, Some critics argue, several sources (when few are cited).
8. Formula conclusions. The page describes a "Challenges" section that begins "Despite its [positive words], [subject] faces challenges..." and ends with a vaguely positive assessment or speculation, often beside a "Future Prospects" section.
9. AI vocabulary, by era. 2023 to mid-2024 (GPT-4): Additionally, boasts, bolstered, crucial, delve, emphasizing, enduring, garner, intricate/intricacies, interplay, key, landscape, meticulous, pivotal, underscore, tapestry, testament, valuable, vibrant. Mid-2024 to mid-2025 (GPT-4o): align with, bolstered, crucial, emphasizing, enhance, enduring, fostering, highlighting, pivotal, showcasing, underscore, vibrant. Mid-2025 on (GPT-5): emphasizing, enhance, highlighting, showcasing. The page says "delve" was famously overused in 2023 and early 2024, became less frequent later in 2024 and "dropped off sharply in 2025". Density is what matters. Quote: "an edit (post-2022) introducing lots of them, lots of times, is one of the strongest tells for AI use".
10. Copula avoidance. Quote: "LLM-generated text often replaces simple constructions that use copulas such as is or are with constructions such as serves as a or mark the."
11. Negative parallelism, three subtypes: "Not just X, but also Y"; "Not X, but Y" ("It's not ..., it's ..." or "no ..., no ..., just ..."); "Y rather than X" (described as particularly common in Grok output).
12. Rule of three. Quote: "LLMs often use this structure to make superficial analyses appear more comprehensive."
13. Title case. Quote: "In section headings, AI chatbots strongly tend to capitalize all main words."
14. Boldface. Quote: "AI chatbots may display various phrases in boldface for emphasis in an excessive, mechanical manner." The page attributes this to training on readmes and listicles.
15. Inline-header vertical lists: a list marker "followed by an inline boldfaced header, separated with a colon from the remaining descriptive text."
16. Em dashes: see section 4 below.

### 1.2 tropes.fyi (Ossama, launched February 2026)

- URL: https://tropes.fyi/ (fetched 2026-09-21; page carries no date; launch date February 2026 per https://agent-wars.com/news/2026-03-12-tropes-fyi-publishes-a-comprehensive-catalog-of-ai-writing-tics-as-a-single, 2026-03-12, secondary). Hacker News discussion: https://news.ycombinator.com/item?id=47291513
- Source kind: practitioner catalog, intended for use as a system prompt.
- Six categories: word choice, sentence structure, paragraph structure, tone, formatting, composition. Entries that map to this brief: "Quietly" and other magic adverbs; synonym cycling; "Tapestry" and "Landscape"; the "Serves As" dodge; "Delve" and friends (includes utilize, leverage, robust, streamline); negative parallelism; em-dash addiction; rule of three; "The X? A Y." (self-posed question answered at once); anaphora abuse; false ranges; superficial "-ing" analyses; "It's worth noting"; short punchy fragments; grandiose stakes inflation; invented concept labels; vague attributions; quotable one-liners; "Here's the kicker"; "Think of it as..."; "Let's break this down" (unpack, explore, dive in); title case headings; bold-first bullets; the tie-back; fractal summaries; signposted conclusion; "Despite its challenges...".
- Quote on dose: "Remember: any of these patterns used once might be fine. The problem is when multiple tropes appear together or when a single trope is used repeatedly."
- Quote on em dashes: "A human writer might use 2-3 per piece (and naturally); AI will use a lot more."
- Quote on short fragments: they are used "for manufactured emphasis" (capitalized in the original).
- On self-answered questions: the pattern "creates false sense of narrowing down to truth" (as summarized by the fetch tool; verify wording).
- The directory tags each trope as consistent, rising, new or fading.

### 1.3 "The LLM-ism Dictionary" (Rough at Sea, 2026-08-15)

- URL: https://roughatsea.com/notes/the-llm-ism-dictionary/ (dated 2026-08-15; author not named on page)
- Source kind: practitioner essay. Numbered entries (200 or so).
- Entries relevant to structural tells: "The colon epiphany" (entry 85; example: "The implication is simple: memory changes the nature of the system."); "Suspiciously even paragraph lengths" (101); "The paragraph that resolves too cleanly" (90), with the line "Every thought receives a landing sentence"; "Rhetorical tidiness" (107); "The agency ending" (199; example: "The technology will not decide this. We will."); hedging entries 166 to 168 (modal qualifiers, recursive caveats); "Why does this matter?" (62); "Here's the thing." (60), glossed as "Conversational authority in three words."; "Conclusion echo" (92), glossed as "Final section rephrases the introduction instead of adding anything new."
- Central claim: "LLM prose often feels statistically well-behaved". The essay contrasts this with the texture, idiolect and mess of human prose.

### 1.4 Blake Stockton, "Don't Write Like AI" (2025-08-07)

- URL: https://www.blakestockton.com/p/takeaways-from-wikipedias-signs-of-ai-writing-2 (2025-08-07)
- Source kind: practitioner newsletter, secondary to Wikipedia.
- Ten takeaways: inflated symbolism, promotional language, editorializing ("it's important to note"), overused conjunctions (moreover, furthermore), negative parallelism, superficial "-ing" analysis, vague attribution, excessive bolding, em dash overuse, bold bullet titles. Quote: "Negation is the most prominent AI writing tell."

### 1.5 Sam Kriss, "Why Does A.I. Write Like ... That?" (New York Times Magazine, 2025-12-03)

- Not fetched directly. Longreads notice: https://longreads.com/2025/12/04/why-does-a-i-write-like-that/ (2025-12-04). Secondary discussion: https://etcjournal.com/2025/12/10/a-discussion-of-why-does-a-i-write-like-that/ (2025-12-10).
- As reported secondhand, the essay covers "delve", "tapestry", "quiet", ghost imagery, "It's not X, it's Y", the rule of threes and the em dash, and argues that the prose strains to sound profound. Treat as a pointer only; read the original before citing.

---

## 2. Academic evidence

### 2.1 Kobak, Gonzalez-Marquez, Horvat, Lause: "Delving into LLM-assisted writing in biomedical publications through excess vocabulary"

- Science Advances vol. 11 no. 27, eadt3813, 2025-07-02. DOI page: https://www.science.org/doi/10.1126/sciadv.adt3813 (403 to fetch tool). arXiv: https://arxiv.org/abs/2406.07016 (v1 2024-06-11; v5 2025-07-03). PubMed: https://pubmed.ncbi.nlm.nih.gov/40601754/. Code and word list: https://github.com/berenslab/llm-excess-vocab (updated July 2025; CSV of 900 excess words).
- Figures below are from arXiv v3 (2025-02-14), https://arxiv.org/html/2406.07016v3, so the published version may differ slightly.
- Corpus: over 15 million PubMed abstracts, 2010 to 2024.
- Headline: "at least 13.5% of 2024 abstracts were processed with LLMs", a lower bound, reaching 30 to 40 percent in some subcorpora.
- 454 excess words in 2024 (v3). Covid-era excess words were almost all content nouns; the 2024 excess words were mostly style words, of which 66 percent were verbs and 14 percent adjectives.
- Frequency ratios: delves r = 28.0, underscores r = 13.8, showcasing r = 10.7. Largest excess gaps among common words: potential, findings, crucial.
- The abstract says the effect on vocabulary surpassed that of major events such as the Covid pandemic.
- Limitation noted by the authors: abstracts that avoid marker words go undetected, so true usage is higher.

### 2.2 Reinhart et al.: "Do LLMs write like humans? Variation in grammatical and rhetorical styles"

- PNAS 122 (2025), e2422455122. https://www.pnas.org/doi/10.1073/pnas.2422455122. arXiv: https://arxiv.org/abs/2410.16107 (v1 2024-10-21; v2 2025-08-21). Figures from https://arxiv.org/html/2410.16107v2.
- Method: Biber's feature set applied to Llama 3 and GPT-4o variants against human text.
- Present participial clauses: instruction-tuned models at 2 to 5 times the human rate; GPT-4o at 5.3 times. This is the quantitative backing for the "participle tail" tell.
- Nominalizations: 1.5 to 2 times the human rate (GPT-4o 2.1 times). "That" clauses as subjects: GPT-4o 2.6 times. Phrasal coordination: GPT-4o 1.9 times. Agentless passives: GPT-4o about half the human rate.
- Overused words (GPT-4o, rate multiple): camaraderie 162, tapestry 155, intricate 119, amidst 100, palpable 95.
- Quote: "Instruction tuning appears to make the model output less human, not more". Base Llama models were close to human rates.

### 2.3 Juzek and Ward, two papers on why the words are overused

- "Why Does ChatGPT 'Delve' So Much?", COLING 2025. https://arxiv.org/abs/2412.11385 (2024-12-16). Identifies 21 focal words in scientific abstracts. Quote from abstract: "We fail to find evidence that lexical overrepresentation is caused by model architecture, algorithm choices, or training data." Model testing was consistent with RLHF playing a role.
- "Word Overuse and Alignment in Large Language Models: The Influence of Learning from Human Feedback", BIAS 2025 workshop at ECML PKDD. https://arxiv.org/abs/2508.01930 (2025-08-03). Using Llama, finds experimentally that human raters systematically prefer text containing some of the overused words, and frames the overuse as a misalignment between annotation workers and end users.

### 2.4 Liang et al.: "Mapping the Increasing Use of LLMs in Scientific Papers"

- https://arxiv.org/abs/2404.01268 (2024-04-01). 950,965 papers, January 2020 to February 2024. LLM-modified share up to 17.5 percent in computer science, up to 6.3 percent in mathematics and the Nature portfolio.

### 2.5 Yakura et al. (Max Planck): "Empirical evidence of Large Language Model's influence on human spoken communication"

- https://arxiv.org/abs/2409.01754 (v1 2024-09-03; latest version 2026-07-16). 737,083 hours of podcast audio; preregistered experiment with 496 participants. Words preferred by ChatGPT (delve, showcase, boast, intricacies, meticulous) rose abruptly in human speech after ChatGPT's release. Implication: the vocabulary tell is leaking into human usage, so false accusations will rise.

### 2.6 Russell, Karpinska and Iyyer: "People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text"

- ACL 2025. https://aclanthology.org/2025.acl-long.267/. arXiv https://arxiv.org/html/2501.15654v1 (2025-01-26).
- 300 non-fiction articles; five "expert" annotators (frequent LLM users). Majority vote misclassified 1 of 300. Non-experts were near chance (56.7 percent true positive rate).
- What experts cited as clues, by share of explanations: vocabulary 53.1 percent; sentence structure 35.9 (predictable patterns, lists of three); grammar and punctuation 24.8; originality 23.7; quotations 22.3; clarity 19.5 (over-explanation); formatting 15.0 (consistent headers, balanced paragraphs); conclusions 13.1 (repetitive, optimistic summaries); formality 12.3; names 11.7; tone 9.3; introductions 7.3; factuality 7.2.
- Words experts flagged: testament, vibrant, crucial, significantly, delve, showcasing, "beacon of hope".
- Annotator remark: "quotes feel fake, every expert speaks the same way and it's too homogenous with the text."
- What non-experts got wrong: they treated any uncommon word, any correct grammar and any formal tone as AI. This matters for Spaarke: the readers who complained are likely frequent LLM users, which makes them the accurate kind of detector.

### 2.7 Negative parallelism: The Atlantic, 2026-07-12 (secondary access only)

- Will Oremus, "The Most Famous AI Writing Tic Is Also the Most Mysterious", The Atlantic, 2026-07-12. https://www.theatlantic.com/technology/2026/07/ai-chatbot-writing-tic-negative-parallelism/687892/ (fetch blocked).
- Wikipedia's article "Negative parallelism" (https://en.wikipedia.org/wiki/Negative_parallelism, fetched 2026-09-21) rests on that single Atlantic reference and states that LLMs use the device "about three times more frequently than humans". The original measurer of the threefold figure was not identified.
- AI Weekly summaries of the Atlantic piece (https://aiweekly.co/alerts/atlantic-tracks-ais-not-x-but-y-tic-into-fortune-500-filings and https://aiweekly.co/alerts/atlantic-ais-its-not-x-its-y-tic-proves-hardest-to-shake, 2026-07-12 and 2026-07-13, updated 2026-08-12; aggregator): a Barron's count of the "not X; it's Y" construction in Fortune 500 filings rose from about 50 instances in 2023 to over 200 in 2025; a Washington Post dataset found "not just X, but Y" variants in roughly 6 percent of ChatGPT messages in one July; OpenAI's product manager for model behavior, Laurentia Romaniuk, is reported as saying the company is working to broaden the chatbot's repertoire; unlike "delve", the pattern shows "no signs of abating". Verify all of these against the Atlantic original before use.
- Marketplace radio segment, "AI loves negative parallelism", 2026-08-24: https://www.marketplace.org/episode/2026/08/24/ai-loves-negative-parallelism (403; not read).
- Alternative causal account: Eryk Salvaggio, "It's Not Just X. It's Y.", Cybernetic Forests, 2026-05-31, https://mail.cyberneticforests.com/its-not-just-data-its-post-training/. Argues the construction is reinforced by post-training on verifiable reasoning tasks, where "not X, but Y" is the shape of self-correction. Opinion essay, not a study.

### 2.8 Reader reaction in a business setting

- Cardon and Coman, "Professionalism and Trustworthiness in AI-Assisted Workplace Writing", International Journal of Business Communication, 2025. https://journals.sagepub.com/doi/10.1177/23294884251350599 (403). Reported by HR Dive, 2025-08-21: https://www.hrdive.com/news/managers-risk-loss-of-trust-by-over-relying-on-ai-written-messages/758098/. Survey of 1,100 full-time US professionals. Over 80 percent rated supervisors sincere when messages showed low AI assistance; only 40 to 52 percent when assistance was high. Trade-press account of a primary study; the study concerns workplace messages, not published articles, so it transfers by analogy only.

---

## 3. Consolidated taxonomy with invented before-and-after rewrites

All examples are invented, in a legal-operations business register. None cites real data.

Why these features arise, in brief. Wikipedia frames the underlying defect as text that is less specific and more exaggerated than what a person with knowledge would write (https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing, 2026-09-21). Reinhart et al. show instruction tuning pushes models toward a dense, noun-heavy, participle-heavy register (PNAS 2025). Juzek and Ward show human preference feedback rewards certain words (2025-08-03). The practical consequence: most tells are the residue of a sentence written without a specific fact to put in it. The durable fix is to supply the fact, not to swap the word.

### 3.1 Vocabulary

| Tell | Before (invented) | After (invented) |
|---|---|---|
| AI-era words in clusters: delve, tapestry, testament, landscape, realm, pivotal, crucial, underscore, foster, leverage, seamless, robust, showcase, enhance, align with | In today's rapidly evolving legal landscape, robust matter management plays a pivotal role in fostering seamless collaboration and leveraging data. | Matter management software pays for itself when finance can rely on the accrual figure and lawyers stop re-keying the same matter data into three systems. |
| Copula avoidance: serves as, stands as, functions as, represents | The dashboard serves as the department's single source of truth. | The dashboard is where the department looks up spend by matter. |
| Magic adverbs and intensifiers: quietly, deeply, fundamentally, truly | Alternative fee arrangements are quietly and fundamentally reshaping the panel. | Fixed fees now cover a third of the panel's employment work. |
| Filler transitions: Additionally, Moreover, Furthermore, It is worth noting, Importantly | Additionally, it is worth noting that invoice review is important. | Delete the sentence, or state what the review found. |
| Synonym cycling (elegant variation) | The platform ... the solution ... the tool ... the system (all one product) | Pick one noun and repeat it. Lawyers read a change of term as a change of meaning. |

Note on business jargon. "Leverage", "robust" and "seamless" predate LLMs in corporate prose; they are in the tropes.fyi list (https://tropes.fyi/) but not in Kobak's scientific excess-word findings as retrieved. For a professional reader they compound with the AI-era words, so the safe course is to cut them on both grounds.

### 3.2 Sentence constructions

| Tell | Before (invented) | After (invented) |
|---|---|---|
| Negative parallelism: "It is not X, it is Y"; "not just X but Y" | Legal operations isn't just about cutting costs. It's about enabling the business. | Most legal operations teams are measured on cost. The stronger ones also report contract cycle time, because that is the number the sales organization feels. |
| Present-participle tail | The department cut its panel from 40 firms to 12, highlighting the growing importance of strategic vendor relationships. | The department cut its panel from 40 firms to 12 and used the larger volumes to negotiate fixed fees for routine employment matters. |
| Rule of three, reflexive | The new process is faster, smarter and more transparent. | The new process cut average NDA turnaround from five days to two. |
| Rhetorical question then answer ("The result?") | The result? A 30 percent drop in outside counsel spend. | Outside counsel spend fell 30 percent in the first year. |
| Colon reveal | The lesson is simple: data wins. | Departments that arrived at the rate negotiation with their own cycle-time data left with better terms. |
| False range "from X to Y" | From intake to invoice, from contracts to compliance, the platform covers it all. | The platform handles intake, contract review and invoice approval. It does not cover compliance training or entity management. |
| Conversational throat-clearing: "Here is the thing", "Let us dive in", "Let us unpack" | Here's the thing: most legal departments don't have a data problem. Let's dive in. | Most legal departments have enough data. What they lack is one agreed list of matter types. |
| Anaphora for effect | They wanted visibility. They wanted control. They wanted answers. | The general counsel asked for one report: spend by business unit, monthly. |

### 3.3 Paragraph and document structure

| Tell | Before (invented) | After (invented) |
|---|---|---|
| One-sentence dramatic paragraph | And that changes everything. | Delete, or fold the specific consequence into the previous paragraph. |
| Conclusion that restates | In conclusion, legal operations is evolving rapidly, and departments that embrace data, technology and process will be best positioned for the future. | The open question is who owns the taxonomy once it exists. In the departments described here nobody did, and the reports degraded within a year. |
| "Despite these challenges" formula and a "future outlook" section | Despite these challenges, the future of legal operations remains bright. | Cut. End on the last substantive point or an unresolved question. |
| Fractal summaries and signposting: each section announces itself, delivers, then recaps | In this section we will explore three key considerations. | Start the section with the first consideration. |
| Every paragraph ends on a tidy landing sentence | ...and that is why taxonomy matters. | Let some paragraphs end on the evidence. |
| Uniform paragraph length and rhythm | Five paragraphs of four sentences each, every sentence 18 to 24 words. | Vary by content: a long paragraph where the argument needs room, a two-sentence paragraph where it does not. Do not manufacture variety with fragments. |
| One point diluted across the piece | The same claim restated in each section in fresh words. | State it once, then spend the words on evidence, counter-cases and limits. |

### 3.4 Punctuation and formatting

| Tell | Before (invented) | After (invented) |
|---|---|---|
| Em dash overuse | See section 4. | See section 4. |
| Bold lead-in bullets (inline-header lists) | **Visibility:** Gain real-time insight into spend. **Control:** Enforce guidelines automatically. | Write a paragraph. Use a list only for items that are parallel and that a reader will scan, and do not bold the first words. |
| Title Case Headings | Why Matter Taxonomy Is The Foundation Of Legal Analytics | Why matter taxonomy comes first |
| "What/Why/How" heading template | What It Is. Why It Matters. How To Get Started. | Headings that state the section's claim. |
| Mechanical bold for emphasis | The **key** is **alignment** between **legal** and **finance**. | No bold in running text. |
| Emoji, arrows, horizontal rules between sections | (decorative markers) | Remove. |

Curly quotation marks appear in Wikipedia's list because Wikipedia's house style uses straight quotes. In professional publishing curly quotes are standard, so this one does not apply to Spaarke.

### 3.5 Tone

| Tell | Before (invented) | After (invented) |
|---|---|---|
| Inflated significance | This stands as a testament to the transformative power of legal operations. | State what happened and let the reader judge its weight. |
| Vague attribution | Experts say legal departments are under increasing pressure. | In [named survey, year], [figure] of chief legal officers reported a cost-reduction mandate. If no source exists, write it as the author's own observation. |
| Excessive hedging | This may potentially suggest that, in some cases, firms could arguably benefit. | Departments with more than 50 open matters benefit. Below that volume the reporting overhead outweighs the saving. |
| Promotional register | A powerful, comprehensive solution that empowers teams. | Describe what the product does and for whom. |
| Aphoristic symmetrical closer | Technology doesn't transform legal departments. People do. | Cut. The preceding paragraph has already made the point or it has not. |
| Patronizing analogy: "Think of it as..." | Think of a matter taxonomy as a filing cabinet for your data. | Omit. This audience does not need the analogy. |
| Even-handed positivity, no judgment | Both approaches have merits, and the right choice depends on your needs. | Say which approach the author would choose and the condition under which the other wins. |
| Invented concept labels | the visibility paradox, the intake trap | Use the field's existing terms. |
| Homogeneous quotations | Every quoted person speaks in the article's own voice. | Use real quotations, kept short, with the speaker's own diction. |

---

## 4. The em dash

### 4.1 Why it reads as an AI tell

1. Measured overuse in some models. Freeburg, "The Last Fingerprint: How Markdown Training Shapes LLM Prose" (arXiv preprint, 2026-03-27; https://arxiv.org/abs/2603.27006, full text https://arxiv.org/html/2603.27006v1; no sign of peer review on arXiv, although a vendor blog calls it peer-reviewed). Twelve models, five providers. Em dashes per 1,000 words, unconstrained: GPT-4.1 10.62; Claude Opus 4.6 9.09; DeepSeek V3 6.95; Gemini 2.5 Pro 3.53; Llama models 0.00. Human baseline from eight published essays (57,232 words): weighted mean 3.23, range 0.33 to 17.12. Under an instruction to suppress, GPT-4.1 stayed at 9.10 while Claude Opus fell to 0.19; a search-result summary of the paper also gives GPT-5.4 at 0.29. Freeburg's hypothesis: "the em dash is markdown leaking into prose".
2. Wikipedia's observation is about placement as much as count. Quote: LLM output "uses them in places where humans are more likely to use commas, parentheses, colons, or (misused) hyphens (-) and en dashes (–)". The page adds that a July 2026 study found only Claude used em dashes more than professional writers and that ChatGPT used them less; that study was not identified in this research. (https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing, 2026-09-21)
3. The vendor treated it as a defect. Sam Altman, 2025-11-14: "If you tell ChatGPT not to use em-dashes in your custom instructions, it finally does what it's supposed to do!" (https://x.com/sama/status/1989193813043069219; reported by TechCrunch, Sarah Perez, 2025-11-14, https://techcrunch.com/2025/11/14/openai-says-its-fixed-chatgpts-em-dash-problem/).
4. Competing explanations of cause. Sean Goedecke (2025-10-30, https://www.seangoedecke.com/em-dashes/) rejects token-efficiency and RLHF-dialect theories and favors digitized older print books: "State-of-the-art models rely on late-1800s and early-1900s print books for high-quality training data, and those books use ~30% more em-dashes than contemporary English prose." He also reports GPT-4o using roughly ten times as many em dashes as GPT-3.5 (per search summary of the essay). Freeburg favors markdown leakage shaped by fine-tuning.
5. It is the tell the general public knows. The "ChatGPT hyphen" meme dates from early 2025 (Rolling Stone, 2025, https://www.rollingstone.com/culture/culture-features/chatgpt-hypen-em-dash-ai-writing-1235314945/, not fetched; Washington Post, 2025-04-09, https://www.washingtonpost.com/technology/2025/04/09/ai-em-dash-writing-punctuation-chatgpt/, 403). Because it is visible at a glance, it triggers suspicion before a reader has processed a single claim.
6. The dash often carries another tell. It is the usual hinge of negative parallelism ("not X — Y"), of the dramatic reveal and of the afterthought tail. Removing the glyph without removing the gesture leaves the tell intact.

Counter-view, to be fair to the mark. Brian Phillips in The Ringer (2025-08-20, https://www.theringer.com/2025/08/20/pop-culture/em-dash-use-ai-artificial-intelligence-chatgpt-google-gemini): "The prevalence of em dashes in AI-generated text is a sign of how reliant the AI companies are on the human writers they want to replace." SlopDetector (vendor blog, 2026-07-31, https://slopdetector.org/blog/em-dash-ai-tell-data) counted 10.13 per 1,000 words in Huckleberry Finn and 8.12 in Moby-Dick, against GPT-4.1's 10.62, and concluded the gap is "much smaller and noisier than the myth suggests". The em dash is therefore weak evidence of authorship. It is still strong as a trigger of reader suspicion, which is the problem Spaarke has.

### 4.2 What the style authorities say about the alternatives

- The Punctuation Guide (https://www.thepunctuationguide.com/em-dash.html, copyright 2011 to 2026): the em dash can replace commas, parentheses or colons. "Dashes are considered less formal than parentheses; they are also more intrusive." "The dash is less formal than the colon". A dash pair is "always more emphatic than commas". Limit of two per sentence.
- Chicago Manual of Style Q&A (https://www.chicagomanualofstyle.org/qanda/data/faq/topics/HyphensEnDashesEmDashes/faq0181.html, undated, 18th edition site): on a dash between two independent clauses the editors concede "a semicolon or a period might be better than a dash in that example." They note dashes and parentheses are usually interchangeable and advise editing dashes out when in doubt.
- Wikipedia, "Dash" (https://en.wikipedia.org/wiki/Dash, fetched 2026-09-21): Chicago sets the em dash closed; AP sets it open with spaces. The spaced en dash is house style at Penguin, Cambridge University Press and Routledge. The double hyphen is a typewriter-era proxy for the em dash. The en dash marks "a closed range of values".

The common thread: every job the em dash does has a more formal mark that does the same job. In a formal register the dash is never required.

### 4.3 Decision guide

Ask first what the dash is doing.

1. A pair of dashes around an aside that the sentence survives without.
   - Short aside, closely tied to the sentence, no internal commas: comma pair.
   - Supplementary detail (a definition, a figure, a list, a cross-reference), or an aside with its own commas: parentheses.
   - Aside long enough to be a thought of its own: take it out and give it its own sentence.
2. A single dash before an explanation, specification or list of what was just said (it could be read as "namely").
   - Colon, provided the words before it form a complete clause.
   - Check that the colon is doing specification and not staging a reveal. "The cause was mundane: nobody owned the rate table" specifies. "The lesson is simple: data wins" is theater and should be restructured.
3. A single dash between two independent clauses.
   - Both short and closely balanced or contrasted: semicolon.
   - Either clause long, or the second is a new step in the argument: full stop and new sentence.
   - Better than either, often: a conjunction that names the logic (because, so, but, although). The dash lets the writer avoid deciding what the relation is. Deciding improves the sentence.
4. A single dash before an afterthought or a tail ("— and that matters").
   - If the tail carries information, make it a sentence. If it carries only emphasis, delete it.
5. A dash before a punchline or the second half of "not X — Y".
   - Restructure. State Y as a positive claim and support it. A semicolon here keeps the tell.
6. A dash in a numeric range.
   - Unspaced en dash (2024–2026, pages 12–18, 40–60 percent), or the words "from 2024 to 2026" and "between 40 and 60 percent". Never mix the two forms ("from 2024–2026").

Substitutes that must also go. A spaced en dash ( – ), a spaced hyphen ( - ) and a double hyphen (--) are all the same gesture in a different glyph. The spaced en dash is legitimate British house style, and Wikipedia notes that humans tend to use "(misused) hyphens" where models use em dashes, so a swap may look superficially more human. It does not fix the sentence, a reader who is already suspicious will read it as evasion, and the spaced hyphen and double hyphen are typographic errors in professional publishing. The rule for Spaarke should therefore be: no dash of any kind as sentence punctuation. Keep hyphens in compound modifiers (fixed-fee matter) and unspaced en dashes in numeric ranges only.

After any replacement, reread the sentence. If a paragraph now has three colons or three semicolons, the dash habit has moved house. The target is sentences whose logic is carried by words.

### 4.4 Six before-and-after examples (invented)

1. Comma pair.
   - Before: The matter intake form — which most teams still route through email — determines the quality of every downstream report.
   - After: The matter intake form, which most teams still route through email, determines the quality of every downstream report.
2. Parentheses.
   - Before: Three of the five panel firms — the two litigation boutiques and the regional employment firm — missed the accrual deadline.
   - After: Three of the five panel firms (the two litigation boutiques and the regional employment firm) missed the accrual deadline.
3. Colon.
   - Before: The audit found one root cause — nobody owned the timekeeper rate table.
   - After: The audit found one root cause: nobody owned the timekeeper rate table.
4. Semicolon.
   - Before: Invoice review catches billing errors — it does nothing about the staffing decisions that caused them.
   - After: Invoice review catches billing errors; it does nothing about the staffing decisions that caused them.
5. Full stop and new sentence.
   - Before: We moved e-billing to the new platform in March — and by June the rejection rate had fallen from 14 percent to 6 percent, which freed one analyst for vendor management.
   - After: We moved e-billing to the new platform in March. By June the rejection rate had fallen from 14 percent to 6 percent, which freed one analyst for vendor management.
6. Restructure.
   - Before: Outside counsel guidelines aren't a compliance document — they're a pricing instrument.
   - After: Outside counsel guidelines set prices. Each staffing limit and each excluded expense category changes what the department pays, which is why finance should review the guidelines alongside legal.

Range and substitute examples (invented).
- Before: The pilot ran 2024 - 2026 and covered 40 -- 60 matters a quarter.
- After: The pilot ran from 2024 to 2026 and covered 40–60 matters a quarter.
- Before: The panel review – long overdue – began in May.
- After: The panel review, long overdue, began in May.

---

## 5. Which tells matter most to sophisticated professional readers

This section is my synthesis. The evidence behind it is cited; the ranking is inference.

Evidence base. (a) In Russell et al. (ACL 2025) accurate detectors cited vocabulary in 53.1 percent of explanations and sentence structure in 35.9 percent, then grammar and punctuation, originality, quotations, over-explanation, formatting and formula conclusions. (b) Wikipedia's editors say the surface signs point to deeper defects: text that is generic, inflated and unsourced. (c) The Atlantic reporting, via secondary sources, says negative parallelism has persisted while "delve" faded. (d) Wikipedia's era table shows the vocabulary list shrinking with each model generation, so word lists age fast. (e) tropes.fyi stresses clustering and repetition over single occurrences.

Ranking for general counsel, legal operations leaders and legal-technology buyers:

1. Content-level emptiness. Inflated significance, vague attribution ("experts say", "industry reports"), participle tails that assert importance, conclusions that restate, one point diluted across 2,000 words. These readers are trained to ask "who says, and on what evidence". An unsupported claim costs credibility whether or not a model wrote it. This is the tier where the fix is substantive: named sources, numbers, a position, a limit on the claim.
2. Manufactured-drama constructions. Negative parallelism, the self-answered question, the colon reveal, the one-line paragraph, "Here is the thing", the aphoristic closer. They are the most durable tells across model generations and the most irritating to an expert audience because each implies the reader held a naive view that needs correcting.
3. Rhythm and template. Reflexive triplets, uniform paragraph length, every paragraph landing on a moral, fractal signposting, what/why/how headings, bold lead-in bullets, title case. Readers may not name these, but they produce the "statistically well-behaved" feel.
4. The em dash and its substitutes. Weak as evidence, strong as a trigger, and cheap to remove. Worth a hard rule because a lay reader spots it in the first screen.
5. Vocabulary. Necessary but least durable. The 2023 list (delve, tapestry, testament) is already fading from model output, and Yakura et al. show the words entering human speech. Cut clusters of them, and cut the older corporate fillers (leverage, robust, seamless) on plain-style grounds.

Two cautions. First, Wikipedia's warning applies to editors as well as detectors: scrubbing the surface without adding specifics produces prose that is harder to flag and no better to read. Second, over-correction has its own signature. Prose with no contractions, no parallel structure and no lists of three at all is also unnatural. The test for any device is whether the content called for it.

---

## 6. Distinct viewpoints found

1. Tells are symptoms of a deeper failure (generic, inflated, unsourced prose); removing the surface sign alone "could just make detection harder" (Wikipedia, 2026-09-21).
2. The em dash is a legitimate mark that models learned from good human writers; shaming it harms writers (Phillips, The Ringer, 2025-08-20; SlopDetector data, 2026-07-31).
3. The em dash is measurably overused by particular models and is a fingerprint of fine-tuning choices, varying from 0 to more than 10 per 1,000 words (Freeburg, 2026-03-27); OpenAI treated it as a defect (Altman, 2025-11-14).
4. Causes are disputed: old digitized books (Goedecke, 2025-10-30); human-feedback preference (Juzek and Ward, 2024-12-16 and 2025-08-03); markdown leakage (Freeburg); post-training on reasoning tasks for negative parallelism (Salvaggio, 2026-05-31); The Atlantic calls the cause of negative parallelism unresolved (2026-07-12, via secondary).
5. The tells are a moving target. Vocabulary shifts by model era and "delve" has receded (Wikipedia), while negative parallelism persists (Atlantic via AI Weekly).
6. Humans are converging on model vocabulary (Yakura et al.), and non-expert readers misjudge formal, correct prose as AI (Russell et al.), so accusations will catch human writers too.
7. In workplace communication, perceived heavy AI assistance lowers perceived sincerity (Cardon and Coman via HR Dive, 2025-08-21).

---

## 7. Gaps

- The Atlantic (2026-07-12), Washington Post (2025-04-09), Rolling Stone, Marketplace (2026-08-24), Science Advances, PMC and Sage pages could not be fetched. Figures attributed to The Atlantic (threefold rate, Barron's Fortune 500 count, Washington Post 6 percent) come through Wikipedia and an aggregator and need checking at source.
- The New York Times Magazine essay by Sam Kriss (2025-12-03) was not read directly.
- The "July 2026 study" that Wikipedia cites on em dash rates by model versus professional writers was not identified.
- No quantitative study was found for colon reveals, one-sentence paragraphs, uniform paragraph length, title case or bold lead-in bullets. These rest on practitioner catalogs (Wikipedia, tropes.fyi, Rough at Sea).
- No study specific to legal-industry readers' reactions to AI-sounding thought leadership was found. The ranking in section 5 is inference from general evidence.
- Juzek and Ward's list of 21 focal words was not retrieved.
- Kobak et al. figures were taken from arXiv v3; the Science Advances version may differ in details (for example the abstract count is "over 15 million" in the arXiv abstract while an earlier summary says 14 million).
- The session's web-search budget ran out after 15 searches; further discovery relied on URLs already surfaced.
- All quotations passed through a summarizing fetch tool and should be verified verbatim before publication.

---

## 8. Source list

| # | Source | Publisher | Date | Kind | URL |
|---|---|---|---|---|---|
| 1 | Wikipedia:Signs of AI writing | Wikipedia (WikiProject AI Cleanup) | last revised 2026-09-21 | primary | https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing |
| 2 | Wikipedia:WikiProject AI Cleanup | Wikipedia | fetched 2026-09-21 | primary | https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup |
| 3 | Negative parallelism | Wikipedia | fetched 2026-09-21 | aggregator | https://en.wikipedia.org/wiki/Negative_parallelism |
| 4 | Dash | Wikipedia | fetched 2026-09-21 | aggregator | https://en.wikipedia.org/wiki/Dash |
| 5 | Kobak et al., Delving into LLM-assisted writing... | Science Advances / arXiv | 2025-07-02 (arXiv 2024-06-11) | primary | https://arxiv.org/abs/2406.07016 ; https://www.science.org/doi/10.1126/sciadv.adt3813 |
| 6 | berenslab/llm-excess-vocab | GitHub | updated 2025-07 | primary | https://github.com/berenslab/llm-excess-vocab |
| 7 | Reinhart et al., Do LLMs write like humans? | PNAS / arXiv | 2025 (arXiv 2024-10-21, v2 2025-08-21) | primary | https://arxiv.org/abs/2410.16107 ; https://www.pnas.org/doi/10.1073/pnas.2422455122 |
| 8 | Juzek and Ward, Why Does ChatGPT "Delve" So Much? | COLING 2025 / arXiv | 2024-12-16 | primary | https://arxiv.org/abs/2412.11385 |
| 9 | Juzek and Ward, Word Overuse and Alignment in LLMs | BIAS 2025 (ECML PKDD) / arXiv | 2025-08-03 | primary | https://arxiv.org/abs/2508.01930 |
| 10 | Liang et al., Mapping the Increasing Use of LLMs in Scientific Papers | arXiv | 2024-04-01 | primary | https://arxiv.org/abs/2404.01268 |
| 11 | Yakura et al., Empirical evidence of LLM's influence on human spoken communication | arXiv | 2024-09-03 (latest 2026-07-16) | primary | https://arxiv.org/abs/2409.01754 |
| 12 | Russell, Karpinska, Iyyer, People who frequently use ChatGPT... | ACL 2025 / arXiv | 2025-01-26 | primary | https://aclanthology.org/2025.acl-long.267/ ; https://arxiv.org/html/2501.15654v1 |
| 13 | Freeburg, The Last Fingerprint: How Markdown Training Shapes LLM Prose | arXiv (preprint) | 2026-03-27 | primary | https://arxiv.org/abs/2603.27006 |
| 14 | Goedecke, Why do AI models use so many em-dashes? | seangoedecke.com | 2025-10-30 | other (essay) | https://www.seangoedecke.com/em-dashes/ |
| 15 | Perez, OpenAI says it's fixed ChatGPT's em dash problem | TechCrunch | 2025-11-14 | trade-press | https://techcrunch.com/2025/11/14/openai-says-its-fixed-chatgpts-em-dash-problem/ |
| 16 | Altman post on em dashes | X | 2025-11-14 | primary | https://x.com/sama/status/1989193813043069219 |
| 17 | Phillips, Stop AI-Shaming Our Precious, Kindly Em Dashes | The Ringer | 2025-08-20 | trade-press | https://www.theringer.com/2025/08/20/pop-culture/em-dash-use-ai-artificial-intelligence-chatgpt-google-gemini |
| 18 | Is the Em Dash an AI Tell? | SlopDetector | 2026-07-31 | vendor | https://slopdetector.org/blog/em-dash-ai-tell-data |
| 19 | Em dash | The Punctuation Guide | copyright 2011 to 2026 | other (reference) | https://www.thepunctuationguide.com/em-dash.html |
| 20 | CMOS Q&A on dash between independent clauses | Chicago Manual of Style Online | undated | primary | https://www.chicagomanualofstyle.org/qanda/data/faq/topics/HyphensEnDashesEmDashes/faq0181.html |
| 21 | tropes.fyi, AI Writing Pattern Directory | tropes.fyi | launched 2026-02 (page undated) | other (catalog) | https://tropes.fyi/ |
| 22 | The LLM-ism Dictionary | Rough at Sea | 2026-08-15 | other (essay) | https://roughatsea.com/notes/the-llm-ism-dictionary/ |
| 23 | Stockton, Don't Write Like AI: 10 Takeaways | blakestockton.com | 2025-08-07 | other (newsletter) | https://www.blakestockton.com/p/takeaways-from-wikipedias-signs-of-ai-writing-2 |
| 24 | Oremus, The Most Famous AI Writing Tic Is Also the Most Mysterious | The Atlantic | 2026-07-12 | trade-press (not fetched) | https://www.theatlantic.com/technology/2026/07/ai-chatbot-writing-tic-negative-parallelism/687892/ |
| 25 | AI Weekly alerts summarizing The Atlantic | aiweekly.co | 2026-07-12/13, updated 2026-08-12 | aggregator | https://aiweekly.co/alerts/atlantic-tracks-ais-not-x-but-y-tic-into-fortune-500-filings ; https://aiweekly.co/alerts/atlantic-ais-its-not-x-its-y-tic-proves-hardest-to-shake |
| 26 | Salvaggio, It's Not Just X. It's Y. | Cybernetic Forests | 2026-05-31 | other (essay) | https://mail.cyberneticforests.com/its-not-just-data-its-post-training/ |
| 27 | Kriss, Why Does A.I. Write Like ... That? (notice) | Longreads, on NYT Magazine | 2025-12-04 (essay 2025-12-03) | aggregator | https://longreads.com/2025/12/04/why-does-a-i-write-like-that/ |
| 28 | Managers risk loss of trust by over-relying on AI-written messages | HR Dive | 2025-08-21 | trade-press | https://www.hrdive.com/news/managers-risk-loss-of-trust-by-over-relying-on-ai-written-messages/758098/ |
| 29 | Cardon and Coman, Professionalism and Trustworthiness in AI-Assisted Workplace Writing | International Journal of Business Communication | 2025 | primary (not fetched) | https://journals.sagepub.com/doi/10.1177/23294884251350599 |
| 30 | AI loves negative parallelism (radio segment) | Marketplace | 2026-08-24 | trade-press (not fetched) | https://www.marketplace.org/episode/2026/08/24/ai-loves-negative-parallelism |
