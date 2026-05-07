import type { CSSProperties } from "react";
import { Shell } from "@/components/primitives";
import { closingContent } from "@/content/home/closing";
import { TakeTourCTAs } from "@/components/TakeTourCTAs";

// Solid black background — the fade transition was distracting and
// taller than necessary. The hard boundary against the section above
// is now part of the design. Larger bottom padding gives breathing
// room between this CTA block and the SiteFooter beneath it.
const SECTION_STYLE: CSSProperties = {
  backgroundColor: "#000000",
  paddingTop: "clamp(80px, 10vh, 120px)",
  paddingBottom: "clamp(160px, 20vh, 240px)",
};

// Headline + tagline live in the dark zone (lower half of the section
// where the gradient is dark). Override v2 fg tokens so they render
// in white / muted-white regardless of section tone defaults.
const DARK_ZONE_STYLE = {
  "--v2-fg": "#ffffff",
  "--v2-fg-mid": "rgba(255, 255, 255, 0.7)",
} as CSSProperties;

export function Closing({ recaptchaSiteKey }: { recaptchaSiteKey: string }) {
  const { headline, tagline } = closingContent;

  return (
    <section className="relative overflow-hidden" style={SECTION_STYLE}>
      <Shell>
        <div
          className="relative mx-auto max-w-5xl text-center"
          style={DARK_ZONE_STYLE}
        >
          <h2
            className="font-display text-fg font-medium leading-[1.02] tracking-[-0.035em] text-balance"
            style={{ fontSize: "clamp(36px, 6vw, 80px)" }}
          >
            {headline}
          </h2>

          <p
            className="font-display text-fg mx-auto mt-8 max-w-3xl font-medium leading-tight tracking-tight"
            style={{ fontSize: "clamp(22px, 3vw, 40px)" }}
          >
            {tagline.line1}
            <br />
            {tagline.line2}
          </p>

          <TakeTourCTAs
            recaptchaSiteKey={recaptchaSiteKey}
            secondary={{ label: "See platform", href: "/platform" }}
          />
        </div>
      </Shell>
    </section>
  );
}
