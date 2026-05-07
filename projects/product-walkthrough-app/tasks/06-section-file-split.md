# T06 (P2.0) — Split full-walkthrough into per-section files

**Phase**: 2
**Wave**: 1 (sequential, blocks all of Wave 2 in Phase 2)
**Dependencies**: Phase 1 complete

## Goal

Restructure `src/content/tours/full-walkthrough.ts` so that each section
lives in its own file under `src/content/tours/full-walkthrough/<id>.ts`.
Phase 1 inlined a single section; Phase 2 needs five sections × 3-5
steps each, and parallel authoring requires disjoint files.

The composition file (`full-walkthrough.ts`) becomes a thin assembler
that imports each section and exports the `Tour`.

## Reads (required context)

- `projects/product-walkthrough-app/spec.md` §3.3 (data model), §3.4
  (file layout), §10 (Phase 2 deliverable).
- `src/content/tours/full-walkthrough.ts` — current state (one inline
  matter-management section with 2 placeholder steps).
- `src/content/tours/types.ts` — for the `TourSection` and `SectionId`
  types.

## Deliverables

### 1. Move existing matter-management content to its own file

**Create**: `src/content/tours/full-walkthrough/matter-management.ts`

```ts
import type { TourSection } from "../types";

export const matterManagement: TourSection = {
  id: "matter-management",
  label: "Matter Management",
  steps: [
    // Move the two existing steps here verbatim. Update screenshot
    // paths if needed (they should already be
    // /tours/full-walkthrough/matter-management/...).
  ],
};
```

### 2. Stub files for the four remaining sections

Each is a `TourSection` with an empty `steps` array. P2.1–P2.5 fill
these in.

**Create**: `src/content/tours/full-walkthrough/documents-email.ts`

```ts
import type { TourSection } from "../types";

export const documentsEmail: TourSection = {
  id: "documents-email",
  label: "Documents & Email",
  steps: [],
};
```

**Create**: `src/content/tours/full-walkthrough/collaboration.ts`

```ts
import type { TourSection } from "../types";

export const collaboration: TourSection = {
  id: "collaboration",
  label: "Collaboration",
  steps: [],
};
```

**Create**: `src/content/tours/full-walkthrough/ai-automation.ts`

```ts
import type { TourSection } from "../types";

export const aiAutomation: TourSection = {
  id: "ai-automation",
  label: "AI & Automation",
  steps: [],
};
```

**Create**: `src/content/tours/full-walkthrough/spend-performance.ts`

```ts
import type { TourSection } from "../types";

export const spendPerformance: TourSection = {
  id: "spend-performance",
  label: "Spend & Performance",
  steps: [],
};
```

### 3. Refactor `src/content/tours/full-walkthrough.ts`

Replace the inline section content with imports + composition. Drop
the `description` line if you'd like — it's optional in the type — or
keep the existing copy. Leave `slug` and `title` unchanged.

```ts
import type { Tour } from "./types";
import { matterManagement } from "./full-walkthrough/matter-management";
import { documentsEmail } from "./full-walkthrough/documents-email";
import { collaboration } from "./full-walkthrough/collaboration";
import { aiAutomation } from "./full-walkthrough/ai-automation";
import { spendPerformance } from "./full-walkthrough/spend-performance";

export const fullWalkthrough: Tour = {
  slug: "full-walkthrough",
  title: "Spaarke product tour",
  description:
    "A guided walkthrough of the Spaarke platform across matter management, documents, collaboration, AI, and spend.",
  sections: [
    matterManagement,
    documentsEmail,
    collaboration,
    aiAutomation,
    spendPerformance,
  ],
};
```

## Acceptance criteria

- `npm run typecheck` passes (no new errors beyond pre-existing
  `capabilities.ts`).
- Visiting `/tour/full-walkthrough` still renders the same matter-
  management content as before.
- The four stub sections appear in the `<TourHeader>` capability nav
  but cannot be navigated into until they have steps. (If the engine
  crashes when a section has zero steps, file a follow-up; do not fix
  here.)
- No `public/tours/...` assets are added or moved.

## Out of scope

- Authoring any new step content — that's P2.1 through P2.5.
- Capturing screenshots — same.
- Engine changes — `<TourShell>` should already handle five sections;
  if it has a hard-coded assumption of one, log it and fix in a
  separate follow-up.

## Prompt

> You are continuing work on the Spaarke marketing site at
> `c:\code_files\spaarke-website-wt-walkthrough-app` (worktree).
> Phase 1 is committed. Read
> `projects/product-walkthrough-app/spec.md` §3.3, §3.4, §10 and
> `projects/product-walkthrough-app/tasks/06-section-file-split.md`.
>
> Execute T06: split `src/content/tours/full-walkthrough.ts` into
> per-section files under `src/content/tours/full-walkthrough/`. Move
> the existing matter-management content; stub the four remaining
> sections with empty `steps` arrays. Refactor `full-walkthrough.ts`
> to import + compose.
>
> Run `npm run typecheck` and curl `/tour/full-walkthrough` (port
> 3001 if a dev server is already running, else start one) to verify
> the page still renders. If the engine crashes on an empty section,
> note it as a follow-up — don't try to fix in this task.
>
> Do not modify any other files. Report changes + typecheck result.
