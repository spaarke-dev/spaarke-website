import type { Metadata } from "next";
import { headers } from "next/headers";
import { decodePrincipal, swaHeaderNames } from "@/lib/market/spike-principal";

/**
 * Auth spike (task 001): a hybrid page guarded only by the SWA route rule.
 * Shows whether the client principal reached a server component.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin spike",
  robots: { index: false, follow: false },
};

export default async function AdminSpike() {
  const h = await headers();
  const raw = h.get("x-ms-client-principal");
  const report = {
    route: "/admin/spike (page, server component)",
    hasPrincipalHeader: Boolean(raw),
    principal: decodePrincipal(raw),
    swaHeaders: swaHeaderNames(h),
    renderedAt: new Date().toISOString(),
  };
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-xl font-semibold">Admin auth spike</h1>
      <pre className="mt-6 overflow-x-auto rounded bg-neutral-100 p-4 text-sm text-neutral-900">
        {JSON.stringify(report, null, 2)}
      </pre>
    </main>
  );
}
