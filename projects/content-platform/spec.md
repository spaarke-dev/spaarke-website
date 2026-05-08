# Content Platform — Specification

> A structured authoring system that produces on-brand long-form,
> medium-form, and short-form content for the Spaarke marketing site
> and external channels. Topic ideation comes from the team; drafts
> come from Claude grounded in a curated voice constitution; publishing
> flows through the existing site repo. The platform is not a tool —
> it is a small repository of files plus a workflow.

---

## 1. Purpose

Building a strong content presence requires three things at once:

1. **A consistent voice** across many pieces, channels, and authors.
2. **Authority** — content readers recognize as informed and considered,
   not generic AI output.
3. **Throughput** — a steady cadence (calendar) without each piece
   becoming a one-off project.

Claude can produce drafts at the level required, but only when the
session is grounded in Spaarke-specific context (who we are, what we
say, what we don't say, who we're writing for, what good content looks
like for us). The platform's job is to make that grounding **explicit
and reusable** so every draft starts from the same foundation rather
than relying on whatever fits in a given chat.

---

## 2. Goals & non-goals

**Goals**

- One Spaarke voice across white papers, blog posts, LinkedIn posts,
  and tweets — with form-appropriate calibration.
- A repeatable workflow: topic → brief → outline → draft → review →
  publish, with status tracked.
- Authoritative content that builds the Spaarke brand and the
  professional credibility of the team.
- A publication calendar that's the single source of truth for what's
  planned and shipping.
- Bootstrap from existing strong articles in `content/blog/` rather
  than starting from a blank page.

**Non-goals**

- Not a CMS. Final publishing for blog posts uses the existing
  `content/blog/*.mdx` flow. White papers, LinkedIn, and tweets export
  to plain text/markdown for posting through their native channels.
- Not a marketing-automation system. Distribution scheduling is manual
  for now (the team posts to LinkedIn / X / email / etc.).
- Not a quality gate. Humans review and approve every piece before
  publish — Claude does not auto-publish.

---

## 3. Architecture

### 3.1 Folder layout

```
projects/content-platform/
├── spec.md                              ← this file
├── tasks/                               ← project tasks (Phase 0+)
├── CLAUDE.md                            ← session-start routing for Claude
├── voice/                               ← the constitution (loaded every session)
│   ├── style-guide.md                   ← tone, voice, formatting, do/avoid
│   ├── brand-positioning.md             ← what Spaarke stands for, key narratives
│   ├── audience-personas.md             ← who we're writing for
│   ├── product-knowledge.md             ← Spaarke-specific facts
│   ├── domain-knowledge.md              ← legal-ops industry context
│   ├── vocabulary.md                    ← preferred terms, terms to avoid
│   └── examples/
│       ├── good-articles.md             ← annotated extracts from strongest existing
│       ├── tone-samples.md              ← short passages in our voice
│       └── avoid-this.md                ← AI-tells, marketing-speak, claims we don't make
├── content-types/                       ← per-type specifications
│   ├── white-paper.md
│   ├── blog-post.md
│   ├── linkedin-post.md
│   └── tweet.md
├── briefs/                              ← topic briefs (one per piece, fill before drafting)
│   └── <YYYY-MM-DD>-<slug>.md
├── drafts/                              ← work in progress, separated by type
│   ├── white-papers/
│   ├── blog-posts/
│   ├── linkedin-posts/
│   └── tweets/
├── published/                           ← finalized, ready for or already published
│   ├── linkedin-posts/                  ← the export — actual posting is manual
│   ├── tweets/
│   └── white-papers/                    ← (blog posts publish to /content/blog/ instead)
├── campaigns/                           ← coordinated multi-asset pushes around a theme or launch
│   ├── README.md                        ← what campaigns are, when to create one
│   ├── _template-campaign.md            ← schema for a new campaign file
│   └── <YYYY-MM>-<slug>.md              ← one per campaign
└── calendar.md                          ← single source of truth for what's planned/scheduled/live
```

Blog posts publish into the existing `/content/blog/*.mdx` (the site's
existing flow). White papers, LinkedIn posts, and tweets stay inside
the platform folder because they're channel exports, not site content.

### 3.2 The reading-priority ladder

When Claude starts a writing session, the agent reads in this order:

1. `projects/content-platform/CLAUDE.md` — session orientation.
2. `voice/style-guide.md` — voice and formatting rules.
3. `voice/brand-positioning.md` — what we're selling, narratively.
4. `voice/audience-personas.md` — who we're writing to.
5. `content-types/<type>.md` — calibration for the specific format.
6. `briefs/<slug>.md` — the article-specific brief.
7. (As referenced) `voice/product-knowledge.md`, `voice/domain-knowledge.md`,
   `voice/examples/*` — pulled in by name when the brief or topic
   needs them.

Voice docs are sized to fit comfortably in context together (target
≤ 4k tokens combined). Heavier reference (`product-knowledge.md`,
`domain-knowledge.md`, examples) is pulled in selectively per piece.

---

## 4. Content types

Four types, each with its own conventions. Each type has a doc in
`content-types/` that locks length, structure, voice calibration, and
CTA conventions.

### 4.1 White paper

- **Length**: 2,500–5,000 words.
- **Voice**: organizational, authoritative, evidence-led.
- **Structure**: executive summary → context/setup → 3–5 numbered
  sections → conclusion → action steps. Heavy use of headings, lists,
  callouts.
- **Citations**: required for every numerical claim. Footnoted or
  end-noted.
- **CTA**: low-pressure ("Talk to our team," "Read more in [related]").
  White papers earn trust; they don't close.
- **Site treatment**: published as a downloadable asset (PDF + landing
  page) plus an indexable HTML summary. Site work is Phase 3.
- **Frequency**: 1 per quarter target.

### 4.2 Blog post

- **Length**: 1,000–1,800 words. ~1,400 is the sweet spot.
- **Voice**: organizational by default; first-person occasionally for
  practitioner pieces (e.g. "After 12 years on the corporate-counsel
  side, …"). Always authoritative.
- **Structure**: hook in the first 2 paragraphs → 3–5 sections with
  H2s → close with a tight conclusion + a CTA paragraph.
- **Use**: 1–2 supporting images (screenshots, diagrams, photos).
  Pull-quotes optional. Code blocks rare.
- **CTA**: contextual to topic — "See it in the platform," "Read about
  X," "Get access."
- **Site treatment**: existing `content/blog/*.mdx` flow unchanged.
- **Frequency**: 2 per month target initially, scaling to weekly.

### 4.3 LinkedIn post

- **Length**: 150–400 words for text-only; carousel posts can be
  longer when split across slides.
- **Voice**: usually first-person from a Spaarke team member (with the
  individual's byline). Personal voice on LinkedIn dramatically
  outperforms organizational voice.
- **Structure**: opening hook in line 1–2 (LinkedIn's preview cuts off
  around line 3 on mobile). Short paragraphs (1–3 sentences each).
  Either a question or a CTA at the end. Hashtags minimal (3 max,
  bottom of post).
- **Variants**: standalone post; carousel (5–10 slides, key idea per
  slide); article-syndication (a 200-word teaser pointing to the full
  blog post).
- **CTA**: "Read the full piece →" (for syndications), "Curious how
  we'd approach X?", or no explicit CTA when the goal is engagement
  rather than conversion.
- **Frequency**: 2–3 per week target.

### 4.4 Tweet (X)

- **Length**: 280 char per tweet. Threads OK for longer ideas.
- **Voice**: usually organizational (Spaarke account) or a team member
  with the Spaarke handle in the bio.
- **Structure**: punchier than LinkedIn. One idea per tweet. Threads
  build progressively — each tweet must work standalone *and* earn the
  next tweet.
- **CTA**: link in last tweet of a thread, or in bio. Don't put links
  in early tweets — algorithm penalty.
- **Frequency**: 3–5 per week target initially.

### 4.5 Channel adapters

The same brief can produce multiple deliverables. Common pattern:

```
brief → blog post (1,500w)
        ↓ adapter
        ├── LinkedIn syndication (250w teaser + link)
        ├── 5-tweet thread highlighting the core argument
        └── (eventually) email-newsletter version
```

Adapters are not "shorten the article." They have different opens,
different hooks, different reading contexts. The brief carries enough
context for me to write each version natively rather than mechanically
condensing.

---

## 5. Voice constitution

The most important deliverable from Phase 0. Six small documents that
together capture Spaarke's voice and positioning so completely that I
can produce on-brand drafts in any format.

### 5.1 `style-guide.md`

What it covers:
- Tone descriptors (target: authoritative, direct, plainspoken,
  occasionally wry — avoid: corporate, breathless, evangelical).
- Sentence rhythm (mix of short and medium; avoid long compound
  sentences except occasionally for cadence).
- Voice (active over passive; first-person plural sparingly).
- Paragraph length (3–5 sentences; one-sentence paragraphs only for
  emphasis).
- Formatting conventions (sentence-case headings; numbers as numerals
  for ≥ 10; em-dashes — yes; semicolons — sparingly).
- Things we don't do (no exclamation points, no rhetorical
  questions in titles, no "imagine if…" openers).

Lives in `voice/style-guide.md`. Target length: ~1,200 words.

### 5.2 `brand-positioning.md`

- The one-line positioning statement.
- The 3–5 core narrative themes Spaarke keeps returning to (e.g.,
  "Microsoft-native — not bolted on", "The system of record for legal
  work", "Built for AI across the lifecycle").
- The competitive frame — who we're implicitly contrasted against
  without naming names.
- The proof points (what evidence we use to support claims).
- Not just slogans — the *why* of each, so I can defend a sentence's
  framing when challenged.

Target length: ~800 words.

### 5.3 `audience-personas.md`

Three to five personas with:
- Role + seniority (e.g., GC at a mid-cap, Director of Legal Ops at a
  Fortune 500, Managing Partner at a 50-attorney firm).
- What they care about (operational outcome they're hired to deliver).
- What they don't trust (hype, AI-magic claims, tech-for-tech's sake).
- Where they read (LinkedIn, ACC, ALA).
- Vocabulary they use vs. vocabulary they roll their eyes at.

Each piece's brief picks a primary persona; the draft is written *to*
that persona.

### 5.4 `product-knowledge.md`

Reference, not narrative. Sections covering:
- Architecture (Microsoft-native, hosted vs customer-tenant, the five
  capability modules).
- Integration surfaces (Outlook, Teams, Word, SharePoint, Power BI,
  Copilot Studio).
- The AI layer (Foundry IQ, Copilot Studio, Agent Framework — the
  three "Spaarke AI" pillars).
- What we don't claim (e.g., we don't claim "replaces lawyers", we
  don't claim 10x productivity).
- Differentiators — what's unique vs the alternatives.

Pulled in selectively; not every piece needs all of it.

### 5.5 `domain-knowledge.md`

Legal-ops industry context I should know without restating in every
brief:
- Common pain points (matter sprawl, spreadsheet chaos, OCG
  compliance, outside-counsel spend visibility).
- Industry stats and trustworthy sources (Axiom, ACC, BTI,
  Thomson Reuters reports, etc.).
- Terms of art and how they're used inside the field.
- Trends (rising in-house headcount, AI vendor proliferation, ELM
  consolidation, etc.) — with our point of view on each.

Pulled in selectively.

### 5.6 `vocabulary.md`

Two columns: terms we use, terms we avoid (with one-line reasons).
Examples:

| We say | We don't say | Why |
|---|---|---|
| matter | case | "case" is litigation-only; we're broader |
| outside counsel | external counsel | industry uses "outside" |
| platform | tool / app / suite | platform implies the breadth we have |
| operational intelligence | productivity | we're not a productivity app |

Target length: ~50 entries to start, growing as patterns emerge.

### 5.7 `examples/`

Three files, each pulling 3–5 short passages from real work:
- `good-articles.md` — extracts from existing strong blog posts plus
  short annotations on what makes them work.
- `tone-samples.md` — non-article passages (sales copy, deck speaker
  notes, founder interviews) in the voice we want.
- `avoid-this.md` — AI-tells, marketing clichés, things competitors
  say that we don't.

The annotations are the value here. "This works because it opens with
a *specific* observation, not a generic claim" lands far better with
me than abstract style rules.

---

## 6. Brief format

A brief is a short structured document the human fills in before
drafting. One template per content type (blog/whitepaper/linkedin/tweet)
with shared sections. Stored at `briefs/<YYYY-MM-DD>-<slug>.md`.

Front-matter fields (machine-readable for the calendar):

```yaml
---
slug: matter-management-vs-spreadsheets
type: blog-post                     # white-paper | blog-post | linkedin-post | tweet
publish_date: 2026-05-12
channels: [website, linkedin]       # primary distribution
status: brief                       # brief | outline | draft | review | scheduled | published
priority: high                      # high | normal | low
audience: corporate-counsel         # primary persona id
length_target: 1400                 # words (white-paper / blog-post) or chars (tweet)
byline: spaarke                     # spaarke | <team-member-name> | none
---
```

Body sections (vary by type, common subset):

```markdown
# Topic

# Angle / Point of view

# Why now

# Must include

# Must NOT include

# References (existing articles to link, sources to cite)

# Voice notes (deviations from default tone, if any)
```

Per-type briefs add their own fields — e.g., LinkedIn briefs add
`hook` (the first 1–2 lines explicitly), `format` (text-only |
carousel | syndication).

---

## 7. Workflow

### 7.1 States

| State | Owner | Output |
|---|---|---|
| **Topic** | Team | Idea entered in `calendar.md` with rough publish date |
| **Brief** | Team | `briefs/<slug>.md` filled in |
| **Outline** | Claude | Section structure + key claims; no prose yet. Reviewed before drafting. |
| **Draft** | Claude | Full draft in `drafts/<type>/<slug>.<ext>` |
| **Review** | Team | Edits and feedback. Multiple rounds expected. |
| **Polish** | Claude | Final pass: SEO, alt text, frontmatter, cross-links |
| **Scheduled** | Team | Moved to publish target with publish_date set |
| **Published** | Team | Live on the channel; `calendar.md` updated |

### 7.2 The outline step is non-negotiable

Most "this article isn't right" feedback comes from a structural issue
that an outline review would have caught. Outline → sign-off → draft
adds <30 minutes to a piece and saves hours on later rewrites.

### 7.3 Where things publish

- Blog post → `content/blog/<slug>.mdx` (the site's existing flow,
  unchanged).
- White paper → `content/papers/<slug>.mdx` (Phase 3 — site treatment
  TBD) plus a downloadable PDF in `public/papers/`.
- LinkedIn post → `published/linkedin-posts/<slug>.md` for the export
  (actual LinkedIn posting is manual).
- Tweet → `published/tweets/<slug>.md` (manual posting to X).

### 7.4 Bylines

Default byline rule: Spaarke as organization. Individual bylines when:
- LinkedIn posts (almost always individual — performs better).
- Long-form pieces where the individual's lived experience is the
  argument.
- Quoted commentary in industry publications.

Phase 1 lists active bylines (founder + 1–2 team members initially).
Each byline gets a one-paragraph bio in `voice/bylines.md`.

---

## 8. Calendar

A single Markdown file: `calendar.md`. Top of file = current month
table; below it, monthly sections going back. Source of truth for
status across all pieces.

```markdown
## 2026-05

| Slug | Type | Publish | Status | Author | Notes |
|---|---|---|---|---|---|
| matter-mgmt-vs-spreadsheets | blog-post | 2026-05-12 | draft | sp | reviewing tomorrow |
| spaarke-on-microsoft-native-q | linkedin-post | 2026-05-08 | scheduled | rs | |
| q2-2026-legal-ops-state | white-paper | 2026-05-30 | brief | sp | needs sources |

## 2026-04

| ... | ... | ... | ... | ... |
```

Updates are manual — when a piece changes state, the team or Claude
edits the calendar to match. This is intentional: the calendar is
human-authored, not generated, so it stays trustworthy.

---

## 9. Library audit (existing articles)

Existing posts in `content/blog/` are bootstrap material. Before Phase
0 ships voice docs, we run a one-time audit:

### 9.1 Voice tagging

Each existing article tagged in a `library-audit.md` file:
- ✅ **Strong** — exemplary of the voice we want. These become source
  material for `voice/examples/good-articles.md`.
- ◐ **Decent** — directionally right, minor refinements may help.
- ⚠ **Off** — doesn't match the voice we want; either rewrite under the
  new voice or mark as legacy.

Existing library described as "not far off" overall, so most pieces
should land at ✅ or ◐.

### 9.2 Taxonomy audit

Current frontmatter tags four ways: `organization`, `function`, `topic`,
`theme`. Audit:
- Are the categories meaningful and consistent?
- Are tags used predictably or has it drifted?
- Do they align to our audience personas?
- Should any be retired or merged?

Outcome: a `voice/taxonomy.md` documenting the canonical tag values per
category. The brief template's `audience` field draws from this list.

---

## 10. Phasing

### Phase 0 — Voice extraction (the bootstrap)

Goal: produce the voice constitution.

- T01: Audit existing articles + content snippets you provide.
- T02–T07: Draft each `voice/*.md` file.
- T08: Curate `voice/examples/`.
- You revise; we lock the constitution.

Estimated effort: 4–6 hours of input from you, ~1 week round-trip.

### Phase 1 — Workflow tooling

Goal: every supporting file in place to start the first piece.

- Per-type briefs and content-type specs in `content-types/`.
- Brief templates per content type.
- Calendar file initialized.
- `CLAUDE.md` routing doc.
- Library audit (voice tagging + taxonomy review).

### Phase 2 — First batch (3–4 pieces)

Run 3–4 pieces end-to-end through the full workflow. The first piece
is the slowest because we're calibrating; by the third the cycle is
tight. Each completed piece becomes a calibration data point — drift
in tone or framing gets captured back into the voice docs so it
doesn't recur.

Recommended starting batch:
- 1 white paper (most demanding — earliest is best for learning).
- 2 blog posts (different audiences / personas).
- 3–4 LinkedIn posts (faster turn, more iterations to dial in).

### Phase 3 — Channel adapters + library functionality

- Adapter discipline: starting from one brief, produce native versions
  for blog + LinkedIn + (optionally) tweet thread.
- Email newsletter format.
- Site library functionality refresh (filters, related posts, search,
  RSS) — separate scope, can run in parallel.

### Phase 4 — Cadence + telemetry

- Steady cadence per the calendar.
- Track engagement per piece (clicks, reads, LinkedIn impressions /
  reactions, tour-page jumps from articles).
- Refine voice docs based on what's actually performing.

---

## 11. Open questions / decisions to confirm

- **Where do white papers live on the site?** Options: a `/resources`
  or `/papers` section indexable like blog; a gated-download page;
  no on-site presence (LinkedIn-distributed PDF). Recommendation: a
  light HTML version at `/papers/<slug>` plus a downloadable PDF;
  ungated. Confirm at start of Phase 3.
- **Email newsletter — yes/no, when?** Phase 3 question. If yes, picks
  up automatically once 4–5 strong pieces exist.
- **Active bylines for Phase 1.** Need 2–3 named team members willing
  to have pieces in their voice. List + bios go in `voice/bylines.md`.
- **Cadence target.** Initial: 2 blog posts/month + 2–3 LinkedIn/week
  + 3–5 tweets/week + 1 white paper/quarter. Sustainable? Adjust after
  Phase 2.
- **External author or thought-leader collaborations?** Out of scope
  for Phase 0–2 but worth thinking about. A guest post from a
  recognized voice (former GC, well-known legal ops practitioner) is
  high-leverage for credibility.
- **Distribution — should social posts cross-link to articles, or
  stand alone?** Recommendation: every long-form piece gets at least
  one LinkedIn syndication and one tweet thread. Standalone social
  posts also exist for ideas that don't merit a full article.
