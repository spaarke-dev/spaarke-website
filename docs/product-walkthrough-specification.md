# Product Walkthrough App — Specification

> Self-contained sub-app inside the Spaarke marketing site that hosts
> interactive, narrated product tours. Tours are stepped slides built
> from PNG/WebP screenshots with positioned callouts. Multiple tour
> variants (Full Walkthrough, Feature Highlights, etc.) share a single
> rendering engine; each tour is data, not code.
>
> Live at https://www.spaarke.com/tour/full-walkthrough

This document is the **as-built** reference for the walkthrough engine,
content pipeline, deployment, and analytics. It complements
[`../projects/product-walkthrough-app/spec.md`](../projects/product-walkthrough-app/spec.md)
(the original design proposal) by documenting how things actually
shipped, what was learned along the way, and how to extend or change
the system safely.

## Table of contents

1. [What the walkthrough does](#1-what-the-walkthrough-does)
2. [Architecture overview](#2-architecture-overview)
3. [Data model](#3-data-model)
4. [Routing & URL state](#4-routing--url-state)
5. [Component tree](#5-component-tree)
6. [The 12-position pointer system](#6-the-12-position-pointer-system)
7. [Interstitial steps](#7-interstitial-steps-intro--transitions--outro)
8. [Feedback widget](#8-feedback-widget)
9. [Authoring workflow](#9-authoring-workflow)
10. [Screenshot processing pipeline](#10-screenshot-processing-pipeline)
11. [Tracking & analytics](#11-tracking--analytics)
12. [Deployment & infrastructure](#12-deployment--infrastructure)
13. [Extending the application](#13-extending-the-application)
14. [Next steps & future enhancements](#14-next-steps--future-enhancements)
15. [References](#15-references)

---

## 1. What the walkthrough does

The walkthrough is a guided tour of the Spaarke product, viewable on
desktop only (the engine intentionally hides itself below the `lg:`
Tailwind breakpoint — the screenshots are too dense for phones).

**User experience**:

- A visitor lands at `/tour/full-walkthrough` (typically by submitting
  the home Take Tour form, which captures their email and redirects
  them in).
- They see a **welcome interstitial** — a centered card overlaid on a
  dimmed screenshot — that frames the tour and points out the inline
  feedback option.
- They navigate through 106 steps using **arrow keys** (← / →), the
  **prev/next chevrons inside each callout**, or by **clicking a
  capability button** at the top to jump to a section.
- Each regular step shows a **screenshot** with one **callout** that
  has a title, body copy, optional CTA button, and an arrow pointing
  to the relevant feature on the screenshot.
- Section transitions and the tour outro appear as **interstitial
  cards** (centered modal over a dimmed background screenshot) that
  introduce the next section or wrap the tour.
- On every regular step a small **feedback row** lets the visitor send
  a 👍/👎 or write a free-text comment ("Like this feature?"). Comments
  trigger an email notification to the team.

**Where the tour fits in the site**:

- `/` (home) — Take Tour form captures lead and redirects to the tour.
- `/tour` — convenience redirect to `/tour/full-walkthrough`.
- `/tour/[slug]` — the actual tour page (statically rendered with
  `generateStaticParams`).
- `/access-request` — destination of the tour outro CTA.

The route is `noindex, follow` — search engines don't index the tour
itself but will follow links from it.

**Tour content size at first ship**:

| Section | Steps |
|---|---:|
| Matter Management (incl. tour intro) | 18 |
| Documents & Email | 25 |
| Collaboration | 21 |
| AI & Automation | 28 |
| Spend & Performance (incl. tour outro) | 14 |
| **Total** | **106** |

Of the 106, **6 are interstitials** (1 intro + 4 transitions + 1 outro).
The other 100 are real product screenshots with one callout each.

---

## 2. Architecture overview

The walkthrough is **fully self-contained** under `/tour/[slug]` — none
of its code or data ships in any other route's bundle. Tour data is
typed TypeScript, not JSON or CMS-driven.

```
src/
├── app/
│   └── tour/
│       ├── page.tsx                     # /tour → redirect
│       └── [slug]/page.tsx              # /tour/[slug] route handler
├── app/api/
│   ├── tour-event/route.ts              # client analytics relay
│   └── tour-feedback/route.ts           # 👍/👎/💬 submissions
├── components/tour/
│   ├── TourShell.tsx                    # top-level URL state owner
│   ├── TourHeader.tsx                   # capability nav (top)
│   ├── TourStage.tsx                    # screenshot + overlay container
│   ├── Callout.tsx                      # standard step callout
│   ├── InterstitialOverlay.tsx          # intro/transition/outro card
│   ├── CoordinateGrid.tsx               # ?grid=1 author overlay
│   ├── FeedbackWidget.tsx               # 👍/👎/💬 row
│   └── geometry.ts                      # box placement utilities
├── content/tours/
│   ├── types.ts                         # Tour, TourStep, Callout, etc.
│   ├── registry.ts                      # slug → Tour mapping
│   ├── full-walkthrough.ts              # composes the 5 sections
│   └── full-walkthrough/
│       ├── matter-management.ts
│       ├── documents-email.ts
│       ├── collaboration.ts
│       ├── ai-automation.ts
│       └── spend-performance.ts
├── lib/
│   ├── tour-tracking.ts                 # client-side analytics wrapper
│   ├── logger.ts                        # server-side App Insights
│   ├── storage.ts                       # Azure Tables: TourFeedback, EarlyReleaseSignups
│   ├── email.ts                         # SendGrid notifications
│   └── ip-hash.ts                       # rate-limit IP hashing
├── components/TakeTourCTAs.tsx          # home Take Tour form
└── scripts/
    └── process-tour-screenshot.mjs      # screenshot mask + resize + encode

public/tours/full-walkthrough/<section>/  # final web assets (committed)
resources/walkthroughs/full-walkthrough/<section>/
    ├── guide.md                         # author intent (committed)
    ├── 01-...png, 02-...png, etc.       # raw captures (gitignored)
```

**Key principle**: the engine is content-agnostic. Any `Tour` registered
in `registry.ts` will render through the same components.

---

## 3. Data model

All types in [`src/content/tours/types.ts`](../src/content/tours/types.ts).
Authors only ever write `Tour` / `TourSection` / `TourStep` / `Callout`
literals.

### `Tour`

```ts
type Tour = {
  slug: string;          // stable URL id, e.g., "full-walkthrough"
  title: string;
  description?: string;
  sections: TourSection[];
};
```

### `TourSection`

```ts
type TourSection = {
  id: SectionId;         // typed enum: "matter-management" | "documents-email" | ...
  label: string;         // shown on the capability nav
  steps: TourStep[];
};
```

### `TourStep`

```ts
type TourStep = {
  id: string;            // unique within the section
  screenshot: Screenshot;
  callout: Callout;
  interstitial?: boolean; // see §7
};
```

### `Screenshot`

```ts
type Screenshot = {
  src: string;           // path under /public, e.g., "/tours/full-walkthrough/.../step-1.webp"
  width: number;         // intrinsic px (drives aspect-ratio at any rendered width)
  height: number;
  alt: string;           // required, descriptive
};
```

### `Callout`

```ts
type Callout = {
  title?: string;
  body: string;          // supports \n\n for paragraph breaks in interstitials
  box?: { x: number; y: number; width: number; height?: number };  // explicit override
  anchor?: { x: number; y: number };                               // normalized 0-1
  pointer?: PointerPosition;                                       // see §6
  side?: "top" | "right" | "bottom" | "left";                      // legacy alias for pointer
  cta?: { label: string; href: string };
};
```

**All positional values are normalized fractions of the screenshot's
intrinsic dimensions** (0-1). The stage scales to fill its container;
positions scale with it. This is the most important design decision
in the engine — it means callouts position correctly at any rendered
width without per-viewport tuning.

### `PointerPosition` (12 values)

```ts
type PointerPosition =
  | "left-top"   | "left-middle"   | "left-bottom"
  | "right-top"  | "right-middle"  | "right-bottom"
  | "top-left"   | "top-middle"    | "top-right"
  | "bottom-left"| "bottom-middle" | "bottom-right";
```

See [§6](#6-the-12-position-pointer-system) for placement semantics.

---

## 4. Routing & URL state

| Path / param | Behavior |
|---|---|
| `/tour` | Redirects to `/tour/full-walkthrough` (the registry's `DEFAULT_TOUR_SLUG`). |
| `/tour/[slug]` | Renders the named tour. Returns 404 if the slug isn't registered. |
| `?section=<id>` | Active section. Defaults to first section. |
| `?step=<n>` | Active step within the section, 1-indexed. Clamped to `[1, total]`. |
| `?grid=1` | Overlays the 5%-step coordinate grid (author aid). |
| `?author=1` | Click on the screenshot prints + copies normalized `{x, y}` coords to the console (author aid). |

**`router.replace`, never `push`** — back/forward should jump between
pages, not steps. This is enforced in `TourShell.writeUrl`.

**Suspense requirement**: `TourShell` calls `useSearchParams()`, which
Next requires inside a `<Suspense>` boundary on statically-rendered
pages. The wrapper is in `[slug]/page.tsx`.

---

## 5. Component tree

```
<TourPage>                              // /tour/[slug]/page.tsx
  <main>
    <Suspense>
      <TourShell tour={...}>            // owns URL state, keyboard, mobile guard, telemetry
        <TourHeader>                    // capability nav
        <TourStage step={...} nav={...}>
          <Image src=screenshot.src .../>
          {step.interstitial
            ? <InterstitialOverlay callout=... nav=... />
            : <Callout callout=... nav=... tourSlug=... sectionId=... stepId=...>
                <CalloutCtaButton ... />     // optional
                <CalloutNav ... />           // prev/next/counter inline
                <FeedbackWidget ... />       // 👍/👎/💬
                <PointerArrow edge=... offset=... />
              </Callout>
          }
          <CoordinateGrid enabled={?grid=1} />   // dev/author aid
        </TourStage>
      </TourShell>
    </Suspense>
  </main>
```

`TourShell` is the only stateful client component for navigation. Every
other component is presentational and prop-driven.

The mobile guard sits in `TourShell` via Tailwind: a `lg:hidden` block
shows a "View on a larger screen" message; the engine is wrapped in
`hidden lg:block`. Screen ≥1024px wide gets the engine.

---

## 6. The 12-position pointer system

The pointer is **described from the box's perspective**: which edge of
the callout it protrudes from, and where on that edge it sits. The
box's position then falls out automatically.

### The 12 valid values

| First word (edge) | Second word (offset) | Direction box extends from anchor |
|---|---|---|
| `left` | `top` / `middle` / `bottom` | box on RIGHT of anchor |
| `right` | `top` / `middle` / `bottom` | box on LEFT of anchor |
| `top` | `left` / `middle` / `right` | box BELOW anchor |
| `bottom` | `left` / `middle` / `right` | box ABOVE anchor |

Mental model: `pointer: "left-top"` means *"the pointer is on the
**left** edge of my callout box, near the **top** of that edge"*. The
box must therefore be to the **right** of the anchor, and the pointer
is at title-level on its left edge.

### Why this matters: pointer accuracy regardless of box height

The callout's rendered height is unknown at JS time — text wraps based
on actual viewport. The earlier (4-side) system used a constant
`HEIGHT_ESTIMATE = 0.10` for placement math, which made the pointer
land off the anchor by 25-50 px on dense callouts.

The 12-position system avoids that by using **CSS percent-of-self
transforms**:

- For `left-top` (offset 0.18): CSS `top = anchor.y`, then
  `transform: translateY(-18%)` — translates the box up by 18% of its
  *own rendered height*. The pointer at `top: 18%` of the box ends up
  exactly at `anchor.y` regardless of how tall the box ends up.

This is implemented in `geometry.ts → resolveBox()` (returns base
position + transform string) and `Callout.tsx → PointerArrow` (renders
the SVG at the right edge + offset).

### Default safety

Values default to `pointer: "left-middle"` (callout on the right of the
anchor, pointer at vertical center) if neither `pointer` nor the legacy
`side` field is given. Legacy `side` values map to `*-middle` variants
(`right` → `left-middle`, `left` → `right-middle`, etc.).

### Author rule of thumb (anchor coord limits)

The default callout width is 28% of the screenshot. With a 2% gap from
the anchor, the box spans 30% horizontally. To stay on-screen:

- `pointer: "left-*"` (box extends right): keep `anchor.x ≤ 0.70`.
- `pointer: "right-*"` (box extends left): keep `anchor.x ≥ 0.30`.
- `pointer: "top-*"` / `"bottom-*"` (box centered horizontally on
  anchor): keep `anchor.x` between `0.18` and `0.82`.

If the box doesn't fit, the engine attempts to flip to the opposite
edge automatically. Best to choose pointer + anchor up-front rather
than rely on the flip.

---

## 7. Interstitial steps (intro / transitions / outro)

A regular step has a screenshot + a positioned callout pointing at a
feature. An **interstitial** step uses the same screenshot/callout
schema but renders very differently: the screenshot is dimmed and
slightly blurred behind a translucent backdrop, and the callout content
appears in a centered modal-style card without a pointer.

Use cases:

- **Tour intro** — `id: "tour-intro"`, first step of `matter-management`.
  Frames the tour and surfaces the feedback option.
- **Section transitions** — `transition-to-<next-section>`, last step
  of every section except the last. Brief recap + tease for the next
  section.
- **Tour outro** — `id: "tour-outro"`, last step of `spend-performance`.
  Includes the "Get access" CTA.

Mark with `interstitial: true` on the `TourStep`. The `screenshot`
field is still required (used as the dimmed backdrop) but the
`anchor`/`pointer` are ignored — the centered modal handles its own
positioning.

`InterstitialOverlay.tsx` renders:
- White card, brand-blue 2px border, larger title in brand blue.
- Body supports `\n\n` paragraph breaks.
- Optional CTA button.
- Same prev/next/counter inline nav as regular Callout — users step
  in and out like any other step.

---

## 8. Feedback widget

Lives in `Callout.tsx` only — interstitial steps don't show feedback.

**Behavior**:

- Three icon buttons: 👍, 👎, 💬.
- Click 👍 or 👎 → POST `/api/tour-feedback` with `sentiment: up|down`,
  empty comment. UI flips to "Thanks for the feedback" for 2 seconds,
  then resets.
- Click 💬 → expands an inline textarea (no modal). Submit posts
  `sentiment: null` plus the comment text.
- All states: idle / submitting / success / error.
- Resets when `stepId` changes (each step is its own feedback opportunity).

**Backend** (`/api/tour-feedback/route.ts`):

- Validates inputs (sentiment enum, comment ≤ 2000 chars, non-empty
  stepId).
- Rate-limits by hashed IP (`src/lib/rate-limit.ts`).
- Reads the `tour_session` cookie if present (set by
  `/api/early-release` when the visitor submitted the Take Tour form).
- Persists to Azure Tables `TourFeedback`. Schema:
  - `PartitionKey`: `tourSlug`
  - `RowKey`: `${ISO_timestamp}__${stepId}`
  - Properties: `sectionId`, `stepId`, `sentiment`, `comment`,
    `sessionToken`, `ipHash`, `userAgent`, `submittedAt`
- If a comment is present, sends an email to `CONTACT_EMAIL_TO` via
  `sendTourFeedbackNotification()`.
- Emits `tour.feedback_submitted` event in App Insights.

**Session token mechanic**: the `tour_session` cookie is
`SHA-256(email + TOUR_SESSION_SALT)` truncated to 32 chars, set by
`/api/early-release` on successful Take Tour submissions. Non-PII (the
salt is server-only) but deterministic, so a feedback row's
`sessionToken` can be re-derived from a known lead's email and
correlated back to their `EarlyReleaseSignups` row for follow-up.

---

## 9. Authoring workflow

The intended loop, per [`spec.md` §6](../projects/product-walkthrough-app/spec.md):

1. **Author** captures a screenshot from the dev environment (1×1 OS
   resolution, typically 5120×2880 retina from a modern Mac or a
   1440p Windows + zoom). The dev shell shows a "SANDBOX" badge in
   the top-right of the global header — the processor masks it out.
2. **Author** drops the raw PNG into
   `resources/walkthroughs/<slug>/<section>/`.
   - Filename convention: `01-<descriptive-name>.png`,
     `02-<...>.png`, with `01-` etc. indicating order.
   - If the badge needs masking, include `SANDBOX` in the filename
     (e.g., `02-document-detail-SANDBOX.png`).
3. **Author** edits the section's `guide.md` with one block per step:
   intent, callout title, body, anchor hint (plain language is fine —
   "the New Matter button"), preferred pointer position.
4. **Claude** runs `node scripts/process-tour-screenshot.mjs --source
   <raw> --out <web-asset>` for each new screenshot (with `--mask` if
   SANDBOX is present), updates the section's `.ts` file with new
   `TourStep` entries, and tells the author which preview URL to load.
5. **Author** previews at `/tour/<slug>?section=<id>&step=<n>&grid=1`.
   The grid overlay shows where the anchor lands.
6. **Author** requests adjustments. For dense screenshots, switch to
   `?author=1` and click — the click coords print to console + clipboard.
7. **Claude** updates the config; the author reviews. Typically 1-2
   rounds per step.

Image source files in `resources/walkthroughs/` are gitignored
(`.gitignore` has `**/*.png`/`*.jpg`/`*.webp` patterns under that path).
The `guide.md` files are tracked.

---

## 10. Screenshot processing pipeline

`scripts/process-tour-screenshot.mjs` (Node + sharp):

1. Reads source PNG (typically 5120×2880).
2. Resizes to **2400px wide** (per spec §8.1) with `withoutEnlargement: true`.
3. Optionally **masks** a region with white (the SANDBOX badge in the
   dev shell). Default mask is calibrated for the standard dev shell;
   override with `--mask "x,y,w,h"` for unusual captures.
4. Encodes to **WebP at quality 80** (or PNG; format inferred from
   output extension).
5. Writes to `public/tours/<slug>/<section>/<filename>.webp`.

**Why WebP not PNG**: a 32-PNG batch averages ~400 KB each = 12 MB.
The Azure SWA Functions package ([§12](#12-deployment--infrastructure))
has a hard 100 MB limit; combined with `node_modules/@next/swc-*` (~120
MB), even a few MB of PNGs can tip the bundle over. WebP brings the
same content down to ~150 KB each = 3 MB total. **All tour assets ship
as WebP**.

**Pipeline note**: `sharp.composite()` operates on the post-resize
image, not the source. The mask coordinates are passed in source-pixel
space and the script scales them to output space using
`scale = targetWidth / sourceWidth`. Without this, masks appear at the
wrong position at the wrong size — a footgun if you re-introduce the
PointerArrow-style positioning math elsewhere.

**Default mask coords** for the Spaarke dev shell are calibrated in
the script (`DEFAULT_MASK = { left: 4150, top: 0, width: 470, height: 100 }`).
If the dev UI changes (e.g., new SANDBOX badge styling), re-measure
via pixel scan: extract a row at the badge's vertical position and
look for dark-pixel runs.

---

## 11. Tracking & analytics

The walkthrough emits structured events to **Application Insights** via
a thin server-side relay. Plausible + Clarity integrations are planned
but not yet built — see
[`walkthrough-app-tracking.md`](../../spaarke-website-wt-analytics-platform/projects/website-analytics-platform/walkthrough-app-tracking.md)
in the analytics-platform project for the dual-tool design.

### Architecture

```
Browser (TourShell.tsx)
    ↓ trackTourEvent({name, properties})
src/lib/tour-tracking.ts            // fetch keepalive + sendBeacon fallback
    ↓ POST /api/tour-event {name, properties}
src/app/api/tour-event/route.ts     // allowlists "tour.*" event names
    ↓ trackEvent(name, properties)
src/lib/logger.ts                   // applicationinsights SDK
    ↓
Application Insights customEvents
```

Why server-relay instead of the browser App Insights SDK:
- No new browser dependency.
- No connection string in HTML.
- Server-side validation/allowlisting prevents abuse.

Trade-off: one HTTP POST per event. ~100 events per visitor over a
~15-minute tour. Negligible.

### Events currently captured

| Event | Trigger | Key properties |
|---|---|---|
| `tour.started` | First step view of a session (sessionStorage-guarded per `tourSlug`) | `entrySection`, `entryStep`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `hasTourSession` |
| `tour.step_view` | Every step navigation | `sectionId`, `stepId`, `stepIndexInSection`, `stepIndexOverall`, `via` (`keyboard`/`click`/`section-jump`/`deeplink`), **`dwellMsPrevious`**, `isInterstitial`, `prevSectionId` |
| `tour.section_enter` | Active section changes | `sectionId`, `sectionIndex`, `enteredVia` |
| `tour.completed` | `tour-outro` step reached | `totalDurationMs`, `sectionsViewed`, `stepsViewed` |
| `tour.abandoned` | `visibilitychange=hidden` or `beforeunload` if outro not reached | `lastSectionId`, `lastStepId`, `lastStepIndexOverall`, `totalDurationMs`, `sectionsViewed`, `stepsViewed` |
| `tour.feedback_submitted` | Feedback widget submission | `sectionId`, `stepId`, `sentiment`, `hasComment` |
| `early_release.success` | Take Tour or Get Access form accepted | `email` (redacted), `source` |
| `early_release.email_sent` | SendGrid notification email succeeded | `source` |
| `early_release.email_not_sent` | SendGrid notification email returned `{sent: false}` (silent failure) | `source`, `error` |

The **highest-leverage signal** is `dwellMsPrevious` on `tour.step_view`.
It tells you which steps people linger on (re-reading because the
content is dense or genuinely engaging) versus zip past (skimming or
skipping). This is the metric to watch when iterating on copy and
screenshot placement.

### Sample queries (Kusto, in App Insights Logs)

**Per-step dwell distribution**:
```kusto
customEvents
| where name == "tour.step_view"
| extend dwellMs = toint(customDimensions.dwellMsPrevious)
| where dwellMs > 0
| summarize p50 = percentile(dwellMs, 50),
            p90 = percentile(dwellMs, 90),
            views = count()
  by sectionId = tostring(customDimensions.sectionId),
     stepId = tostring(customDimensions.stepId)
| order by p50 desc
```

**Funnel — what % of starters reach each section**:
```kusto
let starts = customEvents | where name == "tour.started" | summarize count();
customEvents
| where name == "tour.section_enter"
| summarize unique_sessions = dcount(session_Id)
  by sectionId = tostring(customDimensions.sectionId)
| extend pct_of_starts = (unique_sessions * 100.0) / toscalar(starts)
```

**Email send health**:
```kusto
customEvents
| where name in ("early_release.email_sent", "early_release.email_not_sent")
| summarize sent = countif(name == "early_release.email_sent"),
            not_sent = countif(name == "early_release.email_not_sent")
  by source = tostring(customDimensions.source), bin(timestamp, 1d)
```

### Privacy

- **No PII** in event payloads. Email addresses are redacted
  (`@.*` → `@***`).
- **`tour_session` cookie** is `SHA-256(email + TOUR_SESSION_SALT)` —
  non-PII but deterministic. Never logged in plaintext.
- **Do Not Track** is respected by the `applicationinsights` SDK by
  default; no extra handling needed.

### What's planned but not yet built

Per the analytics-platform spec, four marketing events should also fire
to **Plausible** when that integration lands: `Tour Started`,
`Tour Completed`, `Tour Abandoned at Section`, `Tour CTA Click`. These
are different from App Insights events because Plausible is for
marketing reporting (funnels, UTM attribution) rather than per-step
engineering signals.

**Microsoft Clarity** integration will add session replays + heatmaps
+ auto-detected friction insights (rage clicks, dead clicks). Custom
tags should mirror the active step state (`tour_section`, `tour_step`)
so recordings can be filtered by where in the tour the user was.

The FeedbackWidget textarea **must be masked** in Clarity recordings
(`data-clarity-mask="True"`) to avoid capturing typed comments.

---

## 12. Deployment & infrastructure

### Hosting

**Azure Static Web Apps** — same instance as the rest of
`www.spaarke.com`. Workflow at
`.github/workflows/azure-static-web-apps-ambitious-bay-0fb5bb10f.yml`.

Trigger model:
- Push to `main` → production deploy (in-place upgrade of the existing
  slot)
- PR opened/synchronized to `main` → preview environment per PR (URL
  format `https://ambitious-bay-0fb5bb10f-<pr-number>.eastus2.1.azurestaticapps.net`)
- PR closed → preview slot torn down

### Critical: the 100 MB Functions limit + `api_build_command`

Azure SWA bundles `/public/` plus `.next/standalone/` into the SSR
**Functions** package, which has a **hard 100 MB limit**
(104,857,600 bytes). On Next.js sites, `node_modules/@next/swc-*`
(SWC native binaries, ~120 MB on its own) is the dominant contributor.
Without intervention, even a few MB of new `/public/` assets tips the
package over the limit and deployment fails with a generic
`Failed to deploy the Azure Functions` error at the 15-second
post-upload validation step.

**The fix is in our workflow** (don't remove this line):

```yaml
api_build_command: 'rm -rf ./node_modules/@next/swc-* && rm -rf ./.next/cache'
```

This strips the SWC binaries and the build cache before the Functions
zip is packaged. See
[Azure/static-web-apps#1034](https://github.com/Azure/static-web-apps/issues/1034)
for the documented community workaround. This is also captured in
[`SITE-SPECIFICATION.md`](./SITE-SPECIFICATION.md) §12.

### Environment variables (Azure SWA Configuration)

| Var | Required for | Notes |
|---|---|---|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | All custom event tracking + exception capture | If missing, `trackEvent` is a no-op. |
| `STORAGE_ACCOUNT_CONNECTION` | `EarlyReleaseSignups` + `TourFeedback` Azure Tables | If missing, signup row not persisted AND `tour_session` cookie not set. |
| `SENDGRID_API_KEY` | All notification emails | Paid plan required if free quota exhausted. |
| `SENDGRID_FROM_EMAIL` | Email `from` address | Must be a verified sender in SendGrid. |
| `CONTACT_EMAIL_TO` | Recipient for contact + early-release + feedback emails | Real inbox, monitored. |
| `RECAPTCHA_SECRET_KEY` | Captcha verification (server-side) | If unset, captcha check skipped (dev-friendly; required in prod). |
| `RECAPTCHA_SITE_KEY` | Captcha widget render (client-side) | If unset, widget doesn't render. |
| `TOUR_SESSION_SALT` | Salt for the `tour_session` cookie hash | Any random ≥32-char string. Without it the cookie value is `sha256(email)` — predictable. |
| `RATE_LIMIT_PER_MINUTE` | Rate limiter window | Defaults to 5/min. |
| `SITE_URL` | Article SEO / JSON-LD | Defaults to `https://www.spaarke.com`. |

**Setting env vars**: Azure Portal → Static Web App → Configuration →
Application Settings → + Add. Save — app restarts in ~30 seconds.

### Asset size targets (per `spec.md` §8.1)

- **Tour screenshots**: ≤ 250 KB per WebP, ≤ 400 KB per PNG. Targets
  routinely met by the `process-tour-screenshot.mjs` defaults.
- **Total `/public/tours/`**: ~3 MB at 106-step ship. Plenty of
  headroom under the SWA limit even before the SWC strip.

### Deploy regression playbook

If a deploy fails with `Failed to deploy the Azure Functions`:

1. **Cause 1** (most common): Functions package > 100 MB. Verify the
   `api_build_command` line is still in the workflow. If it is, look
   for new ~100 MB native binaries in `node_modules/` (e.g., a Next
   upgrade may add a new architecture variant).
2. **Cause 2** (rare): SVG with embedded base64 data URIs in
   60-65k-character single lines. Run `node scripts/slim-svgs.mjs`.
3. **Diagnostic**: `gh run view <run_id> --log` and search for
   `Status: Failed.` near the end. The 15-second mark indicates the
   100 MB limit; longer polling that eventually fails indicates a
   different cause.

---

## 13. Extending the application

This section captures the non-obvious considerations when changing the
walkthrough. Read before making structural changes.

### 13.1 Adding a new step

Easy. Insert a new `TourStep` literal in the appropriate section's
`.ts` file. The step counter and section nav update automatically.

The step's `screenshot.src` must point at a file in `/public/`. If
it's a new image, run it through `scripts/process-tour-screenshot.mjs`.

### 13.2 Adding a new tour (slug)

1. Create `src/content/tours/<new-slug>/<section>.ts` files (or a
   single file if the tour is small).
2. Compose them in `src/content/tours/<new-slug>.ts`.
3. Register in `src/content/tours/registry.ts` by appending below the
   `// TOURS` marker comment.
4. The `/tour/<new-slug>` URL renders automatically (Next's
   `generateStaticParams` returns `Object.keys(TOURS)`).

The same engine renders every tour. No code changes needed.

### 13.3 Adding a new section to an existing tour

1. Add a `SectionId` literal type to `src/content/tours/types.ts`.
2. Create the section's `.ts` file under
   `src/content/tours/<slug>/<new-section>.ts`.
3. Add it to the `sections` array in the tour's composer.
4. The capability nav at the top updates automatically.

The home page Take Tour form deep-links into a specific section via
URL params, so adding a section won't break the entry flow — it just
shows up as another nav button.

### 13.4 Multi-callout-per-screen

To put 2-5 callouts on a single screenshot, **author multiple
`TourStep` entries with the same `screenshot.src`**. The browser
caches the image after the first step, so subsequent steps swap only
the callout — no visual flicker.

Each step needs a unique `id`. The convention is to suffix:
`workspace-overview`, `workspace-actions`, `workspace-priorities` for
the 3 callouts on the workspace screen.

### 13.5 Changing the callout visual style

`Callout.tsx` constants near the top control the visual language
(`BRAND_BLUE`, `BOX_SHADOW`, `BOX_BORDER_WIDTH_PX`, etc.). Avoid
restyling the pointer geometry without re-reading
[§6](#6-the-12-position-pointer-system) — the pointer SVG sizing,
position, and stroke must coordinate with the box border so the
callout reads as a single shape.

### 13.6 Changing the engine — extra-careful zones

These are areas where intuition might lead you astray.

- **`geometry.ts → resolveBox()`** — the percent-of-self transform
  approach is what makes pointer placement exact regardless of box
  height. **Don't reintroduce HEIGHT_ESTIMATE-based math here.** If
  you need to change placement logic, keep the transform-based
  arithmetic.
- **`Callout.tsx → PointerArrow`** — the SVG's `viewBox`,
  `position-relative-to-box`, and the polygon `points` all coordinate.
  When `pointerEdge: "left"`, the arrow's right edge sits flush with
  the box's left edge; the polygon's tip points further left. Mirror
  for the other edges. Changing one without the others produces visible
  seams between box border and arrow.
- **`TourShell.tsx` URL state** — uses `router.replace`, never `push`.
  Back/forward should jump pages, not steps. The keyboard handler
  always calls the `goPrev`/`goNext` callbacks (which then call
  `writeUrl`); don't bypass.
- **`TourShell.tsx` telemetry refs** — `lastNavTimestamp`,
  `lastSectionId`, `lastStepKey`, `nextNavVia` carry per-render state
  for the analytics events. The `tour.step_view` effect reads them
  from refs (not from React state) to avoid extra renders. If you
  change the navigation handlers, set `nextNavVia.current` *before*
  `writeUrl` so the upcoming step view is tagged with the right `via`.

### 13.7 Adding interstitial steps

Just set `interstitial: true` on a `TourStep`. The screenshot is used
as a dimmed/blurred backdrop. The callout's `body` supports `\n\n` for
paragraph breaks. Add a `cta` field for a button (e.g., outro Get
access).

Interstitials don't render the FeedbackWidget — by design. If you want
feedback on an interstitial, you'd have to extend `InterstitialOverlay`.

### 13.8 Adding a new analytics event

Two-step process:

1. **Server-side allowlist** — `src/app/api/tour-event/route.ts`
   currently allows any event name starting with `tour.` and ≤ 64
   chars. To add a non-`tour.` prefix, update the validation.
2. **Client-side fire** — call `trackTourEvent(name, properties)` from
   wherever the event originates. Use `trackTourEventOnUnload` for
   `beforeunload` / `visibilitychange` paths to leverage `sendBeacon`.

Keep property values short strings (≤ 1000 chars per value) and the
total properties ≤ 20 per event. The route validates and silently
drops anything beyond.

### 13.9 Adding an env var

If you add an env var the engine uses, also:
- Add it to the [§12 env-vars table](#12-deployment--infrastructure)
  in this doc.
- Document fallback behavior in the code (warn? throw? silent default?).
- Set it in production via Azure Portal Configuration before deploying
  code that requires it.

### 13.10 Things to avoid

- **Don't put a chatbot in the lower-left**. The product feedback model
  here is *inline, contextual, and on-demand*. The user has been
  explicit on this.
- **Don't auto-advance steps on a timer**. The user should always
  control pacing.
- **Don't add a step indicator that auto-grows with content** — the
  current "N of M" counter inside each callout is the only visible
  progress indicator. Adding a top progress bar fights for attention
  with the actual content.
- **Don't ship raw retina captures (5120×2880)** as web assets.
  Always run them through `process-tour-screenshot.mjs` to get the
  2400×1350 / WebP / SANDBOX-masked output.

---

## 14. Next steps & future enhancements

Pulled forward from earlier conversations + the spec. Sorted
roughly by effort vs value.

### 14.1 Ready to do (small)

- **`tour.cta_click` event** — wrap the CTA buttons in
  `Callout.tsx` and `InterstitialOverlay.tsx` so the click is captured
  before navigation. Closes the Tier 2 tracking gap. ~30 min.
- **`tour.return_visit` event** — detect the `tour_session` cookie on
  page load and fire once per session if present. ~30 min.
- **Outro CTA → access-request attribution** — pass the `tour_session`
  cookie through to `/api/early-release` when source is `get-access`,
  and persist alongside the access-request row. Lets you compute
  "tour completed → access requested" conversion definitively. ~1 hour.
- **Plausible integration** — script tag + 4 marketing events
  (Tour Started, Tour Completed, Tour Abandoned at Section,
  Tour CTA Click). Spec'd in
  [`walkthrough-app-tracking.md`](../../spaarke-website-wt-analytics-platform/projects/website-analytics-platform/walkthrough-app-tracking.md).
  ~3 hours, owned by the analytics-platform team.
- **Clarity integration** — script tag + custom tags
  (`tour_section`, `tour_step`, `tour_status`) + privacy disclosure
  update. Mask the FeedbackWidget textarea. ~3 hours.

### 14.2 Bigger pieces (medium)

- **Workbooks / dashboards in App Insights** — funnel, dwell
  distribution, feedback sentiment by step, email send health. Owned
  by the analytics-platform team. ~1 day.
- **Alert thresholds** — e.g., 3+ thumbs-down on a single step in 24
  hours → email the content team to flag for review. ~2 hours.
- **Hotspots** (Phase 3 of original spec) — clickable rectangular
  regions on a screenshot that advance to the next step or branch to
  a specific step. Useful for "click the New Matter button →
  screenshot swaps to the create-matter wizard". Engine spec is
  already in `spec.md`; not yet implemented. ~1 day.
- **Sitewide feedback widget** — the inline info-on-demand pattern
  (NOT a chatbot). Could share infrastructure with the tour feedback
  widget. Wait for tour-feedback to accumulate real data first. ~1 day.

### 14.3 Larger / strategic

- **Mobile experience** — the tour is currently hidden below the `lg:`
  breakpoint. Designing a mobile flow needs decisions: vertical
  scroll-through with one callout per screen? Horizontal swipe
  carousel? A simplified "highlights" version? Pull data first
  (Plausible UA reports + the sized-of-mobile-blocked-traffic) before
  designing. ~1-2 days once direction is set.
- **Second tour ("Feature Highlights")** — a shorter, themed tour
  variant. The engine supports multiple slugs already. Content cost is
  the dominant work; engine cost is zero. The home Take Tour modal
  could let visitors choose between tour variants. ~1 day content +
  small UI work.
- **Animations / transitions polish** — soft fade between callouts in
  multi-callout-per-screen sequences, an animated reveal for the
  pointer, etc. Optional; tour works fine without. ~1 day.
- **Editorial pass** — fresh review of all 100 step callouts after a
  few weeks of real engagement data + Clarity recordings. Iterate on
  copy, anchor placement, and screenshot crops based on what's
  actually working. Continuous.

### 14.4 Deferred decisions (from `spec.md` §11)

- **Tour completion CTA** — currently the outro card has "Get access".
  Could expand to a "Take another tour" picker once a second tour
  exists.
- **Branching tours** — the `Hotspot` action model supports `go-to`
  for branching, but the linear `section + step` URL state doesn't
  naturally branch. Reconsider in Phase 3 when hotspots ship.
- **Modal vs route from Take Tour** — currently the home form
  redirects to `/tour/full-walkthrough`. Decided ✅ (was deferred at
  the start).

---

## 15. References

| Doc | What it covers |
|---|---|
| [`spec.md`](../projects/product-walkthrough-app/spec.md) | Original Phase 1 design proposal. Some sections are now historical (e.g., the original 4-side pointer system, deferred decisions that have been made). Cross-reference but treat this document as authoritative for as-built behavior. |
| [`tasks/`](../projects/product-walkthrough-app/tasks/) | Task files used to drive the multi-agent build of the walkthrough. Useful for understanding how the system was assembled, less useful for ongoing reference. |
| [`SITE-SPECIFICATION.md`](./SITE-SPECIFICATION.md) | Site-wide architecture spec. The §12 deploy regression playbook covers both the current 100 MB Functions limit and the older SVG base64 issue. |
| [`spaarke-website-wt-analytics-platform/projects/website-analytics-platform/walkthrough-app-tracking.md`](../../spaarke-website-wt-analytics-platform/projects/website-analytics-platform/walkthrough-app-tracking.md) | Dual-tool analytics architecture (App Insights + Plausible + Clarity) for the walkthrough. Authoritative for analytics; supersedes any analytics references in `spec.md`. |
| [Azure SWA Issue #1034](https://github.com/Azure/static-web-apps/issues/1034) | Source for the 100 MB Functions limit and the `api_build_command` workaround. |

### Key code paths (quick reference)

| Concern | File |
|---|---|
| Tour route | `src/app/tour/[slug]/page.tsx` |
| URL state + keyboard + tracking + mobile guard | `src/components/tour/TourShell.tsx` |
| Standard callout | `src/components/tour/Callout.tsx` |
| Interstitial overlay | `src/components/tour/InterstitialOverlay.tsx` |
| Box placement math | `src/components/tour/geometry.ts` |
| Feedback widget | `src/components/tour/FeedbackWidget.tsx` |
| Feedback API | `src/app/api/tour-feedback/route.ts` |
| Analytics relay | `src/app/api/tour-event/route.ts` |
| Tracking client wrapper | `src/lib/tour-tracking.ts` |
| Lead capture (Take Tour) | `src/app/api/early-release/route.ts` |
| Email notifications | `src/lib/email.ts` |
| Azure Tables helpers | `src/lib/storage.ts` |
| Screenshot processor | `scripts/process-tour-screenshot.mjs` |
| Tour data registry | `src/content/tours/registry.ts` |
| Tour types | `src/content/tours/types.ts` |
| Section content | `src/content/tours/full-walkthrough/<section>.ts` |

---

*This document was last updated alongside PR #11 (May 7, 2026), which
shipped the Tier 1 App Insights tracking events and the early-release
email observability fix.*
