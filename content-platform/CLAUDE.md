# Spaarke content platform — session start

You are starting a content session for Spaarke. The platform lives at
`content-platform/`. Per-piece work happens in
`content-platform/articles/<slug>/` — that's the equivalent of a
software project workspace.

## What kind of session is this?

| If… | Then |
|---|---|
| The writer has dropped raw notes in `articles/<slug>/idea.md` | Run the `idea-to-brief` skill: `/idea-to-brief <slug>`. It produces `brief.md`. |
| A signed-off `brief.md` exists in `articles/<slug>/` | Run the `content-pipeline` skill: `/content-pipeline <slug>`. It produces plan, tasks, per-piece CLAUDE.md, GitHub Issue. |
| You're inside `articles/<slug>/` ready to write | Read the per-piece `articles/<slug>/CLAUDE.md`. It's the session contract for that piece. |
| You're editing voice docs, campaign files, calendar | Read the matching file directly; no skill needed. |

If a skill exists for the work, use it. The skills enforce the
voice constitution and gate the workflow. Free-form writing
without going through `idea-to-brief` and `content-pipeline`
defeats the purpose of the platform.

## Reading order for a writing session

When working on a specific piece, the per-piece
`articles/<slug>/CLAUDE.md` is authoritative. The order below is
for sessions where you're working *across* pieces (editing voice
docs, designing a campaign, refining the calendar).

### 1. Voice (always)

Load these three first. They are the constitution; they fit
together in context and govern every piece.

- `voice/style-guide.md` — tone, sentence rhythm, formatting, the
  do-not-say list.
- `voice/brand-positioning.md` — what Spaarke stands for, the core
  narratives, the proof points.
- `voice/audience-personas.md` — who we are writing to.

### 2. Content type (when relevant)

If the work is type-specific (per-type calibration), read the
matching `content-types/<type>.md`.

### 3. The piece (when working on one)

For a specific piece:

- `articles/<slug>/brief.md` — the spec
- `articles/<slug>/plan.md` — the structural outline (do not
  draft until signed off)
- `articles/<slug>/tasks.md` — the workflow gates
- `articles/<slug>/CLAUDE.md` — the per-piece session contract

### 4. Selective references (load on demand)

Pull only when the piece or task calls for them.

- `voice/product-knowledge.md` — when the work touches Spaarke's
  architecture, modules, integration surfaces, or the AI layer.
- `voice/domain-knowledge.md` — when touching industry trends,
  legal-ops stats, or terms of art.
- `voice/vocabulary.md` — consult when reaching for a word; check
  the "we don't say" column before locking phrasing.
- `voice/taxonomy.md` — canonical tag values. Never invent tags.
- `voice/examples/good-articles.md` — pattern-match before writing
  an opening.
- `voice/examples/avoid-this.md` — final-pass checklist. **Always
  run before declaring a draft done.**
- `voice/visual-identity.md` — when generating a hero.
- `campaigns/<slug>.md` — when working on a piece inside a campaign.

## What you produce

Per-piece work proceeds through five gates. Don't skip any.

1. **Outline** — fill `articles/<slug>/plan.md`. Get human sign-off
   before drafting.
2. **Draft** — write to `articles/<slug>/draft.{mdx|md}`.
3. **Revise** — apply reviewer feedback in the same file.
4. **Polish** — frontmatter, alt text, cross-links, sweep against
   `voice/examples/avoid-this.md`.
5. **Hero** — SVG by default; photographic prompt for atmospheric
   pieces (rare).
6. **Ship** — move to `content/blog/` (or `published/`), update
   `calendar.md`, GitHub Project status to Published, close Issue.

The per-piece `articles/<slug>/tasks.md` carries the full done-when
checklist for each gate.

## What you don't do

- Do not auto-publish. Final publish is human-driven.
- Do not fabricate stats, sources, or quotes. Mark unverified claims
  `**TBD — confirm**` and flag them.
- Do not include items from `voice/examples/avoid-this.md` or break
  the do-not-say list in `voice/style-guide.md` §5.
- Do not invent new tag values. Tags must come from
  `voice/taxonomy.md`. Adding a new tag is a separate, gated
  decision.
- Do not skip the outline gate. Do not draft before plan.md is
  approved.
- Do not write a brief from scratch when `idea-to-brief` is the
  codified path.

## Output paths

- Per-piece workspace: `articles/<slug>/{idea, brief, plan,
  tasks, CLAUDE, draft}.md` (or `.mdx` for blog/whitepaper drafts)
- Final blog post: `content/blog/<YYYY-MM-DD>-<slug>.mdx`
- Final LinkedIn post: `published/linkedin-posts/<slug>.md`
- Final tweet: `published/tweets/<slug>.md`
- Final white paper: `content/papers/<slug>.mdx` *(once route exists,
  Phase 3)* + `public/papers/<slug>.pdf`

## GitHub Project tracking

The pipeline status (Idea → Brief → Outline → Draft → Review →
Scheduled → Published) is tracked in the GitHub Project, not in
markdown. See `github-setup.md` for the field IDs and update
commands. Update the Project as the piece moves through gates;
update the calendar opportunistically (calendar is a snapshot, the
Project is live).

---

*Locked 2026-05-09 — see git log for history.*
