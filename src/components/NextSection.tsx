"use client";

import Link from "next/link";

export default function NextSection() {
  return (
    <section className="relative z-10 bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
        <h2
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          Ready to Raise the IQ of Your Legal Work?
        </h2>

        <p
          className="mt-5 max-w-2xl text-muted-foreground"
          style={{ fontSize: "clamp(0.95rem, 1.15vw, 1.25rem)", lineHeight: 1.65 }}
        >
          See how Spaarke brings Legal Operations Intelligence to
          life&nbsp;&mdash; unified data, operational memory, and AI-powered
          inference, all within your Microsoft 365 environment.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-[#000BFF] font-semibold text-white transition-colors hover:bg-[#0009DD]"
            style={{
              fontSize: "clamp(0.875rem, 1.1vw, 1.25rem)",
              padding:
                "clamp(0.5rem, 0.75vw, 0.875rem) clamp(1.25rem, 1.8vw, 2rem)",
            }}
          >
            Request Early Access
          </Link>
          <Link
            href="/blog"
            className="rounded-lg border border-current font-semibold text-foreground transition-colors hover:bg-foreground/5"
            style={{
              fontSize: "clamp(0.875rem, 1.1vw, 1.25rem)",
              padding:
                "clamp(0.5rem, 0.75vw, 0.875rem) clamp(1.25rem, 1.8vw, 2rem)",
            }}
          >
            Explore the Library
          </Link>
        </div>

        <p
          className="mt-10 text-muted-foreground/70"
          style={{ fontSize: "clamp(0.75rem, 0.85vw, 0.95rem)" }}
        >
          Built on Microsoft 365 &middot; Deploys in your tenant &middot;
          Your data stays yours
        </p>
      </div>
    </section>
  );
}
