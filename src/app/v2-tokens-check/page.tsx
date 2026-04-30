/**
 * v2 design system sanity check.
 * TEMPORARY — delete before merging v2 to main (Task 091).
 */
import {
  Button,
  Eyebrow,
  Heading,
  Lede,
  Shell,
  Slab,
} from "@/components/primitives";

export default function V2TokensCheck() {
  return (
    <>
      {/* DARK SLAB */}
      <Slab tone="dark">
        <Shell>
          <Eyebrow>Dark slab — default theme</Eyebrow>
          <div className="mt-6">
            <Heading level={1}>See all sides of every matter.</Heading>
          </div>
          <div className="mt-6 max-w-[60ch]">
            <Lede>
              The shared platform for legal departments, business stakeholders,
              and outside counsel.
            </Lede>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            <Swatch name="bg-bg" className="bg-bg" />
            <Swatch name="bg-surface" className="bg-surface" />
            <Swatch name="bg-surface-2" className="bg-surface-2" />
            <Swatch name="bg-spaarke-blue" className="bg-spaarke-blue" />
          </div>

          <div className="mt-8 space-y-2">
            <p className="text-fg">text-fg — primary text</p>
            <p className="text-fg-mid">text-fg-mid — secondary text</p>
            <p className="text-fg-low">text-fg-low — tertiary / captions</p>
          </div>

          <div className="mt-8 space-y-3">
            <div className="border-line border-t pt-2 text-fg-mid">
              border-line — hairline
            </div>
            <div className="border-line-strong border-t pt-2 text-fg-mid">
              border-line-strong — stronger border
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button variant="primary" href="/access-request">
              Get access
            </Button>
            <Button variant="outline">Watch demo</Button>
            <Button variant="text" href="/why-spaarke" arrow>
              Why Spaarke
            </Button>
          </div>
        </Shell>
      </Slab>

      {/* LIGHT SLAB — same primitives, flipped via data-tone="light" */}
      <Slab tone="light">
        <Shell>
          <Eyebrow>Light slab — data-tone=&quot;light&quot;</Eyebrow>
          <div className="mt-6">
            <Heading level={2}>One platform. All sides. Every matter.</Heading>
          </div>
          <div className="mt-4 max-w-[60ch]">
            <Lede>
              The same primitives flip to their light variants automatically
              inside this slab — no per-component tone prop needed.
            </Lede>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            <Swatch name="bg-bg" className="bg-bg" />
            <Swatch name="bg-surface" className="bg-surface" />
            <Swatch name="bg-surface-2" className="bg-surface-2" />
            <Swatch name="bg-spaarke-blue" className="bg-spaarke-blue" />
          </div>

          <div className="mt-8 space-y-2">
            <p className="text-fg">text-fg — primary text</p>
            <p className="text-fg-mid">text-fg-mid — secondary text</p>
            <p className="text-fg-low">text-fg-low — tertiary / captions</p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button variant="primary" href="/access-request">
              Get access
            </Button>
            <Button variant="outline">Watch demo</Button>
            <Button variant="text" href="/why-spaarke" arrow>
              Why Spaarke
            </Button>
          </div>
        </Shell>
      </Slab>
    </>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="border-line border">
      <div className={`${className} h-24 w-full`} />
      <div className="font-mono-display text-fg-mid p-2 text-xs">{name}</div>
    </div>
  );
}
