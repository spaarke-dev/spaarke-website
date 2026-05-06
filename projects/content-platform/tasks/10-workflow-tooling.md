# T10 — CLAUDE.md routing + brief templates + calendar

**Phase**: 0
**Wave**: 5
**Dependencies**: T02–T09 complete (or near-complete — this task pulls
from all of them)

## Goal

Stand up the workflow scaffolding: a session-orientation file
(`CLAUDE.md`), four brief templates (one per content type), and a
calendar file initialized with the team's bootstrap topic stubs from
T00 §5. After this task, a writer can fill a brief and trigger a
drafting session immediately.

## Reads (required context)

- `projects/content-platform/spec.md` §3.2 (reading-priority ladder),
  §6 (brief format), §8 (calendar).
- All of `voice/*.md` (T02–T08 outputs).
- All of `content-types/*.md` (T09 output) — for type-specific brief
  fields.
- `tasks/00-inputs.md` §5 — for calendar bootstrap topics.
- `tasks/00-inputs.md` §6 — for byline list.

## Deliverables

### 1. `projects/content-platform/CLAUDE.md`

The session-orientation doc. Read at the very start of any drafting
session. Tells me what to read, in what order, and what to produce.

```markdown
# Spaarke content platform — session start

You are starting a writing session for Spaarke. The project lives at
`projects/content-platform/`. Before producing any draft or outline,
read in this order:

## 1. Voice (always)

- `voice/style-guide.md`
- `voice/brand-positioning.md`
- `voice/audience-personas.md`

These three are short and load every session. They're the constitution.

## 2. Content type (always)

The brief specifies `type: <one of: white-paper, blog-post,
linkedin-post, tweet>`. Read the matching `content-types/<type>.md`.

## 3. The brief

Read `briefs/<slug>.md` (specified by the user). Note its `audience`
field — that's the persona to write *to*.

## 4. Selective references

Pull in as needed based on the topic:
- `voice/product-knowledge.md` — when the brief touches product
  features, architecture, the AI layer.
- `voice/domain-knowledge.md` — when the brief touches industry
  trends, stats, terminology.
- `voice/vocabulary.md` — always, but consult selectively when
  reaching for a word.
- `voice/examples/good-articles.md` — when starting a draft, before
  writing the opening.
- `voice/examples/avoid-this.md` — final pass, to check for AI-tells
  and marketing-speak.

## What you produce

Default workflow per spec.md §7.1:

1. **Outline first**. After reading inputs, produce a section
   structure (headings + key claims + sources cited per section)
   and stop. The user reviews. Don't write prose without sign-off
   on the outline.
2. **Draft**. After outline approval, write the full piece in
   `drafts/<type-folder>/<slug>.<ext>`.
3. **Revise**. Multiple rounds expected. The team edits; you
   incorporate.
4. **Polish**. SEO meta, alt text, frontmatter, cross-links — final
   pass before publish-ready.

## What you don't do

- Don't auto-publish. Final publish is human-driven.
- Don't fabricate stats or sources. Mark unverified claims
  `**TBD — confirm**`.
- Don't include items from `voice/examples/avoid-this.md`. Final pass
  must check.
- Don't break the do-not-claim list in `voice/style-guide.md` §5.

## Output paths

- Outline: comment in chat, or `drafts/<type>/<slug>.outline.md` if
  the user prefers.
- Draft: `drafts/<type>/<slug>.<ext>`.
  - Blog posts: `drafts/blog-posts/<slug>.mdx` (publishes eventually
    to `content/blog/<slug>.mdx`).
  - White papers: `drafts/white-papers/<slug>.mdx` (publishes to
    `content/papers/<slug>.mdx` once that route exists; for now
    stays in drafts/).
  - LinkedIn: `drafts/linkedin-posts/<slug>.md`.
  - Tweets: `drafts/tweets/<slug>.md`.
- Final: human moves to publish target and updates `calendar.md`.
```

### 2. Brief templates

Four files in `projects/content-platform/briefs/`:

- `_template-white-paper.md`
- `_template-blog-post.md`
- `_template-linkedin-post.md`
- `_template-tweet.md`

Each is a Markdown file with YAML frontmatter shape from spec §6 plus
the type-specific fields documented in `content-types/<type>.md` §7
or §8 (the frontmatter section).

Example skeleton for `_template-blog-post.md`:

```markdown
---
slug: <kebab-case-slug>
type: blog-post
publish_date: YYYY-MM-DD
channels: [website, linkedin]
status: brief
priority: normal             # high | normal | low
audience: <persona-slug-from-audience-personas.md>
length_target: 1400          # words
byline: spaarke              # spaarke | <team-member-name>
---

# Topic
<What this article is about. 1-2 sentences.>

# Angle / Point of view
<The frame. Not just the topic but how we approach it. 2-4 sentences.>

# Why now
<Why this article makes sense to publish in this window.>

# Must include
- <bullet>
- <bullet>

# Must NOT include
- <bullet>

# References
- <internal article to link>
- <source to cite>

# Voice notes
<Any deviations from default style guide. Often empty.>
```

Per-type variations:
- White paper template adds: `executive_summary_length`,
  `citation_count_minimum`, `companion_pieces`.
- LinkedIn template adds: `hook`, `format` (standalone/carousel/
  syndication).
- Tweet template adds: `format` (single/thread), `tweet_count`,
  `link_target`.

### 3. `projects/content-platform/calendar.md`

Initial calendar populated from `tasks/00-inputs.md` §5 (the team's
bootstrap topic stubs). Format per spec §8:

```markdown
# Content calendar

Single source of truth for what's planned, drafted, scheduled, and
live. Edit this file when a piece changes state.

## 2026-05

| Slug | Type | Publish | Status | Author | Notes |
|---|---|---|---|---|---|
| <from T00 §5> | <type> | <date> | brief | <byline> | |

## 2026-06

| ... | ... | ... | ... | ... |

## 2026-Q3

| ... | ... | ... | ... | ... |

---

## States

- **brief** — topic identified, brief being written
- **outline** — outline drafted, awaiting approval
- **draft** — draft in progress in `drafts/`
- **review** — draft submitted, edits in progress
- **scheduled** — final, awaiting publish_date
- **published** — live on the channel

## Update protocol

When a piece changes state, edit the row. Use `git commit` with the
commit message format `content: <slug> -> <new state>` so the calendar
has a clear audit trail.
```

Populate the table rows from T00 §5. Group rows by month based on
publish_date.

### 4. Per-type drafts/ subdirectories with `.gitkeep`

Create empty directories so the structure is checked into git:

```
drafts/white-papers/.gitkeep
drafts/blog-posts/.gitkeep
drafts/linkedin-posts/.gitkeep
drafts/tweets/.gitkeep
published/linkedin-posts/.gitkeep
published/tweets/.gitkeep
published/white-papers/.gitkeep
```

(Blog posts don't have a `published/` subdirectory because they
publish into `/content/blog/`.)

## Constraints

- `CLAUDE.md` is the most-read file in the platform. It must be
  short and clear. Target ≤ 600 words.
- Brief templates are templates, not pre-filled examples. Use angle
  brackets `<like this>` to mark fields to fill in.
- Calendar table rows for T00 §5 topics are starting positions — the
  team will refine dates and add detail as briefs get written.

## Acceptance criteria

- `CLAUDE.md` exists, ≤ 600 words.
- Four brief templates exist in `briefs/`.
- `calendar.md` exists with rows for every topic stub in T00 §5.
- All seven `.gitkeep` files exist (or directories are otherwise
  preserved).

## Out of scope

- Phase 1 byline doc (`voice/bylines.md`) — separate task. Add a
  TODO note to T11.
- Filling in actual briefs (Phase 2 task).
- Drafting any article content.

## Prompt

> Phase 0, T10 of the Spaarke content platform.
>
> Read `projects/content-platform/spec.md` §3.2, §6, §8; all of
> `voice/*.md` (T02-T08 outputs); all of `content-types/*.md` (T09
> output); and `tasks/00-inputs.md` §5 + §6.
>
> Produce four artifacts:
> 1. `projects/content-platform/CLAUDE.md` (≤ 600 words) — session
>    routing per the spec in `tasks/10-workflow-tooling.md` (this
>    file).
> 2. Four brief templates in `briefs/_template-<type>.md` — one per
>    content type, with type-specific frontmatter fields per the
>    content-type docs.
> 3. `projects/content-platform/calendar.md` populated from T00 §5.
> 4. `.gitkeep` files in the seven empty directories listed.
>
> Do not draft any article content. Do not modify other files outside
> `projects/content-platform/`.
