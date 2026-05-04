import type { CSSProperties } from "react";
import { Heading, Lede, Shell } from "@/components/primitives";
import { pillarsContent } from "@/content/home/pillars";

type PillarsProps = {
  /** Centered title displayed above the three pillar cards. */
  title?: string;
  /** Optional subtitle / lede beneath the title. */
  subtitle?: string;
};

/**
 * Section bg fades from cream (#f6f6f4 — matches the Platform hero
 * above) at the top through the blue-glow palette to solid #0a0a0a,
 * with cream→dark resolved by ~50% of the section. The title sits
 * at the TOP of the section in the cream zone (dark text); the
 * cards sit further down in the solid-dark zone (white text).
 */
const SECTION_STYLE: CSSProperties = {
  background:
    "linear-gradient(to bottom, #f6f6f4 0%, #f6f6f4 8%, #ebf2ff 18%, #b3c4dc 28%, #1a1f2e 40%, #0a0a0a 50%, #0a0a0a 100%)",
  paddingTop: "clamp(20px, 3vh, 40px)",
  paddingBottom: "clamp(80px, 12vh, 160px)",
};

// Title sits in the cream/light top zone — dark text override.
const LIGHT_ZONE_STYLE = {
  "--v2-fg": "#0a0a0a",
  "--v2-fg-mid": "rgba(10, 10, 10, 0.62)",
} as CSSProperties;

export function Pillars({ title, subtitle }: PillarsProps = {}) {
  const { pillars } = pillarsContent;

  return (
    <section data-tone="light" style={SECTION_STYLE}>
      <Shell>
        {(title || subtitle) && (
          // No max-w constraint on the wrapper — when the subtitle uses
          // whitespace-nowrap and is wider than max-w-3xl (768px), it
          // overflows asymmetrically and looks off-centre. Letting the
          // wrapper span the full Shell width keeps both lines centred
          // around the same axis.
          <div className="text-center" style={LIGHT_ZONE_STYLE}>
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <div className="mt-6">
                <Lede className="md:whitespace-nowrap">{subtitle}</Lede>
              </div>
            )}
          </div>
        )}
        {/* Big top margin pushes the cards down past the gradient
            transition band into the solid-dark zone (~50%+ of section). */}
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
          style={{ marginTop: "clamp(220px, 32vh, 380px)" }}
        >
          {pillars.map((pillar) => (
            <article
              key={pillar.cardLabel}
              className="flex flex-col rounded-3xl p-8 shadow-sm md:p-10"
              style={{ backgroundColor: "#111111" }}
            >
              <h3 className="font-display text-xl font-medium leading-tight tracking-tight whitespace-pre-line text-white md:text-2xl">
                {pillar.headline}
              </h3>
              <p
                className="mt-5 text-[15px] leading-relaxed md:text-base"
                style={{ color: "rgba(255, 255, 255, 0.66)" }}
              >
                {pillar.operationalClaim}
              </p>
              <div
                className="my-8 border-t"
                style={{ borderColor: "rgba(255, 255, 255, 0.10)" }}
              />
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.66)" }}
              >
                {pillar.callback}
              </p>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
}
