import type { Metadata } from "next";
import { Heading, Shell, Slab } from "@/components/primitives";
import { Pillars, Capabilities, Foundation } from "@/components/sections";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "The Spaarke platform — one platform, all sides, every matter. Operations, Documents & Knowledge, Collaboration, Agents & Automation, Spend & Performance, on a Microsoft 365 foundation.",
};

export default function Platform() {
  return (
    <>
      {/* Hero — title left, placeholder image right */}
      <Slab tone="light" className="py-16 md:py-24">
        <Shell>
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <Heading level={1} className="whitespace-pre-line">
                {"One platform.\nAll sides.\nEvery matter."}
              </Heading>
            </div>
            <div className="border-line bg-surface flex aspect-[5/4] items-center justify-center rounded-2xl border">
              <span className="text-fg-low font-mono text-[11px] uppercase tracking-[0.18em]">
                Hero image — placeholder
              </span>
            </div>
          </div>
        </Shell>
      </Slab>

      <Pillars title="The promise, in three parts." />
      <Capabilities title="Inside the platform." />
      <Foundation />
    </>
  );
}
