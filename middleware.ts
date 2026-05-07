import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detectAiBot } from "@/lib/ai-bots";
import { trackAiCrawler } from "@/lib/logger";

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent");
  const bot = detectAiBot(ua);
  if (bot) {
    // Fire-and-forget — don't block response on telemetry.
    trackAiCrawler({
      bot,
      path: request.nextUrl.pathname,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|api).*)"],
  runtime: "nodejs",
};
