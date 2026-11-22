"use client";

import { useAdminRequest } from "@/components/admin/useAdminRequest";

export const FOLLOWUP_STATUS_LABELS = {
  todo: "To do",
  drafted: "Drafted",
  sent: "Sent",
  replied: "Replied",
  skipped: "Skipped",
} as const;

/** Change a follow-up's status in place. */
export function FollowUpStatus({
  contactId,
  id,
  status,
  title,
}: {
  contactId: string;
  id: string;
  status: string;
  /** For the accessible name. */
  title: string;
}) {
  const { send, busy, error } = useAdminRequest();
  return (
    <div className="flex flex-col gap-1">
      <select
        aria-label={`Status of ${title}`}
        className="h-8 rounded-md border border-line-strong bg-surface px-1 text-xs text-fg disabled:opacity-50"
        defaultValue={status}
        disabled={busy}
        onChange={(e) => void send(`/api/admin/contacts/${contactId}/followups/${id}`, "PATCH", { status: e.target.value })}
      >
        {Object.entries(FOLLOWUP_STATUS_LABELS).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {error ? (
        <span role="alert" className="text-xs text-[#c42b1c]">
          {error}
        </span>
      ) : null}
    </div>
  );
}
