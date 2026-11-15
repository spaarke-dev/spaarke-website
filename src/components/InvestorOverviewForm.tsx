"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import InlineAlert from "@/components/InlineAlert";
import { Button } from "@/components/primitives";
import { inputBase, inputBorder, labelClass } from "@/components/meet/shared";
import { readAttribution, submissionProps } from "@/lib/attribution";
import { track } from "@/lib/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ERRORS: Record<string, string> = {
  INVALID_EMAIL: "Please enter a valid work email address.",
  RATE_LIMITED: "Too many requests from this connection. Please wait a minute and try again.",
  CAPTCHA_FAILED:
    "We could not run the reCAPTCHA check. Browser extensions and privacy tools sometimes block it. Try another browser, or email contactus@spaarke.com.",
  UNAVAILABLE: "The download is not available right now. Please try again shortly, or email contactus@spaarke.com.",
};

const noSubscribe = () => () => {};

/**
 * Email, then the investor overview. The server returns a signed link and
 * emails the same link; the browser follows it at once, and the file arrives
 * as a download, so the visitor stays on the page.
 */
export function InvestorOverviewForm({ source, recaptchaSiteKey }: { source: string; recaptchaSiteKey: string }) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ email: string; url: string; emailed: boolean } | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // An expired emailed link lands back here with ?download=expired.
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const returned = new URLSearchParams(search).get("download");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setFieldError(ERRORS.INVALID_EMAIL);
      return;
    }
    setFieldError("");
    setError("");
    setSubmitting(true);

    let captchaToken = "";
    if (recaptchaRef.current) {
      try {
        recaptchaRef.current.reset();
        captchaToken = (await recaptchaRef.current.executeAsync()) ?? "";
      } catch {
        captchaToken = "";
      }
      if (!captchaToken) {
        setSubmitting(false);
        setError(ERRORS.CAPTCHA_FAILED);
        return;
      }
    }

    try {
      const res = await fetch("/api/investor-overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source, hp, captchaToken, attribution: readAttribution() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        url?: string;
        emailed?: boolean;
      };
      if (!res.ok || !data.ok || !data.url) {
        if (data.ok && !data.url) return; // honeypot
        if (data.error === "INVALID_EMAIL") setFieldError(ERRORS.INVALID_EMAIL);
        else setError(ERRORS[data.error ?? ""] ?? ERRORS.UNAVAILABLE);
        return;
      }
      track("Investor Overview Requested", { ...submissionProps(), source });
      setDone({ email: value, url: data.url, emailed: Boolean(data.emailed) });
      window.location.href = data.url;
    } catch {
      setError(ERRORS.UNAVAILABLE);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border-line rounded-xl border p-5" role="status">
        <p className="text-fg text-base font-medium">Your download has started.</p>
        <p className="text-fg-mid mt-2 text-sm leading-relaxed">
          {done.emailed ? `We also emailed a link to ${done.email}. ` : ""}
          If the file did not arrive,{" "}
          <a href={done.url} className="text-cta-blue underline underline-offset-2">
            download it here
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      {(returned === "expired" || returned === "invalid") && (
        <p className="text-fg-mid mb-5 text-sm">
          {returned === "expired" ? "That download link has expired." : "That download link is not valid."} Enter
          your email for a new one.
        </p>
      )}
      {error && (
        <div className="mb-5">
          <InlineAlert variant="error" message={error} />
        </div>
      )}
      <div className="flex flex-col items-start gap-5">
        <div className="w-full">
          <label htmlFor="io-email" className={labelClass}>
            Work email<span className="text-error">*</span>
          </label>
          <input
            id="io-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? "io-email-error" : undefined}
            className={`${inputBase} ${inputBorder(!!fieldError)}`}
          />
          {fieldError && (
            <p id="io-email-error" className="text-error mt-1.5 text-sm" role="alert">
              {fieldError}
            </p>
          )}
        </div>
        <Button variant="primary" type="submit" disabled={submitting} arrow={!submitting}>
          {submitting ? "Preparing…" : "Download the PDF"}
        </Button>
      </div>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="io-website">Website</label>
        <input id="io-website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      <p className="text-fg-low mt-5 text-xs leading-relaxed">
        We email you the link and may follow up about Spaarke. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        . This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
          Terms of Service
        </a>{" "}
        apply.
      </p>
      {recaptchaSiteKey && <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} size="invisible" />}
    </form>
  );
}
