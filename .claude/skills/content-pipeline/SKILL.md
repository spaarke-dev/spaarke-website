# content-pipeline

---
description: From a signed-off brief.md, generate plan.md + tasks.md + per-piece CLAUDE.md + GitHub Issue, gated by human confirmation at each step
tags: [content-pipeline, orchestration, content, automation, github-project]
techStack: [content-platform, markdown, mdx, github-cli, github-projects-v2]
appliesTo: ["content-platform/articles/*/brief.md", "start content piece", "content pipeline"]
alwaysApply: false
---

## Purpose

**Orchestrator Skill** — The content equivalent of `project-pipeline`.
Given a canonical `brief.md`, produces the rest of the per-piece
workspace (plan.md + tasks.md + per-piece CLAUDE.md), creates the
GitHub Issue, adds it to the Project, and sets the custom fields —
gated by human confirmation at each step.

**Key Features**:
- Validates brief.md against required sections + frontmatter
- Generates plan.md (the structural outline — section + claim +
  evidence per section, opening + close beats, sources to verify,
  hero direction) using the matching `templates/<type>/plan.md`
- Generates tasks.md from `templates/<type>/tasks.md` (the 5- or
  6-gate workflow checklist)
- Generates per-piece CLAUDE.md from `templates/<type>/CLAUDE.md`
  (the session contract for this piece)
- Creates the GitHub Issue with the right title, body, labels,
  and Milestone (campaign)
- Adds the Issue to the GitHub Project, sets Pipeline status =
  Brief, sets Publish date
- Updates `content-platform/calendar.md` with a row for this piece
  (or updates the existing row's status)

**Human-in-Loop**: After each major step, present results and ask
for confirmation. Default action is "proceed" (user says 'y').

---

## When to Use

- User says "start content piece", "run content pipeline", or
  "/content-pipeline <slug>"
- A `brief.md` file exists at `content-platform/articles/<slug>/brief.md`
- After `idea-to-brief` has produced and the user has reviewed the brief

---

## Pipeline Steps

### Step 1: Validate brief.md

```
LOAD: content-platform/articles/<slug>/brief.md

VALIDATE:
  - File exists and is readable
  - Frontmatter contains required fields:
    - slug, type, audience, byline, status
    - publish_date (or marked TBD)
    - For blog-post: title, description, summary, tags
  - Body contains required sections:
    - Topic
    - Angle / Point of view
    - Why now
    - Must include
    - References
  - No `**TBD — confirm**` markers in BLOCKING positions (the
    Angle and Audience sections must be resolved before we can
    plan)
  - Tags validated against content-platform/voice/taxonomy.md

IF validation fails:
  -> STOP — list missing/invalid elements
  -> Offer: "Run /idea-to-brief <slug> to regenerate, or fix the
            brief manually and re-run /content-pipeline <slug>."
```

**Output to user**:
```
brief.md validated:
  - Type: <type>
  - Audience: <persona>
  - Length target: <words>
  - Campaign: <slug or "standalone">
  - Tags validated against canonical taxonomy
  - <N> TBD-confirm markers (in non-blocking positions)

Next: generate plan.md, tasks.md, per-piece CLAUDE.md.

[y to proceed / stop to exit]
```

**Wait for user**: `y` | `stop`

---

### Step 2: Load voice constitution + content-type calibration

Before generating the plan, read the constitution. The plan inherits
voice constraints — section structure, callout conventions, the
do-not-include list.

```
READ in this order:
  1. content-platform/voice/style-guide.md
  2. content-platform/voice/brand-positioning.md
  3. content-platform/voice/audience-personas.md  (just the
     persona named in brief.md frontmatter)
  4. content-platform/content-types/<type>.md
  5. content-platform/voice/examples/good-articles.md (for the
     opening pattern)

IF the brief touches Spaarke architecture:
  -> READ content-platform/voice/product-knowledge.md

IF the brief cites domain stats:
  -> READ content-platform/voice/domain-knowledge.md

IF a campaign is assigned:
  -> READ content-platform/campaigns/<campaign-slug>.md (for the
     narrative arc this piece sits inside, so the plan can fit)
```

---

### Step 3: Generate plan.md

```
COPY content-platform/templates/<type>/plan.md
  TO   content-platform/articles/<slug>/plan.md

FILL in:
  - Spine: 3-5 sentence compression of the brief's Angle
  - Sections: 3-5 H2s, each with claim + evidence + cross-link.
    Pull cross-link slugs from brief.md's References section.
  - Opening: 1-2 paragraph beats (hook + frame). Pattern-match
    against voice/examples/good-articles.md openings; do NOT
    copy.
  - Close: 1-2 paragraph beats (punch + cross-link to next piece
    in the campaign arc, if any)
  - Sources to verify: every named number/quote from the brief,
    flagged with "TBD" if no URL provided
  - Hero direction: per voice/visual-identity.md (default SVG)
  - Open questions: anything the brief left ambiguous

For LinkedIn posts: replace section structure with hook + body
  beats + close (per content-types/linkedin-post.md).
For white papers: extend section structure to executive summary +
  numbered sections + conclusion + action steps.
For tweets: replace section structure with thread structure
  (one beat per tweet).
```

**Output to user**:
```
plan.md generated at content-platform/articles/<slug>/plan.md.

Summary:
  - Spine: <one-line compression>
  - <N> sections planned
  - <N> sources to verify (<M> already have URLs, <K> TBD)
  - Hero: SVG (default) | photographic prompt | other

Next: generate tasks.md and per-piece CLAUDE.md.

[y to proceed / refine to discuss the plan first / stop to exit]
```

**Wait for user**: `y` | `refine` | `stop`

---

### Step 4: Generate tasks.md and per-piece CLAUDE.md

```
COPY content-platform/templates/<type>/tasks.md
  TO   content-platform/articles/<slug>/tasks.md

REPLACE all "<piece slug>" with the actual slug.
LEAVE all checkboxes unchecked.

COPY content-platform/templates/<type>/CLAUDE.md
  TO   content-platform/articles/<slug>/CLAUDE.md

REPLACE "<piece slug>" with the actual slug.
The relative paths (../../voice/, ../../campaigns/) work as-is
  from the new article directory.
```

**Output to user**:
```
Workspace ready at content-platform/articles/<slug>/:
  - idea.md     <-- writer's raw input
  - brief.md    <-- the spec
  - plan.md     <-- structural outline (review before draft)
  - tasks.md    <-- workflow gates checklist
  - CLAUDE.md   <-- session contract for this piece

Next: create the GitHub Issue and add it to the Project.

[y to proceed / stop to exit]
```

**Wait for user**: `y` | `stop`

---

### Step 5: Create GitHub Issue + add to Project

```
RESOLVE values from brief.md frontmatter:
  - title:    "<Type-Prefix>: <slug>"  (e.g., "Blog post: foo-bar")
  - type:     blog-post | linkedin-post | white-paper | tweet
  - persona:  from brief.md `audience:`
  - milestone: from brief.md `campaign:` -> matching milestone title
  - publish_date: from brief.md frontmatter

LOOK UP in content-platform/github-setup.md:
  - PROJECT_ID:        PVT_kwHODW0Pv84BXNgi
  - STATUS_FIELD_ID:   PVTSSF_lAHODW0Pv84BXNgizhSb9M8
  - DATE_FIELD_ID:     PVTF_lAHODW0Pv84BXNgizhSb9NA
  - Status option ID for "Brief": 26f291d2

EXECUTE:
  1. Create the Issue (with body referencing the article workspace):
     gh issue create --repo spaarke-dev/spaarke-website \
       --title "<Type-Prefix>: <slug>" \
       --body "<body — see template below>" \
       --label "type:<type>,persona:<persona>" \
       --milestone "<campaign milestone title>"

  2. Capture the issue URL/number.

  3. Add to project:
     item_id=$(gh project item-add 3 --owner spaarke-dev \
       --url <issue-url> --format json --jq '.id')

  4. Set Pipeline status = Brief:
     gh project item-edit --project-id PVT_kwHODW0Pv84BXNgi \
       --id $item_id \
       --field-id PVTSSF_lAHODW0Pv84BXNgizhSb9M8 \
       --single-select-option-id 26f291d2

  5. Set Publish date:
     gh project item-edit --project-id PVT_kwHODW0Pv84BXNgi \
       --id $item_id \
       --field-id PVTF_lAHODW0Pv84BXNgizhSb9NA \
       --date <YYYY-MM-DD>

ISSUE BODY TEMPLATE:
  **Slug:** `<slug>`
  **Type:** <type>
  **Publish date:** <date>
  **Campaign:** [<campaign name>](<repo URL to campaign file>)

  ## Workspace

  - Brief: `content-platform/articles/<slug>/brief.md`
  - Plan: `content-platform/articles/<slug>/plan.md`
  - Tasks: `content-platform/articles/<slug>/tasks.md`
  - Per-piece CLAUDE.md: `content-platform/articles/<slug>/CLAUDE.md`

  ## Workflow

  Pipeline status: Brief -> Outline -> Draft -> Review -> Scheduled -> Published.
  Update the Project's *Pipeline status* field as the piece progresses.
```

**Output to user**:
```
GitHub Issue created: <url>
Added to Project "Content pipeline" (https://github.com/users/spaarke-dev/projects/3).
Status set to: Brief
Publish date set to: <YYYY-MM-DD>
Milestone: <campaign>
Labels: type:<type>, persona:<persona>

Next: update calendar.md.

[y to proceed / stop to exit]
```

**Wait for user**: `y` | `stop`

---

### Step 6: Update calendar.md

```
LOAD content-platform/calendar.md

IF a row for this slug already exists:
  -> Update Status field to "brief"
  -> Update Campaign column if changed
  -> Add the GitHub Issue number as a Notes-column appendix
ELSE:
  -> ADD a new row in the appropriate month section:
     | <slug> | <type> | <publish_date> | brief | <author> | <campaign> | <one-line note from brief Topic> |
```

**Output to user**:
```
calendar.md updated.

Workspace ready. Hand off to writer.

Suggested next action for the writer:
  1. Open content-platform/articles/<slug>/CLAUDE.md
  2. Fill in plan.md (the outline gate — see tasks.md §1)
  3. Get human sign-off on plan
  4. Move Pipeline status to "Outline" in the GitHub Project
  5. Then drafting begins (tasks.md §2)
```

---

## Things this skill must not do

- Do **not** start drafting. The output is the workspace — plan,
  tasks, per-piece CLAUDE.md, Issue. Drafting is the next step,
  done by the writer (or by Claude in a separate session that
  loads the per-piece CLAUDE.md).
- Do **not** invent plan content. If the brief is sparse, the plan
  inherits that sparseness — flag the gaps in plan.md's "Open
  questions" section so the writer fills them before drafting.
- Do **not** skip the human-in-loop gates. Each step waits for `y`.
- Do **not** create the Issue if the user has already created one
  manually (check brief.md frontmatter for `github_issue:` field).
  Instead, link to the existing Issue.
- Do **not** push commits or open PRs. The skill produces local
  files and remote GitHub state (Issue, Project item). The writer
  commits separately when ready.

---

## Error Handling

| Situation | Response |
|---|---|
| brief.md missing or invalid | Halt; list issues; suggest re-running `/idea-to-brief <slug>` |
| Tag not in canonical taxonomy | Halt; list invalid tags; require fix in brief.md before proceeding |
| Campaign milestone doesn't exist | Ask user to create the milestone first or change the campaign assignment |
| `gh` CLI not authenticated or missing `project` scope | Halt; explain how to fix (`gh auth refresh -s project`) |
| Project item-add fails (rate limit, etc.) | Retry once; on failure, leave the Issue created and report the partial state to the user |
| User said `stop` mid-pipeline | Leave the workspace files in place; report what was done and what wasn't |

---

## Integration with Other Skills

```
idea-to-brief
    |
    +-> Generates content-platform/articles/<slug>/brief.md
           |
           v
content-pipeline (THIS SKILL)
    |
    +-> Generates plan.md, tasks.md, per-piece CLAUDE.md
    +-> Creates GitHub Issue
    +-> Adds to Project, sets fields, assigns milestone, applies labels
    +-> Updates calendar.md
           |
           v
[Writer takes over — drafts in articles/<slug>/draft.{mdx|md}]
           |
           v
[Human moves draft to content/blog/ or published/ for publish]
           |
           v
push-to-github (push branch, open PR, merge)
```

---

*This skill is the content-side equivalent of `project-pipeline`.
It assembles the per-piece workspace and the GitHub-side
operational tracking from a signed-off brief, then hands off to
the writer.*
