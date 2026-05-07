"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Props = {
  slug: string;
};

export function ArticleReadTracker({ slug }: Props) {
  useEffect(() => {
    let fired = false;
    let scrollHit = false;
    const startTime = Date.now();
    const dwellThreshold = 45_000;

    function checkAndFire() {
      if (fired) return;
      const dwell = Date.now() - startTime;
      if (scrollHit && dwell >= dwellThreshold) {
        fired = true;
        track("Article Read", {
          article_slug: slug,
          time_on_page: Math.round(dwell / 1000),
        });
      }
    }

    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total >= 0.75) {
        scrollHit = true;
        checkAndFire();
      }
    }

    function onInterval() {
      checkAndFire();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = setInterval(onInterval, 5_000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
    };
  }, [slug]);

  return null;
}
