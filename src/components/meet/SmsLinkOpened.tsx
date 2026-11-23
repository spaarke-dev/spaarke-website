"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { PlausibleProps } from "@/types/plausible";

/**
 * Rendered on /meet when the address carried a text link token (`c`). On
 * load it removes `c` from the address bar, keeping any other parameters, so
 * a copied or bookmarked URL does not carry the token; when the server
 * verified the token it also sends the Plausible event. Spec FR-16.
 */
export function SmsLinkOpened({ verified, code }: { verified: boolean; code?: string | null }) {
  // Once per page load, even when React runs the effect twice in development.
  const sent = useRef(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("c")) {
      url.searchParams.delete("c");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }

    if (!verified || sent.current) return;
    const props: PlausibleProps = { source: "sms" };
    if (code) props.code = code;
    // The Plausible snippet loads after hydration, so wait briefly for it.
    let tries = 0;
    const send = () => {
      if (typeof window.plausible === "function") {
        sent.current = true;
        track("Meeting Link Opened", props);
      } else if (++tries < 20) timer = window.setTimeout(send, 250);
    };
    let timer = window.setTimeout(send, 0);
    return () => window.clearTimeout(timer);
  }, [verified, code]);

  return null;
}
