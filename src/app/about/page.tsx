import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Spaarke — the shared platform for legal departments, business stakeholders, and outside counsel.",
};

export default function About() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="About"
          title="The shared platform for legal."
          lede="We're building the operational intelligence layer for legal — built on Microsoft 365, made for the business, in-house counsel, and outside counsel. More about the team and the company coming soon."
        />
      </Shell>
    </Slab>
  );
}
