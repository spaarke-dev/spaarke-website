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
          "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Subtle blue accent treatment */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,11,255,0.08) 0%, rgba(0,11,255,0) 70%)",
        }}
      />

      {/* Chrome bar at top — mimics the Spaarke product UI */}
      <div className="border-line relative flex items-center gap-3 border-b px-4 py-3">
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
          width={70}
          height={20}
          className="h-4 w-auto"
        />
        <span className="text-fg-mid text-[10px] tracking-tight">Corporate Counsel</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="border-line text-fg-mid rounded-md border px-2 py-0.5 text-[9px] font-medium">
            Copilot
          </span>
          <div
            aria-hidden="true"
            className="bg-fg-mid h-2.5 w-2.5 rounded-full"
          />
        </div>
      </div>

      {/* 2x4 icon grid */}
      <div className="relative px-4 py-6 sm:px-6 sm:py-8">
        <ul className="grid grid-cols-4 gap-2 sm:gap-3">
          {container.icons.map((icon) => (
            <li
              key={icon.label}
              className="bg-surface-2 border-line flex aspect-square items-center justify-center rounded-xl border"
            >
              {/* Use mask-image so currentColor SVG renders in our chosen color */}
              <span
                aria-label={icon.label}
                role="img"
                className="bg-fg-mid block h-6 w-6"
                style={{
                  maskImage: `url(${icon.src})`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskImage: `url(${icon.src})`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Eyebrow at bottom */}
      <div className="border-line relative border-t px-4 py-3">
        <span className="text-fg-low font-mono-display text-[10px] uppercase tracking-[0.18em]">
          {container.eyebrow}
        </span>
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
        viewBox="0 0 200 12"
        className="h-3 w-full max-w-[200px] rotate-90 md:rotate-0"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000BFF" />
            <stop offset="50%" stopColor="#7B5BFF" />
            <stop offset="100%" stopColor="#FF4DCB" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="6"
          x2="190"
          y2="6"
          stroke="url(#arrow-gradient)"
          strokeWidth="1.5"
        />
        <polygon points="200,6 188,1 188,11" fill="url(#arrow-gradient)" />
      </svg>
    </div>
  );
}

function CopilotBadgeCard({ copilot }: { copilot: CopilotData }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Soft radial multi-color glow behind the badge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -m-12"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(123,91,255,0.35) 0%, rgba(255,77,203,0.18) 40%, rgba(0,0,0,0) 70%)",
          filter: "blur(20px)",
        }}
      />
      <Image
        src={copilot.src}
        alt={copilot.alt}
        width={180}
        height={180}
        className="relative h-32 w-32 md:h-40 md:w-40"
      />
      <div className="bg-bg text-fg border-line relative mt-4 inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium">
        {copilot.tag}
      </div>
    </div>
  );
}
