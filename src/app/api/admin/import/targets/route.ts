import { NextResponse } from "next/server";
import { adminRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { getCampaign, isCampaignSlug } from "@/lib/market/campaigns";
import { CsvError } from "@/lib/market/csv";
import { parseTargetRequest, previewTargets, runTargets } from "@/lib/market/target-import";
import { canSeeInvestor, isVisibleTo } from "@/lib/market/visibility";

export const dynamic = "force-dynamic";

/**
 * Target list import (phase 2 FR-01, task 010). The body carries the CSV text,
 * the column mapping, the campaign and the visibility for new contacts.
 * Without `confirm` it returns a preview and writes nothing; with it, it
 * imports the rows from `from` and answers with the next row to send. The text
 * is parsed in memory and dropped with the request.
 */
export async function POST(request: Request) {
  const ctx = await adminRequest(request, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const req = parseTargetRequest(ctx.body);
    if (req.visibility === "investor" && !canSeeInvestor(ctx.principal.roles)) {
      return fail(403, "Only an admin with the investor role can import investor contacts");
    }

    let campaign = null;
    if (req.campaign) {
      if (!isCampaignSlug(req.campaign)) throw new CsvError("Pick a campaign for this list");
      campaign = await getCampaign(req.campaign);
      if (!campaign || !isVisibleTo(campaign, ctx.principal.roles)) return fail(404, "No such campaign");
    }
    if (!req.confirm) return json({ ok: true, preview: await previewTargets(req) });

    if (!campaign) throw new CsvError("Pick a campaign for this list");
    const result = await runTargets(req, campaign, who(ctx.principal));
    changed();
    return json({ ok: true, result });
  } catch (err) {
    if (err instanceof CsvError) return fail(400, err.message);
    // Never the file or a row: only that it failed.
    console.error("[admin] target list import failed:", (err as Error).message);
    return fail(500, "The import stopped part way; run it again. People already saved are not added twice.");
  }
}
