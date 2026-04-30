import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Spaarke privacy policy — how we collect and use your data.",
};

export default function Privacy() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          lede="How we collect, use, and protect your data."
        />

        <div className="text-fg-mid mt-12 max-w-2xl space-y-4 text-base leading-relaxed">
          <p>Privacy policy content coming soon.</p>
        </div>
      </Shell>
    </Slab>
  );
}
