"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const articles = [
  {
    slug: "raising-the-iq-of-legal-work",
    title: "Raising the IQ of Legal Work",
    excerpt:
      "Work IQ is a three-part stack: Data, Memory, and Inference. Data captures how work gets done.",
  },
  {
    slug: "the-case-for-unified-legal-data",
    title: "The Case for Unified Legal Data",
    excerpt:
      "Fragmented systems create blind spots. Unifying matter, spend, and workflow data unlocks visibility.",
  },
  {
    slug: "from-reactive-to-predictive-operations",
    title: "From Reactive to Predictive Operations",
    excerpt:
      "Intelligence-driven operations shift the paradigm — anticipating workload, forecasting spend.",
  },
  {
    slug: "operational-memory-for-legal-teams",
    title: "Operational Memory for Legal Teams",
    excerpt:
      "Institutional knowledge walks out the door. Operational memory captures decisions and context.",
  },
  {
    slug: "intelligent-workflow-automation",
    title: "Intelligent Workflow Automation",
    excerpt:
      "Automation without intelligence just moves tasks faster. Intelligent workflows adapt to context.",
  },
  {
    slug: "matter-lifecycle-intelligence",
    title: "Matter Lifecycle Intelligence",
    excerpt:
      "Every matter follows a lifecycle. Intelligence surfaces patterns that improve outcomes over time.",
  },
  {
    slug: "legal-spend-analytics",
    title: "Legal Spend Analytics",
    excerpt:
      "Move beyond accruals and invoices. Understand the true cost of legal operations at every level.",
  },
  {
    slug: "ai-powered-document-understanding",
    title: "AI-Powered Document Understanding",
    excerpt:
      "Transform unstructured legal documents into structured, searchable, actionable intelligence.",
  },
  {
    slug: "cross-functional-legal-collaboration",
    title: "Cross-Functional Legal Collaboration",
    excerpt:
      "Legal doesn't operate in a vacuum. Break down silos between legal, finance, and business teams.",
  },
];

function ArticleCard({
  slug,
  title,
  excerpt,
}: {
  slug: string;
  title: string;
  excerpt: string;
}) {
  return (
    <Link
      href={`/library/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-lg"
      style={{ aspectRatio: "3/4" }}
    >
      {/* Placeholder image area */}
      <div className="flex-1 bg-muted/40 transition-colors group-hover:bg-muted/60" />
      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold leading-tight text-hero-red group-hover:underline">
          {title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}

export default function LibrarySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [cardOverflow, setCardOverflow] = useState(0);

  // Measure how much the card grid overflows the visible area
  useEffect(() => {
    function measure() {
      const container = cardContainerRef.current;
      if (!container) return;
      const visibleHeight = container.parentElement?.clientHeight ?? 0;
      const totalHeight = container.scrollHeight;
      setCardOverflow(Math.max(0, totalHeight - visibleHeight));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Track scroll position to translate the card grid
  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      setScrollOffset(Math.max(0, Math.min(scrolled, cardOverflow)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [cardOverflow]);

  const sectionHeight = `calc(100vh + ${cardOverflow}px)`;

  return (
    <section
      id="library-section"
      ref={sectionRef}
      className="relative bg-background"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container — pins below the sticky tagline header */}
      <div className="sticky flex flex-col overflow-hidden" style={{ top: "calc(var(--header-h, 73px) + var(--tagline-h, 80px))", height: "calc(100vh - var(--header-h, 73px) - var(--tagline-h, 80px))" }}>
        {/* 2/3 split layout — fills remaining height */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar — dark gray background, fixed content */}
          <div className="flex w-[35%] flex-col justify-center bg-neutral-800 px-[4%] text-white dark:bg-neutral-900">
            <h3
              className="font-semibold leading-tight"
              style={{ fontSize: "clamp(1.2rem, 2.2vw, 4rem)" }}
            >
              Work Smarter.
              <br />
              Operate Leaner.
              <br />
              Decide Faster.
            </h3>
            <p
              className="mt-6 max-w-[30ch] text-white/70"
              style={{ fontSize: "clamp(0.875rem, 1vw, 1.5rem)" }}
            >
              Legal operations intelligence that transforms how your team
              captures data, retains knowledge, and makes decisions.
            </p>
            {/* Placeholder image */}
            <div
              className="mt-8 rounded-lg bg-white/10"
              style={{ width: "80%", aspectRatio: "4/3" }}
            />
          </div>

          {/* Right — scrollable article cards */}
          <div className="relative flex-1 overflow-hidden px-[2%] pt-10">
            <div
              ref={cardContainerRef}
              className="grid grid-cols-3 gap-4"
              style={{
                transform: `translateY(-${scrollOffset}px)`,
                willChange: "transform",
              }}
            >
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
