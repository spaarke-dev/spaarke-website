"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyTagline() {
  const ref = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

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

  // Detect when the tagline becomes sticky
  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      // Stuck when top is at or near the sticky position (73px)
      setIsStuck(rect.top <= 74);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`sticky z-40 flex items-center justify-center py-6 transition-colors duration-200 ${
        isStuck
          ? "border-b border-border bg-background"
          : ""
      }`}
      style={{ top: "73px", marginBottom: "0" }}
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
    </div>
  );
}
