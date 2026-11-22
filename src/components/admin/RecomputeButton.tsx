"use client";

import { QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

/** Derive member statuses from the activity log now. */
export function RecomputeButton({ slug }: { slug: string }) {
  const { send, busy, error } = useAdminRequest();
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className={QUIET}
        disabled={busy}
        onClick={() => void send(`/api/admin/campaigns/${slug}/recompute`, "POST")}
      >
        {busy ? "Updating" : "Update statuses"}
      </button>
      {error ? (
        <span role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </span>
      ) : null}
    </span>
  );
}
