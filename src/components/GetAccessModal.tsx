"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Quick "Get access" modal — name + work email, posts to the existing
 * /api/early-release endpoint. Lighter-weight than the full
 * DemoRequestForm on /access-request; meant for one-click capture
 * from any CTA on the marketing pages.
 *
 * reCAPTCHA: the API tolerates a missing token when RECAPTCHA_SECRET_KEY
 * isn't set on the server (dev / preview). On prod we'll wire reCAPTCHA
 * into this component too — for now we send an empty token, which the
 * API treats as a hard fail when the secret IS set. Acceptable trade-off
 * for a v1; revisit before public launch.
 */
export function GetAccessModal({ open, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    // Focus the name field on open so the user can type immediately.
    nameInputRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  // Reset state when the modal closes so reopening starts clean.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setName("");
        setEmail("");
        setStatus("idle");
        setError(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const nameTrim = name.trim();
    const emailTrim = email.trim();
    if (!nameTrim) {
      setError("Please enter your name.");
      return;
    }
    if (!emailTrim || !EMAIL_RE.test(emailTrim)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/early-release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameTrim,
          email: emailTrim,
          captchaToken: "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Request early access to Spaarke"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 motion-safe:animate-in motion-safe:fade-in"
      />

      <div className="relative z-10 mx-4 w-full max-w-md">
        <div
          className="overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            backgroundColor: "#111111",
            borderColor: "rgba(255, 255, 255, 0.10)",
          }}
        >
          <div className="px-7 py-8 sm:px-9 sm:py-10">
            <h2
              className="font-display text-2xl font-medium leading-tight tracking-tight text-white sm:text-[28px]"
            >
              Request early access
            </h2>
            <p
              className="mt-3 text-[15px] leading-relaxed"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Enter your work email and we&rsquo;ll be in touch.
            </p>

            {status === "success" ? (
              <div className="mt-7">
                <div
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: "rgba(80, 120, 220, 0.12)",
                    borderColor: "rgba(80, 120, 220, 0.28)",
                  }}
                >
                  <p className="text-sm font-medium text-white">
                    Thanks — you&rsquo;re on the list.
                  </p>
                  <p
                    className="mt-1 text-[13px]"
                    style={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    We&rsquo;ll reach out at <strong>{email}</strong> shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 w-full rounded-full px-5 py-3 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: "#5078DC" }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label
                    htmlFor="ga-name"
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "rgba(255, 255, 255, 0.55)" }}
                  >
                    Name
                  </label>
                  <input
                    id="ga-name"
                    ref={nameInputRef}
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={status === "submitting"}
                    className="mt-1.5 block w-full rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "#0a0a0a",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="ga-email"
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "rgba(255, 255, 255, 0.55)" }}
                  >
                    Work email
                  </label>
                  <input
                    id="ga-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "submitting"}
                    className="mt-1.5 block w-full rounded-md border px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "#0a0a0a",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    }}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-sm"
                    style={{ color: "#ff7a7a" }}
                  >
                    {error}
                  </p>
                )}

                <button
                  ref={closeBtnRef}
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white transition-colors disabled:opacity-60"
                  style={{ backgroundColor: "#5078DC" }}
                >
                  {status === "submitting" ? "Submitting…" : "Request access"}
                </button>

                <p
                  className="text-center text-[12px]"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  Or fill in our{" "}
                  <a
                    href="/access-request"
                    className="underline underline-offset-2"
                    style={{ color: "rgba(255, 255, 255, 0.75)" }}
                  >
                    full request form
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border text-white transition-colors"
          style={{
            backgroundColor: "#111111",
            borderColor: "rgba(255, 255, 255, 0.18)",
          }}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
