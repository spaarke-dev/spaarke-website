import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "The Spaarke platform — Workspace, Finance Intelligence, Performance Assessment, Knowledge & Search, and AI for legal.",
};

export default function Platform() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="prose mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Platform
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Platform content coming soon.
          </p>
        </div>
      </Container>
    </section>
  );
}
