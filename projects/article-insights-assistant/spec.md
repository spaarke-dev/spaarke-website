# Article Insights Assistant: AI Implementation Specification

> **Status**: Ready for Implementation
> **Created**: 2026-09-25
> **Source**: `design.md`

## Executive Summary

An AI assistant embedded in Spaarke article pages that lets a reader
interrogate the article and the library around it. The entire 21-article
corpus is held in a cached model context, so the assistant reasons across
articles with no retrieval layer. Every claim is labeled with where it came
from: a cited article section, or the model's general knowledge, stated as
such.

It is a demonstration of Spaarke's own product thesis, which is why visible
grounding is a requirement rather than a nicety.

## Scope

### In Scope

- Right-rail console on all 21 article pages, and a mobile bottom sheet
- Whole-corpus context: every published article in a cached system prompt
- Cross-article reasoning and citation from release one
- Labeled provenance on every answer (corpus, general knowledge, or both)
- Entry-point card with article-specific suggested questions
- Summarize option, offered after the extending questions
- Assistant-initiated clarifying questions, gated by materiality
- Conversation capture for content-gap analysis
- Streaming responses with a hard timeout
- Public anonymous access with IP rate limiting

### Out of Scope

- Retrieval, chunking, embeddings, or a vector store
- Any use of the Spaarke BFF chat path (see Key Decisions)
- Pricing, support, sales, or demo-booking answers
- Email capture or any gate on use
- Library-wide console surface, which is release two
- Structured multiple-choice question UI, which is release two
- Authenticated or personalized sessions

### Affected Areas

- `src/app/why-spaarke/[slug]/page.tsx` - article route, rail slot
- `src/components/` - new assistant console, sheet, citation chip
- `src/app/api/article-insights/` - new streaming endpoint
- `src/lib/` - corpus manifest, prompt assembly, rate limiting reuse
- `scripts/` - build-time corpus manifest generation
- `content/blog/` - source corpus, read only

## Requirements

### Functional Requirements

1. **FR-01 Corpus manifest.** A build-time script reads `content/blog/`
   and emits a manifest containing each article's slug, title, date,
   `summary`, `keyTakeaways`, `tags`, campaign, heading anchors, and body.
   Acceptance: manifest regenerates on build; total token count is logged;
   build fails if the count exceeds a configured ceiling.

2. **FR-02 Whole-corpus context.** The endpoint sends the full manifest in
   a cached system prompt on every request. Acceptance: no retrieval or
   ranking code exists; a question answerable only from article 5 succeeds
   while the reader is on article 1.

3. **FR-03 Labeled provenance.** Every answer labels its source. Corpus
   claims carry a citation of `{slug, heading, anchor}` rendered as a link
   into the article. General-knowledge claims are stated as such in plain
   language. Mixed answers distinguish the parts. Acceptance: the
   evaluation set (FR-09) includes corpus-only, knowledge-only and mixed
   questions, and each returns the correct labeling.

4. **FR-04 Entry card.** On first open the console shows three
   article-specific extending questions derived from that article's
   frontmatter, plus a summarize option listed after them. Acceptance:
   suggested questions differ per article; summarize is never first.

5. **FR-05 Linked summary.** When a summary is produced, each claim links
   to the section that argues it. Acceptance: every summary paragraph
   contains at least one anchor link into the article.

6. **FR-06 Assistant-initiated questions.** The assistant may ask the
   reader one question at a time, only when the answer would materially
   change the response. Acceptance: the question is always skippable;
   skipping yields a useful general answer; no question blocks a reply; the
   evaluation set includes a case that must not trigger a question.

7. **FR-07 Conversation capture.** Each turn records the question, article
   slug, provenance of the answer, whether the reader continued, and a
   session identifier. Acceptance: records are queryable for content-gap
   analysis; no field identifies a reader beyond what the site already
   collects.

8. **FR-08 Streaming with timeout.** Responses stream. A request that does
   not begin streaming within the timeout produces a visible error naming
   the failure, never an indefinite spinner. Acceptance: with the endpoint
   forced to hang, the UI shows an error within the timeout.

9. **FR-09 Evaluation set.** 30 to 50 questions with known-good answers,
   runnable as a script against the live prompt. Must include questions
   spanning three or more articles, questions the corpus deliberately does
   not answer, questions inviting legal advice, which must be answered under
   labeled provenance rather than refused, and questions built on a
   false premise drawn from competitor vocabulary. Acceptance: the suite
   runs in CI or on demand and reports pass or fail per case.

10. **FR-10 Disclaimer.** A persistent, unobtrusive disclaimer in the
    console states that answers are informational and are not legal advice.
    Per owner decision, there is no separate refusal path for questions
    touching legal positions; the assistant answers under labeled
    provenance (FR-03) like any other question. Acceptance: the disclaimer
    is visible whenever the console is open, including in the mobile sheet,
    and is present in the first rendered state rather than appearing after
    a first answer.

11. **FR-11 Scope boundary.** Pricing, support, availability and
    demo-booking questions are redirected to the contact page rather than
    answered. Acceptance: covered by FR-09 cases.

12. **FR-12 Mobile surface.** On viewports without the right rail, a
    persistent floating button opens the assistant as a bottom sheet over
    the article. Acceptance: usable one-handed at 375px wide; the article
    is not unmounted behind it.

### Non-Functional Requirements

- **NFR-01 Cost.** Sized to a 500 USD per month inference ceiling, set by
  the owner on 2026-09-25.
  Prompt caching is mandatory. Per-turn cost must be measured against
  Foundry's published rates before launch, not assumed.
- **NFR-02 Rate limiting.** Per-IP limits reusing `src/lib/rate-limit.ts`
  and `src/lib/ip-hash.ts`. Starting point: 10 questions per hour and 30
  per day per IP hash, tuned once real usage exists. Note that the existing
  limiter is in-process, so it resets whenever the managed function
  recycles. A public endpoint that spends money on every call needs a
  durable counter, in Table Storage or equivalent, rather than that one.
- **NFR-02a Bot protection.** Named by the owner as a priority, because a
  scripted client can run up the bill faster than any human. Layered:
  reCAPTCHA on the first question of a session, reusing the site's existing
  keys and `verifyCaptcha` pattern from the contact route; the durable
  per-IP counter above; a per-session question cap; and a global daily
  ceiling that degrades the feature rather than the budget when breached.
  Acceptance: a scripted client without a valid token cannot reach the
  model, and a breach of the global ceiling disables the console with an
  explanatory message instead of failing silently.
- **NFR-03 Spend alerting.** An Azure cost alert fires before the monthly
  ceiling is reached, since abuse on a public endpoint surfaces as a bill
  rather than an outage.
- **NFR-04 Time to first token.** Under 3 seconds at the median. The
  keep-warm workflow added 2026-09-25 covers the cold-start case.
- **NFR-05 Accessibility.** Keyboard operable, focus managed on open and
  close, streaming output announced politely, and the sheet trapping focus
  while open.
- **NFR-06 Telemetry.** Open, question, answer-provenance, citation-follow
  and error events, flushed per the logger fix of 2026-09-25.
- **NFR-07 Privacy.** Conversations are reader-supplied text that may
  contain confidential material. The store is not reachable from the public
  endpoint, and the privacy policy covers capture and retention.

## Technical Constraints

### Tech Stack

- Next.js 16.1.6 (App Router, Turbopack), React 19, TypeScript
- Tailwind v4
- MDX via `gray-matter` and `next-mdx-remote/rsc`
- Azure Static Web Apps, hybrid SSR with managed functions
- Azure Table Storage for the conversation log
- Claude in Microsoft Foundry, `claude-sonnet-5` initially

### Key Decisions

**KD-01 No retrieval layer.** 21 articles at roughly 3,500 words each is
about 100,000 tokens, which fits a 200K context window. Holding the whole
corpus removes retrieval miss as a failure class and makes cross-article
reasoning free. Revisit at 80 to 100 articles, around 400,000 tokens.

**KD-02 Claude in Microsoft Foundry.** GA since 2026-06-29, running on
Azure infrastructure in a US data region with Entra ID authentication. This
keeps the feature inside the tenant, which matters because Spaarke
published "Why we built on Microsoft".

**KD-03 The website does not call the Spaarke BFF chat path.** The BFF's
`Services/Ai` layer authorizes per user against per-document access
(`AiAuthorizationService.CheckDocumentAccessAsync`). A public marketing
endpoint has no user and no documents, so the security model does not
transfer. The website gets its own thin Foundry endpoint.

**KD-04 Read the BFF's grounding verifier first.**
`Services/Ai/CitationVerification/GroundingVerifier.cs` in the Spaarke repo
already solves citation verification for the product. Its approach should
inform FR-03 rather than being reinvented, even though the code is not
reused directly.

**KD-05 Article context is a parameter.** The current article biases the
system prompt and the suggested questions; it never limits what the model
can see. Release two changes framing only.

**KD-06 Citations carry structure from the first commit.** Every citation
is `{slug, heading, anchor}`. Retrofitting citation structure is the
expensive mistake this decision avoids.

### Deployment

- GitHub to Azure SWA CI/CD, `main` to production
- Preview environments are capped at 10 on the Free tier and require the
  periodic cleanup noted in repo history

## Success Criteria

1. [ ] Assistant renders on all 21 article pages and on mobile. Verify by:
       manual pass at 375px and 1440px
2. [ ] A question answerable only from another article succeeds. Verify
       by: FR-09 cross-article cases
3. [ ] Every corpus claim carries a working anchor link. Verify by: FR-09
       plus a link checker over generated citations
4. [ ] General-knowledge answers are labeled as such. Verify by: FR-09
       knowledge-only cases
5. [ ] Disclaimer visible whenever the console is open, on both surfaces.
       Verify by: manual pass at 375px and 1440px
6. [ ] A hung request produces a visible error. Verify by: forced-hang test
7. [ ] Per-turn cost measured against Foundry rates and within NFR-01 -
       Verify by: instrumented cost log over the evaluation run
8. [ ] Conversation log queryable for content gaps. Verify by: producing
       the first gap report
9. [ ] Telemetry events arriving. Verify by: App Insights query after the
       2026-09-25 flush fix
10. [ ] Scroll depth and time on page measured for assistant users against
        non-users. Verify by: comparative query after two weeks
11. [ ] A scripted client without a captcha token cannot reach the model.
        Verify by: direct POST to the endpoint with no token

## Dependencies

### Prerequisites

- A website-specific Microsoft Foundry project, separate from the product's
  Foundry resources, with `claude-sonnet-5` deployed. Per owner decision.
  Keeping it separate means public marketing traffic cannot consume product
  quota, and its spend is attributable on its own
- Entra ID app registration or API key for the website's server-side calls
- App settings for the endpoint, deployment name and model
- Azure Table Storage table for the conversation log
- Azure cost alert configured per NFR-03
- Privacy policy updated per NFR-07. **Written, not published.** Part 1 gains an
  "Article assistant" section covering capture, 90-day retention, Foundry
  processing and the not-legal-advice statement, held in draft PR #90 so the live
  policy does not describe a feature that does not exist. It merges with the
  console. Task 022 was built against a commitment that is not yet public

### External Dependencies

- Microsoft Foundry Claude Messages API
- Existing Azure Table Storage account `stspaarkewebsite`
- Existing Application Insights `appi-spaarke-website`

## Owner Clarifications

| Topic | Question | Answer | Impact |
|-------|----------|--------|--------|
| Gating | Who can use the assistant? | Open to everyone, rate-limited | No auth or email capture. Rate limiting and spend alerting become load-bearing (NFR-02, NFR-03) |
| Mobile | Right rail does not exist on mobile | Bottom sheet via floating button | FR-12. Adds a second surface to r1 rather than deferring |
| Cost | Monthly inference ceiling | 500 USD | NFR-01. Sonnet as default, Opus available for hard questions, caching mandatory |
| R1 scope | Which articles | All 21 | Template-level change; maximizes usage data. Backend already sees the full corpus |
| Model path | Reuse the BFF AI layer? | Resolved by inspection, not asked | KD-03. BFF authorizes per user per document; does not transfer to a public endpoint |
| Retention | How long to keep conversations? | 90 days | FR-07 schema and the privacy policy wording are now fixed |
| Legal advice | Refusal path or disclaimer? | Disclaimer, no refusal path | FR-10 rewritten. No counsel review gate. Legal-advice cases stay in FR-09 for answer quality |
| Bot cost | Concern with a public endpoint | Prevent bots running up cost | NFR-02a added. Also exposed that the existing rate limiter is in-process and unsuitable here |
| Foundry | Which Foundry resource? | A website-specific project | Isolates marketing spend and quota from the product |
| Rail slot | Does the layout need changing? | Nothing on the page yet | The highlighted region is empty. No layout change needed |

## Assumptions

- **Disclaimer placement**: assuming the disclaimer sits in the console
  chrome rather than being repeated on each answer, which would read as
  defensive and crowd the response.
- **Suggested-question generation**: assuming these are derived at build
  time from frontmatter rather than generated per request, to avoid a model
  call before the reader has asked anything.
- **Session identity**: assuming an ephemeral client-side session id, not a
  cookie or any persistent identifier.
- **Conversation persistence**: assuming conversations do not survive a page
  reload in release one.

## Unresolved Questions

- [ ] Verify Foundry per-token rates including cache reads for
      `claude-sonnet-5`. Blocks: NFR-01 sizing and the NFR-02 numbers
- [ ] Create the website-specific Foundry project and deploy the model.
      Blocks: all implementation

---

*AI-optimized specification. Original design: `design.md`*
