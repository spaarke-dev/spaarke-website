"use client";

import { track } from "@/lib/analytics";

/**
 * Opens the Bookings page outside the embed. Bookings runs in an iframe, so
 * the site cannot see a booking being made; this click is the one signal we
 * get beyond the /meet pageview.
 */
export function BookingsNewTabLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("Meeting Booking New Tab")}
      className="text-cta-blue underline"
    >
      Open the booking page in a new tab
    </a>
  );
}
