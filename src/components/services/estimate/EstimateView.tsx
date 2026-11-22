"use client";

import { useEffect, useState } from "react";
import type { EstimateInputs } from "./model";
import { EstimateCalculator } from "./EstimateCalculator";
import { EstimateDetails } from "./EstimateDetails";
import { useEstimateInputs } from "./state";
import { DETAILS_ANCHOR, ESTIMATE_PATH, toQuery } from "./query";

/**
 * The whole estimate on its own: calculator, then "How the estimate works".
 * Rendered by /services/estimate and by the modal that intercepts it. Inputs
 * from the query string win on arrival; after that, every change is written
 * back to the query string so the page can be reloaded or shared.
 */
export function EstimateView({ initial }: { initial: EstimateInputs | null }) {
  const { inputs, setInputs } = useEstimateInputs();
  const [ready, setReady] = useState(initial === null);

  useEffect(() => {
    if (initial) setInputs(initial);
    setReady(true);
    // Arrival only: later changes come from the controls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = ready ? inputs : (initial ?? inputs);

  useEffect(() => {
    if (!ready || window.location.pathname !== ESTIMATE_PATH) return;
    const url = `${ESTIMATE_PATH}?${toQuery(current)}`;
    if (window.location.pathname + window.location.search !== url) window.history.replaceState(null, "", url);
  }, [ready, current]);

  return (
    <div className="space-y-16 md:space-y-20">
      <EstimateCalculator inputs={current} onChange={setInputs} detailsHref={`#${DETAILS_ANCHOR}`} />
      <EstimateDetails inputs={current} />
    </div>
  );
}
