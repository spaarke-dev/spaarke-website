# Spaarke content platform: session start

You are starting a content session for Spaarke. The platform lives at
`content-platform/`. Per-piece work happens in
`content-platform/articles/<slug>/`, which is the equivalent of a
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

Load these first. They are the constitution; they fit together in
context and govern every piece.

- `voice/style-guide.md`: the register, sentences, paragraphs,
  formatting, and the list of things we do not do. Where any other
  voice document, template, or published article conflicts with it,
  the style guide governs.
- `voice/stance.md`: the posture. It says where the writer stands
  toward the evidence, the causes, the reader, and the other parties.
  On sentence mechanics the style guide governs; on posture this file
  governs.
- `voice/examples/consulting-register.md`: the external register we
  are measured against. Sections 1 to 3 record the research
  provenance, the evidence limits, and the fact-check labels; they
  are reference material for whoever maintains the file, and the
  drafting load is sections 4 and 6.
- `voice/examples/ai-tells.md`: the removal guide. It lists the
  constructions that readers identify as machine-written, with a
  before and an after for each, and it ends with the pre-review
  checklist.
- `voice/examples/house-exemplar.md`: the house positive model. It
  names the one published article the writer has approved as house
  voice and annotates the eight traits that carry it. The rules are
  stated as removals, and a draft can satisfy every one of them and
  still have no speaker in it; read the exemplar to know what to
  reproduce.
- `voice/brand-positioning.md`: what Spaarke stands for, the core
  narratives, the proof points.
- `voice/audience-personas.md`: who we are writing to.
- `voice/vocabulary.md`: the words we use and the words we do not.
  Check the "we don't say" column before locking phrasing.
- `voice/domain-knowledge.md`, section 3: the field's terms of art.

The last two sit here rather than in section 4 because the decisions
they govern, what a thing is called and which term of art applies,
are made before the first sentence rather than at the sentence. The
offset that keeps the total load roughly neutral is
`consulting-register.md`: sections 1 to 3 are no longer read at
drafting.

### 2. Content type (when relevant)

If the work is type-specific (per-type calibration), read the
matching `content-types/<type>.md`. For `blog-post`, the type file
covers both long-form articles (the primary format for thought
leadership, with no length cap) and short posts.

### 3. The piece (when working on one)

For a specific piece:

- `articles/<slug>/brief.md`: the spec
- `articles/<slug>/plan.md`: the structural outline (do not
  draft until signed off)
- `articles/<slug>/tasks.md`: the workflow gates
- `articles/<slug>/CLAUDE.md`: the per-piece session contract

### 4. Selective references (load on demand)

Pull these only when the piece or task calls for them:

- `voice/product-knowledge.md`, when the work touches Spaarke's
  architecture, modules, integration surfaces, or the AI layer.
- `voice/domain-knowledge.md`, sections 1, 2 and 4 to 7, when
  touching industry trends, legal-ops stats, or the field's
  sensitivities. Section 3 is in the always-load list above.
- `voice/taxonomy.md`, for canonical tag values. Never invent tags.
- `voice/bylines.md`, for the byline convention, the `author:`
  value, and the closing contact line.
- `voice/examples/good-articles.md`, for subject matter only. Before
  writing an opening, match it against the model passages in
  `voice/examples/consulting-register.md`, section 6, first.
  `good-articles.md` was re-edited in September 2026 and is now a
  secondary reference. Do not pattern-match against the articles
  published before that date, because they use constructions that
  the style guide now prohibits.
- `voice/examples/avoid-this.md`, as a final-pass checklist for
  marketing language. Where one of its "Better" examples conflicts
  with the style guide, the style guide governs.
- `voice/visual-identity.md`, when generating a hero.
- `campaigns/<slug>.md`, when working on a piece inside a campaign.

## What you produce

Per-piece work proceeds through the following gates, and none of
them is skipped. The per-piece `articles/<slug>/tasks.md` carries
the full done-when checklist for each gate.

1. **Outline**: fill `articles/<slug>/plan.md`. Get human sign-off
   before drafting.
2. **Draft**: write to `articles/<slug>/draft.{mdx|md}`.
3. **Revise**: apply reviewer feedback in the same file.
4. **Polish**: frontmatter, alt text, and cross-links; then the voice
   lint (see the next section); then the sweeps against
   `voice/examples/ai-tells.md`, the style guide (section 5), and
   `voice/examples/avoid-this.md`; then the stance lens, which reads
   the draft against `voice/stance.md` and the eight traits in
   `voice/examples/house-exemplar.md` section 2. Review runs on four
   lenses: voice, fidelity, evidence, and stance. The stance lens
   exists because the judgement calls it catches, who holds which
   authority and whether the piece takes a position, fall outside the
   other three and outside the lint.
5. **Hero**: SVG by default; photographic prompt for atmospheric
   pieces (rare).
6. **Ship**: move to `content/blog/` (or `published/`), update
   `calendar.md`, GitHub Project status to Published, close Issue.

## The voice lint

`npm run voice:lint -- <file>` (which runs `scripts/voice-lint.mjs`
from the repository root) checks a draft against the style guide. It
reports em dashes and dash substitutes as errors, and it reports the
words and constructions listed in `voice/examples/ai-tells.md` as
warnings. It covers the frontmatter as well as the body. A draft is
not done until the lint reports 0 errors and every warning has been
read and either fixed or accepted for a stated reason. Run it on
voice documents and templates as well when you edit them. Each bullet
in a list should end with punctuation, because the lint reads a
bullet that ends in a letter and is followed by another bullet as a
spaced hyphen.

## What you don't do

- Do not auto-publish. Final publish is human-driven.
- Do not fabricate stats, sources, or quotes. Mark unverified claims
  `**TBD — confirm**` and flag them.
- Do not use an em dash anywhere: the body, the title, the headings,
  captions, alt text, link text, or the `description`, `summary`,
  and `keyTakeaways` fields. A spaced en dash, a double hyphen, and
  a spaced hyphen are not substitutes, and ranges are written with
  "to". The workflow marker in the previous bullet is the single
  permitted exception, and it is written exactly that way so that
  tools can find it.
- Do not write the constructions that readers identify as
  AI-written (style guide, section 5, rules 14 to 27, with worked
  examples in `voice/examples/ai-tells.md`): negation followed by
  correction (`It is not X. It is Y.` and `not just X but Y`),
  `X, not Y` taglines, verbless fragments, one-sentence paragraphs
  used for effect, clipped aphoristic closers, a rhetorical question
  followed by its own answer, colon reveals, signposting, lists of
  three used for rhythm, present-participle tails, inflated
  abstractions, summary closers, and AI-era vocabulary.
- Do not include items from `voice/examples/avoid-this.md` or break
  the list of things we do not do in `voice/style-guide.md` §5.
- Do not hold a long-form article to a word count. When the brief
  sets `length_target: open` there is no cap, and the range of 1,000
  to 1,800 words applies to short posts only.
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
- Final blog post or long-form article: `content/blog/<YYYY-MM-DD>-<slug>.mdx`
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

*Revised 2026-09-21 (consulting register, no em dashes, voice lint), see git log for history.*
