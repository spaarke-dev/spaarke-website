export type AiBot = {
  slug: string;
  label: string;
  /** Substrings to match in the User-Agent header, case-insensitive. */
  patterns: readonly string[];
};

export const AI_BOTS: readonly AiBot[] = [
  {
    slug: "perplexity-bot",
    label: "PerplexityBot",
    patterns: ["PerplexityBot", "Perplexity-User"],
  },
  {
    slug: "claude-bot",
    label: "ClaudeBot",
    patterns: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
  },
  { slug: "openai-gpt-bot", label: "GPTBot", patterns: ["GPTBot"] },
  {
    slug: "openai-chatgpt-user",
    label: "ChatGPT-User",
    patterns: ["ChatGPT-User"],
  },
  {
    slug: "openai-search-bot",
    label: "OAI-SearchBot",
    patterns: ["OAI-SearchBot"],
  },
  {
    slug: "google-extended",
    label: "Google-Extended",
    patterns: ["Google-Extended"],
  },
  { slug: "bytespider", label: "Bytespider", patterns: ["Bytespider"] },
  { slug: "diffbot", label: "Diffbot", patterns: ["Diffbot"] },
  { slug: "cohere-ai", label: "Cohere-AI", patterns: ["cohere-ai"] },
  {
    slug: "applebot-extended",
    label: "Applebot-Extended",
    patterns: ["Applebot-Extended"],
  },
];

export function detectAiBot(
  userAgent: string | null | undefined,
): string | undefined {
  if (!userAgent) return undefined;
  const ua = userAgent.toLowerCase();
  for (const bot of AI_BOTS) {
    if (bot.patterns.some((p) => ua.includes(p.toLowerCase()))) {
      return bot.slug;
    }
  }
  return undefined;
}
