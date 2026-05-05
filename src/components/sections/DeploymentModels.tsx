import type { CSSProperties } from "react";
import { Heading, Lede, Shell } from "@/components/primitives";

/**
 * Two-column section with the same light-blue ambient backdrop as
 * the home-page MicrosoftNative section. Title left (1/3), descriptive
 * paragraph right (2/3). Used on /platform after the Capabilities
 * sticky-stack to introduce the SaaS-vs-tenant deployment story.
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
            // Inline fallback for `md:col-span-2` in case the dev
            // compiler hasn't picked it up; same belt-and-suspenders
            // pattern MicrosoftNative uses.
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
      </Shell>
    </section>
  );
}
