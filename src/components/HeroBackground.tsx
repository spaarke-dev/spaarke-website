"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Hero background: SVG laser animation plays once then stays.
 * Origin (blue dot) is positioned dynamically via props (percentage-based).
 * Fades out on scroll.
 */

const ANIM_DURATION = 2200;
const BEAM_START = 1100;
const BEAM_GROW = 800;
const LASER_FIRE = 1200;
const SPARK_START = 1000;
const BEAM_THICKNESS = 50;
const PEAK_WIDTH = 8000;
const SCROLL_FADE = 400;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function LaserAnimation({ isDark }: { isDark: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const laser = svg.getElementById("hb-laser") as SVGRectElement | null;
    const spark = svg.getElementById("hb-spark") as SVGCircleElement | null;
    const blueDot = svg.getElementById("hb-blue-dot") as SVGCircleElement | null;
    const beamGroups = svg.querySelectorAll<SVGGElement>(".hb-beam-g");

    let cancelled = false;
    const startTime = performance.now();

    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now - startTime;

      if (laser) {
        if (elapsed < LASER_FIRE) {
          const progress = easeOutCubic(elapsed / LASER_FIRE);
          const tipX = -4000 + progress * 4000;
          laser.setAttribute("x", "-4000");
          laser.setAttribute("width", String(Math.max(0, tipX + 4000)));
          laser.setAttribute("opacity", "1");
        } else {
          laser.setAttribute("x", "-4000");
          laser.setAttribute("width", "4000");
          laser.setAttribute("opacity", "1");
        }
      }

      if (blueDot) {
        if (elapsed >= SPARK_START) {
          const fadeIn = Math.min(1, (elapsed - SPARK_START) / 200);
          blueDot.setAttribute("opacity", String(fadeIn));
        }
      }

      if (spark) {
        const sparkDur = 500;
        if (elapsed >= SPARK_START && elapsed < SPARK_START + sparkDur) {
          const p = (elapsed - SPARK_START) / sparkDur;
          const scale = 1 + p * 5;
          const opacity = p < 0.1 ? p / 0.1 : 1 - (p - 0.1) / 0.9;
          spark.setAttribute("r", String(25 * scale));
          spark.setAttribute("opacity", String(opacity));
        } else if (elapsed >= SPARK_START + sparkDur) {
          spark.setAttribute("opacity", "0");
        }
      }

      if (elapsed >= BEAM_START) {
        const beamElapsed = elapsed - BEAM_START;
        beamGroups.forEach((g, i) => {
          const rect = g.querySelector("rect");
          if (!rect) return;
          const stagger = i * 80;
          const localElapsed = beamElapsed - stagger;
          if (localElapsed < 0) {
            rect.setAttribute("width", "0");
            rect.setAttribute("opacity", "0");
          } else if (localElapsed < BEAM_GROW) {
            const progress = easeOutCubic(localElapsed / BEAM_GROW);
            const w = PEAK_WIDTH * progress;
            rect.setAttribute("x", String(-w / 2));
            rect.setAttribute("width", String(w));
            rect.setAttribute("opacity", "1");
          } else {
            rect.setAttribute("x", String(-PEAK_WIDTH / 2));
            rect.setAttribute("width", String(PEAK_WIDTH));
            rect.setAttribute("opacity", "1");
          }
        });
      }

      if (elapsed > ANIM_DURATION) return;
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, []);

  const t = BEAM_THICKNESS;
  const halfT = t / 2;
  const color = isDark ? "#FFFFFF" : undefined;

  return (
    <svg
      ref={svgRef}
      viewBox="-4000 -2000 8000 4000"
      className="absolute h-[250%] w-[250%]"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="hb-laser-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color || "#FC0000"} stopOpacity="0" />
          <stop offset="20%" stopColor={color || "#FC0000"} />
          <stop offset="100%" stopColor={color || "#FC0000"} />
        </linearGradient>
        <linearGradient id="hb-beam-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color || "#FFD200"} />
          <stop offset="50%" stopColor={color || "#FC0000"} />
          <stop offset="100%" stopColor={color || "#FFD200"} />
        </linearGradient>
        <radialGradient id="hb-spark-grad">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="40%" stopColor={color || "#000BFF"} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color || "#000BFF"} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect id="hb-laser" x="-4000" y={-halfT} width="0" height={t} fill="url(#hb-laser-grad)" opacity="0" />

      <g className="hb-beam-g" transform="rotate(90)">
        <rect x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
      </g>
      <g className="hb-beam-g" transform="rotate(45)">
        <rect x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
      </g>
      <g className="hb-beam-g" transform="rotate(-45)">
        <rect x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
      </g>

      <circle id="hb-spark" cx="0" cy="0" r="25" fill="url(#hb-spark-grad)" opacity="0" />
      <circle id="hb-blue-dot" cx="0" cy="0" r="50" fill={color || "#000BFF"} opacity="0" />
    </svg>
  );
}

export default function HeroBackground({
  originX,
  originY,
}: {
  originX: number;
  originY: number;
}) {
  const [scrollOpacity, setScrollOpacity] = useState(0.05);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    function onScroll() {
      const progress = Math.min(1, window.scrollY / SCROLL_FADE);
      setScrollOpacity(0.05 * (1 - progress));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: scrollOpacity }}
      aria-hidden="true"
    >
      {/* Position the SVG so its center (0,0 = blue dot) sits at originX%, originY% */}
      <div
        className="absolute"
        style={{
          left: `${originX}%`,
          top: `${originY}%`,
          transform: "translate(-50%, -50%)",
          width: "250%",
          height: "250%",
        }}
      >
        <LaserAnimation isDark={isDark} />
      </div>
    </div>
  );
}
