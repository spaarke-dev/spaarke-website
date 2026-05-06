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

const cache = new Map<string, string>();

/**
 * Server component that reads an SVG file from /public at module render
 * time and inlines its markup into the page. Required for diagrams whose
 * <image href="..."> references won't resolve when loaded via <img> or
 * <object> — inlining puts the SVG in the document DOM where the browser
 * loads referenced assets normally.
 */
export function InlineSvg({ src, className, ariaLabel }: Props) {
  let svg = cache.get(src);
  if (!svg) {
    const path = join(process.cwd(), "public", src.replace(/^\//, ""));
    svg = readFileSync(path, "utf8");
    // Ensure the SVG has aria-label set. We strip any existing role/aria-label
    // off the root <svg> tag and re-inject ours, so the caller controls a11y.
    svg = svg.replace(
      /<svg\b([^>]*)>/i,
      (_match, attrs: string) => {
        const cleaned = attrs
          .replace(/\s(?:role|aria-label)="[^"]*"/gi, "")
          .trim();
        return `<svg ${cleaned} role="img" aria-label="${ariaLabel.replace(/"/g, "&quot;")}">`;
      },
    );
    cache.set(src, svg);
  }
  return (
    <span
      className={className}
      // SVG content is read from our own /public folder at build time,
      // not user input.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
