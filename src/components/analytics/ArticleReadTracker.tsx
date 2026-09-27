"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import {
  assistantUsed,
  depthBucket,
  resetAssistantUsed,
  secondsBucket,
} from "@/lib/insights/engagement";

type Props = {
  slug: string;
};

/**
 * Two events, for two different questions.
 *
 * "Article Read" is the existing conversion signal: reached three quarters of the
 * way down and stayed 45 seconds. It fires at most once.
 *
 * "Article Engagement" is the baseline, added for task 040. It fires once per
 * visit as the page goes away, and carries how far the reader got, how long they
 * stayed, and **whether they used the assistant**. That last property is the whole
 * point: the open question is whether the assistant deepens engagement with the
 * articles or replaces it, and putting the answer in one event's breakdown rather
 * than in a join across two is what makes it a question somebody will actually
 * run.
 */
export function ArticleReadTracker({ slug }: Props) {
  useEffect(() => {
    let fired = false;
    let scrollHit = false;
    let maxDepth = 0;
    let reported = false;
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
      const fraction = total > 0 ? scrolled / total : 0;
      if (fraction > maxDepth) maxDepth = Math.min(fraction, 1);
      if (fraction >= 0.75) {
        scrollHit = true;
        checkAndFire();
      }
    }

    /**
     * Fired as the page goes away. `pagehide` rather than `beforeunload`, because
     * a phone backgrounding a tab never fires `beforeunload` and mobile is where
     * most of this traffic comes from. `visibilitychange` covers the tab switch
     * that never comes back.
     */
    function report() {
      if (reported) return;
      reported = true;
      track("Article Engagement", {
        article_slug: slug,
        depth: depthBucket(maxDepth),
        seconds: secondsBucket(Math.round((Date.now() - startTime) / 1000)),
        assistant: assistantUsed(),
      });
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") report();
    }

    function onInterval() {
      checkAndFire();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", report);
    document.addEventListener("visibilitychange", onVisibility);
    const interval = setInterval(onInterval, 5_000);

    // Measure the first screen too. A reader who lands and leaves without
    // scrolling is the case the baseline most needs to count.
    onScroll();

    return () => {
      // A client-side navigation unmounts this, which is the end of the visit as
      // far as the baseline is concerned.
      report();
      resetAssistantUsed();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", report);
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(interval);
    };
  }, [slug]);

  return null;
}
