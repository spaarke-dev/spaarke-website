# Product Walkthrough App — Specification

> A self-contained sub-app inside the Spaarke marketing site that hosts
> interactive product tours: stepped slides built from PNG screenshots
> with overlaid callouts. Multiple tour variants (Full Walkthrough,
> Feature Highlights, etc.) share a single rendering engine; each tour
> is data, not code.

---

## 1. Purpose

The marketing site needs a way to demonstrate the Spaarke product without
exposing the live application. The walkthrough app:

- Gives prospective users a guided, narrated view of the product UI.
- Hosts multiple tour variants (full, themed, role-specific) from one
  rendering engine.
- Lets authors (you + Claude Code) compose tours from screenshots +
  callouts without writing UI code.
- Captures completion telemetry tied to the existing "Take Tour" lead
  signup so we can correlate signups with engagement.

It is **not** an interactive product simulation. The user advances
through scripted slides and may click designated hotspots, but cannot
freely interact with the underlying screenshots.

---

## 2. User flows

### 2.1 Entry

- **Take Tour form** (home hero) → on submit, opens the existing
  modal **and** offers a "View full tour" link to `/tour`. Initially
  the modal stays the primary surface; once the engine is live, the
  link routes into the engine.
- **Direct route** — `/tour`, `/tour/feature-highlights`, etc. share via
  URL, embed in emails, link from blog posts.

### 2.2 In-tour navigation

- Top capability nav (Matter Management, Documents & Email,
  Collaboration, AI & Automation, Spend & Performance, Get access)
  sits above the stage. The non-active capability buttons are
  clickable jumps to the first step of that section.
- Below the stage: Prev / Next buttons + "{n} of {total}" counter.
- Keyboard: ←/→ advance, Esc returns to landing.
- URL persists step state (`?section=…&step=…`).

### 2.3 Hotspots (Phase 3)

Designated rectangular regions inside a screenshot can be clicked to
advance to the next step or branch to a specific step. Used for "click
to open the matter detail" → screenshot swap.

---

## 3. Architecture

### 3.1 Routes

| Path | Behavior |
|---|---|
| `/tour` | Renders the **default tour** (`full-walkthrough` slug) — convenience redirect. |
| `/tour/[slug]` | Renders the named tour. 404 if slug not registered. |

URL query params: `?section=<id>&step=<n>` for step state, `?grid=1` to
overlay the coordinate grid (dev/author aid), `?author=1` to enable
click-to-print coordinate logging.

### 3.2 Component tree

```
<TourShell tour={tour} active={…}>
  <TourHeader sections={tour.sections} active={…} onSectionClick={…} />
  <TourStage step={…}>
    <Screenshot src=… aspectRatio=ssWidth/ssHeight />
    <Callout box=… anchor=… side=… title=… body=… />     ← from current step
    <CoordinateGrid />                                    ← only if ?grid=1
    <HotspotLayer hotspots=… onTrigger=… />               ← Phase 3
  </TourStage>
  <StepNav prev next index total />
</TourShell>
```

### 3.3 Data model (TypeScript)

All types live in `src/content/tours/types.ts`. Tours are typed data —
no runtime parsing. **All positions are normalized coordinates: floats
in `[0, 1]` representing fractions of the screenshot's intrinsic
dimensions.**

```ts
export type SectionId =
  | "matter-management"
  | "documents-email"
  | "collaboration"
  | "ai-automation"
  | "spend-performance";

export type Tour = {
  /** Stable id used in URLs (`/tour/<slug>`). */
  slug: string;
  /** Display title. */
  title: string;
  /** Optional short description shown on the landing screen. */
  description?: string;
  sections: TourSection[];
};

export type TourSection = {
  id: SectionId;
  /** Display label on the capability nav. */
  label: string;
  steps: TourStep[];
};

export type TourStep = {
  id: string;
  screenshot: Screenshot;
  callout: Callout;
  /** Optional click regions; Phase 3. */
  hotspots?: Hotspot[];
};

export type Screenshot = {
  /** Path under `/public`, e.g. "/tours/full-walkthrough/matters-list.png". */
  src: string;
  /** Intrinsic pixel dimensions — used for aspect-ratio. */
  width: number;
  height: number;
  /** Required alt text. */
  alt: string;
};

export type Callout = {
  /** Optional title shown above the body in stronger weight. */
  title?: string;
  /** The callout body copy. */
  body: string;
  /**
   * Position of the callout box, normalized to screenshot dims.
   * `width` is required; `height` is auto if omitted.
   */
  box?: { x: number; y: number; width: number; height?: number };
  /**
   * Where the pointer attaches on the screenshot, normalized.
   * Drives auto-placement of the box if `box` is omitted.
   */
  anchor?: { x: number; y: number };
  /** Which side of the callout the pointer comes out of. */
  side?: "top" | "right" | "bottom" | "left";
};

export type Hotspot = {
  region: { x: number; y: number; width: number; height: number };
  action: { type: "next" } | { type: "go-to"; stepId: string };
  /** Visible outline + cursor; helps users discover the hotspot. */
  label?: string;
};
```

### 3.4 File layout

```
src/
├── app/
│   └── tour/
│       └── [slug]/
│           └── page.tsx                       ← renders <TourShell> with content
├── components/
│   └── tour/
│       ├── TourShell.tsx                      ← top-level wrapper, URL state owner
│       ├── TourHeader.tsx                     ← capability nav
│       ├── TourStage.tsx                      ← screenshot + overlay
│       ├── Callout.tsx                        ← bordered box + pointer
│       ├── StepNav.tsx                        ← prev/next + counter
│       ├── CoordinateGrid.tsx                 ← dev overlay
│       ├── HotspotLayer.tsx                   ← Phase 3
│       └── geometry.ts                        ← side-flip & box-placement utilities
└── content/
    └── tours/
        ├── types.ts                           ← shared types (above)
        ├── registry.ts                        ← slug → Tour mapping
        ├── full-walkthrough.ts                ← Phase 2 content
        └── feature-highlights.ts              ← Phase 4 content

public/
└── tours/
    ├── full-walkthrough/
    │   ├── matter-management/
    │   │   ├── step-1-active-matters.png
    │   │   └── …
    │   └── …
    └── feature-highlights/
        └── …
```

---

## 4. The positioning system

The single most important design decision: **all coordinates are
normalized fractions of the screenshot's intrinsic dimensions**. The
stage is rendered at any size; everything inside scales together.

### 4.1 Normalized coordinates

Every position is `{ x, y }` where each value is in `[0, 1]`:
- `x = 0` is the left edge, `x = 1` is the right edge of the screenshot.
- `y = 0` is the top, `y = 1` is the bottom.
- `width: 0.30` means "30% of the screenshot's width".

The `<TourStage>` sets `aspect-ratio: ${ss.width} / ${ss.height}` and
`width: 100%`. The screenshot is `position: absolute; inset: 0`. The
overlay layer matches the same box. A callout at `box: { x: 0.45, y:
0.20, width: 0.30 }` resolves to `left: 45%; top: 20%; width: 30%` —
which renders correctly at any rendered size.

This solves the Claude-can't-give-pixel-perfect-positions problem: an
estimate of "the column header is at about 22% from the top" lands
within a few percent of correct, and adjustment is conversational.

### 4.2 Side-flip & auto-placement

If `callout.box` is omitted, the engine derives the box from the
`anchor` plus the `side`:

- `side: "right"` → box's left edge = `anchor.x + 0.02` (small gap),
  box's vertical center = `anchor.y`. Default `width: 0.28`.
- `side: "left"` → mirror.
- `side: "top"` / `"bottom"` → mirror, vertically.

If the derived box would extend past the screenshot edge (right edge >
1, etc.), the engine auto-flips the side to keep it on-screen. This
removes ~70% of explicit `box` declarations from typical step configs.

If both `box` and `anchor` are present, `box` wins — `anchor` is used
only to draw the pointer.

### 4.3 Coordinate grid overlay (`?grid=1`)

A dev/author aid: when the URL has `?grid=1`, the stage shows a 5%-step
grid drawn over the screenshot, with axis labels every 10%. Lets the
author read coordinates visually instead of guessing in chat.

The grid is implemented as a single SVG layer at full stage size.
Production users never see it (no UI to toggle).

### 4.4 Author mode (`?author=1`) — Phase 4

When `?author=1` is set, the stage attaches a click handler that prints
the click position as `{x: 0.<n>, y: 0.<n>}` to the console (and copies
to clipboard). Lets the author click on a feature in the screenshot to
get its exact normalized coordinates, then paste into the config.

---

## 5. Component specifications

### 5.1 `Callout` (`src/components/tour/Callout.tsx`)

**Purpose**: render the bordered callout box with optional title, body,
and a pointer arrow connecting it to a screenshot anchor.

**Props**:
```ts
type Props = {
  callout: Callout;          // from types.ts
  /** Stage dimensions in % needed to resolve the box. Always 100/100 since
   * we use percent-of-stage; provided for clarity only. */
};
```

**Visual treatment**:
- Box: white background (`#ffffff`), 1px border `rgba(15,23,42,0.12)`,
  rounded `0.5rem`, soft shadow `0 8px 24px -4px rgba(15,23,42,0.10)`.
- Body text: `font-display`, body weight, ~14-16px, slate-700.
- Title (optional): one weight stronger, slate-900, mb-2.
- Pointer arrow: 12px equilateral triangle, same fill as bg, with the
  same border on the visible edges. Connects from the box edge toward
  the `anchor` point.

**Behavior**:
- If `box` is provided → render at those normalized coords as
  `position: absolute; left: ${x*100}%; top: ${y*100}%; width:
  ${width*100}%`.
- If `box` is omitted but `anchor` + `side` are provided → call
  `placeBox(anchor, side, defaults)` from `geometry.ts`. Apply
  side-flip if it would overflow.
- If `anchor` is provided, render the pointer at the box edge nearest
  the anchor, oriented toward the anchor point.

**A11y**: Outer element is `role="region"` with
`aria-roledescription="callout"` and `aria-label={title || body}`.

### 5.2 `StepNav` (`src/components/tour/StepNav.tsx`)

**Purpose**: prev/next controls and step counter.

**Props**:
```ts
type Props = {
  index: number;       // 0-based within the active section
  total: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
};
```

**Visual**:
- Two icon buttons (left/right chevrons) flanking centered counter
  text "{n} of {total}".
- Disabled state: 50% opacity, `cursor-not-allowed`.

**Keyboard**: ← Prev, → Next. Wired in TourShell, not StepNav.

### 5.3 `CoordinateGrid` (`src/components/tour/CoordinateGrid.tsx`)

**Purpose**: SVG overlay showing 5%-step grid with axis labels.

**Props**: `{ enabled: boolean }`. Renders `null` if `false`.

**Visual**:
- 21 vertical + 21 horizontal lines at 5% increments.
- Lines: `rgba(80, 120, 220, 0.18)`, 0.5px stroke.
- Heavier lines at 10% increments: `rgba(80, 120, 220, 0.32)`, 0.75px.
- Labels at every 10% along each axis: 10px monospace, slate-500.

### 5.4 `TourHeader` (`src/components/tour/TourHeader.tsx`)

**Purpose**: top capability nav matching the design (dashed-outline
buttons for non-active sections, solid pill for "Get access").

**Props**:
```ts
type Props = {
  sections: TourSection[];
  activeSectionId: SectionId;
  onSectionClick: (id: SectionId) => void;
};
```

**Visual**: 5 dashed-outline buttons + a primary "Get access" pill on
the right (links to `/access-request`). Active section's button is
solid-filled in brand blue.

### 5.5 `TourStage` (`src/components/tour/TourStage.tsx`)

**Purpose**: the screenshot + overlay container.

**Props**:
```ts
type Props = {
  step: TourStep;
  showGrid?: boolean;        // ?grid=1
  authorMode?: boolean;      // ?author=1
};
```

**Behavior**:
- Renders a `position: relative` box with
  `aspect-ratio: ${ss.width} / ${ss.height}`.
- `<img>` for the screenshot at `absolute inset-0 w-full h-full
  object-contain`. Use `<Image>` with explicit width/height.
- Renders `<Callout>` over the image.
- Renders `<CoordinateGrid>` if `showGrid`.
- If `authorMode`, attaches click handler to the stage that:
  - Computes the click coords as `{ x: clickX/stageWidth, y: clickY/stageHeight }`.
  - Logs to console: `[author] {x: 0.62, y: 0.23}`.
  - Copies to clipboard.

### 5.6 `TourShell` (`src/components/tour/TourShell.tsx`)

**Purpose**: top-level wrapper — owns URL state, keyboard, telemetry.

**Props**:
```ts
type Props = {
  tour: Tour;
};
```

**Behavior**:
- Reads URL search params (`section`, `step`, `grid`, `author`) via
  `useSearchParams`.
- Default state: first section, first step.
- Updates URL on nav: `router.replace(`?section=${id}&step=${n}`)`.
- Keyboard listeners on window: ←/→ for nav.
- Fires telemetry events on step entry, section completion, tour
  completion (Phase 4).
- Composes `<TourHeader>` + `<TourStage>` + `<StepNav>`.

### 5.7 `HotspotLayer` (Phase 3)

Deferred. Outline:
- Reads `step.hotspots`.
- Renders each as an absolutely-positioned `<button>` with a subtle
  outline + cursor pointer.
- On click, calls `onTrigger(hotspot)`.

### 5.8 `geometry.ts` utilities

```ts
export function placeBox(
  anchor: { x: number; y: number },
  side: "top" | "right" | "bottom" | "left",
  opts?: { defaultWidth?: number; gap?: number }
): { x: number; y: number; width: number; side: ...; flipped: boolean };
```

Returns the resolved box position + the (possibly flipped) side, plus a
boolean indicating whether the side was flipped to fit.

---

## 6. Authoring workflow with Claude Code

The intended loop:

1. **You** drop a screenshot into chat (e.g., "matters list view, 1920×1200")
   and a description: "Step 1 — Matters list. Callout on the New Matter
   button: 'Create matters from any context'."
2. **Claude** estimates the anchor position from the image visually,
   writes the step config in the tour data file, references the PNG
   path under `/public/tours/<slug>/<section>/`.
3. **You** preview at `/tour/<slug>?section=<id>&step=<n>&grid=1`. The
   grid overlay lets you see exactly where the anchor lands.
4. **You** request adjustments ("anchor needs to be 4% lower").
5. **Claude** updates the config; you re-preview.

Iteration is typically 1–2 rounds per step thanks to the grid overlay.
For dense screenshots, switch to `?author=1` and click on the target —
the coords print to console and copy to clipboard, and Claude pastes
them straight in.

The user provides the screenshot. Claude does not generate UI mockups.

---

## 7. Engine behaviors

### 7.1 URL state

Single source of truth. URL params:
- `section: string` — section id; default = first section
- `step: number` — 1-indexed step within the section; default = 1
- `grid: "1"` — toggles coordinate grid (dev aid; no UI)
- `author: "1"` — toggles author mode (dev aid; no UI)

Every nav action calls `router.replace(...)` (not `push`) so back/forward
behave intuitively.

### 7.2 Telemetry

App Insights events (extending the existing `lib/logger.ts`):
- `tour.section_enter` — `{ tour, section }`
- `tour.step_view` — `{ tour, section, stepId }` (debounced 500ms)
- `tour.section_complete` — `{ tour, section }`
- `tour.completed` — `{ tour }` when last step of last section is viewed

### 7.3 Accessibility

- Stage has `role="region"`, `aria-roledescription="slide"`,
  `aria-label="${section.label}, step ${n} of ${total}: ${callout.title || callout.body}"`.
- Prev/Next buttons have explicit `aria-label`.
- Section nav buttons are `<button>`, not `<a>` (they don't navigate
  away — they update URL params).
- Hotspots (Phase 3) are `<button>` with descriptive `aria-label`.
- Keyboard: ← Prev, → Next, Tab cycles through nav controls, Enter/Space
  triggers focused control.
- Reduced motion: any step transition uses `motion-safe:` only.

### 7.4 Mobile strategy

A dense product screenshot does not work on a 375px phone. Default
behavior:
- Below `lg:` (≤1023px), render a "View on a larger screen" message
  with a static thumbnail of the first screenshot. Don't render the
  engine at all.
- Above `lg:`, full engine.

Same call we made for the SpaarkeAI architecture diagram and the
DeploymentModels compare slider.

---

## 8. Performance & assets

### 8.1 Screenshot processing

Capture and processing pipeline:

- **Capture** at 2× the rendered size (5120-wide retina captures of
  the dev shell are typical).
- **Process** via `node scripts/process-tour-screenshot.mjs --source <in> --out <out>`.
  The script masks the dev "SANDBOX" badge (white fill over the
  word in the global header — see `DEFAULT_MASK` for the
  pre-calibrated coords) then resizes to 2400px wide and re-encodes
  as compressed PNG. Override the mask with `--mask "x,y,w,h"`
  (source-image coords) if a particular shot has the badge in a
  different position.
- **Targets**: ≤ 400 KB per PNG, ≤ 250 KB per WebP.
- **Sources** live in `/resources/walkthroughs/<slug>/<section>/` —
  image files gitignored, the per-section `_guide.md` tracked as
  the authoring source of truth (per-step intent, callout copy,
  anchor hints, mask overrides if any).
- **Final assets** land in `/public/tours/<slug>/<section>/` and
  are served by Next `<Image>`.

### 8.2 Loading

- Each screenshot uses Next `<Image>` with explicit `width` + `height`.
- Active step: `priority` + `loading="eager"`.
- Other steps: `priority={false}`, `loading="lazy"`.
- Pre-fetch the next step's image on step entry (cheap; matters when
  the step transition would otherwise blank momentarily).

### 8.3 Bundle

`/tour/[slug]` is its own route segment; tour data lazy-imported per
slug. Engine code is shared. No tour content ships in the home page
bundle.

---

## 9. SEO posture

- `/tour` and `/tour/[slug]` set `metadata.robots = { index: false,
  follow: true }`. Marketing pages link in but search engines don't
  index the tour itself.
- The intro/landing of the tour (a brief description on `/tour`)
  remains indexable as a redirect target — it's mostly text.

---

## 10. Phasing

### Phase 1 — Engine + proof (this project's first deliverable)

Goal: the engine renders one tour with one section and 2 steps end-to-end.

- Types + route skeleton.
- All Phase 1 components (`Callout`, `StepNav`, `CoordinateGrid`,
  `TourHeader`, `TourStage`, `TourShell`).
- Geometry utilities.
- Sample tour: `full-walkthrough.ts` with the **Matter Management**
  section, **2 placeholder steps**.
- Coordinate grid overlay working.
- URL state, keyboard nav, mobile guard.
- noindex metadata.

Deliverable: visiting `/tour` renders the engine with Matter Management
content, ←/→ keys advance, `?grid=1` shows the coordinate grid.

### Phase 2 — Full Walkthrough content

Author all 5 sections × 3-5 steps each for the Full Walkthrough tour.
No engine changes. Iterate on callout positioning per step.

### Phase 3 — Hotspots

Add `<HotspotLayer>` and the `Hotspot` model. Wire one or two example
hotspots in the existing tour.

### Phase 4 — Second tour, polish, telemetry

- "Feature Highlights" tour.
- Author mode (`?author=1`) coordinate logging.
- Telemetry events end-to-end.
- Final visual polish on callout, step transitions, animation.
- Optional: route the home Take-Tour modal to `/tour` instead of
  showing the placeholder modal.

---

## 11. Open questions / decisions to confirm

- **Default tour**: `/tour` should redirect to which slug?
  Recommendation: `/tour/full-walkthrough`. (Confirm during Phase 2.)
- **Section nav clickability**: are non-active section buttons
  clickable jumps, or display-only? Recommendation: clickable. (Phase 1
  implements clickable.)
- **Branching tours**: the `Hotspot` action model supports `go-to` but
  the linear `step + section` URL state doesn't naturally branch. Is
  branching ever needed? Recommendation: no for now; reconsider in
  Phase 3.
- **Tour completion CTA**: at the end of a tour, what does the user see
  — link back to home? a Get Access form embed? a "Take another tour"
  picker? Decision deferred to Phase 4.
- **Modal vs. route from "Take tour"**: currently the home form opens
  the modal. Once `/tour` is real, do we redirect there instead?
  Recommendation: keep the modal (low-friction on home page) and add a
  "View full tour" link inside the modal that routes to `/tour`.
