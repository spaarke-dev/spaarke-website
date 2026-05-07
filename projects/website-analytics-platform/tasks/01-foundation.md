# T01 — Foundation: Plausible + Clarity scripts, analytics + attribution libs

**Phase**: 0
**Wave**: 1 (sequential, blocks all other tasks)
**Dependencies**: none

## Goal

Install Plausible and Microsoft Clarity, create the typed event
helper (`analytics.ts`), the attribution lib (`attribution.ts`), and
the bootstrap component that captures first-touch attribution on
first page load. After this task, `plausible('Event Name', { props })`
calls work site-wide and the localStorage attribution snapshot
populates on first visit.

## Reads (required context)

- `projects/website-analytics-platform/spec.md` §3 (architecture),
  §4 (instrumentation surface), §5 (first-touch attribution).
- `src/app/layout.tsx` — current shape of the RootLayout.
- `docs/SITE-SPECIFICATION.md` §3 (layout structure) for the
  ThemeProvider / SiteHeader / SiteFooter wrapping convention.
- The Plausible script tag the user supplied:
  ```html
  <script async src="https://plausible.io/js/pa-of04A4p4E27LEiVbf7ChI.js"></script>
  <script>
    window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
    plausible.init()
  </script>
  ```
  The `pa-of04A4p4E27LEiVbf7ChI.js` is a unique Plausible site
  identifier — keep it as-is.

## Deliverables

### 1. `src/components/analytics/PlausibleScript.tsx`

Server component that emits the Plausible script tags in the page
head. Uses Next.js `<Script>` from `next/script`:

```tsx
import Script from "next/script";

export function PlausibleScript() {
  return (
    <>
      <Script
        async
        src="https://plausible.io/js/pa-of04A4p4E27LEiVbf7ChI.js"
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`
          window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
          plausible.init()
        `}
      </Script>
    </>
  );
}
```

### 2. `src/components/analytics/ClarityScript.tsx`

Server component that emits the Clarity tag. **The Clarity project
ID is supplied via `NEXT_PUBLIC_CLARITY_PROJECT_ID`** — read at build
time. If unset, render nothing (gracefully no-op in dev).

```tsx
import Script from "next/script";

export function ClarityScript() {
  const id = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!id) return null;
  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${id}");
      `}
    </Script>
  );
}
```

The Clarity project ID is registered separately on
clarity.microsoft.com. **Document this in the prompt response** so
the user knows to register and supply the env var.

### 3. `src/types/plausible.d.ts`

Typed global for the `plausible()` function:

```ts
declare global {
  interface Window {
    plausible?: PlausibleFn & { q?: unknown[]; o?: Record<string, unknown> };
  }
}

export type PlausibleEventName =
  | "Take Tour Submit"
  | "Get Access Submit"
  | "Demo Request Submit"
  | "Contact Submit"
  | "Tour Section Enter"
  | "Tour Section Complete"
  | "Tour Complete"
  | "Article Read"
  | "CTA Click — Get Access"
  | "CTA Click — Contact Us"
  | "CTA Click — See Platform"
  | "Outbound Click — LinkedIn"
  | "AI Source Visit";

export type PlausibleProps = Record<string, string | number | boolean>;

export type PlausibleFn = (
  event: PlausibleEventName,
  options?: { props?: PlausibleProps; callback?: () => void },
) => void;

export {};
```

This locks the event-name set so a typo won't ship undetected.

### 4. `src/lib/analytics.ts`

Typed wrapper that gracefully no-ops if Plausible hasn't loaded
(e.g. in dev without the script, or when an ad-blocker blocks it):

```ts
import type { PlausibleEventName, PlausibleProps } from "@/types/plausible";

export function track(event: PlausibleEventName, props?: PlausibleProps): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  try {
    window.plausible(event, props ? { props } : undefined);
  } catch {
    // Swallow — analytics must never break user flow.
  }
}
```

### 5. `src/lib/attribution.ts`

The first-touch attribution lib per spec §5. Two responsibilities:

(a) capture on first visit (called by AttributionBootstrap),
(b) read for forms/events (called from form-submit handlers).

```ts
const STORAGE_KEY = "spk_attribution_v1";
const EXPIRES_KEY = "spk_attribution_expires_at";
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const SESSION_KEY = "spk_session";

export type Attribution = {
  entry_referrer: string;
  entry_landing: string;
  first_visit_at: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ai_source?: string;
};

export type SessionInfo = {
  session_started_at: string;
  pages_viewed: number;
};

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const expires = Number(localStorage.getItem(EXPIRES_KEY) ?? 0);
    if (expires && Date.now() > expires) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRES_KEY);
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

export function ensureAttribution(detectAiSource: (referrer: string) => string | undefined): Attribution {
  const existing = readAttribution();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {
    entry_referrer: document.referrer || "",
    entry_landing: window.location.pathname,
    first_visit_at: new Date().toISOString(),
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    ai_source: detectAiSource(document.referrer),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    localStorage.setItem(EXPIRES_KEY, String(Date.now() + TTL_MS));
  } catch {
    // localStorage unavailable (private mode, quota) — return ephemeral.
  }
  return attribution;
}

export function getSession(): SessionInfo {
  // sessionStorage scope: a single tab/session.
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as SessionInfo;
    } catch {
      // fallthrough
    }
  }
  const fresh: SessionInfo = {
    session_started_at: new Date().toISOString(),
    pages_viewed: 0,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
  return fresh;
}

export function recordPageView(): void {
  if (typeof window === "undefined") return;
  const s = getSession();
  s.pages_viewed += 1;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

/** Convenience: assemble all the props a form submit needs. */
export function submissionProps(): Record<string, string | number> {
  const attr = readAttribution();
  const session = typeof window !== "undefined" ? getSession() : null;
  return {
    entry_referrer: attr?.entry_referrer ?? "",
    entry_landing: attr?.entry_landing ?? "",
    first_visit_at: attr?.first_visit_at ?? "",
    ai_source: attr?.ai_source ?? "",
    utm_source: attr?.utm_source ?? "",
    utm_medium: attr?.utm_medium ?? "",
    utm_campaign: attr?.utm_campaign ?? "",
    current_page: typeof window !== "undefined" ? window.location.pathname : "",
    pages_viewed: session?.pages_viewed ?? 1,
  };
}
```

### 6. `src/components/analytics/AttributionBootstrap.tsx`

Tiny client component that runs `ensureAttribution()` and
`recordPageView()` on mount. Returns `null`. Imports `track()` for
the AI Source Visit event.

```tsx
"use client";

import { useEffect } from "react";
import { ensureAttribution, recordPageView } from "@/lib/attribution";
import { track } from "@/lib/analytics";
// AI source detection lives in T04; for T01 use a stub that always returns undefined.
// AttributionBootstrap will be updated again in T04 to wire the real detector.
function detectAiSource(_referrer: string): string | undefined {
  return undefined;
}

export function AttributionBootstrap() {
  useEffect(() => {
    const attr = ensureAttribution(detectAiSource);
    recordPageView();
    if (attr.ai_source) {
      track("AI Source Visit", { ai_source: attr.ai_source });
    }
  }, []);
  return null;
}
```

T04 will replace the `detectAiSource` stub with a real
implementation reading from `src/content/analytics/ai-sources.ts`.
**T01 must leave the stub in place.**

### 7. Wire into `src/app/layout.tsx`

Add the three new imports near the top of the layout component:

```tsx
import { PlausibleScript } from "@/components/analytics/PlausibleScript";
import { ClarityScript } from "@/components/analytics/ClarityScript";
import { AttributionBootstrap } from "@/components/analytics/AttributionBootstrap";
```

And include them in the `<body>` (NOT in `<head>` — Next handles
strategy via `<Script>`):

```tsx
<body ...>
  <PlausibleScript />
  <ClarityScript />
  <AttributionBootstrap />
  ...existing children...
</body>
```

Render order doesn't matter — they're all `null` (Bootstrap) or
script tags.

### 8. `.env.example` (or equivalent)

Document the new env var:

```
# Microsoft Clarity project ID (register at clarity.microsoft.com,
# then set this to the project ID, e.g. "abc123xyz"). Without it,
# Clarity is skipped (dev/preview).
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

If `.env.example` doesn't exist, create it. If it does, append.

## Acceptance criteria

- `npm run typecheck` passes.
- `npm run dev` starts cleanly. Visit `/` and inspect:
  - `window.plausible` is a function in the console.
  - `localStorage.getItem("spk_attribution_v1")` returns a JSON
    string after first page load with `entry_referrer`,
    `entry_landing`, `first_visit_at` populated.
  - `sessionStorage.getItem("spk_session")` returns a JSON string
    with `pages_viewed: 1`.
- All seven new files exist; only `src/app/layout.tsx` and
  `.env.example` are modified.
- The `track()` helper is importable from anywhere via
  `@/lib/analytics`.
- The `detectAiSource` stub in `AttributionBootstrap.tsx` returns
  `undefined` for now (T04 replaces with the real detector).

## Out of scope

- Adding `track()` calls to specific components — that's T02–T04.
- AI source list (`src/content/analytics/ai-sources.ts`) — that's
  T04. The stub in `AttributionBootstrap.tsx` is intentional.
- Privacy policy update — T05.
- Server-side bot middleware — T04.

## Prompt

> You are starting Phase 0 of the Spaarke website analytics platform
> at `c:\code_files\spaarke-website\projects\website-analytics-platform`.
>
> Read `projects/website-analytics-platform/spec.md` §3, §4, §5 and
> `projects/website-analytics-platform/tasks/01-foundation.md` (this
> file). Then read `src/app/layout.tsx` to understand the current
> wrapping order.
>
> Execute T01: create the seven new files specified, modify
> `src/app/layout.tsx` to include `<PlausibleScript />`,
> `<ClarityScript />`, and `<AttributionBootstrap />` in the body, and
> add `NEXT_PUBLIC_CLARITY_PROJECT_ID` to `.env.example`.
>
> Use the Plausible script verbatim from the spec — the
> `pa-of04A4p4E27LEiVbf7ChI.js` site identifier is correct. The
> `detectAiSource` function in `AttributionBootstrap.tsx` must be a
> stub returning `undefined` — T04 replaces it.
>
> Run `npm run typecheck` before reporting done. After typecheck
> passes, briefly verify in `npm run dev` that visiting the home
> page populates `localStorage.getItem("spk_attribution_v1")`.
>
> When you report done, **remind the user**:
> 1. They need to register their site at https://clarity.microsoft.com
>    and set `NEXT_PUBLIC_CLARITY_PROJECT_ID` in their local
>    `.env.local` AND in Azure SWA app settings.
> 2. Without the env var Clarity is skipped silently.
