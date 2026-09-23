# Research notes (round 2): knowledge management and AI alignment

Track: extra research for "Knowledge Management: The Context Behind Legal Operations Intelligence"
(display date 2026-09-14; sources dated on or before 2026-09-13 are usable).
Research date: 2026-09-21. Researcher: subagent (web research only).
Extends `content-platform/research/2026-09-loi-series/notes/knowledge-management-and-ai.md`
and its `.verified.md` file. Nothing there is repeated except where a second check changed it.

## Method and caveats (read first)

- WebSearch and WebFetch were both available. About 20 searches and 35 fetches were run.
- Where a quote is marked "raw text" it was string-matched against HTML, PDF text, or a JSON
  feed that I downloaded with curl and read directly (files in `research-r2/raw/`). Where a
  quote is marked "fetch tool" it came through the summarizing fetch model and should be
  checked against the live page before publication. The fetch tool misattributed one CCBJ
  sentence during this session (see Part C), which is why the raw checks matter.
- Blocked or empty: openai.com through the fetch tool (403; raw curl worked),
  wolterskluwer.com (403), acc.com (not attempted, blocked in earlier tracks), the Harbor
  brief through the fetch tool (JavaScript-only; raw curl worked), Google Cloud docs through
  the fetch tool (navigation only; raw curl worked). web.archive.org had no snapshot of the
  Google grounding page.
- Date discipline. Several vendor documentation pages carry no visible date or carry an
  update date after 2026-09-13. Each is flagged below. For every AI term I give at least
  one dated source that passes the 2026-09-14 display date; the undated documentation
  pages are offered as supporting reading, not as the citation.
- Source kinds: PRIMARY (the organization's own page, paper, or feed), TRADE (trade press),
  VENDOR (vendor blog, product page, press release), AGG (aggregator or secondary).

---

## Part A. The AI vocabulary, with sources and the knowledge management mapping

### A.1 Term by term

**1. Context and the context window**

- Definition for a legal operations reader: context is everything the model can see when it
  answers, and the context window is the fixed amount of it the model can hold at once.
- Anthropic engineering, "Effective context engineering for AI agents" (2025-09-29; authors
  Prithvi Rajasekaran, Ethan Dixon, Carly Ryan, Jeremy Hadfield). PRIMARY. Fetch tool.
  Quote: "Context refers to the set of tokens included when sampling from a large-language
  model (LLM)." Also: "as the number of tokens in the context window increases, the model's
  ability to accurately recall information from that context decreases" (the post calls this
  context rot) and "LLMs have an 'attention budget' that they draw on when parsing large
  volumes of context."
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic developer docs, "Context windows" (undated; the page lists models released after
  the display date, so it has been updated recently). PRIMARY. Fetch tool. Quote: "The
  'context window' refers to all the text a language model can reference when generating a
  response, including the response itself." Also: "This makes curating what's in context just
  as important as how much space is available." Flag: undated. Cite the dated engineering
  post instead and use this page for wording only.
  https://platform.claude.com/docs/en/build-with-claude/context-windows
- Why it matters for the article: the window is finite and quality degrades as it fills, so
  what a department puts in front of the model is a selection problem, which is a curation
  problem. Anthropic's own docs say curation matters as much as capacity.

**2. Context engineering**

- Origin. The term spread in June 2025 through two posts on X. Tobi Lütke (CEO, Shopify)
  wrote that he preferred "context engineering" to "prompt engineering" and defined it as
  "the art of providing all the context for the task to be plausibly solvable by the LLM."
  Andrej Karpathy replied "+1" and called it "the delicate art and science of filling the
  context window with just the right information for the next step." Both quotes are
  reproduced on Simon Willison's blog post "Context engineering" (2025-06-27). PRIMARY for
  Willison; the X posts are the primaries and were not fetched. The Karpathy post URL from
  search results is https://x.com/karpathy/status/1937902205765607626 (not verified). The
  search summary dates Lütke's post to 2025-06-19 and Karpathy's to 2025-06-25; treat those
  day dates as unverified and cite Willison's 2025-06-27 page.
  https://simonwillison.net/2025/Jun/27/context-engineering/
- Best current definition. Anthropic (2025-09-29, above): "Context engineering refers to the
  set of strategies for curating and maintaining the optimal set of tokens (information)
  during LLM inference, including all the other information that may land there outside of
  the prompts." The post contrasts it with prompt engineering ("methods for writing and
  organizing LLM instructions for optimal outcomes") and says context engineering manages
  "the entire context state (system instructions, tools, Model Context Protocol (MCP),
  external data, message history, etc)." Fetch tool; wording consistent with the search
  summary.
- Legal industry uptake. Already in the library: Ed Walters (Clio), "Out: Prompt engineering.
  In: Context engineering," and Winston Weinberg (Harvey), "In 2026, context wins," both in
  Artificial Lawyer Predictions 2026 (2026-01-08), confirmed verbatim in the earlier track.
- One-sentence definition for the article: context engineering is the discipline of deciding
  what information, instructions, examples, and tools a model is given for a task, and it is
  the discipline in which a department's knowledge management output is consumed.

**3. Grounding**

- Definition for a legal operations reader: grounding ties a model's answer to specific
  source material supplied at answer time, so the answer can be checked against that material.
- Google Cloud, Vertex AI "Grounding overview". PRIMARY. Raw text. Quote: "In generative AI,
  grounding is the ability to connect model output to verifiable sources of information."
  Also: "grounding tethers their output to these data and reduces the chances of inventing
  content." The page footer reads "Last updated 2026-09-18 UTC", which is after the display
  date. No Internet Archive snapshot exists. Flag: cannot be cited under the 2026-09-14
  display date unless an earlier dated copy is found. The wording has been on this page for a
  long time, but that cannot be shown from the live page alone.
  https://docs.cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview
- Microsoft Learn, "Semantic indexing for Microsoft Copilot" (ms.date 2026-04-23; updated_at
  2026-08-18). PRIMARY. Raw text. Quote: "Semantic indexing provides the grounding data for
  knowledge retrieval via Microsoft Copilot by understanding the intent of your query and
  appending additional information to your Microsoft Copilot prompt." Usable under the
  display date.
  https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot
- Microsoft Learn, "How does Microsoft Copilot work?" (ms.date 2026-09-14). PRIMARY.
  Quote: "Grounding improves the specificity of your prompt, and helps you get answers that
  are relevant and actionable to your specific task." Flag: dated exactly on the display
  date, so out for this piece.
  https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-architecture
- Thomson Reuters figure already in the library: 94% of professionals demand AI outputs
  grounded in authoritative content (TR blog, 2026-07-02, confirmed).

**4. Retrieval-augmented generation (RAG)**

- Definition for a legal operations reader: the system searches a body of documents at the
  moment of the question and hands the best matches to the model before it answers.
- Origin paper: Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP
  Tasks," arXiv 2005.11401, submitted 2020-05-22 (v4 2021-04-12), published at NeurIPS 2020.
  PRIMARY. Authors: Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir
  Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel,
  Sebastian Riedel, Douwe Kiela. The abstract describes RAG as combining "pre-trained
  parametric and non-parametric memory for language generation" (search summary; the fetch
  tool truncated the abstract). Check the abstract wording on arXiv before quoting.
  https://arxiv.org/abs/2005.11401
- OpenAI developer guide, "Optimizing LLM accuracy" (undated). VENDOR/PRIMARY. Fetch tool.
  Quote: "RAG is the process of Retrieving content to Augment your LLM's prompt before
  Generating an answer." Also: "It is used to give the model access to domain-specific
  context to solve a task." Flag: undated page.
  https://developers.openai.com/api/docs/guides/optimizing-llm-accuracy
- LexisNexis (Serena Wellen, VP Product Management), "How Lexis+ AI Delivers Trustworthy
  Linked Legal Citations" (2024-05-03). VENDOR. Fetch tool. Quote: "RAG is a technique for
  enhancing the accuracy and reliability of Gen AI models with facts fetched from
  authoritative sources." Also: "The proprietary RAG platform we have built at LexisNexis
  enables Lexis+ AI to ground its responses directly in the most comprehensive collection of
  legal content". Vendor statement of its own architecture; usable under the naming rule.
  https://www.lexisnexis.com/community/insights/legal/b/product-features/posts/how-lexis-ai-delivers-hallucination-free-linked-legal-citations
- The library already holds the Stanford RegLab finding that RAG-based legal research tools
  still hallucinated 17% to 33% of the time. New in this round: the journal version. Magesh,
  Surani, Dahl, Suzgun, Manning, Ho, "Hallucination-Free? Assessing the Reliability of Leading
  AI Legal Research Tools," Journal of Empirical Legal Studies, volume 22, issue 2, pages 216
  to 242 (2025; the search summary gives June 2025). PRIMARY (peer-reviewed). Not fetched;
  the Wiley abstract page is https://onlinelibrary.wiley.com/doi/abs/10.1111/jels.12413 and
  a Stanford copy is at https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf.
  This gives the article a 2025 citation for a finding the idea file treats as 2024
  background.

**5. Embeddings, chunking, and vector search**

- Definitions for a legal operations reader: an embedding is a numeric representation of a
  passage's meaning; chunking is cutting documents into passages small enough to embed and
  retrieve; vector search finds passages whose meaning is close to the question rather than
  passages that share its words.
- OpenAI developer guide, "Embeddings" (undated). VENDOR/PRIMARY. Fetch tool. Quote: "An
  embedding is a vector (list) of floating point numbers. The distance between two vectors
  measures their relatedness." Flag: undated page.
  https://developers.openai.com/api/docs/guides/embeddings
- Microsoft Learn, "Semantic indexing for Microsoft Copilot" (ms.date 2026-04-23). PRIMARY.
  Raw text. Quote: "A vector is a numerical representation of a word, image pixel, or other
  data point." Also: "Vectors are stored in multi-dimensional spaces where semantically
  similar data points are clustered together in the vector space". Dated; usable.
- Microsoft Learn, Azure AI Search, "Chunk documents" (ms.date 2026-06-08; updated_at
  2026-08-31). PRIMARY. Raw text. Quote: "Partitioning large documents into smaller chunks
  can help you stay under the maximum token input limits of chat completion and embedding
  models." Also: "Partitioning your content into chunks helps you meet input token
  requirements and prevents data loss due to truncation." The page recommends starting with
  "a chunk size of 512 tokens (approximately 2,000 characters) and an initial overlap of 25%".
  Note the page's first line describes Foundry IQ as turning "enterprise content into
  reusable, permission-aware knowledge bases for agents", which is a neutral vendor phrase
  for the permission point in Part B.
  https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents
- Why it matters for the article: chunking is where a document loses its document-level
  wrapper (author, date, status, permissions) unless the pipeline carries that metadata
  with every chunk. This is the technical root of the Part B risk.

**6. System prompts and instructions**

- Definition for a legal operations reader: the standing instructions that sit in front of
  every conversation and tell the model what role it plays, what rules it follows, and how
  it should behave.
- Anthropic API reference, Messages, description of the `system` parameter (undated).
  PRIMARY. Fetch tool. Quote: "A system prompt is a way of providing context and
  instructions to Claude, such as specifying a particular goal or role." Flag: undated.
  https://platform.claude.com/docs/en/api/messages
- Anthropic engineering post (2025-09-29, dated): "System prompts should be extremely clear
  and use simple, direct language that presents ideas at the right altitude for the agent."
  Also the definition of the context state as including "system instructions".

**7. Agent skills, tools, and playbooks as configuration**

- Definitions for a legal operations reader: a tool is a function the model may call to fetch
  information or act; a skill is a packaged set of instructions and resources the model
  loads when a task calls for it; a playbook, in the AI products now shipping, is a
  configuration file that states the department's positions and escalation rules.
- Anthropic, "Introducing Agent Skills" (2025-10-16). PRIMARY. Fetch tool. Quote: "Skills
  are folders that include instructions, scripts, and resources that Claude can load when
  needed." Also: "Claude will only access a skill when it's relevant to the task at hand."
  And: "Think of Skills as custom onboarding materials that let you package expertise,
  making Claude a specialist on what matters most to you."
  https://claude.com/blog/skills (the original anthropic.com/news/skills URL redirects here)
- Agent Skills open standard, agentskills.io (undated; trade coverage dates the open
  standard release to 2025-12-18, not verified here). PRIMARY. Fetch tool, page text
  returned in full. Quote: "Skills solve this by packaging procedural knowledge and
  company-, team-, and user-specific context into portable, version-controlled folders that
  agents load on demand." The page names "legal review processes" as an example of domain
  expertise a skill can capture, and describes "progressive disclosure" in three stages
  (discovery, activation, execution). Flag: undated.
  https://agentskills.io/
- Tools. Anthropic engineering post (2025-09-29): "Tools allow agents to operate with their
  environment and pull in new, additional context as they work." Anthropic API reference,
  `tools` parameter: "Definitions of tools that the model may use."
- Model Context Protocol site (undated; references a 2026-07-28 specification version).
  PRIMARY. Fetch tool. Quote: "MCP (Model Context Protocol) is an open-source standard for
  connecting AI applications to external systems." Flag: undated. The library's
  `open-platforms-api-mcp-build` track covers MCP in depth.
  https://modelcontextprotocol.io/
- Playbooks as configuration. Anthropic legal plugin page (undated; release 2026-01-30 per
  LawSites, confirmed in the earlier track). VENDOR/PRIMARY. Fetch tool, re-verified this
  round. Quote: "Configure your playbook in a local settings file to define standard
  positions, acceptable ranges, and escalation triggers."
  https://claude.com/plugins/legal
- Library item, for the record: Gal Bakal, arXiv 2603.14805 (2026-03-16), on skills as the
  institutional knowledge primitive. Not re-checked this round.

**8. Few-shot examples and gold-standard answers**

- Definitions for a legal operations reader: a few-shot example is a worked example placed in
  the prompt to show the model what a good answer looks like; a gold-standard answer is an
  approved answer to a known question, used either as an example or as the reference an
  evaluation compares against.
- Origin: Brown et al., "Language Models are Few-Shot Learners," arXiv 2005.14165, submitted
  2020-05-28. PRIMARY. Fetch tool. The abstract describes "tasks and few-shot demonstrations
  specified purely via text interaction with the model".
  https://arxiv.org/abs/2005.14165
- Anthropic engineering post (2025-09-29): "Providing examples, otherwise known as few-shot
  prompting, is a well known best practice."
- OpenAI, "Optimizing LLM accuracy" (undated): "This is why a good prompt with an evaluation
  set of questions and ground truth answers is the best output from this stage." Also, on
  bringing examples in through retrieval: "Add a retrieval step so the few-shot examples are
  brought in dynamically based on the question." Flag: undated.

**9. Evaluation sets and benchmarks**

- Definition for a legal operations reader: an evaluation set is a collection of real
  questions with approved answers and grading criteria, run against the system to measure
  how often it is right; a benchmark is a published evaluation set used to compare systems.
- Anthropic developer docs, "Define success criteria and build evaluations" (undated).
  PRIMARY. Fetch tool. Quotes: "Design evals that mirror your real-world task distribution."
  "Exact match evals measure whether the model's output matches a predefined correct answer".
  "More questions with slightly lower signal automated grading is better than fewer
  questions with high-quality human hand-graded evals." Flag: undated.
  https://platform.claude.com/docs/en/test-and-evaluate/develop-tests
- Vals Legal AI Report (2025-02-27). Already confirmed in the library: consortium firms
  supplied questions, reference documents, ideal responses, and correctness criteria. A
  second Vals report, "VLAIR: Legal Research," appeared in October 2025 (LawSites,
  2025-10; search summary only; not fetched). It compared Alexi, Counsel Stack, Midpage, and
  ChatGPT against a lawyer baseline, with the AI systems near 80% accuracy and the lawyer
  baseline at 71%. Treat as a lead. https://www.lawnext.com/2025/10/vals-ais-latest-benchmark-finds-legal-and-general-ai-now-outperform-lawyers-in-legal-research-accuracy.html
- Stanford RegLab: see item 4 for the 2025 journal version.

**10. Fine-tuning versus retrieval, and which legal AI products use which**

- Definitions for a legal operations reader: fine-tuning changes the model itself by
  continuing its training on a chosen dataset; retrieval leaves the model unchanged and
  supplies the material at answer time.
- OpenAI, "Optimizing LLM accuracy" (undated): fine-tuning is where developers "continue
  the training process of the LLM on a smaller, domain-specific dataset to optimize it for
  the specific task." The guide frames RAG as "context optimization" ("This axis maximizes
  response accuracy") and fine-tuning as "LLM optimization" ("This axis maximizes
  consistency of behavior"). Flag: undated.
- Which products use which, from the vendors' own statements:
  - LexisNexis, Lexis+ AI: retrieval over LexisNexis editorial content (2024-05-03, item 4).
    A later Legal IT Insider item reports GraphRAG enhancements with the Shepard's knowledge
    graph (search summary; not fetched; legaltechnology.com has a bot wall).
  - Thomson Reuters, Westlaw AI-Assisted Research and CoCounsel: the TR law school page
    (undated) says "Learn how Westlaw uses prompt engineering and techniques like Retrieval
    Augmented Generation (RAG) to minimize errors and hallucinations." Fetch tool. Flag:
    undated; a dated TR statement was not located in this round.
    https://lawschool.thomsonreuters.com/gen-ai/
  - Harvey: the one documented case of a legal AI vendor going beyond retrieval. OpenAI,
    "Customizing models for legal professionals" (publication date in page data: 2024-04-02).
    VENDOR/PRIMARY. Raw text. Quotes: "They tried the obvious techniques first: fine-tuning
    foundation models via public APIs and building retrieval-augmented generation (RAG)
    systems. But they ran into limitations". "Recently, Harvey partnered with OpenAI to
    create a custom-trained case law model." "They added the equivalent of 10 billion tokens
    worth of data to power the custom-trained case law model." Weinberg: "97% of the time,
    the lawyers preferred the output from the case law model". The page uses
    "custom-trained", not "fine-tuned", for the final model. Note this is a vendor case study
    about public case law, not a customer's own knowledge, so it does not contradict the
    library's finding that departments do not fine-tune on their own knowledge.
    https://openai.com/index/harvey/
  - Stanford RegLab (2025 journal version) tested Lexis+ AI, Westlaw AI-Assisted Research,
    and Ask Practical Law AI, all retrieval-based, which is why the study is about RAG.
- Bottom line for the article, unchanged from the library: the department's influence over
  AI accuracy runs through what it supplies at answer time (retrieval, instruction, example)
  and how it tests (evaluation), not through training the model. The one known custom-trained
  legal model was trained on public case law by a vendor.

### A.2 Mapping table: AI term to legal knowledge management content

| AI term | One-sentence definition for a legal operations reader | Knowledge management content that maps to it | Dated source that passes the 2026-09-14 display date |
|---|---|---|---|
| Context; context window | Everything the model can see when it answers, within a fixed capacity that degrades as it fills. | All of the department's curated material, because every item competes for the same finite window; the reason curation and selection matter. | Anthropic engineering post, 2025-09-29 |
| Context engineering | The discipline of choosing what information, instructions, examples, and tools the model is given for a task. | The whole knowledge management output, consumed as a set: corpus, playbooks, examples, and evaluation material assembled per task. | Willison, 2025-06-27 (Lütke and Karpathy quotes); Anthropic, 2025-09-29; Artificial Lawyer, 2026-01-08 (Walters, Weinberg) |
| Grounding | Tying an answer to specific source material supplied at answer time so it can be checked. | Precedents, memos, policies, and matter records with known author, date, and status; the material the answer must cite. | Microsoft Learn semantic index page, ms.date 2026-04-23; TR blog 2026-07-02 (94% demand grounding) |
| Retrieval-augmented generation | Searching a document set at question time and handing the best matches to the model before it answers. | The precedent bank, clause library, matter histories, and intake answers, indexed so they can be found; quality of the corpus is the controlling variable. | Lewis et al., 2020-05-22; Stanford RegLab, JELS 2025; LexisNexis 2024-05-03 |
| Embeddings, chunking, vector search | Numeric representations of meaning, produced from passages cut from documents, searched by similarity rather than by keyword. | Every document in the corpus, cut into passages; the step where document-level metadata (author, date, status, permissions) is lost unless carried with each chunk. | Microsoft Learn, Azure AI Search chunking page, ms.date 2026-06-08; Microsoft Learn semantic index page, 2026-04-23 |
| System prompts and instructions | Standing instructions that set the model's role, rules, and behaviour for every conversation. | Department standards: tone, approval rules, what to escalate, what never to do; the written policy that used to live in an onboarding guide. | Anthropic engineering post, 2025-09-29 |
| Agent skills, tools, playbooks as configuration | Packaged procedures the model loads when relevant (skills), functions it may call (tools), and configuration files stating positions and escalation triggers (playbooks). | Negotiation playbooks with fallback positions, clause libraries, checklists, and process guides, rewritten as machine-readable configuration. | Anthropic Agent Skills, 2025-10-16; Anthropic legal plugin (release 2026-01-30 per LawSites 2026-02-03) |
| Few-shot examples and gold-standard answers | Worked examples placed in the prompt, and approved answers to known questions. | Model documents, best-in-class memos, and approved intake answers; expert corrections of AI output become the next examples. | Brown et al., 2020-05-28; Anthropic engineering post, 2025-09-29 |
| Evaluation sets and benchmarks | Real questions with approved answers and grading criteria, used to measure how often the system is right. | Finished work product repurposed as reference answers; correctness criteria written by practice-area reviewers; decision logs that record what the right call was. | Vals Legal AI Report, 2025-02-27; Stanford RegLab, JELS 2025 |
| Fine-tuning versus retrieval | Changing the model by further training, versus leaving it unchanged and supplying material at answer time. | Retrieval consumes the curated corpus; fine-tuning would consume a training set, which no department or firm was found to build from its own knowledge. | OpenAI Harvey case study, 2024-04-02 (the vendor exception, on public case law); LexisNexis 2024-05-03 |

Mapping to the writer's six content types:
- Precedents: grounding, RAG, embeddings and chunking (they are the corpus).
- Clause libraries: playbooks as configuration (fallback positions) and grounding (the
  approved text).
- Playbooks: system prompts and instructions, agent skills, playbook configuration files.
- Matter histories: RAG and grounding (what the department did before); context engineering
  (situational context, the Weinberg point that "context wins").
- Decision logs: evaluation sets (they record the right call and why) and few-shot examples.
- Expert corrections: gold-standard answers and evaluation sets (each correction is a
  labelled test case); the least collected and the most direct feedback signal.

---

## Part B. Permissions, ethical walls, and permission trimming (neutral sources)

### B.1 The risk: vector stores and indexes can lose or bypass document-level permissions

- OWASP Gen AI Security Project, "LLM08:2025 Vector and Embedding Weaknesses" (part of the
  OWASP Top 10 for LLM Applications 2025; the page is undated; the 2025 list was released in
  November 2024, from memory, not verified this round). PRIMARY (standards body, non-vendor).
  Fetch tool. Quotes: "Inadequate or misaligned access controls can lead to unauthorized
  access to embeddings containing sensitive information." "In multi-tenant environments
  where multiple classes of users or applications share the same vector database, there's a
  risk of context leakage between users or queries." Mitigation: "Implement fine-grained
  access controls and permission-aware vector and embedding stores. Ensure strict logical and
  access partitioning of datasets in the vector database to prevent unauthorized access
  between different classes of users or different groups." The page's example scenario
  describes how "embeddings from one group might be inadvertently retrieved in response to
  queries from another group's LLM, potentially leaking sensitive business information."
  https://genai.owasp.org/llmrisk/llm08-excessive-agency/ (the URL slug is misleading; the
  page title is LLM08:2025 Vector and Embedding Weaknesses)
  This is the neutral source the idea file asked for in place of the Hintyr vendor blog. It
  does not use the phrase "strip away the permission metadata"; it says access controls can
  be "inadequate or misaligned" and calls for "permission-aware" stores, which is the same
  point stated as a control requirement.
- Academic: Ayush RoyChowdhury, Mulong Luo, Prateek Sahu, Sarbartha Banerjee, Mohit Tiwari
  (UT Austin), "ConfusedPilot: Confused Deputy Risks in RAG-based LLMs," arXiv 2408.04870
  (v1 2024-08-09; v5 2024-10-23). PRIMARY (preprint). Fetch tool. The abstract describes "a
  vulnerability that leaks secret data, which leverages the caching mechanism during
  retrieval". The paper's setting is Microsoft 365 Copilot; the confidentiality finding is
  that retrieval caches can return material after the source document's access was removed.
  Author list taken from search results; confirm on the arXiv page before citing names.
  https://arxiv.org/abs/2408.04870
- Further academic leads surfaced by search, not read: "Secure Multifaceted-RAG for
  Enterprise: Hybrid Knowledge Retrieval with Security Filtering" (arXiv 2504.13425, 2025);
  "SoK: Privacy Risks and Mitigations in Retrieval-Augmented Generation Systems" (arXiv
  2601.03979); "Integrating Access Control with Retrieval-Augmented Generation" (ACM SAC
  2025, doi 10.1145/3672608.3707848).

### B.2 How enterprise retrieval enforces permission trimming (Microsoft Learn)

- Microsoft Learn, "Semantic indexing for Microsoft Copilot" (ms.date 2026-04-23; updated_at
  2026-08-18). PRIMARY. Raw text. Quotes: "When data is indexed, we continue to honor the
  user identity-based access boundary so that the grounding process only accesses content
  that the current user is authorized to access." "Semantic indexing works only with content
  to which your users already have permission and doesn't affect storage quotas." "It's
  important to note that indexing data doesn't change access permissions to content and
  doesn't change the principles of how users should share information with colleagues."
  "Sensitivity labels are also included in search trimming". Also: "it only surfaces the
  results to a user if the user already has access to the content controlled by role-based
  access control." And for third-party content: "Once in Microsoft Graph, that content is
  indexed so that Copilot may access it - while maintaining access controls for content."
  https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot
- Microsoft Learn, "Security for Microsoft Copilot" (ms.date 2026-08-17). PRIMARY. Raw
  text. Quotes: "Copilot only accesses data that users are authorized to access, and it
  respects Microsoft 365 compliance, privacy, and data residency commitments." "Microsoft
  Copilot operates within existing permissions and access controls. Overshared or poorly
  governed content can affect Copilot results and increase risk."
  https://learn.microsoft.com/en-us/microsoft-365/copilot/security-microsoft-365-copilot
- Microsoft Learn, Microsoft Graph, "Create, update, and delete items in a Microsoft Graph
  connection" (ms.date 2024-11-07; updated 2025-08-06). PRIMARY. Raw text. This is the
  mechanism: every external item carries an access control list. Quotes: "An externalItem
  has three key components: access control list, properties, and content." "The access
  control list (ACL) is used to specify whether the given roles are granted or denied access
  to view items in Microsoft experiences." "The accessType value deny takes precedence over
  grant." For non-directory groups such as ethical-wall teams: "you can create external
  groups in Microsoft Graph by using the group sync APIs to replicate the allow or deny
  permissions."
  https://learn.microsoft.com/en-us/graph/connecting-external-content-manage-items
- The operational lesson for the article, stated neutrally: permission trimming in an
  enterprise index works because each indexed item carries its ACL and the query is filtered
  by the requesting user's identity. Any pipeline that copies documents into a separate
  vector store (the "micro and incomplete DMSs" that Josh Baxter of NetDocuments described
  to CCBJ on 2026-08-31, verified raw text) has to rebuild that mechanism, and OWASP treats
  the failure to do so as a top-ten weakness.
- The Hintyr claim in the library ("Vector embeddings strip away the permission metadata")
  can now be replaced with OWASP LLM08 plus the Microsoft Graph ACL page, which together say
  the same thing without vendor interest.

---

## Part C. Second check of the gap-track items

All five items were re-read this round. Four were read as raw text (HTML or JSON feed). The
Embry piece was read as raw HTML this round (the earlier fact-checker could not).

### C.1 Harbor, "ILTACON 2026: Why AI usage isn't the same as AI value"

- Confirmed. Author Justin Farmer, Practice Group Leader, Enterprise Solutions. Date shown on
  page: "11 Sep 2026". Raw text. Usable under the display date.
  https://harborglobal.com/insights/briefs/iltacon-2026-why-ai-usage-isnt-the-same-as-ai-value/
- Verbatim, raw text:
  - "A recurring theme across ILTACON's marketing technology and knowledge management
    sessions was that clean, connected data is the precondition for AI producing anything
    useful."
  - "point it at a broken one and it will still return a confident answer, just a wrong one."
  - "govern only the data behind a specific, recurring deliverable, such as a report produced
    regularly or a request fielded constantly, and expand from there."
  - "A recurring frustration raised in roundtable discussions was fragmented ownership of AI
    security and governance decisions across IT, Risk, the General Counsel's office, and
    knowledge management, with client requirements increasingly arriving through outside
    counsel guidelines faster than internal policy can keep pace."
  - "Governance needs a clear owner and a defined, visible conversation."
  - Snapshot line at the top: "Better data, clear ownership, and practice-specific workflows
    determine whether that use creates value."
- New detail that changes a sentence in the idea file. Harbor's own report is named on the
  page as "Operationalizing AI: Transforming AI investment into business and client value,"
  and the finding is stated as "0% of participating top-tier law firms and global in-house
  departments have a mature framework for measuring AI's business impact, despite a 41%
  increase in average annual law firm software spending between 2021 and 2025." Harbor's
  wording includes in-house departments among the participants; Embry's quotation (C.4)
  says "No participating firm". The article should quote one or the other exactly and not
  merge them. If it wants the in-house angle, Harbor's own sentence is the one to use.
- Caveat stands: consultancy source, methodology not disclosed.

### C.2 CCBJ, Kristin Calve, three ILTACON pieces, 2026-08-31

- All three pages show "Published August 31, 2026" and "Contributed by Kristin Calve" (Editor).
  Raw text. Usable under the display date.
- "Matter Centricity 2.0: Legal AI Rediscovers the Matter"
  https://ccbjournal.com/blog/matter-centricity-2-0-legal-ai-rediscovers-the-matter
  - Attribution corrected against the fetch tool. The sentence "The bottleneck may not always
    be model quality; it may be record quality." is Calve's own narrative sentence, not in
    quotation marks, following Walker's quote. The fetch tool attributed it to Paul Walker
    this round; the raw text shows it is the author's. The earlier notes had it right.
    Full passage, raw text: "For in-house legal teams, that may prove to be one of the more
    important lessons of the AI transition. The bottleneck may not always be model quality;
    it may be record quality. A machine can produce an elegant narrative from an incomplete
    record, but elegance does not cure the incompleteness."
  - Walker (iManage, Global Solutions Director), raw text: "We're right back at taxonomy,"
    and "Now it provides context for AI," and "It makes the AI safe to operate." On
    corporates: "It'll be interesting when we turn it on on some corporates to see how that
    story meanders," Walker said, "if we're missing parts of the conversation because they
    never got into the matter file."
- "At ILTACON, Legal AI Confronts 'Good Enough'"
  https://ccbjournal.com/blog/at-iltacon-legal-ai-confronts-good-enough
  - Raw text: "How much better does the result need to be to justify paying more for it?"
    "What they cannot swap out so readily is what surrounds them: decades of documents,
    matter histories, work product and institutional knowledge and a clean answer to who is
    entitled to see what." "When the information can meet lawyers wherever they enter, value
    doesn't disappear with the interface. It settles deeper into the stack."
- "Rented Models, Enduring Memory"
  https://ccbjournal.com/blog/rented-models-enduring-memory
  - Raw text. Josh Baxter (CEO, NetDocuments): "They're rented," (of large language models).
    "That intelligence, that context, that's going to have a place of permanence," Baxter
    said. "It is the most valuable asset an organization has." An Am Law 20 firm "had 48
    different AI applications 'that they know of.'" Baxter's phrase "micro and incomplete
    DMSs" is glossed by Calve as "partial representations of institutional knowledge
    assembled for particular applications and potentially governed differently." Heath
    Harris (VP of Applied AI): "How do I turn millions of documents into a structured
    database?" and, to a bank's chief AI officer, "I think I've just turned your DMS into a
    structured database that you can put into your enterprise data warehouse." Calve on the
    NetDocuments benchmark: "It is a vendor-run benchmark and should be read as such".
    Note: the sentence in the earlier notes beginning "Making more of legal's institutional
    knowledge available as data" was not re-located in this pass; check before quoting.

### C.3 CLOC Global Institute 2026, the JPMorganChase and Guggenheim session

- Confirmed from the live Sessionboard feed that renders
  https://globalinstitute.cloc.org/full-program/ (embed id
  bf699bda-0971-49fd-a6eb-b9e274de521d; feed endpoint
  https://api.sessionboard.com/embed/v2/bf699bda-0971-49fd-a6eb-b9e274de521d/async-data?dataType=schedule).
  PRIMARY. Raw JSON. Record updated 2026-04-27. Usable under any series date from 2026-06-14.
- Agenda entry (title kept verbatim for reference; the draft should not quote it, per the
  idea file's lint note): "Supercharge Legal Operations: Harness Legal Knowledge Like Never
  Before". Session id SESS-159. Tuesday, May 12, 2026, 2:15 PM to 3:00 PM (America/Chicago),
  room W178. Format: Best Practices Presentation. Level: Foundational. Track: AI Training,
  Implementation & Governance. Tags: Knowledge Management, Technology. CLOC Core 12 areas:
  Business Intelligence, Knowledge Management, Strategic Planning, Technology.
- Speakers as listed in the feed (name, title, company):
  - Jamal Brown, Head of Legal Operations, Guggenheim Investments. His bio text in the same
    record says he "is the Head of Legal Operations and Knowledge Management at JPMorgan
    Chase (JPMC)" overseeing teams including the "Knowledge Management Program". The listing
    and the bio disagree on his employer; the bio may be stale. Do not state his employer
    without a second source.
  - Sadie Khodorkovsky, Managing Director eDiscovery Legal Operations and Knowledge
    Management, JPMorganChase. Bio: "leading their global eDiscovery group, Legal Discovery
    Management (LDM) and overseeing the Legal Operations and Knowledge Management functions."
  - Leslie Jordan, Knowledge Management Librarian, JPMorganChase. Bio describes her as "a
    Vice President of Legal Operations Solutions Manager at JP Morgan".
  - Jen Hugo, Vice President of Legal Operations, JPMorganChase, "and Legal Records
    Management Lead".
- Description, raw text, selected sentences: "AI is fundamentally changing legal operations by
  enabling Knowledge Discovery"; "This transforms static archives into dynamic, searchable
  knowledge bases."; "Currently, legal operations struggle with fragmented information and
  missed collaboration opportunities."; "Knowledge that powers Legal review of agreements,
  self-service support,".
- Also re-confirmed from the same feed: the Uber case study "From Zero to AI: The Success of
  Product Legal AI Assistant (A Case Study)" (Alexander Shusterman, Staff Technical Program
  Manager, CLO AI; Carolyn Wakulchik, Manager, CLO Operations) describes "the essential
  process of training the model on our curated legal knowledge base to ensure relevance and
  verifiable accuracy." The word "training" here is the session's own; the article should
  not read it as fine-tuning. And "CLOC Academy 200 Level: Knowledge Management" (Ben
  Clemson, Principal, Legal Operations, AustralianSuper; sponsored by Workday) describes
  methods "to capture, organize, and leverage institutional knowledge" with no mention of AI.

### C.4 Stephen Embry, Above the Law, 2026-08-25

- Confirmed. Raw HTML (the page returned 200 to curl with a browser user agent this round).
  Title "Law Firms Are Buying AI: But Are They Really Using It?"; byline "By Stephen Embry
  on August 25, 2026 4:04 pm". Usable under the display date.
  https://abovethelaw.com/2026/08/law-firms-are-buying-ai-but-are-they-really-using-it/
- The "mature framework" sentence is presented by Embry as a quotation from Harbor: "Here is
  the critical finding: 'No participating firm in Harbor's 2026 legal lab reported having a
  mature framework for measuring AI's business impact.'" Attribute it to Harbor as quoted
  by Embry. See C.1 for Harbor's own, differently worded version.
- Embry's own sentences, raw text: "The average spend on technology increased 41% from 2021 to
  2025. Moreover, that spend is now 5% to 6% of overall firm revenue." And: "without
  obtaining the methodology and information about the data, we have to take them with a
  grain of salt." He also quotes Harbor: "Firms are measuring AI activity more effectively
  than AI impact."

### C.5 CLOC AI Intensive announcement, 2026-08-19

- Confirmed. PRWeb release, dateline "SAN JOSE, Calif., Aug. 19, 2026 /PRNewswire-PRWeb/".
  Headline: "CLOC Launches 'AI Intensive' Practitioner-Led AI Training for Legal Operations".
  PRIMARY. Fetch tool (wording consistent with the search summary and the earlier gap
  track). Usable under the display date.
  https://www.prweb.com/releases/cloc-launches-ai-intensive-practitioner-led-ai-training-for-legal-operations-302854864.html
- First paragraph, fetch tool: "CLOC (Corporate Legal Operations Consortium), the leading
  global membership organization dedicated to transforming the business and practice of law,
  today announced the launch of its AI Intensive, a program created and led by legal
  operations practitioners to help teams move beyond AI experimentation into full enterprise
  deployment." Inaugural event Tuesday, October 27, 2026, Eversheds Sutherland, New York
  City, 8:30 am to 6:00 pm; "approximately 40 participants"; attendees take part in
  "real-time prompting exercises, workflow and agent design, and implementation planning."
- Oyango Snell (President and CEO, CLOC): "The organizations that win will be the ones that
  move past pilot programs and build real operational capability."
- Alex Gao (CLOC board member; Senior Director, Legal Operations, Hilton Worldwide): "By
  grounding this program in peer-to-peer collaboration and applied execution, we are helping
  leaders improve legal service delivery at every stage of maturity."
- The release mentions an online hub with "governance templates, benchmarking reports" and
  integration with "Core 12 competency pathways and certification curriculum." Knowledge
  management is not mentioned in the release. This supports the idea file's point that AI is
  entering CLOC's program through training while the Core 12 text is unchanged, and it can
  be cited in place of the 2026-09-16 certification release, which is out of date range.

---

## Part D. In-house knowledge management staffing benchmarks and surveys

### D.1 Found: knowledge management as a legal operations responsibility (CLOC)

- CLOC 2025 State of the Industry Report, PDF (released 2025-02-12 per the CLOC newsdesk;
  data from the 2024 Harbor Law Department Survey in collaboration with CLOC; "responses
  from 186 organizations across more than 15 industries and 14 countries"). PRIMARY. Raw
  PDF text. Usable under any series date from 2026-06-14.
  https://cloc.org/wp-content/uploads/2025/02/2025-CLOC-2025-SOTI-Report.pdf
  Release: https://cloc.org/newsdesk/2025-state-of-the-industry-report/
- Page 12, "Legal Operations Scope", chart "WHICH SERVICES FALL WITHIN YOUR LEGAL OPERATIONS
  RESPONSIBILITIES?": Outside Counsel/Vendor Management 95%, Technology Strategy 91%,
  Technology Administration 88%, Program/Project Management 84%, Financial Management 80%,
  Knowledge Management 79%, Strategic Planning 71%, Training & Development 71%, Business
  Intelligence 65%, Org Design, Support & Management 58%, Service Delivery Models 51%,
  Information Governance 50%, e-Discovery 44%, DEI 40%, Talent Management 32%. Text: "At
  least 50% of departments have 12 of the 15 services listed below within their legal
  operations team's responsibilities." (The pairing of labels to percentages follows the
  order in the extracted text and matches the trade summary below; confirm against the
  rendered chart before printing a figure other than 79%.)
- Year-over-year: Stephen Embry, Above the Law, "Interpreting The 2025 CLOC In-House Survey
  Results" (2025-05-09). TRADE. Fetch tool. Quote: "Knowledge management went from 71% to
  79%, suggesting AI tools and data may enable legal ops professionals to play a greater
  role here, potentially reducing reliance on traditional law librarian roles." Also:
  "Citation of business intelligence as something legal ops could contribute increased from
  58% to 65%". The 71% prior-year figure was not checked against the 2024 report PDF.
  https://abovethelaw.com/2025/05/interpreting-the-2025-cloc-in-house-survey-results/
- What this does for the article: it is the survey evidence the idea file lists as missing
  under "What the research did not find" (survey evidence that legal operations owns
  knowledge). It shows that in the departments CLOC and Harbor surveyed, roughly four in
  five already place knowledge management inside the legal operations remit, and that the
  share rose between the two surveys. It does not show who curates knowledge for AI, and it
  does not measure knowledge management headcount. The article can say that the
  responsibility is already commonly assigned to legal operations, then argue what the
  responsibility now requires.
- Capacity data from the same report (page 11, "Legal Operations Headcount"): "The size of
  legal operations teams has remained unchanged since 2023, with a median function size of
  5 FTEs." Median legal operations function size by company revenue: 2 FTEs (less than 3
  billion dollars), 4 FTEs (3 to 15 billion), 7 FTEs (15 to 40 billion), 10 FTEs (greater
  than 40 billion). A second table on the same page gives median legal operations
  professionals by size band as 2, 3, 6, and 8; the two tables use different bases, so quote
  the 5-FTE median and cite the page rather than reconciling them. This supports the
  capacity comparison in argument 7: a median legal operations function of five people
  carries knowledge management alongside eleven other services.
- The 2026 State of the Industry Report (released 2026-03-02; 135 departments) was not
  available as a public PDF; the newsdesk release and the 2026-03-02 CLOC blog post do not
  repeat the services chart. Whether the 2026 edition carries a knowledge management figure
  is unknown.

### D.2 Found: Thomson Reuters 2025 Legal Department Operations Index

- Thomson Reuters Institute, "2025 Legal Department Operations Index" (PDF at a September
  2025 path; survey "conducted in July 2025. There were 128 responses collected from
  respondents within legal departments"). PRIMARY. Raw PDF text. Usable from 2026-06-14.
  https://www.thomsonreuters.com/en-us/posts/wp-content/uploads/sites/20/2025/09/Legal-Department-Operations-Index-2025.pdf
- Relevant lines: "A large portion (82%) of respondents indicate their legal department has at
  least one dedicated legal ops role on their team." "45% of respondents classify themselves
  as 'General Counsel tasked to run legal operations'". On knowledge management software:
  "more of them are being ranked as being under-utilized compared to valuable. This
  phenomenon is seen in some of the most popular and commonly used tech solutions, such as
  knowledge management, legal workflow automation, legal task management, and AI-driven
  contract work." No knowledge management staffing figure.

### D.3 Not found

- No ACC, CLOC, Thomson Reuters, or Blickstein figure for the share of corporate legal
  departments with a dedicated knowledge management professional, or for knowledge
  management headcount or budget, dated on or before 2026-09-13.
- ACC and Major, Lindsey & Africa Law Department Management Benchmarking Survey (press release
  on mlaglobal.com, undated; "421 legal departments in organizations spanning 24 industries
  and 32 countries"): the release breaks out lawyers by litigation (14%) and intellectual
  property (7%) and gives nothing for knowledge management. The full report restricts reuse
  (see the library README).
- Blickstein Group Law Department Operations Survey, 18th annual (2025), with FTI Technology,
  68 companies (search summary): the public pages mention no knowledge management figure;
  the Wolters Kluwer summary page returned 403; the report itself was not read.
- ACC 2026 Chief Legal Officers Survey (1,049 CLOs, 43 countries, per search summary): not
  read; acc.com blocks automated access and the FTI-hosted copy was not fetched.
- The ACC Maturity Model 2.0 line ("At least one full-time dedicated KM professional" as an
  advanced-stage marker) remains the only association text on in-house knowledge management
  staffing, as the library already records.

---

## Sources dated after 2026-09-13 that surfaced and are excluded

- Google Cloud grounding overview, last updated 2026-09-18.
- Microsoft Learn, "How does Microsoft Copilot work?", ms.date 2026-09-14.
- Technology.org, "OpenAI Astra for Law Takes Aim at Legal AI" (2026-09-18), surfaced by a
  Harvey search; not read.
- Soutron guide updated 2026-09-18 (already noted in the library).

## Gaps remaining after this round

1. A dated, neutral definition of grounding that passes the display date. The Google page
   is dated 2026-09-18 and the Microsoft architecture page 2026-09-14. The Microsoft semantic
   index page (2026-04-23) uses the term but does not define it in one sentence.
2. Dated versions of the OpenAI guides (optimizing accuracy, embeddings) and the Anthropic
   developer docs (context windows, evaluations, API reference). All are undated live pages.
   The dated anchors are Lewis et al. 2020, Brown et al. 2020, and the Anthropic engineering
   post of 2025-09-29.
3. A dated Thomson Reuters statement that CoCounsel or Westlaw AI-Assisted Research uses
   retrieval (the law school page is undated; the 2023-11-15 TR press release on PRNewswire
   may carry it and was not read).
4. The 71% prior-year knowledge management figure in the CLOC 2024 report PDF, and any
   knowledge management figure in the 2026 edition.
5. The OWASP Top 10 for LLM Applications 2025 release date (November 2024 from memory).
6. An in-house knowledge management headcount benchmark. None exists in the sources reached.
7. Jamal Brown's current employer (the CLOC feed lists Guggenheim Investments; his bio in
   the same record says JPMorgan Chase).
8. The ConfusedPilot author list was taken from search results and should be confirmed on
   arXiv before names are printed.
