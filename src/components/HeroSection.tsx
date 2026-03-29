"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import { ArrowExpand24Regular } from "@fluentui/react-icons";
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
      <div className="relative" style={{ height: "calc(80vh - var(--header-h, 73px))" }}>
        {/* Background — hidden per user feedback */}
        {/* <div className="absolute inset-0 overflow-hidden">
          <HeroBackground originX={50} originY={40} />
        </div> */}

        {/* Hero content — vertically centered */}
        <div
          className="relative flex h-full flex-col items-center justify-center px-6 py-12 md:flex-row md:px-0 md:py-0"
          style={{ gap: "clamp(2rem, 8vw, 8vw)" }}
        >
          {/* Left — problem statement + headline + CTA */}
          <div className="flex w-full flex-col items-center px-6 md:w-[42%] md:items-end md:px-0">
            <div className="flex flex-col items-center md:items-start">
              <p
                className="text-center font-semibold leading-[1.15] tracking-tight text-foreground dark:text-white md:text-left"
                style={{ fontSize: "clamp(1rem, 2vw, 5rem)" }}
              >
                You don&rsquo;t know
                <br />
                what you don&rsquo;t know.
              </p>
              <h1
                className="mt-4 text-center font-bold leading-[1.05] tracking-tight text-foreground dark:text-white/90 md:text-left"
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
                className="mt-6 self-center rounded-md bg-[#000BFF] text-white font-medium transition-colors hover:bg-[#0009DD] md:self-start"
                style={{
                  fontSize: "clamp(0.65rem, 0.85vw, 0.95rem)",
                  padding: "clamp(0.3rem, 0.5vw, 0.5rem) clamp(0.75rem, 1.2vw, 1.25rem)",
                }}
              >
                Get Access
              </Link>
            </div>
          </div>

          {/* Right — screenshot (hidden on mobile) */}
          <div className="group relative hidden w-[42%] md:block">
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
