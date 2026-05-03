import { Heading, Lede, Shell, Slab } from "@/components/primitives";
import { ProductChrome } from "@/components/ProductChrome";
import { loiContent } from "@/content/home/loi-diagram";

type SpaarkeContainerData = typeof loiContent.spaarkeContainer;

export function LOIDiagram() {
  const { heading, intro, spaarkeContainer } = loiContent;

  return (
    <Slab tone="light" className="relative overflow-hidden">
      <Shell>
        {/* Heading + intro — no max-w wrapper so line 2 doesn't
            overflow a narrower container; both lines center inside
            Shell's width. */}
        <div className="relative text-center">
          <Heading level={2}>
            {heading.line1}
            <br />
            <span className="md:whitespace-nowrap">{heading.line2}</span>
          </Heading>
          <div className="mx-auto mt-6 max-w-5xl">
            <Lede>
              <span className="md:whitespace-nowrap">{intro.line1}</span>
              <br />
              <span className="md:whitespace-nowrap">{intro.line2}</span>
            </Lede>
          </div>
        </div>

        {/* Centered platform mockup — explicit dark colors so it stays
            dark inside this light section (parent's data-tone="light"
            would otherwise resolve bg-surface to white). */}
        <div className="relative mx-auto mt-16 max-w-5xl md:mt-24">
          <SpaarkeContainer container={spaarkeContainer} />
        </div>
      </Shell>
    </Slab>
  );
}

function SpaarkeContainer({ container }: { container: SpaarkeContainerData }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border"
      style={{
        backgroundColor: "#0a0a0a",
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Chrome bar at top — shared HTML/CSS chrome (sharp at any zoom) */}
      <div className="relative">
        <ProductChrome />
      </div>

      {/* 2x4 icon grid — outline-style icons with labels below */}
      <div className="relative px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16">
        <ul className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {container.icons.map((icon) => (
            <li
              key={icon.label}
              className="relative flex aspect-square min-w-0 flex-col items-center justify-center gap-4 rounded-xl border md:gap-5"
              style={{
                backgroundColor: "#161616",
                borderColor: "rgba(255, 255, 255, 0.06)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* White halo behind icon — pulls light toward the icon */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 65%)",
                }}
              />
              {/* Icon — +30% size and white drop-shadow glow restored */}
              <span
                aria-hidden="true"
                role="presentation"
                className="relative block h-16 w-16 sm:h-[72px] sm:w-[72px] md:h-[84px] md:w-[84px]"
                style={{
                  backgroundColor: "#ffffff",
                  maskImage: `url(${icon.src})`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskImage: `url(${icon.src})`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  filter:
                    "drop-shadow(0 0 14px rgba(255,255,255,0.55)) drop-shadow(0 0 28px rgba(0,11,255,0.25))",
                }}
              />
              {/* Label — text-center + truncate so long labels can't
                  push the tile width on narrow grid columns. */}
              <span className="font-display relative max-w-full truncate text-center text-sm font-medium text-white sm:text-base md:text-lg">
                {icon.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
