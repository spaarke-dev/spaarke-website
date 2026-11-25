import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAskProvider, isBriefKey, providerUrl, siteUrl } from "@/lib/ask-ai";
import { trackEvent } from "@/lib/logger";
import { getPrivateBrief } from "@/lib/private-brief";
import { recordAskClick } from "@/lib/market/writers";

/**
 * Count the click, then send the reader to their AI with the prompt filled in.
 * See src/lib/ask-ai.ts. Nothing personal is recorded: the provider and the
 * place the link was clicked from (`src`, for example "article" or "email").
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  if (!isAskProvider(provider)) {
    // siteUrl(), not request.url: behind Static Web Apps that is localhost:8080.
    return NextResponse.redirect(new URL("/ask", siteUrl()), 302);
  }
  const src = (request.nextUrl.searchParams.get("src") ?? "direct").slice(0, 32).replace(/[^\w-]/g, "");
  // A private brief key (from an investor email) points the prompt at
  // /brief/<key> instead of the public file. The key itself is not logged.
  const k = request.nextUrl.searchParams.get("k");
  const briefKey = isBriefKey(k) ? k : undefined;
  trackEvent("ask_ai.click", { provider, src: src || "direct", brief: briefKey ? "yes" : "no" });
  // The market access log (FR-06): a recipient code in `src`, or the brief
  // behind `k`, ties the click to a campaign member. Neither is logged.
  const brief = briefKey ? await getPrivateBrief(briefKey) : null;
  await recordAskClick(provider, src, brief?.label);
  return NextResponse.redirect(providerUrl(provider, briefKey, brief?.audience), {
    status: 302,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
