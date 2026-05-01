import type { Metadata } from "next";
import {
  Eyebrow,
  Heading,
  Lede,
  PageHeader,
  Shell,
  Slab,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "The Spaarke platform — Operations, Documents & Knowledge, Collaboration, Agents & Automation, Spend & Performance, and the Microsoft foundation.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "operations", name: "Operations" },
  { id: "documents", name: "Documents & Knowledge" },
  { id: "collaboration", name: "Collaboration" },
  { id: "automation", name: "Agents & Automation" },
  { id: "spend-performance", name: "Spend & Performance" },
  { id: "microsoft-foundation", name: "Microsoft foundation" },
] as const;

export default function Platform() {
  return (
    <>
      <Slab tone="dark">
        <Shell>
          <PageHeader
            eyebrow="Platform"
            title="One platform. All sides. Every matter."
            lede="The shared platform for legal departments, business stakeholders, and outside counsel — with five capabilities and a Microsoft foundation underneath."
          />
        </Shell>
      </Slab>

      {SECTIONS.map((section) => (
        <Slab key={section.id} tone="dark" className="border-line border-t py-16 md:py-20">
          <Shell>
            <section id={section.id} className="max-w-3xl">
              <Eyebrow>{section.name}</Eyebrow>
              <div className="mt-4">
                <Heading level={2}>{section.name}</Heading>
              </div>
              <div className="mt-5 max-w-xl">
                <Lede>
                  Detailed walkthrough coming soon. The home page summarizes
                  this capability — a deeper section lands here next.
                </Lede>
              </div>
            </section>
          </Shell>
        </Slab>
      ))}
    </>
  );
}
