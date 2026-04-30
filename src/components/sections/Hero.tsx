import Image from "next/image";
import { Heading, Lede, Shell, Slab } from "@/components/primitives";
import { heroContent } from "@/content/home/hero";
import { HeroCTAs } from "./HeroCTAs";

export function Hero() {
  const { headline, subhead, ctas, trustStrip, screenshot } = heroContent;

  return (
    <Slab tone="dark" className="pt-24 md:pt-32 pb-0">
      <Shell>
        <div className="mx-auto max-w-5xl text-center">
          <Heading level={1}>{headline}</Heading>
          <div className="mt-8 mx-auto max-w-2xl">
            <Lede>{subhead}</Lede>
          </div>
          <div className="mt-12">
            <HeroCTAs ctas={ctas} />
          </div>
        </div>
      </Shell>

      {/* Full-width product screenshot — depth effect via layered shadow + subtle inner gradient */}
      <div className="px-[var(--spacing-shell-x)] mt-20 md:mt-28">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-xl border border-line"
          style={{
            backgroundColor: "var(--v2-bg)",
            boxShadow:
              "0 50px 100px -20px rgba(0,0,0,0.85), 0 30px 60px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <Image
            src={screenshot.src}
            alt={screenshot.alt}
            width={screenshot.width}
            height={screenshot.height}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            className="h-auto w-full"
          />
          {/* Soft inner bottom gradient — adds depth/grounding to the frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 100%)",
            }}
          />
        </div>
      </div>

      {/* Trust strip */}
      <Shell>
        <p className="text-fg-low mt-10 mb-12 text-center text-sm md:text-[15px]">
          {trustStrip}
        </p>
      </Shell>
    </Slab>
  );
}
