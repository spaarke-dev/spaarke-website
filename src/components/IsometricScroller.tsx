import type { CSSProperties } from "react";

/**
 * Animated isometric tile scroller used as a section backdrop.
 *
 * Renders three rows of tilted product screenshots scrolling in
 * opposite directions (CSS-only, no JS frame loop). Two of the rows
 * scroll left at 60s, the third scrolls right at 75s for parallax.
 * The whole stage is tilted with a perspective transform to give it
 * the isometric feel.
 *
 * Adapted from resources/backgrounds/design_handoff_platform_hero/
 * IsometricScrollerV2.jsx (the design handoff bundle).
 */

type Theme = "dark" | "light";
type Anchor = "center" | "top" | "top-right";

type Props = {
  theme?: Theme;
  height?: string;
  anchor?: Anchor;
  background?: string;
  tilt?: boolean;
};

const LIGHT_SCREENS = [
  "/brand/platform-hero/workspace-light.png",
  "/brand/platform-hero/screen-matter-record.png",
  "/brand/platform-hero/screen-document-intelligence.png",
  "/brand/platform-hero/screen-ai-workflows.png",
  "/brand/platform-hero/screen-performance.png",
  "/brand/platform-hero/screen-outside-counsel.png",
  "/brand/platform-hero/screen-workspace-v2.png",
  "/brand/platform-hero/screen-corporate-workspace.png",
  "/brand/platform-hero/screen-external-access.png",
  "/brand/platform-hero/screen-ai-playbook.png",
];

const DARK_SCREENS = ["/brand/platform-hero/workspace-light.png"];

type Tile = { src: string; w: number };

export function IsometricScroller({
  theme = "dark",
  height = "clamp(420px, 60vh, 720px)",
  anchor = "center",
  background,
  tilt = true,
}: Props) {
  const isLight = theme === "light";
  const bg = background ?? (isLight ? "#f6f6f4" : "#0a0a0c");
  const vignetteRgb = isLight ? "246,246,244" : "10,10,12";
  const bloomColor = isLight
    ? "rgba(78,108,255,0.10)"
    : "rgba(78,108,255,0.18)";

  const screens = isLight ? LIGHT_SCREENS : DARK_SCREENS;
  const ws = (i: number) => screens[i % screens.length];

  const TILES_A: Tile[] = [
    { src: ws(0), w: 720 },
    { src: ws(1), w: 720 },
    { src: ws(2), w: 720 },
  ];
  const TILES_B: Tile[] = [
    { src: ws(3), w: 720 },
    { src: ws(4), w: 720 },
    { src: ws(5), w: 720 },
  ];
  const TILES_C: Tile[] = [
    { src: ws(6), w: 720 },
    { src: ws(7), w: 720 },
    { src: ws(8), w: 720 },
  ];

  const stageClass = [
    "iso-stage",
    anchor === "top" && "iso-stage--top",
    anchor === "top-right" && "iso-stage--top-right",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        background: bg,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <style>{`
        @keyframes iso-scroll-l { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%, 0, 0); } }
        @keyframes iso-scroll-r { from { transform: translate3d(-50%, 0, 0); } to { transform: translate3d(0, 0, 0); } }
        .iso-stage {
          position: absolute;
          inset: -10% -10%;
          ${tilt ? "transform: perspective(1400px) rotateX(38deg) rotateZ(18deg) scale(1.18);" : ""}
          transform-origin: 50% 50%;
        }
        .iso-stage--top {
          top: -55%;
          bottom: 35%;
        }
        .iso-stage--top-right {
          top: -35%;
          bottom: 15%;
          left: 5%;
          right: -25%;
          transform-origin: 70% 50%;
        }
        .iso-row {
          display: flex;
          align-items: center;
          gap: 80px;
          width: max-content;
          will-change: transform;
        }
        .iso-row-l { animation: iso-scroll-l 60s linear infinite; }
        .iso-row-r { animation: iso-scroll-r 75s linear infinite; }
        .iso-tile { flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .iso-tile img { display: block; max-width: 100%; height: auto; }
        .iso-tile-dark.workspace {
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05);
          background: #111;
        }
        .iso-tile-light.workspace {
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 24px 60px -18px rgba(20,24,40,0.22), 0 2px 6px -2px rgba(20,24,40,0.10), 0 0 0 1px rgba(20,24,40,0.06);
          background: #ffffff;
        }
        @media (prefers-reduced-motion: reduce) {
          .iso-row-l, .iso-row-r { animation: none; }
        }
      `}</style>

      {/* Soft radial vignette so the centre stays readable for any overlay text */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: `radial-gradient(60% 70% at 50% 50%, rgba(${vignetteRgb},0) 0%, rgba(${vignetteRgb},0.55) 60%, rgba(${vignetteRgb},0.85) 100%)`,
        }}
      />
      {/* Cool blue/purple bloom under the scroller */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: `radial-gradient(40% 50% at 50% 60%, ${bloomColor}, transparent 70%)`,
        }}
      />

      <div className={stageClass}>
        <IsoRow
          tiles={TILES_A}
          variant="iso-row-l"
          yOffset="-180px"
          theme={theme}
        />
        <IsoRow
          tiles={TILES_B}
          variant="iso-row-r"
          yOffset="60px"
          theme={theme}
        />
        <IsoRow
          tiles={TILES_C}
          variant="iso-row-l"
          yOffset="300px"
          speedMod={0.85}
          theme={theme}
        />
      </div>
    </div>
  );
}

type RowProps = {
  tiles: Tile[];
  variant: "iso-row-l" | "iso-row-r";
  yOffset: string;
  speedMod?: number;
  theme: Theme;
};

function IsoRow({ tiles, variant, yOffset, speedMod, theme }: RowProps) {
  // Duplicate so the loop is seamless when translateX hits -50%.
  const doubled = [...tiles, ...tiles];
  const baseDuration = variant === "iso-row-l" ? 60 : 75;
  const animationDuration = speedMod ? `${speedMod * baseDuration}s` : undefined;

  const rowStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: `translateY(${yOffset})`,
    animationDuration,
  };

  return (
    <div className={`iso-row ${variant}`} style={rowStyle}>
      {doubled.map((t, i) => (
        <div
          key={i}
          className={`iso-tile iso-tile-${theme} workspace`}
          style={{
            width: t.w,
            height: Math.round(t.w * 0.62),
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.src} alt="" />
        </div>
      ))}
    </div>
  );
}
