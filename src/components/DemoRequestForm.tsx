"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import InlineAlert from "@/components/InlineAlert";
import { HoorayConfetti } from "@/components/HoorayConfetti";
import { Button } from "@/components/primitives";
import { submissionProps } from "@/lib/attribution";
import { track } from "@/lib/analytics";

// Shared underline-input style — same conventions as ContactForm so
// both forms feel like one design language. Mono uppercase label,
// transparent input with a hairline bottom border that focuses to
// cta-blue (or error red on validation failure).
const labelClass =
  "font-mono block text-[11px] font-medium uppercase tracking-[0.18em] text-fg-low";
const inputBase =
  "block w-full border-0 border-b bg-transparent px-0 py-2.5 text-[15px] text-fg placeholder:text-fg-low/70 transition-colors focus:outline-none";
const inputBorder = (hasError: boolean) =>
  hasError
    ? "border-error focus:border-error"
    : "border-line-strong focus:border-cta-blue";

// Chevron used inside underline-style <select> wrappers. Pure SVG so it
// inherits currentColor for theming.
function SelectChevron() {
  return (
    <svg
      aria-hidden="true"
      className="text-fg-low pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const USE_CASE_OPTIONS = [
  "Document Management",
  "AI Analysis",
  "Financial Intelligence",
  "General Evaluation",
] as const;

const REFERRAL_OPTIONS = [
  "Conference",
  "Website",
  "Referral",
  "Search",
  "Other",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  workEmail?: string;
  organization?: string;
  useCase?: string;
  consent?: string;
}

function validateLocally(fields: {
  firstName: string;
  lastName: string;
  workEmail: string;
  organization: string;
  useCase: string;
  consent: boolean;
}): FieldErrors | null {
  const errors: FieldErrors = {};

  if (!fields.firstName.trim() || fields.firstName.trim().length > 100) {
    errors.firstName = "First name is required (1-100 characters).";
  }

  if (!fields.lastName.trim() || fields.lastName.trim().length > 100) {
    errors.lastName = "Last name is required (1-100 characters).";
  }

  const emailTrimmed = fields.workEmail.trim();
  if (
    !emailTrimmed ||
    emailTrimmed.length < 3 ||
    emailTrimmed.length > 254 ||
    !EMAIL_RE.test(emailTrimmed)
  ) {
    errors.workEmail = "A valid work email address is required.";
  }

  if (!fields.organization.trim() || fields.organization.trim().length > 200) {
    errors.organization = "Organization is required (1-200 characters).";
  }

  if (!fields.useCase) {
    errors.useCase = "Please select a use case.";
  }

  if (!fields.consent) {
    errors.consent =
      "You must agree to the terms of use and data processing agreement.";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function DemoRequestForm({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [useCase, setUseCase] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Client-side validation
    const localErrors = validateLocally({
      firstName,
      lastName,
      workEmail,
      organization,
      useCase,
      consent,
    });
    if (localErrors) {
      setFieldErrors(localErrors);
      return;
    }
    setFieldErrors({});

    setStatus("submitting");
    setErrorMessage("");

    // Get captcha token in its own try/catch so we can distinguish a
    // reCAPTCHA failure (widget blocked by an extension, executeAsync
    // throws) from a network failure on our own fetch.
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
      console.error("[demo-request] reCAPTCHA error:", err);
      return;
    }

    if (!captchaToken) {
      setStatus("error");
      setErrorMessage(
        "Couldn't get a reCAPTCHA token. Browser extensions or privacy tools sometimes block this. Try disabling ad-blockers and resubmitting, or email contactus@spaarke.com.",
      );
      return;
    }

    try {
      const attribution = submissionProps();

      const res = await fetch("/api/registration/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          workEmail: workEmail.trim(),
          organization: organization.trim(),
          jobTitle: jobTitle.trim() || undefined,
          phone: phone.trim() || undefined,
          useCase,
          referralSource: referralSource || undefined,
          notes: notes.trim() || undefined,
          consent,
          captchaToken,
          attribution,
        }),
      });

      // Parse JSON defensively — see ContactForm for rationale.
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: FieldErrors;
        trackingId?: string;
      };

      if (res.status === 429) {
        setStatus("error");
        setErrorMessage("Too many submissions. Please try again later.");
        return;
      }

      // 409 from this endpoint comes from the BFF backend, which
      // detects an existing registration for the same email. Show a
      // friendlier message than generic "something went wrong" since
      // the user has already done the work.
      if (res.status === 409) {
        setStatus("error");
        setErrorMessage(
          "It looks like that email is already on our list. We'll be in touch — no need to submit again. If that doesn't sound right, email us and we'll sort it out.",
        );
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

      track("Demo Request Submit", attribution);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "Couldn't reach our server. Check your connection and try again.",
      );
      recaptchaRef.current?.reset();
      console.error("[demo-request] Network error during submit:", err);
    }
  }

  if (status === "success") {
    return (
      <div className="relative flex min-h-[200px] items-center justify-center text-center">
        <HoorayConfetti />
        <div className="relative z-10">
          <p
            className="font-display text-fg font-medium tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.05 }}
          >
            Thank you!
          </p>
          <p className="text-fg-mid mt-3 text-base md:text-[17px]">
            We&rsquo;ll be in touch ASAP!
          </p>
        </div>
      </div>
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
        {/* First / Last name */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="dr-firstName" className={labelClass}>
              First name
            </label>
            <input
              id="dr-firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={!!fieldErrors.firstName}
              className={`${inputBase} ${inputBorder(!!fieldErrors.firstName)}`}
            />
            {fieldErrors.firstName && (
              <p className="text-error mt-1.5 text-sm" role="alert">
                {fieldErrors.firstName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="dr-lastName" className={labelClass}>
              Last name
            </label>
            <input
              id="dr-lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-invalid={!!fieldErrors.lastName}
              className={`${inputBase} ${inputBorder(!!fieldErrors.lastName)}`}
            />
            {fieldErrors.lastName && (
              <p className="text-error mt-1.5 text-sm" role="alert">
                {fieldErrors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Work email */}
        <div>
          <label htmlFor="dr-workEmail" className={labelClass}>
            Work email
          </label>
          <input
            id="dr-workEmail"
            name="workEmail"
            type="email"
            required
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            aria-invalid={!!fieldErrors.workEmail}
            className={`${inputBase} ${inputBorder(!!fieldErrors.workEmail)}`}
          />
          {fieldErrors.workEmail && (
            <p className="text-error mt-1.5 text-sm" role="alert">
              {fieldErrors.workEmail}
            </p>
          )}
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="dr-organization" className={labelClass}>
            Organization
          </label>
          <input
            id="dr-organization"
            name="organization"
            type="text"
            required
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            aria-invalid={!!fieldErrors.organization}
            className={`${inputBase} ${inputBorder(!!fieldErrors.organization)}`}
          />
          {fieldErrors.organization && (
            <p className="text-error mt-1.5 text-sm" role="alert">
              {fieldErrors.organization}
            </p>
          )}
        </div>

        {/* Job title / Phone */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="dr-jobTitle" className={labelClass}>
              Job title
            </label>
            <input
              id="dr-jobTitle"
              name="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className={`${inputBase} ${inputBorder(false)}`}
            />
          </div>
          <div>
            <label htmlFor="dr-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="dr-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${inputBase} ${inputBorder(false)}`}
            />
          </div>
        </div>

        {/* Use case */}
        <div>
          <label htmlFor="dr-useCase" className={labelClass}>
            Use case
          </label>
          <div className="relative">
            <select
              id="dr-useCase"
              name="useCase"
              required
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              aria-invalid={!!fieldErrors.useCase}
              className={`${inputBase} ${inputBorder(!!fieldErrors.useCase)} appearance-none pr-8`}
            >
              <option value="">Select a use case</option>
              {USE_CASE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
          {fieldErrors.useCase && (
            <p className="text-error mt-1.5 text-sm" role="alert">
              {fieldErrors.useCase}
            </p>
          )}
        </div>

        {/* Referral source */}
        <div>
          <label htmlFor="dr-referralSource" className={labelClass}>
            How did you hear about us
          </label>
          <div className="relative">
            <select
              id="dr-referralSource"
              name="referralSource"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              className={`${inputBase} ${inputBorder(false)} appearance-none pr-8`}
            >
              <option value="">Select an option (optional)</option>
              {REFERRAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="dr-notes" className={labelClass}>
            Notes
          </label>
          <textarea
            id="dr-notes"
            name="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputBase} ${inputBorder(false)} resize-y`}
          />
        </div>
      </div>

      <div className="mt-10">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="border-line-strong text-cta-blue accent-cta-blue focus:ring-cta-blue/50 mt-1 h-4 w-4 shrink-0 rounded border bg-transparent focus:ring-2"
            aria-invalid={!!fieldErrors.consent}
            aria-describedby={
              fieldErrors.consent ? "consent-error" : undefined
            }
          />
          <span className="text-fg-mid text-sm">
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#82A5EB] underline underline-offset-2 hover:text-[#A5BFF0]"
            >
              terms of service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#82A5EB] underline underline-offset-2 hover:text-[#A5BFF0]"
            >
              privacy policy
            </a>
            .<span className="text-error">*</span>
          </span>
        </label>
        {fieldErrors.consent && (
          <p
            id="consent-error"
            className="text-error mt-1.5 text-sm"
            role="alert"
          >
            {fieldErrors.consent}
          </p>
        )}
      </div>

      {/* Submit button — right-aligned with extra top margin for
          breathing room above the action. */}
      <div className="flex justify-end pt-8">
        <Button
          variant="primary"
          type="submit"
          disabled={status === "submitting"}
          arrow={status !== "submitting"}
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
              Sending…
            </>
          ) : (
            "Send request"
          )}
        </Button>
      </div>

      {/* reCAPTCHA legal disclosure — required when the floating badge
          is hidden globally (see globals.css). Pushed well below the
          submit row so it reads as a secondary fine-print element
          rather than competing with the action. */}
      <p className="text-fg-low/70 mt-12 text-[10px] leading-relaxed">
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
