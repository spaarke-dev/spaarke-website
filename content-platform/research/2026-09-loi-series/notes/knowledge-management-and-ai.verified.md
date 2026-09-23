# Verification notes — track: knowledge-management-and-ai

Checked 2026-09-21. Method: every source URL fetched directly. Because the WebFetch
summariser paraphrased "verbatim" quotes on at least two occasions (Fordon, Tiger Eye),
every quote below was re-checked against raw HTML/text pulled with curl and string-matched
(raw files in `scratchpad/research/kmv/`). WebSearch budget for the session was exhausted,
so no independent search was possible; verification relied on the cited URLs, the URLs in
the research agent's notes, CourtListener's API, and a reader proxy for Gartner (gartner.com
returns 403 to direct fetches).

Result: 15 findings — 10 confirmed, 5 corrected, 0 refuted, 0 unverified.

## Corrections that matter

1. **Gartner survey size (finding 8).** The release does NOT say "Q3 2024 survey of 248 data
   management leaders". Text seen: "Sixty-three percent of organizations either do not have or
   are unsure if they have the right data management practices for AI, according to a survey by
   Gartner. A survey of 1,203 data management leaders in July 2024 found ..." and "Gartner
   predicts that through 2026, organizations will abandon 60% of AI projects unsupported by
   AI-ready data." The string "248" does not appear. Format is a Q&A with Roxane Edjlali,
   STAMFORD, Conn., February 26, 2025. (Read via r.jina.ai reader proxy; gartner.com 403.)
2. **iManage "30%" (finding 7).** Release says: "Nearly one-third of organizations report
   experiencing a policy-impacting incident related to unregulated AI tools, and almost 30% have
   delayed AI adoption due to security concerns." The 30% figure is delayed adoption, not
   incidents. Incidents = "nearly one-third"; tools are "unregulated", not "unsanctioned".
   Quote punctuation is " - " (spaced hyphen), not an em dash.
3. **Thomson Reuters emerging-roles figures (finding 6).** The 39% / 33% / 32% role figures sit
   in the section "What is the impact on future roles?", which is framed around the **2024**
   Future of Professionals Report, not the 2026 reports. List also includes "IT and cybersecurity
   specialists — 37% and 35%". Exact 78%/6% wording: "78% of corporate clients say AI-enabled
   quality improvements are very important or essential, yet only 6% say most of their providers
   actually deliver it". Adoption sentence: "41% of law firms and 47% of corporate legal
   departments say their legal teams are using GenAI, up from 28% and 23%, respectively in 2025."
   Page H1 is "How AI is reshaping the legal profession"; the meta title is the one cited.
4. **Anthropic legal plugin launch date (finding 11).** Ambrogi (LawSites, 3 Feb 2026) says
   "on Jan. 30, Anthropic added a suite of plugins to Cowork" (11 open-sourced starter plugins on
   GitHub). 3 Feb 2026 is the date of Ambrogi's post and the date Legal.io gives for the
   announcement/sell-off ("When Anthropic announced a legal plugin ... on February 3"). Treat
   30 Jan as release, 3 Feb as market reaction. Thomson Reuters "fell as much as 18 percent in a
   single session" (intraday), RELX "dropped 14 percent", Wolters Kluwer "fell 13 percent".
5. **Heppner quote source (finding 14).** The quote is NOT on the Debevoise page cited (that post
   is dated 11 Feb and predates the written opinion). It is from Judge Rakoff's written
   Memorandum filed 17 Feb 2026 (25 Cr. 503 (JSR), ECF No. 27): "Because Claude is not an
   attorney, see ECF No. 23-6, that alone disposes ..." — so the ellipsis stands in for
   "see ECF No. 23-6,". Harvard Law Review Blog (March 2026) carries the quote.

## Minor notes (verdict still "confirmed")

- Finding 1: both Inside Practice quotes exact. NY event: Wednesday April 29, 2026, SUNY Global
  Center. Firm is now styled "McDermott Will & Schulte". London: Thursday 17 September 2026.
  Same London session blurb claims only 19% of firms report measurable AI productivity gains
  (not checked to a primary).
- Finding 2: quote exact; heading "Knowledge as a competitive weapon" exact. Byline in the piece is
  "Oz Benamram, Skills". Pillsbury Chief AI Officer appointment reported by Artificial Lawyer
  8 July 2026, i.e. after the prediction was made.
- Finding 3: quotes exact. The cited Q&A is dated **Mar 13, 2026** ("by Harvey Team"); the
  6 March date / 12 March dashboard belong to the companion post "Where Legal AI is Working"
  by Megan McMillin. Wording: "130 of the world's largest law firms".
- Finding 4: all quotes exact; 14 named speakers counted on the page; notes credited to Draftwise.
- Finding 5: ACC text exact (pp. 22-23 of the PDF). The ACC document DOES mention AI elsewhere
  (eDiscovery, IP management, analytics, technology functions) — it is only the KM function that
  is silent on AI. "At least one full-time dedicated KM professional" is one of 13 advanced-stage
  bullets, so "requires only" is an interpretation. CLOC Core 12 sentence exact; CLOC KM page
  (cloc.org/cloc-core-12/knowledge-management/) has no AI mention (summariser read only).
- Finding 9: RegLab abstract exact except the original begins "Recently, certain legal research
  providers ..."; arXiv version carries inline citations (Casetext, 2023 etc.). arXiv 2405.20362,
  submitted 30 May 2024. Fordon quotes exact. 58-88% comes from the separate "Large Legal
  Fictions" study of 2023 general-purpose models; "one in five" is Fordon's gloss on Vals
  78-81% accuracy.
- Finding 10: quote exact; four named + four anonymous firms; "over 500 samples".
- Finding 12: all four quotes exact (Humberstone x2, Taylor, Tellyn); dated 19th December 2025.
  Legal IT Insider quote exact, Jean-Remi de Maistre, CEO of Jus Mundi, 15 Jan 2026.
- Finding 13: quote is truncated — sentence continues "... by applying financial discipline,
  technology strategy, and governance to deliver more without proportional resource increases."
  (Oyango Snell). CLOC release wording is "85% have dedicated AI oversight or resources"; Harbor
  PRWeb release (Dec. 8, 2025): "85% of departments now have a dedicated resource or committee
  managing AI efforts", 135 departments, $13 billion median revenue. Neither release mentions
  knowledge management. Snell's 10 March line is about Europe: "Organizations across Europe are
  embedding AI into everyday workflows, including contract review, knowledge management, and
  risk analysis."
- Finding 15: quote is a blockquote from Harbor's report reproduced by Embry, not Embry's own
  sentence. "41% from 2021 to 2025" and "5% to 6% of overall firm revenue" as stated.
  abovethelaw.com returns 403 to curl; read via WebFetch only.

## Best primary URLs

- Heppner memorandum: https://www.courtlistener.com/docket/71872024/27/united-states-v-heppner/ (2026-02-17)
- Stanford paper: https://arxiv.org/abs/2405.20362 (2024-05-30)
- Harbor survey release: https://www.prweb.com/releases/harbor-2025-law-department-survey-reveals-surge-in-ai-integration-falling-outside-counsel-spend-302635093.html (2025-12-08)
- CLOC KM function: https://cloc.org/cloc-core-12/knowledge-management/
