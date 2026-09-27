"use client";

import { CitationChip, isInPageCitation } from "./CitationChip";
import { useInsights } from "./InsightsProvider";
import {
  paragraphIsGeneral,
  PROVENANCE_LABEL,
  type AssistantTurn,
} from "./transcript";

/**
 * One answer: where it came from, the prose, what it rests on, and the one
 * question it may ask back.
 *
 * **The general-knowledge treatment is deliberately quiet.** A left rule and
 * slightly lowered text, with one small label on the first such paragraph. It has
 * to read as a note about where the answer came from and not as a warning that
 * the answer is suspect, because an answer from outside the articles is a normal
 * answer here rather than a degraded one. The owner decided there is no refusal
 * path, so the labeling is the whole mechanism and overstating it would undo it.
 */
export function AnswerBody({
  turn,
  onDismissAsk,
  onAnswerAsk,
  onRetry,
}: {
  turn: AssistantTurn;
  onDismissAsk: () => void;
  onAnswerAsk: () => void;
  onRetry: () => void;
}) {
  const { slug } = useInsights();
  const label = turn.provenance ? PROVENANCE_LABEL[turn.provenance] : null;

  // Grouped, because the two kinds of citation do two different things. One
  // scrolls the page the reader is on; the other opens an article they have not
  // seen. A single undifferentiated row of pills made both unpredictable.
  const inPage = turn.citations.filter((c) => isInPageCitation(c, slug));
  const elsewhere = turn.citations.filter((c) => !isInPageCitation(c, slug));
  // Labels earn their space only when there is something to tell apart. On the
  // library page every citation is to another article, so a heading saying so
  // would be telling the reader what they can see.
  const bothKinds = inPage.length > 0 && elsewhere.length > 0;
  // Computed rather than accumulated in the map, because the label belongs to the
  // first general paragraph and a counter mutated during render is a bug waiting
  // for a re-render to expose it.
  const firstGeneral = turn.paragraphs.findIndex(paragraphIsGeneral);

  return (
    <div>
      {label && (
        <p className="text-fg-low font-mono text-[10px] font-medium uppercase tracking-[0.16em]">
          {label}
        </p>
      )}

      <div
        className="mt-2 space-y-3 text-[15px] leading-relaxed"
        // Politely, and not atomic, so a screen reader hears each sentence as it
        // lands rather than the whole answer re-read on every flush.
        aria-live="polite"
        aria-atomic="false"
        aria-busy={turn.status === "waiting" || turn.status === "streaming"}
      >
        {turn.paragraphs.map((paragraph, i) => {
          const general = paragraphIsGeneral(paragraph);
          const showLabel = general && i === firstGeneral;

          if (general) {
            return (
              <div key={i} className="border-line border-l-2 pl-3">
                {showLabel && (
                  <p className="text-fg-low mb-1 font-mono text-[10px] uppercase tracking-[0.16em]">
                    General knowledge
                  </p>
                )}
                <p className="text-fg-mid">{paragraph.runs.map((r) => r.text).join("")}</p>
              </div>
            );
          }

          return (
            <p key={i} className="text-fg">
              {paragraph.runs.map((run, j) =>
                run.general ? (
                  <span key={j} className="text-fg-mid">
                    {run.text}
                  </span>
                ) : (
                  <span key={j}>{run.text}</span>
                ),
              )}
            </p>
          );
        })}

        {turn.status === "waiting" && <WaitingLine />}
      </div>

      {turn.citations.length > 0 && (
        <div className="mt-4">
          <p className="text-fg-low font-mono text-[10px] font-medium uppercase tracking-[0.16em]">
            Where this comes from
          </p>

          {inPage.length > 0 && (
            <div className="mt-2">
              {bothKinds && (
                <p className="text-fg-low mb-1.5 text-[11px]">In this article</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {inPage.map((citation) => (
                  <CitationChip
                    key={`${citation.slug}#${citation.anchor ?? ""}`}
                    citation={citation}
                  />
                ))}
              </div>
            </div>
          )}

          {elsewhere.length > 0 && (
            <div className={inPage.length > 0 ? "mt-3" : "mt-2"}>
              {bothKinds && (
                <p className="text-fg-low mb-1.5 text-[11px]">
                  {elsewhere.length === 1 ? "From another article" : "From other articles"}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                {elsewhere.map((citation) => (
                  <CitationChip
                    key={`${citation.slug}#${citation.anchor ?? ""}`}
                    citation={citation}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* The question back. Skipping it is one click and costs the reader nothing,
          because the answer above is already complete. */}
      {turn.asked && !turn.askDismissed && (
        <div className="border-line bg-surface mt-4 rounded-md border p-3">
          <p className="text-fg text-[14px] leading-snug">{turn.asked}</p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onAnswerAsk}
              className="text-spaarke-blue focus-visible:ring-spaarke-blue rounded text-[13px] font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2"
            >
              Answer this
            </button>
            <button
              type="button"
              onClick={onDismissAsk}
              className="text-fg-low hover:text-fg-mid focus-visible:ring-spaarke-blue rounded text-[13px] focus-visible:outline-none focus-visible:ring-2"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {turn.error && (
        <div
          role="status"
          className="border-line bg-surface mt-3 rounded-md border p-3 text-[14px] leading-snug"
        >
          <p className="text-fg-mid">{turn.error.message}</p>
          {turn.error.retryable && (
            <button
              type="button"
              onClick={onRetry}
              className="text-spaarke-blue focus-visible:ring-spaarke-blue mt-2 rounded text-[13px] font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2"
            >
              Try that again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * The only thing shown before the first sentence lands, which is two to three
 * seconds. Not a bare spinner: FR-08 asks for a visible state that names what is
 * happening, and a reader who is told the library is being read waits differently
 * from one watching a circle turn.
 */
function WaitingLine() {
  return (
    <p className="text-fg-low flex items-center gap-2 text-[14px]">
      <span
        aria-hidden="true"
        className="bg-fg-low inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full"
      />
      Reading the articles
    </p>
  );
}
