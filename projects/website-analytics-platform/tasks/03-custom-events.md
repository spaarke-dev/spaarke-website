# T03 — Custom events: tour, CTAs, article reads, outbound

**Phase**: 0
**Wave**: 3 (parallel with T04, T06)
**Dependencies**: T01, T02

## Goal

Wire the remaining custom events from spec §4.2 across the site.
This task is mostly small one-line `track()` calls in existing
components. None of these touch forms (T02 owns those).

## Reads (required context)

- `projects/website-analytics-platform/spec.md` §4.2 (event
  inventory).
- `src/lib/analytics.ts` and `src/types/plausible.d.ts` (T01) —
  the typed event surface.
- `src/components/tour/TourShell.tsx` (created by the walkthrough
  project — confirm it exists; if not, skip the tour events with
  a TODO and finish the rest).
- Components rendering CTAs and outbound LinkedIn links across the
  site.

## Deliverables

### 1. Tour events (3 events)

In `src/components/tour/TourShell.tsx` — the URL-state owner:

- **Tour Section Enter** — fired when the active section changes (or
  on first mount with the initial section). Use a `useEffect` keyed
  on the active section id.
  ```ts
  useEffect(() => {
    track("Tour Section Enter", {
      tour_slug: tour.slug,
      section_id: activeSection.id,
    });
  }, [tour.slug, activeSection.id]);
  ```

- **Tour Section Complete** — fired when the user views the **last
  step** of a section. In the existing `goNext` logic, before the
  cross-section navigation, fire the event:
  ```ts
  if (stepIndex === activeSection.steps.length - 1) {
    track("Tour Section Complete", {
      tour_slug: tour.slug,
      section_id: activeSection.id,
    });
  }
  ```

- **Tour Complete** — fired when the user views the last step of the
  last section. Computed once. After that fires, the event should
  not re-fire on the same session — guard via sessionStorage.

If `TourShell.tsx` doesn't exist yet (walkthrough engine hasn't
shipped on `main`), skip these events with a TODO comment in this
task's report and proceed.

### 2. Article Read event

This is the highest-signal event in the set. Definition: ≥75% scroll
**AND** ≥45 seconds on page.

Create `src/components/analytics/ArticleReadTracker.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Props = {
  slug: string;
};

export function ArticleReadTracker({ slug }: Props) {
  useEffect(() => {
    let fired = false;
    let scrollHit = false;
    const startTime = Date.now();
    const dwellThreshold = 45_000;

    function checkAndFire() {
      if (fired) return;
      const dwell = Date.now() - startTime;
      if (scrollHit && dwell >= dwellThreshold) {
        fired = true;
        track("Article Read", {
          article_slug: slug,
          time_on_page: Math.round(dwell / 1000),
        });
      }
    }

    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total >= 0.75) {
        scrollHit = true;
        checkAndFire();
      }
    }

    function onInterval() {
      checkAndFire();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = setInterval(onInterval, 5_000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
    };
  }, [slug]);

  return null;
}
```

Mount the tracker on every blog-post page. Find the article-render
route (`src/app/why-spaarke/[slug]/page.tsx` or similar). Add:

```tsx
import { ArticleReadTracker } from "@/components/analytics/ArticleReadTracker";

// inside the page render:
<ArticleReadTracker slug={post.slug} />
```

### 3. CTA click events (3 events)

Inline `onClick` handlers added to the relevant CTAs across the site.

Find the components rendering each CTA and add `onClick={() =>
track(...)}`. Pattern:

- **CTA Click — Get Access** — fires on every "Get access" button
  click. Likely places: home page Closing section, /platform hero,
  SiteHeader, anywhere a `Button variant="primary" href="/access-request"`
  exists.
  ```tsx
  <Button
    variant="primary"
    href="/access-request"
    onClick={() => track("CTA Click — Get Access", { from_page: "/" })}
  >
    Get access
  </Button>
  ```
  `from_page` should be set to the current pathname. In a server
  component, hardcode the path; in a client component, read from
  `usePathname()`.

- **CTA Click — Contact Us** — same pattern for "Contact us" links.
  Likely: SiteFooter, the platform-page closing section.

- **CTA Click — See Platform** — for "See Platform →" links. Likely:
  home page Closing section, SiteFooter, possibly SiteHeader.

The `Button` primitive (`src/components/primitives/Button.tsx`)
likely accepts an `onClick` prop already. Use it. Don't modify the
Button component itself.

If the Button is rendered from typed config (e.g., `closingContent.ctas`
in `src/content/home/closing.ts`), prefer adding the `onClick` at
the consumer side rather than threading it through the config —
keeps the analytics concern out of the data layer.

### 4. Outbound — LinkedIn

`CTA Click — Outbound — LinkedIn` (or rename to `Outbound Click —
LinkedIn` to match spec §4.2) for any `<a>` linking to a LinkedIn
URL. Most common: SiteFooter social links.

```tsx
<a
  href="https://www.linkedin.com/company/spaarke"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => track("Outbound Click — LinkedIn", { from_page: "/" })}
>
  ...
</a>
```

If there's a SocialLinks component, instrument once there.

### 5. Type validation

Verify `src/types/plausible.d.ts` lists every event used here. T01
should already have the full enum; if any event in spec §4.2 is
missing from the type, add it now. Trying to call `track("Foo")`
with an unknown event should be a TypeScript error.

## Acceptance criteria

- `npm run typecheck` passes.
- Tour events fire (verified in dev console — `window.plausible` is
  callable; tour navigation logs the events).
- Article Read event fires after scrolling 75% and dwelling 45s on
  any blog post.
- All three CTA-Click events fire when their respective buttons are
  clicked.
- Outbound LinkedIn event fires before navigation.
- No event names are typo'd — all calls are typed against the enum.

## Out of scope

- Form-submission events (T02 — already done).
- AI Source Visit event (T04 — fired in AttributionBootstrap).
- Privacy policy update — T05.
- New events beyond the spec §4.2 list — propose additions in T07
  acceptance, don't add ad-hoc.

## Prompt

> Phase 0, T03 of the Spaarke website analytics platform.
>
> Read `projects/website-analytics-platform/spec.md` §4.2 and
> `projects/website-analytics-platform/tasks/03-custom-events.md`
> (this file).
>
> Execute T03: wire the non-form custom events specified — tour
> section/complete events in TourShell, ArticleReadTracker on blog
> posts, CTA-click events on Get Access / Contact Us / See Platform
> buttons, Outbound LinkedIn click event in the footer.
>
> All event names must be typed against the enum in
> `src/types/plausible.d.ts`. If TourShell doesn't exist yet (the
> walkthrough engine hasn't merged), skip the tour events and note
> in the report so the user can revisit.
>
> Use `track()` from `src/lib/analytics`. Don't modify the Button
> primitive — add onClick at consumers.
>
> Run `npm run typecheck` and verify in `npm run dev` that clicking
> a CTA logs the event (open `window.plausible.q` in the console
> before the script loads to inspect queued calls).
