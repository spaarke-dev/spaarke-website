import type { SocialPlatform } from "@/content/footer";

/**
 * Inline brand-icon SVGs for footer social links. Sized at 16px by
 * default to sit inside a small icon button. currentColor inherits
 * from the parent so the icons recolor on hover via Tailwind.
 */
export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const props = {
    "aria-hidden": true,
    focusable: false,
    className: className ?? "h-4 w-4",
    viewBox: "0 0 24 24",
    fill: "currentColor",
  } as const;

  switch (platform) {
    case "linkedin":
      return (
        <svg {...props}>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    case "x":
      return (
        <svg {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
        </svg>
      );
    case "medium":
      return (
        <svg {...props}>
          <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
      );
    case "bluesky":
      return (
        <svg {...props}>
          <path d="M5.203 3.337C7.96 5.405 10.928 9.598 12 11.85c1.072-2.252 4.04-6.445 6.797-8.513 1.99-1.491 5.203-2.645 5.203.99 0 .727-.417 6.105-.66 6.978-.847 3.04-3.94 3.815-6.69 3.346 4.81.82 6.035 3.532 3.39 6.243-5.022 5.15-7.218-1.292-7.78-2.943-.103-.303-.151-.444-.152-.323 0-.121-.048.02-.151.323-.563 1.65-2.758 8.093-7.78 2.943-2.645-2.71-1.42-5.423 3.39-6.243-2.75.469-5.844-.305-6.69-3.346C.585 9.443.167 4.064.167 3.337c0-3.635 3.213-2.481 5.036-.99z" />
        </svg>
      );
  }
}
