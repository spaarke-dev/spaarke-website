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

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "73", 10);
      setIsStuck(rect.top <= headerH + 1);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`sticky z-40 flex items-center justify-center px-6 transition-colors duration-200 ${
        isStuck ? "border-b border-border bg-background py-4" : "py-4"
      }`}
      style={{
        top: "var(--header-h, 73px)",
      }}
    >
      <p
        className="font-semibold text-foreground/80"
        style={{
          fontSize: "clamp(1.5rem, 3vw, 8rem)",
          letterSpacing: "0.04em",
        }}
      >
        Raise the IQ of Your Legal Work
      </p>
    </div>
  );
}
