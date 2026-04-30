import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Why Spaarke",
  description:
    "Why Spaarke — the strategic case for a shared platform across legal departments, business stakeholders, and outside counsel.",
};

export default function WhySpaarke() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Why Spaarke"
          title="The case for a shared platform."
          lede="Why Legal Operations Intelligence is the right category, why Spaarke runs on Microsoft, and why the work itself becomes the record. Detailed argument coming soon."
        />
      </Shell>
    </Slab>
  );
}
