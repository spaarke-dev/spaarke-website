import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Slab } from "@/components/primitives";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Spaarke team.",
};

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Send a note",
    body: "Tell us briefly what you're exploring or what you'd like to see.",
  },
  {
    n: "02",
    title: "We reply",
    body: "Within one or two business days, from a real person on the team.",
  },
  {
    n: "03",
    title: "We connect",
    body: "If it's a fit, we schedule a working session — no canned demos.",
  },
];

export default function Contact() {
  return (
    <Slab tone="dark" className="relative overflow-hidden">
      {/* Top ambient glow — same brand language as the home / why-spaarke
          heroes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 25%, rgba(180,205,255,0.14) 0%, rgba(80,120,220,0.06) 35%, rgba(0,0,0,0) 70%)",
        }}
      />
      {/* Decorative gradient orb behind the form card on desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12%] top-[20%] hidden h-[42rem] w-[42rem] lg:block"
        style={{
          background:
            "radial-gradient(circle, rgba(80,120,220,0.18) 0%, rgba(80,120,220,0.06) 35%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
        }}
      />

      <Shell>
        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[5fr_6fr] lg:gap-20">
          {/* Left rail */}
          <div className="lg:pt-2">
            <p className="text-fg-low font-mono text-[11px] uppercase tracking-[0.18em]">
              Contact
            </p>
            <h1
              className="font-display text-fg mt-4 font-medium leading-[1.0] tracking-[-0.03em]"
              style={{ fontSize: "clamp(44px, 5.5vw, 80px)" }}
            >
              Let&rsquo;s talk.
            </h1>
            <p className="text-fg-mid mt-6 max-w-md text-base leading-relaxed md:text-[17px]">
              Have a question, a partnership idea, or want to see Spaarke
              live? Send a note and we&rsquo;ll come back to you. We answer
              every message — there&rsquo;s no marketing autoresponder on
              the other end.
            </p>

            {/* Process steps — numbered, light hairline circles, copy
                aligned to the right of each numeral. Visual rhythm
                anchors the page. */}
            <ol className="mt-12 space-y-7">
              {STEPS.map((step) => (
                <li key={step.n} className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="border-line-strong text-fg-mid font-mono mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-medium tracking-[0.08em]"
                  >
                    {step.n}
                  </span>
                  <div>
                    <p className="text-fg font-display text-base font-medium tracking-tight">
                      {step.title}
                    </p>
                    <p className="text-fg-mid mt-1 text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Alt contact paths */}
            <div className="border-line mt-12 border-t pt-8">
              <p className="text-fg-low font-display text-xs font-medium uppercase tracking-wider">
                Other ways to reach us
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="text-fg-mid">
                  Email{" "}
                  <a
                    href="mailto:contactus@spaarke.com"
                    className="text-cta-blue underline"
                  >
                    contactus@spaarke.com
                  </a>
                </li>
                <li className="text-fg-mid">
                  Looking for early access?{" "}
                  <Link
                    href="/access-request"
                    className="text-cta-blue underline"
                  >
                    Request access
                  </Link>{" "}
                  instead.
                </li>
                <li className="text-fg-mid">
                  Connect on{" "}
                  <a
                    href="https://www.linkedin.com/company/spaarke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cta-blue underline"
                  >
                    LinkedIn
                  </a>
                  .
                </li>
              </ul>
            </div>
          </div>

          {/* Right rail — elevated form card */}
          <div className="relative">
            <div
              className="border-line bg-surface/50 relative rounded-2xl border p-6 backdrop-blur-md sm:p-8 lg:p-10"
              style={{
                boxShadow:
                  "0 30px 60px -20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              {/* Subtle gradient overlay on the card edge */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 30%)",
                }}
              />
              <div className="relative">
                <ContactForm
                  recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
                />
              </div>
            </div>
            <p className="text-fg-low mt-4 px-2 text-center text-xs">
              Protected by reCAPTCHA · We never share what you send us.
            </p>
          </div>
        </div>
      </Shell>
    </Slab>
  );
}
