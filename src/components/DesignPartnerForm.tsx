"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import InlineAlert from "@/components/InlineAlert";
import { Button } from "@/components/primitives";
import { submissionProps } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import {
  ORGANIZATION_TYPES,
  STARTING_DECISION_MAX,
  normalizeApplication,
  validateApplication,
  type DesignPartnerFieldErrors,
} from "@/lib/design-partners";

// Same underline-input conventions as DemoRequestForm and ContactForm.
const labelClass =
  "font-mono block text-[11px] font-medium uppercase tracking-[0.18em] text-fg-low";
const inputBase =
  "block w-full border-0 border-b bg-transparent px-0 py-2.5 text-[15px] text-fg placeholder:text-fg-low/70 transition-colors focus:outline-none";
const inputBorder = (hasError: boolean) =>
  hasError
    ? "border-error focus:border-error"
    : "border-line-strong focus:border-cta-blue";

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

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-error mt-1.5 text-sm" role="alert">
      {message}
    </p>
  );
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function DesignPartnerForm({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [startingDecision, setStartingDecision] = useState("");
  const [consent, setConsent] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<DesignPartnerFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const application = normalizeApplication({
      firstName,
      lastName,
      email,
      organization,
      role,
      organizationType,
      startingDecision,
      consent,
    });
    const localErrors = validateApplication(application);
    if (localErrors) {
      setFieldErrors(localErrors);
      return;
    }
    setFieldErrors({});

    setStatus("submitting");
    setErrorMessage("");

    // The captcha has its own try/catch so a blocked widget reads differently
    // from a failed request to our own route.
    let captchaToken = "";
    try {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        captchaToken = (await recaptchaRef.current.executeAsync()) ?? "";
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "We couldn't verify the reCAPTCHA. Browser extensions, privacy tools, or corporate networks sometimes block it. Try another browser, or email us at contactus@spaarke.com.",
      );
      console.error("[design-partners] reCAPTCHA error:", err);
      return;
    }

    if (recaptchaSiteKey && !captchaToken) {
      setStatus("error");
      setErrorMessage(
        "We couldn't get a reCAPTCHA token. Try disabling ad blockers and submitting again, or email us at contactus@spaarke.com.",
      );
      return;
    }

    try {
      const attribution = submissionProps();

      const res = await fetch("/api/design-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...application, captchaToken, attribution }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: DesignPartnerFieldErrors;
      };

      if (res.status === 429) {
        setStatus("error");
        setErrorMessage("Too many submissions. Please try again later.");
        return;
      }

      if (!res.ok || !data.ok) {
        if (data.error === "VALIDATION_ERROR" && data.fields) {
          setFieldErrors(data.fields);
          setStatus("idle");
        } else if (data.error === "CAPTCHA_FAILED") {
          setStatus("error");
          setErrorMessage("reCAPTCHA verification failed. Please try again.");
        } else {
          setStatus("error");
          setErrorMessage(
            "Your application did not reach us. Please try again in a moment, or email us at contactus@spaarke.com.",
          );
        }
        return;
      }

      track("Design Partner Submit", {
        ...attribution,
        organizationType: application.organizationType,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "We couldn't reach our server. Check your connection and try again.",
      );
      recaptchaRef.current?.reset();
      console.error("[design-partners] Network error during submit:", err);
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[200px] items-center" role="status">
        <div>
          <p
            className="font-display text-fg font-medium tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.05 }}
          >
            Thank you.
          </p>
          <p className="text-fg-mid mt-3 text-base md:text-[17px]">
            The Spaarke team will reply by email.
          </p>
        </div>
      </div>
    );
  }

  const describedBy = (field: keyof DesignPartnerFieldErrors) =>
    fieldErrors[field] ? `dp-${field}-error` : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status === "error" && errorMessage && (
        <div className="mb-6">
          <InlineAlert variant="error" message={errorMessage} />
        </div>
      )}

      <div className="space-y-7">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="dp-firstName" className={labelClass}>
              First name
            </label>
            <input
              id="dp-firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={!!fieldErrors.firstName}
              aria-describedby={describedBy("firstName")}
              className={`${inputBase} ${inputBorder(!!fieldErrors.firstName)}`}
            />
            <FieldError id="dp-firstName-error" message={fieldErrors.firstName} />
          </div>
          <div>
            <label htmlFor="dp-lastName" className={labelClass}>
              Last name
            </label>
            <input
              id="dp-lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-invalid={!!fieldErrors.lastName}
              aria-describedby={describedBy("lastName")}
              className={`${inputBase} ${inputBorder(!!fieldErrors.lastName)}`}
            />
            <FieldError id="dp-lastName-error" message={fieldErrors.lastName} />
          </div>
        </div>

        <div>
          <label htmlFor="dp-email" className={labelClass}>
            Work email
          </label>
          <input
            id="dp-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={describedBy("email")}
            className={`${inputBase} ${inputBorder(!!fieldErrors.email)}`}
          />
          <FieldError id="dp-email-error" message={fieldErrors.email} />
        </div>

        <div>
          <label htmlFor="dp-organization" className={labelClass}>
            Organization
          </label>
          <input
            id="dp-organization"
            name="organization"
            type="text"
            autoComplete="organization"
            required
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            aria-invalid={!!fieldErrors.organization}
            aria-describedby={describedBy("organization")}
            className={`${inputBase} ${inputBorder(!!fieldErrors.organization)}`}
          />
          <FieldError id="dp-organization-error" message={fieldErrors.organization} />
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="dp-role" className={labelClass}>
              Role or title
            </label>
            <input
              id="dp-role"
              name="role"
              type="text"
              autoComplete="organization-title"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-invalid={!!fieldErrors.role}
              aria-describedby={describedBy("role")}
              className={`${inputBase} ${inputBorder(!!fieldErrors.role)}`}
            />
            <FieldError id="dp-role-error" message={fieldErrors.role} />
          </div>
          <div>
            <label htmlFor="dp-organizationType" className={labelClass}>
              Organization type
            </label>
            <div className="relative">
              <select
                id="dp-organizationType"
                name="organizationType"
                required
                value={organizationType}
                onChange={(e) => setOrganizationType(e.target.value)}
                aria-invalid={!!fieldErrors.organizationType}
                aria-describedby={describedBy("organizationType")}
                className={`${inputBase} ${inputBorder(!!fieldErrors.organizationType)} appearance-none pr-8`}
              >
                <option value="">Select one</option>
                {ORGANIZATION_TYPES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
            <FieldError
              id="dp-organizationType-error"
              message={fieldErrors.organizationType}
            />
          </div>
        </div>

        <div>
          <label htmlFor="dp-startingDecision" className={labelClass}>
            The decision you would start with (optional)
          </label>
          <textarea
            id="dp-startingDecision"
            name="startingDecision"
            rows={4}
            maxLength={STARTING_DECISION_MAX}
            value={startingDecision}
            onChange={(e) => setStartingDecision(e.target.value)}
            aria-invalid={!!fieldErrors.startingDecision}
            aria-describedby={
              describedBy("startingDecision") ?? "dp-startingDecision-count"
            }
            placeholder="For example: which outside counsel invoices to approve, adjust, or reject"
            className={`${inputBase} ${inputBorder(!!fieldErrors.startingDecision)} resize-y`}
          />
          <p
            id="dp-startingDecision-count"
            className="text-fg-low mt-1.5 text-right text-xs"
          >
            {startingDecision.length} / {STARTING_DECISION_MAX}
          </p>
          <FieldError
            id="dp-startingDecision-error"
            message={fieldErrors.startingDecision}
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
            aria-describedby={describedBy("consent")}
          />
          <span className="text-fg-mid text-sm">
            I agree to the{" "}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#82A5EB] underline underline-offset-2 hover:text-[#A5BFF0]"
            >
              terms of service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#82A5EB] underline underline-offset-2 hover:text-[#A5BFF0]"
            >
              privacy policy
            </Link>
            .<span className="text-error">*</span>
          </span>
        </label>
        <FieldError id="dp-consent-error" message={fieldErrors.consent} />
      </div>

      <div className="flex justify-end pt-8">
        <Button
          variant="primary"
          type="submit"
          disabled={status === "submitting"}
          arrow={status !== "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Apply"}
        </Button>
      </div>

      {/* reCAPTCHA disclosure, required because the badge is hidden in globals.css. */}
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
        <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} size="invisible" />
      )}
    </form>
  );
}
