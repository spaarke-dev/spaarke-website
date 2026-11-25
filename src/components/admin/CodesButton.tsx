"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

type Run = { coded: number; clashes: number; more: boolean };

/**
 * Give every member without a code the next one (phase 2 FR-03). The route
 * codes a part at a time, so the button calls it until nothing is left.
 */
export function CodesButton({ slug, uncoded, prefix }: { slug: string; uncoded: number; prefix: string }) {
  const { send, busy, error } = useAdminRequest();
  const router = useRouter();
  const [done, setDone] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  async function run() {
    setDone(null);
    setWorking(true);
    let coded = 0;
    let clashes = 0;
    try {
      for (let part = 0; part < 50; part++) {
        const r = await send<Run>(`/api/admin/campaigns/${slug}/codes`, "POST", undefined, { refresh: false });
        if (!r) return;
        coded += r.coded;
        clashes += r.clashes;
        if (!r.more) break;
      }
      const skipped = clashes ? ` ${clashes === 1 ? "One number was" : `${clashes} numbers were`} taken already and skipped.` : "";
      setDone(`Gave ${coded === 1 ? "1 member a code" : `${coded} members codes`}.${skipped}`);
    } finally {
      setWorking(false);
      router.refresh();
    }
  }

  const disabled = busy || working;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {uncoded > 0 ? (
        <button type="button" className={QUIET} disabled={disabled} onClick={() => void run()}>
          {disabled ? "Giving out codes" : `Give everyone a code (${uncoded} without one)`}
        </button>
      ) : null}
      <span className="text-xs text-fg-mid">
        Codes start with <span className="font-mono">{prefix}-</span>
      </span>
      {done ? (
        <span role="status" className="text-sm">
          {done}
        </span>
      ) : null}
      {error ? (
        <span role="alert" className="text-sm text-[#c42b1c]">
          {error}
        </span>
      ) : null}
    </div>
  );
}
