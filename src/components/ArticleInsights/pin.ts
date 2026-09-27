/**
 * Putting a cited heading in front of the reader, and saying which one it is.
 *
 * Used in two places that look different and are the same act: scrolling the
 * article behind the console to a citation into the page you are already on, and
 * scrolling the reader to a citation into one you are not.
 *
 * **The mark matters as much as the scroll.** An article that arrives at roughly
 * the right place without saying which line it was sent to leaves the reader to
 * work that out, which is most of the work they came to avoid.
 */

const MARK_MS = 1_400;

export function markHeading(element: HTMLElement): () => void {
  element.style.transition = "background-color 900ms ease";
  element.style.backgroundColor = "rgba(0, 11, 255, 0.10)";
  const timer = setTimeout(() => {
    element.style.backgroundColor = "transparent";
  }, MARK_MS);
  return () => clearTimeout(timer);
}

/**
 * Scrolls the page itself to a heading, for a citation into the article already
 * on screen.
 *
 * `scrollIntoView` rather than an arithmetic offset, because the article's
 * headings already carry `scroll-mt-[132px]` to clear the sticky site header and
 * `scroll-margin-top` is exactly what this honours. Computing the offset again
 * here would be a second opinion about the header's height, and the two would
 * disagree the first time it changed.
 *
 * Returns false when the heading is not on the page, so the caller can let the
 * link do what links do.
 */
export function pinInPage(anchor: string): boolean {
  const target = document.getElementById(anchor);
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  markHeading(target);
  return true;
}
