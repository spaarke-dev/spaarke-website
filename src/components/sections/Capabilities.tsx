import Image from "next/image";
import {
  Eyebrow,
  Heading,
  Lede,
  Shell,
  Slab,
} from "@/components/primitives";
import { CapabilityModule } from "@/components/sections/CapabilityModule";
import { capabilitiesContent } from "@/content/home/capabilities";

type Foundation = typeof capabilitiesContent.foundation;

type CapabilitiesProps = {
  /** Centered title displayed above the stacked capability rows. */
  title?: string;
  /** Optional subtitle / lede beneath the title. */
  subtitle?: string;
};

export function Foundation() {
  const { foundation } = capabilitiesContent;
  return (
    <Slab tone="light">
      <Shell>
        <FoundationCard foundation={foundation} />
      </Shell>
    </Slab>
  );
}

export function Capabilities({ title, subtitle }: CapabilitiesProps = {}) {
  const { capabilities } = capabilitiesContent;
  const hasHeader = Boolean(title || subtitle);

  // When there is no title/subtitle the parent page is providing the
  // intro (e.g. the dark→light gradient slab). Drop both top and
  // bottom padding so the first sticky module lands directly under
  // the previous section. Inline padding overrides Slab/Tailwind
  // arbitrary-value classes that don't always lose specificity to
  // pt-0/pb-0 utilities.
  return (
    <section
      data-tone="light"
      className="text-fg"
      style={{
        backgroundColor: "#f6f6f4",
        paddingTop: hasHeader ? "var(--spacing-section-y)" : 0,
        paddingBottom: 0,
      }}
    >
      {hasHeader && (
        <div
          // Sticky main-section title — inline styles for position +
          // top because Tailwind's arbitrary-value `top-[Npx]` classes
          // can fail to compile under v4 JIT (spec §16). bg covers
          // capability modules sliding under as user scrolls.
          className="z-20"
          style={{
            position: "sticky",
            top: 88,
            backgroundColor: "#f6f6f4",
          }}
        >
          <Shell>
            <div className="mx-auto max-w-3xl py-8 text-center md:py-10">
              {title && <Heading level={2}>{title}</Heading>}
              {subtitle && (
                <div className="mt-6">
                  <Lede>{subtitle}</Lede>
                </div>
              )}
            </div>
          </Shell>
        </div>
      )}
      {/*
        Each module is a direct sibling of the title block so all
        sticky elements share the same containing block (this <section>).
        Title pins at top-[72]/[88], modules pin at top-[220]/[260],
        and all stay pinned until the section's bottom is reached.
      */}
      {capabilities.map((cap) => (
        <CapabilityModule key={cap.id} capability={cap} />
      ))}
    </section>
  );
}

function FoundationCard({ foundation }: { foundation: Foundation }) {
  return (
    <div
      id="microsoft-foundation"
      className="bg-surface scroll-mt-28 rounded-3xl p-8 shadow-sm md:p-12"
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-center md:gap-16">
        {/* Left: copy */}
        <div>
          <Eyebrow>{foundation.eyebrow}</Eyebrow>
          <h2 className="font-display text-fg mt-4 text-2xl font-medium leading-tight tracking-tight md:text-3xl">
            {foundation.heading}
          </h2>
          <p className="text-fg-mid mt-5 max-w-md text-[15px] leading-relaxed">
            {foundation.body}
          </p>
        </div>

        {/* Right: 7 logo tiles */}
        <ul className="flex flex-wrap items-center justify-start gap-3 md:flex-nowrap md:justify-end md:gap-3">
          {foundation.logos.map((logo) => (
            <li
              key={logo.name}
              className="bg-surface border-line flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm"
              title={logo.name}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
