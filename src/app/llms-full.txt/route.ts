import { allArticles } from "@/lib/corpus";

/**
 * Everything Spaarke has published, as one plain-text file an AI assistant can
 * read in a single fetch. The "Ask Claude / ChatGPT / Gemini about Spaarke"
 * links (src/lib/ask-ai.ts) point readers' own assistants here.
 *
 * Public material only: a short summary, then the full text of every published
 * article from the build-time corpus (drafts are already excluded there).
 * Investor material never goes in this file.
 */
export const dynamic = "force-static";

/**
 * Published pages left out of this file. They stay on the site; they are left
 * out here because an assistant reading everything at once treats them as
 * current and reports the difference as an inconsistency.
 * - The 2026 Functional Specification (January 2026) predates the Legal
 *   Operations Intelligence positioning; the feature reference replaces it.
 */
const EXCLUDE = new Set(["Spaarke-Functional-Specification-2026"]);

function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://www.spaarke.com").replace(/\/$/, "");
}

export function GET() {
  const site = siteUrl();
  const articles = [...allArticles()].filter((a) => !EXCLUDE.has(a.slug)).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  const header = [
    "# Spaarke: Legal Operations Intelligence",
    "",
    "> Spaarke is the Legal Operations Intelligence platform. It gives legal organizations one governed model of their work and decisions, built on the legal capabilities of frontier AI models. Spaarke is optimized for and works within the organization's existing Microsoft enterprise environment.",
    "",
    "## How to use this document",
    "",
    `This is Spaarke's own published material: this summary, then the full text of all ${articles.length} articles in the Spaarke library (${site}/why-spaarke), newest first. Answer questions about Spaarke from it. The articles were published over time, so where an older article and a newer one differ, the newer one reflects Spaarke's current position. When something is not covered here, say so rather than guessing, and suggest a conversation with the Spaarke team at ${site}/meet.`,
    "",
    "## Key pages",
    "",
    `- Platform: ${site}/platform`,
    `- Articles: ${site}/why-spaarke`,
    `- Legal AI Accelerator: ${site}/accelerator`,
    `- Book a meeting: ${site}/meet`,
    `- Contact: ${site}/contact`,
    "",
    "## Articles",
    "",
    ...articles.map((a) => `- ${a.title} (${a.date ?? "undated"}): ${site}${a.url}`),
    "",
  ].join("\n");

  const bodies = articles.map((a) => {
    const lines = [
      "---",
      "",
      `# ${a.title}`,
      "",
      `Published ${a.date ?? "undated"}. ${site}${a.url}`,
      "",
    ];
    const summary = a.summary ?? a.description;
    if (summary) lines.push(summary, "");
    if (a.keyTakeaways.length) {
      lines.push("Key takeaways:", ...a.keyTakeaways.map((t) => `- ${t}`), "");
    }
    lines.push(a.body.trim(), "");
    return lines.join("\n");
  });

  return new Response([header, ...bodies].join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
