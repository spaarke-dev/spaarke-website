"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Send24Regular } from "@fluentui/react-icons";
import FormField from "@/components/FormField";
import InlineAlert from "@/components/InlineAlert";
import { submissionProps } from "@/lib/attribution";
import { track } from "@/lib/analytics";

const REASON_OPTIONS = ["", "Demo", "Partnership", "Support", "Other"] as const;

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

    // Client-side validation
    const localErrors = validateLocally({ name, email, message });
    if (localErrors) {
      setFieldErrors(localErrors);
      return;
    }
    setFieldErrors({});

    setStatus("submitting");
    setErrorMessage("");

    // Get captcha token in its own try/catch so we can distinguish a
    // reCAPTCHA failure (widget blocked by an extension, executeAsync
    // throws) from a network failure on our own /api/contact fetch.
    // Both used to surface as "Couldn't reach our server" which was
    // misleading when the actual cause was an ad-blocker.
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

      // Parse JSON defensively — when the SWA edge returns a 5xx
      // with an HTML body (cold-start handoff, transient outage),
      // res.json() throws. Without this guard, the error surfaces as
      // "Unable to reach the server" even though the server replied.
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
          // Server replied but with a non-success status. Distinct
          // from a network failure — usually transient (cold start
          // post-deploy, SWA edge proxy hiccup).
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
      // True network failure — fetch itself threw before any response
      // arrived (no internet, DNS failure, request aborted).
      setStatus("error");
      setErrorMessage(
        "Couldn't reach our server. Check your connection and try again.",
      );
      recaptchaRef.current?.reset();
      // Surface for App Insights via console; the global error
      // listener picks it up.
      console.error("[contact] Network error during submit:", err);
    }
  }

  if (status === "success") {
    return (
      <InlineAlert
        variant="success"
        message="Thank you! We'll be in touch within 1-2 business days."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {status === "error" && errorMessage && (
        <InlineAlert variant="error" message={errorMessage} />
      )}

      <FormField
        name="name"
        label="Name"
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErrors.name}
      />

      <FormField
        name="email"
        label="Email"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
      />

      <FormField
        name="company"
        label="Company"
        placeholder="Your company (optional)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <FormField
        name="reason"
        label="Reason for Contact"
        type="select"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">Select a reason (optional)</option>
        {REASON_OPTIONS.filter(Boolean).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </FormField>

      <FormField
        name="message"
        label="Message"
        type="textarea"
        required
        rows={5}
        placeholder="How can we help?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        error={fieldErrors.message}
      />

      {/* Honeypot field - hidden from real users */}
      <div className="absolute left-[-9999px] opacity-0" aria-hidden="true">
        <label htmlFor="hp">Do not fill this in</label>
        <input type="text" id="hp" name="hp" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
      >
        {status === "submitting" ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <Send24Regular aria-hidden="true" className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>

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
