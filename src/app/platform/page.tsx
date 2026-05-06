import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { IsometricScroller } from "@/components/IsometricScroller";
import { PlatformHeroCTAs } from "@/components/PlatformHeroCTAs";
import { Button } from "@/components/primitives";
import {
  Pillars,
  Capabilities,
  DeploymentModels,
} from "@/components/sections";

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
          minHeight: "92vh",
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
            <PlatformHeroCTAs
              recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
            />
          </div>
        </div>
      </section>

      <Pillars
        title={
          <>
            The Legal IQ system
            <br />
            of record
          </>
        }
        subtitle="A single system where legal work, data, and decisions come together."
      />

      {/* Hard cut from the dark Pillars section into the cream
          Capabilities section. The title + subtitle live inside the
          Capabilities section so they read as part of the same
          visual moment as the modules below. */}
      <Capabilities
        title={
          <>
            Spaarke is
            <br />
            your ultimate system of truth
          </>
        }
        subtitle="Everything your legal team needs—built into one system"
      />
      <SpaarkeAI />
      <DeploymentModels />
      <PlatformClosing />
    </>
  );
}

const SPAARKE_AI_STYLE: CSSProperties = {
  backgroundColor: "#0a0a0a",
  paddingTop: "clamp(80px, 12vh, 140px)",
  paddingBottom: "clamp(80px, 12vh, 140px)",
};

const SPAARKE_AI_DARK_TOKENS: CSSProperties = {
  "--v2-fg": "#ffffff",
  "--v2-fg-mid": "rgba(255, 255, 255, 0.7)",
} as CSSProperties;

function SpaarkeAI() {
  return (
    <section
      data-tone="dark"
      className="relative overflow-hidden"
      style={SPAARKE_AI_STYLE}
    >
      <div
        className="mx-auto max-w-[1440px] px-[var(--spacing-shell-x)]"
        style={SPAARKE_AI_DARK_TOKENS}
      >
        <div className="mx-auto max-w-5xl text-center">
          <h2
            className="font-display text-fg font-medium leading-[1.05] tracking-[-0.025em] text-balance"
            style={{ fontSize: "clamp(34px, 4.5vw, 64px)" }}
          >
            Legal AI built into the system
            <br />
            —not bolted on
          </h2>
          <p
            className="font-body text-fg-mid mx-auto mt-8 max-w-3xl"
            style={{
              fontSize: "clamp(18px, 1.4vw, 25px)",
              lineHeight: 1.5,
            }}
          >
            Spaarke AI brings generative, agentic, autonomous capabilities
            <br />
            into the legal operations platform
          </p>
        </div>

        {/* Architecture diagram — full-width inside the section's
            shell padding, dark-pane treatment matching the Pillars
            section. Reduced inner padding so the SVG content can
            occupy nearly the full pane width. Hidden below md:
            the diagram is dense reference content with small text
            labels that don't read on phones; a short prose summary
            substitutes there. */}
        <div
          className="mt-16 hidden overflow-hidden rounded-3xl border md:mt-20 md:block"
          style={{
            backgroundColor: "#111111",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow:
              "0 30px 80px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
          }}
        >
          <div className="p-3 sm:p-4 md:p-6">
            <img
              src="/brand/diagrams/spaarke-ai-architecture.svg"
              alt="Spaarke AI architecture: generative, agentic, and autonomous AI capabilities grounded in matters, documents, workflows, and the Microsoft environment."
              className="block h-auto w-full"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Mobile prose substitute — same content as the diagram,
            optimized for narrow viewports. */}
        <p
          className="font-body text-fg-mid mx-auto mt-12 max-w-md text-center md:hidden"
          style={{ fontSize: "16px", lineHeight: 1.6 }}
        >
          Spaarke AI grounds Foundry IQ knowledge, Copilot Studio
          orchestration, and the Agent Framework in your matters,
          documents, emails, and tasks—surfacing as generative,
          agentic, and autonomous capabilities across Teams,
          Outlook, Word, and Microsoft 365.
        </p>
      </div>
    </section>
  );
}

const PLATFORM_CLOSING_STYLE: CSSProperties = {
  backgroundColor: "#000000",
  paddingTop: "clamp(80px, 10vh, 120px)",
  paddingBottom: "clamp(120px, 16vh, 200px)",
};

const PLATFORM_CLOSING_DARK_TOKENS: CSSProperties = {
  "--v2-fg": "#ffffff",
  "--v2-fg-mid": "rgba(255, 255, 255, 0.7)",
} as CSSProperties;

function PlatformClosing() {
  return (
    <section
      className="relative overflow-hidden"
      style={PLATFORM_CLOSING_STYLE}
    >
      <div
        className="mx-auto max-w-5xl px-[var(--spacing-shell-x)] text-center"
        style={PLATFORM_CLOSING_DARK_TOKENS}
      >
        {/* Word-only Spaarke logo replaces the textual headline. The
            SVG is white-on-transparent so it sits cleanly on the
            #000 backdrop. h-auto + width clamp keeps the logo
            proportional and roughly headline-scaled. */}
        <h2 className="m-0 flex justify-center">
          <span className="sr-only">Spaarke</span>
          <img
            src="/brand/logos/spaarke-white-word-logo.svg"
            alt=""
            aria-hidden="true"
            className="h-auto"
            style={{ width: "clamp(220px, 32vw, 440px)" }}
          />
        </h2>
        <p
          className="font-display text-fg mx-auto mt-8 max-w-4xl font-medium leading-tight tracking-tight"
          style={{ fontSize: "clamp(22px, 3vw, 40px)" }}
        >
          A single system for legal work, data, and decisions.
          <br />
          <span className="whitespace-nowrap">
            Not another tool. A new way to run legal.
          </span>
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Button variant="primary" href="/access-request">
            Get access
          </Button>
          <Button variant="text" href="/contact" arrow>
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
