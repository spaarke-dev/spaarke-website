"use client";

import { useEffect, useRef } from "react";

export default function StickyTagline() {
  const ref = useRef<HTMLDivElement>(null);

  // Set CSS variable for tagline height so other components can reference it
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

  return (
    <div
      ref={ref}
      className="sticky top-0 z-40 flex items-center justify-center border-b border-border bg-background py-4"
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
