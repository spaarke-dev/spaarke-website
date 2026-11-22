"use client";

import { useEffect, useState } from "react";
import type { EstimateInputs } from "./model";
import type { DeptInputs } from "./dept-model";
import { EstimateCalculator } from "./EstimateCalculator";
import { EstimateDetails } from "./EstimateDetails";
import { DeptCalculator } from "./DeptCalculator";
import { DeptDetails } from "./DeptDetails";
import { useEstimateInputs } from "./state";
import { DETAILS_ANCHOR, ESTIMATE_PATH, toDeptQuery, toQuery, type EstimateAudience } from "./query";

/**
 * The whole estimate on its own: calculator, then "How the estimate works",
 * for a law firm or a legal department. Rendered by /services/estimate and
 * by the modal that intercepts it. Inputs from the query string win on
 * arrival; after that, every change is written back to the query string so
 * the page can be reloaded or shared.
 */
export function EstimateView({
  audience,
  firm,
  dept,
}: {
  audience: EstimateAudience;
  firm: EstimateInputs | null;
  dept: DeptInputs | null;
}) {
  return audience === "corporate" ? <DeptView initial={dept} /> : <FirmView initial={firm} />;
}

/**
 * Arrival from the URL, then URL sync: until the shared state has taken the
 * query string's inputs, render those, so the first paint is already right.
 */
function useSynced<T>(initial: T | null, value: T, set: (v: T) => void, query: (v: T) => string) {
  const [ready, setReady] = useState(initial === null);
  useEffect(() => {
    if (initial) set(initial);
    setReady(true);
    // Arrival only: later changes come from the controls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const current = ready ? value : (initial ?? value);
  const qs = query(current);
  useEffect(() => {
    if (!ready || window.location.pathname !== ESTIMATE_PATH) return;
    if (window.location.search !== `?${qs}`) window.history.replaceState(null, "", `${ESTIMATE_PATH}?${qs}`);
  }, [ready, qs]);
  return current;
}

function FirmView({ initial }: { initial: EstimateInputs | null }) {
  const { firm, setFirm } = useEstimateInputs();
  const current = useSynced(initial, firm, setFirm, toQuery);
  return (
    <div className="space-y-16 md:space-y-20">
      <EstimateCalculator inputs={current} onChange={setFirm} detailsHref={`#${DETAILS_ANCHOR}`} />
      <EstimateDetails inputs={current} />
    </div>
  );
}

function DeptView({ initial }: { initial: DeptInputs | null }) {
  const { dept, setDept } = useEstimateInputs();
  const current = useSynced(initial, dept, setDept, toDeptQuery);
  return (
    <div className="space-y-16 md:space-y-20">
      <DeptCalculator inputs={current} onChange={setDept} detailsHref={`#${DETAILS_ANCHOR}`} />
      <DeptDetails inputs={current} />
    </div>
  );
}
