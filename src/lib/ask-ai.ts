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

export function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://www.spaarke.com").replace(/\/$/, "");
}

/**
 * A private brief key: the unguessable part of /brief/<key>, the unlisted
 * copy of the material that adds the investor overview. The key arrives on
 * an email link as `k`; the overview itself lives in Table Storage under that
 * key (src/lib/private-brief.ts), never in this repository.
 */
export function isBriefKey(value: string | null | undefined): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{20,64}$/.test(value);
}

/**
 * The shape of the first answer. The prompt carries it, because an assistant
 * follows the reader's own prompt reliably; the text file repeats it at the
 * top as a backstop, though assistants treat instructions inside a fetched
 * file as advisory.
 */
export const BRIEFING_SECTIONS = [
  "Spaarke in one sentence",
  "The problem: why legal organizations need it now",
  "What it does, in three or four short bullets",
  "Who it is for",
  "How it is built: Microsoft, frontier AI, and governance, in two or three sentences",
] as const;

/** Offered as numbered follow-ups at the end of the first answer. */
export const FOLLOW_UPS = [
  "What is Legal Operations Intelligence?",
  "How does Spaarke work inside Microsoft 365?",
  "How does Spaarke keep our data and AI governed?",
  "What does getting started look like?",
  "How is Spaarke different from other legal AI tools?",
] as const;

/** The private brief adds the founder and the company's stage. */
export const INVESTOR_BRIEFING_SECTIONS = [
  ...BRIEFING_SECTIONS,
  "The founder and where Spaarke is today",
] as const;

export const INVESTOR_FOLLOW_UPS = [
  "What is Legal Operations Intelligence?",
  "How does Spaarke build on frontier AI models?",
  "How does Spaarke work inside Microsoft 365?",
  "How does Spaarke go to market?",
  "Who is behind Spaarke, and where is it today?",
] as const;

/** Where the assistant reads from: the public file, or a private brief. */
export function materialUrl(briefKey?: string): string {
  return isBriefKey(briefKey) ? `${siteUrl()}/brief/${briefKey}` : `${siteUrl()}/llms-full.txt`;
}

/**
 * The prompt every provider receives. It is a URL parameter, so it stays well
 * under Claude's documented prefill limit.
 *
 * It asks for a briefing, not a review. An earlier version ended "tell me when
 * something is not covered", and Claude read that as a request to audit the
 * material for gaps and inconsistencies. What is not covered is now handled
 * by sending the reader to the team.
 */
export function askPrompt(briefKey?: string): string {
  const site = siteUrl();
  const investor = isBriefKey(briefKey);
  const sections = investor ? INVESTOR_BRIEFING_SECTIONS : BRIEFING_SECTIONS;
  const followUps = investor ? INVESTOR_FOLLOW_UPS : FOLLOW_UPS;
  return [
    `Read ${materialUrl(briefKey)}, Spaarke's own material, and brief me on Spaarke in under ${investor ? 300 : 250} words with these headings:`,
    ...sections.map((s, i) => `${i + 1}. ${s}`),
    "Then offer these as numbered follow-up questions I can pick by number:",
    ...followUps.map((q, i) => `${i + 1}. ${q}`),
    `Answer my follow-ups from that material. If something is not covered there, say so briefly and point me to ${site}/meet to ask the Spaarke team.`,
  ].join("\n");
}

/** Where /ask/<provider> sends the reader. */
export function providerUrl(provider: AskProvider, briefKey?: string): string {
  const q = encodeURIComponent(askPrompt(briefKey));
  switch (provider) {
    case "claude":
      return `https://claude.ai/new?q=${q}`;
    case "chatgpt":
      return `https://chatgpt.com/?q=${q}`;
    case "gemini":
      return `https://gemini.google.com/app?q=${q}`;
  }
}

/**
 * The link to put on a page or in an email. `src` says where it was clicked;
 * `briefKey`, when given, points the assistant at that private brief.
 */
export function askLink(provider: AskProvider, src: string, briefKey?: string): string {
  const k = isBriefKey(briefKey) ? `&k=${briefKey}` : "";
  return `/ask/${provider}?src=${encodeURIComponent(src)}${k}`;
}
