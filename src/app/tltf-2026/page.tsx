import type { Metadata } from "next";
import { Eyebrow, Heading, Lede, Shell, Slab } from "@/components/primitives";
import { AskAiCard } from "@/components/AskAiCard";
import { InvestorOverviewForm } from "@/components/InvestorOverviewForm";
import { LetsMeetPanel } from "@/components/meet/LetsMeetPanel";

// Dynamic because the reCAPTCHA site key and the sign-off name are app
// settings read at request time.
export const dynamic = "force-dynamic";

const SOURCE = "tltf-2026";
const TITLE = "The Legal Technology Fund Summit 2026";
const DESCRIPTION =
  "Spaarke at The Legal Technology Fund Summit 2026: an overview of Spaarke, a briefing for your own AI assistant, the investor overview, and a time to meet.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tltf-2026" },
  openGraph: {
    title: `Spaarke at ${TITLE}`,
    description: DESCRIPTION,
    url: "/tltf-2026",
    images: [{ url: "/design-partners/og.png", width: 1200, height: 630 }],
  },
};

// Spaarke spectral palette, as under the /design-partners headline.
const SPECTRAL_GRADIENT =
  "linear-gradient(90deg, #000BFF 0%, #00F7FF 14%, #1AFF00 28%, #8CFF00 42%, #DBFF00 56%, #FFD200 70%, #FF9400 85%, #FF4600 100%)";

/**
 * The page behind the summit postcard's QR code (/go/more-info-1). Most
 * visitors arrive on a phone, so the page is one column there, with the
 * Let's meet bar pinned to the bottom; on a wide screen the meeting panel sits
 * in a sticky right-hand rail.
 */
export default function TltfSummit2026() {
  const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY ?? "";
  const contact = {
    name: process.env.MEET_SIGNATURE_NAME?.trim() || undefined,
    email: "contactus@spaarke.com",
  };

  return (
    <Slab tone="light">
      <Shell>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-20">
          <div>
            <Eyebrow>{TITLE}</Eyebrow>
            <Heading level={1} className="mt-6">
              Good to meet you
            </Heading>
            <div
              aria-hidden="true"
              className="mt-8 h-[2px] w-72 max-w-full"
              style={{ background: SPECTRAL_GRADIENT }}
            />

            <section aria-label="About Spaarke" className="mt-10 space-y-6">
              <Lede>
                Spaarke is a Legal Operations Intelligence platform built on its expert legal ontology: a single
                model of the matters, documents, requests, obligations, spend and decisions a legal team works on,
                the relationships among them, and the actions the team may take on them under rules it sets. That
                ontology is the foundation of Spaarke’s Legal IQ, which joins the team’s operational data, its
                institutional memory and AI inference, so that AI works from the full context of the team’s legal
                work.
              </Lede>
              <p className="text-fg-mid text-base leading-relaxed md:text-[17px]">
                The platform integrates and extends the legal team’s core systems, and it is designed to run where
                legal teams already work, with enterprise scale and governance. Spaarke delivers this as service as
                software: legal engineers work alongside the team to translate its knowledge and processes into the
                ontology, and managed services then run and improve the platform, one decision-focused use case at
                a time.
              </p>
            </section>

            <div className="border-line mt-14 border-t pt-12">
              <AskAiCard src={SOURCE} variant="page" providers={["claude", "chatgpt"]} />
            </div>

            <section
              id="investor-overview"
              aria-labelledby="investor-overview-heading"
              className="border-line mt-14 scroll-mt-32 border-t pt-12"
            >
              <h2
                id="investor-overview-heading"
                className="text-fg font-display text-2xl font-medium tracking-tight"
              >
                The investor overview
              </h2>
              <p className="text-fg-mid mt-3 mb-8 max-w-xl text-base leading-relaxed">
                A one-page summary of Spaarke for investors. Enter your work email to download the PDF, and we
                will email you the link as well.
              </p>
              <InvestorOverviewForm source={SOURCE} recaptchaSiteKey={recaptchaSiteKey} />
            </section>
          </div>

          <aside id="meet" aria-label="Book a meeting" className="scroll-mt-32 lg:self-start lg:sticky lg:top-28">
            <div className="lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <LetsMeetPanel src={SOURCE} recaptchaSiteKey={recaptchaSiteKey} contact={contact} openOnHash="meet" />
            </div>
          </aside>
        </div>
      </Shell>
    </Slab>
  );
}
