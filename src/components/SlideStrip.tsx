import Image from "next/image";

/**
 * The nine slides of the LinkedIn overview carousel, rendered from the approved
 * carousel source (kept privately, not in this repo). Alt text follows the
 * carousel's own alt text, one sentence per slide.
 */
const SLIDES = [
  'Legal runs on decisions. Spaarke makes them intelligent. A decision card in which Spaarke AI proposes reducing an invoice line from $950 to $850 an hour, citing guideline 3.2 and the matter\'s budget, for a person to confirm.',
  "Your legal team makes thousands of decisions. What does it learn from them? Matters, invoices, contracts, documents, and email shown as five unconnected systems.",
  "Spaarke joins them in one living model: a matter connected to its counsel, budget, invoices, guidelines, documents, and decisions.",
  "One intelligence layer across your systems of record: Spaarke's system of record, your other systems, and external legal information, with AI, decisions, reporting, and automation above it.",
  "Invoice review from billing guideline to rule, line check, and recorded decision.",
  "AI proposes and a person decides; each decision record becomes institutional knowledge.",
  "Spaarke inside Copilot, Outlook, Word and Excel, Teams, and SharePoint, deployed in your tenant or hosted by Spaarke.",
  "The five phases of the Spaarke Method: Envision, Design, Build, Deploy, and Manage.",
  "Technology, consulting, and managed services as one integrated platform and service joined by the ontology. Which decision would you start with?",
];

export function SlideStrip() {
  return (
    <div
      role="region"
      aria-label="Spaarke overview slides"
      tabIndex={0}
      className="focus-visible:ring-spaarke-blue flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 focus-visible:outline-none focus-visible:ring-2 md:gap-6"
    >
      {SLIDES.map((alt, i) => {
        const n = String(i + 1).padStart(2, "0");
        // Widths leave part of the next slide showing at every breakpoint, so
        // the strip reads as scrollable.
        return (
          <figure
            key={n}
            className="w-[78%] shrink-0 snap-start sm:w-[42%] md:w-[29%] lg:w-[21.5%]"
          >
            <Image
              src={`/design-partners/slide-${n}.png`}
              alt={`Slide ${i + 1} of 9. ${alt}`}
              width={1080}
              height={1350}
              sizes="(min-width: 1024px) 22vw, (min-width: 768px) 29vw, (min-width: 640px) 42vw, 78vw"
              className="border-line h-auto w-full rounded-lg border"
            />
          </figure>
        );
      })}
    </div>
  );
}
