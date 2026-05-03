import Image from "next/image";
import { Lede, Shell, Slab } from "@/components/primitives";
import { heroContent } from "@/content/home/hero";
import { HeroCTAs } from "./HeroCTAs";

export function Hero() {
  const { headline, subhead, kicker, ctas, screenshot } = heroContent;

  return (
    <Slab tone="dark" className="pt-24 md:pt-32 pb-0">
      <Shell>
        <div className="mx-auto max-w-6xl text-center">
          <h1
            className="font-display text-fg font-medium leading-[0.98] tracking-[-0.035em]"
            style={{ fontSize: "clamp(40px, 7vw, 104px)" }}
          >
            {headline.line1}
            <br />
            {headline.line2}
          </h1>
          <div className="mx-auto mt-8 max-w-3xl">
            <Lede>{subhead}</Lede>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <p
              className="font-display font-medium tracking-[-0.005em]"
              style={{ fontSize: "clamp(18px, 1.4vw, 25px)", lineHeight: 1.4 }}
            >
              <span className="text-fg">{kicker.strong}</span>
              <br />
              <span className="text-fg-mid">{kicker.muted}</span>
            </p>
          </div>
          <div className="mt-12">
            <HeroCTAs ctas={ctas} />
          </div>
        </div>
      </Shell>

      {/* Full-width product screenshot — soft white-blue footlight glow beneath, clean dark on top/sides, hard black cutoff at bottom */}
      <div className="relative overflow-hidden px-[var(--spacing-shell-x)] mt-20 md:mt-28 pb-20 md:pb-32">
        <div className="relative mx-auto max-w-7xl">
          {/* Footlight glow — wider, pooled white-blue ambient light beneath the screenshot */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
            style={{
              width: "180%",
              height: "120%",
              bottom: "-65%",
              background:
                "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(235,242,255,0.78) 0%, rgba(210,225,255,0.55) 22%, rgba(175,200,250,0.32) 45%, rgba(130,165,235,0.14) 68%, rgba(80,120,220,0.04) 85%, rgba(0,0,0,0) 100%)",
              filter: "blur(36px)",
            }}
          />
          {/* Screenshot frame — sits on top of the glow, dark frame floats over it */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              boxShadow:
                "0 30px 60px -10px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
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
          </div>
        </div>
      </div>
    </Slab>
  );
}
