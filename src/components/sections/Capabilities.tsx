import Image from "next/image";
import type { ReactNode } from "react";
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
  title?: ReactNode;
  /** Optional subtitle / lede beneath the title. */
  subtitle?: ReactNode;
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
        <Shell>
          <div className="mx-auto max-w-3xl py-4 text-center md:py-6">
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <div className="mt-6">
                <Lede>{subtitle}</Lede>
              </div>
            )}
          </div>
        </Shell>
      )}
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
