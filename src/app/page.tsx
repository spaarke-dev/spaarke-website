import type { Metadata } from "next";
import EarlyReleaseForm from "@/components/EarlyReleaseForm";
import SpaarkeLogoAnimation from "@/components/SpaarkeLogoAnimation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spaarke | Igniting Innovation",
  description:
    "Join the Spaarke Early Release Program. Be the first to experience our platform.",
};

export default function Home() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 pb-24 pt-8">
      <div className="flex w-full flex-col items-center gap-16 text-center">
        <SpaarkeLogoAnimation />

        <div className="w-full max-w-xl">
          <h2 className="mb-5 text-lg font-semibold text-foreground">
            Join the Early Release Program
          </h2>
          <EarlyReleaseForm recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""} />
        </div>
      </div>
    </div>
  );
}
