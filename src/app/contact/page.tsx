import type { Metadata } from "next";
import { PageHeader, Shell, Slab } from "@/components/primitives";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Spaarke team.",
};

export default function Contact() {
  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Contact"
          title="Get in touch."
          lede="Have a question, a partnership idea, or want to see Spaarke live? Send us a note and we'll come back to you."
        />

        <div className="mt-12 max-w-xl">
          <ContactForm recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""} />
        </div>
      </Shell>
    </Slab>
  );
}
