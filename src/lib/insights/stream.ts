import {
  demoteQuotations,
  normalizeDashes,
  tidy,
  verifyCitation,
} from "./citations";
import { MARKER_PATTERNS, type Citation, type Provenance } from "./types";

/**
 * Turning a stream of tokens into a stream of events.
 *
 * The model writes markers inline. The client should never see them and should
 * never have to parse prose, so this assembles the incoming deltas and emits
 * typed events: the provenance label once, each citation as a resolved object,
 * each run of prose with a flag saying whether it rests on general knowledge,
 * and the one question the assistant may ask back.
 *
 * **Why it flushes by sentence rather than by token.** Two of the three
 * mechanical repairs need the whole sentence. A quotation can only be checked
 * once the citation that follows it has arrived, and the citation arrives after
 * the closing quote mark. Flushing token by token would stream a false verbatim
 * claim and then correct it, which is worse than waiting. A sentence at the
 * measured rate of roughly 70 tokens a second is about a third of a second, so
 * the reader still sees prose appearing as it is written.
 *
 * Events are newline-delimited JSON. One object per line, no framing to get
 * wrong, and a client reads it with fetch and a stream reader.
 */

export type InsightsEvent =
  | { type: "provenance"; value: Provenance }
  /** A run of prose, ready to render. `general` marks a passage from outside the corpus. */
  | { type: "text"; text: string; general: boolean }
  | { type: "citation"; citation: Citation }
  /** The one question asked back. Always skippable, never blocking. */
  | { type: "question"; text: string }
  | {
      type: "done";
      provenance: Provenance;
      /** Counted so the reader-invisible repair rate stays measurable. */
      repairs: { citationsCorrected: number; quotationsDemoted: number; dashesNormalized: number };
      usage: { input: number; output: number; cacheRead: number; cacheWrite: number };
    }
  | { type: "error"; code: InsightsErrorCode; message: string };

export type InsightsErrorCode =
  | "DISABLED"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "CAPTCHA_REQUIRED"
  | "CAPTCHA_FAILED"
  | "DAILY_CEILING"
  | "TIMEOUT"
  | "UPSTREAM_BUSY"
  | "UPSTREAM_ERROR"
  | "EMPTY_ANSWER"
  | "INTERNAL_ERROR";

/** Copy for each failure, written for a reader rather than for a log. */
export const ERROR_COPY: Record<InsightsErrorCode, string> = {
  DISABLED: "The article assistant is not switched on yet.",
  VALIDATION_ERROR: "That question could not be read. Try rewording it.",
  RATE_LIMITED: "That is a lot of questions in a short time. Give it a minute and ask again.",
  CAPTCHA_REQUIRED: "Confirm you are not a robot to start the conversation.",
  CAPTCHA_FAILED: "That check did not pass. Reload the page and try again.",
  DAILY_CEILING:
    "The assistant has reached its daily limit and is resting until tomorrow. The article itself is all still here, and you are welcome to get in touch.",
  TIMEOUT: "The answer took too long and was stopped. Asking again usually works.",
  UPSTREAM_BUSY: "The model is busy. Wait a few seconds and ask again.",
  UPSTREAM_ERROR: "The model could not be reached. This is our problem, not yours.",
  EMPTY_ANSWER: "That came back empty. Asking again usually works.",
  INTERNAL_ERROR: "Something failed on our side. Nothing was lost.",
};

export function encodeEvent(event: InsightsEvent): string {
  return `${JSON.stringify(event)}\n`;
}

/** Everything the capture and telemetry layers need once the stream has ended. */
export type AssembledAnswer = {
  provenance: Provenance;
  text: string;
  citedSlugs: string[];
  askedQuestion: string | null;
  repairs: { citationsCorrected: number; quotationsDemoted: number; dashesNormalized: number };
};

/** A sentence end, or the end of a markdown block. */
const UNIT_END = /(?<=[.!?:])\s|\n/;

/** Give up looking for a provenance marker after this much prose and assume general. */
const PROVENANCE_GRACE = 240;

export class AnswerAssembler {
  private buffer = "";
  private provenanceEmitted = false;
  private paragraphIsGeneral = false;
  private atParagraphStart = true;
  private emittedCitations = new Set<string>();
  private prose: string[] = [];

  provenance: Provenance = "general";
  askedQuestion: string | null = null;
  repairs = { citationsCorrected: 0, quotationsDemoted: 0, dashesNormalized: 0 };

  push(delta: string): InsightsEvent[] {
    this.buffer += delta;
    const events: InsightsEvent[] = [];

    events.push(...this.takeProvenance());
    if (!this.provenanceEmitted) return events;

    for (;;) {
      const unit = this.takeUnit(false);
      if (unit === null) break;
      events.push(...this.emitUnit(unit));
    }
    return events;
  }

  /** Flush whatever is left, whether or not it ends a sentence. */
  flush(): InsightsEvent[] {
    const events: InsightsEvent[] = [];
    events.push(...this.takeProvenance(true));
    for (;;) {
      const unit = this.takeUnit(true);
      if (unit === null) break;
      events.push(...this.emitUnit(unit));
    }
    return events;
  }

  assembled(): AssembledAnswer {
    return {
      provenance: this.provenance,
      text: this.prose.join("").trim(),
      citedSlugs: [...new Set([...this.emittedCitations].map((k) => k.split("#")[0]))],
      askedQuestion: this.askedQuestion,
      repairs: this.repairs,
    };
  }

  // -------------------------------------------------------------------------

  private takeProvenance(final = false): InsightsEvent[] {
    if (this.provenanceEmitted) return [];

    const match = MARKER_PATTERNS.provenance.exec(this.buffer);
    if (match) {
      this.provenance = match[1] as Provenance;
      this.buffer = this.buffer.slice(0, match.index) + this.buffer.slice(match.index + match[0].length);
    } else if (!final && this.buffer.length < PROVENANCE_GRACE) {
      // Still arriving.
      return [];
    }
    // A reply with no label is read as general: the conservative reading is that
    // it does not rest on the articles rather than that it does.
    this.provenanceEmitted = true;
    if (this.provenance === "general") this.paragraphIsGeneral = true;
    return [{ type: "provenance", value: this.provenance }];
  }

  /**
   * The next flushable run of text, or null when more is needed. A unit ends at a
   * sentence boundary or a line break, extended over any citation markers that
   * follow it so a citation never separates from the sentence it supports.
   */
  private takeUnit(final: boolean): string | null {
    if (this.buffer.length === 0) return null;

    const match = UNIT_END.exec(this.buffer);
    if (!match) {
      if (!final) return null;
      const rest = this.buffer;
      this.buffer = "";
      return rest;
    }

    let end = match.index + match[0].length;
    for (;;) {
      const trailing = /^\s*\[\[[^\]]*\]\]\s*/.exec(this.buffer.slice(end));
      if (!trailing) break;
      end += trailing[0].length;
    }
    // A marker that has only partly arrived must not be cut in half.
    const opening = this.buffer.indexOf("[[", end - 1);
    if (!final && opening !== -1 && this.buffer.indexOf("]]", opening) === -1) {
      if (opening <= end) return null;
    }

    const unit = this.buffer.slice(0, end);
    this.buffer = this.buffer.slice(end);
    return unit;
  }

  private emitUnit(unit: string): InsightsEvent[] {
    const events: InsightsEvent[] = [];

    // The question asked back is a line of its own, and it is not prose.
    const ask = MARKER_PATTERNS.askLine.exec(unit.trim());
    if (ask) {
      this.askedQuestion ??= ask[1].trim();
      events.push({ type: "question", text: this.askedQuestion });
      return events;
    }

    let text = unit;

    if (this.atParagraphStart && MARKER_PATTERNS.generalLead.test(text)) {
      this.paragraphIsGeneral = true;
      text = text.replace(MARKER_PATTERNS.generalLead, "");
    }

    const demoted = demoteQuotations(text);
    this.repairs.quotationsDemoted += demoted.demoted;
    text = demoted.text;

    for (const m of text.matchAll(MARKER_PATTERNS.citation)) {
      const key = `${m[1]}#${m[2] ?? ""}`;
      if (this.emittedCitations.has(key)) continue;
      const verified = verifyCitation({ slug: m[1], anchor: m[2] || undefined });
      if (verified.corrected) this.repairs.citationsCorrected += 1;
      if (verified.verdict !== "verified" || !verified.citation) continue;
      this.emittedCitations.add(key);
      events.push({ type: "citation", citation: verified.citation });
    }

    text = text.replace(MARKER_PATTERNS.citation, "").replace(MARKER_PATTERNS.any, "");

    const dashes = normalizeDashes(text);
    this.repairs.dashesNormalized += dashes.changed;
    text = dashes.text;

    // Whitespace is tidied per line, and the trailing break is preserved so the
    // client can keep paragraphs apart.
    const trailing = /\s*$/.exec(text)?.[0] ?? "";
    const cleaned = tidy(text) + (trailing.includes("\n") ? trailing.replace(/[ \t]/g, "") : " ");

    this.atParagraphStart = /\n\s*$/.test(unit);
    const wasGeneral = this.paragraphIsGeneral;
    if (this.atParagraphStart && this.provenance !== "general") this.paragraphIsGeneral = false;

    if (cleaned.trim().length > 0) {
      this.prose.push(cleaned);
      events.push({ type: "text", text: cleaned, general: wasGeneral });
    }
    return events;
  }
}
