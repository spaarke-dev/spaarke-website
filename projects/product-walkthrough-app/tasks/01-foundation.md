# T01 — Foundation: types, registry, route skeleton

**Phase**: 1
**Wave**: 1 (sequential, blocks all of Wave 2)
**Dependencies**: none

## Goal

Lay the foundation that every other Phase 1 task builds on: shared
types, the slug→tour registry, and the `/tour/[slug]` route skeleton.
After this task, parallel work can begin on every component and content
file.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` — entire file. Pay
  particular attention to **§3.3 Data model**, **§3.4 File layout**,
  **§9 SEO posture**.
- `docs/SITE-SPECIFICATION.md` §3 (project routing conventions),
  §4 (design tokens — relevant for the page chrome).
- `next.config.ts` (so you understand the existing Next App Router
  setup; no changes needed here).

## Deliverables

### 1. `src/content/tours/types.ts`

Verbatim from spec §3.3. Exports: `SectionId`, `Tour`, `TourSection`,
`TourStep`, `Screenshot`, `Callout`, `Hotspot`. JSDoc comments on every
exported type matching the spec.

### 2. `src/content/tours/registry.ts`

Single source of truth for slug → Tour mapping. Initial content:

```ts
import type { Tour } from "./types";

/**
 * Registered tours. Tours are added by content tasks (T02e and the
 * Phase 2 author tasks) below the TOURS marker. Each tour is imported
 * from its own file so unused tours are tree-shaken from a given
 * route's bundle.
 */
// TOURS — append new imports + map entries below.

export const TOURS: Record<string, Tour> = {
  // (entries appended by content tasks)
};

export function getTour(slug: string): Tour | undefined {
  return TOURS[slug];
}

export const DEFAULT_TOUR_SLUG = "full-walkthrough";
```

The `// TOURS — append new imports + map entries below.` line is the
documented insertion marker for content tasks. **Keep this comment as-is.**

### 3. `src/app/tour/[slug]/page.tsx` (skeleton)

A minimal placeholder route handler that:
- Reads `params.slug`.
- Looks up the tour in the registry.
- Returns `notFound()` if missing.
- Returns a literal `<main>{tour.title}</main>` placeholder for now.
  (T04 replaces this with real `<TourShell>` rendering.)
- Sets `metadata.robots = { index: false, follow: true }` (spec §9).
- Exports `generateStaticParams` returning `Object.keys(TOURS).map(slug => ({ slug }))`.

```ts
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOURS, getTour } from "@/content/tours/registry";

export const metadata: Metadata = {
  title: "Product tour",
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return Object.keys(TOURS).map((slug) => ({ slug }));
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  // Placeholder — T04 replaces with <TourShell tour={tour} />.
  return <main className="p-8">{tour.title}</main>;
}
```

### 4. `src/app/tour/page.tsx` (default redirect)

Redirects `/tour` → `/tour/full-walkthrough` (the default tour slug
from `registry.ts`).

```ts
import { redirect } from "next/navigation";
import { DEFAULT_TOUR_SLUG } from "@/content/tours/registry";

export default function TourIndex() {
  redirect(`/tour/${DEFAULT_TOUR_SLUG}`);
}
```

## Acceptance criteria

- `npm run typecheck` passes.
- Visiting `/tour/anything-not-registered` returns 404.
- Visiting `/tour/full-walkthrough` renders text "Full Walkthrough"
  (this works once T02e populates the registry — until then, /tour
  also 404s, which is expected).
- The four files exist at the paths above; nothing else is created or
  modified.

## Out of scope

- Do **not** implement any UI components (Callout, Stage, Shell, etc.)
  — those are separate tasks.
- Do **not** create any sample tour content — that is T02e.
- Do **not** import anything from `@/components/tour/*` yet.
- Do **not** add any styling beyond the placeholder.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website`. Read the project at
> `projects/product-walkthrough-app/` — both `spec.md` and
> `tasks/01-foundation.md`.
>
> Execute T01 as specified. The deliverables are four files:
>
> 1. `src/content/tours/types.ts` — verbatim from spec §3.3
> 2. `src/content/tours/registry.ts` — with the `// TOURS` insertion marker exactly as documented
> 3. `src/app/tour/[slug]/page.tsx` — skeleton handler with `notFound()` + `generateStaticParams` + noindex metadata
> 4. `src/app/tour/page.tsx` — `redirect("/tour/full-walkthrough")`
>
> No other files. No UI components. No content. Run `npm run typecheck`
> before reporting done. If anything is ambiguous after reading the
> spec, stop and ask.
