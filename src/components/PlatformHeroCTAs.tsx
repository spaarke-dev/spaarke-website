"use client";

import { useState } from "react";
import { Button } from "@/components/primitives";
import { GetAccessModal } from "@/components/GetAccessModal";

/**
 * CTA cluster for the Platform hero. Owns the GetAccessModal state
 * so the rest of the hero (server component) doesn't need to.
 *
 * "Get access" opens the inline email-capture modal.
 * "Why Spaarke" links to /why-spaarke as before.
 */
export function PlatformHeroCTAs() {
  const [accessOpen, setAccessOpen] = useState(false);

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button variant="primary" onClick={() => setAccessOpen(true)}>
          Get access
        </Button>
        <Button variant="text" href="/why-spaarke" arrow>
          Why Spaarke
        </Button>
      </div>
      <GetAccessModal
        open={accessOpen}
        onClose={() => setAccessOpen(false)}
      />
    </>
  );
}
