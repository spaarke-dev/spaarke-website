# LinkedIn Publishing — Specification

> Claude-Code-orchestrated LinkedIn publishing for Spaarke. When the
> operator says "publish the IQ Stack article to the company page,"
> a skill drafts the LinkedIn copy, resolves the image, gates on
> chat approval, and posts via a Node script that holds credentials
> in Azure Key Vault. Targets both the Spaarke Company Page and the
> operator's personal account, with separate voices.

---

## 1. Purpose

Today, publishing a blog post on `spaarke.com` and then promoting it
on LinkedIn is two disconnected manual operations: the article goes
through the gated `content-pipeline` workflow, but the LinkedIn post
is hand-written in the LinkedIn UI, the image is hand-attached, and
nothing is recorded back to the per-piece workspace. The result is
inconsistent promotion cadence, copy drift between channels, and no
audit trail.

This project closes that gap. After a piece is published to
`content/blog/<slug>.mdx` and live on `/why-spaarke/<slug>`, a single
chat command — *"publish the iq-stack article to LinkedIn as
company"* — runs a Claude Code skill that:

1. Reads the published article.
2. Drafts a feed-card commentary in the requested voice.
3. Resolves the 1920×1080 LinkedIn image (using the asset produced by
   the content pipeline, or rasterizing the hero SVG as fallback).
4. Shows a preview in chat and waits for human approval.
5. On approve, posts to LinkedIn's Posts API via a Node script that
   reads credentials from Key Vault.
6. Records the post URL back to `published/linkedin-posts/<slug>.md`
   and updates `content-platform/calendar.md`.

The system supports two surfaces — **Spaarke Company Page** and the
**operator's personal account** — each with its own LinkedIn app,
voice, and credential pair.

---

## 2. Goals & non-goals

**Goals**

- One-command publishing from Claude Code chat, voice-aware
  (company vs personal), with a chat-based approval gate.
- Credentials in Azure Key Vault (`sprk-demo-kv`), never in `.env`,
  never in source, never in chat.
- Automatic refresh-token loop so the operator doesn't have to
  re-authenticate every 60 days. Manual re-auth required only once
  per year (refresh token TTL).
- The published-article MDX is read-only to this system. Only the
  LinkedIn post draft file and the calendar get written.
- End-to-end testable against the personal account *immediately*,
  while company-page approval (Community Management API) is in
  LinkedIn's review queue. Same code path for both — only the
  author URN and the credential pair differ.

**Non-goals**

- **Native long-form LinkedIn Articles (Pulse).** The LinkedIn API
  doesn't expose Pulse-article creation. If a piece needs to exist
  as a native Pulse article, that stays a manual operation in
  LinkedIn's web UI. The Spaarke house default is the
  feed-card-with-link pattern (article lives canonically on
  spaarke.com, LinkedIn is the distribution layer).
- **Automated scheduling.** No "post this Tuesday at 9am" cron. The
  operator decides when to publish each piece. Calendar drives
  intent; this system executes a single click.
- **Drafting from scratch.** The operator's `published/linkedin-posts/<slug>.md`
  is authoritative if present; the skill drafts only when it's
  missing or when the operator says "draft fresh".
- **Replies, DMs, polling LinkedIn for engagement.** Out of scope.
- **Other channels** (X/Twitter, Bluesky, Mastodon). Spec is
  LinkedIn-only.

---

## 3. Architecture

Four moving parts. The skill orchestrates; the Node script holds
auth; an Azure Function keeps tokens fresh in the background.

```
You (Claude Code chat):
  "publish <slug> to LinkedIn — company"
       │
       ▼
┌──────────────────────────────────────────────┐
│ .claude/skills/publish-linkedin/SKILL.md      │
│ Orchestrator (Claude Code runs in-chat):      │
│   1. Validate article exists in content/blog/ │
│   2. Resolve image (or rasterize hero.svg)    │
│   3. Load or draft commentary (voice-aware)   │
│   4. Preview in chat → wait for approve       │
│   5. Invoke publish script with --slug+--target│
└──────────────────────────────────────────────┘
       │  pnpm linkedin:publish --slug=… --target=…
       ▼
┌──────────────────────────────────────────────┐
│ scripts/linkedin-publish.ts (Node CLI)        │
│   1. Read tokens from KV (managed identity     │
│      via az login locally)                     │
│   2. Upload PNG via Images API → image URN     │
│   3. POST /rest/posts with content.article    │
│   4. On success, write post URL back to        │
│      published/linkedin-posts/<slug>.md +     │
│      content-platform/calendar.md             │
└──────────────────────────────────────────────┘
       │
       ▼
   LinkedIn (post live)

Separately, in background:
┌──────────────────────────────────────────────┐
│ Azure Function: linkedin-token-refresh         │
│   Timer trigger: 02:00 UTC daily              │
│   1. Read expires-at from KV for both apps    │
│   2. If within 7 days of expiry: call          │
│      /oauth/v2/accessToken with grant_type=    │
│      refresh_token                             │
│   3. Write new access + refresh tokens back   │
│      to KV                                     │
│   4. Log to App Insights; alert on failure    │
└──────────────────────────────────────────────┘
```

### 3.1 Two LinkedIn apps

Per LinkedIn policy, the Community Management API must be the only
product on its application. The system therefore uses two apps:

| App | Purpose | Products | Scopes | Author URN |
|---|---|---|---|---|
| **Spaarke Content Publisher** | Personal-account posting | Sign In with LinkedIn + Share on LinkedIn | `openid`, `profile`, `email`, `w_member_social` | `urn:li:person:{id}` |
| **Spaarke Company Page Publisher** | Spaarke Company Page posting | Community Management API | `r_organization_social`, `w_organization_social`, `rw_organization_admin` | `urn:li:organization:{id}` |

The publish script picks the credential pair from KV based on the
`--target` flag.

### 3.2 Key Vault layout

All secrets live in `sprk-demo-kv` (existing, RBAC-enabled,
soft-delete on). Naming follows the `kebab-case` family already in
use for the `ai-*` AI services.

```
linkedin-member-client-id          Public app ID (kept here for convenience)
linkedin-member-client-secret      Rotate manually if exposed
linkedin-member-access-token       60-day TTL; refreshed by Azure Function
linkedin-member-refresh-token      365-day TTL; refreshed when used
linkedin-member-token-expires-at   ISO 8601 timestamp; drives refresh decision
linkedin-member-person-urn         urn:li:person:{id}, set during first OAuth

linkedin-org-client-id             (parallel set — populated once company app is approved)
linkedin-org-client-secret
linkedin-org-access-token
linkedin-org-refresh-token
linkedin-org-token-expires-at
linkedin-org-organization-urn      urn:li:organization:{id}, set during first OAuth
```

Access pattern: managed identity in production (Azure Function),
`az login` session locally (operator runs CLI from their dev
machine).

### 3.3 Repo layout

```
projects/linkedin-publishing/
  spec.md              ← this file
  plan.md              ← produced by /project-pipeline
  tasks.md             ← produced by /project-pipeline
  CLAUDE.md            ← produced by /project-pipeline

scripts/
  linkedin-auth.ts             ← OAuth one-shot CLI
  linkedin-publish.ts          ← The publish CLI
  linkedin-refresh-token.ts    ← Shared refresh logic, reused by Function
  linkedin-shared.ts           ← KV access, token loading, URN parsing

azure/functions/linkedin-token-refresh/
  function.json                ← Timer trigger
  index.ts                     ← Wraps linkedin-refresh-token.ts

.claude/skills/publish-linkedin/
  SKILL.md                     ← Orchestrator definition

content-platform/published/linkedin-posts/
  <slug>.md                    ← Per-piece LinkedIn copy (already exists for some pieces)
```

---

## 4. The publish skill — `/publish-linkedin`

The skill is the operator's interface. Everything else is invisible
to them. Lives at `.claude/skills/publish-linkedin/SKILL.md`.

### 4.1 Invocation

```
/publish-linkedin <slug> [--target=company|personal] [--draft-fresh]
```

If `--target` is omitted, the skill asks. If both surfaces are
desired, the operator runs the skill twice (or invokes it with
`--target=both`, which sequences them).

### 4.2 Gated workflow

The skill follows the same gate-pattern as `content-pipeline`:

```
1. Validate
     ✓ content/blog/<date>-<slug>.mdx exists and isn't draft:true
     ✓ Article is live on spaarke.com/why-spaarke/<slug> (HEAD check)
     ✓ Target's app credentials exist in KV
     ✓ Access token isn't expired (calls refresh inline if it is)
   → On failure: stop, surface the specific issue.

2. Resolve image
     IF public/articles/<slug>/linkedin-1920x1080.png exists → use it
     ELSE
       IF public/articles/<slug>/hero.svg exists → rasterize with
         Sharp to 1920×1080 PNG, write to the linkedin-1920x1080.png
         path so the content pipeline now also produces it.
       ELSE: stop, ask operator to provide a hero asset.

3. Resolve commentary
     IF content-platform/published/linkedin-posts/<slug>.md exists
       AND --draft-fresh is NOT set:
         Read it. If it has front-matter `targets:` listing this
         target, use that section. Else use the body.
     ELSE: draft from article frontmatter (title, summary,
       keyTakeaways) using the voice for this target (see §7).

4. Preview
     Show in chat:
       Target:     Spaarke Company Page
       Author URN: urn:li:organization:<id>
       Image:      public/articles/<slug>/linkedin-1920x1080.png
       Link:       https://www.spaarke.com/why-spaarke/<slug>
       Title:      <article title>
       Description:<first 200 chars of summary>
       Commentary: <full proposed copy, ~150–250 words>
       Char count: <N> / 3000

5. Approval gate
     Operator types:
       `approve`        → run publish script
       `edit "<copy>"`  → replace commentary, re-preview
       `regenerate`     → re-draft from scratch (different angle)
       `cancel`         → exit without posting

6. Publish
     Invoke: pnpm linkedin:publish --slug=<slug> --target=<target>
     The script writes the approved commentary to published/
       linkedin-posts/<slug>.md before posting, so the file always
       reflects what actually ran.

7. Record
     On success: show the post URL in chat.
     Update content-platform/calendar.md (a new row or new column,
       see §5.4).
     Offer to push the linkedin-posts/<slug>.md update as a commit.
```

### 4.3 What the skill does *not* touch

- `content/blog/<slug>.mdx` — read-only.
- Any `public/articles/<slug>/*` asset other than creating the
  `linkedin-1920x1080.png` if missing.
- Site source code, components, configs.

---

## 5. The OAuth + refresh subsystem

### 5.1 One-shot OAuth CLI — `linkedin-auth.ts`

Run once per app per ~year (or whenever the refresh token expires
and the operator is notified). Usage:

```bash
pnpm linkedin:auth --app=member   # or --app=org
```

Behavior:
1. Reads client-id + client-secret from KV for the chosen app.
2. Spins up an ephemeral local HTTP server on `localhost:3000`.
3. Opens the browser to LinkedIn's authorization URL with the
   correct scopes for the chosen app and `redirect_uri=
   http://localhost:3000/auth/linkedin/callback`.
4. Operator approves in the browser; LinkedIn redirects back to the
   local server with `?code=...`.
5. Server exchanges the code for an access + refresh token at
   `POST /oauth/v2/accessToken`.
6. Server fetches the member or organization URN from
   `/v2/userinfo` (personal) or `/rest/organizationAcls` (company),
   so the publish script never has to ask.
7. Writes the four+ secrets to KV with the right names.
8. Server shuts down. Operator sees "success — token valid until
   2027-XX-XX" in the terminal.

### 5.2 Refresh function — `azure/functions/linkedin-token-refresh`

Azure Function with a daily timer trigger (`0 0 2 * * *` — 02:00 UTC
to avoid posting hours).

Reads the two `linkedin-*-token-expires-at` secrets, refreshes any
that are within 7 days of expiry, writes new tokens back to KV.

On refresh failure (e.g., refresh token revoked or expired), logs
to App Insights with a clear error message ("LinkedIn member token
expired — operator must run `pnpm linkedin:auth --app=member`
again") and sends a notification (see §10 for the alerting
channel).

### 5.3 Token lifetimes (LinkedIn 2026)

- Access token: **60 days** from issuance.
- Refresh token: **365 days** from issuance. Refreshing also issues
  a new refresh token, so an active integration extends
  indefinitely.
- Refresh-token rotation: yes — LinkedIn issues a new refresh token
  on each refresh, and the previous one is invalidated. The
  refresh function therefore must write *both* the new access token
  and the new refresh token atomically.

### 5.4 What gets written to the calendar

After a successful post, the skill appends a one-line row to
`content-platform/calendar.md` under the matching campaign or
standalone section. Format TBD — see open question #4.

---

## 6. The publish script — `scripts/linkedin-publish.ts`

Pure Node, TypeScript, runs from the repo root. No Next.js
dependency.

### 6.1 Inputs

```
--slug          required, e.g. "the-iq-stack"
--target        required: "personal" | "company"
--dry-run       optional: show the API call body without executing
--commentary    optional: inline commentary, overrides file
--image         optional: path override (defaults to per-article png)
```

### 6.2 Execution

```
1. Load tokens from KV for the chosen target.
   If access-token expires-at < now + 5 min, call refresh inline.

2. Validate image exists at the resolved path.
   File size < 8 MB (LinkedIn limit).

3. Upload image via Images API:
   a. POST /rest/images?action=initializeUpload
      body: { initializeUploadRequest: { owner: <author URN> } }
   b. PUT the binary to the returned uploadUrl.
   c. Receive image URN in the initializeUpload response.

4. Build post body (article content type):
     author:        <author URN>
     commentary:    <approved copy>
     visibility:    PUBLIC
     distribution:  { feedDistribution: MAIN_FEED, targetEntities: [], thirdPartyDistributionChannels: [] }
     content:
       article:
         source:      https://www.spaarke.com/why-spaarke/<slug>
         thumbnail:   <image URN from step 3>
         title:       <from frontmatter>
         description: <from summary, ≤ 200 chars>
     lifecycleState: PUBLISHED
     isReshareDisabledByAuthor: false

5. POST /rest/posts with headers:
     Authorization: Bearer <token>
     LinkedIn-Version: 202604 (or current; see §10 #5)
     X-Restli-Protocol-Version: 2.0.0
     Content-Type: application/json

6. On 201: extract Post URN from response header x-restli-id.
   Construct human URL: https://www.linkedin.com/feed/update/<URN>/

7. Write to disk:
     - published/linkedin-posts/<slug>.md   (commentary + post URL)
     - content-platform/calendar.md         (new row)

8. Output post URL to stdout for the skill to display.
```

### 6.3 Idempotency

LinkedIn doesn't expose an idempotency key on `/rest/posts`. If the
script crashes after image upload but before post creation, the
image URN is orphaned but LinkedIn auto-garbage-collects unused
image uploads — no manual cleanup.

If the script crashes between post creation and file-write, the
post is live but the local record is missing. The script writes a
`pending` marker before the API call and resolves it after, so on
retry it detects the partial state, queries LinkedIn for recent
posts by the author URN, and asks the operator whether to retry or
record the existing post.

### 6.4 Error handling

The Posts API error table (see LinkedIn docs link in §11) maps
cleanly to user-facing messages:

| HTTP | Message to operator |
|---|---|
| 401 | "LinkedIn token rejected — run `pnpm linkedin:auth --app=<member\|org>` to re-auth." |
| 403 | "LinkedIn permission denied. For company posts you must be ADMINISTRATOR on the Spaarke Company Page. For personal posts, the access token must include `w_member_social` scope." |
| 422 | "LinkedIn rejected the post body. Most common cause: commentary > 3000 chars or invalid mention syntax." |
| 429 | "LinkedIn rate-limited — wait 5 min and retry. (Daily quota is ~~150 posts.)" |

---

## 7. The two voices

The skill drafts in the voice appropriate to the target. The
existing `content-platform/voice/` constitution covers Spaarke
institutional voice; the personal voice is new and must be defined
before this system can draft personal posts well.

### 7.1 Company voice

Source: `content-platform/voice/style-guide.md` +
`content-platform/voice/brand-positioning.md`.

- Pronouns: *we, our, Spaarke*. Never "I". Never the operator's name.
- Register: institutional, McKinsey/HBR.
- Length target: 150–200 words.
- Opens with a concrete reframe or claim. Never "Excited to share…".
- Closes with a link prompt: "Read the full piece →".

### 7.2 Personal voice

Source: `content-platform/voice/personal-voice-<operator>.md` —
**new file, to be created**.

Until this file exists, the skill uses a placeholder profile:

- Pronouns: *I, me, my*. First person.
- Register: conversational, considered. Sharing perspective on a
  piece I worked on or a piece that struck me.
- Length target: 100–150 words.
- Opens with a one-line frame ("Spent the last two weeks thinking
  about why…"). Avoids "Just published…" / "Excited to share…".
- Closes with the link without a hard sell.

Recommended next step: after the operator has published 3–4
personal LinkedIn posts hand-written, run a small skill that
extracts the operator's actual register into
`personal-voice-ralph.md`. Until then, the placeholder profile is
the prompt prefix.

### 7.3 Surfacing the voice choice

The skill always shows the operator *which* voice doc it used to
draft, so they can override:

```
Drafted using voice: content-platform/voice/personal-voice-ralph.md
                     (placeholder profile — no file exists yet)
```

---

## 8. Image handling

### 8.1 Default path

`public/articles/<slug>/linkedin-1920x1080.png` — already produced
by the content-pipeline `Hero` gate for some articles. Aspect ratio
16:9 (1.778:1). LinkedIn link-card preference is 1.91:1 but it
accepts 16:9 with minor letterboxing on desktop and a center-crop
on mobile thumbnail.

### 8.2 Fallback

If the PNG is missing but `hero.svg` exists, the skill rasterizes
via Sharp at 1920×1080 and writes the result to the conventional
LinkedIn PNG path. The next time the content pipeline runs, the
file is already there.

This implicitly extends the content-pipeline's `Hero` gate. We
should also update
`content-platform/templates/blog-post/tasks.md` so the gate
explicitly requires the LinkedIn PNG (see open question #2).

### 8.3 Re-rendering an outdated PNG

If the article's `hero.svg` has been edited after the PNG was
written, the skill detects mtime drift and offers to re-rasterize.

---

## 9. Failure modes & idempotency

| Failure | Effect | Recovery |
|---|---|---|
| KV unavailable | Skill stops at validate step. | Retry; verify `az login` session. |
| Access token expired and refresh succeeds | Transparent — operator sees no change. | n/a |
| Refresh token expired or revoked | Publish script returns 401. | Operator runs `pnpm linkedin:auth --app=<…>`. |
| Image upload succeeds, post creation crashes | Orphaned image URN. | None needed — LinkedIn GCs. |
| Post creation succeeds, local file-write crashes | Post is live; local record missing. | Re-run skill; partial-state detection kicks in. |
| Operator approves, post fails 422 | Nothing live, draft preserved. | Skill suggests editing commentary or image. |
| 429 rate limit hit | Nothing live. | Retry after 5–10 min. |
| Refresh function fails 7 days in a row | Token expires; operator notified. | One-shot auth re-run. |

---

## 10. Open questions / decisions to confirm

1. **Where does the Azure Function live?**
   The repo has `spaarke-bff-demo` (likely Functions/App Service) and
   `spaarke-demo-plan`. Options:
   - **(a)** Co-locate in an existing Functions app — minimal
     infra changes.
   - **(b)** Net new Functions app (`spaarke-linkedin-refresh`) —
     clean isolation, separate logs, but more infra. Recommended
     unless `spaarke-bff-demo` has room.

2. **Update content-pipeline `Hero` gate to require LinkedIn PNG?**
   Today some articles have `linkedin-1920x1080.png`, some don't.
   Making the gate mandatory means historical articles need
   back-fill. Decision: add as a *recommended* item in
   `templates/blog-post/tasks.md`, with the LinkedIn skill
   auto-generating when missing as a safety net. Avoids back-fill
   churn.

3. **Personal voice doc.**
   No `personal-voice-ralph.md` exists. Options:
   - **(a)** Draft a v1 now from existing personal LinkedIn posts
     (if any are recoverable from your account).
   - **(b)** Use the placeholder profile and refine after 3–4
     real posts.
   Recommended: (b) — better data later.

4. **Calendar update format.**
   `content-platform/calendar.md` doesn't have a LinkedIn-posted
   column. Two options:
   - **(a)** New `linkedin-posted` column with the post URL.
   - **(b)** Free-form note appended below the existing row.
   Decision needed before tasks are generated.

5. **`LinkedIn-Version` header value.**
   LinkedIn rolls forward monthly (YYYYMM). At spec time the
   current version is `202604`. Strategy:
   - Hard-code `202604` for v1; bump quarterly with a single PR.
   - Or read from env. Hard-code keeps it boring.

6. **Notification channel on refresh failures.**
   The refresh function needs an alert path. Options:
   - **(a)** App Insights smart detection → email.
   - **(b)** GitHub Issue created via `gh api`.
   - **(c)** Plain email via SendGrid (already in deps).
   Recommended: (c) — same path the contact form already uses.

7. **Posting cadence guardrail.**
   Should the skill warn if the operator publishes more than one
   LinkedIn post in the same calendar day for the same target?
   LinkedIn deprioritizes high-frequency posting. Easy to add a
   soft warning that reads the calendar.

8. **Multi-image / carousel support.**
   Out of scope for v1. Article posts only. Revisit if/when
   campaigns demand it.

9. **Failure visibility to the operator.**
   When the refresh function fails silently in the background, how
   does the operator know? Tied to #6. Recommendation: weekly
   "token health" check emitted by the function regardless of
   refresh decision.

10. **Privacy / GDPR posture for stored tokens.**
    Tokens in KV are operator-personal credentials. Should we
    document the disposal flow ("if operator leaves, run
    `linkedin-revoke-and-delete.ts`")? Likely yes; add to
    `tasks.md`.

---

## 11. References

- LinkedIn Posts API (2026-04): https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-04
- LinkedIn Images API: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/images-api
- LinkedIn OAuth 2.0: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
- Existing voice constitution: `content-platform/voice/style-guide.md`, `content-platform/voice/brand-positioning.md`
- Visual identity (image rules): `content-platform/voice/visual-identity.md`
- Content pipeline workflow: `.claude/skills/content-pipeline/SKILL.md`
- Site canonical URL pattern: `https://www.spaarke.com/why-spaarke/<slug>`

---

## 12. Phasing

**Phase 1 — personal-account end-to-end (start now)**
Stages 4–6 of the build order. Runnable without waiting for the
Community Management API approval.

- Set up `scripts/linkedin-shared.ts` (KV access, common types).
- Build `scripts/linkedin-auth.ts` for `--app=member`.
- Build `scripts/linkedin-publish.ts` with personal-only support.
- Build `.claude/skills/publish-linkedin/SKILL.md` orchestrator.
- Test end-to-end against personal account.

**Phase 2 — Azure Function refresh loop**
Independent of Phase 1; can run in parallel.

- Decide Function hosting (open question #1).
- Build `azure/functions/linkedin-token-refresh/`.
- Configure managed identity to read/write `linkedin-*` secrets in KV.
- Set up notification path (open question #6).
- Deploy.

**Phase 3 — company-page publishing (gated on LinkedIn approval)**
Triggered when Community Management API is approved.

- Operator runs `pnpm linkedin:auth --app=org`.
- Extend `linkedin-publish.ts` with `--target=company`.
- Extend the skill with the company voice path.
- End-to-end test against a low-stakes article.

**Phase 4 — polish & docs**
- `pnpm linkedin:status` helper showing token health.
- `pnpm linkedin:revoke` for clean disposal.
- README section under `docs/` for operator workflow.

---

*Authored 2026-05-13 — locks the architecture from the design
conversation in this session. Open questions in §10 must be
resolved before `/project-pipeline` produces `plan.md` + `tasks.md`.*
