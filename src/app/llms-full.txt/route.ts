import { llmsFullText } from "@/lib/llms-full";

/**
 * Spaarke's core material as one plain-text file an AI assistant can read in a
 * single fetch. The "Learn more about Spaarke" links (src/lib/ask-ai.ts) point
 * readers' own assistants here. Content and article choice: src/lib/llms-full.ts.
 *
 * Public material only. Investor material is served privately at /brief/<key>.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
