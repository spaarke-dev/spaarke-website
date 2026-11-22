"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { PRESETS, type EstimateInputs } from "./model";

/**
 * One set of estimate inputs for the /services segment. The provider sits in
 * src/app/services/layout.tsx, so the section on /services and the details
 * modal (an intercepted /services/estimate) show the same firm and stay in
 * sync both ways. No cookies or storage: the inputs live in state and, on the
 * details page, in the query string.
 */

type Ctx = { inputs: EstimateInputs; setInputs: (v: EstimateInputs) => void };

const EstimateContext = createContext<Ctx | null>(null);

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<EstimateInputs>(PRESETS.mid);
  return <EstimateContext.Provider value={{ inputs, setInputs }}>{children}</EstimateContext.Provider>;
}

export function useEstimateInputs(): Ctx {
  const ctx = useContext(EstimateContext);
  if (!ctx) throw new Error("useEstimateInputs must be used inside EstimateProvider");
  return ctx;
}
