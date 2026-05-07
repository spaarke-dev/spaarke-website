"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Send24Regular } from "@fluentui/react-icons";
import FormField from "@/components/FormField";
import InlineAlert from "@/components/InlineAlert";
import { Button } from "@/components/primitives";
import { submissionProps } from "@/lib/attribution";
import { track } from "@/lib/analytics";

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
  const [trackingId, setTrackingId] = useState("");
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
      setTrackingId(data.trackingId ?? "");
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
      <div className="space-y-4">
        <InlineAlert
          variant="success"
          message="Thank you for your interest in Spaarke. Your request has been submitted. Please look for our follow-up email with additional details shortly."
          messageClassName="text-black"
        />
        {trackingId && (
          <p className="text-sm text-muted-foreground">
            Your tracking ID:{" "}
            <span className="font-mono font-medium text-foreground">
              {trackingId}
            </span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {status === "error" && errorMessage && (
        <InlineAlert variant="error" message={errorMessage} />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          name="firstName"
          label="First Name"
          required
          placeholder="Jane"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={fieldErrors.firstName}
        />

        <FormField
          name="lastName"
          label="Last Name"
          required
          placeholder="Smith"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={fieldErrors.lastName}
        />
      </div>

      <FormField
        name="workEmail"
        label="Work Email"
        type="email"
        required
        placeholder="jane.smith@example.com"
        value={workEmail}
        onChange={(e) => setWorkEmail(e.target.value)}
        error={fieldErrors.workEmail}
      />

      <FormField
        name="organization"
        label="Organization"
        required
        placeholder="Acme Corp"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        error={fieldErrors.organization}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          name="jobTitle"
          label="Job Title"
          placeholder="General Counsel"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <div>
          <label
            htmlFor="field-phone"
            className="block text-sm font-medium text-foreground"
          >
            Phone
          </label>
          <div className="mt-1.5">
            <input
              id="field-phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <FormField
        name="useCase"
        label="Use Case"
        type="select"
        required
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
        error={fieldErrors.useCase}
      >
        <option value="">Select a use case</option>
        {USE_CASE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </FormField>

      <FormField
        name="referralSource"
        label="How Did You Hear About Us"
        type="select"
        value={referralSource}
        onChange={(e) => setReferralSource(e.target.value)}
      >
        <option value="">Select an option (optional)</option>
        {REFERRAL_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </FormField>

      <FormField
        name="notes"
        label="Notes"
        type="textarea"
        rows={4}
        placeholder="Tell us about your needs or any questions you have..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border text-cta-blue accent-cta-blue focus:ring-2 focus:ring-cta-blue/50"
            aria-invalid={!!fieldErrors.consent}
            aria-describedby={
              fieldErrors.consent ? "consent-error" : undefined
            }
          />
          <span className="text-sm text-foreground">
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cta-blue underline underline-offset-2 hover:text-cta-blue/80"
            >
              terms of service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cta-blue underline underline-offset-2 hover:text-cta-blue/80"
            >
              privacy policy
            </a>
            .<span className="text-error">*</span>
          </span>
        </label>
        {fieldErrors.consent && (
          <p
            id="consent-error"
            className="mt-1.5 text-sm text-error"
            role="alert"
          >
            {fieldErrors.consent}
          </p>
        )}
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={status === "submitting"}
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
            Submitting...
          </>
        ) : (
          <>
            <Send24Regular aria-hidden="true" className="h-4 w-4" />
            Request early access
          </>
        )}
      </Button>

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
