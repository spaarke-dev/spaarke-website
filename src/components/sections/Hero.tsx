import Image from "next/image";
import { Heading, Lede, Shell, Slab } from "@/components/primitives";
import { heroContent } from "@/content/home/hero";
import { HeroCTAs } from "./HeroCTAs";

export function Hero() {
  const { headline, subhead, ctas, trustStrip, screenshot } = heroContent;

  return (
    <Slab tone="dark" className="pt-12 md:pt-16 pb-0">
      <Shell>
        <div className="mx-auto max-w-5xl text-center">
          <Heading level={1}>
            {headline.line1}
            <br />
            {headline.line2}
          </Heading>
          <div className="mt-6 mx-auto max-w-2xl">
            <Lede>{subhead}</Lede>
          </div>
          <div className="mt-10">
            <HeroCTAs ctas={ctas} />
          </div>
        </div>
      </Shell>

      {/* Full-width product screenshot */}
      <div className="px-[var(--spacing-shell-x)] mt-16 md:mt-20">
        <div className="bg-surface relative mx-auto max-w-6xl overflow-hidden rounded-xl shadow-2xl">
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

      {/* Trust strip */}
      <Shell>
        <p className="text-fg-low mt-10 mb-12 text-center text-sm md:text-[15px]">
          {trustStrip}
        </p>
      </Shell>
    </Slab>
  );
}
