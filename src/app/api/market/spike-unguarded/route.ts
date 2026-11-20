import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodePrincipal, swaHeaderNames } from "@/lib/market/spike-principal";

/**
 * Auth spike (task 001): a route with no SWA route rule. Question 4 sends a
 * forged x-ms-client-principal here to see whether SWA strips or overwrites
 * it before Next.js reads it. With ?sizes=1 it reports only header names and
 * byte lengths (no values), to see whether signed-in requests carry headers
 * large enough to break the Next.js backend.
 */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

function headerSizes(headers: Headers) {
  const sizes: Record<string, number> = {};
  let total = 0;
  for (const [name, value] of headers) {
    const bytes = Buffer.byteLength(value, "utf8");
    sizes[name] = bytes;
    total += name.length + bytes + 4;
  }
  const cookies = (headers.get("cookie") ?? "")
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => ({ name: c.split("=")[0], bytes: Buffer.byteLength(c, "utf8") }));
  return { totalBytes: total, sizes, cookies };
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("sizes") === "1") {
    return NextResponse.json(
      { route: "/api/market/spike-unguarded?sizes=1", ...headerSizes(request.headers) },
      { headers: NO_STORE },
    );
  }
  const raw = request.headers.get("x-ms-client-principal");
  return NextResponse.json(
    {
      route: "/api/market/spike-unguarded (no route rule)",
      hasPrincipalHeader: Boolean(raw),
      principal: decodePrincipal(raw),
      swaHeaders: swaHeaderNames(request.headers),
      // Whether other principal-like headers carry a client-supplied value.
      principalId: request.headers.get("x-ms-client-principal-id"),
      principalIdp: request.headers.get("x-ms-client-principal-idp"),
      authTokenLength: request.headers.get("x-ms-auth-token")?.length ?? 0,
    },
    { headers: NO_STORE },
  );
}
