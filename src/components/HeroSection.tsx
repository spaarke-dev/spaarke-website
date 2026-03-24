"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import {
  ChevronDown24Regular,
  ArrowExpand24Regular,
} from "@fluentui/react-icons";

function SpectralConnector() {
  return (
    <svg
      viewBox="0 0 80 40"
      className="h-6 w-12 sm:h-8 sm:w-16 lg:h-10 lg:w-20"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="beam" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FF9400" />
          <stop offset="50%" stopColor="#FFD200" />
          <stop offset="100%" stopColor="#FF9400" />
        </linearGradient>
      </defs>
      <line x1="8" y1="20" x2="72" y2="20" stroke="url(#beam)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="8" cy="20" r="4" fill="#FF9400" />
      <circle cx="72" cy="20" r="4" fill="#FF9400" />
      <circle cx="8" cy="20" r="7" fill="none" stroke="#FF9400" strokeWidth="1" opacity="0.4">
        <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="72" cy="20" r="7" fill="none" stroke="#FF9400" strokeWidth="1" opacity="0.4">
        <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
    </svg>
  );
}

function StarburstBackground({ isDark }: { isDark: boolean }) {
  const strokeOpacity = isDark ? 0.06 : 0.1;
  return (
    <svg
      viewBox="0 0 1200 1200"
      className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Gold → Red → Gold gradient matching logo rays */}
        <linearGradient id="ray-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD200" stopOpacity={strokeOpacity} />
          <stop offset="50%" stopColor="#FC0000" stopOpacity={strokeOpacity * 1.2} />
          <stop offset="100%" stopColor="#FFD200" stopOpacity={strokeOpacity} />
        </linearGradient>
        <linearGradient id="ray-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFD200" stopOpacity={strokeOpacity} />
          <stop offset="50%" stopColor="#FC0000" stopOpacity={strokeOpacity * 1.2} />
          <stop offset="100%" stopColor="#FFD200" stopOpacity={strokeOpacity} />
        </linearGradient>
        <linearGradient id="ray-d1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD200" stopOpacity={strokeOpacity} />
          <stop offset="50%" stopColor="#FC0000" stopOpacity={strokeOpacity * 1.2} />
          <stop offset="100%" stopColor="#FFD200" stopOpacity={strokeOpacity} />
        </linearGradient>
        <linearGradient id="ray-d2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD200" stopOpacity={strokeOpacity} />
          <stop offset="50%" stopColor="#FC0000" stopOpacity={strokeOpacity * 1.2} />
          <stop offset="100%" stopColor="#FFD200" stopOpacity={strokeOpacity} />
        </linearGradient>
        <radialGradient id="center-glow">
          <stop offset="0%" stopColor={isDark ? "#000BFF" : "#000BFF"} stopOpacity={isDark ? 0.03 : 0.04} />
          <stop offset="100%" stopColor={isDark ? "#000BFF" : "#000BFF"} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Vertical ray */}
      <rect x="596" y="0" width="8" height="1200" fill="url(#ray-v)" />
      {/* Horizontal ray */}
      <rect x="0" y="596" width="1200" height="8" fill="url(#ray-h)" />
      {/* Diagonal ray (top-left to bottom-right) */}
      <rect x="-3" y="-3" width="6" height="1700" fill="url(#ray-d1)"
        transform="rotate(45 600 600)" />
      {/* Diagonal ray (top-right to bottom-left) */}
      <rect x="-3" y="-3" width="6" height="1700" fill="url(#ray-d2)"
        transform="rotate(-45 600 600)" />

      {/* Subtle center glow */}
      <circle cx="600" cy="600" r="200" fill="url(#center-glow)" />
    </svg>
  );
}

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
      <div className="relative max-h-[90vh] max-w-[92vw]">
        <Image
          src={src}
          alt={alt}
          width={2400}
          height={1600}
          className="h-auto max-h-[90vh] w-auto rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { theme } = useTheme();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const heroImage =
    theme === "dark"
      ? "/images/hero/workspace-dark-mode.png"
      : "/images/hero/workspace-light-mode.png";

  const scrollDown = useCallback(() => {
    const next = document.getElementById("articles");
    next?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <section className="relative flex h-[calc(100vh-73px)] flex-col overflow-hidden">
        {/* Starburst background — logo rays as subtle BG */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <StarburstBackground isDark={theme === "dark"} />
        </div>

        {/* Hero content — pushed higher */}
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-start px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — headline */}
            <div>
              <h1 className="text-6xl font-bold leading-[1.05] tracking-tight text-hero-red dark:text-white sm:text-7xl lg:text-8xl">
                Legal
                <br />
                Operations
                <br />
                Intelligence
              </h1>
            </div>

            {/* Right — screenshot with expand button */}
            <div className="group relative flex items-start justify-center">
              <Image
                src={heroImage}
                alt="Spaarke Legal Operations Workspace"
                width={1200}
                height={800}
                priority
                className="h-auto w-full max-w-[480px] rounded-lg shadow-2xl lg:max-w-[520px]"
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 rounded-md bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                aria-label="Expand image"
              >
                <ArrowExpand24Regular />
              </button>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative pb-0 text-center">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Work Smarter
            </span>
            <SpectralConnector />
            <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Operate Leaner
            </span>
            <SpectralConnector />
            <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Decide Faster
            </span>
          </div>
        </div>

        {/* Scroll down arrow — spacing from tagline */}
        <div className="relative pb-4 pt-6 text-center">
          <button
            type="button"
            onClick={scrollDown}
            className="inline-flex animate-bounce text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Scroll to articles"
          >
            <ChevronDown24Regular className="h-8 w-8" />
          </button>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          src={heroImage}
          alt="Spaarke Legal Operations Workspace"
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
