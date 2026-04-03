"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import { ArrowExpand24Regular, ChevronDown24Regular } from "@fluentui/react-icons";
import HeroBackground from "./HeroBackground";

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Expanded workspace image"
    >
      <div className="relative" style={{ maxHeight: "90vh", maxWidth: "92vw" }}>
        <Image
          src={src}
          alt={alt}
          width={3840}
          height={2160}
          className="rounded-lg object-contain"
          style={{ width: "88vw", height: "auto", maxHeight: "88vh" }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { theme } = useTheme();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [heroHeight, setHeroHeight] = useState("calc(100dvh - var(--header-h, 73px))");

  // Measure actual visible height minus header — accounts for browser chrome,
  // bookmark bars, and display scaling that CSS viewport units cannot detect.
  useEffect(() => {
    function measure() {
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "73",
        10
      );
      setHeroHeight(`${window.innerHeight - headerH}px`);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const heroImage =
    theme === "dark"
      ? "/images/hero/hero-workspace-zoom-in-dark-mode.png"
      : "/images/hero/hero-workspace-zoom-in-light-mode.png";

  const fullPageImage =
    theme === "dark"
      ? "/images/hero/hero-workspace-full-page-dark-mode.png"
      : "/images/hero/hero-workspace-full-page-light-mode.png";

  return (
    <>
      {/* Full viewport hero — tagline positioned inside, no bleed possible */}
      <div
        id="hero-section"
        className="relative grid w-[88%] mx-auto"
        style={{
          height: heroHeight,
          gridTemplateRows: "auto 1fr",
          gridTemplateColumns: "1fr 1fr",
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(252,0,0,0.04) 0%, transparent 70%)",
        }}
      >
        {/* Row 1: Tagline spanning full width */}
        <p
          className="col-span-2 self-start pt-20 text-center font-semibold text-foreground/80"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 8rem)",
            letterSpacing: "0.04em",
          }}
        >
          Work Smarter. Operate Leaner. Decide Faster.
        </p>

        {/* Row 2 Left: headline + CTA */}
        <div className="flex items-center justify-end pr-[4vw]" style={{ marginTop: "-15vh" }}>
          <div className="flex flex-col">
            <p
              className="font-semibold leading-[1.15] tracking-tight text-foreground dark:text-white"
              style={{ fontSize: "clamp(1rem, 2vw, 5rem)" }}
            >
              You don&rsquo;t know
              <br />
              what you don&rsquo;t know.
            </p>
            <h1
              className="mt-4 font-bold leading-[1.05] tracking-tight text-foreground dark:text-white/90"
              style={{ fontSize: "clamp(2rem, 4vw, 10rem)" }}
            >
              Legal
              <br />
              Operations
              <br />
              Intelligence
            </h1>
            <Link
              href="/contact"
              className="mt-6 self-start rounded-md bg-[#000BFF] font-medium text-white transition-colors hover:bg-[#0009DD]"
              style={{
                fontSize: "clamp(0.65rem, 0.85vw, 0.95rem)",
                padding: "clamp(0.3rem, 0.5vw, 0.5rem) clamp(0.75rem, 1.2vw, 1.25rem)",
              }}
            >
              Get Access
            </Link>
          </div>
        </div>

        {/* Row 2 Right: screenshot */}
        <div className="group relative hidden items-center pl-[4vw] md:flex" style={{ marginTop: "-15vh" }}>
          <div className="relative">
            <Image
              src={heroImage}
              alt="Spaarke Legal Operations Workspace"
              width={1200}
              height={800}
              priority
              className="h-auto w-full rounded-lg shadow-2xl"
              style={{ maxWidth: "42vw" }}
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute right-[3%] top-[3%] rounded-md bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              style={{ padding: "clamp(0.25rem, 0.5vw, 1rem)" }}
              aria-label="Expand image"
            >
              <ArrowExpand24Regular style={{ width: "clamp(1rem, 1.8vw, 2.5rem)", height: "clamp(1rem, 1.8vw, 2.5rem)" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          src={fullPageImage}
          alt="Spaarke Legal Operations Workspace — Full Page"
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
