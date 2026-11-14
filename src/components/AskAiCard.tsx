"use client";

import { useState, useSyncExternalStore } from "react";
import { ASK_PROVIDERS, ASK_PROVIDER_LABEL, askLink, askPrompt, isBriefKey, type AskProvider } from "@/lib/ask-ai";

type Props = {
  /** Where the card sits, recorded with each click (for example "article" or "ask-page"). */
  src: string;
  /** "rail" is the compact article-rail version; "page" is the larger standalone card. */
  variant?: "rail" | "page";
};

/**
 * "Learn more about Spaarke". Three links that open Claude, ChatGPT or Gemini
 * with a prompt pointing at /llms-full.txt, or at a private brief when the page
 * was opened from a link carrying one (`?k=`, from an investor email).
 *
 * Clicking also copies the prompt, because not every provider fills it in from
 * the link (see src/lib/ask-ai.ts). The note under the buttons tells the reader
 * it is on their clipboard.
 */
const noSubscribe = () => () => {};

export function AskAiCard({ src, variant = "rail" }: Props) {
  const [copied, setCopied] = useState<AskProvider | null>(null);
  // The page is static, so the key is read from the address in the browser
  // (empty during prerender).
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const k = new URLSearchParams(search).get("k");
  const briefKey = isBriefKey(k) ? k : undefined;

  const onClick = async (provider: AskProvider) => {
    try {
      await navigator.clipboard.writeText(askPrompt(briefKey));
      setCopied(provider);
    } catch {
      // Clipboard unavailable: the link still opens the provider.
    }
  };

  const page = variant === "page";

  return (
    <section aria-labelledby={`ask-ai-heading-${src}`}>
      <h2
        id={`ask-ai-heading-${src}`}
        className={
          "flex items-center gap-2 " +
          (page
            ? "text-fg font-display text-2xl font-medium tracking-tight"
            : "text-fg-low font-mono text-[11px] font-medium uppercase tracking-[0.18em]")
        }
      >
        Learn more about Spaarke
      </h2>
      <p className={page ? "text-fg-mid mt-3 text-base leading-relaxed" : "text-fg-mid mt-3 text-[13px] leading-snug"}>
        One click briefs your AI assistant on Spaarke. Then ask it anything.
      </p>
      <div className={page ? "mt-6 flex flex-wrap gap-3" : "mt-3 flex flex-col gap-2"}>
        {ASK_PROVIDERS.map((p) => (
          <a
            key={p}
            href={askLink(p, src, briefKey)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void onClick(p)}
            className={
              "border-line-strong hover:border-fg text-fg focus-visible:ring-spaarke-blue inline-flex items-center justify-between gap-3 rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 " +
              (page ? "px-4 py-2.5 text-sm" : "px-3 py-2 text-[13px]")
            }
          >
            <span>Ask {ASK_PROVIDER_LABEL[p]}</span>
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        ))}
      </div>
      <p className="text-fg-low mt-3 text-[12px] leading-snug" aria-live="polite">
        {copied
          ? `Prompt copied. If ${ASK_PROVIDER_LABEL[copied]} opens without it, paste it in.`
          : "Clicking also copies the prompt, in case your assistant opens empty."}
      </p>
    </section>
  );
}
