"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { DEFAULT_INPUTS, type EstimateInputs } from "./model";
import { DEPT_DEFAULT_INPUTS, type DeptInputs } from "./dept-model";

/**
 * One set of estimate inputs per audience for the /services segment. The
 * provider sits in src/app/services/layout.tsx, so the section on /services
 * and the details modal (an intercepted /services/estimate) show the same firm
 * or department and stay in sync both ways. No cookies or storage: the inputs
 * live in state and, on the details page, in the query string.
 */

type Ctx = {
  firm: EstimateInputs;
  setFirm: (v: EstimateInputs) => void;
  dept: DeptInputs;
  setDept: (v: DeptInputs) => void;
};

const EstimateContext = createContext<Ctx | null>(null);

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [firm, setFirm] = useState<EstimateInputs>(DEFAULT_INPUTS);
  const [dept, setDept] = useState<DeptInputs>(DEPT_DEFAULT_INPUTS);
  return <EstimateContext.Provider value={{ firm, setFirm, dept, setDept }}>{children}</EstimateContext.Provider>;
}

export function useEstimateInputs(): Ctx {
  const ctx = useContext(EstimateContext);
  if (!ctx) throw new Error("useEstimateInputs must be used inside EstimateProvider");
  return ctx;
}
