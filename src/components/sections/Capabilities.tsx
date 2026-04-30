import Image from "next/image";
import {
  Eyebrow,
  Shell,
  Slab,
} from "@/components/primitives";
import { capabilitiesContent } from "@/content/home/capabilities";

type Capability = (typeof capabilitiesContent.capabilities)[number];
type Foundation = typeof capabilitiesContent.foundation;

/**
 * Synthetic Spaarke app chrome bar — drawn above each capability screenshot
 * so the screenshots feel framed in the product without requiring fresh
 * captures that include the top bar.
 */
function ProductChrome() {
  return (
    <div
      data-tone="dark"
      className="bg-bg flex items-center gap-3 px-4 py-2.5"
      aria-hidden="true"
    >
      {/* 9-dot waffle */}
      <div className="grid grid-cols-3 gap-[3px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="bg-fg-mid block h-[3px] w-[3px] rounded-[1px]" />
        ))}
      </div>
      <Image
        src="/brand/logos/spaarke-logo-white.svg"
        alt=""
        width={70}
        height={20}
        className="h-4 w-auto"
      />
      <span className="text-fg-mid text-[11px]">Corporate Counsel</span>
      <div className="ml-auto flex items-center gap-2">
        <span className="border-line text-fg-mid rounded-md border px-2 py-0.5 text-[10px] font-medium">
          Copilot
        </span>
        <div className="bg-fg-mid h-2.5 w-2.5 rounded-full" />
      </div>
    </div>
  );
}

export function Capabilities() {
  const { capabilities, foundation } = capabilitiesContent;

  return (
    <Slab tone="light">
      <Shell>
        <div className="space-y-24 md:space-y-32">
          {capabilities.map((cap) => (
            <CapabilityRow key={cap.number} capability={cap} />
          ))}
        </div>

        <div className="mt-24 md:mt-32">
          <FoundationCard foundation={foundation} />
        </div>
      </Shell>
    </Slab>
  );
}

function CapabilityRow({ capability }: { capability: Capability }) {
  const isImageLeft = capability.imagePosition === "left";

  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
      {/* Image */}
      <div
        className={isImageLeft ? "order-1" : "order-1 md:order-2"}
      >
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
      <div
        className={isImageLeft ? "order-2" : "order-2 md:order-1"}
      >
        <h3 className="font-display text-fg text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
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
  );
}

function FoundationCard({ foundation }: { foundation: Foundation }) {
  return (
    <div className="bg-surface rounded-3xl p-8 shadow-sm md:p-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:gap-16 md:items-center">
        {/* Left: copy */}
        <div>
          <Eyebrow>{foundation.eyebrow}</Eyebrow>
          <h3 className="font-display text-fg mt-4 text-2xl font-medium leading-tight tracking-tight md:text-3xl">
            {foundation.heading}
          </h3>
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
