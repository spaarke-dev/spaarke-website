import Image from "next/image";
import { Heading, Lede, Shell, Slab } from "@/components/primitives";
import { ProductChrome } from "@/components/ProductChrome";
import { loiContent } from "@/content/home/loi-diagram";

type SpaarkeContainerData = typeof loiContent.spaarkeContainer;
type CopilotData = typeof loiContent.copilot;

export function LOIDiagram() {
  const { heading, intro, spaarkeContainer, copilot } = loiContent;

  return (
    <Slab tone="dark">
      <Shell>
        {/* Heading + intro */}
        <div className="mx-auto max-w-3xl text-center">
          <Heading level={2}>
            {heading.line1}
            <br />
            <span className="whitespace-nowrap">{heading.line2}</span>
          </Heading>
          <div className="mx-auto mt-6 max-w-[60ch]">
            <Lede>{intro}</Lede>
          </div>
        </div>

        {/* Diagram */}
        <div
          className="mt-16 grid grid-cols-1 items-center gap-10 md:mt-24 md:grid-cols-[1.45fr_0.55fr_0.7fr] md:gap-6"
          role="group"
          aria-label="Spaarke Legal IQ Platform connects to Microsoft 365 Copilot"
        >
          <SpaarkeContainer container={spaarkeContainer} />
          <DiagramArrow />
          <CopilotBadgeCard copilot={copilot} />
        </div>
      </Shell>
    </Slab>
  );
}

function SpaarkeContainer({ container }: { container: SpaarkeContainerData }) {
  return (
    <div
      className="bg-surface border-line relative overflow-hidden rounded-3xl border"
      style={{
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.5), 0 0 80px rgba(0,11,255,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Stronger blue accent treatment */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(0,11,255,0.20) 0%, rgba(0,11,255,0) 70%)",
        }}
      />

      {/* Chrome bar at top — shared HTML/CSS chrome (sharp at any zoom, dark regardless of parent tone) */}
      <div className="relative">
        <ProductChrome />
      </div>

      {/* 2x4 icon grid — large, bright, glowing tiles */}
      <div className="relative px-6 py-10 sm:px-8 sm:py-14">
        <ul className="grid grid-cols-4 gap-3 sm:gap-4">
          {container.icons.map((icon) => (
            <li
              key={icon.label}
              className="bg-surface-2 border-line relative flex aspect-square items-center justify-center rounded-xl border"
              style={{
                boxShadow:
                  "0 0 32px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              {/* Glow halo */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)",
                }}
              />
              {/* Icon — much larger and brighter */}
              <span
                aria-label={icon.label}
                role="img"
                className="relative block h-14 w-14 sm:h-[68px] sm:w-[68px]"
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DiagramArrow() {
  return (
    <div
      className="relative flex items-center justify-center py-4 md:py-0"
      aria-hidden="true"
    >
      {/* Diffuse halo behind the arrow — pulls the eye and grounds the connection */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(123,91,255,0.35) 0%, rgba(255,77,203,0.18) 40%, rgba(0,0,0,0) 75%)",
          filter: "blur(16px)",
        }}
      />
      <svg
        viewBox="0 0 200 24"
        className="relative h-10 w-full max-w-[300px] rotate-90 md:rotate-0"
        preserveAspectRatio="none"
        style={{
          filter:
            "drop-shadow(0 0 14px rgba(0,11,255,0.85)) drop-shadow(0 0 28px rgba(255,77,203,0.55))",
        }}
      >
        <defs>
          <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000BFF" />
            <stop offset="50%" stopColor="#7B5BFF" />
            <stop offset="100%" stopColor="#FF4DCB" />
          </linearGradient>
          <linearGradient id="arrow-gradient-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000BFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF4DCB" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {/* Wide glow line behind */}
        <line
          x1="0"
          y1="12"
          x2="190"
          y2="12"
          stroke="url(#arrow-gradient-glow)"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* Main line */}
        <line
          x1="0"
          y1="12"
          x2="190"
          y2="12"
          stroke="url(#arrow-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Arrowhead */}
        <polygon points="200,12 182,1 182,23" fill="url(#arrow-gradient)" />
      </svg>
    </div>
  );
}

function CopilotBadgeCard({ copilot }: { copilot: CopilotData }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Stronger multi-color radial glow behind the badge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -m-32"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(123,91,255,0.75) 0%, rgba(255,77,203,0.50) 28%, rgba(255,148,0,0.28) 50%, rgba(0,0,0,0) 78%)",
          filter: "blur(32px)",
        }}
      />
      <Image
        src={copilot.src}
        alt={copilot.alt}
        width={320}
        height={320}
        className="relative h-56 w-56 md:h-72 md:w-72"
        style={{
          filter:
            "drop-shadow(0 0 40px rgba(255,77,203,0.7)) drop-shadow(0 0 80px rgba(123,91,255,0.45))",
        }}
      />
      <div className="bg-bg text-fg border-line relative mt-4 inline-flex items-center rounded-md border px-3.5 py-1.5 text-sm font-semibold">
        {copilot.tag}
      </div>
    </div>
  );
}
