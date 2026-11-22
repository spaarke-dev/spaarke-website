import { NextResponse } from "next/server";
import { changed, fail, json, organizationRequest, who } from "@/lib/market/admin-api";
import { editOrganization, OrgError, parseOrgPatch } from "@/lib/market/org-admin";
import { canSeeInvestor } from "@/lib/market/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Edit an organization by hand (task 032). */
export async function PATCH(request: Request, { params }: Ctx) {
  const ctx = await organizationRequest(request, (await params).id, { body: true });
  if (ctx instanceof NextResponse) return ctx;
  try {
    const patch = parseOrgPatch(ctx.body);
    // Only a user who can see investor records may change who can see this one.
    if (patch.visibility && !canSeeInvestor(ctx.principal)) return fail(403, "Visibility needs the investor role");
    const organization = await editOrganization(ctx.organization.id, patch, who(ctx.principal));
    changed();
    return json({ ok: true, organization });
  } catch (err) {
    if (err instanceof OrgError) return fail(400, err.message);
    console.error("[admin] organization edit failed:", (err as Error).message);
    return fail(500, "The edit was not saved");
  }
}
