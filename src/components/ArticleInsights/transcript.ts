import type { Citation, Provenance } from "@/lib/insights/types";
import type { InsightsErrorCode, InsightsEvent } from "@/lib/insights/stream";

/**
 * The view model for a conversation, and the reducer that events feed.
 *
 * Kept out of the components so the part with the edge cases is plain data. Two
 * of those edge cases are worth knowing before changing anything here.
 *
 * **Paragraphs are assembled, not split.** Events arrive as runs of prose that
 * may end mid paragraph, and the assembler preserves the trailing newline so the
 * client can tell paragraphs apart. So a run either continues the paragraph being
 * built or starts a new one, and the answer cannot be re-split later because the
 * newlines are gone by then.
 *
 * **One newline ends a paragraph, not two.** This is the part that was wrong the
 * first time. The model writes a blank line between paragraphs, but the stream
 * assembler breaks a unit at every newline and then drops the unit that is nothing
 * but whitespace, so what arrives here is a single trailing newline and the blank
 * line is already gone. Splitting on two newlines put a whole answer in one
 * paragraph, and a live turn is what showed it.
 *
 * **The general flag belongs to the run, not to the paragraph.** A mixed answer
 * marks the passages resting on outside knowledge, and a passage is usually a
 * whole paragraph but is not guaranteed to be. So the flag is carried per run and
 * a paragraph is treated as general only when every run in it is.
 */

export type Run = { text: string; general: boolean };
export type Paragraph = { runs: Run[] };

export type TurnStatus = "waiting" | "streaming" | "done" | "failed";

export type AssistantTurn = {
  role: "assistant";
  id: string;
  paragraphs: Paragraph[];
  citations: Citation[];
  provenance: Provenance | null;
  /** The one question the assistant may ask back. Always skippable. */
  asked: string | null;
  askDismissed: boolean;
  status: TurnStatus;
  error: { code: InsightsErrorCode; message: string; retryable: boolean } | null;
};

export type ReaderTurn = { role: "reader"; id: string; text: string };
export type Turn = ReaderTurn | AssistantTurn;

export function newAssistantTurn(id: string): AssistantTurn {
  return {
    role: "assistant",
    id,
    paragraphs: [],
    citations: [],
    provenance: null,
    asked: null,
    askDismissed: false,
    status: "waiting",
    error: null,
  };
}

/**
 * Codes worth offering a retry for.
 *
 * A rate limit, a spend ceiling and a failed captcha are all states where trying
 * again immediately is either useless or rude, so those get copy and no button.
 */
const RETRYABLE: ReadonlySet<InsightsErrorCode> = new Set<InsightsErrorCode>([
  "TIMEOUT",
  "UPSTREAM_BUSY",
  "UPSTREAM_ERROR",
  "EMPTY_ANSWER",
  "INTERNAL_ERROR",
]);

export function applyEvent(turn: AssistantTurn, event: InsightsEvent): AssistantTurn {
  switch (event.type) {
    case "provenance":
      return { ...turn, provenance: event.value, status: "streaming" };

    case "text":
      return {
        ...turn,
        status: "streaming",
        paragraphs: appendRun(turn.paragraphs, event.text, event.general),
      };

    case "citation": {
      // The route already deduplicates, but a citation can reach the client from
      // either path and the merge is by position, so an identical chip twice is
      // cheaper to prevent here than to reason about.
      const key = `${event.citation.slug}#${event.citation.anchor ?? ""}`;
      if (turn.citations.some((c) => `${c.slug}#${c.anchor ?? ""}` === key)) return turn;
      return { ...turn, citations: [...turn.citations, event.citation], status: "streaming" };
    }

    case "question":
      return { ...turn, asked: turn.asked ?? event.text, status: "streaming" };

    case "done":
      return { ...turn, provenance: event.provenance, status: "done" };

    case "error":
      return {
        ...turn,
        status: "failed",
        error: {
          code: event.code,
          message: event.message,
          retryable: RETRYABLE.has(event.code),
        },
      };
  }
}

export function failTurn(
  turn: AssistantTurn,
  code: InsightsErrorCode,
  message: string,
): AssistantTurn {
  // Prose that already reached the reader is left on screen. It is a real answer,
  // and blanking it because the connection died afterwards would be a worse lie
  // than showing it with a note.
  return {
    ...turn,
    status: "failed",
    error: { code, message, retryable: RETRYABLE.has(code) },
  };
}

/** Appends a run of prose, starting new paragraphs where the run crosses a break. */
export function appendRun(paragraphs: Paragraph[], text: string, general: boolean): Paragraph[] {
  if (text.length === 0) return paragraphs;

  const pieces = text.split(/\n+/);
  const next = paragraphs.map((p) => ({ runs: [...p.runs] }));

  pieces.forEach((piece, i) => {
    // A run that begins with a break closes the paragraph being built rather than
    // opening one with nothing in it.
    if (i > 0 || next.length === 0) next.push({ runs: [] });
    const cleaned = piece.replace(/\n/g, " ");
    if (cleaned.trim().length === 0) return;
    const current = next[next.length - 1];
    const last = current.runs[current.runs.length - 1];
    if (last && last.general === general) last.text += cleaned;
    else current.runs.push({ text: cleaned, general });
  });

  return next.filter((p, i) => p.runs.length > 0 || i === next.length - 1);
}

/** A paragraph is general only when every run in it is. */
export function paragraphIsGeneral(paragraph: Paragraph): boolean {
  return paragraph.runs.length > 0 && paragraph.runs.every((r) => r.general);
}

export function turnText(turn: AssistantTurn): string {
  return turn.paragraphs
    .map((p) => p.runs.map((r) => r.text).join(""))
    .join("\n\n")
    .trim();
}

/**
 * The history the endpoint receives.
 *
 * Only complete pairs go in. The model's messages have to alternate, so a
 * question whose answer failed is dropped along with its answer rather than
 * leaving two reader turns in a row, and a reader who retries after a timeout is
 * not billed for sending a broken conversation.
 */
export function historyFor(turns: Turn[]): Array<{ role: "user" | "assistant"; content: string }> {
  const history: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (let i = 0; i < turns.length - 1; i += 1) {
    const reader = turns[i];
    const assistant = turns[i + 1];
    if (reader.role !== "reader" || assistant.role !== "assistant") continue;
    if (assistant.status !== "done") continue;
    const answer = turnText(assistant);
    if (answer.length === 0) continue;
    history.push({ role: "user", content: reader.text });
    history.push({ role: "assistant", content: answer });
  }
  return history;
}

/**
 * One question and the answer to it, which is the unit the reader actually looks
 * at.
 *
 * The transcript is a flat list because that is what the stream produces, but the
 * console pins the current question to the top of the pane and lets the answer
 * fill downward, so the thing that has to be measured and scrolled to is the pair
 * rather than either half. An assistant turn with no question before it should not
 * happen, and is given its own group rather than dropped if it does.
 */
export type Exchange = {
  id: string;
  reader: ReaderTurn | null;
  assistant: AssistantTurn | null;
};

export function groupExchanges(turns: Turn[]): Exchange[] {
  const out: Exchange[] = [];
  for (const turn of turns) {
    if (turn.role === "reader") {
      out.push({ id: turn.id, reader: turn, assistant: null });
      continue;
    }
    const last = out[out.length - 1];
    if (last && last.assistant === null) last.assistant = turn;
    else out.push({ id: turn.id, reader: null, assistant: turn });
  }
  return out;
}

/** Copy for the provenance line, which is the visible half of the product thesis. */
export const PROVENANCE_LABEL: Record<Provenance, string | null> = {
  corpus: "From the articles",
  general: "Beyond the articles",
  mixed: "From the articles, and beyond them",
  // The redirect says where to go in its own prose. A label above it would read as
  // a verdict on a question that was not answered.
  contact: null,
};
