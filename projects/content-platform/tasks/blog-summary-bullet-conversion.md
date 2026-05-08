# Blog Summary Bullet Conversion — Phase 1 Task Spec

**Status:** Awaiting team authorization
**Owner:** Content + Engineering
**Scope:** Convert legacy `summary:` paragraph-format blog frontmatter to the new `keyTakeaways:` bullet format across the 13 unconverted articles in `content/blog/`.

---

## 1. The new format

### Field

`keyTakeaways` — an array of strings in MDX frontmatter, declared in `src/lib/blog.ts` (line 23, line 176). It is an **optional** field on `BlogPostMeta`.

### Where it renders

`src/components/article/ArticleHeader.tsx`, lines 103–134. The header renders a "Key takeaways" block immediately below the hero image, inside a bordered, surface-tinted card. The block:

- Shows the eyebrow label "Key takeaways" in mono-uppercase 11px.
- Iterates `post.keyTakeaways` as an unordered list with a small blue dot bullet (`bg-spaarke-blue`) per item.
- **Falls back to the `summary` paragraph** if `keyTakeaways` is missing or empty. Both fields can coexist; bullets win when present.

This is why the legacy posts still render today — the fallback paragraph is the dense `summary:` block. Visually that block looks meaningfully different from the new bulleted card; readers landing on different posts get inconsistent treatment above the fold.

### Canonical shape

Inferred from the 3 converted articles (no formal length cap is defined in `projects/content-platform/content-types/blog-post.md` or `briefs/_template-blog-post.md`):

- **Bullet count:** 4 per article in every converted example.
- **Bullet length:** roughly 18–35 words, single sentence, declarative.
- **Voice:** assertion-led, names the operative thing (LOI, the Legal IQ stack, tenant-dedicated deployment), no hedging, no "we believe."
- **Format in YAML:** block list under `keyTakeaways:`, each item plain (unquoted) on its own line. No nested lists, no markdown formatting inside bullets.
- **Position in frontmatter:** before `draft: false`, after the tag/feature block. Mechanical placement — the loader doesn't care, but consistency helps the team.

### Example (verbatim from `2026-01-25-why-we-built-on-microsoft.mdx`)

```yaml
keyTakeaways:
  - Spaarke runs on Microsoft 365 — over 85% of Fortune 500 companies are already there, and IT has already vetted the security boundary.
  - Building on Microsoft means working inside the same identity, compliance, and AI substrate your CISO already trusts.
  - Tenant-dedicated deployment keeps your legal data inside your boundary — no Spaarke-controlled multi-tenant blob in between.
  - Platform choice determines your data boundaries, your AI capabilities, and your total cost of ownership for the next decade.
```

---

## 2. Conversion status (all 16 articles)

The team's count of "3 converted" is **correct**. Three articles have `keyTakeaways:` populated; the remaining 13 have only legacy `summary:` paragraphs. None are partial/empty.

| # | Slug | Converted? | Notes |
|---|------|------------|-------|
| 1 | `what-is-legal-operations-intelligence` | yes | 4 bullets, has `summary` too. The pillar piece — strongest reference example. |
| 2 | `the-iq-stack` | no | Missing `keyTakeaways`. Long `summary` paragraph (~110 words). High-signal bullet candidates already implicit in the body's three-layer structure. |
| 3 | `loi-maturity-model` | no | Missing `keyTakeaways`. References CLOC Core 12, ACC Maturity 2.0, Gartner — bullets need to credit those frameworks accurately. |
| 4 | `why-we-built-on-microsoft` | yes | 4 bullets. Use as the reference exemplar for tone/length. |
| 5 | `welcome-to-spaarke` | yes | 4 bullets. Note: uses the legacy flat `tags: ["news", "updates", "company"]` format and has no `summary` field — bullets carry the whole above-fold load here. |
| 6 | `your-legal-data-belongs-to-you` | no | Missing `keyTakeaways`. Sovereignty/privilege themes; bullets need to be careful not to overpromise. |
| 7 | `tenant-dedicated-deployment` | no | Missing `keyTakeaways`. Closely related to `why-we-built-on-microsoft` — bullets should not duplicate that article's. |
| 8 | `what-attorneys-need-to-know-about-ai` | no | Missing `keyTakeaways`. Body argues three architecture decisions — natural 3-bullet shape, may want a 4th framing bullet. |
| 9 | `ai-without-giving-away-the-keys` | no | Missing `keyTakeaways`. Cites a "more than 50%" stat — bullet phrasing must match the body, not paraphrase the number. |
| 10 | `the-ai-readiness-gap` | no | Missing `keyTakeaways`. Short article relative to others; 3 bullets may be more honest than forcing 4. |
| 11 | `the-20b-blind-spot` | no | Missing `keyTakeaways`. The `$20B` figure is load-bearing — must appear in a bullet. |
| 12 | `institutional-knowledge` | no | Missing `keyTakeaways`. Operational memory is the named solution — bullet should name it. |
| 13 | `breaking-the-silo` | no | Missing `keyTakeaways`. Cross-functional theme — bullets should cite the specific functions (finance, business). |
| 14 | `legal-ops-is-not-it-for-lawyers` | no | Missing `keyTakeaways`. Strong contrarian voice in body — bullets should carry that edge, not flatten it. |
| 15 | `spaarke-for-your-it-team` | no | Missing `keyTakeaways`. IT-audience piece; bullets should be technical-precise (deployment, identity, data residency), not marketing. |
| 16 | `spaarke-feature-specification` | no | Missing `keyTakeaways`. Reference doc, not a thesis piece — bullets may need to be structural ("five areas: …") rather than argumentative. |

**Totals:** 3 converted · 13 unconverted (all in the "missing the field entirely" bucket — no partial conversions to clean up).

---

## 3. Conversion procedure (one article)

Per article:

1. **Open the MDX file** in `content/blog/`.
2. **Read the body.** Identify the 3–5 load-bearing assertions — the things a reader who reads only the bullets should walk away knowing. Prefer claims that already appear as topic sentences or section headers in the body. Do not invent new claims that aren't supported by the article.
3. **Draft the bullets** in Spaarke voice (per `projects/content-platform/voice/style-guide.md` and `voice/examples/tone-samples.md`):
   - One sentence each. Declarative. Names the thing.
   - Roughly 18–35 words. Match the cadence of the converted examples.
   - 4 bullets is the established shape; 3 is acceptable for shorter pieces, 5 is the upper bound.
   - No "we believe," no "this article explores," no marketing throat-clearing.
   - Numbers and named frameworks (LOI, Legal IQ stack, CLOC Core 12, $20B, 85%) must match the body verbatim.
4. **Insert into frontmatter** above `draft: false`, as a YAML block list:
   ```yaml
   keyTakeaways:
     - First bullet here.
     - Second bullet here.
     - Third bullet here.
     - Fourth bullet here.
   ```
5. **Leave `summary:` in place** if it exists. The renderer prefers `keyTakeaways` when both are set, and `summary` is still consumed elsewhere (RSS, social cards, list pages — verify before deletion; out of scope for this task).
6. **Verify locally:** `npm run dev`, navigate to `/blog/<slug>`, confirm the "Key takeaways" card renders with 3–5 bullets and the legacy paragraph no longer shows.
7. **No body edits.** This task is frontmatter-only.

### UI copy

No UI copy changes are required. The component already renders the "Key takeaways" eyebrow label and falls back to `summary` for unconverted posts, so partial rollout is safe.

### Length cap

There is **no enforced cap** in code or in the content-type spec. The 18–35 word, 4-bullet shape is empirical from the 3 converted articles, not a contract. If we want to lock it, we should add it to `projects/content-platform/content-types/blog-post.md` as part of this task — see open questions.

---

## 4. Batch-plan options

### Option A — Bulk Claude-assisted conversion

**Process:**
1. Claude reads each of the 13 articles in turn.
2. Drafts 3–5 bullets per article in Spaarke voice, checking each against `voice/style-guide.md` and the 3 reference examples.
3. Produces a single PR (or one commit per article in a single PR) with all 13 frontmatter edits, plus a tracking sheet of `slug → drafted bullets` for review.
4. Team reviews the sheet in one batch sitting (one editor, ~45 min — they read the article header context and the drafted bullets side-by-side, approve or red-line).
5. Claude applies revisions, PR merges.

**Effort estimate:**
- Claude drafting: ~5–8 minutes per article (read body, draft, refine) × 13 = ~75–105 minutes of agent time.
- Team review: ~3–4 minutes per article (skim body, read bullets, approve/edit) × 13 = ~45–60 minutes of human time, single sitting.
- Engineering: ~15 minutes (PR scaffolding, local verify, merge).
- **Total wall-clock: ~1 working day** assuming review happens same-day.

**Tradeoffs:**
- + Consistency arrives in one shot. No ongoing visual inconsistency for live readers.
- + Bullets are drafted by a single voice/cadence, reducing per-article drift.
- + Forces a batch review where the team sees the whole library at once — likely surfaces voice issues that single-article reviews miss.
- − Bullets are AI-drafted; risk of subtle misframing on articles with delicate claims (privilege, sovereignty, "more than 50%" stats). Mitigated by review, but the reviewer has to actually catch issues, not rubber-stamp.
- − One bad bullet shipped to production is more embarrassing than one missing bullet (which today's readers don't even see, since the fallback paragraph is fine).

### Option B — Incremental, convert-as-we-revisit

**Process:**
1. Add a checkbox per article to the Phase 1+ backlog.
2. When any team member touches an article for unrelated reasons (typo, link update, image swap), they convert the bullets in the same PR.
3. New articles ship with `keyTakeaways` from day one (already true; the template supports it).

**Effort estimate:**
- ~10 minutes added to any future article-touching PR.
- Time-to-full-consistency: indefinite. Realistically 6–12 months, possibly never for evergreen articles no one revisits.

**Tradeoffs:**
- + Each article gets undivided author attention from someone who is already in the file thinking about it.
- + Zero risk of batch-introduced voice drift.
- − Live site stays visually inconsistent for the foreseeable future. Above-the-fold treatment differs across articles in the same `/blog` index.
- − Easy to forget. Requires a checklist gate on the article-edit workflow that does not exist today.
- − The 3 currently-converted articles act as a visible inconsistency, not a forcing function — readers are unlikely to notice a missing block, but they will notice 3 articles styled differently if they read the index.

---

## 5. Recommendation

**Option A — bulk Claude-assisted conversion in a single PR with batch review.**

Reasoning:

- **Consistency cost is real.** The "Key takeaways" card is above the fold on every article. Three styled one way, thirteen the other, signals to readers that the site is mid-renovation. For a platform pitching operational rigor to legal departments, that's the wrong impression.
- **Effort is bounded and small.** ~1 working day of combined agent + reviewer time is cheap relative to the duration of the inconsistency under Option B.
- **Risk is manageable with the right review gate.** The reviewer must actually read the body, not just the bullets. If the reviewer is the article's original author or someone on the voice committee, the risk of subtle misframing drops to near-zero. The 3 already-converted articles set a clear voice anchor.
- **Option B's only real win is per-article author attention** — and we can preserve that by routing the batch review through the original authors where possible, rather than a single editor.

**Suggested execution:**
1. Authorize Option A as a Phase 1 task.
2. Claude generates a single tracking doc: `projects/content-platform/tasks/blog-summary-bullet-conversion-drafts.md` with all 13 drafts.
3. Voice/content lead reviews and red-lines in one sitting.
4. Claude applies revisions, opens a single PR, engineering merges.

---

## 6. Open questions for the team

1. **Length cap — codify or stay empirical?** Should we add "3–5 bullets, 18–35 words each" to `projects/content-platform/content-types/blog-post.md` as a normative spec, or leave it as observed convention? Recommend codifying as part of this task so future articles don't drift.
2. **`summary` field — keep or remove?** The renderer prefers `keyTakeaways` when both are present, but `summary` is still passed through `getAllPosts()` and may be consumed by RSS, social cards, or list pages. Audit before removing. Out of scope here — flag for a separate task.
3. **Per-author review or single-editor review?** Recommend per-author for the articles where the original author is identifiable and available; single voice-lead review otherwise. Confirm before drafting.
4. **`welcome-to-spaarke` legacy tags.** This article still uses the flat `tags: [...]` array format instead of the structured `{organization, function, topic, theme}` shape. Out of scope for the bullet conversion, but worth noting — it's the only such article and creates a small consistency wart.
5. **Authoring constraint.** This task spec is read-only on `content/blog/` and the components. Authorization to edit those 13 frontmatter blocks is the gate that unblocks Option A.

---

## Conversion log — 2026-05-07

Twelve articles converted in this batch. Skipped: `welcome-to-spaarke` (already
converted in the original 3) and `spaarke-feature-specification` (Agent H is
doing a full rewrite in parallel). Locked shape: 4 bullets per article,
18–35 words each, single sentence, declarative. All bullets verified within
range (48 of 48). Frontmatter only — no article bodies modified.

### `the-iq-stack` (slug)

```yaml
keyTakeaways:
  - The Legal IQ stack is the three-layer architecture behind LOI — Data captures how work gets done, Memory retains the rationale, Inference turns both into decisions.
  - Documents capture outcomes; Memory captures the negotiation dynamics — what was conceded, what leverage worked, what the fallback position was.
  - Generic AI gives you industry ranges; Inference grounded in your 200 prior matters gives you a decision framework built on your own history.
  - The three layers compound. More data sharpens memory, richer memory sharpens inference, better inference guides what data to capture next. One learns. The other just runs.
```

### `loi-maturity-model`

```yaml
keyTakeaways:
  - CLOC Core 12, ACC Maturity 2.0, and Gartner measure functional breadth — how many areas the department has formalized. They don't measure whether the operation can learn.
  - LOI adds a second axis — intelligence depth — across five levels from Ad Hoc to Predictive, mapping what your operation captures, retains, and applies over time.
  - A department can be CLOC "Developing" and still operate reactively if it loses context with every departure and reports backward instead of predicting forward.
  - The frameworks tell you what to build. LOI tells you how to make it intelligent — by sequencing Data, then Memory, then Inference underneath the functional model.
```

### `your-legal-data-belongs-to-you`

```yaml
keyTakeaways:
  - Most legal departments cannot fully map where their data goes — which sub-processors handle it, which jurisdictions store it, or whether AI vendors retain it for model training.
  - Multi-tenant SaaS, third-party AI integrations, and analytics middleware each create data flows traditional security reviews were never designed to catch.
  - Privilege depends on confidentiality. Privileged communications transmitted to external AI services for processing make the argument for maintained privilege difficult to sustain.
  - Tenant-dedicated deployment makes sovereignty structural, not contractual — your legal data stays inside the boundary your IT team already governs, and AI runs there too.
```

### `tenant-dedicated-deployment`

```yaml
keyTakeaways:
  - Tenant Dedicated Deployment runs the platform entirely inside your own Microsoft 365 tenant — combining the data control of on-premises with the operational simplicity of cloud.
  - Spaarke data lives in your Dataverse, governed by your Entra ID, your Conditional Access, your DLP, and your Purview policies. No parallel security perimeter to evaluate.
  - AI runs inside the tenant boundary. Privileged communications and litigation strategy are not sent to external models for processing — privilege protection is architectural, not promissory.
  - Compliance becomes structural. SOC 2, ISO 27001, HIPAA, FedRAMP, and GDPR coverage of your tenant extends to your legal operations data because the data lives inside that tenant.
```

### `what-attorneys-need-to-know-about-ai`

```yaml
keyTakeaways:
  - Three architectural decisions matter more than any feature list — where the AI runs, what data grounds its outputs, and what the true cost model looks like at scale.
  - Where the AI runs determines whether privilege survives the interaction. External API processing sends privileged documents outside your boundary; tenant-resident AI does not.
  - What grounds the AI determines output quality. Generic AI gives you industry ranges; AI grounded in your operational memory gives you decisions built on your own matter history.
  - Per-query pricing creates a chilling effect on adoption — every question has a visible cost, so attorneys self-censor. Bundled licensing inside Microsoft 365 removes the friction.
```

### `ai-without-giving-away-the-keys`

```yaml
keyTakeaways:
  - More than 50% of legal organizations now use Microsoft Copilot as their primary AI tool — this is not a trend, it is a platform shift legal has already chosen.
  - Spaarke operates inside the Microsoft 365 Copilot plane, not alongside it — AI interactions inherit the same data boundaries, DLP, and audit logging as the rest of your tenant.
  - Shadow AI, third-party processing, and "enterprise-grade" tools that route documents to external infrastructure each open privilege-waiver gaps your existing governance cannot close.
  - Copilot grounded in Spaarke's structured legal data drafts, recommends, and surfaces patterns from your actual matter history — not generic internet knowledge. The intelligence stays with you.
```

**Note for review:** the body's ">50%" Copilot adoption stat is preserved
verbatim in bullet 1 (matches the article body), but T11 review notes flag
this figure as overstating the verified data (closer to 40% Copilot among
AI-adopting in-house legal per Counselwell/Spellbook 2025). The bullet
matches the body; correcting both is a separate edit.

### `the-ai-readiness-gap`

```yaml
keyTakeaways:
  - Most legal departments are not ready for AI — not because the tools are immature, but because their data is. The tool is not the bottleneck. The data architecture is.
  - An AI tool layered on fragmented data gives you fragmented answers — faster. The risk is not bad output. It is plausible bad output that gets embedded into decisions before anyone notices.
  - Adding more tools at LOI Maturity Level 2 keeps you at Level 2 with more silos. AI-readiness corresponds to Level 3 and above, where data is integrated and context is captured.
  - The Legal IQ stack sequence — Data first, then Memory, then Inference — is how you close the gap. Skip to Inference and the model has nothing meaningful to reason over.
```

### `the-20b-blind-spot`

```yaml
keyTakeaways:
  - Outside legal spend in the US alone exceeds $20 billion annually — one of the largest discretionary spend categories in the enterprise — and most GCs cannot tell you whether it is well spent.
  - Five structural problems compound the opacity — fragmented billing, inconsistent matter coding, manual invoice review, no link between spend and outcomes, and no benchmarks.
  - More dashboards do not fix this. Dashboards visualize data; intelligence requires unified data, retained memory, and inference applied across hundreds of prior matters.
  - LOI changes the CFO conversation from "why did legal spend so much?" to forecast, justify, and optimize — the shift from cost center to managed strategic investment.
```

**Note for review:** the $20B figure is body-verbatim and load-bearing per
the conversion plan; T11 §3 records that the figure has no defensible
primary source and was dropped from `voice/domain-knowledge.md`. The bullet
matches the body. If the body is corrected in a separate pass, this bullet
should change in lockstep.

### `institutional-knowledge`

```yaml
keyTakeaways:
  - Approximately 20% of the legal workforce turns over in any given year. Every departure is an unrecoverable data loss event — not the documents, but the context behind them.
  - Documentation captures what was decided. Operational memory captures why — under what constraints, with what tradeoffs, against what alternatives. The difference is dimensionality, not detail.
  - Operational memory has to build itself as work happens. A platform that captures decisions in context turns institutional knowledge into a durable, searchable, organizational asset.
  - Without operational memory the department resets to zero with every departure — relearning lessons, remaking mistakes. The cost is invisible on any single day. Over a decade, it is enormous.
```

**Note for review:** the "20%" turnover stat is body-verbatim; T11 §3
hedges this figure as directional only. The bullet matches the body. If
the body is corrected, this bullet should change in lockstep.

### `breaking-the-silo`

```yaml
keyTakeaways:
  - Finance, revenue teams, M&A, procurement, and the C-suite all depend on legal outcomes — yet legal operates behind an information wall because the systems were never designed to share.
  - The silo is reinforced by separate systems, different taxonomies, one-way reporting, and no shared visibility. The same contract dispute gets described three ways across three functions.
  - Point integrations paper over the problem with brittle API bridges. A platform that runs on the same Microsoft tenant the rest of the business uses makes visibility architectural, not aspirational.
  - The legal ops leader who breaks down the silos becomes a strategic partner to finance, the business units, and the C-suite — the move from running a department to informing an enterprise.
```

### `legal-ops-is-not-it-for-lawyers`

```yaml
keyTakeaways:
  - Defining legal operations by its administrative tasks — managing the e-billing system, processing invoices, pulling spend reports — mistakes the floor for the ceiling.
  - Administrative legal ops produces administrative outcomes, which confirm the assumption that legal ops is administrative. The cycle repeats. The function never evolves.
  - Strategic legal ops drives intelligence — spend forecasting, institutional memory, cross-functional visibility, and the data foundation that makes AI genuinely useful. It is COO work for the legal function.
  - The shift from administrative to strategic is not a headcount question. It is an architecture question — unified data, organizational memory, and inference applied across the matters the team already touches every day.
```

### `spaarke-for-your-it-team`

```yaml
keyTakeaways:
  - Spaarke runs entirely on Microsoft Power Platform inside the customer's M365 tenant — Dataverse, SharePoint Online, Power Automate, Power BI, and Microsoft 365 Copilot. No external infrastructure, no data egress.
  - Identity, access, DLP, sensitivity labels, retention, and audit logging all flow through Entra ID, Purview, and the M365 unified audit log your team already operates. No parallel governance regime.
  - Deployment is a managed solution package promoted through standard Power Platform ALM. Tenant-level SOC 2, ISO 27001, HIPAA, FedRAMP, and GDPR coverage extends because the data lives in your tenant.
  - Licensing fits inside an existing M365 E3/E5 estate plus Power Apps and Dataverse capacity. M365 Copilot is optional and additive — no hidden compute costs, no vendor-hosted infrastructure to audit.
```

---

### Skipped this batch

- **`welcome-to-spaarke`** — already converted in the original 3 (per
  Section 2 of this document). No work needed.
- **`spaarke-feature-specification`** — Agent H is doing a full rewrite
  of this article in parallel; bullets will be drafted as part of that
  rewrite, not retrofitted in this batch.
