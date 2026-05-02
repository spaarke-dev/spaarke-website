import type { Metadata } from "next";
import { Heading, Shell, Slab } from "@/components/primitives";
import { Pillars, Capabilities, Foundation } from "@/components/sections";
import { pillarsContent } from "@/content/home/pillars";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "The Spaarke platform — one platform, all sides, every matter. Operations, Documents & Knowledge, Collaboration, Agents & Automation, Spend & Performance, on a Microsoft 365 foundation.",
};

export default function Platform() {
  return (
    <>
      <Slab tone="light" className="pb-0 pt-12 md:pt-16">
        <Shell>
          <div className="mx-auto max-w-4xl text-center">
            <Heading level={1}>{pillarsContent.umbrellaHeading}</Heading>
          </div>
        </Shell>
      </Slab>
      <Pillars />
      <Capabilities />
      <Foundation />
    </>
  );
}
