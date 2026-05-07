"use client";

import { useEffect } from "react";
import { ensureAttribution, recordPageView } from "@/lib/attribution";
import { detectAiSource } from "@/content/analytics/ai-sources";
import { track } from "@/lib/analytics";

export function AttributionBootstrap() {
  useEffect(() => {
    const attr = ensureAttribution(detectAiSource);
    recordPageView();
    if (attr.ai_source) {
      track("AI Source Visit", { ai_source: attr.ai_source });
    }
  }, []);
  return null;
}
