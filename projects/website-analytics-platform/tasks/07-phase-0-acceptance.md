# T07 — Phase 0 acceptance

**Phase**: 0
**Wave**: 5
**Dependencies**: T01–T06 complete

## Goal

End-to-end verification that Phase 0 actually delivers what spec §9
promised. Identify and fix small issues; flag larger ones for
follow-up.

## Procedure

### 1. Static checks

```bash
npm run typecheck
npm run lint        # if configured
```

Both pass clean.

### 2. Local dev verification

```bash
npm run dev
```

Open the site at `http://localhost:3000`:

- [ ] Plausible script tag loads (Network tab — request to
      `plausible.io/js/pa-of04A4p4E27LEiVbf7ChI.js` returns 200,
      OR is blocked by an ad-blocker which is normal).
- [ ] In console: `typeof window.plausible === "function"` is `true`.
- [ ] After visiting `/`, in DevTools Application →
      Local Storage → `localhost:3000`, the key
      `spk_attribution_v1` is present with valid JSON containing
      `entry_referrer`, `entry_landing`, `first_visit_at`.
- [ ] Session Storage has `spk_session` with `pages_viewed: 1`.
- [ ] Microsoft Clarity script either loads OR no-ops if env var
      isn't set in `.env.local` (intentional dev behavior).

### 3. Form-submission attribution check

Submit `/contact` form (no captcha required in dev with empty
secret):

- [ ] Network tab: POST to `/api/contact` includes `attribution`
      object in body.
- [ ] Server returns 200 `{"ok":true}`.
- [ ] Console: `Contact Submit` appears in Plausible queue
      (`window.plausible.q` if script wasn't loaded, OR fired if
      script loaded).
- [ ] Optional: query the `ContactSubmissions` Azure Table — the new
      row should include `entry_referrer`, `entry_landing`, etc.
      columns.

### 4. AI source detection

In DevTools console on a fresh tab:

```js
// Override referrer for testing
Object.defineProperty(document, "referrer", {
  value: "https://www.perplexity.ai/search/test",
  configurable: true,
});
// Clear the existing attribution and reload
localStorage.removeItem("spk_attribution_v1");
localStorage.removeItem("spk_attribution_expires_at");
location.reload();
```

After reload:

- [ ] `localStorage.getItem("spk_attribution_v1")` includes
      `ai_source: "perplexity"`.
- [ ] `window.plausible.q` (or recent fired events) includes the
      `AI Source Visit` event with `ai_source: "perplexity"`.

### 5. AI crawler middleware check

```bash
curl -H "User-Agent: PerplexityBot/1.0 (https://www.perplexity.ai/perplexitybot)" http://localhost:3000/why-spaarke
```

Returns 200. Check the dev console / server logs:

- [ ] A log entry indicates AI crawler detected (App Insights call
      may not show in dev — confirm `trackAiCrawler` was reached
      via console.log in dev or by adding a temp log).

For production verification (after deploy), use the same curl
against `https://www.spaarke.com` and query App Insights:
```
customEvents
| where timestamp > ago(1h)
| where name == "ai_crawler.visit"
```

### 6. Custom events spot-check

Without doing a full audit, click through one of each event-emitting
control:

- [ ] Click a "Get access" button — `CTA Click — Get Access` event
      fires (check `window.plausible.q` or Plausible Live View).
- [ ] Click a "See Platform" CTA — `CTA Click — See Platform` event.
- [ ] Click a LinkedIn outbound link — `Outbound Click — LinkedIn`
      event.
- [ ] If the tour engine is live: navigate through tour sections —
      `Tour Section Enter` events fire.
- [ ] Open a blog post, scroll to ≥75%, dwell 45s — `Article Read`
      event fires.

### 7. Privacy policy

Visit `/privacy`:

- [ ] New "Analytics and Telemetry" section is present.
- [ ] Plausible, Microsoft Clarity, and the `spk_attribution_v1`
      localStorage are all named.
- [ ] "Last updated" date is current.

### 8. Production deploy verification

After the Phase 0 work merges and SWA finishes deploying:

```bash
curl -s https://www.spaarke.com/ | grep -E "plausible|clarity"
```

- [ ] Plausible script reference present in HTML.
- [ ] Clarity inline script present (assuming
      `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set in SWA app settings;
      if not, missing is correct).
- [ ] Plausible Live View dashboard
      (<https://plausible.io/spaarke.com/?period=realtime>) shows
      activity from your test visits.

If `NEXT_PUBLIC_CLARITY_PROJECT_ID` is missing in SWA app settings,
flag for the user to set it via:
```
az staticwebapp appsettings set -n swa-spaarke-website -g rg-spaarke-website \
  --setting-names NEXT_PUBLIC_CLARITY_PROJECT_ID=<id-from-clarity.microsoft.com>
```

### 9. File audit

```bash
find c:/code_files/spaarke-website/src/components/analytics -type f
find c:/code_files/spaarke-website/src/lib -name "analytics.ts" -o -name "attribution.ts" -o -name "ai-bots.ts"
find c:/code_files/spaarke-website/src/types -name "plausible.d.ts"
ls c:/code_files/spaarke-website/middleware.ts c:/code_files/spaarke-website/src/content/analytics/
ls c:/code_files/spaarke-website/projects/website-analytics-platform/readouts c:/code_files/spaarke-website/projects/website-analytics-platform/monitoring
```

All expected files present? Cross-check the file-touch matrix in
`tasks/README.md`.

## Deliverables

A short report (≤ 250 words) summarizing:

- Each numbered check above: pass / fail.
- Any small fixes made in place (typos, missing imports, off-by-one).
- Any larger issues warranting follow-up tasks.
- Final confidence on Phase 0 readiness.
- Reminders to the user:
  - Set `NEXT_PUBLIC_CLARITY_PROJECT_ID` in SWA app settings (if not
    yet done).
  - Activate Plausible from trial → paid plan when trial ends.
  - Schedule the first weekly readout for next Monday.

## Out of scope

- New event additions beyond spec §4.2.
- Deep performance audit of analytics scripts.
- Building the internal `/internal/analytics` dashboard (Phase 3).

## Prompt

> Phase 0 acceptance for the website analytics platform.
>
> Execute the steps in
> `projects/website-analytics-platform/tasks/07-phase-0-acceptance.md`
> in order: typecheck/lint, dev-server smoke (Plausible script
> loads, attribution localStorage populates, custom events fire),
> form submission attribution, AI source detection (override
> document.referrer in DevTools), AI crawler middleware (curl with
> a bot UA), custom events spot-check, privacy policy verification,
> production deploy verification (after merge + deploy completes),
> file audit.
>
> Fix small issues in place (one-line corrections, missing imports,
> typo fixes). Document larger issues but don't try to fix them
> here.
>
> Report ≤ 250 words: pass/fail by check, fixes you made, follow-ups
> needed, and the user reminders (Clarity project ID env var,
> Plausible plan activation, first weekly readout schedule).
