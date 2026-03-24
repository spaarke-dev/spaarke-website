"use client";

export default function NextSection() {
  return (
    <section className="relative z-10 bg-background">
      <div className="mx-auto flex min-h-screen w-[88%] flex-col items-center justify-center">
        <h2
          className="font-semibold text-foreground/60"
          style={{ fontSize: "clamp(1.5rem, 3vw, 6rem)", letterSpacing: "0.04em" }}
        >
          Coming Soon
        </h2>
        <p
          className="mt-4 text-muted-foreground"
          style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.5rem)" }}
        >
          More sections and features are on the way.
        </p>
      </div>
    </section>
  );
}
