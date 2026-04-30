import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";
import DemoRequestForm from "@/components/DemoRequestForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get access",
  description:
    "Request early access to Spaarke — the shared platform for legal departments, business stakeholders, and outside counsel.",
};

export default function AccessRequest() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Get access"
          title="Now accepting early access partners."
          lede="Tell us a little about you and we'll be in touch. A work email is required for early access."
        />

        <div className="mt-12 max-w-xl">
          <DemoRequestForm
            recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
          />
        </div>
      </Shell>
    </Slab>
  );
}
