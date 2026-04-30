/**
 * v2 design tokens sanity check.
 * TEMPORARY — delete before merging v2 to main (Task 091).
 */

export default function V2TokensCheck() {
  return (
    <div className="bg-bg text-fg" style={{ fontFamily: "var(--font-body)" }}>
      {/* DARK SLAB */}
      <section
        className="px-[var(--spacing-shell-x)] py-[var(--spacing-section-y)]"
      >
        <p className="text-fg-low text-xs uppercase tracking-[0.16em]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
          Dark slab — default theme
        </p>
        <h1
          className="mt-6 text-fg"
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontSize: "clamp(48px, 7.5vw, 104px)",
            fontWeight: 500,
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
          }}
        >
          See all sides of every matter.
        </h1>
        <p
          className="mt-6 text-fg-mid"
          style={{
            fontSize: "clamp(18px, 1.4vw, 22px)",
            lineHeight: 1.5,
            maxWidth: "60ch",
          }}
        >
          The shared platform for legal departments, business stakeholders, and
          outside counsel.
        </p>

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
          <button
            type="button"
            className="bg-spaarke-blue text-white inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform hover:scale-[1.02]"
          >
            Get access
          </button>
          <button
            type="button"
            className="border-line-strong text-fg inline-flex items-center gap-2 rounded-full border bg-transparent px-6 py-3 text-sm font-medium transition-colors hover:border-fg"
          >
            Watch demo
          </button>
          <button
            type="button"
            className="text-fg group inline-flex items-center gap-2 px-2 py-3 text-sm font-medium hover:text-spaarke-blue"
          >
            Why Spaarke <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>

      {/* LIGHT SLAB — same utilities, flipped via [data-tone="light"] */}
      <section
        data-tone="light"
        className="bg-bg text-fg px-[var(--spacing-shell-x)] py-[var(--spacing-section-y)]"
      >
        <p className="text-fg-low text-xs uppercase tracking-[0.16em]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
          Light slab — data-tone=&quot;light&quot;
        </p>
        <h2
          className="mt-6 text-fg"
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontSize: "clamp(34px, 4.5vw, 64px)",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
          }}
        >
          One platform. All sides. Every matter.
        </h2>
        <p
          className="mt-4 text-fg-mid"
          style={{
            fontSize: "clamp(18px, 1.4vw, 22px)",
            lineHeight: 1.5,
            maxWidth: "60ch",
          }}
        >
          The same utility classes (text-fg, text-fg-mid, bg-surface) flip to
          their light variants automatically inside this slab.
        </p>

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
          <button
            type="button"
            className="bg-spaarke-blue text-white inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform hover:scale-[1.02]"
          >
            Get access
          </button>
          <button
            type="button"
            className="border-line-strong text-fg inline-flex items-center gap-2 rounded-full border bg-transparent px-6 py-3 text-sm font-medium transition-colors hover:border-fg"
          >
            Watch demo
          </button>
        </div>
      </section>
    </div>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="border-line border">
      <div className={`${className} h-24 w-full`} />
      <div className="text-fg-mid p-2 text-xs" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
        {name}
      </div>
    </div>
  );
}
