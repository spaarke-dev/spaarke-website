"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shell, Slab } from "@/components/primitives";
import type { BlogPostMeta } from "@/lib/blog";

type Props = {
  posts: BlogPostMeta[];
};

export function WhySpaarkeHero({ posts }: Props) {
  const [active, setActive] = useState(0);

  if (posts.length === 0) return null;

  const slide = posts[active];

  return (
    <Slab tone="dark" className="relative overflow-hidden pb-16 md:pb-20">
      {/* Subtle ambient glow at top center — same brand language as home hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 30%, rgba(180,205,255,0.12) 0%, rgba(80,120,220,0.05) 35%, rgba(0,0,0,0) 70%)",
        }}
      />

      <Shell>
        <div className="relative grid grid-cols-1 items-center gap-10 md:min-h-[480px] md:grid-cols-2 md:gap-16 lg:min-h-[520px]">
          {/* Left: copy */}
          <div className="order-2 md:order-1">
            <p className="text-fg-low font-mono text-[11px] uppercase tracking-[0.18em]">
              By Spaarke
            </p>
            <h1
              className="font-display text-fg mt-4 font-medium leading-[1.05] tracking-[-0.025em]"
              style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
            >
              {slide.title}
            </h1>
            <p className="text-fg-mid mt-6 max-w-prose text-base leading-relaxed md:text-[17px]">
              {slide.summary ?? slide.description}
            </p>
            <div className="mt-8">
              <Link
                href={`/why-spaarke/${slide.slug}`}
                data-track="hero-cta"
                data-track-slug={slide.slug}
                data-track-position={active + 1}
                className="bg-spaarke-blue text-fg hover:bg-spaarke-blue/90 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors"
              >
                Read article
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3 7h8m0 0L8 4m3 3l-3 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: image (or gradient fallback) */}
          <div className="order-1 md:order-2">
            <div
              className="border-line relative aspect-[4/3] w-full overflow-hidden rounded-xl border md:aspect-[5/4]"
              style={{
                background: slide.heroImage
                  ? undefined
                  : "linear-gradient(135deg, #1a1f3a 0%, #2d1f5e 50%, #4a1f4f 100%)",
              }}
            >
              {slide.heroImage ? (
                <Image
                  src={slide.heroImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  priority={active === 0}
                />
              ) : (
                // Decorative gradient with brand color glow
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,91,255,0.40) 0%, rgba(255,77,203,0.20) 40%, rgba(0,0,0,0) 75%)",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div
          className="mt-10 flex items-center justify-center gap-3"
          role="tablist"
          aria-label="Featured articles"
        >
          {posts.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show article ${i + 1}: ${p.title}`}
                onClick={() => setActive(i)}
                className="focus-visible:ring-spaarke-blue group flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2"
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-all ${
                    isActive
                      ? "bg-fg w-6"
                      : "bg-fg-low group-hover:bg-fg-mid"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </Shell>
    </Slab>
  );
}
