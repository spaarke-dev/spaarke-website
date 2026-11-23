import type { ReactNode } from "react";
import { EstimateProvider } from "@/components/services/estimate/state";

/**
 * /services segment layout. `modal` is the parallel slot that shows
 * /services/estimate as a modal when it is reached from /services (task 070).
 * The provider keeps one set of estimate inputs for the section and the
 * modal.
 */
export default function ServicesLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  return (
    <EstimateProvider>
      {children}
      {modal}
    </EstimateProvider>
  );
}
