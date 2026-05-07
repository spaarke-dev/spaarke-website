# Website SEO Optimization — Specification

> Search and AI-discovery optimization for the Spaarke marketing
> site. Four pillars: technical SEO, on-page SEO, content SEO, and
> AEO/GEO (Answer / Generative Engine Optimization). The newest
> pillar — AEO/GEO — is the strategic differentiator: it determines
> whether AI products quote and recommend us accurately. This
> project captures scope; tasks are written when we're ready to
> execute.

---

## 1. Purpose

The site is shipping content and instrumented for measurement, but
without active SEO discipline it will under-index its potential on
both classical search (Google, Bing organic) and AI-assisted
discovery (Perplexity, ChatGPT, Claude.ai, Bing AI, Gemini, Google
AI Overviews). The two channels are increasingly distinct and need
different optimization approaches.

This project's job is to make the site:

1. **Technically discoverable** — crawlers can reach every page,
   render it correctly, and parse our metadata.
2. **Topically rankable** — the right pages target the right queries,
   with content depth that earns the position.
3. **Citably accurate** — when AI products parse our pages, the
   structure makes it easy to quote us correctly and recommend us
   when relevant.

It is **not** the same as the content platform project. Content
platform asks "are we writing the right things, in our voice?" SEO
asks "are the things we're writing structured to be found and
recommended?" Strong overlap on AEO/GEO; we'll cross-reference.

---

## 2. Scope

### In scope

- **Technical SEO** — sitemap and robots posture, schema enrichment
  (Article, FAQPage, BreadcrumbList, Organization, WebSite,
  HowTo where relevant), canonical handling, page-speed budget per
  route, mobile audit, hreflang if multi-region happens later.
- **On-page SEO** — title/meta optimization per route, heading
  hierarchy audit and discipline, internal-linking strategy,
  image alt-text discipline, descriptive URL slugs, keyword targeting
  per page.
- **Content SEO** — keyword research per persona, topic-cluster
  strategy, content-gap analysis, refresh schedule for legacy
  content.
- **AEO / GEO** — structuring content so AI products can quote us
  accurately. FAQ blocks, definitive-answer paragraphs at section
  openings, structured Q&A schema, citable formatting (numbered
  claims, attributable quotes), entity-aware copy.
- **Measurement integration** — wire SEO outcomes (rankings, organic
  traffic, AI citations) into the analytics platform's monthly +
  quarterly readouts.

### Out of scope

- **Paid search** (Google Ads, Bing Ads, LinkedIn paid) — different
  workstream, different optimization loop.
- **Domain/DNS reconfiguration** — the site already lives at
  `www.spaarke.com` with HTTPS and is properly configured.
- **Branding work** (logo, color palette, voice) — owned by
  content platform.
- **Backlink acquisition** (PR, guest posts, link partnerships) —
  important but separate; would be a Phase 3 project once the
  technical and content foundation is solid.
- **Analytics tooling** — installed by the analytics platform
  project. SEO consumes that data; doesn't reinstall.

---

## 3. Current SEO baseline

Per [`docs/SITE-SPECIFICATION.md`](../../docs/SITE-SPECIFICATION.md)
§7, the site already has:

| Surface | State |
|---|---|
| Site title template | `%s \| Spaarke` (in `RootLayout`) |
| Default site title | `Spaarke \| Legal Operations Intelligence` |
| `metadataBase` | from `process.env.SITE_URL` |
| Per-page `metadata` exports | per-route in each `page.tsx` |
| `Organization` JSON-LD | site-wide in `RootLayout` |
| `WebSite` JSON-LD | site-wide in `RootLayout` |
| `Article` JSON-LD | per blog post in `src/lib/seo.ts` (with `speakable` spec) |
| OpenGraph metadata | per blog post (published_time, modified_time, authors, tags, hero) |
| Twitter `summary_large_image` cards | yes |
| `article:section`, `article:tag` meta | yes |
| `sitemap.xml` | `src/app/sitemap.ts` with explicit priorities |
| `robots.txt` | `src/app/robots.ts` — `Allow: /` |
| Canonical URLs | per blog post |
| RSS feed | `/why-spaarke/rss.xml` |
| Self-hosted fonts | yes (`next/font/google` build-time) |
| `<Image>` with explicit dims | yes (CLS prevention) |
| Lazy-loading on heavy below-fold images | yes |

**What this means**: the technical baseline is solid for "blog
post" SEO. What's missing is structural depth (FAQPage, HowTo,
Breadcrumb schema), keyword discipline (no per-page keyword
strategy), AEO/GEO structure (definitive-answer paragraphs, citable
formatting), and content-strategy connective tissue (topic clusters,
internal-linking strategy).

The audit phase of this project (Phase 0) confirms this baseline
and identifies gaps. We don't assume — we look.

---

## 4. Architecture — the four pillars

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│   │ Technical    │   │ On-page      │   │ Content      │        │
│   │ SEO          │   │ SEO          │   │ SEO          │        │
│   │              │   │              │   │              │        │
│   │ • sitemap    │   │ • titles +   │   │ • keyword    │        │
│   │ • robots     │   │   metas      │   │   research   │        │
│   │ • schema     │   │ • headings   │   │ • topic      │        │
│   │ • canonicals │   │ • internal   │   │   clusters   │        │
│   │ • speed      │   │   links      │   │ • content    │        │
│   │ • mobile     │   │ • alt text   │   │   gaps       │        │
│   │              │   │ • slugs      │   │ • refresh    │        │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘        │
│          │                  │                  │                │
│          └──────┬───────────┴──────┬───────────┘                │
│                 │                  │                            │
│                 │   ┌──────────────▼──────────────┐             │
│                 └──▶│ AEO / GEO                   │             │
│                     │ (Answer / Generative        │             │
│                     │  Engine Optimization)       │             │
│                     │                             │             │
│                     │ • FAQPage schema            │             │
│                     │ • Definitive-answer ¶       │             │
│                     │ • Citable formatting        │             │
│                     │ • Entity-aware copy         │             │
│                     │ • Q&A structure             │             │
│                     └─────────────────────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

       Inputs                                    Outputs
       ──────                                    ───────
   Personas (content platform)         Page rankings (organic)
   Voice (content platform)            AI citation rate
   Vocabulary (content platform)       Organic traffic
   Topic strategy (content platform)   AI-source visits
   Analytics data (analytics platform) Conversion from organic
```

Each pillar is independently valuable. AEO/GEO is the newest and
the highest-leverage given Spaarke's audience increasingly uses AI
products to research vendors.

---

## 5. Per-pillar specifications

### 5.1 Technical SEO

**Audit scope**:

- `sitemap.xml` — every public-indexable page included? Priorities
  reasonable? `lastmod` accurate?
- `robots.txt` — current `Allow: /` posture correct? Should specific
  AI bots be allowed/disallowed? (Decision pulls from analytics
  platform's AI crawler logs.)
- Schema audit — what's emitted on each page type? What's missing?
- Canonical handling — every page sets a canonical? Trailing-slash
  consistency?
- Page-speed budget — Core Web Vitals (LCP, INP, CLS) per page type,
  enforced as a CI check.
- Mobile audit — every page passes Google Mobile-Friendly + visual
  audit at 375px viewport.
- Internal links — orphan pages (zero inbound) flagged?
- 404s and redirect chains — `next.config.ts` redirects
  reasonable? No chains of 3+?

**Schema enrichments to add** (based on baseline gaps):

- `FAQPage` — wherever a page has a Q&A section. Most likely:
  `/why-spaarke` posts that have FAQ blocks, the `/platform` page if
  it has a FAQ section.
- `BreadcrumbList` — for blog posts (`Home > Why Spaarke > <slug>`)
  and platform sub-routes if they exist.
- `Product` schema — for `/platform`. Treats Spaarke as a SoftwareProduct
  with features, integrations, deployment options.
- `HowTo` — for any procedural content (deployment guides, setup
  walkthroughs).
- `Article` enrichments — `mainEntity`, `about`, `mentions` —
  already partially present; deepen.
- `Organization` enrichments — `sameAs` (LinkedIn, X, GitHub),
  `contactPoint`, `foundingDate`, `areaServed`.

**Performance budget** (initial proposal):

| Route type | LCP target | INP target | CLS target |
|---|---|---|---|
| Home `/` | < 1.8s | < 200ms | < 0.05 |
| `/platform` | < 2.0s | < 200ms | < 0.05 |
| `/why-spaarke` index | < 1.5s | < 200ms | < 0.02 |
| `/why-spaarke/[slug]` | < 1.5s | < 200ms | < 0.02 |
| `/contact`, `/access-request` | < 1.5s | < 100ms | < 0.02 |

Enforced via Lighthouse CI on every PR (Phase 1 wiring).

### 5.2 On-page SEO

**Discipline per page**:

- One H1 per page. Descriptive, keyword-aligned, ≤ 70 chars.
- Title tag ≤ 60 chars. Meta description ≤ 155 chars.
- H2/H3 hierarchy reflects intent — not aesthetic decoration.
- Every image has descriptive alt text (or `alt=""` for purely
  decorative).
- Internal links use descriptive anchor text — never "click here"
  or "read more."
- URL slugs are short, hyphenated, keyword-aligned, no stop words
  unless meaningful (`/why-spaarke/the-case-for-unified-legal-data`
  not `/why-spaarke/post-12`).
- Per-page primary keyword + 2–3 secondary keywords documented in
  brief frontmatter (cross-reference: content platform's brief
  templates).

**Internal linking strategy**:

- Topic-cluster pattern: a hub page (e.g.,
  `/why-spaarke/legal-operations-intelligence`) links to spoke posts
  on related sub-topics, and each spoke links back to the hub.
- "Related posts" component on every blog post (3-5 contextually
  relevant links).
- Site-wide CTAs link to canonical conversion pages
  (`/access-request`, `/contact`, `/tour/full-walkthrough`).
- Footer's "deep-links" section preserves discoverability for less-
  trafficked routes.

### 5.3 Content SEO

**Keyword research workflow**:

- Identify 30-50 target queries per primary persona (corporate
  counsel, legal ops director, etc.). Tools: Ahrefs / SEMrush / free
  alternatives like Google Keyword Planner + Ubersuggest.
- For each query: search volume, difficulty, current ranking page (if
  any), search intent (informational / navigational / commercial /
  transactional).
- Group into topic clusters (e.g., "matter management" cluster
  contains queries: matter management software, matter intake,
  matter lifecycle, etc.).
- Map each cluster to a hub page + 3-7 spoke pieces.

**Topic clusters to consider** (initial sketch):

| Cluster | Hub topic | Sample spoke pieces |
|---|---|---|
| Matter management | "What is matter management" | spreadsheet-vs-mm, matter-intake, matter-types |
| Legal operations | "What does legal operations do" | metrics, kpis, ops-vs-tech-team |
| Outside counsel management | "How to manage outside counsel" | OCG-compliance, spend-visibility, panel-management |
| Microsoft 365 + legal | "Legal tools on Microsoft 365" | sharepoint-for-legal, copilot-legal-uses |
| Legal AI | "AI for in-house legal" | not-bolted-on-AI, what-AI-actually-does |

The full keyword + cluster map is a Phase 1 deliverable.

**Content gap analysis**:

- Identify queries where competitors rank and we don't.
- Identify queries we rank for poorly (page 2-3) — refresh
  candidates.
- Identify queries with rising volume but no strong content yet.

**Content refresh schedule**:

- Every blog post audited annually for accuracy + relevance.
- Top-10-traffic posts audited quarterly.
- Posts demonstrably underperforming on metrics → rewrite or
  retire (decision tree to be defined in Phase 1).

### 5.4 AEO / GEO — Answer / Generative Engine Optimization

**The strategic pillar.** Different from classical SEO in important
ways:

- AI products don't necessarily click through. They quote or
  recommend us in their response. Sometimes a citation, sometimes
  not.
- Citation accuracy matters more than ranking. A misquoted Spaarke
  fact is worse than no mention.
- Structure that's good for human readers + good for HTML parsers +
  good for LLM parsers — all three audiences served by the same
  page.

**Concrete techniques**:

1. **Definitive-answer paragraphs.**
   - First paragraph (or first paragraph after the H1) of every
     content page directly answers the implied question of the page.
     1-3 sentences. Specific, concrete, attributable.
   - Example: a post titled "Why Microsoft-native matter management
     matters" should open with "Most matter-management platforms
     are SaaS islands that require legal teams to maintain a parallel
     identity, governance, and data perimeter — Microsoft-native
     platforms run inside the customer's existing Microsoft 365
     tenant, eliminating that parallel infrastructure."
   - This is the paragraph an AI is most likely to quote.

2. **FAQPage schema for Q&A blocks.**
   - Where a page contains explicit Q&A (e.g., "How does Spaarke
     deploy?"), add `FAQPage` JSON-LD listing each Q&A pair.
   - Likely places: `/platform`, `/access-request`, deep blog posts.
   - Format Q's as natural-language questions ("How does X work?")
     not headlines ("Deployment process").

3. **Numbered claims.**
   - When stating multiple facts, prefer ordered lists with
     consistent structure. AIs parse `<ol>` more reliably than
     prose paragraphs containing claims.

4. **Attributable quotes and stats.**
   - Every numerical claim cites its source inline. AIs are more
     likely to repeat us when our claims have provenance.

5. **Entity-aware copy.**
   - Use canonical entity names (Microsoft 365, Microsoft 365
     Copilot, Power Platform, SharePoint, Outlook) consistently —
     don't abbreviate inconsistently. AIs are entity-graph-aware;
     consistent names reinforce associations.
   - Use Spaarke product names (Foundry IQ, Copilot Studio, Agent
     Framework — when those become public-facing) consistently.

6. **`speakable` schema** (already partially present in `Article`
   schema) — extend so AI text-to-speech / summary extraction prefers
   our canonical paragraphs. Verify selectors target the
   definitive-answer paragraph + key claims.

7. **No keyword-stuffing.**
   - AEO rewards clarity; classical-SEO keyword-stuffing tactics
     produce content AIs avoid quoting. The two pillars have aligned
     incentives now. Write for a reader; structure for parsers.

**AEO/GEO measurement** (handed back to analytics platform):

- AI Source Visit count (Phase 0 of analytics).
- AI crawler activity (which bots, what paths) — confirms we're
  being indexed.
- AI citation monitoring (Phase 2 of analytics) — manual prompt
  set + optional Profound/Athena. Tracks whether AI products
  recommend us by name.

---

## 6. Relationships to other projects

### 6.1 Content platform

Heavy overlap on:

- **Voice constitution** — `voice/style-guide.md`,
  `voice/audience-personas.md`, `voice/brand-positioning.md`,
  `voice/vocabulary.md`. SEO uses these to ensure keyword targeting
  doesn't violate voice rules. (E.g., "we say *matter*, we don't say
  *case*" still applies — even if "case management software" has
  higher search volume.)
- **Domain knowledge** — `voice/domain-knowledge.md` informs the
  industry-vocabulary terms we'd target.
- **Content briefs** — SEO inputs (primary keyword, secondary
  keywords, search intent, internal-linking targets) are
  per-piece fields added to the content platform's brief
  template.

The content platform owns *what we write and how we sound*. SEO
owns *how it's structured to be found*. They feed each other.

### 6.2 Analytics platform

SEO depends on analytics for measurement:

- Plausible referrer reports → which queries drive traffic.
- Plausible Article Read event → which pieces actually engage.
- AI Source Visit segment → are AEO efforts working?
- AI crawler logs (App Insights) → are AI products indexing us?
- Quarterly readout integrates SEO trends.

Don't start material SEO work before analytics has a few weeks of
baseline data. Otherwise we're optimizing blind.

### 6.3 Walkthrough app

Light overlap:

- The tour at `/tour/[slug]` is `noindex` (per analytics platform
  spec). SEO doesn't target it.
- The "Take Tour" form is the primary CTA. SEO ensures the entry
  pages funnel toward it cleanly.

---

## 7. Phasing

### Phase 0 — Audit + baseline (week 1)

Goal: know what's there, identify gaps, set targets.

- **T01: Technical SEO audit.** Crawl the site, parse all metadata,
  validate schema. Output: `audit/technical-audit.md` with
  pass/fail per check.
- **T02: On-page SEO audit.** Per-page review of title, meta,
  heading hierarchy, internal links, alt text. Output:
  `audit/on-page-audit.md`.
- **T03: Content audit.** Apply existing `voice/library-audit.md`
  ratings (from content platform Phase 0) plus a search-intent
  classification per piece. Output: `audit/content-audit.md`.
- **T04: AEO/GEO audit.** For each major page, evaluate: definitive-
  answer paragraph present? FAQ schema where Q&A exists? Citable
  structure? Output: `audit/aeo-audit.md`.
- **T05: Targets + measurement plan.** From the audits, pick the
  initial set of changes worth making (10-30 items, prioritized).
  Output: `targets-phase-1.md`.

### Phase 1 — Quick wins + structural fixes (weeks 2-3)

The fixes the audits surface as high-leverage and low-effort:

- Schema enrichments (FAQPage, BreadcrumbList, Product on /platform).
- Internal linking sweeps (related-posts component, hub-spoke link
  passes).
- Alt-text fixes.
- Title/meta optimization for the top 10 pages.
- Sitemap re-prioritization.
- Lighthouse CI wired into the deploy workflow with the proposed
  performance budget.
- Definitive-answer paragraph added to top blog posts.
- AEO restructuring of the top 5 pages.

### Phase 2 — Topic-cluster strategy + keyword targeting (weeks 4-6)

- Keyword research per persona — a flat document of 30-50 queries
  per primary persona with intent and difficulty.
- Topic-cluster map (5-10 clusters identified for first year of
  content).
- Hub-page + spoke-page outlines for each cluster.
- Per-piece keyword fields added to the content platform brief
  template.
- Content backlog re-prioritized to fill cluster gaps.

### Phase 3 — Content refresh + ongoing operations (weeks 6+)

- Refresh the highest-traffic legacy posts under the new voice
  + AEO/GEO structure.
- Establish monthly cadence: 1-2 hours per month of SEO maintenance
  (broken-link sweeps, schema validation, ranking checks).
- Quarterly review folded into the analytics platform's quarterly
  readout.
- Backlink strategy (separate Phase 4 project — out of scope for
  this one).

---

## 8. Open questions / decisions to confirm

- **Keyword research tool budget.** Ahrefs ($99/mo Lite),
  SEMrush ($129/mo Pro), or rely on free options (Google Keyword
  Planner, Ubersuggest free tier, Ahrefs Webmaster Tools free).
  Recommendation: start free for Phase 0 audit, decide on paid
  before Phase 2 keyword research. ~$100/mo if we go paid.
- **AI bot policy in `robots.txt`.** Currently `Allow: /` for all.
  Some companies block training bots (Google-Extended, ClaudeBot)
  to keep their content out of training sets, while allowing search
  bots (PerplexityBot, ChatGPT-User which crawl on demand for user
  queries). Spaarke decision: lean toward allowing all initially —
  citations are valuable — and revisit if we see data confirming
  unwanted training-data use.
- **Lighthouse CI strictness.** Set as warning (don't block deploys)
  initially. Promote to blocking after 1 month of stable green
  runs.
- **Schema testing tooling.** Google Rich Results Test, Schema.org
  Validator (free) for ad-hoc; we may want automated schema
  validation in CI later.
- **Translations / hreflang.** Out of scope for now. Spaarke's
  initial market is English-language North America. Multi-locale is
  a 12+ month decision.
- **Brand-name SEO defense.** Should we run light paid search on our
  own brand name to defend SERPs? Out of scope for this project (paid
  search is its own workstream) but worth flagging.

---

## 9. Inputs to make Phase 0 productive

When we're ready to start, the team supplies:

1. **Search Console access** — verify the property at
   `search.google.com/search-console`, share access with whoever
   runs the audit.
2. **Bing Webmaster Tools access** — same for Bing's equivalent.
3. **Existing SEO history** — any prior audits, ranking reports,
   keyword spreadsheets the team has accumulated.
4. **Competitive references** — 3-5 sites whose SEO + AEO posture
   we admire, even outside legal-tech (Stripe and Vercel are
   commonly cited).
5. **Strategic priorities for the next 6-12 months** — which
   audiences and which conversion goals matter most. Drives keyword
   prioritization.
6. **Content roadmap from content platform** — once content
   platform's calendar is initialized, SEO uses the planned topics
   to inform keyword targeting upstream rather than retrofitting.

These mirror the inputs pattern the content platform uses
(`tasks/00-inputs.md`).

---

## 10. Tasks (deferred)

Task files are not yet written. Will be created when:

- Analytics platform Phase 0 ships and has 2-3 weeks of baseline
  data.
- Content platform Phase 0 has a locked voice constitution.

Both prerequisites give SEO real material to optimize against,
rather than abstract intent. Premature SEO work optimizes for
queries we don't actually want to win and for content we don't
actually want to keep.

When we're ready, expected task structure (mirrors other projects):

- `tasks/00-inputs.md` — team supplies the items in §9.
- `tasks/01-technical-audit.md` through `tasks/04-aeo-audit.md` —
  Phase 0 audits, all parallelizable.
- `tasks/05-targets.md` — synthesize audit findings.
- `tasks/06+` — Phase 1 fixes, one per category.
- Phase 2 (keyword research + topic clusters) and Phase 3 (refresh)
  tasks written closer to execution time.
