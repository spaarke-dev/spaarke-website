import type { Metadata } from "next";
import Link from "next/link";
import { Shell, Slab } from "@/components/primitives";
import DemoRequestForm from "@/components/DemoRequestForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get access",
  description:
    "Request early access to Spaarke — the shared platform for legal departments, business stakeholders, and outside counsel.",
};

const BENEFITS: { title: string; body: string }[] = [
  {
    title: "Concierge onboarding",
    body: "We stand the platform up inside your own Microsoft 365 tenant — Dataverse, SharePoint Embedded, and Foundry IQ wired up by our team.",
  },
  {
    title: "Direct line to the team",
    body: "Talk to engineering, product, and design directly. Your feedback shapes what ships next.",
  },
  {
    title: "Founders' pricing",
    body: "Lock in early-access pricing on the plan that ships at general availability.",
  },
  {
    title: "Your data, your tenant",
    body: "Customer data never leaves your Microsoft environment. No data lake, no shared store, no model training on your content.",
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Submit your details",
    body: "Two minutes — name, work email, organization, and what you're trying to solve.",
  },
  {
    n: "02",
    title: "We send credentials",
    body: "A welcome email with your tracking ID and the link to your tenant-bound workspace.",
  },
  {
    n: "03",
    title: "We onboard together",
    body: "A working session to get matters, documents, and Foundry IQ live for your team.",
  },
];

const TRUST_LINE = [
  "Built on Microsoft 365",
  "Data stays in your tenant",
  "No commitment",
];

export default function AccessRequest() {
  return (
    <Slab tone="dark" className="relative overflow-hidden">
      {/* Top ambient glow */}
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
        className="pointer-events-none absolute right-[-12%] top-[15%] hidden h-[48rem] w-[48rem] lg:block"
        style={{
          background:
            "radial-gradient(circle, rgba(80,120,220,0.20) 0%, rgba(80,120,220,0.06) 35%, rgba(0,0,0,0) 70%)",
          filter: "blur(70px)",
        }}
      />

      <Shell>
        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[5fr_6fr] lg:gap-20">
          {/* Left rail */}
          <div className="lg:pt-2">
            <p className="text-fg-low font-mono text-[11px] uppercase tracking-[0.18em]">
              Get access
            </p>
            <h1
              className="font-display text-fg mt-4 font-medium leading-[1.0] tracking-[-0.03em]"
              style={{ fontSize: "clamp(44px, 5.5vw, 80px)" }}
            >
              Now accepting early-access partners.
            </h1>
            <p className="text-fg-mid mt-6 max-w-md text-base leading-relaxed md:text-[17px]">
              Spaarke is in early access with a small group of corporate
              legal departments, business stakeholders, and outside
              counsel. Tell us a little about you and we&rsquo;ll be in
              touch — usually within one to two business days.
            </p>

            {/* Trust strip — small, restrained */}
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              {TRUST_LINE.map((item) => (
                <li
                  key={item}
                  className="text-fg-low font-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]"
                >
                  <span
                    aria-hidden="true"
                    className="bg-cta-blue h-1 w-1 flex-shrink-0 rounded-full"
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* Benefits — 2-column grid on lg, stacked otherwise */}
            <div className="mt-12">
              <p className="text-fg font-display text-sm font-medium uppercase tracking-wider">
                Inside early access
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                {BENEFITS.map((b) => (
                  <li
                    key={b.title}
                    className="border-line border-l pl-4 transition-colors hover:border-cta-blue/60"
                  >
                    <p className="text-fg font-display text-[15px] font-medium tracking-tight">
                      {b.title}
                    </p>
                    <p className="text-fg-mid mt-1.5 text-sm leading-relaxed">
                      {b.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process steps */}
            <div className="mt-12">
              <p className="text-fg font-display text-sm font-medium uppercase tracking-wider">
                What happens next
              </p>
              <ol className="mt-5 space-y-6">
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
            </div>

            <p className="text-fg-low mt-12 text-sm">
              Have a question first?{" "}
              <Link href="/contact" className="text-cta-blue underline">
                Contact us
              </Link>{" "}
              instead.
            </p>
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
                <p className="text-fg-low font-mono mb-6 text-[11px] uppercase tracking-[0.18em]">
                  Request early access
                </p>
                <DemoRequestForm
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
