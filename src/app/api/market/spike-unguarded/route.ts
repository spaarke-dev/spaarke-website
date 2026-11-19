import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodePrincipal, swaHeaderNames } from "@/lib/market/spike-principal";

/**
 * Auth spike (task 001): a route with no SWA route rule. Question 4 sends a
 * forged x-ms-client-principal here to see whether SWA strips or overwrites
 * it before Next.js reads it.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = request.headers.get("x-ms-client-principal");
  return NextResponse.json(
    {
      route: "/api/market/spike-unguarded (no route rule)",
      hasPrincipalHeader: Boolean(raw),
      principal: decodePrincipal(raw),
      swaHeaders: swaHeaderNames(request.headers),
    },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
