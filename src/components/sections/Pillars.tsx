import type { CSSProperties, ReactNode } from "react";
import { Heading, Lede, Shell } from "@/components/primitives";

type PillarsProps = {
  /** Centered title displayed above the architecture diagram. */
  title?: ReactNode;
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

export function Pillars({ title, subtitle }: PillarsProps = {}) {
  return (
    <section data-tone="dark" style={SECTION_STYLE}>
      <Shell>
        {(title || subtitle) && (
          <div className="text-center" style={DARK_ZONE_STYLE}>
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <div className="mt-6">
                <Lede className="md:whitespace-nowrap">{subtitle}</Lede>
              </div>
            )}
          </div>
        )}

        {/*
          Diagram container — slightly elevated dark surface (#111)
          with a hairline rim, inset top highlight, and a soft
          drop-shadow. Same visual language as the home-page LOI
          mockup container, gives the architecture SVG its own
          "pane" so the internal elements read as a composed unit
          instead of floating loose on the section bg. Padded so the
          SVG has breathing room inside the frame.
        */}
        <div
          className="mx-auto mt-16 max-w-6xl overflow-hidden rounded-3xl border md:mt-20"
          style={{
            backgroundColor: "#111111",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow:
              "0 30px 80px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
          }}
        >
          <div className="p-6 sm:p-8 md:p-10">
            {/* <object> instead of <img> so the slimmed SVG can resolve
                external <image href="..."> references for the embedded
                Microsoft logos. Browsers sandbox external loads in
                <img>-mode SVG; <object> renders as a document. */}
            <object
              data="/brand/diagrams/platform-arch-v3-dark.svg"
              type="image/svg+xml"
              aria-label="Spaarke platform architecture: Microsoft Power Platform foundation, five Spaarke capability modules, Microsoft 365 surfaces, and Microsoft 365 Copilot."
              className="block w-full"
              style={{ aspectRatio: "1280 / 790" }}
            />
          </div>
        </div>
      </Shell>
    </section>
  );
}
