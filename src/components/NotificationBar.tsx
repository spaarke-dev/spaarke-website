"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "notification-dismissed";

export default function NotificationBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if not previously dismissed
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div className="relative z-10 flex w-full items-center justify-center bg-neutral-200 px-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
      style={{ minHeight: "36px", padding: "6px 2.5rem 6px 1rem" }}
    >
      <p className="text-center text-sm leading-snug">
        Now accepting early access partners&nbsp;&mdash;&nbsp;
        <Link
          href="/contact"
          className="font-medium underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          request access today
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        aria-label="Dismiss notification"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
