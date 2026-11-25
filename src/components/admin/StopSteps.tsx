"use client";

import { useAdminRequest } from "@/components/admin/useAdminRequest";

/** Stop or restart step follow-ups for one campaign member (phase 2 FR-09). */
export function StopSteps({
  slug,
  contactId,
  stopped,
  who,
}: {
  slug: string;
  contactId: string;
  stopped: boolean;
  /** For the accessible name: the member's name, or the campaign's on a contact page. */
  who: string;
}) {
  const { send, busy, error } = useAdminRequest();
  return (
    <div className="flex flex-col gap-1">
      <label className="inline-flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={stopped}
          disabled={busy}
          aria-label={`Stop steps for ${who}`}
          onChange={(e) =>
            void send(`/api/admin/campaigns/${slug}/members/${contactId}`, "PATCH", { stopSteps: e.target.checked })
          }
          className="h-4 w-4"
        />
        Stop steps
      </label>
      {error ? (
        <span role="alert" className="text-xs text-[#c42b1c]">
          {error}
        </span>
      ) : null}
    </div>
  );
}
