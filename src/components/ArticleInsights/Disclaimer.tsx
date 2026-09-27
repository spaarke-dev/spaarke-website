/**
 * FR-10. Present in the first rendered state, on both surfaces, and never
 * appearing after a first answer.
 *
 * The owner decided there is no refusal path for questions touching legal
 * positions: the assistant answers them under labeled provenance like anything
 * else. This line is therefore the whole of what stands in for that refusal, so it
 * is always on screen and it is deliberately not a box, a banner or an icon. A
 * reader who has to dismiss something before reading has been told the product
 * does not trust itself.
 */
export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-fg-low text-[11px] leading-snug ${className}`}>
      Informational, drawn from Spaarke&rsquo;s published articles and general knowledge. Not legal
      advice.
    </p>
  );
}
