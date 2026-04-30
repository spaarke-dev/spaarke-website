import { Heading, Shell, Slab } from "@/components/primitives";

/**
 * Section 4 — Capabilities + Microsoft foundation card.
 *
 * PLACEHOLDER — full implementation in Task 022 (next turn). This stub
 * renders the section heading area so the home page composition is visible
 * end-to-end and we can verify slab transitions.
 */
export function Capabilities() {
  return (
    <Slab tone="light">
      <Shell>
        <div className="mx-auto max-w-3xl text-center">
          <Heading level={3}>Section 4 — Capabilities (placeholder)</Heading>
          <p className="text-fg-mid mt-6 text-sm">
            Five capability cards (Operations, Documents &amp; Knowledge,
            Collaboration, Agents &amp; Automation, Spend &amp; Performance)
            in a zigzag layout, plus the Microsoft foundation card. Coming in
            the next build.
          </p>
        </div>
      </Shell>
    </Slab>
  );
}
