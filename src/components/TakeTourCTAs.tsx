"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/primitives";
import { TakeTourModal } from "@/components/TakeTourModal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Home-hero "Take tour" form — same visual shape as the platform-hero
 * Get-access form, but submitting opens the product walkthrough modal
 * instead of redirecting. Posts to /api/early-release with
 * source:"take-tour" so the email notification + Azure Tables row are
 * tagged accordingly.
 */
export function TakeTourCTAs({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const nameTrim = name.trim();
    const emailTrim = email.trim();
    if (!nameTrim || nameTrim.length > 100) {
      setStatus("error");
      setError("Please enter your name.");
      return;
    }
    if (
      !emailTrim ||
      emailTrim.length < 3 ||
      emailTrim.length > 254 ||
      !EMAIL_RE.test(emailTrim)
    ) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");

    try {
      let captchaToken = "";
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        const token = await recaptchaRef.current.executeAsync();
        captchaToken = token ?? "";
      }

      const res = await fetch("/api/early-release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameTrim,
          email: emailTrim,
          captchaToken,
          source: "take-tour",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (res.status === 429) {
        setStatus("error");
        setError("Too many submissions. Please try again later.");
        return;
      }
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(
          data.error === "CAPTCHA_FAILED"
            ? "CAPTCHA verification failed. Please try again."
            : data.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setStatus("success");
      setTourOpen(true);
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
      recaptchaRef.current?.reset();
    }
  }

  // Inputs styled to match the platform hero — pill inputs on the dark
  // home hero need a slightly different palette: light translucent fill
  // with a hairline border that reads on #0a0a0a.
  const inputClass =
    "block min-w-0 rounded-full border px-5 py-3 text-[15px] font-body " +
    "placeholder:text-[rgba(245,245,245,0.5)] " +
    "focus:outline-none focus:ring-2 focus:ring-[#5078DC]/40 focus:border-[#5078DC]/60 " +
    "disabled:opacity-60";
  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.18)",
    color: "#f5f5f5",
  } as const;

  const submittedLabel =
    status === "submitting" ? "Submitting…" : "Take tour";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto mt-10 max-w-2xl"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            required
            aria-label="Name"
            placeholder="Name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "submitting"}
            className={`${inputClass} flex-1`}
            style={inputStyle}
          />
          <input
            type="email"
            required
            aria-label="Work email"
            placeholder="Work email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            className={`${inputClass} flex-[1.5]`}
            style={inputStyle}
          />
          {status === "success" ? (
            <Button
              variant="primary"
              type="button"
              onClick={() => setTourOpen(true)}
            >
              Open tour
            </Button>
          ) : (
            <Button
              variant="primary"
              type="submit"
              disabled={status === "submitting"}
            >
              {submittedLabel}
            </Button>
          )}
        </div>

        {status === "error" && error && (
          <p
            role="alert"
            className="mt-3 text-center text-sm"
            style={{ color: "#FCA5A5" }}
          >
            {error}
          </p>
        )}

        {status === "success" && (
          <p
            className="mt-3 text-center text-sm"
            style={{ color: "rgba(245,245,245,0.66)" }}
          >
            Thanks — your tour is open. We&rsquo;ll follow up at{" "}
            <strong style={{ color: "#f5f5f5" }}>{email.trim()}</strong>.
          </p>
        )}

        {recaptchaSiteKey && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={recaptchaSiteKey}
            size="invisible"
          />
        )}
      </form>

      <TakeTourModal open={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  );
}
