"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { ChevronDown24Regular } from "@fluentui/react-icons";

function SpectralConnector() {
  return (
    <svg
      viewBox="0 0 80 40"
      className="h-6 w-12 sm:h-8 sm:w-16 lg:h-10 lg:w-20"
      aria-hidden="true"
    >
      {/* Gradient beam connecting concepts */}
      <defs>
        <linearGradient id="beam" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FF9400" />
          <stop offset="50%" stopColor="#FFD200" />
          <stop offset="100%" stopColor="#FF9400" />
        </linearGradient>
      </defs>
      {/* Central line */}
      <line x1="8" y1="20" x2="72" y2="20" stroke="url(#beam)" strokeWidth="3" strokeLinecap="round" />
      {/* Left node */}
      <circle cx="8" cy="20" r="4" fill="#FF9400" />
      {/* Right node */}
      <circle cx="72" cy="20" r="4" fill="#FF9400" />
      {/* Pulse ring left */}
      <circle cx="8" cy="20" r="7" fill="none" stroke="#FF9400" strokeWidth="1" opacity="0.4">
        <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Pulse ring right */}
      <circle cx="72" cy="20" r="7" fill="none" stroke="#FF9400" strokeWidth="1" opacity="0.4">
        <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
    </svg>
  );
}

export default function HeroSection() {
  const { theme } = useTheme();

  const heroImage =
    theme === "dark"
      ? "/images/hero/workspace-dark-mode.png"
      : "/images/hero/workspace-light-mode.png";

  const scrollDown = () => {
    const next = document.getElementById("articles");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex h-[calc(100vh-73px)] flex-col overflow-hidden">
      {/* Hero content — reduced top padding */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-2 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-[2fr_3fr] lg:gap-10">
          {/* Left — headline: red in light mode, white in dark mode */}
          <div>
            <h1 className="text-6xl font-bold leading-[1.05] tracking-tight text-hero-red dark:text-white sm:text-7xl lg:text-8xl">
              Legal
              <br />
              Operations
              <br />
              Intelligence
            </h1>
          </div>

          {/* Right — screenshot (larger) */}
          <div className="flex items-center justify-center">
            <Image
              src={heroImage}
              alt="Spaarke Legal Operations Workspace"
              width={1400}
              height={933}
              priority
              className="h-auto w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Tagline — creative interconnected layout, moved up */}
      <div className="pb-2 text-center">
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

      {/* Scroll down arrow */}
      <div className="pb-4 text-center">
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
  );
}
