import type { Metadata } from "next";
import { IsometricScroller } from "@/components/IsometricScroller";
import { PlatformHeroCTAs } from "@/components/PlatformHeroCTAs";
import { Pillars, Capabilities, Foundation } from "@/components/sections";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "The Spaarke platform — one platform, all sides, every matter. Operations, Documents & Knowledge, Collaboration, Agents & Automation, Spend & Performance, on a Microsoft 365 foundation.",
};

export default function Platform() {
  return (
    <>
      {/* Hero — animated isometric scroller backdrop biased to the
          top-right, headline anchored top-left. Adapted from the
          design handoff at resources/backgrounds/design_handoff_platform_hero/. */}
      <section
        data-tone="light"
        className="relative isolate overflow-hidden"
        style={{
          background: "#f6f6f4",
          // Hero fills the first viewport so the dark Pillars section
          // never peeks in before the user scrolls.
          minHeight: "100vh",
        }}
      >
        {/* Backdrop (z-0) — iso-scroller + left wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <IsometricScroller
            theme="light"
            height="100%"
            anchor="top-right"
          />
          {/* Left-edge wash so the scroller dissolves into the page
              behind the headline rather than meeting it as a hard line. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #f6f6f4 0%, rgba(246,246,244,0.9) 18%, rgba(246,246,244,0.4) 38%, rgba(246,246,244,0) 58%)",
            }}
          />
        </div>


        {/* Foreground — vertically centered so the headline + tagline +
            CTAs sit in the middle of the 100vh hero with breathing
            room above and below. */}
        <div
          className="relative z-10 mx-auto flex max-w-[1440px] items-center px-[var(--spacing-shell-x)]"
          style={{
            paddingTop: "clamp(38px, 5.6vh, 90px)",
            paddingBottom: "clamp(34px, 5vh, 67px)",
            minHeight: "inherit",
          }}
        >
          <div>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(56px, 7vw, 112px)",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
                fontWeight: 600,
                color: "#0a0a0a",
                margin: 0,
                maxWidth: "14ch",
              }}
            >
              One platform.
              <br />
              All sides.
              <br />
              Every matter.
            </h1>
            <p
              className="font-body mt-8 whitespace-nowrap"
              style={{
                fontSize: "clamp(20px, 1.6vw, 28px)",
                lineHeight: 1.4,
                color: "rgba(10, 10, 10, 0.66)",
              }}
            >
              All your legal work—connected.
            </p>
            <PlatformHeroCTAs />
          </div>
        </div>
      </section>

      <Pillars
        title="Your system of truth."
        subtitle="All information connected in a single system where everything works together."
      />
      <Capabilities title="Inside the platform." />
      <Foundation />
    </>
  );
}
