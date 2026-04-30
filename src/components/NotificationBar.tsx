"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notificationBarContent } from "@/content/notification-bar";

const STORAGE_KEY = "spaarke-notification-dismissed-v2";

export default function NotificationBar() {
  // Render visible by default on SSR. Hydration-time check hides for users
  // who've dismissed previously (1-frame flash for returning users; new
  // visitors see no flash).
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      // localStorage unavailable — keep visible
    }
  }, []);

  function onDismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (dismissed) return null;

  return (
    <div className="bg-surface-2 border-line text-fg-mid relative border-b">
      <div className="px-[var(--spacing-shell-x)] py-2 text-center text-xs sm:text-sm">
        <span>{notificationBarContent.text}</span>
        <span className="mx-1.5">—</span>
        <Link
          href={notificationBarContent.cta.href}
          className="text-fg underline-offset-4 hover:underline"
        >
          {notificationBarContent.cta.label}
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-fg-low hover:text-fg focus-visible:ring-spaarke-blue absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-lg leading-none transition-colors focus-visible:outline-none focus-visible:ring-2"
        >
          ×
        </button>
      </div>
    </div>
  );
}
