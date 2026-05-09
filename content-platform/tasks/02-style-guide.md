# T02 — Draft `voice/style-guide.md`

**Phase**: 0
**Wave**: 3 (parallel with T03–T08)
**Dependencies**: T00, T01

## Goal

Produce the first draft of `voice/style-guide.md` — the document
covering tone, voice, sentence rhythm, formatting, and explicit do/avoid
rules. This is the most-frequently-referenced voice document; every
writing session reads it.

## Reads (required context)

- `content-platform/spec.md` §5.1 (style-guide scope).
- `content-platform/tasks/00-inputs.md` (team's bootstrap
  inputs) — especially §1, §3, §4.
- `content-platform/voice/library-audit.md` (T01 output) —
  Sections 2 and 3 are direct inputs to drafting.
- 3–5 of the strongest existing articles in `content/blog/` (the ones
  rated ✅ in T01 and listed in T01's "Recommended source material").
  Read at least the openings and closings.

## Deliverables

### `content-platform/voice/style-guide.md`

Markdown file, ~1,200 words. Sections:

#### 1. Voice — what we sound like

3–5 short tone descriptors with examples. Not abstract adjectives
("professional, engaging") — specific contrasts:

> **Authoritative, not breathless.**
> We say "Most matter-management deployments stall on data migration."
> We don't say "Matter management is being completely revolutionized
> right now."

> **Direct, not corporate.**
> We say "Spaarke runs inside your Microsoft tenant."
> We don't say "Spaarke is architected to leverage your existing
> Microsoft 365 investments."

Aim for 4–6 of these contrasts.

#### 2. Sentence rhythm

- Mix of short and medium sentences. Short for emphasis, medium for
  development. Avoid long compound sentences except occasionally for
  cadence.
- Active voice over passive in 80%+ of sentences.
- One-sentence paragraphs allowed sparingly, only for emphasis.

Show one before/after pair if useful.

#### 3. Paragraph structure

- 3–5 sentences per paragraph as the default.
- Paragraphs lead with the claim, then defend it. Don't bury.
- Transition phrases sparingly — strong sequencing makes them
  unnecessary.

#### 4. Formatting conventions

- **Headings**: sentence case ("How matter management actually works"),
  not title case. No periods.
- **Numbers**: numerals for ≥ 10 ("12 attorneys"); spelled out for
  < 10 ("three workstreams") except in lists or technical contexts.
- **Em-dashes**: yes — used for parenthetical asides and emphasis.
- **Semicolons**: sparingly; usually a period works.
- **Lists**: bullets for parallel concepts; numbered lists when order
  matters or steps are referenced.
- **Pull quotes**: optional in long form; never use as decoration.
- **Bold**: for genuinely scannable terms, not random emphasis. ≤ 3
  bolds per 1,000 words.
- **Italics**: for technical terms on first introduction; otherwise
  rare.

#### 5. Things we don't do

A list with reasons. Examples:

- **Exclamation points.** They read as breathless. Even in social
  posts, rare and only for genuine surprise.
- **Rhetorical questions in titles.** ("Is your matter management
  ready for AI?") Reads like a webinar invite.
- **"Imagine if…" openers.** Generic AI-tell.
- **"In today's world…" openers.** Empty calorie.
- **First-person plural CEO-letter voice.** Even when speaking for
  the company, frame in observations, not collective opinions.
- **"Powerful" / "robust" / "seamless" / "innovative."** Marketing
  filler — replace with something specific.
- **Exclaiming the obvious.** ("Legal operations matters more than
  ever.") Skip.

Pull from `voice/library-audit.md` Section 2 ("recurring weaknesses")
plus T00 §4 (do-not-claim list).

#### 6. Calibration by content type

A short note — voice scales differently across formats. Detail lives
in `content-types/<type>.md`, but the style guide gestures:

- **White papers**: more formal cadence, citations explicit.
- **Blog posts**: default voice, 1,000–1,800 words, mix of teaching
  and positioning.
- **LinkedIn posts**: looser, often first-person, shorter sentences,
  hook-first.
- **Tweets**: maximum density, idiomatic for X.

#### 7. Quick checklist (for the writer)

A 6–10 item bullet list at the end of the doc. Pre-publish
self-review:

- Every claim defended or sourced?
- No instances of [list of words from §5]?
- Opening makes a specific observation, not a generic claim?
- Each section heading reads as a concrete statement, not a question?
- Close advances the argument or invites action — not summarizing?
- Length within target band for the type?

## Constraints

- This is a *first draft*. Phase 0 closes with team review (T11)
  where the team revises. Don't try to write the final answer.
- Pull specifics from real articles when illustrating. Don't fabricate
  examples.
- Length cap: ~1,400 words. The style guide is read at the start of
  every session — keeping it short keeps it useful.
- Tone of the style guide itself should *be* on-brand. If the doc
  reads as corporate-speak, the doc is wrong.

## Acceptance criteria

- `voice/style-guide.md` exists, between 1,000 and 1,400 words.
- All seven sections present.
- §1 has at least 4 voice contrasts with concrete examples.
- §5 (things we don't do) has at least 8 entries with reasons.
- §7 (checklist) has 6–10 items.
- Examples drawn from real articles or quoted from team inputs, not
  fabricated.

## Out of scope

- Defining brand positioning (T03's job).
- Defining audience personas (T04's job).
- Writing per-content-type specs (T09's job — though §6 of style guide
  gestures at calibration, full detail lives in content-types/*).
- Building a vocabulary list (T07's job).

## Prompt

> You are working on Phase 0 of the Spaarke content platform at
> `c:\code_files\spaarke-website\projects\content-platform\`. T00 and
> T01 are complete.
>
> Read `content-platform/spec.md` §5.1, the team's inputs in
> `tasks/00-inputs.md` (especially §1, §3, §4), and the audit at
> `voice/library-audit.md`. Then read at least 3 of the strongest
> existing articles in `content/blog/` (those rated ✅ in the audit).
>
> Produce `content-platform/voice/style-guide.md`, 1,000–1,400
> words, covering the seven sections specified in
> `tasks/02-style-guide.md` (this file). Pull illustrating examples
> from the actual articles you read — do not fabricate.
>
> The doc itself should sound like Spaarke. If it reads corporate, it
> is wrong.
>
> Do not modify any other files. This is a first draft — Phase 0 closes
> with team review and revision.
