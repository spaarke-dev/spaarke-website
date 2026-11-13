"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import InlineAlert from "@/components/InlineAlert";
import { Button } from "@/components/primitives";
import { GuestList } from "@/components/meet/GuestList";
import { SlotPicker } from "@/components/meet/SlotPicker";
import {
  MEET_ERRORS,
  formatMeeting,
  inputBase,
  inputBorder,
  labelClass,
  useVisitorTimeZone,
} from "@/components/meet/shared";
import { readAttribution, submissionProps } from "@/lib/attribution";
import { track } from "@/lib/analytics";

type Fields = "name" | "email" | "organization" | "role" | "topic";
type FieldErrors = Partial<Record<Fields | "guests", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPIC_MAX = 1000;

function validate(v: Record<Fields, string>): FieldErrors {
  const e: FieldErrors = {};
  if (!v.name.trim()) e.name = "Name is required.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "A valid work email address is required.";
  if (!v.organization.trim()) e.organization = "Organization is required.";
  if (v.topic.length > TOPIC_MAX) e.topic = `Please keep this to ${TOPIC_MAX} characters.`;
  return e;
}

type Booked = { start: string; email: string; manageUrl: string; guests: string[] };

export function MeetBookingFlow({
  initialSlots,
  durationMinutes,
  recaptchaSiteKey,
}: {
  initialSlots: string[];
  durationMinutes: number;
  recaptchaSiteKey: string;
}) {
  const [timeZone, setTimeZone] = useVisitorTimeZone();
  const [slots, setSlots] = useState(initialSlots);
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "details" | "done">("pick");
  const [values, setValues] = useState<Record<Fields, string>>({
    name: "",
    email: "",
    organization: "",
    role: "",
    topic: "",
  });
  const [guests, setGuests] = useState<string[]>([]);
  const [hp, setHp] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState<Booked | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  async function refreshSlots() {
    try {
      const res = await fetch("/api/meet/availability", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; slots?: string[] };
      if (data.ok && data.slots) setSlots(data.slots);
    } catch {
      // Keep the list we have; the next attempt will refresh again.
    }
  }

  function set(field: Fields, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const local = validate(values);
    setFieldErrors(local);
    if (Object.keys(local).length > 0) return;

    setSubmitting(true);
    setError("");

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
        setError(
          "We could not run the reCAPTCHA check. Browser extensions and privacy tools sometimes block it. Try another browser, or email contactus@spaarke.com.",
        );
        return;
      }
    }

    try {
      const res = await fetch("/api/meet/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: selected,
          name: values.name.trim(),
          email: values.email.trim(),
          organization: values.organization.trim(),
          role: values.role.trim(),
          topic: values.topic.trim(),
          timeZone,
          guests,
          hp,
          captchaToken,
          attribution: readAttribution(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: FieldErrors;
        start?: string;
        manageUrl?: string;
        guests?: string[];
      };

      if (!res.ok || !data.ok) {
        if (data.error === "VALIDATION_ERROR" && data.fields && Object.keys(data.fields).length) {
          setFieldErrors(data.fields);
        } else if (data.error === "SLOT_TAKEN") {
          track("Meeting Slot Taken");
          setSelected(null);
          setStep("pick");
          await refreshSlots();
          setError(MEET_ERRORS.SLOT_TAKEN);
        } else {
          setError(MEET_ERRORS[data.error ?? ""] ?? MEET_ERRORS.UNAVAILABLE);
        }
        return;
      }

      track("Meeting Booked", { ...submissionProps(), guests: String(guests.length) });
      setBooked({
        start: data.start ?? selected,
        email: values.email.trim(),
        manageUrl: data.manageUrl ?? "",
        guests: data.guests ?? guests,
      });
      setStep("done");
      requestAnimationFrame(() => headingRef.current?.focus());
    } catch {
      setError(MEET_ERRORS.NETWORK);
    } finally {
      setSubmitting(false);
    }
  }

  if (!timeZone) {
    return <div className="text-fg-low mt-12 text-sm">Loading available times…</div>;
  }

  if (step === "done" && booked) {
    return (
      <div className="border-line mt-12 rounded-xl border p-6 md:p-10">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-fg font-medium tracking-tight focus:outline-none"
          style={{ fontSize: "clamp(26px, 3.5vw, 38px)", lineHeight: 1.1 }}
        >
          You are booked
        </h2>
        <p className="text-fg mt-4 text-base md:text-[17px]">
          {formatMeeting(booked.start, durationMinutes, timeZone)}
        </p>
        <p className="text-fg-mid mt-4 text-base">
          We sent a calendar invitation with the Microsoft Teams link and a confirmation email to{" "}
          {booked.email}. If they are not in your inbox in a few minutes, check your junk folder. We will
          also email a reminder the day before and an hour before.
        </p>
        {booked.guests.length > 0 && (
          <p className="text-fg-mid mt-4 text-base">
            We also invited {booked.guests.join(", ")}.
          </p>
        )}
        {booked.manageUrl && (
          <p className="text-fg-mid mt-4 text-base">
            Need a different time, or want to invite someone else? Use the link in the email, or{" "}
            <a href={booked.manageUrl} className="text-cta-blue underline underline-offset-2">
              manage your meeting here
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="mt-12">
        <p className="text-fg-mid text-base">
          There are no open times in the next few weeks. Send us a note and we will propose times by email.
        </p>
        <div className="mt-6">
          <Button variant="primary" href="/contact" arrow>
            Contact us
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {error && (
        <div className="mb-8">
          <InlineAlert variant="error" message={error} />
        </div>
      )}

      {step === "pick" && (
        <>
          <SlotPicker
            slots={slots}
            timeZone={timeZone}
            onTimeZoneChange={setTimeZone}
            selected={selected}
            onSelect={setSelected}
            durationMinutes={durationMinutes}
          />
          <div className="border-line mt-10 flex flex-col items-start gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-fg-mid text-sm" aria-live="polite">
              {selected ? formatMeeting(selected, durationMinutes, timeZone) : "Choose a time to continue."}
            </p>
            <Button
              variant="primary"
              arrow
              disabled={!selected}
              onClick={() => {
                setError("");
                setStep("details");
              }}
            >
              Continue
            </Button>
          </div>
        </>
      )}

      {step === "details" && selected && (
        <form onSubmit={submit} noValidate className="max-w-2xl">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-fg text-base font-medium">{formatMeeting(selected, durationMinutes, timeZone)}</p>
            <button
              type="button"
              onClick={() => setStep("pick")}
              className="text-cta-blue text-sm underline underline-offset-2"
            >
              Change time
            </button>
          </div>

          <div className="mt-10 space-y-7">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <Field id="name" label="Name" required value={values.name} error={fieldErrors.name} autoComplete="name" onChange={set} />
              <Field id="email" label="Work email" required type="email" value={values.email} error={fieldErrors.email} autoComplete="email" onChange={set} />
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <Field id="organization" label="Organization" required value={values.organization} error={fieldErrors.organization} autoComplete="organization" onChange={set} />
              <Field id="role" label="Role" value={values.role} error={fieldErrors.role} autoComplete="organization-title" onChange={set} />
            </div>
            <div>
              <label htmlFor="meet-topic" className={labelClass}>
                What would you like to cover?
              </label>
              <textarea
                id="meet-topic"
                rows={4}
                maxLength={TOPIC_MAX}
                value={values.topic}
                onChange={(e) => set("topic", e.target.value)}
                aria-invalid={!!fieldErrors.topic}
                className={`${inputBase} ${inputBorder(!!fieldErrors.topic)} resize-y`}
              />
              {fieldErrors.topic && (
                <p className="text-error mt-1.5 text-sm" role="alert">
                  {fieldErrors.topic}
                </p>
              )}
            </div>
            <GuestList
              guests={guests}
              onChange={(next) => {
                setGuests(next);
                if (fieldErrors.guests) setFieldErrors((f) => ({ ...f, guests: undefined }));
              }}
              ownEmail={values.email}
              error={fieldErrors.guests}
            />
          </div>

          {/* Honeypot: hidden from people and assistive technology. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="meet-website">Website</label>
            <input id="meet-website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
          </div>

          <div className="flex justify-end pt-10">
            <Button variant="primary" type="submit" disabled={submitting} arrow={!submitting}>
              {submitting ? "Booking…" : "Book meeting"}
            </Button>
          </div>

          <p className="text-fg-low mt-10 text-xs leading-relaxed">
            We use what you enter to schedule and prepare for the meeting. See our{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
          <p className="text-fg-low/70 mt-4 text-[10px] leading-relaxed">
            This site is protected by reCAPTCHA and the Google{" "}
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
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  error,
  required,
  type = "text",
  autoComplete,
  onChange,
}: {
  id: Fields;
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  onChange: (field: Fields, value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={`meet-${id}`} className={labelClass}>
        {label}
        {required && <span className="text-error">*</span>}
      </label>
      <input
        id={`meet-${id}`}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(id, e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `meet-${id}-error` : undefined}
        className={`${inputBase} ${inputBorder(!!error)}`}
      />
      {error && (
        <p id={`meet-${id}-error`} className="text-error mt-1.5 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
