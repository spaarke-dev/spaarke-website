# Website Analytics Platform — Specification

> Privacy-first visitor analytics + custom event instrumentation +
> first-touch attribution + AI-source traffic detection for the
> Spaarke marketing site. The platform layers three tools — Plausible
> (primary), Microsoft Clarity (behavioral), Application Insights
> (engineering) — with shared instrumentation in the codebase.

---

## 1. Purpose

The site is shipping content and forms steadily but currently has no
visibility into what's working. We're flying half-blind on:

- Where visitors come from (search, social, AI, direct, referral).
- Which content drives engagement vs. bounces.
- Which pages convert to form submissions.
- Whether AI search (Perplexity, ChatGPT, Claude, Bing AI) is sending
  any real traffic.
- The path a converter took from acquisition → conversion.

This project closes those gaps without compromising the privacy
posture the legal-tech audience demands. No cookie banner, no
cross-site tracking, no behavioral profiling — just per-page-view
metrics, first-party first-touch attribution, and AI-source
detection.

It is **not** an SEO project. SEO ("make more of the right things
happen") is a separate workstream that depends on the data this
project produces. Likely future: `projects/seo-optimization`.

---

## 2. Goals & non-goals

**Goals**

- Plausible installed as primary analytics, capturing pageviews,
  referrers, devices, screen sizes, country.
- Microsoft Clarity installed for free behavioral playback +
  heatmaps.
- 10–15 custom events covering CTA clicks, form submissions, tour
  engagement, content reads — emitted to Plausible (primary) and
  optionally App Insights (durable telemetry).
- First-touch attribution: when a form submits, we know the user's
  original referrer + landing page from a localStorage snapshot taken
  on first visit.
- AI-source traffic broken out: human visits arriving via known AI
  product domains tagged as a Plausible segment.
- AI crawler bot activity logged separately (server-side, App
  Insights) so we can see what's reading us for training/citations.
- Privacy policy updated to disclose all three tools clearly.
- A weekly + monthly readout cadence with templates.

**Non-goals**

- No GA4 / Google Tag Manager. Not yet — adds depth at the cost of
  privacy posture.
- No A/B testing infrastructure. Out of scope; can be added later.
- No SEO instrumentation (rank tracking, schema audits, link
  discovery). Separate project.
- No paid ad attribution / pixels. We're not running paid yet.
- No AI citation monitoring (Profound, Athena, DIY API queries) —
  deferred to Phase 2 with the wiring designed to support it later.
- No custom analytics tool. Standardized commercial tools beat
  build-your-own for marketing-site analytics.

---

## 3. Architecture

### 3.1 Three-tool stack

| Tier | Tool | Purpose | Cost |
|---|---|---|---|
| **Primary** | **Plausible** | Pageviews, referrers, custom events, conversion funnels | $9–14/mo (existing trial) |
| **Behavioral** | **Microsoft Clarity** | Anonymous session recordings, heatmaps, rage-click detection | Free |
| **Engineering** | **Application Insights** | Already in place — server errors, API latency, AI-crawler bot activity | Already paid |

No GA4. No Hotjar. No PostHog yet (Phase 2 candidate when tour
engagement scales).

### 3.2 Where things live

```
src/
├── app/
│   ├── layout.tsx                        ← Plausible + Clarity scripts
│   └── privacy/
│       └── page.tsx                      ← updated to disclose tools
├── components/analytics/
│   ├── PlausibleScript.tsx               ← script-injection component
│   ├── ClarityScript.tsx                 ← script-injection component
│   └── AttributionBootstrap.tsx          ← runs once on first page load
├── lib/
│   ├── analytics.ts                      ← typed wrapper for plausible() events
│   ├── attribution.ts                    ← first-touch capture + read API
│   └── logger.ts                         ← extended with bot-detection logging
├── middleware.ts                         ← (new) AI crawler bot detection
└── content/analytics/
    └── ai-sources.ts                     ← curated list of AI referrer domains
```

### 3.3 Data flow at submission

```
User: lands on /  ─→  AttributionBootstrap stores
   referrer="https://www.google.com"
   landing="/"
   first_visit_at=<ts>
   utm_*=null
into localStorage under key `spk_attribution_v1`.

User browses: /  →  /platform  →  /platform (returns)
   (no attribution writes — we keep first-touch)

User submits Take-Tour form on /platform:
   Client reads attribution from localStorage.
   POST /api/early-release with body that includes:
     name, email, captchaToken, source: "take-tour"
     attribution: { entry_referrer, entry_landing, first_visit_at,
                    pages_viewed, current_page }
   Server persists attribution alongside the lead in
   EarlyReleaseSignups Azure Table.

   Client also fires plausible('Take Tour Submit', { props: {...} })
   with the attribution properties as custom dimensions.
```

The localStorage key carries no PII, no behavioral profile — just
the entry referrer, entry landing page, and a timestamp. Cleared if
the user clears site data. Doesn't qualify as a tracking cookie under
GDPR/ePrivacy because it's first-party and used solely for the
purpose of attributing a user's own form submission.

---

## 4. The instrumentation surface (what we track)

### 4.1 Plausible — automatic

Every page view, with: URL, referrer, country (IP-derived, not
stored), device, browser, OS, screen size. No further work needed
once the script is installed.

### 4.2 Plausible — custom events

Defined as a typed enum so we can't typo them. Goal: 10–15 events
that materially answer "what's working." Initial set:

| Event | Trigger | Props |
|---|---|---|
| `Take Tour Submit` | Successful Take-Tour form submission | `entry_referrer`, `entry_landing`, `current_page`, `pages_viewed`, `time_on_site` |
| `Get Access Submit` | Successful platform-hero Get-Access submission | same |
| `Demo Request Submit` | Successful /access-request form | same |
| `Contact Submit` | Successful /contact form | `entry_referrer`, `current_page` |
| `Tour Started` | First step view of a tour session (sessionStorage-guarded, once per session) | `entry_section`, `utm_source` |
| `Tour Completed` | Tour outro reached (sessionStorage-guarded) | `total_duration_min`, `sections_viewed` |
| `Tour Abandoned at Section` | Tab close / `visibilitychange=hidden` before reaching outro | `section_id`, `pct_complete` (bucketed: 0-25/25-50/50-75/75-100) |
| `Tour CTA Click` | Click on any tour callout / interstitial CTA (e.g., outro "Get access") | `cta_label`, `step_id` |
| `Article Read` | ≥75% scroll AND ≥45s on page | `article_slug`, `time_on_page` |
| `CTA Click — Get Access` | Click on any "Get access" button | `from_page`, `from_section` |
| `CTA Click — Contact Us` | Click on Contact CTAs | `from_page` |
| `CTA Click — See Platform` | Click on the "See Platform" CTAs | `from_page` |
| `Outbound Click — LinkedIn` | Click on outbound LinkedIn link | `from_page` |
| `AI Source Visit` | First page view where referrer matches an AI source | `ai_source` (perplexity / chatgpt / claude / bing-ai / gemini / etc.) |

The list is intentionally short. New events get added through
deliberate decisions, not ad-hoc.

### 4.3 Microsoft Clarity — automatic

Anonymous session recordings (form-input fields auto-masked) +
heatmaps per page. No custom events needed; Clarity ships its own
out-of-the-box analytics.

The killer use: when a metric in Plausible looks off, we open
Clarity for that page and watch 5–10 sessions. Faster diagnosis
than logs.

### 4.4 Application Insights — extended for bot tracking

Add server-side detection of AI crawler user agents:

- `PerplexityBot`, `Perplexity-User`
- `ClaudeBot`, `Claude-Web`, `anthropic-ai`
- `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`
- `Bingbot` (with `chrome-extension` headers indicating Bing AI)
- `Google-Extended` (Google's AI-extension crawler)
- `Bytespider`, `Diffbot`, `Cohere-AI` (others to track passively)

Each detected request fires `ai_crawler.visit` in App Insights with
`{ user_agent, path }`. Aggregated weekly to see "what's reading us."

This lives in `middleware.ts` so it runs on every request including
static files.

---

## 5. First-touch attribution

The most-design-sensitive feature. The user's example: "User finds
us on Google → home → Platform → submits Take Tour. We want to know
they came from Google, not just that they were on Platform when they
submitted."

### 5.1 Storage

Single localStorage key: `spk_attribution_v1`. JSON value:

```ts
type Attribution = {
  /** First-page referrer ("https://www.google.com/" or "" if direct). */
  entry_referrer: string;
  /** First page they landed on (path only, e.g. "/"). */
  entry_landing: string;
  /** ISO timestamp of first visit. */
  first_visit_at: string;
  /** UTM params from first landing URL, if any. */
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  /** Detected AI source if entry_referrer matches an AI domain. */
  ai_source?: string;
};
```

- Written **once**, on first page load with no existing entry.
- Never updated on subsequent visits — first-touch wins.
- Cleared by user via "clear site data" or after 90 days
  (we set a TTL via a separate `spk_attribution_expires_at` key).
- A second sessionStorage key (`spk_session`) tracks current-session
  metrics (`pages_viewed`, `time_on_site`) used as event props.

### 5.2 Bootstrap component

`<AttributionBootstrap />` is a tiny client component included once
in `RootLayout`. On mount:

1. Read `spk_attribution_v1` from localStorage.
2. If present and not expired, do nothing.
3. If absent, write the snapshot from `document.referrer`,
   `window.location`, parsed UTM query params.
4. Fire `plausible('AI Source Visit', ...)` if the referrer matches.

### 5.3 API integration

Each form's POST body adds an optional `attribution` object. API
routes (`/api/early-release`, `/api/contact`,
`/api/registration/demo-request`) accept and persist it alongside
the lead in Azure Table Storage. Existing `source` field
(`get-access` / `take-tour`) on `/api/early-release` stays unchanged.

### 5.4 Why this is OK without a cookie banner

- First-party storage only — no cookies sent to third-party domains.
- No cross-site tracking — the data leaves the user's browser only
  via their own form submission.
- No persistent identifiers — the attribution snapshot doesn't
  contain device or user IDs.
- Existing privacy frameworks (UK ICO, EU EDPB) treat first-party
  localStorage used for analytics not as a tracking technology.
- Disclosed in privacy policy.

---

## 6. AI traffic detection

Two levels, both wired in Phase 0. The third (citation monitoring)
is designed to plug in later.

### 6.1 AI referral traffic (human visits)

When a human user clicks a link in Perplexity/ChatGPT/Claude.ai/Bing
AI/Gemini and lands on Spaarke, the `Referer` header carries the AI
product's domain. Captured by:

- **Plausible automatically** — the referrer appears in dashboard
  reports.
- **`AttributionBootstrap`** — checks the entry referrer against a
  curated list (`src/content/analytics/ai-sources.ts`). If matched,
  fires the `AI Source Visit` Plausible event with the source name
  ("perplexity", "chatgpt", "claude", "bing-ai", "gemini",
  "you", "kagi", "phind", "perplexity-comet").

The dashboard segment "AI Sources" filters all metrics to just those
visits, letting us answer "how many access-requests came from AI in
the last 30 days?"

### 6.2 AI crawler bot logging

When AI products crawl us for training/citations, they identify via
user-agent. Logged via Next.js middleware:

```ts
// middleware.ts (sketch)
export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? '';
  const bot = detectAiBot(ua);
  if (bot) {
    // fire-and-forget telemetry to App Insights
    void trackEvent('ai_crawler.visit', {
      bot,
      path: request.nextUrl.pathname,
    });
  }
  return NextResponse.next();
}
```

Aggregated weekly to see crawl patterns. Useful for two reasons:

1. Confirm AI tools index us. If we never see PerplexityBot, our
   site might not be reachable to AI citation.
2. Decide whether to allow/block specific bots in `robots.txt`.
   E.g., we currently don't block Google-Extended; if we ever decide
   training data matters, we can tighten.

### 6.3 AI citation monitoring (deferred — wiring in place)

When AI products *recommend* Spaarke without sending traffic, we
need a different tool. This is Phase 2 work but the design includes
a touchpoint for it now:

- A documented monthly process: manually query the major AI tools
  with the same set of prompts (e.g., "What's the best legal-ops
  platform for in-house counsel using Microsoft 365?"), record
  whether Spaarke appears.
- Optional later: **Profound** ($), **Athena** ($), or DIY scripts
  using OpenAI/Anthropic/Perplexity APIs.

Phase 0 deliverable for citation monitoring: a `monitoring/` folder
in this project with a template prompt set and a results spreadsheet
template, ready to populate manually starting month 1.

---

## 7. Privacy posture + cookie banner

We do not need a cookie banner. Each tool's stance:

- **Plausible** — cookieless, GDPR/CCPA/ePrivacy-compliant by
  default, no consent required by EU regulators. Plausible's own
  documentation confirms.
- **Microsoft Clarity** — uses a single first-party cookie for
  session correlation (`_clck`), which is borderline. Clarity's docs
  state no consent banner is required for analytics-grade use; if
  legal counsel disagrees, we add a banner. The ICO (UK) explicitly
  permits Clarity without consent for legitimate analytics use.
- **First-party `spk_attribution_v1` localStorage** — no consent
  required (not a cookie, no cross-site tracking, used only for the
  user's own subsequent form submission).
- **Application Insights** — server-side only, no client cookies in
  our setup (we don't enable the JS SDK).

**Privacy policy updates** (T05 in the task plan):

- Disclose Plausible, Clarity, App Insights by name.
- Explain the `spk_attribution_v1` localStorage purpose and 90-day
  TTL.
- Link to each tool's privacy practices.
- Give a way to opt out — Clarity respects DNT; Plausible doesn't
  set anything to opt out of; localStorage attribution clears via
  any "clear site data" action.

This story should pass any GC reading it.

---

## 8. Cadence + readout templates

Tools without discipline are decoration. Three rhythms:

### 8.1 Weekly (Monday morning, 15 min)

- Plausible: total visitors, top 5 referrers, top 5 entry pages.
- Plausible: any custom-event spike or drop.
- App Insights: any new exception cluster.

A `readouts/weekly-template.md` in this project gives the format.

### 8.2 Monthly (1st of month, ~1 hour)

- Plausible: month-over-month visitors, AI Sources segment vs.
  search vs. social.
- Plausible custom events: form submissions, tour completions,
  article reads (top 5 by `Article Read` count).
- Clarity: spot-check 10 sessions on the highest-traffic page that
  underperformed expected conversion.
- App Insights: AI crawler bot summary (which bots, what paths).
- One question: "what surprised us, what does it suggest we should
  write or change?"

`readouts/monthly-template.md` template.

### 8.3 Quarterly (3-hour readout, every 3 months)

- Trend analysis: referral mix shift, content ROI, conversion-rate
  trends.
- AI strategy: are AI sources growing? citation rate?
- Funnel diagnosis: where do we lose people?
- Site changes the data suggests we should make.

`readouts/quarterly-template.md` template.

---

## 9. Phasing

### Phase 0 — Install + first-week baseline (this project)

Goal: Plausible + Clarity live, all custom events firing,
first-touch attribution capturing, AI traffic broken out, privacy
policy updated, readout templates in place. Baseline data gathered
over the first 2–3 weeks.

Tasks T01–T07 detailed in `tasks/`.

### Phase 1 — First monthly readout

After 2–3 weeks of data, the first monthly readout. Calibrate which
events are surfacing useful signal and which are noise. Adjust event
list. Refine readout templates based on what we actually want to
see.

### Phase 2 — AI citation monitoring + advanced

When tour engagement scales (≥100 starts/mo) and we have a content
base to be cited from:

- Add Profound or Athena (paid, $50–200/mo) for AI citation
  tracking, OR
- DIY citation-check scripts using direct AI APIs.
- Consider PostHog if product-analytics-grade funnels become useful
  (tour completion rate by section, time-to-convert distributions,
  cohort retention).

### Phase 3 — Tooling integration

If/when the analytics workflow matures:

- A custom `/internal/analytics` page (auth-gated) pulling Plausible
  API + App Insights summary into a single weekly-readout view.
- Automated monthly readout generator (script writes the markdown
  shell of the readout from the data).
- Integration with the content platform: which articles convert?

---

## 10. Open questions / decisions to confirm

- **Plausible plan tier.** Free trial ends; we'll need either Growth
  ($9/mo, 10K pageviews/mo) or Business ($19/mo, 100K). Spaarke
  unlikely to need 100K imminently — start Growth.
- **Clarity project tag.** We need to register the site on
  clarity.microsoft.com to get the project tag. T01 prompts for it.
- **Article Read scroll percent.** 75% feels right but is subjective.
  Could be 60% or 90%. Stick with 75% initially; revisit after first
  monthly readout.
- **Bot-block decisions.** Currently `robots.txt` allows all. Once
  we see crawl patterns from T04, we may decide to block some bots
  (e.g., AI training scrapers we don't want training on us). Phase 2
  decision.
- **Internal analytics page (Phase 3).** Worth building or stay in
  Plausible's own dashboard? Decide after a quarter of using
  Plausible directly.
