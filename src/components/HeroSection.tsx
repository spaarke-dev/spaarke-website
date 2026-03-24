"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { ChevronDown24Regular } from "@fluentui/react-icons";

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
      {/* Hero content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left — headline */}
          <div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-hero-red sm:text-6xl lg:text-7xl">
              Legal
              <br />
              Operations
              <br />
              Intelligence
            </h1>
          </div>

          {/* Right — screenshot */}
          <div className="flex items-center justify-center">
            <Image
              src={heroImage}
              alt="Spaarke Legal Operations Workspace"
              width={1200}
              height={800}
              priority
              className="h-auto w-full max-w-[600px] rounded-lg shadow-2xl lg:max-w-none"
            />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="pb-4 text-center">
        <p className="text-base font-semibold tracking-wide text-foreground sm:text-lg">
          Work Smarter&ensp;&lt;-&gt;&ensp;Operate Leaner&ensp;&lt;-&gt;&ensp;Decide Faster
        </p>
      </div>

      {/* Scroll down arrow */}
      <div className="pb-6 text-center">
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
