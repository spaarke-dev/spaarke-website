import { NextResponse } from "next/server";
import { adminRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { getCampaign, isCampaignSlug } from "@/lib/market/campaigns";
import { CsvError } from "@/lib/market/csv";
import { parseImportRequest, previewImport, runImport } from "@/lib/market/linkedin-import";
import { isVisibleTo } from "@/lib/market/visibility";

export const dynamic = "force-dynamic";

/**
 * LinkedIn Lead Gen Form import (FR-14, task 053). The body carries the CSV
 * text, the column mapping and the campaign. Without `confirm` it returns a
 * preview and writes nothing; with it, it imports. The text is parsed in
 * memory and dropped with the request.
 */
export async function POST(request: Request) {
  const ctx = await adminRequest(request, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const req = parseImportRequest(ctx.body);
    if (!req.confirm) return json({ ok: true, preview: await previewImport(req) });

    if (!req.campaign || !isCampaignSlug(req.campaign)) throw new CsvError("Pick a campaign for these leads");
    const campaign = await getCampaign(req.campaign);
    if (!campaign || !isVisibleTo(campaign, ctx.principal.roles)) return fail(404, "No such campaign");
    const result = await runImport(req, campaign, ctx.principal.roles, who(ctx.principal));
    changed();
    return json({ ok: true, result });
  } catch (err) {
    if (err instanceof CsvError) return fail(400, err.message);
    // Never the file or a row: only that it failed.
    console.error("[admin] LinkedIn import failed:", (err as Error).message);
    return fail(500, "The import stopped part way; run it again. Leads already saved are not added twice.");
  }
}
