import { Heading, Shell, Slab } from "@/components/primitives";
import { pillarsContent } from "@/content/home/pillars";

type PillarsProps = {
  /** Centered title displayed above the three pillar cards. */
  title?: string;
};

export function Pillars({ title }: PillarsProps = {}) {
  const { pillars } = pillarsContent;

  return (
    <Slab tone="dark" className="py-20 md:py-28">
      <Shell>
        {title && (
          <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
            <Heading level={2}>{title}</Heading>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar) => (
            <article
              key={pillar.cardLabel}
              className="bg-surface flex flex-col rounded-3xl p-8 shadow-sm md:p-10"
            >
              <h3 className="text-fg font-display whitespace-pre-line text-xl font-medium leading-tight tracking-tight md:text-2xl">
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
