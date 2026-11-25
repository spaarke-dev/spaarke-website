"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Send a JSON request to an admin route, then refresh the page's server data. */
export function useAdminRequest() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send<T = Record<string, unknown>>(
    url: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    body?: unknown,
    opts: { refresh?: boolean } = {},
  ): Promise<T | null> {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as T & { error?: string };
      if (!res.ok) {
        setError(data.error ?? `The request failed (${res.status})`);
        return null;
      }
      if (opts.refresh !== false) router.refresh();
      return data;
    } catch {
      setError("The request did not reach the server");
      return null;
    } finally {
      setBusy(false);
    }
  }

  return { send, busy, error, setError };
}

export const FIELD =
  "h-9 w-full rounded-md border border-line-strong bg-surface px-2 text-sm text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-spaarke-blue";
export const BUTTON =
  "inline-flex h-9 items-center justify-center rounded-md bg-spaarke-blue px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-spaarke-blue focus-visible:ring-offset-2";
export const QUIET =
  "inline-flex h-9 items-center justify-center rounded-md border border-line-strong px-3 text-sm hover:bg-surface-2 disabled:opacity-50";
export const DANGER =
  "inline-flex h-9 items-center justify-center rounded-md bg-[#c42b1c] px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50";
