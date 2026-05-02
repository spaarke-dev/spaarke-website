import type { Metadata } from "next";
import {
  Hero,
  GapStats,
  LOIDiagram,
  Closing,
} from "@/components/sections";

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
      <LOIDiagram />
      <Closing />
    </>
  );
}
