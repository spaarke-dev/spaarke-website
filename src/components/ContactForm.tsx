"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/primitives";
import InlineAlert from "@/components/InlineAlert";
import { submissionProps } from "@/lib/attribution";
import { track } from "@/lib/analytics";

const REASON_OPTIONS = [
  "",
  "See a working session",
  "Partnership",
  "Press / media",
  "Something else",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateLocally(fields: {
  name: string;
  email: string;
  message: string;
}): FieldErrors | null {
  const errors: FieldErrors = {};

  if (!fields.name.trim() || fields.name.trim().length > 100) {
    errors.name = "Name is required (1-100 characters).";
  }

  const emailTrimmed = fields.email.trim();
  if (
    !emailTrimmed ||
    emailTrimmed.length < 3 ||
    emailTrimmed.length > 254 ||
    !EMAIL_RE.test(emailTrimmed)
  ) {
    errors.email = "A valid email address is required.";
  }

  if (!fields.message.trim() || fields.message.trim().length > 5000) {
    errors.message = "Message is required (1-5000 characters).";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

const labelClass =
  "font-mono block text-[11px] font-medium uppercase tracking-[0.18em] text-fg-low";
const inputBase =
  "block w-full border-0 border-b bg-transparent px-0 py-2.5 text-[15px] text-fg placeholder:text-fg-low/70 transition-colors focus:outline-none";
const inputBorder = (hasError: boolean) =>
  hasError
    ? "border-error focus:border-error"
    : "border-line-strong focus:border-cta-blue";

export default function ContactForm({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Capture form-data references synchronously — e.currentTarget
    // becomes null after the first await due to React event pooling,
    // which would make `new FormData(e.currentTarget)` throw a
    // TypeError on the line that reads the honeypot.
    const formData = new FormData(e.currentTarget);
    const hp = (formData.get("hp") as string) ?? "";

    const localErrors = validateLocally({ name, email, message });
    if (localErrors) {
      setFieldErrors(localErrors);
      return;
    }
    setFieldErrors({});

    setStatus("submitting");
    setErrorMessage("");

    let captchaToken = "";
    try {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        const token = await recaptchaRef.current.executeAsync();
        captchaToken = token ?? "";
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "We couldn't verify your reCAPTCHA. Browser extensions, privacy tools, or corporate networks sometimes block this. Try disabling ad-blockers or use a different browser — or email us at contactus@spaarke.com.",
      );
      console.error("[contact] reCAPTCHA error:", err);
      return;
    }

    try {
      const attribution = submissionProps();

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          reason: reason || undefined,
          message: message.trim(),
          hp,
          captchaToken,
          attribution,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: FieldErrors;
      };

      if (res.status === 429) {
        setStatus("error");
        setErrorMessage("Too many submissions. Please try again later.");
        return;
      }

      if (!res.ok || !data.ok) {
        if (data.error === "VALIDATION_ERROR" && data.fields) {
          setFieldErrors(data.fields as FieldErrors);
          setStatus("idle");
        } else if (data.error === "CAPTCHA_FAILED") {
          setStatus("error");
          setErrorMessage("CAPTCHA verification failed. Please try again.");
        } else if (res.status >= 500) {
          setStatus("error");
          setErrorMessage(
            "Our servers had a brief hiccup. Please try again in a moment, or email us directly.",
          );
        } else {
          setStatus("error");
          setErrorMessage(
            "Something went wrong. Please try again or email us directly.",
          );
        }
        return;
      }

      track("Contact Submit", attribution);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "Couldn't reach our server. Check your connection and try again.",
      );
      recaptchaRef.current?.reset();
      console.error("[contact] Network error during submit:", err);
    }
  }

  if (status === "success") {
    return (
      <InlineAlert
        variant="success"
        message="Thank you! We'll be in touch ASAP!"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status === "error" && errorMessage && (
        <div className="mb-6">
          <InlineAlert variant="error" message={errorMessage} />
        </div>
      )}

      <div className="space-y-7">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!fieldErrors.name}
            className={`${inputBase} ${inputBorder(!!fieldErrors.name)}`}
          />
          {fieldErrors.name && (
            <p className="text-error mt-1.5 text-sm" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="jane@firm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!fieldErrors.email}
            className={`${inputBase} ${inputBorder(!!fieldErrors.email)}`}
          />
          {fieldErrors.email && (
            <p className="text-error mt-1.5 text-sm" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            placeholder="Optional"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={`${inputBase} ${inputBorder(false)}`}
          />
        </div>

        {/* Reason */}
        <div>
          <label htmlFor="contact-reason" className={labelClass}>
            Reason for contact
          </label>
          <div className="relative">
            <select
              id="contact-reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`${inputBase} ${inputBorder(false)} appearance-none pr-8`}
            >
              <option value="">Select a reason (optional)</option>
              {REASON_OPTIONS.filter(Boolean).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="text-fg-low pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            placeholder="A few lines is plenty."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={!!fieldErrors.message}
            className={`${inputBase} ${inputBorder(!!fieldErrors.message)} resize-y`}
          />
          {fieldErrors.message && (
            <p className="text-error mt-1.5 text-sm" role="alert">
              {fieldErrors.message}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot field - hidden from real users */}
      <div className="absolute left-[-9999px] opacity-0" aria-hidden="true">
        <label htmlFor="hp">Do not fill this in</label>
        <input type="text" id="hp" name="hp" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Bottom row — privacy reassurance + submit pill */}
      <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <p className="font-mono text-fg-low text-[10px] uppercase tracking-[0.18em]">
          We never share what you send.
        </p>
        <Button
          variant="primary"
          type="submit"
          disabled={status === "submitting"}
          arrow
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
      </div>

      {/* reCAPTCHA legal disclosure — required when the badge is hidden */}
      <p className="text-fg-low mt-6 text-[11px] leading-relaxed">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg-mid underline"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg-mid underline"
        >
          Terms of Service
        </a>{" "}
        apply.
      </p>

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
