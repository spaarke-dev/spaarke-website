# T11 — Phase 0 review notes

**Phase**: 0
**Wave**: 6
**Status**: awaiting team review
**Owner**: Spaarke team, with Claude assisting on revisions

---

## How to use this file

Phase 0 is drafted. Eleven files now exist in `projects/content-platform/`
and need a read-and-revise pass before the voice constitution is locked.

Two ways to capture edits — pick one or mix:

1. **Inline** — open each file, edit directly. Use HTML comments
   `<!-- TEAM: ... -->` for inline notes if helpful.
2. **Issue list** — keep a flat list in this file (Section 2 below) and
   batch-apply with Claude.

When a batch of issues is ready, hand it to Claude with a prompt like:
"Apply the edits in `tasks/11-review-notes.md` §2." Claude will work
through them, report which were applied, and flag any internal
inconsistencies it notices (e.g., a vocabulary entry that conflicts
with a style-guide rule).

Two or three rounds is normal. The constitution is locked when reading
each voice doc doesn't make you wince.

---

## 1. Review checklist

Estimated time per file in parens; total ~3–5 hours of focused review.

### Voice constitution (~2 hours total)

- [ ] `voice/style-guide.md` (~30 min) — does this sound like Spaarke?
      Is the do/avoid list complete?
- [ ] `voice/brand-positioning.md` (~20 min) — is the positioning
      statement *us*? Are the 4 themes the right ones?
- [x] `voice/audience-personas.md` (~30 min) — do these personas match
      the people we're actually writing to? Are any missing? *Note: the
      drafting agent compressed "what they care about" / "what they
      don't trust" lists from 5 bullets to 3–4 to hit the word target.
      Repopulate if specificity was lost.* **Resolved 2026-05-07: all
      four personas restored to 5 bullets per list.**
- [ ] `voice/product-knowledge.md` (~20 min) — factually correct?
      Anything to add or remove? *13 `**TBD — confirm**` tags need
      resolution; see §3 below.*
- [ ] `voice/domain-knowledge.md` (~20 min) — POV-on-trends section:
      do we agree with these positions? *6 `**TBD — confirm**` stat
      citations need source verification.*
- [ ] `voice/vocabulary.md` (~10 min) — quick scan of preferred +
      avoided columns.
- [x] `voice/examples/good-articles.md` (~10 min) — are the
      good-articles selections the strongest? *Resolved 2026-05-07:
      `the-ai-readiness-gap` added as the 5th article; file trimmed
      from 2,864 → ~2,450 words.*
- [x] `voice/examples/tone-samples.md` (~5 min) — *Resolved 2026-05-07:
      trimmed from 1,019 → ~850 words; reduced from 8 to 7 passages
      (dropped Legal IQ stack Layer 1 close — redundant with the Legal IQ stack
      flywheel close already in `good-articles.md`).*
- [x] `voice/examples/avoid-this.md` (~5 min) — are these characteristic
      of failures we'd reject? *Resolved 2026-05-07: trimmed from 1,002
      → ~785 words; 7 negative examples preserved; "Better — write"
      extracts kept verbatim per spec.*
- [ ] `voice/bylines.md` (~10 min) — Phase 1 bylines: review Ralph's
      bio, confirm LinkedIn URL placeholder, decide whether to keep the
      two TBD placeholder entries or wait until the named team members
      are in place before publishing the file.
- [ ] `voice/visual-identity.md` (~15 min) — does the hero discipline
      match what we want for the brand? Are the do-not-generate items
      complete? Are the hex codes correct?
- [ ] `voice/taxonomy.md` (~10 min) — canonical blog tag values per
      category (organization / function / topic / theme), built from a
      drift audit of the 16-article library. Locked 2026-05-06.

### Content-type specs (~30 min)

- [ ] `content-types/white-paper.md` (1,078 words — trimmed 2026-05-07)
- [ ] `content-types/blog-post.md` (1,093 words — trimmed 2026-05-07)
- [ ] `content-types/linkedin-post.md` (1,098 words — trimmed 2026-05-07)
- [ ] `content-types/tweet.md` (687 words — trimmed 2026-05-07)

Do each format-calibration match what's actually successful for us on
each channel?

### Workflow tooling (~30 min)

- [ ] `CLAUDE.md` — clear and short enough to read every session?
      (532 words — within cap.)
- [ ] `briefs/_template-white-paper.md`
- [ ] `briefs/_template-blog-post.md`
- [ ] `briefs/_template-linkedin-post.md`
- [ ] `briefs/_template-tweet.md`
- [ ] `calendar.md` — initial topic list reasonable? Dates feasible?
      Bylines marked `tbd` for 4 rows where Future Legal Ops Leader /
      Future Architecture Lead haven't been named yet — names go in
      `voice/bylines.md` (Phase 1).

### Library audit (~30 min)

- [ ] `voice/library-audit.md` — do you agree with the ✅/◐/⚠ ratings?
      Any flags to adjust? *Single ⚠ is `welcome-to-spaarke` — decide
      Phase 1 disposition: rewrite, mark legacy, or unpublish.*

---

## 2. Edit list

Capture issues here as you read. One issue per bullet. Format:

```
- **<file>** — <description of the issue, what to change>
```

Examples:

```
- **voice/style-guide.md §1** — voice contrast #3 ("Plainspoken, not
  corporate") still has a corporate-flavored "we say" example. Replace
  with something punchier from the-iq-stack.
- **voice/audience-personas.md** — add a fifth persona for outside-counsel
  managing partners at Am Law 100 firms; current `firm-operations-leader`
  is mid-size firm and we have content aimed at larger firms too.
- **voice/vocabulary.md §2** — add "operationalize" to the avoid column;
  reason: consultantism, replace with the actual verb.
```

(Empty — fill in during review.)

### Applied 2026-05-06 (hero-regeneration prompts)

- **`tasks/hero-regeneration-prompts.md`** — created. Paste-ready
  hero-image generation prompts for the seven articles flagged in the
  §2 2026-05-06 visual-identity entry whose existing heroes lean on
  the futuristic-HUD / circuit-board / wireframe-hand / data-particle
  tropes the new identity moves away from: `welcome-to-spaarke`,
  `breaking-the-silo`, `the-ai-readiness-gap`,
  `your-legal-data-belongs-to-you`,
  `what-attorneys-need-to-know-about-ai`, `institutional-knowledge`,
  `the-20b-blind-spot`. Each entry follows `voice/visual-identity.md`
  §7 structure (style prefix · abstract subject · composition ·
  negative list), uses real palette hex codes from §3, applies the
  do-not-generate list from §5 in every prompt's negative, and
  includes per-tool flag adjustments for Midjourney v6.1+,
  DALL-E 3 / GPT-4o, Adobe Firefly, and ComfyUI (SDXL/FLUX with
  optional brand LoRA trained on the four strong heroes). Concepts
  are abstract — nested containment frames for `welcome-to-spaarke`,
  isometric grid with an unjoined cluster for `breaking-the-silo`,
  partially-formed stair for `the-ai-readiness-gap`, geometric
  perimeter for sovereignty, three-bar typographic triad for the
  attorneys-and-AI piece, accumulated concentric strata for
  institutional knowledge, and a deliberate void in an otherwise
  complete tile field for `the-20b-blind-spot`. No literal lawyers,
  chains, padlocks, dollar signs, gavels, or HUD overlays.
- **`briefs/2026-05-11-welcome-to-spaarke.md`** — added a `# Hero
  graphic` section (per the `_template-blog-post.md` pattern) carrying
  the same prompt drafted in the file above. Replaced the stale
  "Agent J is producing the visual-identity guide and a hero-prompt
  section will be added to briefs in a separate pass" sentence in
  `# Voice notes` with a pointer to the new section, since
  `voice/visual-identity.md` is now locked.
- **§4 follow-up** — the hero-regeneration batch is struck through
  in §4 below; prompts are drafted and the team can run them through
  any of the four supported generators.

### Applied 2026-05-19

- **`briefs/2026-05-19-welcome-to-spaarke.md`** — first brief authored
  under the locked voice constitution. Topic: flagship reset/relaunch
  "Welcome to Spaarke" piece replacing the single ⚠ entry from the
  T01 library audit. Audience: `corporate-counsel` primary, reads for
  `legal-ops-director` and `legal-tech-cio`. Length target 1,500 words,
  organizational byline, channels: website + linkedin, priority: high.
  Status: brief written, draft authored.
- **`drafts/blog-posts/welcome-to-spaarke.mdx`** — full first draft
  authored. Word count 1,428 (target 1,400–1,600). Title chosen:
  "Welcome to Spaarke" — slug carries weight, opener subverts
  expectations rather than fulfilling them. Alternate proposed in a
  comment at the top of the file: "What Spaarke Is For." Five H2
  sections (LOI definition / AI-directed, human-controlled / Microsoft
  tenant / tools-to-operating-models / what you'll read here). Three
  internal cross-links: `/platform`, `/why-spaarke/what-is-legal-operations-intelligence`,
  `/why-spaarke/why-we-built-on-microsoft` — plus an inline reference to
  `/why-spaarke/the-iq-stack`. Hero image is a placeholder path with a top-of-file
  comment noting Agent J is producing the visual-identity guide and a
  hero-prompt section will be added to briefs in a separate pass.
  Final-pass against `voice/examples/avoid-this.md` and
  `voice/style-guide.md` §5 complete — no violations. The only stat
  cited (in-house legal generative-AI use 23% → 52% in a year) is
  drawn from `voice/domain-knowledge.md` §4 and traces to ACC × Everlaw
  2025 per `voice/research-sources.md`. Status: **draft awaiting team
  review**.
- **Phase 1 disposition recommendation for the existing
  `content/blog/2026-02-01-welcome-to-spaarke.mdx`** — replace in place
  at the same slug after team review of this draft. The current article
  is the single ⚠ in the library audit (services-firm voice — "we are
  thrilled," "ignite innovation," "strategic consulting / technology
  solutions / innovation workshops"); the new draft retires it. Slug
  preserved (`welcome-to-spaarke`) so any inbound links continue to
  resolve. The existing file's `order: 1` and `featured: true /
  featuredOrder: 1` should carry over to the replacement; both are set
  in the new draft frontmatter.

### Applied 2026-05-06 (hero-graphic discipline)

- **`voice/visual-identity.md`** — created (1,755 words). Codifies the
  Spaarke hero look informed by the existing 16-piece library:
  geometric, abstract, confident dark slab, vector-illustration over
  photoreal. Locks the brand palette from `src/app/globals.css`:
  backgrounds `#0A0A0A` / `#111111` / `#0A0A14` / `#1A1230` / `#2D1F5E`,
  accents `#000BFF` (Spaarke Blue), `#4060DC` (CTA blue), `#7B5BFF`
  + `#FF4DCB` (low-opacity glow), copper/gold `#CB9959` and warm
  orange `#D9803A` as sparing accent. 5 style descriptors, do-not-
  generate list, generator recommendations (Midjourney v6.1+ with
  `--style raw --ar 16:9`, Firefly for IP-safety, DALL-E 3 for
  composition control), prompt structure, three worked examples
  pulled from `calendar.md` (Legal IQ, human-in-the-loop, fragmented
  legal tech).
- **Brief templates** — added a `# Hero graphic` section to
  `_template-blog-post.md`, `_template-white-paper.md`,
  `_template-linkedin-post.md`, `_template-tweet.md`. Each captures
  prompt, style preset, aspect ratio, alt text, generator notes;
  tweet template defaults to "no image" with opt-in.
- **Content-type specs** — added a one-paragraph hero-treatment
  pointer to `content-types/blog-post.md` (§4 image treatment),
  `white-paper.md` (§5 visual treatment), `linkedin-post.md` (§2
  variants), and `tweet.md` (§2 variants). Also added the
  `keyTakeaways` constraint to `blog-post.md` §6 (3–5 strings; 18–35
  words each; Spaarke voice).
- **`CLAUDE.md`** — workflow expanded from 4 to 5 steps (added
  step 5: hero prompt). Added `voice/visual-identity.md` to §1
  selective references. Word count 532 → 579 (≤ 600 cap).
- **Tension flagged for the team**: roughly half the existing 16
  heroes lean on the "futuristic HUD / circuit-board / wireframe-
  hand / rocket-arrow" trope (`breaking-the-silo`,
  `the-ai-readiness-gap`, `your-legal-data-belongs-to-you`,
  `welcome-to-spaarke`, `what-attorneys-need-to-know-about-ai`,
  `institutional-knowledge`, `the-20b-blind-spot`). The new identity
  codifies the *other* half — `loi-maturity-model` (isometric
  cubes), `the-iq-stack` (typographic), `what-is-loi` (tree rings),
  `why-we-built-on-microsoft` (spiral particle field). No
  retroactive regeneration is required, but Phase 1 should decide
  whether to refresh the HUD-style heroes or let them age out as
  new pieces ship.

### Applied 2026-05-07

- **`voice/examples/good-articles.md`** — added `the-ai-readiness-gap`
  as the 5th annotated article (per audit §3 recommendation). Trimmed
  the four existing entries by reducing 4-paragraph extracts to 2–3
  paragraphs and dropping generic "What's working here" bullets.
  Result: 5 articles, 2,864 → ~2,450 words.
- **`voice/examples/tone-samples.md`** — trimmed multi-paragraph
  extracts and tightened "Why included" / "Use this when" lines.
  Dropped the Legal IQ stack Layer 1 close passage (redundant with the IQ
  Stack flywheel close already in `good-articles.md`). Result: 8 → 7
  passages, 1,019 → ~850 words.
- **`voice/examples/avoid-this.md`** — shortened the constructed
  "Don't write" examples to 1–2 sentences and tightened "Why this
  fails" bullets to 2 specific bullets per entry. "Better — write"
  verbatim extracts preserved intact per spec. Result: 7 negative
  examples preserved, 1,002 → ~785 words.

### Applied 2026-05-08 — taxonomy retag

Frontmatter-only retag pass across the 10 articles flagged in
`voice/taxonomy.md` §4 audit table. Bodies untouched. Every remaining
tag value verified against the canonical sets in §2. Single-commit
work (`chore(content): retag blog library per voice/taxonomy.md`).

- **`content/blog/2026-01-04-what-is-legal-operations-intelligence.mdx`**
  — theme: removed `thought-leadership`. Final: `legal-operations-intelligence, iq-stack`.
- **`content/blog/2026-01-11-the-iq-stack.mdx`** — function: removed
  `business-analyst`. Final: `operations, attorney`.
- **`content/blog/2026-01-18-loi-maturity-model.mdx`** — theme: removed
  `thought-leadership`. Final: `legal-operations-intelligence, iq-stack`.
- **`content/blog/2026-02-15-what-attorneys-need-to-know-about-ai.mdx`**
  — theme: removed `thought-leadership`. Final: `ai-strategy, data-sovereignty, microsoft-ecosystem`.
- **`content/blog/2026-03-01-the-ai-readiness-gap.mdx`** — function:
  removed `business-analyst`; theme: removed `thought-leadership`.
  Final function: `operations, executive, attorney`. Final theme:
  `ai-strategy, legal-operations-intelligence, iq-stack`.
- **`content/blog/2026-03-07-the-20b-blind-spot.mdx`** — topic: removed
  `invoicing` (canonical `e-billing` already present); theme: removed
  `thought-leadership`. Final topic: `legal-spend, e-billing, reporting, vendor-management`.
  Final theme: `legal-operations-intelligence, iq-stack`.
- **`content/blog/2026-03-14-institutional-knowledge.mdx`** — function:
  removed `legal-professional` (canonical `attorney` already present);
  theme: removed `thought-leadership`. Final function: `attorney, operations, executive`.
  Final theme: `operational-memory, iq-stack, legal-operations-intelligence`.
- **`content/blog/2026-03-21-breaking-the-silo.mdx`** — function:
  removed `business-analyst`. Final: `operations, finance, executive, attorney`.
- **`content/blog/2026-03-25-legal-ops-is-not-it-for-lawyers.mdx`** —
  function: removed `legal-professional`; theme: removed
  `thought-leadership`. Final function: `operations, executive, attorney`.
  Final theme: `legal-operations-intelligence, iq-stack, operational-memory`.
- **`content/blog/2026-03-31-spaarke-feature-specification.mdx`** —
  function: removed `business-analyst` and `legal-professional`; topic:
  removed `invoicing`. Final function: `operations, attorney, it, executive, finance`.
  Final topic: `matter-management, e-billing, legal-spend, dms, workflow, contracts, reporting, ai-copilot, compliance, vendor-management`.
- **`content/blog/2026-02-01-welcome-to-spaarke.mdx`** — **skipped** per
  T11 §4 disposition. Legacy flat-array `tags: ["news", "updates", "company"]`
  preserved unchanged. The new draft at
  `projects/content-platform/drafts/blog-posts/welcome-to-spaarke.mdx`
  will replace it in place at the same slug under the structured tag
  shape; full retag happens at swap time.
- **Validation**: every tag value across the 10 retagged articles maps
  to a slug in `voice/taxonomy.md` §2. No drifted values remain.
  Most-frequent retag: `theme: thought-leadership` removed across 7
  articles. No article bodies modified.

### Applied 2026-05-07 (round 2)

- **`voice/product-knowledge.md`** — resolved the 3 remaining TBDs.
  §7 misconception #2 (matter-type list) — dropped TBD; the list is
  already inline. §8 M365 install base — pivoted from the unverified
  ">85% F500 on M365" to the verified ~70% F500 on M365 Copilot
  (Microsoft FY25 Q1 earnings) plus 15M paid seats / 420M MAU
  (Microsoft 2026 Work Trend Index). §8 Copilot adoption in legal —
  replaced the ">50% legal orgs use Copilot" claim with verified
  per-survey figures (40% Copilot among AI-adopting in-house, ACC ×
  Everlaw, Wolters Kluwer 2026). Result: zero remaining TBDs in
  product-knowledge.md.
- **Inconsistency flagged for the team**: the live blog post
  `content/blog/2026-01-25-why-we-built-on-microsoft.mdx` makes a
  ">50% of legal orgs use Microsoft Copilot" claim that overstates
  the verified figure (closer to 40% Copilot among AI-adopting legal
  per Counselwell/Spellbook 2025). Recommend correcting in a separate
  pass — minor edit, but the figure is wrong on the live site.

### Applied 2026-05-07

- **`voice/product-knowledge.md`** — resolved 5 high-stakes TBDs based
  on team answers: SharePoint Embedded confirmed as canonical document
  layer (§2.2, §6, §8 differentiators and runtime stack updated, §1
  boilerplate updated to name SPE explicitly); Microsoft Agent
  Framework confirmed as a real Microsoft product (§3.3 rewritten,
  framed comparable in scope to other major AI vendors' agent
  frameworks); customer-tenant deployment reframed factually as
  genuinely differentiating (§2.3 hedge removed, §6 differentiator
  rewritten); product launch year set to 2026 (§1, §8); Copilot
  adoption stat left as TBD with Agent B research pending note (§8).
  Tightened obsolete hedging in misconception #4. Other TBDs left in
  place per scope.
- **`voice/audience-personas.md`** — restored "What they care about"
  and "What they don't trust" lists to 5 bullets per persona for all
  four personas (`corporate-counsel`, `legal-ops-director`,
  `legal-tech-cio`, `firm-operations-leader`). New bullets pulled
  from team sketches in `tasks/00-inputs.md` §2 with specific framing
  (operational complexity, M365 integration as primary destination,
  technology sprawl, service-delivery quality, partnership economics,
  fee-reduction framing, etc.).
- **`content/blog/` frontmatter — bulk `keyTakeaways` conversion.**
  Twelve articles converted from legacy `summary:` paragraphs to the
  new `keyTakeaways:` bullet format, closing the visual inconsistency
  documented in `tasks/blog-summary-bullet-conversion.md`. Locked
  shape: 3–5 bullets per article, 18–35 words each, single-sentence
  declarative claims in Spaarke voice. Skipped two of the
  unconverted-13: `welcome-to-spaarke` (already converted in the
  original 3) and `spaarke-feature-specification` (Agent H is doing a
  full rewrite in parallel; bullets will be drafted there). All 48
  bullets verified within the 18–35 word range. Frontmatter only — no
  article bodies modified. The team should review the drafted bullets
  in `tasks/blog-summary-bullet-conversion.md` §"Conversion log —
  2026-05-07."

---

## 3. Outstanding `**TBD — confirm**` tags to resolve

### `voice/product-knowledge.md` (13 tags — most critical)

Notable items the drafting agent flagged:

- ~~SharePoint vs SharePoint Embedded as the canonical document layer~~ **Resolved 2026-05-07: SPE is canonical.**
- ~~Whether "Agent Framework" maps to a specific Microsoft product or is
  Spaarke-coined terminology~~ **Resolved 2026-05-07: Microsoft Agent Framework, real Microsoft product.**
- ~~The "only legal SaaS with both hosting models" competitive claim~~ **Resolved 2026-05-07: customer-tenant deployment is genuinely differentiating; reframed factually.**
- ~~M365 / Copilot adoption stats inside Fortune 500 legal
  departments~~ **Resolved 2026-05-07** via the same research pass
  that resolved the domain-knowledge stats. See `voice/research-sources.md`,
  "M365 Copilot adoption — broad enterprise" and "M365 Copilot
  adoption — corporate legal specifically." The product-knowledge
  copy can now cite Microsoft FY25 Q1 (70%+ Fortune 500), Microsoft
  Work Trend Index 2026 (15M paid seats; 420M MAUs), and
  Counselwell/Spellbook 2025 (40% Copilot share among AI-adopting
  in-house legal teams).
- ~~Spaarke product launch year~~ **Resolved 2026-05-07: 2026.**
- 8 product TBDs and 0 domain TBDs remain. (See files for full list.)

### `voice/domain-knowledge.md` (6 tags) — all resolved 2026-05-07

- ~~$20B figure (outside-counsel spend visibility / leakage)~~ —
  **dropped**. No defensible primary source for an aggregate US
  outside-counsel total. Replaced with per-company benchmark: median
  total legal spend at >$20B-revenue companies is $80M (ACC/MLA 2024).
- ~~94% data-difficulty figure~~ — **dropped and replaced**. Figure
  traces to a 2021 EY/Harvard survey, not Wolters Kluwer; now too
  dated. Replaced with 2025 EY Law GC Study figures (52% disorganized
  data; 75% rebuilding tech/data strategy).
- ~~20% in-house attorney turnover figure~~ — **hedged**. No primary
  source validated 20% as a clean annual-turnover rate. Replaced with
  ACC State of Stress Among In-house Legal Professionals (Dec 2025):
  24% of high-stress in-house counsel plan to leave within a year.
  Marked directional in the file.
- ~~~30% in-house headcount-growth figure (decade trend)~~ —
  **resolved (and corrected upward)**. ACC, citing US BLS, reports
  87% growth from 2008 to 2024 (78,000 → 145,000). The previous "~30%
  over the past decade" framing significantly understated reality.
- ~~M365 Copilot adoption figure inside legal departments~~ —
  **resolved**. Microsoft FY25 Q1 earnings: 70%+ of Fortune 500 had
  adopted M365 Copilot by late 2024. Microsoft Work Trend Index 2026:
  15M paid M365 Copilot seats; 420M monthly active Copilot users.
  Caveats on "adoption" recorded in research-sources.md.
- ~~Wolters Kluwer report recency~~ — **resolved**. 2026 edition
  released March 10, 2026 is current. Older editions (2024, 2023)
  flagged as superseded.

Full citations, dates checked, and per-source caveats now live in
`voice/research-sources.md` (created 2026-05-07).

**Applied 2026-05-07.** All 6 domain-knowledge TBD tags resolved:
4 replaced with stronger figures, 1 hedged (turnover), 1 dropped
(aggregate outside-counsel dollar figure). §5 of domain-knowledge.md
pivoted to point at research-sources.md as the repository of record.

---

## 4. Items deferred to Phase 1

Don't attempt to resolve these in T11 — they're tracked here so they
don't get lost:

- ~~**`voice/bylines.md`** — one-paragraph bio per active byline. Need
  Ralph Schroeder + 1–2 Future-TBD team members named first. Currently
  4 calendar rows have `byline: tbd`.~~ **Drafted 2026-05-06 in
  Phase 1**: Ralph's entry written on-voice; the two future roles
  recorded as `placeholder` status. Three `tbd` rows remain in
  `calendar.md` pending the named team members.
- ~~**`voice/taxonomy.md`** — canonical tag values per category
  (organization / function / topic / theme). Audit existing
  `content/blog/` frontmatter for drift, then lock.~~ **Locked
  2026-05-06.** 5 / 5 / 10 / 9 canonical values; 7 tags retired
  (legal-professional, business-analyst, invoicing, thought-leadership,
  news, updates, company); 11 of 16 articles need retag.
- ~~**Retag the existing 16 articles per `voice/taxonomy.md` audit
  table** — separate Phase 1 pass. Tag-only edits to MDX frontmatter;
  no body changes. Single commit
  `chore(content): retag blog library per voice/taxonomy.md`.~~
  **Resolved 2026-05-08.** 10 articles retagged in place; legacy
  `welcome-to-spaarke` skipped pending the queued v2 swap. See §2
  "Applied 2026-05-08 — taxonomy retag" above for per-article detail.
  Taxonomy follow-up fully resolved.
- **`welcome-to-spaarke` disposition** — the single ⚠ in the audit.
  Three options: rewrite under new voice, mark as legacy, or unpublish.
- **◐ articles** — `spaarke-for-your-it-team` and
  `spaarke-feature-specification` are reference docs, not
  thought-leadership prose. Likely stay as-is, but confirm.
- **Brief template population** — actual briefs (not templates) for the
  12 calendar topics. P1.2 task.
- **First-batch articles** — Phase 2 (recommended starting batch:
  1 white paper + 2 blog posts + 3–4 LinkedIn posts).
- ~~**Hero-regeneration batch** — the seven HUD-tropey heroes flagged
  in the §2 2026-05-06 visual-identity entry (`welcome-to-spaarke`,
  `breaking-the-silo`, `the-ai-readiness-gap`,
  `your-legal-data-belongs-to-you`,
  `what-attorneys-need-to-know-about-ai`, `institutional-knowledge`,
  `the-20b-blind-spot`). Decide whether to refresh under the new
  identity or let them age out as new pieces ship.~~ **Prompts drafted
  2026-05-06.** Generate images via Midjourney/DALL-E/Firefly/ComfyUI
  per `tasks/hero-regeneration-prompts.md`; drop into
  `/public/images/blog/<slug>.jpg`.

---

## 5. Lock procedure

When the team is satisfied:

1. Add a one-line footer to each `voice/*.md`, `content-types/*.md`,
   and `CLAUDE.md`:
   `Locked YYYY-MM-DD — see git log for history.`
2. Tag the git commit:
   `git tag content-platform-phase-0-locked`
3. Write a short post-lock note in this file (Section 6 below)
   summarizing the major revisions made and decisions deferred.

After locking, voice-constitution edits should go through a deliberate
change process (commit + brief explanation in the commit body) — not
ad-hoc.

---

## 6. Post-lock summary

(Fill in after locking.)

- **Locked**: YYYY-MM-DD
- **Revision rounds**: <n>
- **Major revisions**: <bullet list>
- **Decisions deferred**: <bullet list>
- **Internal inconsistencies caught and resolved**: <bullet list>
