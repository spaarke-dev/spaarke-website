"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
};

/**
 * Three-button share row: Copy link, X (Twitter), LinkedIn.
 * Compact icon-only buttons that match the rest of the site's chrome.
 */
export function ArticleShare({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — fall back silently.
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const buttonClass =
    "border-line hover:border-fg hover:text-fg text-fg-mid focus-visible:ring-spaarke-blue inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2";

  return (
    <div className="flex items-center gap-3">
      <span className="text-fg-low text-xs font-medium uppercase tracking-wider">
        Share
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className={buttonClass}
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M5 12l5 5L20 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on X"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on LinkedIn"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      </a>
    </div>
  );
}
