"use client";

import { useEffect, useRef } from "react";

export default function StickyTagline() {
  const ref = useRef<HTMLDivElement>(null);

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
      className="sticky z-40 flex items-center justify-center border-b border-border bg-background py-6"
      style={{ top: "73px", marginTop: "2vh" }}
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
