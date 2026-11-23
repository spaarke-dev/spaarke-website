import type { CSSProperties, ReactNode } from "react";
import { SectionHead, Shell } from "@/components/primitives";
import { InlineSvg } from "@/components/InlineSvg";

type PillarsProps = {
  /** Title displayed above the architecture diagram. */
  title?: ReactNode;
  /** Mono label above the title. */
  eyebrow?: string;
  /** Optional subtitle / lede beneath the title. */
  subtitle?: string;
};

/**
 * Solid-dark section. Title + tagline sit at the top in white type;
 * the platform-architecture SVG sits below in a subtly framed
 * container so its internal elements have more visual presence.
 */
const SECTION_STYLE: CSSProperties = {
  backgroundColor: "#0a0a0a",
  paddingTop: "clamp(80px, 10vh, 140px)",
  paddingBottom: "clamp(80px, 12vh, 160px)",
};

const DARK_ZONE_STYLE = {
  "--v2-fg": "#ffffff",
  "--v2-fg-mid": "rgba(255, 255, 255, 0.7)",
} as CSSProperties;

export function Pillars({ title, subtitle, eyebrow = "Platform architecture" }: PillarsProps = {}) {
  return (
    <section data-tone="dark" style={SECTION_STYLE}>
      <Shell>
        {title && (
          <div style={DARK_ZONE_STYLE}>
            <SectionHead eyebrow={eyebrow} title={title} intro={subtitle} />
          </div>
        )}

        {/* Diagram frame: the Services treatment (16px radius, hairline
            border, faint fill, no drop shadow). */}
        <div className="border-line-strong mt-14 overflow-hidden rounded-2xl border bg-[rgba(255,255,255,0.02)] md:mt-16">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Inlined SVG — slimmed SVGs reference external <image>
                files for the Microsoft logos, which only resolve when
                the SVG is part of the page DOM (not loaded as <img>
                or <object>). */}
            <InlineSvg
              src="/brand/diagrams/platform-arch-v3-dark.svg"
              className="block [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
              ariaLabel="Spaarke platform architecture: Microsoft Power Platform foundation, five Spaarke capability modules, Microsoft 365 surfaces, and Microsoft 365 Copilot."
            />
          </div>
        </div>
      </Shell>
    </section>
  );
}
