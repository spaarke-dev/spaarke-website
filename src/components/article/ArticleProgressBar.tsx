"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar that tracks how far the user has scrolled through
 * the article. Sits below the SiteHeader and uses requestAnimationFrame
 * to stay smooth without causing layout work.
 */
export function ArticleProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const pct = Math.min(100, Math.max(0, (scrollTop / max) * 100));
      setProgress(pct);
    };

    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-[3px]"
      aria-hidden="true"
    >
      <div
        className="bg-spaarke-blue h-full transition-[width] duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
