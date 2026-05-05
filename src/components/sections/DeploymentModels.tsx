import type { CSSProperties } from "react";
import { Heading, Lede, Shell } from "@/components/primitives";
import { ArchitectureCompareSlider } from "@/components/ArchitectureCompareSlider";

/**
 * Two-column section with the same light-blue ambient backdrop as
 * the home-page MicrosoftNative section. Title left (1/3), descriptive
 * paragraph right (2/3). Below: full-width drag-to-reveal slider that
 * compares the Spaarke-hosted vs Customer-hosted architecture.
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
              One platform.
              <br />
              <span className="text-fg-mid">Two deployment models.</span>
            </Heading>
          </div>

          <div
            className="min-w-0 md:col-span-2"
            style={{ gridColumn: "span 2 / span 2" }}
          >
            <Lede className="w-full">
              Spaarke can be delivered as a managed SaaS platform or deployed
              into the customer&rsquo;s own Microsoft tenant. Either way,
              organizations get the same Legal Operations Intelligence
              platform&mdash;built on Microsoft Azure, Power Platform,
              SharePoint Embedded, Exchange, Teams, Outlook, and Microsoft 365.
            </Lede>
          </div>
        </div>

        {/* Compare slider — drag, click, or arrow-keys to wipe between
            Spaarke-hosted and Customer-hosted versions of the same
            architecture. */}
        <div className="mt-12 md:mt-16">
          <ArchitectureCompareSlider
            topSrc="/brand/diagrams/architecture-spaarke-hosted.svg"
            topAlt="Spaarke-hosted deployment architecture: Spaarke runs Platform Modules, Portal, Data & Analytics, and Infrastructure; the customer Microsoft 365 tenant connects via Entra ID, Exchange, SharePoint, and Copilot Studio."
            topLabel="Spaarke-Hosted"
            bottomSrc="/brand/diagrams/architecture-customer-hosted.svg"
            bottomAlt="Customer-tenant deployment architecture: Spaarke modules and portal sit alongside Infrastructure and the Microsoft 365 tenant inside the customer's environment."
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
