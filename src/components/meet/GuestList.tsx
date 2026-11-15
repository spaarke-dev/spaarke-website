"use client";

import { useId, useState } from "react";
import { inputBase, inputBorder, labelClass } from "@/components/meet/shared";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const GUESTS_MAX = 5;

/**
 * An editable list of guest email addresses, used on the booking form and
 * the manage page. The server checks the list again; this only catches the
 * obvious mistakes before a round trip.
 */
export function GuestList({
  guests,
  onChange,
  ownEmail,
  error,
  label = "Invite others (optional)",
  hint = `Colleagues you add get the invitation with the Teams link and the reminders. Up to ${GUESTS_MAX}.`,
}: {
  guests: string[];
  onChange: (guests: string[]) => void;
  ownEmail?: string;
  error?: string;
  label?: string;
  hint?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const [localError, setLocalError] = useState("");
  const shownError = localError || error;
  const full = guests.length >= GUESTS_MAX;

  function add() {
    const email = draft.trim();
    if (!email) return;
    const key = email.toLowerCase();
    if (!EMAIL_RE.test(email)) return setLocalError("Please enter a valid email address.");
    if (ownEmail && key === ownEmail.trim().toLowerCase()) {
      return setLocalError("Your own address is already on the invitation.");
    }
    if (guests.some((g) => g.toLowerCase() === key)) return setLocalError("That address is already on the list.");
    if (full) return setLocalError(`You can invite up to ${GUESTS_MAX} guests.`);
    setLocalError("");
    setDraft("");
    onChange([...guests, email]);
  }

  return (
    <div>
      <label htmlFor={`${id}-input`} className={labelClass}>
        {label}
      </label>
      <p id={`${id}-hint`} className="text-fg-low mt-1.5 text-sm">
        {hint}
      </p>

      {guests.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Guests">
          {guests.map((g) => (
            <li
              key={g}
              className="border-line text-fg flex items-center gap-2 rounded-full border py-1 pl-3 pr-1 text-sm"
            >
              <span className="break-all">{g}</span>
              <button
                type="button"
                onClick={() => onChange(guests.filter((x) => x !== g))}
                className="text-fg-low hover:text-fg flex h-6 w-6 items-center justify-center rounded-full text-base leading-none"
                aria-label={`Remove ${g}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {!full && (
        <div className="mt-3 flex items-end gap-3">
          <input
            id={`${id}-input`}
            type="email"
            value={draft}
            placeholder="colleague@company.com"
            autoComplete="off"
            onChange={(e) => {
              setDraft(e.target.value);
              if (localError) setLocalError("");
            }}
            // An address typed but not added is added on leaving the field,
            // so it is not lost when the visitor goes straight to submit.
            onBlur={() => {
              if (EMAIL_RE.test(draft.trim())) add();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                add();
              }
            }}
            aria-invalid={!!shownError}
            aria-describedby={`${id}-hint${shownError ? ` ${id}-error` : ""}`}
            className={`${inputBase} ${inputBorder(!!shownError)}`}
          />
          <button
            type="button"
            onClick={add}
            className="border-line-strong text-fg hover:border-cta-blue hover:text-cta-blue shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {shownError && (
        <p id={`${id}-error`} className="text-error mt-1.5 text-sm" role="alert">
          {shownError}
        </p>
      )}
    </div>
  );
}
