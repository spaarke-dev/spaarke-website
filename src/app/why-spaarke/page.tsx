import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Why Spaarke",
  description:
    "Why Spaarke — the strategic case for a shared system of record for legal departments and their outside counsel.",
};

export default function WhySpaarke() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="prose mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Spaarke
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Why Spaarke content coming soon.
          </p>
        </div>
      </Container>
    </section>
  );
}
