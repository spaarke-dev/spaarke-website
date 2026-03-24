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
      ? "/images/hero/hero-workspace-zoom-in-dark-mode.png"
      : "/images/hero/hero-workspace-zoom-in-light-mode.png";

  const fullPageImage =
    theme === "dark"
      ? "/images/hero/hero-workspace-full-page-dark-mode.png"
      : "/images/hero/hero-workspace-full-page-light-mode.png";

  const scrollDown = useCallback(() => {
    const next = document.getElementById("articles");
    next?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <section className="relative flex h-[calc(100vh-73px)] flex-col overflow-hidden">
        {/* Animated laser background — centered */}
        <HeroBackground originX={50} originY={40} />

        {/* Hero content — flanking center with equal margins */}
        <div
          className="relative flex items-center justify-center"
          style={{ gap: "8vw", paddingTop: "10vh" }}
        >
          {/* Left — headline, left-aligned text but pushed right toward center */}
          <div className="flex w-[42%] justify-end">
            <h1
              className="font-bold leading-[1.05] tracking-tight text-hero-red dark:text-white"
              style={{ fontSize: "clamp(2.8rem, 5.8vw, 16rem)" }}
            >
              Legal
              <br />
              Operations
              <br />
              Intelligence
            </h1>
          </div>

          {/* Right — screenshot with expand button */}
          <div className="group relative w-[42%]">
            <Image
              src={heroImage}
              alt="Spaarke Legal Operations Workspace"
              width={1200}
              height={800}
              priority
              className="h-auto w-full rounded-lg shadow-2xl"
              style={{ maxWidth: "min(100%, 42vw)" }}
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute right-[3%] top-[3%] rounded-md bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              aria-label="Expand image"
            >
              <ArrowExpand24Regular />
            </button>
          </div>
        </div>

        {/* Tagline — centered in remaining space */}
        <div className="relative flex flex-1 items-center justify-center">
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

        {/* Scroll down arrow */}
        <div className="relative pb-[2vh] text-center">
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
          src={fullPageImage}
          alt="Spaarke Legal Operations Workspace — Full Page"
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
