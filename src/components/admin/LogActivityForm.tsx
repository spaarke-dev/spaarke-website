"use client";

import { useRef, useState } from "react";
import { BUTTON, FIELD, useAdminRequest } from "@/components/admin/useAdminRequest";

const TYPES = [
  { value: "note", label: "Note" },
  { value: "call", label: "Phone call" },
  { value: "email.sent", label: "Email I sent" },
  { value: "email.received", label: "Email I received" },
  { value: "meeting.in_person", label: "In-person meeting" },
  { value: "linkedin.message", label: "LinkedIn message" },
];

const MAX = 280;

/**
 * Add a note, or log a phone call, an email the sync cannot see, an in-person
 * meeting or a LinkedIn message, on the timeline.
 */
export function LogActivityForm({ contactId }: { contactId: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [length, setLength] = useState(0);
  const [saved, setSaved] = useState(false);
  const { send, busy, error } = useAdminRequest();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    const f = new FormData(e.currentTarget);
    const when = String(f.get("when") ?? "");
    const ok = await send(`/api/admin/contacts/${contactId}/activity`, "POST", {
      type: String(f.get("type")),
      summary: String(f.get("summary") ?? ""),
      // A date picked here is local time; send it as an instant.
      occurredAt: when ? new Date(when).toISOString() : undefined,
    });
    if (ok) {
      form.current?.reset();
      setLength(0);
      setSaved(true);
    }
  }

  return (
    <form ref={form} onSubmit={onSubmit} className="space-y-2 rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-wrap gap-2">
        <label className="flex flex-[1_1_10rem] flex-col gap-1 text-xs text-fg-mid">
          Type
          <select name="type" defaultValue="note" className={FIELD}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-[1_1_12rem] flex-col gap-1 text-xs text-fg-mid">
          When (leave empty for now)
          <input name="when" type="datetime-local" className={FIELD} />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs text-fg-mid">
        What happened
        <textarea
          name="summary"
          required
          maxLength={MAX}
          rows={3}
          onChange={(e) => setLength(e.target.value.length)}
          className={`${FIELD} h-auto py-2`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={BUTTON} disabled={busy}>
          {busy ? "Saving" : "Add to timeline"}
        </button>
        <span className="text-xs text-fg-low">
          {length} of {MAX}
        </span>
        {saved ? <span className="text-sm text-fg-mid">Added.</span> : null}
        {error ? (
          <p role="alert" className="text-sm text-[#c42b1c]">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
