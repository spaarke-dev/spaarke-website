"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import {
  ChevronDown24Regular,
  ArrowExpand24Regular,
} from "@fluentui/react-icons";
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
        {/* Animated laser background — positioned with blue dot at "Intelligence" */}
        <HeroBackground />

        {/* Hero content — responsive sizing with clamp */}
        <div className="relative mx-auto flex w-full max-w-7xl items-start px-4 pt-[6vh] sm:px-6 sm:pt-[8vh] lg:px-8 lg:pt-[10vh]">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left — headline with viewport-responsive font */}
            <div>
              <h1
                className="font-bold leading-[1.05] tracking-tight text-hero-red dark:text-white"
                style={{ fontSize: "clamp(3.5rem, 6.5vw, 7rem)" }}
              >
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
                className="h-auto w-full rounded-lg shadow-2xl"
                style={{ maxWidth: "clamp(320px, 38vw, 640px)" }}
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute right-3 top-3 rounded-md bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                aria-label="Expand image"
              >
                <ArrowExpand24Regular />
              </button>
            </div>
          </div>
        </div>

        {/* Tagline — midway between hero content and scroll arrow */}
        <div className="relative flex flex-1 items-center justify-center">
          <p
            className="font-semibold tracking-tight text-foreground/80"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
          >
            Raise the IQ of Your Legal Work
          </p>
        </div>

        {/* Scroll down arrow */}
        <div className="relative pb-6 text-center">
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
