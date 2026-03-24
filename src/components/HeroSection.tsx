"use client";

import { useState, useCallback } from "react";
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

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
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
        {/* Subtle spectral background gradients */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {/* Warm glow — top left */}
          <div className="absolute -left-[10%] -top-[20%] h-[70%] w-[50%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,148,0,0.08)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(255,148,0,0.05)_0%,_transparent_70%)]" />
          {/* Cool glow — right */}
          <div className="absolute -right-[5%] top-[10%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,247,255,0.06)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(0,247,255,0.04)_0%,_transparent_70%)]" />
          {/* Deep accent — bottom center */}
          <div className="absolute -bottom-[10%] left-[20%] h-[50%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,11,255,0.04)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(0,11,255,0.03)_0%,_transparent_70%)]" />
        </div>

        {/* Hero content — pushed higher with items-start + padding */}
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-start px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
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
                className="h-auto w-full max-w-[540px] rounded-lg shadow-2xl lg:max-w-[580px]"
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 rounded-md bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 lg:right-[calc(50%-290px+12px)]"
                aria-label="Expand image"
              >
                <ArrowExpand24Regular />
              </button>
            </div>
          </div>
        </div>

        {/* Tagline — moved up with margin-top auto removed */}
        <div className="relative pb-1 text-center">
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

        {/* Scroll down arrow — more spacing from tagline */}
        <div className="relative pb-4 pt-4 text-center">
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
