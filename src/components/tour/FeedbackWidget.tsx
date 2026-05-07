"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Props = {
  tourSlug: string;
  sectionId: string;
  stepId: string;
};

type Status = "idle" | "submitting" | "success" | "error";

// Match Callout's nav row visual language exactly so the widget feels
// like a sibling control, not a foreign add-on.
const NAV_BORDER = "rgba(15,23,42,0.16)";
const TEXT_MUTED = "rgba(15,23,42,0.6)";
const TEXT_HOVER = "#5078DC";
const ICON_SIZE = 16;

function ThumbsUpIcon() {
  return (
    <svg
      aria-hidden="true"
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 10v11M7 10l4-7a2 2 0 0 1 2 2v5h5.5a2 2 0 0 1 2 2.3l-1.2 7a2 2 0 0 1-2 1.7H7"
      />
    </svg>
  );
}

function ThumbsDownIcon() {
  return (
    <svg
      aria-hidden="true"
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 14V3M17 14l-4 7a2 2 0 0 1-2-2v-5H5.5a2 2 0 0 1-2-2.3l1.2-7A2 2 0 0 1 6.7 3H17"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      aria-hidden="true"
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z"
      />
    </svg>
  );
}

const ROW_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginTop: "0.625rem",
  paddingTop: "0.625rem",
  borderTop: `1px solid ${NAV_BORDER}`,
  fontSize: "0.8125rem",
  color: TEXT_MUTED,
};

const BUTTON_CLASS =
  "rounded-md transition-colors hover:enabled:bg-[rgba(80,120,220,0.1)] hover:enabled:text-[#5078DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC]/40 disabled:opacity-50";

const BUTTON_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.25rem 0.4rem",
  color: "inherit",
  cursor: "pointer",
  background: "transparent",
  border: 0,
};

export function FeedbackWidget({ tourSlug, sectionId, stepId }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [comment, setComment] = useState("");

  // Reset everything when the user navigates to a new step — each
  // step is its own feedback opportunity.
  useEffect(() => {
    setStatus("idle");
    setErrorMsg(null);
    setComposerOpen(false);
    setComment("");
  }, [stepId]);

  // Auto-revert from "success" back to idle after 2s so the row goes
  // back to soliciting more feedback (e.g. they thumbs-up'd, then want
  // to add a comment).
  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => {
      setStatus("idle");
      setComposerOpen(false);
      setComment("");
    }, 2000);
    return () => clearTimeout(t);
  }, [status]);

  async function submit(payload: {
    sentiment: "up" | "down" | null;
    comment?: string;
  }) {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/tour-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug,
          sectionId,
          stepId,
          sentiment: payload.sentiment,
          comment: payload.comment,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data && (data.message || data.error)) || `HTTP ${res.status}`,
        );
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <div
        style={{ ...ROW_STYLE, justifyContent: "flex-start" }}
        aria-live="polite"
      >
        <span>Thanks for the feedback.</span>
      </div>
    );
  }

  return (
    <div style={ROW_STYLE}>
      <span style={{ marginRight: "0.25rem" }}>Was this helpful?</span>
      <button
        type="button"
        aria-label="Helpful"
        title="Helpful"
        className={BUTTON_CLASS}
        style={BUTTON_STYLE}
        disabled={submitting}
        onClick={() => submit({ sentiment: "up" })}
      >
        <ThumbsUpIcon />
      </button>
      <button
        type="button"
        aria-label="Not helpful"
        title="Not helpful"
        className={BUTTON_CLASS}
        style={BUTTON_STYLE}
        disabled={submitting}
        onClick={() => submit({ sentiment: "down" })}
      >
        <ThumbsDownIcon />
      </button>
      <button
        type="button"
        aria-label="Leave a comment"
        aria-expanded={composerOpen}
        title="Leave a comment"
        className={BUTTON_CLASS}
        style={{
          ...BUTTON_STYLE,
          color: composerOpen ? TEXT_HOVER : "inherit",
        }}
        disabled={submitting}
        onClick={() => setComposerOpen((v) => !v)}
      >
        <CommentIcon />
      </button>

      {composerOpen ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = comment.trim();
            if (!trimmed) return;
            void submit({ sentiment: null, comment: trimmed });
          }}
          style={{
            display: "flex",
            flex: "1 1 auto",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "0.5rem",
          }}
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
            rows={1}
            maxLength={2000}
            placeholder="Tell us what you think…"
            aria-label="Comment"
            style={{
              flex: "1 1 auto",
              minHeight: "1.75rem",
              padding: "0.25rem 0.5rem",
              fontSize: "0.8125rem",
              lineHeight: 1.4,
              border: `1px solid ${NAV_BORDER}`,
              borderRadius: "0.375rem",
              resize: "vertical",
              fontFamily: "inherit",
              color: "rgba(15,23,42,0.86)",
              background: "#ffffff",
            }}
          />
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="rounded-md bg-[#5078DC] px-2.5 py-1 text-[12px] font-medium text-white transition-colors hover:bg-[#4060B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send"}
          </button>
        </form>
      ) : null}

      {status === "error" && errorMsg ? (
        <span
          role="alert"
          style={{ color: "#b42318", marginLeft: "0.5rem" }}
        >
          {errorMsg}
        </span>
      ) : null}
    </div>
  );
}
