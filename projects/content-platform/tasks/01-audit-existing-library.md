# T01 — Audit existing library + voice tagging

**Phase**: 0
**Wave**: 2
**Dependencies**: T00 (inputs filled in)

## Goal

Read every existing article in `content/blog/`, tag each one for voice
quality and audience fit, and produce a one-file audit report at
`projects/content-platform/voice/library-audit.md`. The report drives
two downstream activities: (1) identifying which existing articles
become source material for `voice/examples/good-articles.md`, and (2)
flagging the few articles that may want light refresh under the new
voice.

The team has noted the existing library is "directionally aligned" —
expect most pieces to land at ✅ or ◐, few at ⚠.

## Reads (required context)

- `projects/content-platform/spec.md` §5 (voice constitution),
  §9 (library audit).
- `projects/content-platform/tasks/00-inputs.md` — the team's filled-in
  inputs, especially §1 ("yes, this is us" reference pieces) and §4
  (do-not-claim list).
- All `.mdx` files in `content/blog/`.
- `src/lib/blog.ts` — to understand frontmatter shape.

## Deliverables

### `projects/content-platform/voice/library-audit.md`

Single Markdown file with three sections:

#### Section 1 — One-row-per-article table

```markdown
## Article inventory

| Slug | Date | Title | Persona fit | Voice rating | Notes |
|---|---|---|---|---|---|
| <slug> | YYYY-MM-DD | <title> | <persona-id or "general"> | ✅ / ◐ / ⚠ | <≤ 15 words> |
```

Voice rating guidance:
- ✅ **Strong** — exemplary; opens well, has a clear point of view,
  defends claims, ends purposefully. Voice matches the team's
  "yes, this is us" inputs from T00 §1.
- ◐ **Decent** — directionally right, no major issues. May have minor
  drift (one section slightly off-tone, weaker close, etc.).
- ⚠ **Off** — meaningful drift from target voice. Could be too sales-y,
  too AI-generic, too internal-jargon-heavy, etc.

#### Section 2 — Patterns observed

Based on what you read, summarize:
- Recurring strengths across the strong (✅) articles. What do they
  consistently do? (e.g., "open with a specific observation, not a
  generic claim"; "defend each numeric claim with a source"; "close
  with a question, not a CTA").
- Recurring weaknesses across the off (⚠) articles. (e.g., "lean on
  abstract framings instead of concrete examples"; "use 'leverage'").
- Voice elements present in the strong work that should be captured
  in `voice/style-guide.md`.

This section is the bridge to T02 (style-guide drafting). Be
specific — generic observations like "good tone" don't help downstream
tasks.

#### Section 3 — Recommended source material for examples

Pull 3–5 articles to mine for `voice/examples/good-articles.md`:

```markdown
## Recommended source material

### Article: <slug>
- **Why included**: <1-2 sentences on what makes this exemplary>
- **Suggested extracts**:
  - Opening (paragraphs 1-2) — illustrates [voice trait]
  - Section heading "X" + first paragraph — illustrates [voice trait]
  - Closing — illustrates [voice trait]
```

These are pointers, not rewrites. T08 (Curate `voice/examples/`) does
the actual extraction and annotation.

## Constraints

- Do **not** modify any existing `.mdx` files. This is a read-and-tag
  pass.
- Do **not** invent quality ratings. If an article is ambiguous, mark
  it ◐ with a note explaining the ambiguity rather than forcing ✅ or ⚠.
- Use the team's "yes, this is us" inputs (T00 §1) as the calibration
  reference. Articles that resemble those inputs in tone should rate
  ✅ even if you have personal stylistic preferences against them.

## Acceptance criteria

- `projects/content-platform/voice/library-audit.md` exists with all
  three sections populated.
- Every `.mdx` file in `content/blog/` appears in the inventory table.
- Patterns section names at least 5 specific recurring strengths and
  3 specific recurring weaknesses.
- Recommended source material section has 3–5 articles with concrete
  extract pointers.
- File length target: 1,500–2,500 words. Long enough to be useful;
  short enough to read.

## Out of scope

- Drafting any `voice/*.md` files. T02–T07 do that.
- Extracting and annotating actual passages. T08 does that.
- Modifying existing articles. Refresh of ⚠ articles is a Phase 1+
  task.
- Taxonomy audit (frontmatter tag review). Separate Phase 1 task.

## Prompt

> You are starting Phase 0 of the Spaarke content platform project at
> `c:\code_files\spaarke-website\projects\content-platform\`.
>
> Read `projects/content-platform/spec.md` §5 and §9, then
> `projects/content-platform/tasks/00-inputs.md` (the team's
> bootstrap inputs), then this task file. Then read every `.mdx` file
> in `content/blog/`.
>
> Produce `projects/content-platform/voice/library-audit.md` with the
> three sections specified: article inventory table (one row per
> article, with voice rating ✅/◐/⚠), observed patterns (≥ 5 strengths
> and ≥ 3 weaknesses with specifics), and recommended source material
> (3–5 articles with extract pointers).
>
> Use the team's "yes, this is us" inputs from T00 §1 as your voice
> calibration reference. Don't invent ratings — when ambiguous, mark
> ◐ with explanation.
>
> Do not modify any existing files. Do not draft any other voice docs
> in this task.
