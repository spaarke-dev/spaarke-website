"use client";

import { useEffect, useRef } from "react";

/**
 * Looping laser + explosion animation as hero background.
 * Laser shoots from left → hits blue dot at center → beams explode outward.
 * Colors: blue (#000BFF), red (#FC0000), yellow (#FFD200).
 * Horizontal laser stops at blue dot — does NOT continue right.
 */

const CYCLE_MS = 5000;
const LASER_FIRE = 900;
const SPARK_START = 750;
const BEAM_DELAY = 800;
const BEAM_EXTEND = 350;
const BEAM_HOLD = 400;
const BEAM_FADE = 1200;
const PEAK_WIDTH = 8000;
const BEAM_THICKNESS = 70;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function HeroBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const laser = svg.getElementById("hb-laser") as SVGRectElement | null;
    const spark = svg.getElementById("hb-spark") as SVGCircleElement | null;
    const flare = svg.getElementById("hb-flare") as SVGCircleElement | null;
    const blueDot = svg.getElementById("hb-blue-dot") as SVGCircleElement | null;
    const beams = svg.querySelectorAll<SVGRectElement>(".hb-beam");

    let cancelled = false;

    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now % CYCLE_MS;

      // --- Laser: red beam from far left to center (stops at blue dot) ---
      if (laser) {
        if (elapsed < LASER_FIRE) {
          const progress = elapsed / LASER_FIRE;
          const tipX = -4000 + progress * 4000;
          const tailX = -4000 + Math.max(0, progress - 0.3) / 0.7 * 4000;
          laser.setAttribute("x", String(tailX));
          laser.setAttribute("width", String(Math.max(0, tipX - tailX)));
          laser.setAttribute("opacity", "1");
        } else if (elapsed < LASER_FIRE + 200) {
          const fade = 1 - (elapsed - LASER_FIRE) / 200;
          laser.setAttribute("opacity", String(fade));
        } else {
          laser.setAttribute("opacity", "0");
        }
      }

      // --- Blue dot: appears at impact, fades ---
      if (blueDot) {
        if (elapsed >= SPARK_START && elapsed < SPARK_START + 800) {
          const p = (elapsed - SPARK_START) / 800;
          blueDot.setAttribute("opacity", String(p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85));
        } else {
          blueDot.setAttribute("opacity", "0");
        }
      }

      // --- Spark / Flare at center ---
      if (spark) {
        const sparkDur = 400;
        if (elapsed >= SPARK_START && elapsed < SPARK_START + sparkDur) {
          const p = (elapsed - SPARK_START) / sparkDur;
          const scale = 1 + p * 6;
          const opacity = p < 0.15 ? 1 : 1 - (p - 0.15) / 0.85;
          spark.setAttribute("r", String(30 * scale));
          spark.setAttribute("opacity", String(opacity));
        } else {
          spark.setAttribute("opacity", "0");
        }
      }

      if (flare) {
        const flareDur = 600;
        if (elapsed >= SPARK_START && elapsed < SPARK_START + flareDur) {
          const p = (elapsed - SPARK_START) / flareDur;
          const scale = 1 + p * 10;
          const opacity = 0.8 * (1 - p);
          flare.setAttribute("r", String(50 * scale));
          flare.setAttribute("opacity", String(opacity));
        } else {
          flare.setAttribute("opacity", "0");
        }
      }

      // --- Beam explosion: beams expand from center outward ---
      const beamElapsed = elapsed - BEAM_DELAY;
      beams.forEach((r) => {
        if (beamElapsed < 0) {
          r.setAttribute("width", "0");
          r.setAttribute("opacity", "0");
        } else if (beamElapsed < BEAM_EXTEND) {
          const w = PEAK_WIDTH * easeOutCubic(beamElapsed / BEAM_EXTEND);
          r.setAttribute("x", String(-w / 2));
          r.setAttribute("width", String(w));
          r.setAttribute("opacity", "1");
        } else if (beamElapsed < BEAM_EXTEND + BEAM_HOLD) {
          r.setAttribute("x", String(-PEAK_WIDTH / 2));
          r.setAttribute("width", String(PEAK_WIDTH));
          r.setAttribute("opacity", "1");
        } else if (beamElapsed < BEAM_EXTEND + BEAM_HOLD + BEAM_FADE) {
          const opacity = 1 - (beamElapsed - BEAM_EXTEND - BEAM_HOLD) / BEAM_FADE;
          r.setAttribute("x", String(-PEAK_WIDTH / 2));
          r.setAttribute("width", String(PEAK_WIDTH));
          r.setAttribute("opacity", String(opacity));
        } else {
          r.setAttribute("width", "0");
          r.setAttribute("opacity", "0");
        }
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, []);

  const t = BEAM_THICKNESS;
  const halfT = t / 2;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: 0.10 }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox="-4000 -2000 8000 4000"
        className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Red laser — solid red, fades at tail */}
          <linearGradient id="hb-laser-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FC0000" stopOpacity="0" />
            <stop offset="30%" stopColor="#FC0000" />
            <stop offset="100%" stopColor="#FC0000" />
          </linearGradient>
          {/* Beam gradient: yellow → red → yellow */}
          <linearGradient id="hb-beam-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD200" />
            <stop offset="50%" stopColor="#FC0000" />
            <stop offset="100%" stopColor="#FFD200" />
          </linearGradient>
          {/* Spark: white center → blue edge */}
          <radialGradient id="hb-spark-grad">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#000BFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000BFF" stopOpacity="0" />
          </radialGradient>
          {/* Flare: blue glow */}
          <radialGradient id="hb-flare-grad">
            <stop offset="0%" stopColor="#000BFF" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#000BFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000BFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Red laser — from far left to center, does NOT extend right */}
        <rect
          id="hb-laser"
          x="-4000" y={-halfT * 0.6}
          width="0" height={t * 0.6}
          fill="url(#hb-laser-grad)"
          opacity="0"
        />

        {/* Explosion beams — NO horizontal (laser covers left side) */}
        {/* Vertical (90°) */}
        <g transform="rotate(90)">
          <rect className="hb-beam" x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
        </g>
        {/* Diagonal 45° (upper-right / lower-left) */}
        <g transform="rotate(45)">
          <rect className="hb-beam" x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
        </g>
        {/* Diagonal -45° (lower-right / upper-left) */}
        <g transform="rotate(-45)">
          <rect className="hb-beam" x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
        </g>

        {/* Blue dot at center — impact point */}
        <circle id="hb-blue-dot" cx="0" cy="0" r="35" fill="#000BFF" opacity="0" />

        {/* Spark and flare */}
        <circle id="hb-spark" cx="0" cy="0" r="30" fill="url(#hb-spark-grad)" opacity="0" />
        <circle id="hb-flare" cx="0" cy="0" r="50" fill="url(#hb-flare-grad)" opacity="0" />
      </svg>
    </div>
  );
}
