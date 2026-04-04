import type { Metadata } from "next";
import Container from "@/components/Container";
import DemoRequestForm from "@/components/DemoRequestForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request Demo Access",
  description:
    "Request demo access to Spaarke — Legal Operations Intelligence for document management, AI analysis, and financial intelligence.",
};

export default function AccessRequest() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Request Demo Access
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Interested in seeing Spaarke in action? Fill out the form below and
            our team will reach out within 1-2 business days to schedule your
            personalized demo.
          </p>

          <div className="mt-10">
            <DemoRequestForm
              recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
