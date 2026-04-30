import { Button, Shell, Slab } from "@/components/primitives";
import { closingContent } from "@/content/home/closing";

export function Closing() {
  const { headline, sub, ctas } = closingContent;

  return (
    <Slab tone="dark" className="relative overflow-hidden">
      {/* Subtle radial vignette behind the type */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <Shell>
        <div className="relative mx-auto max-w-5xl text-center">
          <h2
            className="font-display text-fg font-medium leading-[0.98] tracking-[-0.035em] whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontSize: "clamp(36px, 6vw, 80px)" }}
          >
            {headline}
          </h2>
          <p className="text-fg-mid mt-6 text-lg md:text-xl">{sub}</p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {ctas.map((cta) => (
              <Button
                key={cta.label}
                variant={cta.variant}
                href={cta.href}
                arrow={cta.arrow}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        </div>
      </Shell>
    </Slab>
  );
}
