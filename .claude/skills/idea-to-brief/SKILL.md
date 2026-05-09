# idea-to-brief

---
description: Transform a writer's raw idea.md into a canonical, voice-aware, taxonomy-aware brief.md
tags: [content, brief, writing, planning, transformation]
techStack: [content-platform, markdown, mdx]
appliesTo: ["content-platform/articles/*/idea.md", "create brief", "idea to brief"]
alwaysApply: false
---

## Purpose

**Tier 1 Skill** — The content equivalent of `design-to-spec`.
Transforms a writer's free-form idea (raw notes, links, half-thoughts)
into a canonical `brief.md` — the formal specification for a single
piece of content. The brief is what `content-pipeline` consumes to
produce the per-piece workspace (plan, tasks, per-piece CLAUDE.md,
GitHub Issue).

**Key Features**:
- Reads the Spaarke voice constitution before producing a brief, so
  the brief is voice-aware from creation
- Picks the right per-type brief template (blog-post, linkedin-post,
  white-paper, tweet) based on the intended type
- Asks targeted clarifying questions for gaps
- Validates tags against the canonical taxonomy in
  `content-platform/voice/taxonomy.md` — refuses to invent new tag
  values
- Proposes a campaign assignment based on the active campaigns in
  `content-platform/campaigns/`
- Flags unverified stats and quotes as `**TBD — confirm**`

---

## When to Use

- User says "create a brief", "idea to brief", or "/idea-to-brief"
- Explicitly invoked with `/idea-to-brief <slug>`
- An `idea.md` file exists at `content-platform/articles/<slug>/idea.md`
- Before running `content-pipeline` (this skill feeds into that)

## Input/Output

**Input** (one of):
- `content-platform/articles/<slug>/idea.md` — raw idea file
- User-provided text/notes via conversation (the skill creates the
  idea.md from the conversation, then proceeds)

**Output**:
- `content-platform/articles/<slug>/brief.md` — canonical brief
  built from the matching `_template-<type>/brief.md` template

## Workflow Position

```
Writer's raw idea
    |
    v
content-platform/articles/<slug>/idea.md
    |
    v
+-----------------+
|  idea-to-brief  |  <-- THIS SKILL
+-----------------+
    |
    v
content-platform/articles/<slug>/brief.md (canonical)
    |
    v
+-------------------+
|  content-pipeline |  <-- NEXT SKILL
+-------------------+
    |
    v
plan.md, tasks.md, per-piece CLAUDE.md, GitHub Issue
```

---

## Steps

### Step 1: Load the voice constitution (non-negotiable)

Before reading the idea or producing anything, load these in this
order. Do not skip — the brief is voice-aware from creation, not
"voiced up later."

```
READ in this order:
  1. content-platform/voice/style-guide.md
  2. content-platform/voice/brand-positioning.md
  3. content-platform/voice/audience-personas.md
  4. content-platform/voice/taxonomy.md   (canonical tag values)
  5. content-platform/voice/vocabulary.md (do/don't language)
```

If any of these don't exist, halt and tell the user — the
constitution is the prerequisite.

---

### Step 2: Locate or capture the idea

```
SEARCH for idea at:
  content-platform/articles/<slug>/idea.md

IF the user provided <slug> and the file exists:
  -> READ the idea.md content
  -> Report: "Found idea.md at articles/<slug>/ ({word-count} words)"

IF the user provided <slug> but no idea.md exists:
  -> ASK: "No idea.md at content-platform/articles/<slug>/. Want to
          drop your idea here in chat? I'll save it to that path
          before producing the brief."
  -> CREATE the directory if missing
  -> SAVE user's pasted text to idea.md verbatim (no editing)

IF the user did not provide <slug>:
  -> ASK: "What's the slug for this piece? (kebab-case, becomes the
          articles/<slug>/ folder name)"
```

---

### Step 3: Determine intended content type

The brief template differs by type. Pick one before proceeding.

```
INFER from the idea content:
  - Long argument with sections, sources, ~1,400 words           -> blog-post
  - Short hook + body + close, ~150-400 words                    -> linkedin-post
  - Long evidence-led document with citations, 2,500-5,000 words -> white-paper
  - Single thought or thread idea, ≤280 chars per beat           -> tweet

IF ambiguous:
  -> ASK: "Is this a blog post, LinkedIn post, white paper, or
          tweet/thread?"
```

Also read the matching `content-platform/content-types/<type>.md`
for type-specific calibration (length, structure, CTA conventions).

---

### Step 4: Extract core elements from the idea

```
EXTRACT (best-effort) from idea.md:

1. TOPIC — what is this about, in one sentence?
2. ANGLE — what's the specific argument the reader should walk
   away believing? (Not the topic — the take.)
3. WHY NOW — market trigger, calendar moment, gap in library
4. AUDIENCE — primary persona (one of the personas in
   audience-personas.md)
5. MUST INCLUDE — sub-claims, named evidence, scenarios, sources
6. MUST NOT INCLUDE — adjacent topics for separate pieces, items
   from voice/examples/avoid-this.md, marketing-speak closes
7. REFERENCES — internal articles to link, external sources to cite
8. PROPOSED LENGTH — fit to type (blog ~1,400, LI 150-400, WP
   2,500-5,000, tweet ≤280/beat)

FLAG missing elements for Step 5 clarification.
```

---

### Step 5: Gap-targeted clarification interview

Ask **specific** questions derived from this idea's gaps. Not a
generic checklist. Each question should reference the exact text
or concept that's unclear.

```
GAP TYPES -> QUESTION PATTERNS:

1. UNDEFINED ARGUMENT
   Gap: idea names a topic but not the take
   Question: "The idea is about <topic>. What's the specific argument?
             What should the reader walk away believing — and what
             would Spaarke push back on?"

2. AUDIENCE AMBIGUOUS
   Gap: could be aimed at corporate-counsel, legal-ops, or IT
   Question: "Primary persona — who's this written *to*? Options:
             corporate-counsel, legal-operations, corporate-it,
             law-firm-leadership."

3. UNVERIFIED CLAIMS
   Gap: idea cites a stat or quote without source
   Question: "You mention '<claim>' — do you have a source? If not,
             I'll mark it **TBD — confirm** in the brief."

4. MISSING CROSS-LINKS
   Gap: idea touches an existing Spaarke piece but doesn't name it
   Question: "This connects to <piece slug>. Should the brief
             require the draft to link to it?"

5. CAMPAIGN AMBIGUOUS
   Gap: piece could fit multiple active campaigns
   Question: "This fits <campaign A> (theme: ...) or <campaign B>
             (theme: ...). Which campaign should it sit inside? Or
             standalone?"

6. UNCLEAR HERO DIRECTION
   Gap: idea doesn't suggest a visual concept
   Question: "Hero direction — should this be the standard SVG
             treatment (geometric/abstract per visual-identity.md)
             or something else?"

PRESENT questions grouped by impact:

BLOCKING (must answer before brief):
  - Argument / take
  - Primary audience
  - Campaign assignment

IMPORTANT (defaults applied if skipped):
  - Hero direction (default: SVG per visual-identity.md)
  - Cross-links (default: none required)
  - Specific source URLs (default: marked TBD)
```

**Wait for user**: blocking answers required; important can be skipped
with stated defaults.

---

### Step 6: Validate tags against canonical taxonomy

Before generating the brief, check that proposed tags exist in
`content-platform/voice/taxonomy.md`.

```
FOR EACH tag value (organization, function, topic, theme):
  IF the value exists in taxonomy.md:
    -> Use it
  ELSE:
    -> ASK user: "Tag '<value>' isn't in the canonical taxonomy.
                 Closest matches: <list>. Pick one, or confirm you
                 want to add a new value (which requires updating
                 voice/taxonomy.md first)."

NEVER invent a tag value silently.
```

---

### Step 7: Propose campaign assignment

```
READ content-platform/campaigns/*.md for active and planned
  campaigns (status: active | scheduled | planned).

MATCH this piece to a campaign by:
  - theme alignment (campaign frontmatter `theme:`)
  - audience alignment (campaign frontmatter `audience:`)
  - timing fit (within the campaign's date_range)

PROPOSE one campaign in the brief's frontmatter `campaign:` field.
If none fit cleanly, set `campaign: none` and note in the brief
that the piece is standalone.
```

---

### Step 8: Generate brief.md from the matching template

```
COPY content-platform/articles/_template-<type>/brief.md
  TO   content-platform/articles/<slug>/brief.md
  (overwrite if exists; user has already opted into regeneration)

FILL in:
  - Frontmatter: slug, type, publish_date (from user or TBD),
    audience, length_target, byline, all the MDX-frontmatter fields
  - Body sections: Topic, Angle, Why now, Must include, Must NOT
    include, References, Voice notes
  - For blog-post: Hero graphic prompt section (per
    visual-identity.md format)
  - For linkedin-post: Hook (the explicit first 1-2 lines), Format
  - For white-paper: Citation style, structure (exec summary +
    sections + conclusion + action steps), expected PDF artifact
  - For tweet: standalone vs thread, beat per tweet

MARK any unresolved claims `**TBD — confirm**` and list them in a
final "Unresolved" section so the writer sees them at a glance.
```

---

### Step 9: Present for review

```
OUTPUT brief.md content to user (or path + summary if too long
  for one message)

SHOW summary:
  - Type: <type>
  - Length target: <words>
  - Primary audience: <persona>
  - Campaign: <slug> or "standalone"
  - Number of TBD-confirm markers
  - Number of cross-links

ASK for review:
  "Brief generated at content-platform/articles/<slug>/brief.md.
   Review for accuracy. Reply:
     y       -> proceed to /content-pipeline <slug>
     edit    -> tell me what to change in the brief
     done    -> stop here"
```

---

### Step 10: Hand off to content-pipeline (optional)

```
IF user said 'y':
  -> INVOKE content-pipeline <slug>

IF user said 'done':
  -> OUTPUT: "Brief ready at content-platform/articles/<slug>/brief.md.
              Run /content-pipeline <slug> when ready to produce
              plan, tasks, per-piece CLAUDE.md, and GitHub Issue."
```

---

## Things this skill must not do

- Do **not** invent stats, sources, or quotes. If the idea cites
  something the writer can't source, mark it `**TBD — confirm**`.
- Do **not** invent new tag values. Tags must come from
  `voice/taxonomy.md`. Adding a new value is a separate, gated
  decision that updates the taxonomy file first.
- Do **not** include items from `voice/examples/avoid-this.md` or
  break the do-not-say list in `voice/style-guide.md` §5. The brief
  itself should model the voice it specifies.
- Do **not** auto-generate the plan, tasks, or per-piece CLAUDE.md.
  That's `content-pipeline`'s job. This skill stops at the brief.

---

## Error Handling

| Situation | Response |
|---|---|
| Voice constitution files missing | Halt; report which files are missing; ask user to confirm before proceeding without them |
| `_template-<type>/brief.md` missing | Halt; explain template is required; offer to fall back to most-similar template |
| User skips blocking questions | Cannot proceed; explain why each blocking question matters for brief quality |
| Existing brief.md at the path | Ask before overwriting: "A brief already exists. Overwrite, append a `_v2`, or cancel?" |
| Tag value not in taxonomy | Refuse to invent; offer closest matches; require user to choose or update taxonomy.md first |

---

## Integration with Other Skills

```
idea-to-brief (THIS SKILL)
    |
    +-> Generates content-platform/articles/<slug>/brief.md
           |
           v
    content-pipeline (NEXT)
           |
           +-> plan.md, tasks.md, per-piece CLAUDE.md, GitHub Issue
                  |
                  v
           Writer drafts in articles/<slug>/draft.{mdx|md}
                  |
                  v
           Human moves to content/blog/ (or published/) for publish
```

---

*This skill is the content-side equivalent of `design-to-spec`.
Voice-aware, taxonomy-aware, gated by clarifying questions. The
brief it produces is the canonical specification for the piece.*
