import Image from "next/image";
import { Heading, Lede, Shell, Slab } from "@/components/primitives";
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

      {/* Chrome bar at top — mimics the Spaarke product UI */}
      <div className="border-line relative flex items-center gap-3 border-b px-5 py-4">
        {/* 9-dot waffle */}
        <div
          className="grid grid-cols-3 gap-[3px]"
          aria-hidden="true"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="bg-fg-mid block h-[3px] w-[3px] rounded-[1px]" />
          ))}
        </div>
        <Image
          src={container.wordmark.src}
          alt={container.wordmark.alt}
          width={80}
          height={22}
          className="h-5 w-auto"
        />
        <span className="text-fg-mid text-[11px] tracking-tight">Corporate Counsel</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="border-line text-fg-mid rounded-md border px-2 py-0.5 text-[10px] font-medium">
            Copilot
          </span>
          <div
            aria-hidden="true"
            className="bg-fg-mid h-2.5 w-2.5 rounded-full"
          />
        </div>
      </div>

      {/* 2x4 icon grid — bigger, brighter, with glow */}
      <div className="relative px-6 py-10 sm:px-8 sm:py-12">
        <ul className="grid grid-cols-4 gap-3 sm:gap-4">
          {container.icons.map((icon) => (
            <li
              key={icon.label}
              className="bg-surface-2 border-line relative flex aspect-square items-center justify-center rounded-xl border"
              style={{
                boxShadow:
                  "0 0 24px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Glow halo */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)",
                }}
              />
              {/* Icon — larger, brighter (white) */}
              <span
                aria-label={icon.label}
                role="img"
                className="relative block h-10 w-10 sm:h-12 sm:w-12"
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
                  filter: "drop-shadow(0 0 8px rgba(255,255,255,0.25))",
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
      <svg
        viewBox="0 0 200 24"
        className="h-6 w-full max-w-[240px] rotate-90 md:rotate-0"
        preserveAspectRatio="none"
        style={{ filter: "drop-shadow(0 0 12px rgba(0,11,255,0.6))" }}
      >
        <defs>
          <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000BFF" />
            <stop offset="50%" stopColor="#7B5BFF" />
            <stop offset="100%" stopColor="#FF4DCB" />
          </linearGradient>
          <linearGradient id="arrow-gradient-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000BFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF4DCB" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Glow line behind */}
        <line
          x1="0"
          y1="12"
          x2="190"
          y2="12"
          stroke="url(#arrow-gradient-glow)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Main line */}
        <line
          x1="0"
          y1="12"
          x2="190"
          y2="12"
          stroke="url(#arrow-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Arrowhead */}
        <polygon points="200,12 184,2 184,22" fill="url(#arrow-gradient)" />
      </svg>
    </div>
  );
}

function CopilotBadgeCard({ copilot }: { copilot: CopilotData }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Strong multi-color radial glow behind the badge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -m-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(123,91,255,0.55) 0%, rgba(255,77,203,0.35) 30%, rgba(255,148,0,0.20) 50%, rgba(0,0,0,0) 75%)",
          filter: "blur(24px)",
        }}
      />
      <Image
        src={copilot.src}
        alt={copilot.alt}
        width={240}
        height={240}
        className="relative h-44 w-44 md:h-56 md:w-56"
        style={{
          filter: "drop-shadow(0 0 30px rgba(255,77,203,0.4))",
        }}
      />
      <div className="bg-bg text-fg border-line relative mt-4 inline-flex items-center rounded-md border px-3.5 py-1.5 text-sm font-semibold">
        {copilot.tag}
      </div>
    </div>
  );
}
