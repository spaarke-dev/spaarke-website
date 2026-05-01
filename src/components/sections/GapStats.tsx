import { Shell, Slab } from "@/components/primitives";
import { gapContent } from "@/content/home/gap";

export function GapStats() {
  const { heading, intro, stats } = gapContent;

  return (
    <Slab tone="dark">
      <Shell>
        <div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16 lg:gap-24">
            {/* Left: heading + intro */}
            <div>
              <h2
                className="font-display text-fg font-medium leading-[1.05] tracking-[-0.025em]"
                style={{ fontSize: "clamp(32px, 3.4vw, 52px)" }}
              >
                <span className="md:whitespace-nowrap">{heading.line1}</span>
                <br />
                <span className="md:whitespace-nowrap">{heading.line2}</span>
              </h2>
              <p className="text-fg-mid mt-6 max-w-[36ch] text-lg leading-relaxed md:text-xl">
                {intro}
              </p>
            </div>

            {/* Right: 2x2 stat grid */}
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 md:gap-16">
              {stats.map((stat) => (
                <div key={stat.value}>
                  <div
                    className="font-display text-fg font-medium leading-none tracking-tight"
                    style={{ fontSize: "clamp(40px, 4.4vw, 60px)" }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-fg mt-3 text-base font-medium md:text-[17px]">
                    {stat.label}
                  </p>
                  <p className="text-fg-mid mt-1.5 text-sm leading-snug">
                    {stat.detail}
                  </p>
                  <p className="text-fg-low font-mono-display mt-3 text-[11px] uppercase italic tracking-wider">
                    {stat.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Shell>
    </Slab>
  );
}
