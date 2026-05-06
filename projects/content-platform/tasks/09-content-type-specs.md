# T09 — Draft `content-types/*.md` (4 files)

**Phase**: 0
**Wave**: 4
**Dependencies**: T02 (style guide must have shape — content-type
specs defer to its decisions on voice and formatting)

## Goal

For each of the four content types — white paper, blog post, LinkedIn
post, tweet — produce a per-type specification doc that calibrates
voice, length, structure, and CTA conventions for that format. The
content-type doc is read at the start of any drafting session in
addition to the universal style guide.

## Reads (required context)

- `projects/content-platform/spec.md` §4 (content types) and §6 (brief
  format).
- `projects/content-platform/voice/style-guide.md` (T02 output) — for
  the universal voice baseline being calibrated.
- `projects/content-platform/voice/brand-positioning.md` and
  `audience-personas.md` if available (parallel-built; may be partial).

## Deliverables

Four files in `projects/content-platform/content-types/`:

### `content-types/white-paper.md`

Sections:
1. **Purpose** — what white papers do for Spaarke specifically (build
   authority over the long term, equip sales conversations with
   reference material, anchor a quarterly cadence).
2. **Length and structure** — target 2,500–5,000 words. Required
   sections: executive summary, context/setup, 3–5 numbered argument
   sections, conclusion, action steps.
3. **Voice calibration** — formal cadence, organizational byline (not
   first-person), evidence-led, citations required for numerical
   claims.
4. **Citation style** — footnotes or inline parenthetical sources;
   pick one consistent across white papers. Include sources we cite
   (per `voice/domain-knowledge.md` §5).
5. **Visual treatment** — diagrams welcome, callout boxes for key
   stats, no clip-art. Reference our existing diagram library.
6. **CTA convention** — low-pressure: "Talk to our team," "Read the
   companion blog post," "Download the supporting data."
7. **Brief frontmatter** — fields specific to white-paper briefs
   (e.g., `executive_summary_length`, `citation_count_minimum`,
   `companion_pieces`).
8. **Common pitfalls** — what white papers tend to do badly.
9. **Worked example** — a hypothetical brief sketch (not a full piece)
   showing how the brief feeds the structure.

Target length: 1,000 words.

### `content-types/blog-post.md`

Sections:
1. **Purpose** — the workhorse format. Most articles. SEO-relevant.
2. **Length and structure** — 1,000–1,800 words. Hook → 3–5 H2
   sections → tight close + CTA. ~1,400 words is the sweet spot.
3. **Voice calibration** — default voice from style guide.
   Organizational byline by default; first-person allowed when the
   brief specifies it (typically practitioner-experience pieces).
4. **Image treatment** — 1–2 supporting images (screenshots,
   diagrams, photos). Required if the topic is visual.
5. **CTA convention** — contextual. Range from soft ("Read about X")
   to direct ("Get access"). The brief specifies; default is
   contextual.
6. **Frontmatter** — required MDX frontmatter for site publication
   (`title`, `description`, `summary`, `author`, `date`, `tags`,
   `heroImage`). Reference `src/lib/blog.ts` for canonical shape.
7. **Cross-linking** — every blog post links to at least one related
   post and/or one site page (e.g., `/platform`, `/why-spaarke/<slug>`).
8. **Common pitfalls.**
9. **Worked example.**

Target length: 1,000 words.

### `content-types/linkedin-post.md`

Sections:
1. **Purpose** — distribution + brand-building + practitioner voice.
   Where bylined team members shine.
2. **Variants** — three:
   - **Standalone post** — 150–400 words, single thought.
   - **Carousel** — 5–10 slides; 1 idea per slide; cover slide hooks,
     last slide has CTA.
   - **Article syndication** — 200–250-word teaser linking to the
     full blog post.
3. **The hook** — line 1–2 must work on mobile preview (LinkedIn
   truncates around line 3). Specific, concrete, claim-or-question.
4. **Voice calibration** — usually first-person; tone looser than
   blog (shorter sentences, conversational); still authoritative.
5. **Formatting** — short paragraphs (1–3 sentences). One key idea
   per paragraph. No long blocks.
6. **CTA convention** — open question to drive comments, OR "Read
   the full piece →" for syndications. Don't end with hashtags;
   hashtags at the bottom (3 max).
7. **Hashtag strategy** — 2–3 relevant tags only. Examples:
   #LegalOps, #LegalTech, #InHouseCounsel.
8. **Frontmatter** — fields specific to LinkedIn briefs (`hook`,
   `format` (standalone/carousel/syndication), `byline`).
9. **Common pitfalls** — biggest one: writing LinkedIn posts in blog
   voice. They're a different format.
10. **Worked example.**

Target length: 1,000 words.

### `content-types/tweet.md`

Sections:
1. **Purpose** — punchier than LinkedIn. Higher density. Threads OK.
2. **Variants** — single tweet vs. thread (3–8 tweets typical).
3. **Construction rules**:
   - 280-char hard limit per tweet.
   - Threads: each tweet must work standalone *and* earn the next
     one. The first tweet sets the hook; the last tweet has the CTA.
   - Don't put links in early tweets of a thread — algorithm penalty.
4. **Voice calibration** — concise, idiomatic for X. Less formal than
   blog or LinkedIn. Strong opinions are OK (and rewarded).
5. **CTA convention** — link in last tweet, in bio, or none if the
   goal is engagement.
6. **Frontmatter** — `format` (single | thread), `length` (n tweets),
   `link_target` if applicable.
7. **Common pitfalls.**
8. **Worked example.**

Target length: 600 words (X is shorter; the spec doc reflects that).

## Constraints

- Each spec doc references `voice/style-guide.md` rather than
  duplicating content. The content-type spec calibrates and
  specializes; it doesn't restate.
- The "worked example" in each is hypothetical — not a real piece.
  Just enough to show how a brief feeds structure.
- Per-type spec must include the format-specific frontmatter fields
  the brief template uses. The brief template (T10) reads from these.

## Acceptance criteria

- All four files exist in `content-types/`.
- Each has all required sections.
- Each references `voice/style-guide.md` rather than duplicating.
- Each documents per-type frontmatter fields.
- Worked examples are concrete, not abstract.

## Out of scope

- Building brief templates (T10).
- Writing the universal style guide (T02).
- Per-channel distribution mechanics (Phase 2 / 3).

## Prompt

> Phase 0, T09 of the Spaarke content platform.
>
> Read `projects/content-platform/spec.md` §4 and §6, plus the (in
> progress or completed) Phase 0 voice docs — at minimum
> `voice/style-guide.md`. Skim `voice/brand-positioning.md` and
> `voice/audience-personas.md` if they're available; otherwise
> proceed.
>
> Produce four files in `content-types/`:
> - `white-paper.md` (~1,000 words)
> - `blog-post.md` (~1,000 words)
> - `linkedin-post.md` (~1,000 words)
> - `tweet.md` (~600 words)
>
> Each follows the section structure in `tasks/09-content-type-specs.md`
> (this file). Reference `voice/style-guide.md` for universal rules;
> don't duplicate. Document the format-specific brief frontmatter
> fields — T10 builds the brief templates from these.
>
> Do not modify other files. First draft — team revises in T11.
