# T02e — Sample tour content (full-walkthrough, Matter Management section)

**Phase**: 1
**Wave**: 2 (parallel with T02a/b/c/d)
**Dependencies**: T01 (types and registry must exist)

## Goal

Provide the minimum sample content needed to verify the engine
end-to-end: a `full-walkthrough` tour with one section (Matter
Management) and **2 placeholder steps**. T01's registry has the
insertion marker already in place.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.3 (data model), §3.4
  (file layout), §6 (authoring workflow), §10 (Phase 1 deliverable).
- `src/content/tours/types.ts` (created by T01).
- `src/content/tours/registry.ts` (created by T01) — note the
  `// TOURS — append new imports + map entries below.` insertion marker.
  **Do not move or remove this comment.**

## Deliverables

### 1. `src/content/tours/full-walkthrough.ts`

Two steps under the Matter Management section. Use placeholder
screenshot URLs for now — actual PNGs ship with Phase 2. T05
(acceptance) accepts visibly-broken images for these placeholders.

```ts
import type { Tour } from "./types";

export const fullWalkthrough: Tour = {
  slug: "full-walkthrough",
  title: "Spaarke product tour",
  description:
    "A guided walkthrough of the Spaarke platform across matter management, documents, collaboration, AI, and spend.",
  sections: [
    {
      id: "matter-management",
      label: "Matter Management",
      steps: [
        {
          id: "active-matters-list",
          screenshot: {
            src: "/tours/full-walkthrough/matter-management/step-1-active-matters.png",
            width: 1920,
            height: 1200,
            alt: "Spaarke Active Matters list — column headers, matter rows, top toolbar",
          },
          callout: {
            title: "Your active matters, one place",
            body: "Every active matter rolls up here with status, type, and the people working it. Filters and saved views match how your team thinks.",
            anchor: { x: 0.18, y: 0.22 },
            side: "right",
          },
        },
        {
          id: "matter-detail",
          screenshot: {
            src: "/tours/full-walkthrough/matter-management/step-2-matter-detail.png",
            width: 1920,
            height: 1200,
            alt: "Spaarke matter detail view — overview tab with matter information panel",
          },
          callout: {
            title: "Matter at a glance",
            body: "Open any matter to see its overview, calendar, contacts, billing, and report card without leaving the page.",
            anchor: { x: 0.50, y: 0.30 },
            side: "bottom",
          },
        },
      ],
    },
  ],
};
```

### 2. Append to `src/content/tours/registry.ts`

**Crucial — coordinate with T01's marker.** Below the line
`// TOURS — append new imports + map entries below.`, add the import
above the `TOURS` constant and the entry inside it:

```ts
// TOURS — append new imports + map entries below.
import { fullWalkthrough } from "./full-walkthrough";

export const TOURS: Record<string, Tour> = {
  [fullWalkthrough.slug]: fullWalkthrough,
};
```

Use the `Edit` tool with `old_string` matching the marker line + the
empty TOURS body, and `new_string` adding the import + the entry. Do
**not** rewrite the entire file — preserve everything else T01 wrote.

### 3. Placeholder PNG files (optional for Phase 1)

Two empty / placeholder PNGs at:
- `public/tours/full-walkthrough/matter-management/step-1-active-matters.png`
- `public/tours/full-walkthrough/matter-management/step-2-matter-detail.png`

A 1920×1200 transparent PNG is acceptable, or you can copy any
existing PNG from `public/brand/hero/` to fill the slot. The screenshot
content does **not** matter for Phase 1 — what matters is that the
engine renders an `<img>` and overlays a callout at the right
normalized coords.

If you'd rather not commit binary placeholders, leave the files absent
and let the engine show broken images. T05 will not fail on this.

## Acceptance criteria

- `npm run typecheck` passes (the import in registry resolves).
- Visiting `/tour` redirects to `/tour/full-walkthrough` and the page
  renders the placeholder text (until T04 wires real rendering).
- The `// TOURS` marker comment is preserved.
- No other files are modified.

## Out of scope

- Full content for the other 4 sections — Phase 2.
- Actual production screenshots — Phase 2.
- Hotspots — Phase 3.
- Coordinate-perfect callout positions — Phase 1 estimates are fine,
  Phase 2 iterates.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website`. T01 has been completed and
> `src/content/tours/registry.ts` exists with a `// TOURS — append…`
> marker.
>
> Read `projects/product-walkthrough-app/spec.md` §3.3, §3.4, §10 and
> `projects/product-walkthrough-app/tasks/02e-sample-content.md` (this file).
>
> Execute T02e:
> 1. Create `src/content/tours/full-walkthrough.ts` with the
>    `fullWalkthrough` Tour export — slug "full-walkthrough", title
>    "Spaarke product tour", one section (`matter-management`), two
>    sample steps as documented in this task.
> 2. Use the `Edit` tool to surgically append to
>    `src/content/tours/registry.ts` — add the `import { fullWalkthrough }
>    from "./full-walkthrough"` line under the `// TOURS` marker, and
>    add `[fullWalkthrough.slug]: fullWalkthrough` to the TOURS map.
>    Preserve the marker comment. Do **not** rewrite the file.
>
> Optionally create empty placeholder PNGs at the documented paths in
> `public/tours/...`. The screenshots' actual content is not required
> for Phase 1.
>
> Do not modify other files. Run `npm run typecheck` before reporting done.
