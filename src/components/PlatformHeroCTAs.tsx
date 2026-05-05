"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/primitives";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * CTA cluster for the Platform hero. Inline name + work-email capture
 * posts to /api/early-release with invisible reCAPTCHA; "Why Spaarke"
 * is preserved as the secondary action.
 */
export function PlatformHeroCTAs({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
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
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
      recaptchaRef.current?.reset();
    }
  }

  if (status === "success") {
    return (
      <div className="mt-20 max-w-xl">
        <p
          className="font-display text-[20px] font-medium"
          style={{ color: "#0a0a0a" }}
        >
          Thanks &mdash; you&rsquo;re on the list.
        </p>
        <p
          className="font-body mt-2 text-[15px]"
          style={{ color: "rgba(10,10,10,0.66)" }}
        >
          We&rsquo;ll reach out at <strong>{email.trim()}</strong> shortly.
        </p>
        <div className="mt-6">
          <Button variant="text" href="/why-spaarke" arrow>
            Why Spaarke
          </Button>
        </div>
      </div>
    );
  }

  const inputClass =
    "block min-w-0 rounded-full border px-5 py-3 text-[15px] font-body " +
    "placeholder:text-[rgba(10,10,10,0.5)] " +
    "focus:outline-none focus:ring-2 focus:ring-[#5078DC]/40 focus:border-[#5078DC]/60 " +
    "disabled:opacity-60";
  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderColor: "rgba(10,10,10,0.18)",
    color: "#0a0a0a",
  } as const;

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-20 max-w-2xl">
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
        <Button
          variant="primary"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Get access"}
        </Button>
      </div>

      {status === "error" && error && (
        <p role="alert" className="mt-3 text-sm" style={{ color: "#b00020" }}>
          {error}
        </p>
      )}

      <div className="mt-5">
        <Button variant="text" href="/why-spaarke" arrow>
          Why Spaarke
        </Button>
      </div>

      {recaptchaSiteKey && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={recaptchaSiteKey}
          size="invisible"
        />
      )}
    </form>
  );
}
