import { NextResponse } from "next/server";
import { campaignRequest, changed, fail, json, who } from "@/lib/market/admin-api";
import { fillBriefRows } from "@/lib/market/campaign-brief";
import { assignCodes } from "@/lib/market/codes";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/**
 * Give members without a code the next codes (phase 2 FR-03). One request
 * codes up to CODE_CHUNK members; the form calls again while `more` is true.
 */
export async function POST(request: Request, { params }: Ctx) {
  const ctx = await campaignRequest(request, (await params).slug, { body: false });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const r = await assignCodes(ctx.campaign, ctx.principal.roles, who(ctx.principal));
    if (r.status === "prefix-in-use") {
      return fail(409, "Another campaign uses this code prefix. Set a different one under Edit details.");
    }
    // Newly coded members get a brief link once the campaign has a brief (FR-04).
    if (!r.more) await fillBriefRows(ctx.campaign);
    changed();
    return json({ ok: true, coded: r.coded, clashes: r.clashes, more: r.more });
  } catch (err) {
    console.error("[admin] codes failed:", (err as Error).message);
    return fail(500, "The codes were not given out");
  }
}
