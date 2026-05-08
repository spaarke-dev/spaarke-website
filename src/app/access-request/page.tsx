import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Slab } from "@/components/primitives";
import DemoRequestForm from "@/components/DemoRequestForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get access",
  description:
    "Request evaluation access to Spaarke — the shared platform for legal departments, business stakeholders, and outside counsel.",
};

// Spaarke spectral palette — used for the gradient hairline under the
// headline (matches the contact-us treatment).
const SPECTRAL_GRADIENT =
  "linear-gradient(90deg, #000BFF 0%, #00F7FF 14%, #1AFF00 28%, #8CFF00 42%, #DBFF00 56%, #FFD200 70%, #FF9400 85%, #FF4600 100%)";

export default function AccessRequest() {
  return (
    <Slab tone="dark" className="relative overflow-hidden">
      {/* Back-glow — same radial-spotlight pattern as the platform
          Capabilities ("Your ultimate system of truth") modules and
          the contact-us page. Brand glow palette (#82A5EB / #5078DC),
          ellipse keyed to the left third so the bright pool sits
          behind the headline mass and fades across to the form. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 75% 60% at 30% 50%, rgba(130,165,235,0.18) 0%, rgba(80,120,220,0.08) 35%, rgba(130,165,235,0.03) 60%, transparent 78%)",
        }}
      />

      <Shell>
        {/* Two-column layout — matches the contact us page. Capped at
            max-w-6xl + mx-auto so the columns don't stretch to the
            Shell edges on wide displays; gap grows with the viewport. */}
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 md:flex-row md:items-start md:gap-20 lg:gap-28 xl:gap-36">
          {/* Left rail — 3-line headline + spectral underline +
              description + trust strip + benefits + alt-contact link. */}
          <div className="md:flex-1">
            <h1
              className="font-display text-fg font-medium tracking-[-0.03em]"
              style={{
                fontSize: "clamp(56px, 8.5vw, 128px)",
                lineHeight: 0.95,
              }}
            >
              Request
              <br />
              Evaluation
              <br />
              Access
            </h1>
            <div
              aria-hidden="true"
              className="mt-6 h-[2px] w-72 max-w-full"
              style={{ background: SPECTRAL_GRADIENT }}
            />

            <div className="text-fg-mid mt-10 max-w-md space-y-5 text-base leading-relaxed md:text-[17px]">
              <p>
                Evaluate Spaarke&rsquo;s Legal Operations Intelligence
                platform in a guided environment designed for corporate
                legal departments and law firms.
              </p>
              <p>
                Request access to explore workflows, collaboration, AI
                capabilities, document intelligence, spend management,
                and operational visibility across legal work.
              </p>
            </div>

            <p className="text-fg-low mt-12 text-sm">
              Have a question first?{" "}
              <Link href="/contact" className="text-cta-blue underline">
                Contact us
              </Link>{" "}
              instead.
            </p>
          </div>

          {/* Right rail — form (no card wrapper, matching contact us) */}
          <div className="md:flex-1 md:pt-2">
            <DemoRequestForm
              recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
            />
          </div>
        </div>
      </Shell>
    </Slab>
  );
}
