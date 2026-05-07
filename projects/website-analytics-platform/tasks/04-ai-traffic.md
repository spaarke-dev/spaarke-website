# T04 — AI traffic detection: referrers + crawler bot logging

**Phase**: 0
**Wave**: 3 (parallel with T03, T06)
**Dependencies**: T01

## Goal

Two pieces of AI-traffic instrumentation:

1. **Human visits via AI products** (Perplexity, ChatGPT, Claude.ai,
   Bing AI, Gemini, etc.) — detected client-side from `document.referrer`,
   tagged into the existing `Attribution` snapshot, and reported via
   the `AI Source Visit` Plausible event.

2. **AI crawler bots** (PerplexityBot, ClaudeBot, GPTBot,
   Google-Extended, etc.) — detected server-side via user-agent
   parsing in Next.js middleware, logged to App Insights as
   `ai_crawler.visit`.

Both shipped together in this task because they share a definition
file (`src/content/analytics/ai-sources.ts`) and reasoning.

## Reads (required context)

- `projects/website-analytics-platform/spec.md` §6 (AI traffic
  detection).
- `src/lib/attribution.ts` and
  `src/components/analytics/AttributionBootstrap.tsx` (T01) — the
  AttributionBootstrap currently has a stubbed `detectAiSource`;
  T04 replaces it.
- `src/lib/logger.ts` — extend with `trackAiCrawler` helper.
- Next.js middleware docs (file convention: `middleware.ts` at the
  project root or `src/`).

## Deliverables

### 1. `src/content/analytics/ai-sources.ts`

The curated list of known AI source domains and their canonical
slugs. Used by both client-side referrer detection and (a derived
form) by server-side bot detection.

```ts
/**
 * Known AI products that drive referral traffic when a user clicks
 * a citation. Domains are matched as substrings of `referrer.host`
 * (case-insensitive). Add new products as they emerge — the source
 * field becomes a Plausible custom dimension, so consistent slugs
 * matter.
 */
export type AiSource = {
  /** Canonical slug used in event props. Lowercase, kebab-case. */
  slug: string;
  /** Display label for human-readable contexts. */
  label: string;
  /** Substring(s) tested against the referrer host. */
  hosts: readonly string[];
};

export const AI_SOURCES: readonly AiSource[] = [
  { slug: "perplexity",   label: "Perplexity",       hosts: ["perplexity.ai"] },
  { slug: "chatgpt",      label: "ChatGPT",          hosts: ["chat.openai.com", "chatgpt.com"] },
  { slug: "claude",       label: "Claude",           hosts: ["claude.ai"] },
  { slug: "bing-ai",      label: "Bing AI / Copilot", hosts: ["copilot.microsoft.com", "edgeservices.bing.com", "bing.com/chat"] },
  { slug: "gemini",       label: "Google Gemini",    hosts: ["gemini.google.com", "bard.google.com"] },
  { slug: "you",          label: "You.com",          hosts: ["you.com"] },
  { slug: "kagi",         label: "Kagi",             hosts: ["kagi.com"] },
  { slug: "phind",        label: "Phind",            hosts: ["phind.com"] },
  { slug: "duckduckgo-ai", label: "DuckDuckGo AI",   hosts: ["duck.ai", "duckduckgo.com/ai"] },
];

/** Detect an AI source from a referrer URL. Returns the slug or undefined. */
export function detectAiSource(referrer: string): string | undefined {
  if (!referrer) return undefined;
  let host = "";
  try {
    host = new URL(referrer).host.toLowerCase();
  } catch {
    return undefined;
  }
  for (const src of AI_SOURCES) {
    if (src.hosts.some(h => host.includes(h.toLowerCase()))) {
      return src.slug;
    }
  }
  return undefined;
}
```

### 2. Update `src/components/analytics/AttributionBootstrap.tsx`

T01 created this with a stubbed `detectAiSource`. Replace the stub:

```tsx
"use client";

import { useEffect } from "react";
import { ensureAttribution, recordPageView } from "@/lib/attribution";
import { detectAiSource } from "@/content/analytics/ai-sources";
import { track } from "@/lib/analytics";

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

The function signature for `ensureAttribution` was set up in T01 to
accept the detector as a parameter — keeping coupling thin.

### 3. `src/lib/ai-bots.ts`

Server-side bot detection from user-agent strings. Mirror the client
list in spirit, but bot UAs are different from referrer hosts:

```ts
export type AiBot = {
  slug: string;
  label: string;
  /** Substrings to match in the User-Agent header, case-insensitive. */
  patterns: readonly string[];
};

/**
 * Known AI crawler bots. Update as new ones emerge.
 * Sources: openai.com/gptbot, anthropic.com/legal/aupp, etc.
 */
export const AI_BOTS: readonly AiBot[] = [
  { slug: "perplexity-bot",   label: "PerplexityBot",   patterns: ["PerplexityBot", "Perplexity-User"] },
  { slug: "claude-bot",       label: "ClaudeBot",       patterns: ["ClaudeBot", "Claude-Web", "anthropic-ai"] },
  { slug: "openai-gpt-bot",   label: "GPTBot",          patterns: ["GPTBot"] },
  { slug: "openai-chatgpt-user", label: "ChatGPT-User", patterns: ["ChatGPT-User"] },
  { slug: "openai-search-bot", label: "OAI-SearchBot",  patterns: ["OAI-SearchBot"] },
  { slug: "google-extended",  label: "Google-Extended", patterns: ["Google-Extended"] },
  { slug: "bytespider",       label: "Bytespider",      patterns: ["Bytespider"] },
  { slug: "diffbot",          label: "Diffbot",         patterns: ["Diffbot"] },
  { slug: "cohere-ai",        label: "Cohere-AI",       patterns: ["cohere-ai"] },
  { slug: "applebot-extended", label: "Applebot-Extended", patterns: ["Applebot-Extended"] },
];

export function detectAiBot(userAgent: string | null | undefined): string | undefined {
  if (!userAgent) return undefined;
  const ua = userAgent.toLowerCase();
  for (const bot of AI_BOTS) {
    if (bot.patterns.some(p => ua.includes(p.toLowerCase()))) {
      return bot.slug;
    }
  }
  return undefined;
}
```

### 4. `middleware.ts` at project root

Next.js middleware to detect AI crawlers and log to App Insights.
Critical: middleware runs on every request including static files —
keep it minimal.

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detectAiBot } from "@/lib/ai-bots";
import { trackAiCrawler } from "@/lib/logger";

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent");
  const bot = detectAiBot(ua);
  if (bot) {
    // Fire-and-forget — don't block response on telemetry.
    trackAiCrawler({
      bot,
      path: request.nextUrl.pathname,
      // No IP, no full UA stored. Slug-only is enough to aggregate.
    });
  }
  return NextResponse.next();
}

// Match all routes except internal static + API routes Next handles.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|api).*)"],
};
```

The matcher excludes `_next/static`, `_next/image`, `favicon`, and
`/api/*` to keep middleware overhead off pure-static paths and our
own APIs (where we'd be tracking ourselves). Adjust if you find
crawlers hitting paths the matcher excludes.

### 5. Extend `src/lib/logger.ts` with `trackAiCrawler`

Add a small helper that wraps `trackEvent` for the bot-specific
shape:

```ts
export function trackAiCrawler(data: { bot: string; path: string }): void {
  // trackEvent already swallows when AppInsights isn't configured.
  trackEvent("ai_crawler.visit", { bot: data.bot, path: data.path });
}
```

If `trackEvent` already exists in `logger.ts`, just add the
`trackAiCrawler` wrapper. Don't reshape the existing logger.

## Acceptance criteria

- `npm run typecheck` passes.
- `src/content/analytics/ai-sources.ts` exports `detectAiSource()`
  and the `AI_SOURCES` list.
- `src/lib/ai-bots.ts` exports `detectAiBot()` and the `AI_BOTS`
  list.
- `src/components/analytics/AttributionBootstrap.tsx` uses the real
  detector (not the T01 stub).
- `middleware.ts` exists at the project root with the documented
  matcher.
- Verified manually:
  - Setting `document.referrer` to `"https://perplexity.ai/search/..."`
    in dev (via overriding in DevTools or via a test redirect) and
    visiting `/` causes `localStorage.getItem("spk_attribution_v1")`
    to include `ai_source: "perplexity"` and a Plausible
    `AI Source Visit` event to fire.
  - `curl -H "User-Agent: PerplexityBot/1.0" https://www.spaarke.com/`
    (or local equivalent) lands an `ai_crawler.visit` entry in App
    Insights with `bot: "perplexity-bot"`.

The second verification can wait until a deploy lands — flag in the
T05 / T07 acceptance phase.

## Out of scope

- AI citation monitoring (Profound / Athena / DIY) — Phase 2 per
  spec §6.3. T06 lays the manual-prompt scaffold.
- Bot-blocking decisions in `robots.txt`. We track first; blocking
  is a Phase 2 decision once we see crawl patterns.
- Adjusting App Insights queries / dashboards to surface
  `ai_crawler.visit` — covered in the readout templates (T06) and
  Phase 1 readout.

## Prompt

> Phase 0, T04 of the Spaarke website analytics platform.
>
> Read `projects/website-analytics-platform/spec.md` §6 and
> `projects/website-analytics-platform/tasks/04-ai-traffic.md`
> (this file).
>
> Execute T04: create the AI source/bot lists and detectors, replace
> the T01 stub in `AttributionBootstrap.tsx`, add the middleware,
> and extend `logger.ts` with `trackAiCrawler`.
>
> Important: middleware affects every request — keep the matcher
> tight (exclude static files + own APIs) and the bot-detect pure
> (no async work). The work in middleware is just substring matching
> + a fire-and-forget telemetry call.
>
> Run `npm run typecheck`. Spot-check via DevTools:
> override `document.referrer` to a Perplexity URL and verify
> `spk_attribution_v1` ai_source updates and `AI Source Visit` event
> fires.
