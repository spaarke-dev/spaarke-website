export type AiSource = {
  /** Canonical slug used in event props. Lowercase, kebab-case. */
  slug: string;
  /** Display label for human-readable contexts. */
  label: string;
  /** Substring(s) tested against the referrer host. */
  hosts: readonly string[];
};

export const AI_SOURCES: readonly AiSource[] = [
  { slug: "perplexity", label: "Perplexity", hosts: ["perplexity.ai"] },
  {
    slug: "chatgpt",
    label: "ChatGPT",
    hosts: ["chat.openai.com", "chatgpt.com"],
  },
  { slug: "claude", label: "Claude", hosts: ["claude.ai"] },
  {
    slug: "bing-ai",
    label: "Bing AI / Copilot",
    hosts: [
      "copilot.microsoft.com",
      "edgeservices.bing.com",
      "bing.com/chat",
    ],
  },
  {
    slug: "gemini",
    label: "Google Gemini",
    hosts: ["gemini.google.com", "bard.google.com"],
  },
  { slug: "you", label: "You.com", hosts: ["you.com"] },
  { slug: "kagi", label: "Kagi", hosts: ["kagi.com"] },
  { slug: "phind", label: "Phind", hosts: ["phind.com"] },
  {
    slug: "duckduckgo-ai",
    label: "DuckDuckGo AI",
    hosts: ["duck.ai", "duckduckgo.com/ai"],
  },
];

/** Detect an AI source from a referrer URL. Returns the slug or undefined. */
export function detectAiSource(referrer: string): string | undefined {
  if (!referrer) return undefined;
  let host = "";
  try {
    host = new URL(referrer).host.toLowerCase();
  } catch {
    return undefined;
  }
  for (const src of AI_SOURCES) {
    if (src.hosts.some((h) => host.includes(h.toLowerCase()))) {
      return src.slug;
    }
  }
  return undefined;
}
