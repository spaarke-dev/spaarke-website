import { Heading, Shell, Slab } from "@/components/primitives";
import { pillarsContent } from "@/content/home/pillars";

export function Pillars() {
  const { umbrellaHeading, pillars } = pillarsContent;

  return (
    <Slab tone="light">
      <Shell>
        <div className="mx-auto max-w-5xl text-center">
          <Heading level={2}>{umbrellaHeading}</Heading>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar) => (
            <article
              key={pillar.cardLabel}
              className="bg-surface flex flex-col rounded-3xl p-8 shadow-sm md:p-10"
            >
              <h3 className="text-fg font-display text-xl font-medium leading-tight tracking-tight md:text-2xl">
                {pillar.headline}
              </h3>
              <p className="text-fg-mid mt-5 text-[15px] leading-relaxed md:text-base">
                {pillar.operationalClaim}
              </p>
              <div className="border-line my-8 border-t" />
              <p className="text-fg-mid text-[14px] leading-relaxed">
                {pillar.callback}
              </p>
            </article>
          ))}
        </div>
      </Shell>
    </Slab>
  );
}
