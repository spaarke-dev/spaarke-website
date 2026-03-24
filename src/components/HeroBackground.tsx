"use client";

import { useEffect, useRef } from "react";

/**
 * One-shot laser animation as hero background.
 * 1. Red laser shoots from left → hits blue dot at center
 * 2. Laser stays visible
 * 3. Blue dot appears at impact
 * 4. Beams radiate outward FROM center (grow from 0 to full length)
 * 5. Everything stays as a static background
 */

const LASER_FIRE = 1200;
const SPARK_START = 1000;
const BEAM_START = 1100;
const BEAM_GROW = 800;

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
    const blueDot = svg.getElementById("hb-blue-dot") as SVGCircleElement | null;
    const beamGroups = svg.querySelectorAll<SVGGElement>(".hb-beam-g");

    let cancelled = false;
    const startTime = performance.now();
    let done = false;

    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now - startTime;

      // --- Laser: shoots from left to center, stays ---
      if (laser) {
        if (elapsed < LASER_FIRE) {
          const progress = elapsed / LASER_FIRE;
          const tipX = -4000 + progress * 4000;
          const tailX = -4000 + Math.max(0, progress - 0.25) / 0.75 * 4000;
          laser.setAttribute("x", String(tailX));
          laser.setAttribute("width", String(Math.max(0, tipX - tailX)));
          laser.setAttribute("opacity", "1");
        } else {
          // Stays visible — full length from left edge to center
          laser.setAttribute("x", "-4000");
          laser.setAttribute("width", "4000");
          laser.setAttribute("opacity", "1");
        }
      }

      // --- Blue dot: appears at impact, stays ---
      if (blueDot) {
        if (elapsed >= SPARK_START) {
          const fadeIn = Math.min(1, (elapsed - SPARK_START) / 200);
          blueDot.setAttribute("opacity", String(fadeIn));
        }
      }

      // --- Spark flash at impact ---
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

      // --- Beams: grow outward from center, then stay ---
      if (elapsed >= BEAM_START) {
        const beamElapsed = elapsed - BEAM_START;
        beamGroups.forEach((g, i) => {
          const rect = g.querySelector("rect");
          if (!rect) return;
          // Stagger each beam slightly
          const stagger = i * 80;
          const localElapsed = beamElapsed - stagger;

          if (localElapsed < 0) {
            rect.setAttribute("width", "0");
            rect.setAttribute("opacity", "0");
          } else if (localElapsed < BEAM_GROW) {
            // Grow from center outward
            const progress = easeOutCubic(localElapsed / BEAM_GROW);
            const w = 4000 * progress;
            rect.setAttribute("x", String(-w / 2));
            rect.setAttribute("width", String(w));
            rect.setAttribute("opacity", "1");
          } else if (!done) {
            // Final state — stays
            rect.setAttribute("x", "-2000");
            rect.setAttribute("width", "4000");
            rect.setAttribute("opacity", "1");
          }
        });

        // Check if all beams are done
        const lastBeamEnd = BEAM_START + (beamGroups.length - 1) * 80 + BEAM_GROW;
        if (elapsed > lastBeamEnd + 100) {
          done = true;
          return; // Stop animation loop
        }
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, []);

  const t = 50;
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
          <linearGradient id="hb-laser-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FC0000" stopOpacity="0" />
            <stop offset="20%" stopColor="#FC0000" />
            <stop offset="100%" stopColor="#FC0000" />
          </linearGradient>
          <linearGradient id="hb-beam-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD200" />
            <stop offset="50%" stopColor="#FC0000" />
            <stop offset="100%" stopColor="#FFD200" />
          </linearGradient>
          <radialGradient id="hb-spark-grad">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#000BFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000BFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Red laser — left to center, stays */}
        <rect
          id="hb-laser"
          x="-4000" y={-halfT * 0.6}
          width="0" height={t * 0.6}
          fill="url(#hb-laser-grad)"
          opacity="0"
        />

        {/* Beams radiate from center — staggered, grow outward */}
        {/* Vertical */}
        <g className="hb-beam-g" transform="rotate(90)">
          <rect x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
        </g>
        {/* Diagonal 45° */}
        <g className="hb-beam-g" transform="rotate(45)">
          <rect x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
        </g>
        {/* Diagonal -45° */}
        <g className="hb-beam-g" transform="rotate(-45)">
          <rect x="0" y={-halfT} width="0" height={t} fill="url(#hb-beam-grad)" opacity="0" />
        </g>

        {/* Spark flash */}
        <circle id="hb-spark" cx="0" cy="0" r="25" fill="url(#hb-spark-grad)" opacity="0" />

        {/* Blue dot at center — top layer, larger */}
        <circle id="hb-blue-dot" cx="0" cy="0" r="50" fill="#000BFF" opacity="0" />
      </svg>
    </div>
  );
}
