import type { Tour } from "./types";

/**
 * Registered tours. Tours are added by content tasks (T02e and the
 * Phase 2 author tasks) below the TOURS marker. Each tour is imported
 * from its own file so unused tours are tree-shaken from a given
 * route's bundle.
 */
// TOURS — append new imports + map entries below.
import { fullWalkthrough } from "./full-walkthrough";

export const TOURS: Record<string, Tour> = {
  // (entries appended by content tasks)
  [fullWalkthrough.slug]: fullWalkthrough,
};

export function getTour(slug: string): Tour | undefined {
  return TOURS[slug];
}

export const DEFAULT_TOUR_SLUG = "full-walkthrough";
