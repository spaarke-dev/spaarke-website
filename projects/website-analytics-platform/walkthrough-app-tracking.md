# Walkthrough app tracking

> Telemetry plan for the product walkthrough at `/tour/full-walkthrough`.
> Uses a **dual-tool architecture**: Application Insights for technical
> health and engineering signals, Plausible for marketing analytics, and
> Microsoft Clarity for behavior + session replay. Each tool has a
> distinct purpose; events should not be duplicated unless the data is
> genuinely useful in both places.

The walkthrough engine is `src/components/tour/*` with content in
`src/content/tours/full-walkthrough/<section>.ts`.

---

## Tool roles

| Tool | Purpose | What it answers |
|---|---|---|
| **Application Insights** | Engineering / technical observability | "Is the tour shipping events correctly? Are there exceptions? Where do users dwell longest? Did the email send fail silently?" |
| **Plausible** | Marketing analytics | "How many visitors started the tour this week? What was the completion rate? Which UTM source converts best? How many tour completions led to access requests?" |
| **Clarity** | Behavior + session replay | "Why are users dropping off at step X? Where do they click? Are they getting confused? Are there rage clicks or dead clicks?" |

**Rule of thumb for choosing a tool**:
- *Diagnose a known issue* → App Insights queries / Clarity recordings.
- *Report on funnel + conversion* → Plausible.
- *Discover unknown problems via behavior* → Clarity (heatmaps, friction
  insights, session search).

There is intentional overlap on a few key events (e.g., tour started /
completed) so high-level KPIs can be computed in either tool, but the
detailed per-step engineering signal lives in App Insights only.

---

## Already implemented (App Insights)

Live in production as of [PR #11](https://github.com/spaarke-dev/spaarke-website/pull/11) (May 7, 2026).
Captured via the `/api/tour-event` relay route → `src/lib/logger.ts` →
Application Insights `customEvents` table.

| Event | Trigger | Properties |
|---|---|---|
| `tour.started` | First step view of a browser session (sessionStorage-guarded) | `tourSlug`, `entrySection`, `entryStep`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `hasTourSession` |
| `tour.step_view` | Every step navigation | `tourSlug`, `sectionId`, `stepId`, `stepIndexInSection`, `stepIndexOverall`, `via` (`keyboard`/`click`/`section-jump`/`deeplink`), `dwellMsPrevious`, `isInterstitial`, `prevSectionId` |
| `tour.section_enter` | Active section changes | `tourSlug`, `sectionId`, `sectionIndex`, `enteredVia` (`forward`/`backward`/`section-jump`/`deeplink`) |
| `tour.completed` | `tour-outro` step is reached (sessionStorage-guarded) | `tourSlug`, `totalDurationMs`, `sectionsViewed`, `stepsViewed` |
| `tour.abandoned` | `visibilitychange=hidden` or `beforeunload` if outro not reached | `tourSlug`, `lastSectionId`, `lastStepId`, `lastStepIndexOverall`, `totalDurationMs`, `sectionsViewed`, `stepsViewed` |
| `tour.feedback_submitted` | 👍/👎/💬 from the inline FeedbackWidget | `tourSlug`, `sectionId`, `stepId`, `sentiment`, `hasComment` |
| `early_release.success` / `early_release.email_sent` / `early_release.email_not_sent` | Take Tour + Get Access form submissions and their email-send outcome | `source` (`take-tour`/`get-access`), `error` (only on email_not_sent) |

The **highest-leverage signal** is `dwellMsPrevious` on `tour.step_view`
— tells you which steps people linger on (re-reading dense content, or
genuinely engaging) versus zip past (skim or skip). This is engineering
data; not surfaced to marketing dashboards directly.

### Sample App Insights queries

**Per-step dwell distribution** (which steps engage):
```kusto
customEvents
| where name == "tour.step_view"
| where customDimensions.tourSlug == "full-walkthrough"
| extend dwellMs = toint(customDimensions.dwellMsPrevious)
| where dwellMs > 0
| summarize
    p50 = percentile(dwellMs, 50),
    p90 = percentile(dwellMs, 90),
    views = count()
  by sectionId = tostring(customDimensions.sectionId),
     stepId = tostring(customDimensions.stepId)
| order by p50 desc
```

**Funnel** (what % of starters reach each section):
```kusto
let starts = customEvents | where name == "tour.started" | summarize count();
customEvents
| where name == "tour.section_enter"
| summarize unique_sessions = dcount(session_Id) by sectionId = tostring(customDimensions.sectionId)
| extend pct_of_starts = (unique_sessions * 100.0) / toscalar(starts)
| order by sectionId
```

**Email send health** (PR #11 fix — surfaces silent SendGrid failures):
```kusto
customEvents
| where name in ("early_release.email_sent", "early_release.email_not_sent")
| summarize sent = countif(name == "early_release.email_sent"),
            not_sent = countif(name == "early_release.email_not_sent")
  by source = tostring(customDimensions.source), bin(timestamp, 1d)
```

---

## Plausible (marketing analytics) — partially shipped

Plausible is a privacy-friendly analytics tool. No cookies, GDPR-compliant
out of the box, lightweight script (~1KB). Custom events are unlimited
on the Growth plan ($9/mo, what we're on). The discipline still matters:
send only **high-level marketing-meaningful events**, not the per-step
engineering firehose.

The Plausible script and the broader site-wide event surface (form
submits, AI Source Visit, Article Read, CTA clicks, Outbound LinkedIn)
shipped in [PR #12](https://github.com/spaarke-dev/spaarke-website/pull/12)
— see [`projects/website-analytics-platform/spec.md`](spec.md) §4.2 for
the full Plausible event inventory. The tour-specific subset is below.

### Plausible tour events

| Event | When | Status | Goal? |
|---|---|---|---|
| `Tour Started` | First step view of a session (sessionStorage-guarded) | ⬜ TODO — replaces `Tour Section Enter` from PR #12 | ✅ goal — top of funnel |
| `Tour Completed` | Outro reached (sessionStorage-guarded) | ⬜ TODO — rename of `Tour Complete` from PR #12 | ✅ goal — completion conversion |
| `Tour Abandoned at Section` | Tab close before outro, with section in props | ⬜ TODO | (optional — counts) |
| `Tour CTA Click` | Outro "Get access" or any future inline CTAs | ⬜ TODO | ✅ goal — primary conversion |

Each event should include compact metadata as Plausible custom properties:
- `Tour Started`: `entry_section`, `utm_source`
- `Tour Completed`: `total_duration_min` (rounded), `sections_viewed`
- `Tour Abandoned at Section`: `section_id`, `pct_complete` (bucketed: 0-25/25-50/50-75/75-100)
- `Tour CTA Click`: `cta_label`, `step_id`

That's **4 event names** for the tour. The site-wide Plausible event set
(form submits, CTA clicks, etc., see spec §4.2) ships separately and is
already live.

### Migration from PR #12 events

PR #12 wired three tour-specific Plausible events as a placeholder:
`Tour Section Enter`, `Tour Section Complete`, `Tour Complete`. These
were too granular for marketing analytics (per-section enter fires on
every navigation, not once per session) and should be replaced when the
new events above are wired:

- **Drop** `Tour Section Enter` from Plausible — App Insights
  `tour.section_enter` already covers this for engineering analysis.
- **Drop** `Tour Section Complete` from Plausible — same rationale.
- **Rename** `Tour Complete` → `Tour Completed` and add `total_duration_min`
  + `sections_viewed` props.
- **Add** `Tour Started` (once per session, sessionStorage-guarded).
- **Add** `Tour Abandoned at Section` (visibilitychange/beforeunload).
- **Add** `Tour CTA Click` (outro CTA + any future inline CTAs).

Update [`src/types/plausible.d.ts`](../../src/types/plausible.d.ts) event
union to match.

### Implementation sketch

1. Wire the 4 events above into [`src/components/tour/TourShell.tsx`](../../src/components/tour/TourShell.tsx)
   alongside the existing App Insights `trackTourEvent` calls. The events
   live in **separate try/catch blocks** — if one tool's script fails,
   the other still ships.
2. Update `src/types/plausible.d.ts` to add the four new event names and
   remove the obsolete trio.
3. For `Tour CTA Click`: wrap CTA buttons in `Callout.tsx` and
   `InterstitialOverlay.tsx` to fire on click before navigation.
4. For `Tour Abandoned at Section`: add a `visibilitychange` listener
   (and `beforeunload` as fallback) that fires the event if the user
   hasn't reached `tour-outro`.
5. Configure goals in the Plausible dashboard so the funnel is visible.

### Goals to configure in the Plausible dashboard

- `Tour Started` — top of funnel
- `Tour Completed` — completion rate
- `Tour CTA Click` — outro CTA
- `Pageview` on `/access-request` — bottom of funnel (existing access
  requests will already track here automatically)

> ⚠️ **Funnel caveat:** the chain "tour completed → access requested"
> can't be definitively attributed without a join key on `/access-request`.
> See the open question on tour-session passthrough below; the goal-based
> funnel above will show *correlation* (people who completed the tour
> are likely the same people who later submitted access requests) but
> not causation per session.

---

## Microsoft Clarity (behavior + session replay) — partially shipped

Clarity is free, unlimited, and gives session replays + heatmaps + auto-
detected friction insights (rage clicks, dead clicks, excessive scrolling,
quick-back navigation). Strongest value: when the App Insights data flags
a step with high abandonment, Clarity recordings tell you *why*.

### Clarity status

- ✅ **Tracking script + project ID setup** — shipped in [PR #12](https://github.com/spaarke-dev/spaarke-website/pull/12).
  See [`src/components/analytics/ClarityScript.tsx`](../../src/components/analytics/ClarityScript.tsx).
  Project ID is supplied via `NEXT_PUBLIC_CLARITY_PROJECT_ID` env var
  (set in dev `.env.local` and Azure SWA app settings for production).
- ✅ **Privacy policy disclosure** — shipped in PR #12. See
  [`src/app/privacy/page.tsx`](../../src/app/privacy/page.tsx).
- ⬜ **Tour-specific custom tags** — TODO (this section).
- ⬜ **FeedbackWidget textarea masking** — TODO.

### Clarity custom tags to add

Set custom tags on tour pages so recordings can be filtered:

- `tour_section` (current section id)
- `tour_step` (current step id)
- `tour_status` (`browsing` / `completed` / `abandoned`)
- `has_feedback` (`true` if user has interacted with the FeedbackWidget
  this session)

Set tags via `window.clarity('set', tag, value)` from
[`TourShell.tsx`](../../src/components/tour/TourShell.tsx)'s step-change
effect (the same effect that fires the App Insights `tour.step_view`).

Mask the FeedbackWidget textarea via `data-clarity-mask="True"` so
user-typed comments don't appear in recordings.

### Clarity playbook

When App Insights shows step X has unusually high abandonment:

1. Open Clarity dashboard.
2. Filter sessions by custom tag `tour_step = <X>` and `tour_status = abandoned`.
3. Watch 5-10 recordings. Look for: rage clicks, hover-but-don't-click,
   re-reading the same line, scrolling and giving up.
4. Adjust the step's screenshot, anchor placement, or copy based on what
   you see. Re-deploy. Watch the same metric for a week.

---

## What App Insights captures that Plausible/Clarity won't (and vice versa)

| Signal | App Insights | Plausible | Clarity |
|---|---|---|---|
| Per-step view count | ✅ `tour.step_view` | ❌ (would burst event quota) | ❌ |
| Per-step dwell time distribution | ✅ `dwellMsPrevious` | ❌ | ⚠️ (visible in replays but not aggregated) |
| Funnel started → completed | ✅ kusto query | ✅ goal-based funnel | ⚠️ (filter by tag) |
| UTM source attribution | ✅ on `tour.started` | ✅ standard report | ❌ |
| Per-step feedback sentiment | ✅ `tour.feedback_submitted` | ❌ | ❌ |
| Email send health | ✅ `early_release.email_*` | ❌ | ❌ |
| Heatmaps (where users click) | ❌ | ❌ | ✅ |
| Session replay (what users actually do) | ❌ | ❌ | ✅ |
| Auto-detected friction (rage clicks, dead clicks) | ❌ | ❌ | ✅ |
| Marketing campaign performance | ❌ | ✅ | ❌ |
| Outbound link clicks | ⚠️ (manual) | ✅ auto | ✅ via replay |
| Mobile-blocked tour visits | ⚠️ (would need explicit event) | ✅ via UA breakdown | ✅ via replays |

**Avoid sending the same data to multiple tools** unless the cross-tool
view is genuinely useful. Specifically:

- **DO NOT** send every `tour.step_view` to Plausible — it would burn
  through custom-event quota and provide no marketing-actionable insight.
- **DO** send `Tour Started` / `Tour Completed` to both Plausible and
  App Insights — the funnel and conversion view is useful in both.
- **DO** set Clarity tags from the same TourShell effect that fires App
  Insights events, but DON'T re-implement the dwell-time tracking in
  Clarity — replays already show it.

---

## Privacy + compliance notes

- **App Insights** respects Do Not Track; the `tour_session` cookie is a
  hashed, salted value (non-PII but deterministic). Email addresses are
  redacted in custom events (`@***`).
- **Plausible** — no cookies, no PII collected by default. GDPR-friendly
  with no consent banner required for marketing analytics.
- **Clarity** — does collect PII via session recordings (typed input,
  visible page content). Mitigations:
  - ✅ Privacy policy disclosure (shipped in PR #12).
  - Mark the FeedbackWidget textarea with `data-clarity-mask="True"` so
    typed comments don't appear in recordings (TODO).
  - The Take Tour form's name + email inputs already reach a privacy
    threshold; either mask them too (`data-clarity-mask="True"`) or
    rely on Clarity's automatic input-masking feature (default for
    password fields, but text inputs need explicit masking).
  - Region-specific consent: if the site grows traffic from EU/UK, a
    cookie/consent banner will be required for Clarity (it does set
    cookies). Plausible doesn't trigger this; App Insights doesn't
    trigger this with our current config.

---

## Implementation phases

| Phase | Status | Owner | Notes |
|---|---|---|---|
| Tier 1 App Insights events | ✅ shipped (PR #11) | website team | All 5 base events live |
| Email send observability | ✅ shipped (PR #11) | website team | `early_release.email_sent`/`email_not_sent` |
| Plausible script (sitewide) | ✅ shipped (PR #12) | analytics-platform team | Project key `pa-of04A4p4E27LEiVbf7ChI`, Growth plan |
| Clarity script (sitewide) | ✅ shipped (PR #12) | analytics-platform team | Project ID `wngdyozlzl` via `NEXT_PUBLIC_CLARITY_PROJECT_ID` |
| Privacy policy disclosure | ✅ shipped (PR #12) | analytics-platform team | All three tools + localStorage attribution disclosed |
| Sitewide Plausible event surface (form submits, AI Source Visit, Article Read, CTA clicks, Outbound LinkedIn) | ✅ shipped (PR #12) | analytics-platform team | See spec §4.2 |
| Plausible tour events: rename `Tour Section Enter`/`Tour Section Complete`/`Tour Complete` → `Tour Started`/`Tour Completed`/`Tour Abandoned at Section`/`Tour CTA Click` | ⬜ TODO | analytics-platform team | Code change in TourShell.tsx + plausible.d.ts |
| Plausible goals configured | ⬜ TODO | analytics-platform team | Dashboard work, no code |
| Clarity tour custom tags + FeedbackWidget masking | ⬜ TODO | analytics-platform team | TourShell step-change effect; `data-clarity-mask="True"` on textarea |
| `tour.cta_click` (Tier 2 App Insights) | ⬜ TODO | website team | Wrap Callout + InterstitialOverlay CTA buttons |
| `tour.return_visit` (Tier 2 App Insights) | ⬜ TODO | website team | Detect `tour_session` cookie on entry |
| Cross-tool dashboard | ⬜ TODO | analytics-platform team | High-level: starts/completions in Plausible, dwell + replays as drill-down |
| Outro CTA → access-request attribution | ⬜ TODO | both teams | Requires query param or cookie passthrough on `/api/early-release` |

---

## Open questions

- **Outro CTA → access-request attribution**: the outro CTA goes to
  `/access-request` but we don't yet correlate the access-request
  submission with the tour visitor's session token. Adding either a
  `?from=tour` query param or reusing the `tour_session` cookie on the
  `/api/early-release` endpoint would let us count "tour completed →
  access requested" conversions definitively. **Currently blocks the
  marketing funnel claim** — until this is in place, the goal-based
  funnel in Plausible shows correlation, not causation per session.
- **`tour.return_visit` semantics**: the `tour_session` cookie is only
  set when a Take Tour form is submitted, so this event detects "lead
  returning to tour" not "any visitor returning." Worth a clarifying
  rename if it's wired (e.g., `tour.lead_return_visit`).
- **Sampling**: at our current traffic volume, fire 100% of all events.
  If the tour gets 10x traffic, sample `tour.step_view` to 10% in App
  Insights and stop including `dwellMsPrevious` (compute server-side
  from sampled events instead).
