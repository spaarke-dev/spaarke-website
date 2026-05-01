import type { Metadata } from "next";
import {
  Hero,
  GapStats,
  Pillars,
  Capabilities,
  Foundation,
  LOIDiagram,
  Closing,
} from "@/components/sections";
import { Heading, Shell } from "@/components/primitives";
import { pillarsContent } from "@/content/home/pillars";

export const metadata: Metadata = {
  title: "Spaarke — See all sides of every matter.",
  description:
    "The shared platform for legal departments, business stakeholders, and outside counsel. Built on Microsoft 365.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <GapStats />
      {/* Sections 3+4 share a sticky umbrella heading anchored through Pillars + Capabilities */}
      <div className="bg-bg relative" data-tone="light">
        <div className="bg-bg sticky top-[86px] z-20 pt-12 pb-6 md:top-[100px] md:pt-16 md:pb-8">
          <Shell>
            <div className="mx-auto max-w-5xl text-center">
              <Heading level={2}>{pillarsContent.umbrellaHeading}</Heading>
            </div>
          </Shell>
        </div>
        <Pillars />
        <Capabilities />
      </div>
      <Foundation />
      <LOIDiagram />
      <Closing />
    </>
  );
}
