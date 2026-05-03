import Image from "next/image";
import {
  Eyebrow,
  Heading,
  Shell,
  Slab,
} from "@/components/primitives";
import { ProductChrome } from "@/components/ProductChrome";
import { capabilitiesContent } from "@/content/home/capabilities";

type Capability = (typeof capabilitiesContent.capabilities)[number];
type Foundation = typeof capabilitiesContent.foundation;

type CapabilitiesProps = {
  /** Centered title displayed above the stacked capability rows. */
  title?: string;
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

export function Capabilities({ title }: CapabilitiesProps = {}) {
  const { capabilities } = capabilitiesContent;

  return (
    <Slab tone="light" className="pb-0">
      {title && (
        <Shell>
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <Heading level={2}>{title}</Heading>
          </div>
        </Shell>
      )}
      {/*
        Each row is sticky and stacks on top of the previous one. min-h-[80vh]
        gives each subsection roughly a viewport of scroll dwell-time before
        the next row slides up to cover it. bg-bg keeps the row opaque so
        stacking reads cleanly.
      */}
      <div className="relative">
        {capabilities.map((cap) => (
          <CapabilityRow key={cap.id} capability={cap} />
        ))}
      </div>
    </Slab>
  );
}

function CapabilityRow({ capability }: { capability: Capability }) {
  const isImageLeft = capability.imagePosition === "left";

  return (
    <section
      id={capability.id}
      className="bg-bg border-line scroll-mt-28 sticky top-[72px] flex min-h-[640px] items-center border-t md:top-[88px] md:min-h-[80vh]"
    >
      <Shell>
        <div className="grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
          {/* Image */}
          <div className={isImageLeft ? "order-1" : "order-1 md:order-2"}>
            <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5">
              <ProductChrome />
              <Image
                src={capability.screenshot.src}
                alt={capability.screenshot.alt}
                width={capability.screenshot.width}
                height={capability.screenshot.height}
                sizes="(max-width: 768px) 100vw, 600px"
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* Text */}
          <div className={isImageLeft ? "order-2" : "order-2 md:order-1"}>
            <div className="text-fg-low font-mono text-[13px] font-medium tracking-[0.18em]">
              {capability.number}
            </div>
            <h3 className="font-display text-fg mt-3 text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {capability.name}
            </h3>
            <p className="text-fg-mid mt-5 max-w-md text-base leading-relaxed md:text-[17px]">
              {capability.body}
            </p>
            <div className="mt-8">
              <Eyebrow>Key features</Eyebrow>
            </div>
            <ul className="mt-4 space-y-2.5">
              {capability.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="text-fg flex items-baseline gap-3 text-[15px] font-medium"
                >
                  <span
                    aria-hidden="true"
                    className="bg-fg mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Shell>
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
