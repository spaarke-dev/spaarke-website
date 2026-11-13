/**
 * "Ask your AI about Spaarke": links that open Claude, ChatGPT or Gemini with a
 * prompt that points at /llms-full.txt, so a reader's own assistant answers from
 * what Spaarke has published rather than from whatever it remembers.
 *
 * Every link goes through /ask/<provider> first. That hop counts the click and
 * lets the provider URLs change without touching an email that has already
 * gone out.
 *
 * Prefill support differs by provider. Claude documents a `q` parameter that
 * fills the prompt for the user to review. ChatGPT accepts `q` as well. Gemini
 * documents no prefill parameter, so the card also copies the prompt to the
 * clipboard and says so; the link is a convenience, the clipboard is the
 * guarantee.
 */

export const ASK_PROVIDERS = ["claude", "chatgpt", "gemini"] as const;
export type AskProvider = (typeof ASK_PROVIDERS)[number];

export const ASK_PROVIDER_LABEL: Record<AskProvider, string> = {
  claude: "Claude",
  chatgpt: "ChatGPT",
  gemini: "Gemini",
};

export function isAskProvider(value: string): value is AskProvider {
  return (ASK_PROVIDERS as readonly string[]).includes(value);
}

function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://www.spaarke.com").replace(/\/$/, "");
}

/**
 * The prompt every provider receives. Kept short: it is a URL parameter.
 *
 * It asks for a briefing, not a review. An earlier version ended "tell me when
 * something is not covered", and Claude read that as a request to audit the
 * material for gaps and inconsistencies. What is not covered is now handled
 * by sending the reader to the team.
 */
export function askPrompt(): string {
  return (
    `Read ${siteUrl()}/llms-full.txt, Spaarke's own published material. ` +
    "Brief me on Spaarke in a few short paragraphs: the problem it solves for legal organizations, " +
    "what it does, who it is for, and why it is built the way it is. " +
    "Then suggest three questions I might ask next, and answer my follow-ups from that material. " +
    `If something is not covered there, say so briefly and point me to ${siteUrl()}/meet to ask the Spaarke team.`
  );
}

/** Where /ask/<provider> sends the reader. */
export function providerUrl(provider: AskProvider): string {
  const q = encodeURIComponent(askPrompt());
  switch (provider) {
    case "claude":
      return `https://claude.ai/new?q=${q}`;
    case "chatgpt":
      return `https://chatgpt.com/?q=${q}`;
    case "gemini":
      return `https://gemini.google.com/app?q=${q}`;
  }
}

/** The link to put on a page or in an email. `src` says where it was clicked. */
export function askLink(provider: AskProvider, src: string): string {
  return `/ask/${provider}?src=${encodeURIComponent(src)}`;
}
