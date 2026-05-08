import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Slab } from "@/components/primitives";
import ContactForm from "@/components/ContactForm";
import { SocialIcon } from "@/components/SocialIcons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Spaarke team.",
};

const SOCIAL_OPTIONS: {
  label: string;
  platform: "linkedin" | "x" | "bluesky";
  href: string;
  display: string;
}[] = [
  {
    label: "LinkedIn",
    platform: "linkedin",
    href: "https://www.linkedin.com/company/spaarke",
    display: "linkedin.com/company/spaarke",
  },
  {
    label: "X",
    platform: "x",
    href: "https://x.com/spaarke",
    display: "x.com/spaarke",
  },
  {
    label: "Bluesky",
    platform: "bluesky",
    href: "https://bsky.app/profile/spaarke.bsky.social",
    display: "spaarke.bsky.social",
  },
];

// Spaarke spectral palette — used for the gradient hairline under the
// headline. Order: blue → cyan → green → lime → yellow-green → yellow
// → orange → red.
const SPECTRAL_GRADIENT =
  "linear-gradient(90deg, #000BFF 0%, #00F7FF 14%, #1AFF00 28%, #8CFF00 42%, #DBFF00 56%, #FFD200 70%, #FF9400 85%, #FF4600 100%)";

export default function Contact() {
  return (
    <Slab tone="light" className="relative overflow-hidden">
      {/* Back-glow — same radial-spotlight pattern as the platform
          Capabilities ("Your ultimate system of truth") modules.
          Brand glow palette (#82A5EB / #5078DC), ellipse keyed to
          the left third so the bright pool sits behind the
          "Let's talk." mass and fades out across the form column. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 75% 60% at 30% 50%, rgba(130,165,235,0.18) 0%, rgba(80,120,220,0.08) 35%, rgba(130,165,235,0.03) 60%, transparent 78%)",
        }}
      />

      <Shell>
        {/* Two-column layout — flex with explicit widths is more
            reliable than arbitrary grid templates across the build
            pipeline. Capped at max-w-6xl + mx-auto so on wide displays
            the columns don't stretch to the Shell edges; the gap
            grows with the breakpoint to keep healthy whitespace
            between the headline column and the form column. */}
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 md:flex-row md:items-start md:gap-20 lg:gap-28 xl:gap-36">
          {/* Left rail — headline + spectral underline + lede + alt
              contact options. */}
          <div className="md:flex-1">
            <h1
              className="font-display text-fg font-medium tracking-[-0.03em]"
              style={{
                fontSize: "clamp(64px, 10vw, 144px)",
                lineHeight: 0.95,
              }}
            >
              Let&rsquo;s
              <br />
              talk.
            </h1>
            {/* Spectral hairline — picks up the full brand palette. The
                width is locked just under the headline width so it
                reads as a deliberate underline, not a divider. */}
            <div
              aria-hidden="true"
              className="mt-6 h-[2px] w-72 max-w-full"
              style={{ background: SPECTRAL_GRADIENT }}
            />

            <p className="text-fg-mid mt-10 max-w-md text-base leading-relaxed md:text-[17px]">
              Have a question, a partnership idea, or want to see Spaarke
              live? Send a note and we&rsquo;ll come back to you ASAP!
            </p>

            {/* Other ways to reach us */}
            <div className="mt-12">
              <p className="text-fg-low font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
                Other ways to reach us
              </p>
              <ul className="mt-5 space-y-3">
                {/* Email */}
                <li>
                  <a
                    href="mailto:contactus@spaarke.com"
                    className="group flex items-center gap-3 text-sm"
                  >
                    <span className="border-line-strong text-fg-mid group-hover:border-cta-blue group-hover:text-cta-blue inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border transition-colors">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 7l9 6 9-6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-fg-mid group-hover:text-fg transition-colors">
                      contactus@spaarke.com
                    </span>
                  </a>
                </li>
                {/* Social */}
                {SOCIAL_OPTIONS.map((opt) => (
                  <li key={opt.platform}>
                    <Link
                      href={opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-sm"
                    >
                      <span className="border-line-strong text-fg-mid group-hover:border-cta-blue group-hover:text-cta-blue inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border transition-colors">
                        <SocialIcon
                          platform={opt.platform}
                          className="h-4 w-4"
                        />
                      </span>
                      <span className="text-fg-mid group-hover:text-fg transition-colors">
                        {opt.display}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right rail — form */}
          <div className="md:flex-1 md:pt-2">
            <ContactForm
              recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
            />
          </div>
        </div>
      </Shell>
    </Slab>
  );
}
