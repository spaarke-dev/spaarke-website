"use client";

import { useEffect, useRef } from "react";

/**
 * Looping laser + explosion animation used as the hero background.
 * Extracts just the laser-fire, beam-expand, spark/flare sequence
 * from the SpaarkeLogoAnimation, centered in the viewport, at 20% opacity.
 */

const CYCLE_MS = 4000; // total loop duration
const LASER_FIRE = 800; // laser shoots across
const BEAM_DELAY = 400; // beams start after laser hits center
const BEAM_EXTEND = 250;
const BEAM_HOLD = 300;
const BEAM_FADE = 800;
const PEAK_WIDTH = 6000;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function HeroBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const laser = svg.getElementById("hb-laser") as SVGLineElement | null;
    const spark = svg.getElementById("hb-spark") as SVGCircleElement | null;
    const flare = svg.getElementById("hb-flare") as SVGCircleElement | null;
    const beams = svg.querySelectorAll<SVGRectElement>(".hb-beam");

    const centers: number[] = [];
    beams.forEach((r) => centers.push(parseFloat(r.dataset.cx || "0")));

    let cancelled = false;
    let cycleStart = performance.now();

    function tick(now: number) {
      if (cancelled) return;
      const elapsed = (now - cycleStart) % CYCLE_MS;

      // --- Laser line ---
      if (laser) {
        if (elapsed < LASER_FIRE) {
          const progress = elapsed / LASER_FIRE;
          // Laser shoots from left edge to center
          const tipX = -3000 + progress * 3000;
          const tailX = -3000 + Math.max(0, progress - 0.35) / 0.65 * 3000;
          laser.setAttribute("x1", String(tailX));
          laser.setAttribute("x2", String(tipX));
          laser.setAttribute("opacity", "1");
        } else {
          laser.setAttribute("opacity", "0");
        }
      }

      // --- Spark / Flare at center ---
      if (spark && flare) {
        const sparkStart = LASER_FIRE * 0.85;
        const sparkDur = 300;
        const flareDur = 500;
        if (elapsed >= sparkStart && elapsed < sparkStart + sparkDur) {
          const p = (elapsed - sparkStart) / sparkDur;
          const scale = 1 + p * 8;
          const opacity = p < 0.2 ? 1 : 1 - (p - 0.2) / 0.8;
          spark.setAttribute("transform", `translate(0,0) scale(${scale})`);
          spark.setAttribute("opacity", String(opacity));
        } else {
          spark.setAttribute("opacity", "0");
        }
        if (elapsed >= sparkStart && elapsed < sparkStart + flareDur) {
          const p = (elapsed - sparkStart) / flareDur;
          const scale = 1 + p * 14;
          const opacity = 0.7 * (1 - p);
          flare.setAttribute("transform", `translate(0,0) scale(${scale})`);
          flare.setAttribute("opacity", String(opacity));
        } else {
          flare.setAttribute("opacity", "0");
        }
      }

      // --- Beam expansion ---
      const beamElapsed = elapsed - BEAM_DELAY;
      if (beamElapsed < 0) {
        beams.forEach((r) => {
          r.setAttribute("width", "0");
          r.setAttribute("opacity", "0");
        });
      } else if (beamElapsed < BEAM_EXTEND) {
        const w = PEAK_WIDTH * easeOutCubic(beamElapsed / BEAM_EXTEND);
        beams.forEach((r, i) => {
          r.setAttribute("x", String(centers[i] - w / 2));
          r.setAttribute("width", String(w));
          r.setAttribute("opacity", "1");
        });
      } else if (beamElapsed < BEAM_EXTEND + BEAM_HOLD) {
        beams.forEach((r, i) => {
          r.setAttribute("x", String(centers[i] - PEAK_WIDTH / 2));
          r.setAttribute("width", String(PEAK_WIDTH));
          r.setAttribute("opacity", "1");
        });
      } else if (beamElapsed < BEAM_EXTEND + BEAM_HOLD + BEAM_FADE) {
        const opacity = 1 - (beamElapsed - BEAM_EXTEND - BEAM_HOLD) / BEAM_FADE;
        beams.forEach((r, i) => {
          r.setAttribute("x", String(centers[i] - PEAK_WIDTH / 2));
          r.setAttribute("width", String(PEAK_WIDTH));
          r.setAttribute("opacity", String(opacity));
        });
      } else {
        beams.forEach((r) => {
          r.setAttribute("width", "0");
          r.setAttribute("opacity", "0");
        });
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: 0.2 }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox="-3000 -1500 6000 3000"
        className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Laser gradient — gold tip to red trail */}
          <linearGradient id="hb-laser-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD200" stopOpacity="0" />
            <stop offset="60%" stopColor="#FF0000" />
            <stop offset="100%" stopColor="#FFD200" />
          </linearGradient>
          {/* Beam gradients matching logo rays */}
          <linearGradient id="hb-beam-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD200" />
            <stop offset="50%" stopColor="#FC0000" />
            <stop offset="100%" stopColor="#FFD200" />
          </linearGradient>
          <linearGradient id="hb-beam-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD200" />
            <stop offset="50%" stopColor="#FC0000" />
            <stop offset="100%" stopColor="#FFD200" />
          </linearGradient>
          <linearGradient id="hb-beam-d1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD200" />
            <stop offset="50%" stopColor="#FC0000" />
            <stop offset="100%" stopColor="#FFD200" />
          </linearGradient>
          <linearGradient id="hb-beam-d2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD200" />
            <stop offset="50%" stopColor="#FC0000" />
            <stop offset="100%" stopColor="#FFD200" />
          </linearGradient>
          {/* Spark / flare radials */}
          <radialGradient id="hb-spark-grad">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#8080FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000BFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hb-flare-grad">
            <stop offset="0%" stopColor="#000BFF" stopOpacity="0.7" />
            <stop offset="30%" stopColor="#000BFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000BFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Laser line — shoots from left to center */}
        <line
          id="hb-laser"
          x1="-3000" y1="0" x2="-3000" y2="0"
          stroke="url(#hb-laser-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0"
        />

        {/* Beam rects — expand from center outward */}
        {/* Horizontal */}
        <rect className="hb-beam" data-cx="0" x="0" y="-3" width="0" height="6" fill="url(#hb-beam-h)" opacity="0" />
        {/* Vertical */}
        <rect className="hb-beam" data-cx="0" x="-3" y="0" width="6" height="0" fill="url(#hb-beam-v)" opacity="0"
          transform="rotate(90)" />
        {/* Diagonal 1 (top-left to bottom-right) */}
        <rect className="hb-beam" data-cx="0" x="0" y="-3" width="0" height="6" fill="url(#hb-beam-d1)" opacity="0"
          transform="rotate(45)" />
        {/* Diagonal 2 (top-right to bottom-left) */}
        <rect className="hb-beam" data-cx="0" x="0" y="-3" width="0" height="6" fill="url(#hb-beam-d2)" opacity="0"
          transform="rotate(-45)" />

        {/* Spark and flare at center */}
        <circle id="hb-spark" cx="0" cy="0" r="20" fill="url(#hb-spark-grad)" opacity="0"
          style={{ transformOrigin: "0 0", transformBox: "fill-box" }} />
        <circle id="hb-flare" cx="0" cy="0" r="40" fill="url(#hb-flare-grad)" opacity="0"
          style={{ transformOrigin: "0 0", transformBox: "fill-box" }} />
      </svg>
    </div>
  );
}
