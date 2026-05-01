import { Shell, Slab } from "@/components/primitives";
import { pillarsContent } from "@/content/home/pillars";

export function Pillars() {
  const { pillars } = pillarsContent;

  return (
    <Slab tone="light" className="pt-12 pb-8 md:pt-16 md:pb-12">
      <Shell>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar) => (
            <article
              key={pillar.cardLabel}
              className="bg-surface flex flex-col rounded-3xl p-8 shadow-sm md:p-10"
            >
              <h3 className="text-fg font-display text-xl font-medium leading-tight tracking-tight md:text-2xl whitespace-pre-line">
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
