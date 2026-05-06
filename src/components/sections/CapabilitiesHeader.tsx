"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Heading, Lede, Shell } from "@/components/primitives";

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** id of the LAST capability module — used to release the sticky
   * header so it scrolls away once the user reaches that row. Without
   * release the header keeps floating over the next section's top
   * during the natural-scroll gap between the last module unpinning
   * and the section ending. */
  lastCapabilityId: string;
};

/**
 * Sticky header for the Capabilities section. Pins at top:100 (under
 * the SiteHeader) and releases — i.e., goes back to position:relative
 * — once the last capability module's pin position is reached, so it
 * scrolls off-screen with the section instead of hovering over the
 * dark section that follows.
 */
export function CapabilitiesHeader({
  title,
  subtitle,
  lastCapabilityId,
}: Props) {
  const [released, setReleased] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Watch the last capability module. When its top crosses our
    // header-pin position (top:100 + ~header height), release.
    const last = document.getElementById(lastCapabilityId);
    if (!last || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Module is "active" (pinned at top of viewport) when its
        // top has crossed the threshold. rootMargin pulls the trigger
        // into the band where our header would otherwise float.
        setReleased(entry.isIntersecting);
      },
      {
        // Top edge of the trigger band sits where the title pins (100px),
        // bottom edge sits a bit below — this catches the last module
        // when it's pinned at top:380 (in CapabilityModule).
        rootMargin: "-380px 0px -50% 0px",
        threshold: 0,
      },
    );
    observer.observe(last);
    return () => observer.disconnect();
  }, [lastCapabilityId]);

  return (
    <div
      ref={sentinelRef}
      className="z-20"
      style={{
        // Once released, the title goes back to in-flow positioning
        // and scrolls away with the section. While not released, it
        // sticks under the SiteHeader (top:100 = h-12 logo + py-26).
        position: released ? "relative" : "sticky",
        top: 100,
        backgroundColor: "#f6f6f4",
        // Smooth transition so the release isn't a hard jump.
        transition: "opacity 200ms linear",
        opacity: released ? 0 : 1,
        pointerEvents: released ? "none" : "auto",
      }}
    >
      <Shell>
        <div className="mx-auto max-w-3xl py-12 text-center md:py-14">
          {title && <Heading level={2}>{title}</Heading>}
          {subtitle && (
            <div className="mt-6">
              <Lede>{subtitle}</Lede>
            </div>
          )}
        </div>
      </Shell>
    </div>
  );
}
