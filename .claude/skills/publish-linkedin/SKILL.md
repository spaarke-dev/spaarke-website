# publish-linkedin

---
description: Publish a Spaarke blog article to LinkedIn as a feed-card post, with chat approval gate
tags: [linkedin, publishing, marketing, orchestration]
appliesTo: ["publish to linkedin", "/publish-linkedin"]
alwaysApply: false
---

## Purpose

**Orchestrator Skill** — The operator's only interface for promoting a
published Spaarke blog article to LinkedIn. Drafts a feed-card
commentary in the voice appropriate to the target surface (company
page or personal account), resolves the 1920×1080 image, gates on a
chat approval, then shells out to `npm run linkedin:publish` which
holds the OAuth credentials and talks to LinkedIn's Posts API.

Full architectural spec: [`projects/linkedin-publishing/spec.md`](../../../projects/linkedin-publishing/spec.md).
The 7-gate workflow this skill implements is §4.2. The two-voice
prompt rules are §7. The CLI contract this skill shells out to is
§6.1.

**Key Features**:
- Validates the article exists, is published (not `draft:true`), and
  is live on `spaarke.com/why-spaarke/<slug>` before drafting.
- Resolves the LinkedIn image with a Sharp-rasterized SVG fallback so
  back-fill isn't required for older articles.
- Drafts voice-aware commentary (company vs personal) and always
  surfaces *which voice doc was used* so the operator can override.
- Chat-based preview with full request body (target, author URN,
  image, link, title, description, commentary, char count).
- Approval gate with `approve` | `edit "<copy>"` | `regenerate` |
  `cancel`.
- Records the post URL back to `content-platform/published/linkedin-posts/<slug>.md`
  and offers to commit.

**Human-in-Loop**: After each major step, present results and wait
for an explicit action. Default is *never* "proceed silently" — this
skill ships content to a public surface.

**Spec-driven**: This skill never imports the TypeScript source of
`scripts/linkedin-publish.ts`. It only invokes the CLI via the Bash
tool. As long as the CLI contract in spec §6.1 holds, the two layers
evolve independently.

---

## When to Use

- User says "publish to LinkedIn", "publish <slug> to LinkedIn", or
  invokes `/publish-linkedin <slug>`.
- A `content/blog/<date>-<slug>.mdx` file exists, has `draft: false`,
  and the corresponding URL is live on `spaarke.com/why-spaarke/<slug>`.
- After the article has gone through the `content-pipeline` workflow
  and been merged to `main`.

Do **not** use this skill for:
- Native LinkedIn Articles (Pulse) — out of scope per spec §2.
- Posts that aren't promoting an existing `content/blog/` piece.
- Scheduled future-dated posts — this is a single-click *now*
  publisher.

---

## Pipeline Steps

### Step 1 — Validate

```
PARSE invocation: <slug> [--target=company|personal] [--draft-fresh]

IF --target is missing:
  -> ASK: "Which surface — company page or personal account?"
  -> WAIT for "company" | "personal"

VALIDATE:
  1. content/blog/<date>-<slug>.mdx exists (glob by slug suffix).
  2. Frontmatter `draft:` is missing or false.
  3. Frontmatter has `title`, `description`, `summary`. Pull
     `keyTakeaways` if present (used by the company-voice prompt).
  4. The canonical URL is live:
       HEAD https://www.spaarke.com/why-spaarke/<slug>
       -> 200 expected; if 404 or 5xx, stop.
  5. KV credentials for the chosen target exist. Probe by running:
       npm run linkedin:publish -- --slug=<slug> --target=<target> --dry-run
     and capture any "secret not found" / "token expired" surface.

IF validation fails:
  -> STOP — surface the specific issue.
  -> If a 401 / token error: route to Error Handling §"Token expired".
  -> If 404 on the canonical URL: "The article isn't live yet —
       check the deploy or wait for SWA to finish."
```

**Output to user**:
```
Validated:
  Slug:        <slug>
  Article:     content/blog/<date>-<slug>.mdx
  Title:       <title>
  Live URL:    https://www.spaarke.com/why-spaarke/<slug>  (200 OK)
  Target:      <company | personal>
  Author URN:  <from KV> (urn:li:organization:… or urn:li:person:…)
  Token:       valid until <date>

Next: resolve the LinkedIn image.

[y to proceed / cancel to exit]
```

**Wait for user**: `y` | `cancel`

---

### Step 2 — Resolve image

```
PRIMARY: public/articles/<slug>/linkedin-1920x1080.png
  IF exists -> use it.

FALLBACK: public/articles/<slug>/hero.svg
  IF exists AND PNG missing:
    -> Rasterize via Sharp at 1920×1080.
    -> Write to public/articles/<slug>/linkedin-1920x1080.png so the
       content pipeline now also produces it.
    -> Stage the new file (don't commit; main session decides).

DRIFT CHECK:
  IF both PNG and hero.svg exist AND hero.svg mtime > PNG mtime:
    -> ASK: "hero.svg was edited after the LinkedIn PNG was
             generated. Re-rasterize? [y to re-render / skip to use
             existing PNG]"

NO ASSET:
  IF neither file exists:
    -> STOP.
    -> "No hero asset found at public/articles/<slug>/. Provide
        hero.svg or linkedin-1920x1080.png and re-run."
```

**Output to user**:
```
Image resolved:
  Path:   public/articles/<slug>/linkedin-1920x1080.png
  Source: <existing | rasterized from hero.svg>
  Size:   <bytes> (<KB>; LinkedIn limit 8 MB)
  Dimensions: 1920×1080

Next: resolve the commentary.

[y to proceed / cancel to exit]
```

**Wait for user**: `y` | `cancel`

---

### Step 3 — Resolve commentary

```
DRAFT-FRESH PATH:
  IF --draft-fresh was passed -> skip to "Draft fresh" below.

EXISTING FILE PATH:
  IF content-platform/published/linkedin-posts/<slug>.md exists:
    READ it.
    IF it has frontmatter `targets:` listing the current target:
      -> Use the section for this target.
    ELSE:
      -> Use the file body as-is.
    Surface to operator: "Using existing copy from
      content-platform/published/linkedin-posts/<slug>.md"

DRAFT FRESH:
  LOAD article frontmatter (title, description, summary, keyTakeaways).

  IF target = company:
    -> Use the COMPANY VOICE prompt (see "Voice profiles" below).
    -> Source files: content-platform/voice/style-guide.md +
                     content-platform/voice/brand-positioning.md.
  IF target = personal:
    -> Use the PERSONAL VOICE prompt (see "Voice profiles" below).
    -> Source: content-platform/voice/personal-voice-ralph.md if it
       exists. Else: the placeholder profile inline in this skill.

ALWAYS surface to operator the voice doc(s) used to draft, so they
can override.
```

**Output to user**:
```
Commentary drafted using voice: <path or "placeholder profile">
Length: <N> words / <M> chars (LinkedIn limit 3000)

Next: full preview in chat.

[y to preview / cancel to exit]
```

**Wait for user**: `y` | `cancel`

---

### Step 4 — Preview in chat

Show the full request body the publish CLI is about to send, so the
operator can read it the way LinkedIn's feed will render it.

**Output to user**:
```
─────────── LinkedIn post preview ───────────
Target:       Spaarke Company Page
Author URN:   urn:li:organization:<id>
Image:        public/articles/<slug>/linkedin-1920x1080.png  (1920×1080, <KB>)
Link:         https://www.spaarke.com/why-spaarke/<slug>
Title:        <article title>
Description:  <first 200 chars of summary>

Commentary (drafted in <voice> voice, source: <voice doc path>):

  <full commentary, ~100–250 words depending on voice>

Char count: <N> / 3000
─────────────────────────────────────────────

Next: approval.

Actions:
  approve         -> publish now
  edit "<copy>"   -> replace commentary, re-preview
  regenerate      -> re-draft (different angle, same voice)
  cancel          -> exit without posting
```

**Wait for user**: `approve` | `edit "<copy>"` | `regenerate` | `cancel`

---

### Step 5 — Approval gate

Branch on the operator's reply:

```
approve:
  -> Proceed to Step 6.

edit "<copy>":
  -> Replace commentary with "<copy>" verbatim.
  -> Re-validate char count (≤ 3000).
  -> Loop back to Step 4 with the new commentary.

regenerate:
  -> Discard the current draft.
  -> Re-draft from article frontmatter using the same voice but a
     different opening angle (e.g., if first draft opened with the
     compounding claim, second opens with the operator-grade reframe).
  -> Loop back to Step 4 with the new draft.

cancel:
  -> Exit without posting.
  -> Leave any rasterized image artifact in place (it's still useful
     to the content pipeline).
  -> Output: "Cancelled. Nothing was posted. Image at <path> remains
     for next time."
```

This gate is the load-bearing safety. It is the only place where
public-facing copy is locked. Never auto-loop past this without an
explicit `approve`.

---

### Step 6 — Publish

```
EXECUTE (Bash tool):
  npm run linkedin:publish -- --slug=<slug> --target=<target>

The CLI:
  1. Loads tokens from KV for <target>; refreshes inline if needed.
  2. Reads the (now-locked) commentary from
     content-platform/published/linkedin-posts/<slug>.md
     (the skill writes it there before invoking, so the file always
     reflects what actually ran).
  3. Uploads the image via LinkedIn Images API.
  4. POSTs /rest/posts with the article content type.
  5. On 201, writes the post URL back to the same .md file as a
     frontmatter field.
  6. Echoes the post URL on stdout.

IMPORTANT: Always include the npm `--` separator. With npm, args
after `--` are passed through to the underlying script. Without it,
npm eats them and the CLI sees no flags:

  WRONG: npm run linkedin:publish --slug=foo --target=personal
  RIGHT: npm run linkedin:publish -- --slug=foo --target=personal

CAPTURE the stdout. Look for the post URL line. Capture stderr too —
LinkedIn errors map to operator-friendly messages (see Error
Handling).
```

**Output to user**:
```
Publishing…

<stdout from CLI, including the post URL line>

Posted: https://www.linkedin.com/feed/update/<URN>/
```

If the CLI exits non-zero, do **not** proceed to Step 7. Route the
error through the Error Handling section.

---

### Step 7 — Record

```
1. Show the post URL prominently in chat.
2. Read content-platform/published/linkedin-posts/<slug>.md (the CLI
   has just updated it with the post URL).
3. Offer to commit:
     -> "Commit the LinkedIn post record? This will commit
        content-platform/published/linkedin-posts/<slug>.md (and the
        rasterized PNG, if newly generated). [y / skip]"
4. If `y`: do NOT push directly. Hand off to the main session for
   batch commit per repo conventions (commit prefix `content:` with
   the slug).
5. The CLI has already updated content-platform/calendar.md per
   spec §5.4 — surface that the row was appended.
```

**Output to user**:
```
Published.

  Post URL:    https://www.linkedin.com/feed/update/<URN>/
  Target:      <company | personal>
  Voice used:  <voice doc path>
  Local record: content-platform/published/linkedin-posts/<slug>.md
  Calendar:    appended row in content-platform/calendar.md

Suggested next action:
  - Review the live post and check the link-card render.
  - If you want to commit the record now, say `commit`.
  - If you want to publish to the other surface, run
    /publish-linkedin <slug> --target=<other> next.
```

---

## Voice profiles

The skill always shows the operator which voice doc was used to
draft, so they can override. Both profiles are embedded inline here
so this skill is self-contained.

### Company voice — `--target=company`

**Source docs**:
- `content-platform/voice/style-guide.md` — the constitution.
- `content-platform/voice/brand-positioning.md` — what Spaarke
  stands for.

**Rules** (from spec §7.1):
- Pronouns: *we*, *our*, *Spaarke*. Never "I". Never the operator's
  name.
- Register: institutional, McKinsey/HBR. Authoritative, not
  breathless. Specific, not abstract.
- Length: 150–200 words.
- Opens with a concrete reframe or claim. Never "Excited to share…",
  "Just published…", "Thrilled to announce…".
- Closes with a link prompt: "Read the full piece →" (or a near
  variant — "Full piece →", "Read the architecture →").
- Banned phrases (from style-guide §5): no exclamation points, no
  "leverage", no "transformation", no "unlock", no "in today's
  world".
- Use bolded lead-in phrases for parallel beats if the post has
  three claims to walk through.

**Inputs to the prompt**: article `title`, `summary`, `keyTakeaways`
from frontmatter. Rewrite the takeaways in "we / our / Spaarke"
register; never paste them verbatim (they're written in declarative
third-person for the blog).

#### Worked example — `the-iq-stack` (company voice)

```
Most legal technology solves one problem at a time. Spaarke's
Legal IQ stack is a different approach — a three-layer architecture
where Data, Memory, and Inference compound, and every matter makes
the next one better.

**Data** captures how work actually gets done across the matter
lifecycle — not document storage, but structured capture of
decisions, spend, and workflow.

**Memory** retains the rationale — what was conceded, what leverage
worked, what the fallback position was. Documents capture outcomes;
Memory captures the dynamics.

**Inference** turns the two into decisions. Generic AI gives you
industry ranges. Inference grounded in your own 200 prior matters
gives you a framework built on your own history.

The layers compound. More data sharpens memory; richer memory
sharpens inference; better inference guides what data to capture
next. One learns. The other just runs.

Read the full piece →
https://www.spaarke.com/why-spaarke/the-iq-stack
```

Char count: ~1,050. Word count: ~175. Inside the 150–200 target.

### Personal voice — `--target=personal`

**Source doc**: `content-platform/voice/personal-voice-ralph.md` *if
it exists*. If it doesn't (which is the v1 state per spec §7.2), use
the placeholder profile below.

**Placeholder profile** (used until `personal-voice-ralph.md` is
authored from real personal posts):

- Pronouns: *I*, *me*, *my*. First person.
- Register: conversational, considered. Sharing perspective on a
  piece I worked on, or a pattern I keep seeing in the work. Not
  vendor pitch.
- Length: 100–150 words.
- Opens with a one-line frame in this family:
  - "Spent the last two weeks thinking about why…"
  - "Something I keep coming back to…"
  - "The thing I find most operators get wrong about <X> is…"
- **Avoid**: "Just published…", "Excited to share…", "Thrilled
  to announce…", "Check out my latest…", "Don't miss this…".
- Closes with the link plainly. No hard sell. No "what do you
  think?" prompt — first-person posts don't need to fish for
  comments.
- One concrete observation or example carries the post. Don't
  enumerate three takeaways the way the company voice does.

**Inputs to the prompt**: same article frontmatter, plus permission
to pull one specific example or claim from the article body if the
operator has flagged a favourite line.

#### Worked example — `the-iq-stack` (personal voice)

```
Spent the last few months thinking about why most "AI for legal"
tools feel underwhelming once you actually use them on real work.
The answer I keep landing on: it's not the model. It's that the
model has no memory of the matter, no context for the decision, and
no architecture under it that learns.

That's what the Legal IQ stack is really about — Data, Memory, and
Inference as three layers, not three features. Documents capture
outcomes. Memory captures the negotiation dynamics. Inference,
grounded in your own 200 prior matters, gives you a decision
framework built on your own history rather than industry averages.

Wrote it up:
https://www.spaarke.com/why-spaarke/the-iq-stack
```

Char count: ~750. Word count: ~135. Inside the 100–150 target.

Notice the difference: company voice is institutional, parallel,
walks the reader through three layers with bolded lead-ins, closes
with a "Read the full piece →" prompt. Personal voice is one
observation, first-person framing, ends with "Wrote it up:" — no
selling.

### Surfacing the voice choice

The preview in Step 4 must always state which voice doc was used:

```
Commentary (drafted in company voice, source:
  content-platform/voice/style-guide.md +
  content-platform/voice/brand-positioning.md):
```

or:

```
Commentary (drafted in personal voice, source:
  placeholder profile — content-platform/voice/personal-voice-ralph.md
  does not exist yet):
```

If the operator wants to override, they use `edit "<copy>"` at the
approval gate.

---

## Error handling

Map CLI failures to operator-friendly chat messages. The CLI's
stderr surfaces structured errors; match on the HTTP code or the
error class.

| Situation | Chat message to operator |
|---|---|
| KV access denied / `az login` expired | "I can't reach Key Vault. Run `az login` in your terminal, then retry." |
| Secret missing (first time on a target) | "No credentials in KV for `<target>`. Run `npm run linkedin:auth -- --app=<member\|org>` to do the one-shot OAuth, then retry." |
| Access token expired and refresh fails (401) | "LinkedIn token expired and refresh failed. I'll need you to run `npm run linkedin:auth -- --app=<member\|org>` from your terminal, then we can retry." |
| 403 permission denied (company) | "LinkedIn rejected the post: you must be ADMINISTRATOR on the Spaarke Company Page in LinkedIn's admin panel. Personal-account posts don't have this requirement." |
| 422 commentary > 3000 chars | "LinkedIn rejected the post body — commentary is `<N>` chars, limit is 3000. Want me to shorten? `edit "<copy>"` with your own version, or `regenerate` for a fresh shorter draft." |
| 422 other (mention syntax, etc.) | "LinkedIn rejected the post body with: `<error detail>`. Most likely cause is mention or hashtag syntax. Reply `edit "<copy>"` to fix." |
| 429 rate limit | "LinkedIn is rate-limiting — daily quota is ~150 posts. Let's wait 5 minutes and retry. The drafted commentary is preserved." |
| Image > 8 MB | "Image is `<N>` MB, over LinkedIn's 8 MB limit. The Sharp rasterizer should have stayed under that — check if `hero.svg` is unusually complex, or provide a custom `linkedin-1920x1080.png`." |
| Image missing / both PNG and SVG absent | "No hero asset at `public/articles/<slug>/`. Provide `hero.svg` or `linkedin-1920x1080.png` and re-run. I can also rasterize a different SVG if you point me to it." |
| Article not live (404 on `/why-spaarke/<slug>`) | "The article isn't live on spaarke.com yet — check the deploy status or wait for the SWA build to finish, then retry." |
| Partial-state recovery (script crashed mid-publish) | The CLI detects this via the `pending` marker and asks before posting again. Surface its prompt verbatim to the operator. |

For any error not in this table, surface the raw CLI stderr to the
operator with the prefix "Unexpected error from the publish CLI:"
and let them decide. Don't silently retry.

---

## Things this skill must not do

- Do **not** post without the operator typing `approve` at the
  Step 5 gate.
- Do **not** touch `content/blog/<slug>.mdx` — read-only.
- Do **not** touch any `public/articles/<slug>/` asset other than
  creating `linkedin-1920x1080.png` from `hero.svg` when missing.
- Do **not** push commits or open PRs. The skill produces local
  files (the linkedin-post record, the rasterized PNG, the calendar
  row) and a live LinkedIn post. The main session commits per repo
  conventions.
- Do **not** import the publish CLI's TypeScript source. Shell out
  to `npm run linkedin:publish` only.
- Do **not** print or log access tokens, refresh tokens, or any
  field from KV other than the public author URN.
- Do **not** auto-loop past `regenerate` more than twice in a row.
  If the operator regenerates three times, ask whether they want to
  switch voice or hand-write via `edit "<copy>"`.
- Do **not** post the same slug to the same target more than once in
  a 24-hour window without an explicit "yes, post it again" from the
  operator. (Soft warning per spec §10 #7.)

---

## Success criteria

The pipeline is complete when:

1. A LinkedIn post URL is returned (`https://www.linkedin.com/feed/update/<URN>/`)
   and shown to the operator in Step 7.
2. `content-platform/published/linkedin-posts/<slug>.md` has been
   updated with the approved commentary and the post URL.
3. `content-platform/calendar.md` has a row for this slug-target pair.
4. The operator has been offered a commit (and either accepted, in
   which case the main session commits, or declined, in which case
   the files are staged but uncommitted).

Anything less than all four — partial publish, missing record file,
no calendar row — is a failure state. Surface what was done and what
wasn't.

---

## Integration with other skills

```
content-pipeline
    |
    +-> Generates plan + tasks + per-piece CLAUDE.md
           |
           v
[Writer drafts in articles/<slug>/draft.mdx]
           |
           v
[Human moves to content/blog/<date>-<slug>.mdx, merges to main]
           |
           v
[SWA deploys → article live on spaarke.com/why-spaarke/<slug>]
           |
           v
publish-linkedin (THIS SKILL)
    |
    +-> Validates + drafts voice-aware commentary
    +-> Chat approval gate
    +-> Invokes npm run linkedin:publish
    +-> Records URL back to published/linkedin-posts/<slug>.md
    +-> Appends calendar row
           |
           v
[Main session commits the record per repo conventions]
```

This skill picks up where `content-pipeline` leaves off — once the
article is live on the canonical URL, this is the operator's
distribution layer for LinkedIn. Other channels (X, Bluesky) are
out of scope per spec §2.

---

*This skill is the LinkedIn-side equivalent of the publish step in
`content-pipeline`. It assembles a voice-aware, image-resolved,
human-approved feed-card post and shells out to the credentialed
Node CLI that talks to LinkedIn's API.*
