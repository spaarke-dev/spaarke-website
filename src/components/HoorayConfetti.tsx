import type { CSSProperties } from "react";

/**
 * Lightweight pure-CSS particle burst behind a success message. 18
 * particles fanning out across a circle in the brand spectral
 * palette. Each particle reads its target offset from inline CSS
 * variables, so a single shared @keyframes (in globals.css) drives
 * every direction. Suppressed under prefers-reduced-motion via the
 * .hooray-particle rule itself. Animation runs once on mount.
 */
const HOORAY_COLORS = [
  "#000BFF",
  "#00F7FF",
  "#1AFF00",
  "#8CFF00",
  "#DBFF00",
  "#FFD200",
  "#FF9400",
  "#FF4600",
];

const HOORAY_PARTICLES = Array.from({ length: 18 }).map((_, i) => {
  const angle = (i / 18) * 360 + (i % 2 === 0 ? 0 : 6);
  const distance = 90 + (i % 3) * 22; // 90 / 112 / 134 px
  const rad = (angle * Math.PI) / 180;
  return {
    tx: Math.round(Math.cos(rad) * distance),
    ty: Math.round(Math.sin(rad) * distance),
    color: HOORAY_COLORS[i % HOORAY_COLORS.length],
    delay: (i % 4) * 30,
  };
});

export function HoorayConfetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {HOORAY_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="hooray-particle"
          style={
            {
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
