import { llmsFullText } from "@/lib/llms-full";
import { getPrivateBrief } from "@/lib/private-brief";
import { trackEvent } from "@/lib/logger";

/**
 * The unlisted copy of /llms-full.txt with a private brief (the investor
 * overview) added. Reached only from links that carry the key, such as the
 * "Learn more about Spaarke" buttons in investor emails. See
 * src/lib/private-brief.ts.
 *
 * Not indexed and not cached. It is deliberately not blocked in robots.txt,
 * because the assistants that fetch it on a reader's behalf honor robots.txt.
 */
export const dynamic = "force-dynamic";

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const brief = await getPrivateBrief(key);
  if (!brief) {
    return new Response("Not found.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", ...PRIVATE_HEADERS },
    });
  }
  trackEvent("brief.read", { label: brief.label });
  return new Response(llmsFullText({ investorOverview: brief.text }), {
    headers: { "Content-Type": "text/plain; charset=utf-8", ...PRIVATE_HEADERS },
  });
}
