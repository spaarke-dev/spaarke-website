import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import StickyTagline from "@/components/StickyTagline";
import LibrarySection from "@/components/LibrarySection";
import NextSection from "@/components/NextSection";

export const metadata: Metadata = {
  title: "Spaarke | Legal Operations Intelligence",
  description:
    "Legal Operations Intelligence — Work Smarter, Operate Leaner, Decide Faster.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* Wrapper gives the sticky tagline a shared context with library + next sections */}
      <div>
        <StickyTagline />
        <LibrarySection />
        <NextSection />
      </div>
    </>
  );
}
