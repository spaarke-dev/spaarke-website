# Content Orchestration — Specification

> Daily Azure Function that scans `content-platform/calendar.md` and
> emails the operator a digest of pieces coming due in the next 7 days.
> Each row links to its GitHub Issue, its per-piece `CLAUDE.md`
> contract, and a "continue in Claude" deep link. Pure mechanical v1
> — no AI drafting, no auto-actions. The reminder *prompts* the
> operator; the operator still drives drafting and approval.

---

## 1. Purpose

The content platform has a structured calendar (`content-platform/calendar.md`)
listing every piece with a planned publish date and pipeline status.
Today, the operator has to remember to check that calendar — there's
no nudge. The result: drafts start late, pieces miss publish dates,
and the calendar drifts from reality.

This project closes that gap with the smallest useful step: a daily
email digest of what's due in the next week, with one-click links to
the per-piece workspace. It's the smallest piece of "agent
orchestration" that delivers value without giving an agent
permission to do anything beyond reading public state and sending
mail.

Bigger orchestration ideas (auto-draft on the day, auto-branch
creation, email-based approval gates) are explicitly **deferred** to
later phases — see [§8 Phasing](#8-phasing). The goal of v1 is to
prove the mechanical pipeline (function → calendar → email →
operator → action) before layering agency on top.

---

## 2. Goals & non-goals

**Goals**

- A single daily email digest, ~09:00 ET, listing every calendar row
  with `publish_date <= today + 7 days` AND `status in {brief, outline}`.
- Each digest row contains: title, slug, publish date, current
  status, owner, campaign.
- Each row has clickable links to:
  - The piece's GitHub Issue (via the slug → issue map).
  - The per-piece workspace on GitHub (`articles/<slug>/CLAUDE.md`,
    `brief.md`, `plan.md`, `tasks.md`).
  - A "Continue in Claude" deep link: `https://claude.ai/new?q=<encoded prompt>`
    that opens a fresh Claude session pre-populated with the right
    starting context for that piece.
- Function reads calendar.md from GitHub via the GH API — no repo
  clone required at runtime.
- SendGrid alerting via the same secrets the LinkedIn refresh
  function already uses (`sendgrid-api-key`, `notification-email-operator`,
  `notification-email-from`). One configuration, two functions.
- Function runs on the existing `sprkdemosa` storage account; no new
  Azure resources beyond the Function App itself.
- Skip-day rule: if zero pieces are due in the window, skip the
  email rather than send "nothing due."

**Non-goals**

- **No AI drafting.** The function does not call the Claude API.
  It's a digest of structured calendar state, not a writing assistant.
- **No auto-branch creation, auto-PR, auto-publish.** Even if a piece
  is overdue, the function does not act on it — only notifies.
- **No GitHub Projects integration.** GitHub Projects remains the
  database of truth; the function reads only the markdown calendar.
- **No replacement for GitHub Projects' own scheduling.** GH Projects
  has views; this is a *push notification* layer, not a replacement
  view.
- **No SMS, Slack, or push-app notifications.** Email-only for v1.
- **No "you missed a deadline" escalation.** Same rules every day —
  the operator decides what to do about overdue pieces.
- **No deferred "snooze" logic** — every morning is a fresh look at
  the week ahead.

---

## 3. Architecture

Pattern mirrors the LinkedIn refresh function exactly:

```
Azure Function (daily timer 13:00 UTC ≈ 09:00 ET):
  1. Read calendar.md from GitHub via Octokit
  2. Parse monthly tables, extract rows matching window
  3. Build email body with per-row links
  4. SendGrid send to operator
  5. App Insights log
```

### 3.1 Repo layout

```
azure/functions/content-orchestration-reminder/
  host.json
  package.json
  tsconfig.json
  src/
    functions/
      remind.ts            ← timer trigger handler
    calendar/
      parse-calendar.ts    ← regex-based markdown table parser
      types.ts             ← CalendarRow shape
    integrations/
      github.ts            ← Octokit wrapper, fetch calendar.md
      sendgrid.ts          ← shared SendGrid wrapper (DRY with refresh)
      links.ts             ← URL builders for GH Issue / file / claude.ai
    notify/
      digest.ts            ← email body templating

projects/content-orchestration/
  spec.md                  ← this file
  plan.md                  ← produced by /project-pipeline
  tasks/                   ← produced by /project-pipeline
  notes/                   ← runtime observations
```

### 3.2 Azure resources (new)

| Resource | Name | Notes |
|---|---|---|
| Function App | `spaarke-content-orchestration` | Consumption plan, Node 24, Windows kind (same RG-level limitation as the refresh function — no Linux dynamic workers in `rg-spaarke-demo`) |
| Application Insights | auto-attached by `func azure functionapp create` | Default name matches the Function App |
| Managed identity | system-assigned | Same pattern as refresh; needs **Key Vault Secrets User** (read-only is enough; this function never writes secrets) |

### 3.3 Key Vault secrets (new)

| Secret | Purpose | Set by |
|---|---|---|
| `github-token-readonly` | PAT with `repo:read` scope on `spaarke-dev/spaarke-website`. Used by Octokit to read `content-platform/calendar.md`. Read-only — never written back. | Operator (one-time) |

The three SendGrid secrets are **reused** from the LinkedIn refresh
project — no duplication.

### 3.4 Permission model

| Identity | Scope | Role |
|---|---|---|
| Function's managed identity | `sprk-demo-kv` | Key Vault Secrets User (read-only on `sendgrid-*`, `notification-email-*`, `github-token-readonly`) |
| `github-token-readonly` PAT | `spaarke-dev/spaarke-website` repo | `Contents: Read` (fine-grained PAT preferred over classic) |

Note this function gets a *narrower* KV role than the refresh
function (which needs write access for token rotation). Principle of
least privilege — the digest path never needs to mutate KV.

---

## 4. Calendar parsing

### 4.1 Source

`content-platform/calendar.md` is the canonical input. Fetched at
runtime via GitHub Contents API:

```
GET /repos/spaarke-dev/spaarke-website/contents/content-platform/calendar.md
Authorization: token <github-token-readonly>
```

Decode the base64 `content` field. No need for git clone; the function
is read-only and reads at most ~10 KB per day.

### 4.2 Schema

Per `content-orchestration/spec.md` (this file) + the existing
calendar shape: monthly `## YYYY-MM` and quarter `## YYYY-QN` H2
sections, each containing a markdown table:

```
| Slug | Type | Publish | Status | Author | Campaign | LinkedIn (personal) | LinkedIn (company) | Notes |
```

The parser:

1. Splits on `^## ` to get month/quarter sections.
2. For each section, finds the header row + data rows of the table.
3. Maps each data row to a `CalendarRow` typed object.
4. Skips quarter rows where `Publish` is `YYYY-Qn` (not a concrete date) — they're outside the "next 7 days" window by definition.
5. Skips the "Idea backlog" subsection — different schema.

### 4.3 CalendarRow type

```ts
interface CalendarRow {
  slug: string;
  type: "blog-post" | "linkedin-post" | "white-paper" | "tweet" | string;
  publishDate: string;                  // ISO date YYYY-MM-DD
  status: "idea" | "brief" | "outline" | "draft" | "review" | "scheduled" | "published";
  author: string;
  campaign: string | null;
  linkedinPersonal: string | null;      // URL or null
  linkedinCompany: string | null;
  notes: string;
}
```

### 4.4 Window filter

A piece appears in the digest if **all** of:

1. `publishDate` parses as a real date (skip `YYYY-Qn` rows).
2. `publishDate <= today + 7 days` AND `publishDate >= today - 1 day`
   (overdue by 1 day still appears).
3. `status in {brief, outline}`. Drafted/reviewed/scheduled don't
   need a reminder (they're moving through the pipeline already).
   Published doesn't need a reminder. Idea is too early.

If zero rows match: no email. Skip-day rule per §2 goals.

---

## 5. Email content

### 5.1 Subject line

- Single piece: `[Spaarke content] Due <relative>: "<title>"`
- Multiple pieces: `[Spaarke content] <N> pieces due in the next week`

`<relative>` is "today", "tomorrow", "in 3 days", "yesterday"
(overdue). Format with `Intl.RelativeTimeFormat`.

### 5.2 Body — plain text

```
Spaarke content — pieces due in the next 7 days

[2 pieces, sorted by publish date]

──────────────────────────────────────────────
[in 2 days · brief]  the-iq-stack
The Legal IQ Stack: Data, Memory, Inference
Publish: 2026-05-15 · Author: rs · Campaign: 2026-05-spaarke-launch

  Workspace:  https://github.com/spaarke-dev/spaarke-website/tree/main/content-platform/articles/the-iq-stack
  Issue:      https://github.com/spaarke-dev/spaarke-website/issues/<n>
  Continue:   https://claude.ai/new?q=Continue+work+on+articles%2Fthe-iq-stack%2F+in+the+spaarke-website+repo.+Read+CLAUDE.md+and+tasks.md+to+orient.

──────────────────────────────────────────────
[in 5 days · outline]  legal-ops-after-the-ai-hype-cycle
Practical observations on the shift from experimentation to operationalization
Publish: 2026-05-20 · Author: rs · Campaign: 2026-05-spaarke-launch

  Workspace:  …
  Issue:      …
  Continue:   …

──────────────────────────────────────────────

(No reply needed — this is an automated daily digest.)
```

### 5.3 Body — HTML

Same content rendered as a clean HTML block. Use `<table>` for the
per-piece rows. No CSS frameworks; inline styles. Keep it under
30 KB so Gmail doesn't clip it.

### 5.4 Link construction

| Link | Template |
|---|---|
| Workspace | `https://github.com/spaarke-dev/spaarke-website/tree/main/content-platform/articles/<slug>` |
| Issue | `https://github.com/spaarke-dev/spaarke-website/issues/<n>` — need to look up issue number from slug; see §6 |
| Continue in Claude | `https://claude.ai/new?q=<urlencoded-prompt>` where the prompt is hard-coded as: `Continue work on articles/<slug>/ in the spaarke-website repo. Read CLAUDE.md and tasks.md to orient before doing anything else.` |

### 5.5 Issue-number lookup

The slug ↔ issue number mapping is not stored in the calendar
markdown. Two options:

- **(a)** Query GH Issues API filtered by label/title-contains.
  Adds a network round-trip per row. Could time out for many rows.
- **(b)** Skip the Issue link if it can't be resolved cheaply, and
  link to the *issue search* (`/issues?q=<slug>`) which finds it for
  the operator.

Open question. Lean (b) for v1 — search-link is robust, no extra
API calls. Revisit if too friction-y.

---

## 6. Failure modes

| Failure | Effect | Recovery |
|---|---|---|
| GitHub API rate-limited | Function logs warning, retries next day | Operator's GH PAT should be fine-grained with no rate-limit-exceeding policy |
| KV unreachable | Function logs error, exits without sending | App Insights surfaces; operator sees no email (silent failure visible as missing morning email) |
| SendGrid send fails | Logs error, exits cleanly | Same — silent failure visible as missing email |
| Calendar parse error (malformed table) | Function logs error, sends email saying "calendar.md is malformed — operator should fix" | Operator fixes calendar.md format |
| Zero pieces in window | No email sent (skip-day rule) | Expected behavior |
| Multiple monthly sections newer than today | Function only reads sections that match the date window — `2026-09` rows ignored on May 13 | No action |

Note this function is **best-effort** — a failure means a missed
reminder, not lost data. No retry logic needed.

---

## 7. Operator runbook (folded into existing docs)

The existing `docs/linkedin-publishing.md` runbook gets extended (or
a sibling `docs/content-orchestration.md` created) with:

- How to set the `github-token-readonly` PAT
- How to interpret the digest email (recommended morning ritual: open
  email, click through to the most urgent piece, do 30 min of work)
- How to silence the digest temporarily (set notification-email-operator
  to `disabled` in KV — function still logs but sends no email)
- How to debug missing emails (check App Insights for
  `spaarke-content-orchestration`)

---

## 8. Phasing

### Phase 1 — Bare digest (this project, ~half day)

The deliverable in §1–6 above. After this phase:
- Operator receives daily email at 09:00 ET
- Email lists pieces due in the next 7 days
- Each row has working links

### Phase 2 (deferred, future spec) — Auto-branch creation

When a piece moves to `status: draft`, auto-create a feature branch
`content/<slug>` from main with the per-piece workspace files
populated. Operator gets a deep link to that branch in the email.

### Phase 3 (deferred) — Email-based approval gates

The publish-linkedin skill's chat approval gate becomes optional
email-clickable approval. Operator approves drafts and LinkedIn
posts from inbox. Requires a small web app to receive the click
(this is the load-bearing complexity per the earlier conversation).

### Phase 4 (deferred) — Routine-based brand-aware commentary

Use `/schedule` to spawn a Claude-API-backed routine that runs
weekly. Reads the past week's published pieces and writes
"observations from the brand perspective" into a notes file — the
operator reads this as input for the next planning cycle. This is
genuinely agentic; the function approach is wrong for it.

**Phases 2–4 are not in scope for this spec.** The goal is to ship
Phase 1, see how the operator actually uses it for 2–4 weeks, and
then decide what's worth automating next.

---

## 9. Open questions / decisions to confirm

1. **Issue-number lookup**: §5.5 (a) vs (b). Lean (b) — search-link
   no extra calls. Confirm?
2. **Time-of-day**: 09:00 ET. Adjust for operator timezone?
3. **Calendar source**: GitHub API (chosen). Alternative was checkout
   via Azure DevOps. GH API simpler. Confirm?
4. **Github token format**: fine-grained PAT or classic? Fine-grained
   recommended (scoped to one repo, one permission). Confirm?
5. **GitHub PAT rotation**: classic PATs don't expire by default;
   fine-grained PATs require rotation. Should the function log a
   warning when the PAT is within 14 days of expiring? Lean yes —
   tiny code addition, prevents silent breakage.
6. **HTML vs plain-text email**: ship both as multipart, or just
   plain-text for v1? Lean both (multipart) — HTML is a few extra
   lines.
7. **Function name**: `spaarke-content-orchestration` — too vague?
   Could be `spaarke-content-reminder` to make scope clear. Lean
   `spaarke-content-reminder` since the function only does reminders.
8. **Hooks for content-pipeline skill**: should this function call
   `/content-pipeline` skill output to drive its content (e.g., is
   the brief signed off?)? Or stick to calendar.md only? Lean
   calendar-only for v1 — fewer integration points.

---

## 10. References

- Existing LinkedIn refresh function (pattern to mirror): `azure/functions/linkedin-token-refresh/`
- LinkedIn publishing spec (similar architecture): `projects/linkedin-publishing/spec.md`
- The calendar this function reads: `content-platform/calendar.md`
- Per-piece CLAUDE.md template: `content-platform/templates/blog-post/CLAUDE.md`
- GitHub Contents API: https://docs.github.com/en/rest/repos/contents
- SendGrid `sgMail` (already a site dep): https://www.npmjs.com/package/@sendgrid/mail
- Claude session deep-link pattern: `https://claude.ai/new?q=<encoded prompt>`

---

*Authored 2026-05-13 — the smallest useful step in content
orchestration. Phases 2–4 are intentionally deferred to a future
spec once Phase 1 has been used in practice.*
