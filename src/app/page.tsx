import type { Metadata } from "next";
import {
  Hero,
  GapStats,
  ExistingSystems,
  LOIDiagram,
  MicrosoftNative,
  Closing,
} from "@/components/sections";

// SSR per request so the Hero's TakeTourCTAs receives a runtime-resolved
// RECAPTCHA_SITE_KEY (Azure SWA app settings are runtime-only — at build
// time on GH Actions the env var is empty, which produced empty tokens
// and CAPTCHA_FAILED on submit).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spaarke — Legal Operations Intelligence platform",
  description:
    "The shared platform for legal departments, business stakeholders, and outside counsel. Built on Microsoft 365.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <GapStats />
      <ExistingSystems />
      <LOIDiagram />
      <MicrosoftNative />
      <Closing recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""} />
    </>
  );
}
