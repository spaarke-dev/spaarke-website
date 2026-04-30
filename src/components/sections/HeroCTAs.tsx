"use client";

import { useState } from "react";
import { Button } from "@/components/primitives";
import { WatchDemoModal } from "@/components/WatchDemoModal";
import type { HeroCTA } from "@/content/home/hero";

type Props = {
  ctas: readonly [HeroCTA, HeroCTA];
};

/**
 * Client-component CTA cluster for the hero. Owns the demo modal state
 * so the rest of the hero (heading, subhead, screenshot) can stay as a
 * Server Component.
 */
export function HeroCTAs({ ctas }: Props) {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        {ctas.map((cta) => {
          if (cta.action === "open-demo-modal") {
            return (
              <Button
                key={cta.label}
                variant={cta.variant}
                onClick={() => setDemoOpen(true)}
              >
                {cta.label}
              </Button>
            );
          }
          return (
            <Button key={cta.label} variant={cta.variant} href={cta.href}>
              {cta.label}
            </Button>
          );
        })}
      </div>
      <WatchDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
