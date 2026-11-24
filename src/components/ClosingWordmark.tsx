/**
 * The Spaarke word logo that heads the closing band on Home, Platform and
 * Services (2026-11-23: Home and Services adopted the Platform closing). The
 * SVG is white on transparent, for the black closing backdrop; the heading's
 * accessible name is "Spaarke".
 */
export function ClosingWordmark() {
  return (
    <h2 className="m-0 flex justify-center">
      <span className="sr-only">Spaarke</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logos/spaarke-white-word-logo.svg"
        alt=""
        aria-hidden="true"
        className="h-auto"
        style={{ width: "clamp(220px, 32vw, 440px)" }}
      />
    </h2>
  );
}
