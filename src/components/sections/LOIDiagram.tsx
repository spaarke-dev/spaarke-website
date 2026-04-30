import { Heading, Lede, Shell, Slab } from "@/components/primitives";
import { loiContent } from "@/content/home/loi-diagram";

/**
 * Section 5 — Introducing Legal Operations Intelligence (the diagram).
 *
 * PLACEHOLDER — full diagram implementation in Task 023 (next turn). This
 * stub renders the heading + intro so the home composition is visible
 * end-to-end. Real diagram (Spaarke container → arrow → Copilot badge)
 * follows.
 */
export function LOIDiagram() {
  const { heading, intro } = loiContent;

  return (
    <Slab tone="dark">
      <Shell>
        <div className="mx-auto max-w-3xl text-center">
          <Heading level={2}>
            {heading.line1}
            <br />
            <span className="whitespace-nowrap">{heading.line2}</span>
          </Heading>
          <div className="mt-6 mx-auto max-w-[60ch]">
            <Lede>{intro}</Lede>
          </div>
          <p className="text-fg-low mt-12 text-xs uppercase tracking-widest">
            Diagram coming in the next build (Task 023)
          </p>
        </div>
      </Shell>
    </Slab>
  );
}
