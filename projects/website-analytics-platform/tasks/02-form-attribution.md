# T02 — Form integration: read attribution, persist server-side, fire submit events

**Phase**: 0
**Wave**: 2
**Dependencies**: T01

## Goal

For every form on the site that captures a lead or contact, do three
things on successful submit:

1. Include the first-touch attribution snapshot + current-session
   context in the request body.
2. Persist that attribution alongside the lead in Azure Tables (so
   we can query "leads that originated from Google" historically).
3. Fire a Plausible `* Submit` custom event with the same attribution
   props, so Plausible's dashboard can segment conversions by source.

Forms in scope: TakeTourCTAs, PlatformHeroCTAs, ContactForm,
DemoRequestForm. (EarlyReleaseForm if it's still wired anywhere —
check.)

## Reads (required context)

- `projects/website-analytics-platform/spec.md` §4.2 (events),
  §5 (attribution).
- `src/lib/attribution.ts` (T01 output) — `submissionProps()` is the
  helper to call.
- `src/lib/analytics.ts` (T01 output) — `track()` helper.
- Each form component in scope:
  - `src/components/TakeTourCTAs.tsx`
  - `src/components/PlatformHeroCTAs.tsx`
  - `src/components/ContactForm.tsx`
  - `src/components/DemoRequestForm.tsx`
- Each API route in scope:
  - `src/app/api/early-release/route.ts`
  - `src/app/api/contact/route.ts`
  - `src/app/api/registration/demo-request/route.ts`

## Deliverables

### 1. Each form: read attribution + emit Plausible event on success

Pattern, applied identically to all four forms:

```tsx
// at the top of the file
import { submissionProps } from "@/lib/attribution";
import { track } from "@/lib/analytics";

// inside handleSubmit, AFTER captcha and AFTER the fetch but BEFORE
// any router.push or status-success state change:

const attribution = submissionProps();

const res = await fetch("/api/...", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...existingFields,
    captchaToken,
    attribution,            // NEW — server may persist
  }),
});

// ...existing success/error handling unchanged...

if (res.ok && data.ok) {
  track("Take Tour Submit", attribution);   // event-name varies per form
  // ...existing post-success behavior (router.push etc.)...
}
```

Per-form event name mapping:
- `TakeTourCTAs` → `Take Tour Submit`
- `PlatformHeroCTAs` → `Get Access Submit`
- `ContactForm` → `Contact Submit`
- `DemoRequestForm` → `Demo Request Submit`

Don't track on validation/captcha errors — only on actual successful
submission.

### 2. API routes: accept and persist attribution

For each of the three route handlers, accept an optional
`attribution` field on the request body and persist it to the Azure
Table entity.

#### `/api/early-release/route.ts`

In the body parse:
```ts
const attribution = (body.attribution ?? null) as Attribution | null;
```

Where `Attribution` is the same type as in `src/lib/attribution.ts`
(import the type).

When creating the Azure Table entity, spread attribution fields:

```ts
await client.createEntity({
  partitionKey: "signup",
  rowKey,
  name,
  email,
  source,
  ipHash,
  signedUpAt: new Date().toISOString(),
  // Attribution (optional — defaults to empty string when not provided
  // so column shape is stable):
  entry_referrer: attribution?.entry_referrer ?? "",
  entry_landing: attribution?.entry_landing ?? "",
  first_visit_at: attribution?.first_visit_at ?? "",
  ai_source: attribution?.ai_source ?? "",
  utm_source: attribution?.utm_source ?? "",
  utm_medium: attribution?.utm_medium ?? "",
  utm_campaign: attribution?.utm_campaign ?? "",
});
```

#### `/api/contact/route.ts`

Same pattern. Use `saveContactSubmission` in `src/lib/storage.ts` —
extend its signature to accept attribution and pass it through to
`client.createEntity`.

#### `/api/registration/demo-request/route.ts`

Same pattern. Add to that route's storage call.

### 3. Extend `Attribution` type usage

`src/lib/attribution.ts` exports `Attribution`. Import it in each
route handler that uses it:

```ts
import type { Attribution } from "@/lib/attribution";
```

If `attribution.ts` doesn't export the type today (T01 declares it
internally), expose it:

```ts
export type Attribution = { ... };  // in attribution.ts
```

Verify T01 already exports — if not, that's a one-line fix here.

### 4. App Insights tracking — extend existing `trackEvent` calls

The existing `early_release.success` event in
`/api/early-release/route.ts` already includes `email` and `source`.
Extend with attribution where present:

```ts
trackEvent("early_release.success", {
  email: email.replace(/@.*/, "@***"),
  source,
  entry_referrer: attribution?.entry_referrer ?? "",
  ai_source: attribution?.ai_source ?? "",
  // Don't include first_visit_at, utm_*, etc. — Plausible already
  // has the full picture; App Insights captures the most-used dims
  // for cross-system queries.
});
```

Same for `/api/contact` `contact.success` and the demo-request
event.

## Acceptance criteria

- `npm run typecheck` passes.
- All four forms send an `attribution` field in the request body on
  submit.
- All three API routes accept the `attribution` field, persist it to
  Azure Table Storage, and include selected dimensions in the App
  Insights success event.
- Plausible `* Submit` events fire on successful submit (one per
  form).
- Verified by `npm run dev` + a test submission to one of the
  endpoints (use `/contact` or `/access-request` — they don't need
  CAPTCHA in dev). Inspect the network tab: request body includes
  `attribution: { entry_referrer: "...", ... }`.
- Storage table inspection (Azure Storage Explorer or
  `az storage entity show`): one row per submission with the new
  fields populated.
- No existing functionality regressed — existing fields persist and
  existing telemetry events still fire.

## Out of scope

- Other custom events (CTA clicks, tour, article reads, outbound) —
  T03.
- AI source detection (the `ai_source` field comes from T04; T02
  just passes through whatever `submissionProps()` returns).
- Privacy policy disclosure of the new persisted fields — T05.

## Prompt

> Phase 0, T02 of the Spaarke website analytics platform.
>
> Read `projects/website-analytics-platform/spec.md` §4.2 + §5,
> `projects/website-analytics-platform/tasks/02-form-attribution.md`
> (this file), and the analytics + attribution libs from T01 at
> `src/lib/analytics.ts` + `src/lib/attribution.ts`.
>
> Execute T02: thread first-touch attribution through every form's
> submit path and every API route's storage call.
>
> Forms touched: TakeTourCTAs, PlatformHeroCTAs, ContactForm,
> DemoRequestForm. Each adds `attribution = submissionProps()` to
> the request body and fires its corresponding Plausible event on
> successful submit.
>
> API routes touched: `/api/early-release`, `/api/contact`,
> `/api/registration/demo-request`. Each accepts the optional
> `attribution` field, spreads its keys onto the Azure Table entity,
> and adds selected dimensions to the existing App Insights success
> event.
>
> Run `npm run typecheck`. Verify in `npm run dev` that one
> submission writes a row including `entry_referrer`, `entry_landing`,
> etc. (Use `/contact` since it doesn't require CAPTCHA in dev with
> the empty-secret fallback.)
