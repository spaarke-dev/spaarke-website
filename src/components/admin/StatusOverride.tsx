"use client";

import { useAdminRequest } from "@/components/admin/useAdminRequest";

const STATUSES = ["planned", "sent", "bounced", "replied", "engaged", "meeting", "done"] as const;

function label(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Pick a status by hand, or go back to the one from the activity log. */
export function StatusOverride({
  slug,
  contactId,
  derived,
  override,
  who,
}: {
  slug: string;
  contactId: string;
  derived: string;
  override?: string;
  /** For the accessible name: the member's name or email. */
  who: string;
}) {
  const { send, busy, error } = useAdminRequest();
  return (
    <div className="flex flex-col gap-1">
      <select
        aria-label={`Status for ${who}`}
        className="h-8 rounded-md border border-line-strong bg-surface px-1 text-xs text-fg disabled:opacity-50"
        defaultValue={override ?? ""}
        disabled={busy}
        onChange={(e) =>
          void send(`/api/admin/campaigns/${slug}/members/${contactId}`, "PATCH", { status: e.target.value || null })
        }
      >
        <option value="">From activity ({label(derived)})</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {label(s)}, set by hand
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
