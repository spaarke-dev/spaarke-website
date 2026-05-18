import type { Metadata } from "next";
import { Lede, Shell, Slab } from "@/components/primitives";
import { TakeTourCTAs } from "@/components/TakeTourCTAs";

// SSR per request so TakeTourCTAs receives a runtime-resolved
// RECAPTCHA_SITE_KEY (Azure SWA app settings are runtime-only).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Semantic Search Walkthrough",
  description:
    "A focused walkthrough of Spaarke's AI-powered semantic search — find documents by meaning, visualize their relationships, and connect them back to matters.",
  // Direct-link only — not surfaced in the public sitemap or search index.
  robots: { index: false, follow: true },
};

export default function SemanticSearchWalkthroughLanding() {
  return (
    <Slab tone="dark" className="pt-24 md:pt-32 pb-32 md:pb-40">
      <Shell>
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="font-mono-display text-fg-mid uppercase tracking-[0.18em]"
            style={{ fontSize: "clamp(11px, 0.85vw, 13px)" }}
          >
            Focused walkthrough
          </p>

          <h1
            className="font-display text-fg font-medium leading-[1.0] tracking-[-0.03em] mt-6"
            style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
          >
            Spaarke Semantic Search
            <br />
            Walkthrough
          </h1>

          <div className="mx-auto mt-8 max-w-3xl">
            <Lede className="text-balance">
              Find documents by meaning, not just keywords. Spaarke's AI
              semantic search indexes every document on ingestion, maps
              their relationships, and connects them back to matters —
              one module of the Spaarke Legal IQ stack.
            </Lede>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <p
              className="font-display font-medium tracking-[-0.005em]"
              style={{
                fontSize: "clamp(17px, 1.3vw, 22px)",
                lineHeight: 1.45,
              }}
            >
              <span className="text-fg">Enter your details to start the walkthrough.</span>
              <br />
              <span className="text-fg-mid">Takes about 3 minutes.</span>
            </p>
          </div>

          <div className="mt-10">
            <TakeTourCTAs
              recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
              targetPath="/tour/semantic-search-walkthrough"
              source="semantic-search-walkthrough"
            />
          </div>
        </div>
      </Shell>
    </Slab>
  );
}
