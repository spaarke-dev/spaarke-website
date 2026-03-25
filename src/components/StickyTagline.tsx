"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown24Regular } from "@fluentui/react-icons";

export default function StickyTagline() {
  const ref = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function measure() {
      if (ref.current) {
        document.documentElement.style.setProperty(
          "--tagline-h",
          `${ref.current.offsetHeight}px`
        );
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const stuck = rect.top <= 74;
      setIsStuck(stuck);
      // Arrow fades out over first 150px of scroll
      const progress = Math.min(1, window.scrollY / 150);
      setScrollProgress(progress);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`sticky z-40 flex flex-col items-center justify-center transition-colors duration-200 ${
        isStuck ? "border-b border-border bg-background" : ""
      }`}
      style={{ top: "73px", paddingTop: isStuck ? "1rem" : "0.5rem", paddingBottom: isStuck ? "1rem" : "0" }}
    >
      <p
        className="font-semibold text-foreground/80"
        style={{
          fontSize: "clamp(2rem, 4vw, 12rem)",
          letterSpacing: "0.04em",
        }}
      >
        Raise the IQ of Your Legal Work
      </p>

      {/* Scroll arrow — fades out as user scrolls */}
      <button
        type="button"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.5, behavior: "smooth" })}
        className="mt-3 inline-flex animate-bounce text-muted-foreground transition-opacity hover:text-foreground"
        style={{ opacity: 1 - scrollProgress }}
        aria-label="Scroll to articles"
      >
        <ChevronDown24Regular className="h-8 w-8" />
      </button>
    </div>
  );
}
