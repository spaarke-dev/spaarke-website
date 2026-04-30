import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Spaarke terms of service.",
};

export default function Terms() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Legal"
          title="Terms of Service"
          lede="The terms that govern your use of Spaarke."
        />

        <div className="text-fg-mid mt-12 max-w-2xl space-y-4 text-base leading-relaxed">
          <p>Terms of service content coming soon.</p>
        </div>
      </Shell>
    </Slab>
  );
}
