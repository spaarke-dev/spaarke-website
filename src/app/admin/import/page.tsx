import type { Metadata } from "next";
import { canSeeInvestor, requireAdmin } from "@/lib/market/auth";
import { isMarketConfigured } from "@/lib/market/tables";
import { visibleCampaigns } from "@/lib/market/queries";
import { EmptyState } from "@/components/admin/EmptyState";
import { ImportChooser } from "@/components/admin/ImportChooser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Import" };

/** Target list import (phase 2 FR-01) and LinkedIn Lead Gen Form import (FR-14). */
export default async function ImportPage() {
  const access = await requireAdmin("/admin/import");
  if (access.status !== "ok") return null;

  if (!isMarketConfigured()) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Import</h1>
        <div className="mt-6">
          <EmptyState title="Storage is not configured" />
        </div>
      </section>
    );
  }

  const campaigns = (await visibleCampaigns(access.principal.roles))
    .map((c) => ({ slug: c.slug, name: c.name, kind: c.kind, createdAt: c.createdAt }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(({ slug, name, kind }) => ({ slug, name, kind }));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Import</h1>
        <p className="mt-1 text-sm text-fg-mid">
          Choose a CSV file, check how its columns map and what it will add, then import. Nothing is saved before you press
          Import.
        </p>
      </div>
      <ImportChooser campaigns={campaigns} canInvestor={canSeeInvestor(access.principal)} />
    </section>
  );
}
