import type { CSSProperties } from "react";
import { Heading, Lede, Shell } from "@/components/primitives";
import { ArchitectureCompareSlider } from "@/components/ArchitectureCompareSlider";

/**
 * Two-column section with the same light-blue ambient backdrop as
 * the home-page MicrosoftNative section. Title left (1/3), four-
 * paragraph descriptive copy on the right (2/3). Below: centered
 * "One Platform. Two deployment models." subtitle for the
 * drag-to-reveal architecture compare slider.
 *
 * Both diagram SVGs (architecture-spaarke-hosted.svg and
 * architecture-customer-hosted.svg) share byte-identical coordinates
 * for every internal element so the wipe boundary lines up exactly
 * — only the surrounding section frames differ.
 */
const SECTION_STYLE: CSSProperties = {
  backgroundColor: "#ebf2ff",
  backgroundImage:
    "radial-gradient(ellipse 80% 70% at 50% 100%, rgba(80,120,220,0.18) 0%, rgba(130,165,235,0.08) 35%, transparent 70%), linear-gradient(135deg, #f0f5ff 0%, #ebf2ff 45%, #d2e1ff 100%)",
  paddingTop: "clamp(100px, 12vh, 140px)",
  paddingBottom: "clamp(100px, 12vh, 140px)",
};

export function DeploymentModels() {
  return (
    <section
      data-tone="light"
      className="relative overflow-hidden"
      style={SECTION_STYLE}
    >
      <Shell>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 lg:gap-16">
          <div className="min-w-0 md:col-span-1">
            <Heading level={2}>
              Your data.
              <br />
              Your content.
              <br />
              <span className="text-fg-mid">Full control.</span>
            </Heading>
          </div>

          <div
            className="min-w-0 space-y-5 md:col-span-2"
            // Inline fallback for `md:col-span-2` in case the dev
            // compiler hasn't picked it up; same belt-and-suspenders
            // pattern MicrosoftNative uses.
            style={{ gridColumn: "span 2 / span 2" }}
          >
            <Lede className="w-full">
              Legal data is sensitive. And the content proprietary.
            </Lede>
            <Lede className="w-full">
              AI makes control of your data and content a critical imperative.
            </Lede>
            <Lede className="w-full">
              Most systems require you to move your data and AI processing into
              their environment&mdash;with limited visibility or control.
            </Lede>
            <Lede className="w-full">
              Spaarke is the only legal SaaS solution that offers the option of
              fully hosted or customer-tenant deployment&mdash;so your data,
              documents, and AI can run under your policies, in your
              environment, without compromise.
            </Lede>
          </div>
        </div>

        {/* Centered subtitle introducing the diagram */}
        <div className="mt-16 text-center md:mt-24">
          <Heading level={3}>One Platform. Two deployment models.</Heading>
        </div>

        {/* Compare slider — drag, click, or arrow-keys to wipe between
            Spaarke-hosted and Customer-hosted versions of the same
            architecture. */}
        <div className="mt-8 md:mt-10">
          <ArchitectureCompareSlider
            topSrc="/brand/diagrams/architecture-spaarke-hosted.svg"
            topAlt="Spaarke-hosted deployment architecture: Spaarke runs Platform Modules, Portal, Data & Analytics, and Infrastructure; the customer Microsoft 365 tenant connects via Entra ID, Exchange, SharePoint, and Copilot Studio."
            topLabel="Spaarke-Hosted"
            bottomSrc="/brand/diagrams/architecture-customer-hosted.svg"
            bottomAlt="Customer-tenant deployment architecture: Spaarke modules and portal sit alongside Infrastructure inside the customer's environment."
            bottomLabel="Customer-Hosted"
          />
          <p className="mt-4 text-center text-[13px] text-fg-mid">
            Drag the divider, click anywhere, or use ← → keys to compare
            hosting models.
          </p>
        </div>
      </Shell>
    </section>
  );
}
