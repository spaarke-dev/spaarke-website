# Spaarke content platform — session start

You are starting a writing session for Spaarke. The project lives at
`projects/content-platform/`. Before producing any draft or outline,
read in this order.

## 1. Voice (always)

Load these three first. They are the constitution; they fit together
in context and they govern every piece.

- `voice/style-guide.md` — tone, sentence rhythm, formatting, the
  do-not-say list.
- `voice/brand-positioning.md` — what Spaarke stands for, the core
  narratives, the proof points.
- `voice/audience-personas.md` — who we are writing to. The brief's
  `audience` field names the primary persona.

## 2. Content type (always)

The brief specifies `type:` (one of `white-paper`, `blog-post`,
`linkedin-post`, `tweet`). Read the matching `content-types/<type>.md`.
This is where the format is calibrated — length, structure, voice
adjustment, CTA conventions, frontmatter shape.

## 3. The brief

Read `briefs/<slug>.md`, named by the user. The brief is short and
load-bearing. Note especially:

- `audience` — the persona to write *to*.
- `byline` — organizational ("spaarke") or named team member.
- Body sections: Topic, Angle, Why now, Must include, Must NOT include,
  References, Voice notes.

## 4. Selective references

Pull these in only when the brief or topic calls for them.

- `voice/product-knowledge.md` — when the piece touches Spaarke's
  architecture, modules, integration surfaces, or the AI layer.
- `voice/domain-knowledge.md` — when the piece touches industry
  trends, legal-ops stats, or terms of art.
- `voice/vocabulary.md` — consult when reaching for a word; check
  the "we don't say" column before locking phrasing.
- `voice/examples/good-articles.md` — read before writing the opening.
  Pattern-match to the strongest existing voice.
- `voice/examples/tone-samples.md` — when the brief asks for a
  register the blog hasn't shipped yet.
- `voice/examples/avoid-this.md` — final-pass checklist for AI-tells
  and marketing-speak. Always run before declaring a draft done.
- `voice/visual-identity.md` — read when generating a hero prompt.

## What you produce

The default workflow is five steps. Don't skip the outline.

1. **Outline first.** After reading inputs, produce a section
   structure — headings + the key claim and named evidence per
   section. Stop and wait for sign-off. The outline review catches
   structural problems that cost hours to fix in a draft.
2. **Draft.** After the outline is approved, write the full piece in
   `drafts/<type-folder>/<slug>.<ext>`.
3. **Revise.** Multiple rounds expected. The team edits; you
   incorporate. Keep the same file; don't proliferate versions.
4. **Polish.** Final pass — SEO meta description, alt text on images,
   frontmatter validation, internal cross-links, a sweep against
   `voice/examples/avoid-this.md`.
5. **Hero prompt.** After polish, draft a hero-graphic prompt per
   `voice/visual-identity.md` and write it into the draft's
   frontmatter or the brief's `# Hero graphic` section. Claude
   doesn't generate the image; the team does, then drops it at
   `public/articles/<slug>/hero.<ext>`.

## What you don't do

- Do not auto-publish. Final publish is human-driven through the site
  repo (blog posts) or the channel (LinkedIn, X, white papers).
- Do not fabricate stats, sources, or quotes. Mark unverified claims
  `**TBD — confirm**` and flag them in the response.
- Do not include items from `voice/examples/avoid-this.md` or break
  the do-not-say list in `voice/style-guide.md` §5.
- Do not invent new tag values for blog frontmatter. Tags must come
  from the canonical taxonomy.

## Output paths

- Outline: a comment in chat, or `drafts/<type>/<slug>.outline.md` if
  the user prefers a file.
- Draft, by type:
  - Blog post → `drafts/blog-posts/<slug>.mdx` (eventually publishes
    to `content/blog/<slug>.mdx`).
  - White paper → `drafts/white-papers/<slug>.mdx` (publishes to
    `content/papers/<slug>.mdx` once that route exists).
  - LinkedIn → `drafts/linkedin-posts/<slug>.md`.
  - Tweet → `drafts/tweets/<slug>.md`.
- Final: a human moves the piece to its publish target and updates
  `calendar.md`.
