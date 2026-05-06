import { readFileSync } from "node:fs";
import { join } from "node:path";

type Props = {
  /** Path under /public, e.g. "/brand/diagrams/spaarke-ai-architecture.svg". */
  src: string;
  /** Wrapper className applied to the surrounding <span>. */
  className?: string;
  /** Accessible label — set on inner <svg> via aria-label. */
  ariaLabel: string;
};

/**
 * Server component that reads an SVG file from /public at module render
 * time and inlines its markup into the page. Required for diagrams whose
 * <image href="..."> references won't resolve when loaded via <img> or
 * <object> — inlining puts the SVG in the document DOM where the browser
 * loads referenced assets normally. No memo cache because dev HMR can
 * leave stale entries; the OS file cache makes readFileSync cheap.
 */
export function InlineSvg({ src, className, ariaLabel }: Props) {
  const path = join(process.cwd(), "public", src.replace(/^\//, ""));
  let svg = readFileSync(path, "utf8");
  // Ensure the SVG has role="img" + the caller's aria-label. We strip
  // any existing role/aria-label off the root <svg> tag and re-inject
  // ours, so the caller controls a11y.
  svg = svg.replace(/<svg\b([^>]*)>/i, (_match, attrs: string) => {
    const cleaned = attrs
      .replace(/\s(?:role|aria-label)="[^"]*"/gi, "")
      .trim();
    return `<svg ${cleaned} role="img" aria-label="${ariaLabel.replace(/"/g, "&quot;")}">`;
  });
  return (
    <span
      className={className}
      // SVG content is read from our own /public folder, not user input.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
