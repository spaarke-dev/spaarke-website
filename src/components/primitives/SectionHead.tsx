import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";
import { Lede } from "./Lede";

type SectionHeadProps = {
  /** Mono label above the headline. */
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Centered heads are for closing bands only; body sections stay left-aligned. */
  center?: boolean;
  /** A darker eyebrow where the band needs more contrast. */
  eyebrowClassName?: string;
  className?: string;
};

/**
 * The section header from the Services page, shared site-wide (design pass
 * R1, 2026-11-23): mono eyebrow, balanced H2 (no hand-placed line breaks),
 * optional lede. Left-aligned by default.
 */
export function SectionHead({
  eyebrow,
  title,
  intro,
  center,
  eyebrowClassName,
  className,
}: SectionHeadProps) {
  const wrap = [center ? "mx-auto max-w-4xl text-center" : "max-w-4xl", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={wrap}>
      <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>
      <Heading level={2} className="mt-5 text-balance">
        {title}
      </Heading>
      {intro ? (
        <div className={center ? "mx-auto mt-6 max-w-3xl" : "mt-6 max-w-3xl"}>
          <Lede>{intro}</Lede>
        </div>
      ) : null}
    </div>
  );
}
