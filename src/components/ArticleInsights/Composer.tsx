"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

/** Mirrors the endpoint's limit, so an over-long question is refused here rather than there. */
export const MAX_QUESTION_CHARS = 1_000;

/**
 * The question box.
 *
 * Enter sends and Shift then Enter breaks the line, which is what a reader who
 * has used any of these expects. It grows to a few lines and then scrolls, so a
 * pasted paragraph does not push the transcript off the panel.
 */
export const Composer = forwardRef<
  HTMLTextAreaElement,
  {
    onSubmit: (question: string) => void;
    busy: boolean;
    placeholder?: string;
    /** Rendered under the field. The disclaimer lives here on the panel. */
    footer?: React.ReactNode;
  }
>(function Composer({ onSubmit, busy, placeholder, footer }, ref) {
  const [value, setValue] = useState("");
  const inner = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [value]);

  const tooLong = value.length > MAX_QUESTION_CHARS;
  const canSend = value.trim().length > 0 && !tooLong && !busy;

  function send() {
    if (!canSend) return;
    onSubmit(value.trim());
    setValue("");
  }

  return (
    <div>
      <div className="border-line focus-within:border-line-strong bg-bg rounded-md border transition-colors">
        <label htmlFor="insights-question" className="sr-only">
          Ask about this article
        </label>
        <textarea
          id="insights-question"
          ref={(node) => {
            inner.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={placeholder ?? "Ask about this article"}
          aria-describedby={tooLong ? "insights-question-error" : undefined}
          aria-invalid={tooLong || undefined}
          className="text-fg placeholder:text-fg-low block w-full resize-none bg-transparent px-3 py-2.5 text-[14px] leading-snug focus:outline-none"
        />
        <div className="flex items-center justify-between gap-2 px-3 pb-2">
          <span className="text-fg-low text-[11px]">
            {tooLong ? (
              <span id="insights-question-error" className="text-fg-mid">
                That is longer than the box takes. Trim it to {MAX_QUESTION_CHARS} characters.
              </span>
            ) : (
              "Enter to send"
            )}
          </span>
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            className="bg-spaarke-blue focus-visible:ring-spaarke-blue rounded px-3 py-1 text-[13px] font-medium text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-35"
          >
            {busy ? "Thinking" : "Ask"}
          </button>
        </div>
      </div>
      {footer}
    </div>
  );
});
