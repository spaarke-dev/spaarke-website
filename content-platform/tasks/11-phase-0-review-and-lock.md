# T11 — Phase 0 review and lock

**Phase**: 0
**Wave**: 6
**Owner**: Spaarke team (you), with Claude assisting on revisions
**Dependencies**: T01–T10 complete

## Goal

The team reads everything Phase 0 has produced, edits where needed,
and approves the voice constitution. Once locked, Phase 1 (workflow
operations) and Phase 2 (first batch of articles) can start. This
review step is the most important quality gate in the project — drafts
written from a half-baked constitution will reproduce the constitution's
flaws across every piece.

## Reads (review checklist)

The team reviews these files in order. Estimated time per file in
parens; total ~3-5 hours of focused review.

### Voice constitution (~2 hours total)

- `content-platform/voice/style-guide.md` (~30 min) — does
  this sound like Spaarke? Is the do/avoid list complete?
- `content-platform/voice/brand-positioning.md` (~20 min) —
  is the positioning statement *us*? Are the 3-5 themes the right
  three to five?
- `content-platform/voice/audience-personas.md` (~30 min) —
  do these personas match the people we're actually writing to? Are
  any missing?
- `content-platform/voice/product-knowledge.md` (~20 min) —
  factually correct? Anything to add or remove?
- `content-platform/voice/domain-knowledge.md` (~20 min) —
  POV-on-trends section: do we agree with these positions?
- `content-platform/voice/vocabulary.md` (~10 min) — quick
  scan of preferred + avoided columns.
- `content-platform/voice/examples/*.md` (~20 min) — are the
  good-articles selections the strongest? Are the avoid-this examples
  characteristic of failures we'd reject?

### Content-type specs (~30 min)

- `content-types/white-paper.md`, `blog-post.md`, `linkedin-post.md`,
  `tweet.md` — does each format-calibration match what's actually
  successful for us on each channel?

### Workflow tooling (~30 min)

- `CLAUDE.md` — clear and short enough to read every session?
- Brief templates — fields complete? Anything missing?
- `calendar.md` — initial topic list reasonable? Dates feasible?

### Library audit (~30 min)

- `voice/library-audit.md` — do you agree with the ✅/◐/⚠ ratings?
  Any flags to adjust?

## Process

### 1. Solo read-through

Each reviewer reads everything once before discussing. Write down
specific issues or sentences that bother you, but don't try to fix
in flight — separate the read from the edit.

### 2. Capture edits

Two ways to capture, your preference:

- **Inline edits** — open each file, mark up directly. Use HTML
  comments `<!-- TEAM: -->` for inline notes if helpful.
- **Issue list** — keep a flat list of issues in
  `tasks/11-review-notes.md` and address them in batch.

### 3. Claude assists on revisions

Once the team has a list of edits, Claude can apply them. Common
patterns:

- "Reword paragraph X in style-guide.md to be more direct."
- "Add a persona for [role] to audience-personas.md."
- "Pull this sentence out of brand-positioning.md — it doesn't sound
  like us."
- "Strengthen the 'avoid' rationale on these three vocabulary terms."

Each batch of edits goes through one round with Claude, then the
team re-reads the affected files. Two or three rounds are normal.

### 4. Lock

When the team is satisfied:
- Update each `voice/*.md`, `content-types/*.md`, and `CLAUDE.md`
  to add a one-line frontmatter or footer note: `Locked 2026-05-XX
  — see git log for history`.
- Tag the git commit: `git tag content-platform-phase-0-locked`.

After locking, voice constitution edits should go through a
deliberate change process (commit + brief explanation) — not
ad-hoc. The constitution can absolutely evolve, but every change
should be recorded.

## What "good enough to lock" looks like

Phase 0 is locked when:

- Reading each voice doc doesn't make you wince.
- The personas are people you can picture.
- The do/avoid lists feel complete (you can't add a strong entry
  off the top of your head).
- The vocabulary list reflects how you'd actually edit.
- The good-articles examples feel exemplary, not random.
- The CLAUDE.md is clear and short enough that you'd actually want
  Claude to read it every session.
- The calendar feels like a real plan, not a wishlist.

**It does NOT need to be**:
- Comprehensive. Add to it as we discover gaps.
- Perfect prose. The voice docs are reference, not finished
  articles.
- Everything you'd ever want to capture. Phase 0 captures the
  essentials; refinement happens in Phase 2 calibration.

## Deliverables

- Revisions applied to all Phase 0 files.
- A short post-lock note in `tasks/11-review-notes.md` summarizing
  major revisions made and decisions deferred.
- Git tag `content-platform-phase-0-locked` on the locked commit.

## Out of scope

- Drafting article content (Phase 2).
- Filling specific briefs (Phase 1+).
- Channel-adapter mechanics (Phase 3).

## Prompt (for revision rounds)

> Phase 0 review for the Spaarke content platform — assistance with
> revisions.
>
> The team has reviewed `content-platform/voice/*.md`,
> `content-types/*.md`, `CLAUDE.md`, and `briefs/_template-*.md`,
> and produced an edit list (either inline as HTML comments or as a
> flat list in `tasks/11-review-notes.md`).
>
> Apply the listed edits. Each edit:
> - Identify the file(s) affected.
> - Make the change preserving the rest of the file.
> - Note in your reply which edits you applied and any you deferred
>   (with reasons).
>
> Don't make edits the team didn't request. Don't rewrite paragraphs
> that weren't flagged.
>
> Run `npm run typecheck` is unnecessary here — content files have no
> code dependencies. Just verify Markdown is valid (no broken links to
> other voice docs).
>
> When done, summarize: which edits applied, which deferred, any
> internal inconsistencies you noticed (e.g., "this revision to
> style-guide §5 conflicts with vocabulary.md entry X — flagging").
