"use client";

import { useEffect } from "react";
import { Button, PageHeader, Shell, Slab } from "@/components/primitives";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to console for now — Application Insights pickup happens automatically
    // for unhandled errors via the existing instrumentation.
    console.error(error);
  }, [error]);

  return (
    <Slab tone="dark">
      <Shell>
        <PageHeader
          eyebrow="Something went wrong"
          title="An unexpected error occurred."
          lede="Please try again. If the issue persists, contact us and we'll dig in."
        />

        <div className="mt-12 flex flex-wrap gap-4">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Button variant="outline" href="/">
            Back home
          </Button>
          <Button variant="text" href="/contact" arrow>
            Contact us
          </Button>
        </div>

        {error.digest && (
          <p className="text-fg-low font-mono-display mt-8 text-xs">
            Reference: {error.digest}
          </p>
        )}
      </Shell>
    </Slab>
  );
}
