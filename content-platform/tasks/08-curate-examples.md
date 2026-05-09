# T08 — Curate `voice/examples/`

**Phase**: 0
**Wave**: 3 (parallel with T02–T07)
**Dependencies**: T00, T01

## Goal

Curate three reference files of real passages — extracted from
existing strong articles, team-supplied tone samples, and clearly-bad
examples to avoid. Annotation is the value; the goal is "show, don't
tell" voice.

These files are read selectively. They're the thing I reach for when
I want concrete examples of openings, transitions, closings, or
particular voice traits.

## Reads (required context)

- `content-platform/spec.md` §5.7.
- `content-platform/tasks/00-inputs.md` §1 (yes-this-is-us
  references) and §4 (do-not-claim list).
- `voice/library-audit.md` (T01) — Section 3 (recommended source
  material) lists the articles to mine.

## Deliverables

Three Markdown files in `voice/examples/`:

### 1. `voice/examples/good-articles.md`

Annotated extracts from strong existing articles. ~2,000 words.

For each of 3–5 articles flagged ✅ in the audit:

```markdown
## From: <article title> (<slug>, published <date>)

### Why this article
<2-3 sentences on what this article does well as a whole — the trait
this extract is intended to illustrate>

### Extract: opening
> <quote 2-4 paragraphs from the article verbatim>

**What's working here**:
- <specific observation, e.g., "First sentence makes a concrete
  observation, not a generic claim">
- <2-3 more bullets>

### Extract: middle / transition / argument
> <quote a section that does one specific thing well>

**What's working here**:
- ...

### Extract: closing
> <quote the final 1-2 paragraphs>

**What's working here**:
- ...
```

3–5 articles. The annotations are the asset. Generic praise ("good
opener") is useless; specific traits ("opens with a concrete
incident, not an abstraction") drives drafting.

### 2. `voice/examples/tone-samples.md`

Short passages — non-article — that capture the voice. ~800 words.

Sources team can supply (in T00 §1 or follow-up):
- LinkedIn posts.
- Sales-deck speaker notes.
- Founder-interview transcripts (with permission).
- Internal Slack messages or emails (with permission).

For each passage:

```markdown
## <source> — <date>

> <verbatim passage, 50-200 words>

**Why included**: <1-2 sentences on what voice trait this captures>

**Use this when**: <a hint on what kind of brief this is most
illustrative for, e.g., "Writing in a personal voice; use when the
brief says byline = founder">
```

5–8 passages. Diverse — different voices, different situations.
The point is range — voice isn't monolithic; it adapts.

### 3. `voice/examples/avoid-this.md`

Negative examples. ~600 words.

Sources:
- AI-tells (generic openers, formulaic transitions).
- Marketing-speak from competitors (anonymized).
- Earlier drafts that we explicitly rejected (with team permission).
- Stock phrases from the do-not-claim list (T00 §4).

For each:

```markdown
## <category — e.g., "AI-tell openers">

### Don't write
> <example passage>

**Why this fails**:
- <specific — "Reads as AI because…">
- <specific — "Empty calorie because…">

### Better — write
> <a contrasting example, ideally pulled from real Spaarke writing>
```

5–8 entries covering different failure modes. Categories to consider:
- AI-tell openers ("In today's fast-paced world…").
- Vague abstractions ("Spaarke leverages cutting-edge AI to…").
- Empty closes ("Now is the time to take your legal operations to
  the next level.").
- Hedging ("It's important to note that legal operations may benefit
  from operational intelligence.").
- Self-congratulation ("Our innovative platform sets a new standard…").

## Constraints

- Quote real passages verbatim. Don't paraphrase or invent.
- Get team sign-off before quoting non-public material (sales decks,
  internal Slack). For T08, default to extracting from public sources
  (existing blog articles, public LinkedIn posts referenced in T00).
- Annotations must be specific. "Good rhythm" doesn't help; "varies
  short and medium sentences in a 2-3 ratio with one short
  sentence as a punctuation mark" helps.
- File sizes: keep `good-articles.md` longest (most-referenced),
  `tone-samples.md` medium, `avoid-this.md` shortest. The asymmetry
  reflects how often each is consulted.

## Acceptance criteria

- All three files exist in `voice/examples/`.
- `good-articles.md`: 3–5 articles with extracts and annotations,
  ~2,000 words.
- `tone-samples.md`: 5–8 passages with annotations, ~800 words.
- `avoid-this.md`: 5–8 negative examples with contrasting "better"
  versions, ~600 words.
- All quotes are verbatim and attributed.
- Annotations are specific, not generic.

## Out of scope

- Writing new exemplary content. We extract from existing.
- Style rules in the abstract (T02 covers those).
- Customer-quote testimonials (different artifact type, Phase 1+).

## Prompt

> Phase 0, T08 of the Spaarke content platform.
>
> Read `content-platform/spec.md` §5.7,
> `tasks/00-inputs.md` §1 + §4, and the audit at
> `voice/library-audit.md` (Section 3 lists the source articles).
>
> Read the recommended source articles in full from `content/blog/`,
> then produce three annotated reference files:
> - `voice/examples/good-articles.md` (~2,000 words, 3–5 articles)
> - `voice/examples/tone-samples.md` (~800 words, 5–8 short passages)
> - `voice/examples/avoid-this.md` (~600 words, 5–8 negative examples
>   with contrasting "better" versions)
>
> Quotes verbatim. Annotations specific (not "good rhythm"; "alternates
> short and medium sentences with one short sentence used as
> emphasis"). Default to public sources only — don't quote internal
> material without team-supplied permission.
>
> Do not modify other files. First draft — team revises in T11.
