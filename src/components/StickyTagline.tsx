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

  function scrollToLibrary() {
    const library = document.getElementById("library-section");
    if (library) {
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "73", 10);
      const taglineH = ref.current?.offsetHeight ?? 80;
      const top = library.getBoundingClientRect().top + window.scrollY - headerH - taglineH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <div
      ref={ref}
      className={`sticky z-40 flex flex-col items-center px-6 transition-colors duration-200 ${
        isStuck ? "border-b border-border bg-background py-4" : "py-2"
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
        Work Smarter. Operate Leaner. Decide Faster.
      </p>

      {/* Scroll arrow — fades out as user scrolls */}
      <button
        type="button"
        onClick={scrollToLibrary}
        className="mt-2 inline-flex animate-bounce text-muted-foreground transition-opacity hover:text-foreground"
        style={{ opacity: 1 - scrollProgress }}
        aria-label="Scroll to articles"
      >
        <ChevronDown24Regular className="h-8 w-8" />
      </button>
    </div>
  );
}
