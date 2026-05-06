import type { CSSProperties } from "react";
import { Heading, Lede, Shell } from "@/components/primitives";
import { microsoftNativeContent } from "@/content/home/microsoft-native";

/**
 * Background pulls the same blue / light-blue stops used in the
 * ExistingSystems fade (#ebf2ff, #d2e1ff, #b3c4dc) so this section
 * reads as the same "ambient blue light" continued. Soft radial
 * pool at the bottom-center evokes the hero footlight glow in light
 * mode.
 */
const SECTION_STYLE: CSSProperties = {
  backgroundColor: "#ebf2ff",
  backgroundImage:
    "radial-gradient(ellipse 80% 70% at 50% 100%, rgba(80,120,220,0.18) 0%, rgba(130,165,235,0.08) 35%, transparent 70%), linear-gradient(135deg, #f0f5ff 0%, #ebf2ff 45%, #d2e1ff 100%)",
  paddingTop: "clamp(100px, 12vh, 140px)",
  paddingBottom: "clamp(100px, 12vh, 140px)",
};

export function MicrosoftNative() {
  const { heading, intro } = microsoftNativeContent;

  return (
    <section
      data-tone="light"
      className="relative overflow-hidden"
      style={SECTION_STYLE}
    >
      <Shell>
        {/* Two-column layout via bedrock grid utilities: 3-column grid
            with title spanning 1 col (1/3) and the right block spanning
            2 cols (2/3). Tagline above diagram, both stacked in the
            right block. */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 lg:gap-16">
          <div className="md:col-span-1 min-w-0">
            <Heading level={2}>
              {heading.line1}
              <br />
              <span className="text-fg-mid">{heading.line2}</span>
            </Heading>
          </div>

          <div
            className="md:col-span-2 min-w-0"
            // Inline fallback in case the Tailwind dev compiler hasn't
            // picked up `md:col-span-2`; safe at all breakpoints because
            // mobile (grid-cols-1) auto-clamps to the available track.
            style={{ gridColumn: "span 2 / span 2" }}
          >
            <Lede className="w-full">{intro}</Lede>
            <div className="mt-10 w-full md:mt-14">
              {/* Hub-and-spoke diagram — pre-rendered SVG with white
                  logo pads, transparent bg, drop shadows. Lives in
                  /public/brand/diagrams/. Loaded via <object> so the
                  slimmed SVG can resolve external <image href> refs
                  for the embedded Microsoft logos. */}
              <object
                data="/brand/diagrams/microsoft-connect-v2-light.svg"
                type="image/svg+xml"
                aria-label="Spaarke connects into Microsoft 365 Copilot, which radiates out to Outlook, Teams, SharePoint, Microsoft 365 Apps, Power Platform, and Azure AI Foundry."
                className="block w-full"
                style={{ aspectRatio: "980 / 660" }}
              />
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
