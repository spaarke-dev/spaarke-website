# Task 005: Build component primitives

**Phase:** 0 — Foundations
**Status:** not-started
**Estimated:** 2 hours
**Dependencies:** 002, 003
**Tags:** components, primitives, ui, typescript

## Goal

Reusable, type-strict React components for the most-used v2 patterns — typography, container, slab, button — at `src/components/primitives/`. Section components in Phases 2 and 3 compose these without re-implementing.

## Context

The mockup prototype uses bespoke utility classes (`.v2-h1`, `.v2-shell`, `.v2-btn-primary`). For production, we use React component primitives instead — single source of styling per pattern, typed props, focus-visible baked in.

No `V2` filename suffix. These are just "the design primitives."

## Steps

1. Create `src/components/primitives/` and the following files:

2. **`Heading.tsx`** — fluid display headings
   ```ts
   type HeadingProps = {
     level: 1 | 2 | 3;
     children: React.ReactNode;
     className?: string;
   };
   ```
   - `level={1}` → `<h1>` with H1 clamp (~`clamp(48px, 7.5vw, 104px)`, weight 500, letter-spacing -0.035em, line-height 0.98)
   - `level={2}` → `<h2>` (~`clamp(34px, 4.5vw, 64px)`, weight 500, letter-spacing -0.025em, line-height 1.05)
   - `level={3}` → `<h3>` (~`clamp(20px, 1.6vw, 26px)`, weight 500, letter-spacing -0.015em, line-height 1.2)
   - Uses Tailwind arbitrary values referencing the type tokens from Task 002

3. **`Lede.tsx`** — section subhead/intro paragraph
   - `<p>` with `clamp(18px, 1.4vw, 22px)`, `line-height: 1.5`, `color: var(--color-text-mid)`
   - Optional `tone="dark"|"light"` prop selects the right text-mid token

4. **`Eyebrow.tsx`** — mono uppercase caption
   - `<span>` with JetBrains Mono, 11px, letter-spacing 0.16em, uppercase, low text color
   - Optional `tone="dark"|"light"` prop

5. **`Shell.tsx`** — page-width container
   - Wraps children with horizontal padding (`var(--spacing-shell-x)` from Task 002)
   - No max-width by default (the prototype's `v2-shell` doesn't constrain max-width — it just sets fluid horizontal padding)
   - Optional `as` prop for tag override (default `div`)

6. **`Slab.tsx`** — section background slab with vertical padding
   - Props: `tone: "dark" | "light"`, `children: React.ReactNode`, optional `className`
   - Renders a `<section>` with appropriate background (`var(--color-bg-base)` for dark, `var(--color-bg-light)` for light) + foreground text colors + vertical section padding (`var(--spacing-section-y)`)
   - Wraps content in a `<Shell>` automatically (or accept a `padded={false}` escape)

7. **`Button.tsx`** — primary / outline / text variants
   ```ts
   type ButtonProps = {
     variant: "primary" | "outline" | "text";
     href?: string;          // renders Next.js Link when present, else <button>
     onClick?: () => void;
     children: React.ReactNode;
     arrow?: boolean;        // text variant: append ←/→ that hover-translates
     className?: string;
     "aria-label"?: string;
     type?: "button" | "submit";
   };
   ```
   - **primary**: blue accent bg, white text, pill (matches mockup hero/closing CTAs)
   - **outline**: transparent bg, hairline border, foreground-color text
   - **text**: text-only with optional arrow `<span>` that translates on hover
   - Focus-visible ring using `--color-accent` with `outline-offset: 2px`

8. **`index.ts`** — barrel export for the primitives folder

9. Update the `_v2-tokens` page from Task 002 to use these components instead of raw classes; ensures they render correctly in dark and light slab contexts.

10. Run `npm run build` and `npx tsc --noEmit` to verify.

11. Commit: `feat(v2): add component primitives (Heading, Lede, Eyebrow, Shell, Slab, Button)`.

12. Update [TASK-INDEX.md](TASK-INDEX.md): mark this task done.

## Expected Outputs

- `src/components/primitives/Heading.tsx`
- `src/components/primitives/Lede.tsx`
- `src/components/primitives/Eyebrow.tsx`
- `src/components/primitives/Shell.tsx`
- `src/components/primitives/Slab.tsx`
- `src/components/primitives/Button.tsx`
- `src/components/primitives/index.ts`
- Updated `_v2-tokens` sanity page

## Acceptance Criteria

- [ ] `<Heading level={1|2|3}>` renders correct fluid clamps and tracking
- [ ] `<Lede tone="dark|light">` renders correct color
- [ ] `<Eyebrow tone="dark|light">` renders mono uppercase
- [ ] `<Shell>` constrains horizontal padding correctly
- [ ] `<Slab tone="dark|light">` renders correct bg + fg colors and vertical section padding
- [ ] `<Button variant="primary">Get access</Button>` renders the blue-bg pill primary CTA
- [ ] `<Button variant="outline">Watch demo</Button>` renders the hairline-border secondary CTA
- [ ] `<Button variant="text" arrow>Why Spaarke</Button>` renders text-only with hover-translate arrow
- [ ] `<Button href="/access-request">` renders a Next.js `<Link>`
- [ ] Focus-visible styles present and visible on every interactive variant
- [ ] TypeScript strict checks pass

## Notes

- Keep primitives **headless of motion** — section components handle their own animation.
- For motion-bearing variants (e.g., button hover scale), use Tailwind's `motion-safe:` / `motion-reduce:` modifiers so reduce-motion users get a static UI.
- Don't add component-level state. Primitives are presentation-only.
