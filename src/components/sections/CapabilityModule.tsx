"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/primitives";
import type { Capability } from "@/content/home/capabilities";

/**
 * One sticky-stack capability module.
 *
 * Header (left-aligned, full width): capability name + description.
 * Body (2-col): left = active feature's screenshot inside a hairline
 * frame (no shadow), masked to a fixed aspect-ratio window so the
 * rendered image stays crisp; right = clickable feature list with a
 * subtle hairline divider and a left accent bar marking the active
 * feature.
 *
 * Resolution note: screenshots are object-cover + object-top — the
 * source is scaled down (never up) and the bottom is cropped. Display
 * size never exceeds source dimensions, so pixels stay crisp.
 */
export function CapabilityModule({ capability }: { capability: Capability }) {
  const [activeId, setActiveId] = useState(capability.features[0]?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const active =
    capability.features.find((f) => f.id === activeId) ?? capability.features[0];

  // IntersectionObserver — fade the radial glow in when this section
  // is the active one in the sticky-stack. The rootMargin pulls the
  // detection band toward the upper-middle of the viewport so the
  // glow lights up around the time the section "pins" under the
  // header rather than the moment it first scrolls in.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      {
        rootMargin: "-120px 0px -40% 0px",
        threshold: 0,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={capability.id}
      ref={sectionRef}
      // Inline position+top because Tailwind v4 arbitrary `top-[Npx]`
      // classes can fail to compile (spec §16). Without compiled top
      // value, sticky has no anchor and falls back to static.
      className="bg-bg scroll-mt-28"
      style={{
        position: "sticky",
        top: 420,
      }}
    >
      {/* Radial spotlight glow — fades in when this capability is the
          active section in the sticky-stack. Positioned to spotlight
          the screenshot column on desktop; ambient on mobile. Built
          from the brand glow palette (#82A5EB / #5078DC). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 motion-safe:transition-opacity motion-safe:duration-1000"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 75% 60% at 30% 50%, rgba(130,165,235,0.18) 0%, rgba(80,120,220,0.08) 35%, rgba(130,165,235,0.03) 60%, transparent 78%)",
          opacity: isInView ? 1 : 0,
        }}
      />

      <Shell>
        <div className="relative px-2 py-16 md:px-6 md:py-24">
          {/* Capability header — left-aligned, full width */}
          <header className="max-w-5xl">
            <h3 className="font-display text-fg text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-[44px]">
              {capability.name}
            </h3>
            <p className="font-display text-fg-mid mt-4 text-[17px] font-normal leading-relaxed md:whitespace-nowrap md:text-[19px]">
              {capability.description}
            </p>
          </header>

          {/* 2-col body: 50/50 image / text */}
          <div className="mt-10 grid grid-cols-1 items-start gap-10 md:mt-14 md:grid-cols-2 md:gap-12 lg:gap-16">
            {/* Left: screenshot — hairline frame, masked to a fixed
                aspect window. object-cover + top anchor crops the
                bottom of taller screenshots without scaling them up. */}
            <div className="md:sticky md:top-[120px]">
              <div
                className="relative overflow-hidden rounded-lg"
                style={{
                  border: "1px solid rgba(10,10,10,0.10)",
                  backgroundColor: "#ffffff",
                  aspectRatio: "4 / 3",
                  boxShadow:
                    "0 24px 48px -12px rgba(15, 23, 42, 0.18), 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.06)",
                }}
              >
                <Image
                  key={active?.id}
                  src={active.screenshot.image}
                  alt={active.screenshot.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  placeholder="blur"
                  className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
                  style={{
                    objectFit: "cover",
                    objectPosition: "left top",
                  }}
                />
              </div>

              {/* Pagination dots — one per feature, current is filled
                  brand blue and slightly wider; clicking any dot also
                  swaps the screenshot. */}
              <div
                role="tablist"
                aria-label={`${capability.name} screenshots`}
                className="mt-5 flex items-center justify-center gap-2"
              >
                {capability.features.map((feature) => {
                  const isActive = feature.id === activeId;
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Show ${feature.name} screenshot`}
                      onClick={() => setActiveId(feature.id)}
                      className="cursor-pointer rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]/40"
                      style={{
                        height: "6px",
                        width: isActive ? "18px" : "6px",
                        backgroundColor: isActive
                          ? "#5078DC"
                          : "rgba(10,10,10,0.22)",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Right: feature list — space-y adds visible gap between
                rows so each reads as its own unit (now that dividers
                are gone). */}
            <ul
              role="list"
              className="space-y-3 md:space-y-4"
            >
              {capability.features.map((feature) => {
                const isActive = feature.id === activeId;
                return (
                  <li key={feature.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(feature.id)}
                      onMouseEnter={() => setHoveredId(feature.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(feature.id)}
                      onBlur={() => setHoveredId(null)}
                      aria-pressed={isActive}
                      className="relative block w-full cursor-pointer text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]/40"
                      style={{
                        paddingTop: "10px",
                        paddingRight: "10px",
                        paddingBottom: "20px",
                        paddingLeft: "20px",
                        backgroundColor:
                          isActive || feature.id === hoveredId
                            ? "rgba(80,120,220,0.06)"
                            : undefined,
                      }}
                    >
                      {/* Left accent bar — visible only for the active
                          feature. Subtle, brand blue. */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 transition-opacity"
                        style={{
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          backgroundColor: "#5078DC",
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                      <h4
                        className="font-display text-[20px] font-medium leading-snug tracking-tight transition-colors md:text-[22px]"
                        style={{
                          color: isActive ? "#0a0a0a" : "rgba(10,10,10,0.78)",
                        }}
                      >
                        {feature.name}
                      </h4>
                      <p
                        className="font-display mt-2 text-[14px] font-normal leading-relaxed transition-colors md:text-[15px]"
                        style={{
                          color: isActive
                            ? "rgba(10,10,10,0.74)"
                            : "rgba(10,10,10,0.60)",
                        }}
                      >
                        {feature.description}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Shell>
    </section>
  );
}
