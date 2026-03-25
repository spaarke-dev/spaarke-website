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
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "73", 10);
      setIsStuck(rect.top <= headerH + 1);
      setScrollProgress(Math.min(1, window.scrollY / 150));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`sticky z-40 flex flex-col items-center transition-colors duration-200 ${
        isStuck ? "border-b border-border bg-background py-4" : "py-2"
      }`}
      style={{
        top: "var(--header-h, 73px)",
        /* Pull tagline up into hero viewport, but cancel out for elements below */
        marginTop: "-28vh",
        marginBottom: "28vh",
      }}
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
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.4, behavior: "smooth" })}
        className="mt-2 inline-flex animate-bounce text-muted-foreground transition-opacity hover:text-foreground"
        style={{ opacity: 1 - scrollProgress }}
        aria-label="Scroll to articles"
      >
        <ChevronDown24Regular className="h-8 w-8" />
      </button>
    </div>
  );
}
