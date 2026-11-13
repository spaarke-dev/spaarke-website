import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAskProvider, providerUrl } from "@/lib/ask-ai";
import { trackEvent } from "@/lib/logger";

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
    return NextResponse.redirect(new URL("/ask", request.url), 302);
  }
  const src = (request.nextUrl.searchParams.get("src") ?? "direct").slice(0, 32).replace(/[^\w-]/g, "");
  trackEvent("ask_ai.click", { provider, src: src || "direct" });
  return NextResponse.redirect(providerUrl(provider), {
    status: 302,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
