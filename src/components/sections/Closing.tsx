import Image from "next/image";
import { Button, Shell, Slab } from "@/components/primitives";
import { closingContent } from "@/content/home/closing";

export function Closing() {
  const { headline, sub, ctas } = closingContent;

  return (
    <Slab tone="dark" className="relative overflow-hidden">
      {/* Strong radial vignette — primary glow behind the wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 45%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.14) 28%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0) 75%)",
        }}
      />
      {/* Secondary blue-tinted halo for added depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 40%, rgba(0,11,255,0.18) 0%, rgba(0,11,255,0) 60%)",
          filter: "blur(20px)",
        }}
      />

      <Shell>
        <div className="relative mx-auto max-w-5xl text-center">
          {/* Spaarke wordmark above headline — much larger */}
          <Image
            src="/brand/logos/spaarke-logo-white.svg"
            alt="Spaarke"
            width={520}
            height={140}
            priority={false}
            className="mx-auto h-24 w-auto md:h-32 lg:h-36"
          />

          <h2
            className="font-display text-fg mt-6 font-medium leading-[0.98] tracking-[-0.035em] whitespace-nowrap overflow-hidden text-ellipsis"
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
