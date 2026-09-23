# Local audit: published library and voice documents (em dashes, AI-sounding constructions, bylines, length)

Audit date: 2026-09-21. Track: local only, no web sources used. Repository root: `C:/code_files/spaarke-website` (branch `content/legal-operations-ontology`). No repository file was modified.

Source convention in these notes: every claim is followed by `path:line`. Paths are relative to the repository root. "Date" for a published article is its frontmatter `date`; for voice documents it is the lock line at the foot of the file (`Locked 2026-05-07` unless stated; `content-platform/CLAUDE.md` is `Locked 2026-05-09`).

Method: Grep tool in count mode (counts matching LINES), plus a Python pass over the same files for CHARACTER counts, word counts, and regex pattern mining. Word counts are body-only (frontmatter stripped), whitespace-token approximations that include link text. All quoted examples were verified against the file with the Read tool.

Files read in full: all of `content-platform/voice/` except that `product-knowledge.md`, `research-sources.md`, `taxonomy.md`, and `visual-identity.md` were scanned by heading and by keyword only (they are reference documents and contain no prose-style instructions; em dash counts for them are still reported). All of `content-types/blog-post.md`, `templates/blog-post/*.md`, `content-platform/CLAUDE.md`. Twelve of the 19 `.mdx` article bodies were read end to end; `2026-01-18`, `2026-01-25`, `2026-02-01`, `2026-02-15` were read in large part (openings, middles, endings); the three reference documents (`2026-01-01`, `2026-03-28`, `2026-03-31`) were pattern-mined and their endings read.

---

## 1. Dash counts

### 1.1 Published articles (`content/blog/*.mdx`)

Totals: 601 em dash characters (U+2014) on 456 lines across 19 files. Spaced en dashes (" – "): 0 in every file. Double hyphens used as dashes: 0 in every file. Unspaced en dashes exist only as numeric ranges (1 in `2026-02-01`, 3 in `2026-02-15`).

| Article (date) | Em dash chars | Lines with em dash (Grep count) | In frontmatter | In body | Body words | Body em dashes per 1,000 words |
|---|---|---|---|---|---|---|
| 2026-01-01 Spaarke-Functional-Specification-2026 | 3 | 3 | 1 | 2 | 3,159 | 0.6 |
| 2026-01-04 what-is-legal-operations-intelligence | 26 | 22 | 4 | 22 | 1,601 | 13.7 |
| 2026-01-11 the-iq-stack | 35 | 29 | 4 | 31 | 1,522 | 20.4 |
| 2026-01-18 loi-maturity-model | 28 | 23 | 5 | 23 | 1,624 | 14.2 |
| 2026-01-25 why-we-built-on-microsoft | 27 | 24 | 4 | 23 | 1,355 | 17.0 |
| 2026-02-01 your-legal-data-belongs-to-you | 29 | 22 | 3 | 26 | 1,955 | 13.3 |
| 2026-02-08 tenant-dedicated-deployment | 36 | 25 | 4 | 32 | 1,465 | 21.8 |
| 2026-02-15 what-attorneys-need-to-know-about-ai | 37 | 27 | 4 | 33 | 2,331 | 14.2 |
| 2026-02-22 ai-without-giving-away-the-keys | 19 | 15 | 4 | 15 | 1,399 | 10.7 |
| 2026-03-01 the-ai-readiness-gap | 24 | 20 | 6 | 18 | 1,407 | 12.8 |
| 2026-03-07 the-20b-blind-spot | 40 | 31 | 8 | 32 | 1,816 | 17.6 |
| 2026-03-14 institutional-knowledge | 23 | 21 | 4 | 19 | 1,405 | 13.5 |
| 2026-03-21 breaking-the-silo | 18 | 15 | 3 | 15 | 1,387 | 10.8 |
| 2026-03-25 legal-ops-is-not-it-for-lawyers | 23 | 17 | 6 | 17 | 1,451 | 11.7 |
| 2026-03-28 spaarke-for-your-it-team | 58 | 47 | 4 | 54 | 3,197 | 16.9 |
| 2026-03-31 spaarke-feature-specification | 82 | 51 | 9 | 73 | 3,110 | 23.5 |
| 2026-05-11 welcome-to-spaarke | 26 | 16 | 3 | 23 | 1,524 | 15.1 |
| 2026-05-21 probabilistic-vs-deterministic | 24 | 20 | 6 | 18 | 1,685 | 10.7 |
| 2026-05-27 the-ux-that-legal-iq-requires | 43 | 28 | 6 | 37 | 1,893 | 19.5 |

Five most recent by frontmatter `date`: 2026-05-27 = 19.5 per 1,000 words; 2026-05-21 = 10.7; 2026-05-11 = 15.1; 2026-03-31 = 23.5; 2026-03-28 = 16.9. Two of those five are reference documents; the five most recent narrative articles are 05-27 (19.5), 05-21 (10.7), 05-11 (15.1), 03-25 (11.7), 03-21 (10.8). In plain terms, every narrative article carries one em dash roughly every 50 to 95 words.

Em dashes also sit in reader-visible frontmatter. Two titles contain one: `title: "Legal AI Is Not Deterministic — And That Matters"` (`content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:2`) and `title: "The Spaarke platform — a feature reference"` (`content/blog/2026-03-31-spaarke-feature-specification.mdx:2`). The first title is also repeated as link text in `content/blog/2026-05-27-the-ux-that-legal-iq-requires.mdx:68`. `description`, `summary`, and `keyTakeaways` fields carry 3 to 9 em dashes per article (column "In frontmatter").

### 1.2 Voice, template, and routing documents

| Document | Em dash chars | Lines (Grep count) | Unspaced en dashes (numeric ranges) | Double hyphens |
|---|---|---|---|---|
| voice/style-guide.md | 12 | 12 | 4 | 0 |
| voice/bylines.md | 23 | 23 | 0 | 0 |
| voice/brand-positioning.md | 20 | 20 | 0 | 0 |
| voice/audience-personas.md | 20 | 18 | 2 | 0 |
| voice/domain-knowledge.md | 37 | 36 | 7 | 0 |
| voice/vocabulary.md | 24 | 19 | 0 | 0 |
| voice/library-audit.md | 30 | 26 | 3 | 0 |
| voice/product-knowledge.md | 53 | 43 | 0 | 0 |
| voice/research-sources.md | 27 | 25 | 0 | 0 |
| voice/taxonomy.md | 33 | 29 | 2 | 0 |
| voice/visual-identity.md | 51 | 49 | 12 | 7 (all CLI flags such as `--ar 16:9`) |
| voice/examples/good-articles.md | 33 | 31 | 0 | 0 |
| voice/examples/avoid-this.md | 24 | 23 | 0 | 0 |
| voice/examples/tone-samples.md | 15 | 14 | 0 | 0 |
| **voice total** | **402** | **368** | | |
| templates/blog-post/CLAUDE.md | 18 | 18 | 0 | 0 |
| templates/blog-post/brief.md | 6 | 6 | 4 | 3 (CLI flags) |
| templates/blog-post/idea.md | 3 | 3 | 0 | 0 |
| templates/blog-post/plan.md | 10 | 10 | 4 | 0 |
| templates/blog-post/tasks.md | 9 | 9 | 5 | 7 (CLI flags) |
| content-platform/CLAUDE.md | 25 | 25 | 0 | 0 |
| content-types/blog-post.md | 18 | 18 | 9 | 0 |

Spaced en dashes: 0 in every document. No double hyphen is used as a dash anywhere; every `--` is a command-line flag (`content-platform/templates/blog-post/brief.md:85`, `content-platform/templates/blog-post/tasks.md:96`, `:117`). The drafting agent therefore reads roughly 490 em dashes of house prose before it writes a word, at densities of 9 to 50 per 1,000 words (`templates/blog-post/CLAUDE.md` is the densest at 50.0).

Out-of-scope but relevant: the other content-type files also carry em dashes (white-paper.md 12 lines, linkedin-post.md 20, tweet.md 15), and `content-platform/content-types/tweet.md:33` says "Em-dashes work hard."

---

## 2. The most frequent AI-sounding constructions in the published articles

Counts are regex hits across the 19 articles (body only). They are indicative, not exact; every quoted example was read in the file.

### 2.1 Negation-then-correction ("This is not X. It is Y."; "Not because X. Because Y.")
59 two-sentence hits, 37 "This/It is not" openers, 10 "not because". Present in 17 of 19 articles; 8 in `2026-02-01` alone.
- "This is not a technology problem. It is an architecture problem. And it has a name." `content/blog/2026-01-04-what-is-legal-operations-intelligence.mdx:40`
- "This is not a trend. It is a platform shift." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:32`
- "The difference is not detail. It is dimensionality." `content/blog/2026-03-14-institutional-knowledge.mdx:60`
- "The difference is not better software. It is better architecture." `content/blog/2026-03-07-the-20b-blind-spot.mdx:84`
- "This is not a hypothesis. It is the reality of how enterprise legal departments operate today." `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:38`
- "These are not adversarial questions. They are governance questions." `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx:107`
- "They are not a hedge, and they are not transitional language. They are the architecture." `content/blog/2026-05-11-welcome-to-spaarke.mdx:42`
- "These are not features. They are the practical consequences of the probabilistic property the rest of the article has named." `content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:113`
- "Not because anything is broken. Because that is what sampling from a distribution does." `content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:39`
- "Not because legal-ops has not done the work. Because the dashboards in place aggregate and report; they do not yet reason." `content/blog/2026-03-07-the-20b-blind-spot.mdx:30`
- "not because of privilege concerns or deliberate gatekeeping, but because the systems were never designed to share." `content/blog/2026-03-21-breaking-the-silo.mdx:24`

### 2.2 Verbless "Not X. Not Y." and "No X. No Y." fragment stacks
34 hits; 9 in `2026-02-08`, 7 in `2026-03-28`.
- "Not storage. Not document archiving." `content/blog/2026-01-11-the-iq-stack.mdx:35`
- "Not integration with Microsoft. Operation within Microsoft." `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:48`
- "Not adjacent to it. Inside it." `content/blog/2026-05-11-welcome-to-spaarke.mdx:52`
- "No separate user accounts. No additional identity provider. No parallel permission structure." `content/blog/2026-02-08-tenant-dedicated-deployment.mdx:75`
- "No governance framework. No audit trail. No data boundary." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:67`
- "Not one surface that does everything. Not three siloed ones either." `content/blog/2026-05-27-the-ux-that-legal-iq-requires.mdx:78`

### 2.3 "Not just X" escalation
52 occurrences of "not just"; 11 in `2026-03-25`, where five consecutive bullets use it as the headline formula.
- "Strategic legal ops does not just process invoices." `content/blog/2026-03-25-legal-ops-is-not-it-for-lawyers.mdx:57`
- "**Building institutional memory, not just storing documents.**" `content/blog/2026-03-25-legal-ops-is-not-it-for-lawyers.mdx:61`
- "It does not just summarize — it recommends, based on how your organization handled similar situations before." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:83`
- "Financial Management becomes predictive, not just controlled. Knowledge Management becomes systematic, not just documented." `content/blog/2026-01-18-loi-maturity-model.mdx:133`
- "An organization that retains operational memory does not just avoid loss. It gets smarter." `content/blog/2026-03-14-institutional-knowledge.mdx:84`

### 2.4 "X, not Y" tagline contrasts (the "two-noun framing")
85 hits of ", not <word>".
- "**Privilege protection is architectural, not contractual.**" `content/blog/2026-02-08-tenant-dedicated-deployment.mdx:105`
- "**Compliance is structural, not promissory.**" `content/blog/2026-02-08-tenant-dedicated-deployment.mdx:111`
- "The data boundary is structural, not contractual." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:59`
- "readiness is an architecture question, not a procurement question." `content/blog/2026-03-25-legal-ops-is-not-it-for-lawyers.mdx:65`
- "Board reporting becomes a query, not a project." `content/blog/2026-03-21-breaking-the-silo.mdx:60`
- "The AI is the last mile, not the first step." `content/blog/2026-03-01-the-ai-readiness-gap.mdx:67`
- "This is a flywheel, not a feature stack." `content/blog/2026-01-11-the-iq-stack.mdx:110`

### 2.5 Aphoristic symmetrical closers
- "One learns. The other just runs." `content/blog/2026-01-11-the-iq-stack.mdx:112`
- "The tool is not the bottleneck. The data architecture is." `content/blog/2026-03-01-the-ai-readiness-gap.mdx:61`, recycled as "The tool is not the bottleneck. The operating model is." `content/blog/2026-05-11-welcome-to-spaarke.mdx:28`
- "The cost is invisible on any single day. Over a decade, it is enormous." `content/blog/2026-03-14-institutional-knowledge.mdx:96`
- "The frameworks tell you what to build. LOI tells you how to make it intelligent." `content/blog/2026-01-18-loi-maturity-model.mdx:135`
- "Dashboards visualize. Intelligence reasons." `content/blog/2026-03-07-the-20b-blind-spot.mdx:58`
- "Data without memory is just storage. Memory without inference is just an archive. Inference without data is just guessing." `content/blog/2026-01-04-what-is-legal-operations-intelligence.mdx:56`
- "Legal is not unique in needing it. It is unusual only in not yet having it." `content/blog/2026-05-11-welcome-to-spaarke.mdx:64`
- "Legal AI does not fail because it is probabilistic. It fails when the people using it do not know that it is." `content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:117`

### 2.6 One-sentence dramatic paragraphs
18 detected at 14 words or fewer (more exist above that length).
- "What disappears is context." `content/blog/2026-03-14-institutional-knowledge.mdx:26`
- "Now consider how that department actually operates." `content/blog/2026-01-04-what-is-legal-operations-intelligence.mdx:28`
- "For most legal departments, the honest answer is no." `content/blog/2026-03-01-the-ai-readiness-gap.mdx:27`
- "This is where architecture becomes decisive." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:46`
- "Today we are announcing Spaarke." `content/blog/2026-05-11-welcome-to-spaarke.mdx:68`
- "The goal is to advance on both." `content/blog/2026-01-18-loi-maturity-model.mdx:63`

### 2.7 Rhetorical question followed by its answer
46 question marks in prose (some are legitimate buyer checklists in `2026-02-01` and `2026-02-15`).
- "But what does that architecture actually look like?" `content/blog/2026-01-11-the-iq-stack.mdx:25`
- "If documentation alone cannot solve the knowledge crisis, what can?" `content/blog/2026-03-14-institutional-knowledge.mdx:68`, answered by "The answer is architectural." `:70`
- "This article answers a different question: where does it run?" `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:26`
- "Can it learn from its own history? Can it remember what works? Can it predict what comes next?" `content/blog/2026-01-18-loi-maturity-model.mdx:26`
- "That iPaaS platform connecting your matter management system to your e-billing tool? Your data passes through their servers on every sync." `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx:40`

### 2.8 Colon reveals
- "The difference between administrative legal ops and strategic legal ops comes down to one word: intelligence." `content/blog/2026-03-25-legal-ops-is-not-it-for-lawyers.mdx:73`
- "There is an architectural answer to this problem, and it starts with a simple principle: your legal data should never leave your environment." `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx:80`
- "Over time, Memory creates something that no amount of hiring or training can replicate: an organization that genuinely gets smarter with every matter it handles." `content/blog/2026-01-11-the-iq-stack.mdx:68`
- "The philosophy of the platform compresses to four words: AI-directed, human-controlled." `content/blog/2026-05-11-welcome-to-spaarke.mdx:42`

### 2.9 Em dash asides and em dash reveals
601 characters in total (section 1).
- "An AI tool layered on fragmented data gives you fragmented answers — faster." `content/blog/2026-03-01-the-ai-readiness-gap.mdx:59`
- "It pays — in time, in money, in outcomes — for knowledge it once had and failed to retain." `content/blog/2026-03-14-institutional-knowledge.mdx:94`
- "And the gap is not a UI problem — it is a UX problem." `content/blog/2026-05-27-the-ux-that-legal-iq-requires.mdx:26`
- "The intelligence belongs to you — and it stays with you." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:89`
- "It is to know which one is doing the work — and where." `content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:119`

### 2.10 Rule-of-three lists and triadic parallel clauses
280 "A, B, and C" hits (many are legitimate inventories, but the rhetorical triads recur in every narrative piece).
- "connecting what was previously disconnected, remembering what was previously forgotten, and surfacing what was previously invisible." `content/blog/2026-01-04-what-is-legal-operations-intelligence.mdx:46` (reused almost verbatim at `content/blog/2026-05-11-welcome-to-spaarke.mdx:36`)
- "capturing, connecting, and learning from every interaction." `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:46`
- "Fewer surprises. Faster decisions. Less rework." `content/blog/2026-03-21-breaking-the-silo.mdx:58`
- "Each one represents a shift from reactive to predictive, from manual to intelligent, from fragmented to unified." `content/blog/2026-01-04-what-is-legal-operations-intelligence.mdx:90`
- "it belongs to you, inside your environment, governed by your policies." `content/blog/2026-02-08-tenant-dedicated-deployment.mdx:115`

### 2.11 Anaphora runs (three or more consecutive sentences with the same opening words)
11 runs detected.
- "They expect to pivot a matter list with a sentence. They expect to drill from a spend dashboard to the firms behind it." `content/blog/2026-05-27-the-ux-that-legal-iq-requires.mdx:28` (five consecutive "They expect" sentences)
- "The user still fills the same forms. The user still pages through the same queues." `content/blog/2026-05-27-the-ux-that-legal-iq-requires.mdx:46`
- "You trust the vendor to maintain those boundaries. You trust the vendor's security team. You trust the vendor's compliance posture." `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:76`
- "The conflicts check is not a guess. The deadline calculation is not a guess. The OCG enforcement is not a guess." `content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:96`
- "It re-learns lessons it already learned. It re-makes mistakes it already made." `content/blog/2026-03-14-institutional-knowledge.mdx:94`
- "Sometimes a form. Sometimes a structured query. Sometimes a natural-language sentence." `content/blog/2026-05-27-the-ux-that-legal-iq-requires.mdx:64`

### 2.12 Signposting and series boilerplate
20 "As we described/explored/defined in", 21 "Here is what / Consider / in practice", 11 "This article ...".
- "We chose Microsoft. Here is why." `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:30`
- "Here is what that shift looks like in practice:" `content/blog/2026-03-25-legal-ops-is-not-it-for-lawyers.mdx:55`
- "Here is the data point that should anchor every AI strategy conversation in legal today" `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:30`
- "Now consider what happens when you point an AI tool at this landscape." `content/blog/2026-03-01-the-ai-readiness-gap.mdx:47`
- "As we explored in [The $20B Blind Spot](/why-spaarke/the-20b-blind-spot), most legal departments cannot answer basic questions about where their money goes." `content/blog/2026-03-25-legal-ops-is-not-it-for-lawyers.mdx:57`

### 2.13 Summary closers that restate ("Where to Go Next")
15 of 19 files end with a "Where to Go Next" H2; most open it by restating the article.
- "This article explored the organizational risk of institutional knowledge loss and the architectural response" `content/blog/2026-03-14-institutional-knowledge.mdx:102`
- "This article examined what happens when Legal Operations Intelligence is applied to the specific problem of legal spend visibility." `content/blog/2026-03-07-the-20b-blind-spot.mdx:110`
- "This article explored how to capture AI's value within an architecture that protects your most sensitive data." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:95`
- "The category defines what LOI is. The Legal IQ stack explains how it works. This article shows how it aligns with and amplifies the maturity frameworks" `content/blog/2026-01-18-loi-maturity-model.mdx:141`

### 2.14 Bold lead-in bullets and bold lead-in paragraphs
303 hits; the single most frequent device. 60 in `2026-03-28`, 55 in `2026-03-31`, 22 in `2026-02-15`, 18 in `2026-05-21`.
- "- **Documents capture outcomes.** A signed contract shows the final terms." `content/blog/2026-01-11-the-iq-stack.mdx:62`
- "**Separate systems.** Legal uses one set of tools for matter management, e-billing, and document storage." `content/blog/2026-03-21-breaking-the-silo.mdx:34`
- "- **Bound the agent's scope.** An agent that can write to anything is an agent that will eventually write to the wrong thing." `content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:95`
- "- **Trust.** Microsoft's enterprise security infrastructure has been vetted by the most demanding organizations on earth." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:36`

### 2.15 Inflated abstractions, intensifiers, and recycled stock sentences
Word counts across the corpus: "actually" 24, "compound*" 22, "transform*" 14, "fundamentally" 13, "genuinely" 8, "enormously" 4, "flywheel" 4, "load-bearing" 3, "structural" 25.
- "Spaarke takes a fundamentally different approach." appears twice, identically: `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:78` and `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:50`
- "This distinction matters enormously." `content/blog/2026-01-11-the-iq-stack.mdx:78`; "This matters enormously for AI." `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx:86`
- "*Deliberately* is the load-bearing word." `content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:91`; "Operating model is the load-bearing phrase." `content/blog/2026-05-11-welcome-to-spaarke.mdx:36`
- "To delve deeper, we recommend reading" `content/blog/2026-05-11-welcome-to-spaarke.mdx:80` ("delve" is a widely recognised machine-text marker)
- Flywheel chains: "Data feeds Memory. Memory sharpens Inference. Better Inference guides what data to capture next." `content/blog/2026-03-14-institutional-knowledge.mdx:92`; "Structured data feeds operational memory. Memory grounds inference. Better inference drives better decisions." `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:87`
- Sentences opening with "And" or "But": 54 (for example "And it may be entirely wrong." `content/blog/2026-03-01-the-ai-readiness-gap.mdx:49`).

Observation: the devices co-occur. A typical paragraph chains 2.1, 2.2, and 2.5 (negate, fragment, land a short symmetrical closer). It is the density and the co-occurrence, more than any single device, that reads as machine-written.

---

## 3. Where the voice documents instruct, praise, or model these patterns

### 3.1 `content-platform/voice/style-guide.md` (Locked 2026-05-07)
- Em dash explicitly endorsed: "**Em-dashes**: yes — for parenthetical asides and emphasis. Don't replace every comma with one; they earn their weight by being rare." `:68`
- Semicolons discouraged: "**Semicolons**: sparingly. A period almost always works." `:69`
- Short-sentence rhythm prescribed: "Mix short and medium sentences. Short for emphasis, medium for development, long sparingly." `:41`
- Short landing praised: "A long claim, a short landing." `:43`, with both aphorisms quoted as "The library does this naturally."
- Compound sentences discouraged: "If a sentence needs that much scaffolding, it is two sentences." `:47`; "Read it aloud. If you run out of breath, cut it." `:48`
- One-sentence paragraphs sanctioned: "One-sentence paragraphs are allowed but only after a longer build, and only for emphasis." `:46`, repeated in checklist `:126`
- Formal connectives removed: "Transition phrases are usually unnecessary. "Furthermore," "moreover," "in addition to this" — cut them and let paragraph order carry the argument." `:58`
- Model sentence opening with "And": "And in most organizations, it operates with less financial visibility than the office supply budget." `:56`
- Bold lead-ins called a signature: "**Bolded lead-in phrases on lists.** The library's signature pattern: bolded phrase, then plain explanation." `:71`
- Negation-correction aphorism as the model "We say": "We say: "The tool is not the bottleneck. The data architecture is."" `:28`
- Em dash reveal as the model "We say": "We say: "An AI tool layered on fragmented data gives you fragmented answers — faster."" `:32`; also `:24`
- The voice definition is itself five "X, not Y" tags: "**Authoritative, not breathless.**" `:15`, `:19`, `:23`, `:27`, `:31`; and a verbless fragment: "Not a vendor pitching, not an analyst lecturing." `:11`
- "Where to Go Next" close endorsed: "The library closes with "Where to Go Next" pointing to more substance." `:85`
- Checklist item 3 tests for short rhythm and against compound sentences: "no long compound sentences carrying the load?" `:122`
- The McKinsey/HBR target is already named but diluted: "They read McKinsey, HBR, Stripe, and Microsoft WorkLab." `:3`; "Closer to McKinsey, HBR, and Stripe than to startup marketing." `:35`. Nothing in the file defines what that register means at sentence level.

### 3.2 `content-platform/voice/examples/good-articles.md` (Locked 2026-05-07)
Every "What's working here" block praises one of the section 2 devices.
- One-sentence paragraph: ""Now consider how that department actually operates" is a one-sentence paragraph used as a hinge." `:37`; ""What disappears is context." — one-sentence paragraph. Four words landing the entire opening." `:209`
- Short parallel sentences: "Three short parallel sentences" `:38`; "Three short sentences in escalating reveal" `:134`; "three short sentences crediting the report on different dimensions before disqualifying it." `:184`
- Bold lead-in: "Three bullets in identical structure: **Bolded contrast about Documents.** + one-sentence example + Memory-captures construction." `:73`
- Two-noun framing: "Each bullet is a two-noun framing" `:74`; ""This is a flywheel, not a feature stack" — a two-noun framing reused as the section's anchor." `:100`
- Aphoristic closer: "two short sentences in parallel, each four words or fewer. After the longer compounding-returns paragraph, this lands as a controlled-rhythm punchline." `:99`
- Negation-then-correction named as a move: "The same negation-then-diagnosis move as `institutional-knowledge`'s opening." `:121`; "The definition lands as a correction, not an assertion." `:122`; "three short negation sentences clear the reader's likely first explanation." `:208`
- Em dash praised: ""Faster" as a one-word landing on an em-dash." `:144`; "four-element em-dash list in escalating order of unmanageability." `:207`
- Inversion closer: "two short sentences where the second inverts the first by one verb." `:145`; "two-sentence close in the library's signature short-parallel landing form." `:146`
- Rhetorical questions: "Four short questions (…) simulate the actual experience of being asked." `:169`
- "Not because … but because" praised `:170`
- Closing signature: "Two-sentence close: long-then-short, abstract-then-concrete, individual-then-cumulative. The library's closing-rhythm signature." `:230`
- Accuracy defect: the file says "Each extract is verbatim" `:3-4`, but the `the-20b-blind-spot` extracts (`:162-164`) no longer match the published article, which was revised (`content/blog/2026-03-07-the-20b-blind-spot.mdx:28-30`). The same stale text is quoted in `voice/style-guide.md:56` and `:71`.

### 3.3 `content-platform/voice/examples/avoid-this.md` (Locked 2026-05-07)
This is the mandatory final-pass checklist (`content-platform/CLAUDE.md:68-69`; `templates/blog-post/tasks.md:47-48`). Its "Better — write" examples are the patterns readers object to, and it has no entry for any of them.
- "> One learns. The other just runs." `:59` with "Ends on the argument, not the funnel." `:61`
- "> The tool is not the bottleneck. The data architecture is." `:78`
- "Specific statistic, em-dash list, concrete claim. No rhetorical questions." `:118`
- Rhetorical question and recap opener presented as the better version: "> But what does that architecture actually look like?" `:137`; "Specific recap content, then one short question naming the gap *this* article fills." `:139`. This contradicts `voice/style-guide.md:99` ("No "Throughout this series, we…" recap-openers").
- Em dash in a "Better" example `:97`.

### 3.4 `content-platform/voice/examples/tone-samples.md` (Locked 2026-05-07)
- ""Not integration with Microsoft. Operation within Microsoft" is the article's anchor distinction in eight words." `:17`
- "Control or convenience. Governance or agility." `:27`, praised as "compressing into two two-noun pairs" `:29`
- "Direct provocation reframes scope in sentence one." `:41`; "Use this when: Brief needs a "this isn't what you think it is" reframe" `:43`
- ""Mistakes the floor for the ceiling" is a compressed two-noun anchor." `:53`
- "Each bullet uses **two-noun headline + quoted operational sentence + interpretive close**." `:64`
- "Two-sentence close layers two complementary two-noun contrasts" `:86`

### 3.5 `content-platform/voice/library-audit.md` (Locked 2026-05-07)
This is the origin of the instructions. It rated 12 of 16 articles as fully on voice and listed the devices as strengths.
- "**Two-noun framings carry the argument.**" `:48`
- "Mid-length sentences interrupted by short ones for emphasis" `:58`
- "**Bolded lead-in phrases organize lists into arguments.**" `:60`
- "Two-noun contrast framings as a default rhetorical move." `:74`
- "Bolded lead-in phrases on lists; one-sentence paragraphs reserved for emphasis." `:78`
- "controlled-rhythm close: a long claim followed by a short, declarative landing." `:118`
- "characteristic single-sentence move: counterintuitive operational truth in one breath." `:126`
- It noticed "the difference is not incremental — it is categorical" `:64` only as a superlative problem, not as a construction problem.

### 3.6 `content-platform/voice/brand-positioning.md` and `vocabulary.md`
- The four narrative themes are "X, not Y" slogans: "**Built for AI across the lifecycle, not bolted on.**" `brand-positioning.md:24`; "**Microsoft-native — built on Microsoft, not adjacent to it.**" `:32`; "**Operational intelligence, not productivity AI.**" `:52`
- "That isn't a deployment preference; it's the precondition for the operational intelligence we claim." `brand-positioning.md:35-36` reappears nearly verbatim in a published article: "This is not a deployment preference. It is the precondition for the operational intelligence we claim." `content/blog/2026-05-11-welcome-to-spaarke.mdx:56`. Positioning prose is being copied into articles with its construction intact.
- brand-positioning.md uses contractions throughout ("isn't", "it's", "don't", "can't"), which the agent may mirror; a formal register would not.
- `vocabulary.md` bans "transformative", "leverage", "unlock" and similar (`:55-89`) but has no entry for the machine-text markers found in section 2.15 ("delve", "load-bearing", "fundamentally", "genuinely", "enormously", "actually", "flywheel").

### 3.7 Blog-post type file, templates, routers, skills
- "**Sentence rhythm**: looser than white papers. Short sentences for cadence." `content-platform/content-types/blog-post.md:38`
- "**Tight close** — 2–3 paragraphs that land the argument." `content-platform/content-types/blog-post.md:27`
- "- **¶ close:** <the punch + the cross-link, if any>" `content-platform/templates/blog-post/plan.md:50`
- Imitation is mandated: "`../../voice/examples/good-articles.md` — pattern-match before writing the opening" `content-platform/templates/blog-post/CLAUDE.md:36-37`; same in `content-platform/CLAUDE.md:66-67`
- Polish gate sweeps only `avoid-this.md` and style-guide §5 (`content-platform/templates/blog-post/tasks.md:47-50`); neither contains a punctuation or construction rule.
- Outside the requested scope but part of the same instruction chain: "em-dashes — yes; semicolons — sparingly" `content-platform/spec.md:251`; "Close: 1-2 paragraph beats (punch + cross-link to next piece" `.claude/skills/content-pipeline/SKILL.md:140`; "Pattern-match against voice/examples/good-articles.md openings" `.claude/skills/content-pipeline/SKILL.md:137-138`; "Use bolded lead-in phrases for parallel beats" `.claude/skills/publish-linkedin/SKILL.md:454`.

---

## 4. Byline convention and article endings

### 4.1 `author:` field in published frontmatter
- 18 of 19 articles: `author: "Spaarke Team"` (line 7 in the January to March articles; line 6 in `2026-05-21` and `2026-05-27`).
- 1 of 19: `author: "spaarke"` `content/blog/2026-05-11-welcome-to-spaarke.mdx:6`.
- No article carries a named person.
- The site prints the raw string: `<span>{post.author}</span>` `src/components/article/ArticleHeader.tsx:67`; also `src/components/PostCard.tsx:79`, `src/lib/seo.ts:99` and `:192`, `src/app/why-spaarke/rss.xml/route.ts:31`. There is no slug-to-display-name lookup, so the welcome post shows a lower-case "spaarke" byline.

### 4.2 What `content-platform/voice/bylines.md` says (Locked 2026-05-07)
- "The default byline on Spaarke pieces is the organization itself (`spaarke`)." `:10-11`
- "The brief's `byline:` field and the MDX frontmatter's `author:` field take a slug. Accepted values are `spaarke` plus any named slug listed in §3 below." `:23-25`
- One active named byline, `ralph-schroeder`, "Founder & CEO" `:32-34`; LinkedIn "`<TBD — confirm with team>`" `:46`; headshot path given `:45`. Two placeholders (`legal-ops-leader`, `platform-engineering-lead`) `:52-89`.
- Bios are described as written for "the closing-paragraph "About the author" use case" `:36`, but no published article contains an "About the author" paragraph and `src/` contains no author-bio component (Grep for "About the author|author bio|byline" in `src/` returned no files).
- Mismatch: the document never mentions the string "Spaarke Team", which is what 18 of 19 published articles use. `voice/library-audit.md:7` does describe the library as written "under the "Spaarke Team" byline".
- The bios themselves model the banned devices: "grounded in a system of record, not bolted on" and an em dash definition `:37`; "— Microsoft-native, AI-directed, human-controlled." `:48`.

### 4.3 How the five most recent articles end
1. `2026-05-27-the-ux-that-legal-iq-requires.mdx`: final paragraph `:94` "The UX requirements are not a design preference. They fall out of the operating environment." Then a bare link on its own line: "[Spaarke.com](https://www.spaarke.com)" `:96`. This is the only narrative article with any outbound or contact-like pointer, and it goes to the home page.
2. `2026-05-21-probabilistic-vs-deterministic.mdx`: `:119` "The job is not to choose between the two kinds of computation. It is to know which one is doing the work — and where." No call to action, no link, no contact.
3. `2026-05-11-welcome-to-spaarke.mdx`: reading list at `:80` ("To delve deeper, we recommend reading …" with links to two articles and `/platform`), then `:82` "Legal operations is entering its intelligence era. Spaarke is being built for that transition." No contact.
4. `2026-03-31-spaarke-feature-specification.mdx`: "Where to go next" H2 `:177`; `:179` restates the five modules; `:181` lists six internal article links. No contact.
5. `2026-03-28-spaarke-for-your-it-team.mdx`: "Where to Go Next" H2 `:240`; `:242` "This article is the technical reference for IT teams evaluating Spaarke." followed by three internal links. No contact.

Pattern across the library: 15 of 19 articles close with a "Where to Go Next" H2 of internal links. No article links to `/contact` (the page exists at `src/app/contact/page.tsx`), none has a `mailto:`, a LinkedIn link, or a named person to contact. The only external self-links are the bare home-page link above and "Find more information at [www.spaarke.com](https://www.spaarke.com)." `content/blog/2026-01-01-Spaarke-Functional-Specification-2026.mdx:514`.
Policy tension: `voice/style-guide.md:85` says "Don't end with "Schedule a demo" or "Talk to sales."", while `content-types/blog-post.md:56` offers "Talk to our team" as the default CTA for strategic pieces. Neither document defines an author contact line.

---

## 5. Length targets that would conflict with long-form articles

A hard ceiling is stated in at least nine places.
- "**Target: 1,000–1,800 words. Sweet spot ~1,400.** … Longer than 1,800 should probably be a white paper, or two posts." `content-platform/content-types/blog-post.md:21`
- "**3–5 H2 sections**" `content-platform/content-types/blog-post.md:26`; "H3s are allowed but rare — usually a sign the H2 section should be its own post." `:30`; "**The five-section sprawl.**" `:106`; worked example "Length 1,400 words" `:114`
- "**Blog posts**: the default register above. 1,000–1,800 words." `content-platform/voice/style-guide.md:110`
- "length_target: 1400 # words; sweet spot ~1,400 (range 1,000–1,800)" `content-platform/templates/blog-post/brief.md:9`
- "## 2. Draft (gate: complete prose at length target)" `content-platform/templates/blog-post/tasks.md:20`; "Length within target (blog: 1,000–1,800 words; ideal ~1,400)" `:25`
- "fix structural problems here, not in 1,400 words of prose." `content-platform/templates/blog-post/plan.md:5`; "Blog posts typically run 3–5 H2 sections." `:35`
- Outside scope, same chain: "**Length**: 1,000–1,800 words. ~1,400 is the sweet spot." `content-platform/spec.md:171`; "Long argument with sections, sources, ~1,400 words -> blog-post" `.claude/skills/idea-to-brief/SKILL.md:132`; "PROPOSED LENGTH — fit to type (blog ~1,400" `.claude/skills/idea-to-brief/SKILL.md:162`
- The escape hatch is a different content type: white paper "Target: 2,500–5,000 words. Sweet spot ~3,500." `content-platform/content-types/white-paper.md:15`, whose publish route does not exist yet ("once route exists, Phase 3" `content-platform/CLAUDE.md:113-114`).

The rule is already broken in practice: `2026-02-15` is about 2,331 words, `2026-02-01` about 1,955, `2026-05-27` about 1,893, `2026-03-07` about 1,816. The in-progress brief inherits the cap: "length_target: 1500 # words; range 1,400–1,700" `content-platform/articles/legal-operations-ontology/brief.md:9`.

---

## 6. Recommendations (no file was edited)

Priority 1: `voice/style-guide.md`
1. Replace `:68` with an absolute rule: no em dash (U+2014), no spaced en dash, no double hyphen as a dash, in body, headings, titles, `description`, `summary`, or `keyTakeaways`. Give the four formal substitutes (comma pair, parentheses, colon before a list or definition, a second sentence). Keep the unspaced en dash only for numeric ranges.
2. Rewrite §2. Delete "A long claim, a short landing" (`:43`), `:47`, `:48`. State the target as complete sentences of varied medium length, subordinate clauses and semicolons permitted, no verbless fragments, no sentence opening with "And" or "But".
3. Reverse `:58`: formal connectives ("however", "therefore", "by contrast", "as a result") are permitted where they carry logic.
4. Reverse `:69` on semicolons.
5. Replace the five "X, not Y" voice contrasts (`:15-33`) with positive descriptions and replace the "We say" samples at `:24`, `:28`, `:32` with formal specimens.
6. Tighten `:46` and `:126`: no one-sentence paragraphs in articles, or at most one per article.
7. Rewrite `:71`: bold lead-ins limited to genuine reference lists; argument is carried in paragraphs.
8. Remove "Stripe" and "Microsoft WorkLab" from `:3` and `:35`, and add a short sentence-level definition of the McKinsey Quarterly / HBR register.
9. Add a new "Constructions we do not use" section listing the fifteen patterns in section 2, each with one library example and a formal rewrite, plus a numeric budget (for example, at most one negation-then-correction per article; zero "Not because X. Because Y.").
10. Replace `:85` so the close is a substantive concluding paragraph followed by a standard author and contact line, not a "Where to Go Next" heading. Extend the §7 checklist with mechanical checks (em dash count equals zero; fragment, rhetorical-question, and one-sentence-paragraph counts).

Priority 2: `voice/examples/*`
11. `good-articles.md`: rebuild. Every annotation at `:37`, `:38`, `:73`, `:74`, `:99`, `:100`, `:121`, `:122`, `:134`, `:144`, `:145`, `:146`, `:169`, `:170`, `:184`, `:207`, `:208`, `:209`, `:230` praises a device now prohibited. Keep what is sound (concrete scene, named evidence, side-by-side specificity) and replace extracts with rewritten formal passages. Remove the "verbatim" claim or refresh the stale `the-20b-blind-spot` extracts.
12. `avoid-this.md`: replace the "Better" examples at `:59`, `:78`, `:97`, `:116`, `:135-137`; add new failure-mode entries (em dash; negation-then-correction; fragment stacks; aphoristic closer; one-sentence paragraph; rhetorical question and answer; colon reveal; rule-of-three; anaphora; signposting; restating closer; bold lead-in bullets; intensifiers). This file is the mandatory final-pass sweep, so it is where enforcement has to live.
13. `tone-samples.md`: retire passages 1, 2, 3, and 7 or rewrite their "Why included" notes; passages 4 and 6 can stay with revised commentary.
14. `library-audit.md`: add a dated addendum recording the reader feedback and superseding strengths 2, 7, and 8 (`:48`, `:58`, `:60`) and the "Voice elements" list (`:74-79`).

Priority 3: supporting files
15. `vocabulary.md` §2: add "delve", "load-bearing", "fundamentally", "genuinely", "enormously", "actually" (as intensifier), "flywheel" (limit), "stark", "staggering", "the honest answer", "here is why", "it has a name".
16. `brand-positioning.md`: restate the four theme headings (`:24`, `:32`, `:40`, `:52`) without the "X, not Y" tag and remove contractions, because articles are copying its sentences.
17. `bylines.md`: reconcile with reality. Either name "Spaarke Team" as the display string or add a slug-to-display mapping and fix `welcome-to-spaarke`; define the standard closing author and contact line (named person, role, and a link to `/contact` or a confirmed LinkedIn URL, which is still TBD at `:46`); rewrite the bios at `:37` and `:48` without em dashes.
18. `content-types/blog-post.md`: replace `:21` with "length follows the argument" guidance (a floor, no ceiling, or a separate long-form article type that still publishes to `content/blog/`); relax `:26`, `:30`, `:106`; replace `:38` and `:27`; reconcile `:56` with `style-guide.md:85` and the new contact line.
19. Templates: `brief.md:9` (make `length_target` free-form with a rationale), `tasks.md:20` and `:25` (replace the length gate; add a mechanical punctuation and construction check to the Polish gate at `:47-50`), `plan.md:5`, `:35`, `:50` (remove "the punch"), `templates/blog-post/CLAUDE.md:36-37` and `content-platform/CLAUDE.md:66-67` (stop instructing the agent to pattern-match the old examples until they are rebuilt).
20. Same-chain files outside the requested scope: `content-platform/spec.md:171`, `:245-251`; `.claude/skills/content-pipeline/SKILL.md:137-140`; `.claude/skills/idea-to-brief/SKILL.md:132`, `:162`.
21. Housekeeping: rewrite the voice documents themselves without em dashes (about 490 in the files the agent loads) so the agent is not primed by the register of its own instructions; consider a repository lint (a Grep for U+2014 in `content/blog/` and in `articles/*/draft.mdx`) as a pre-publish gate; decide whether to retrofit the 19 published articles and the two em dash titles.

---

## 7. Gaps and limits
- No external benchmark was gathered (local track, no web), so the em dash densities are not compared with McKinsey or HBR prose here.
- Pattern counts come from regular expressions; they over-count legitimate lists and buyer-question checklists and under-count variants. The ranking is reliable; the absolute numbers are approximate.
- `product-knowledge.md`, `research-sources.md`, `taxonomy.md`, and `visual-identity.md` were scanned, not read line by line.
- Whether "Spaarke Team" or a named person is the intended byline going forward is a publisher decision; the repository does not settle it. The LinkedIn URL for the one active byline is still TBD.
- The site has no author-bio component; a closing contact line would have to be plain MDX unless site work is done.
