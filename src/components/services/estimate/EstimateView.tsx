"use client";

import { useEffect, useState } from "react";
import { estimate as copy } from "@/app/services/content";
import { StructureDiagram } from "../StructureDiagram";
import { ClosingCta, MUTED } from "./parts";
import type { EstimateInputs } from "./model";
import type { DeptInputs } from "./dept-model";
import { EstimateCalculator } from "./EstimateCalculator";
import { EstimateDetails } from "./EstimateDetails";
import { DeptCalculator } from "./DeptCalculator";
import { DeptDetails } from "./DeptDetails";
import { useEstimateInputs } from "./state";
import { DETAILS_ANCHOR, ESTIMATE_PATH, toDeptQuery, toQuery, type EstimateAudience } from "./query";

/**
 * The whole estimate on its own, for a law firm or a legal department. The
 * law firm order follows the value page change list (row 16, 2026-11-22):
 * calculator, the structure diagram, "How the estimate works" (with today vs
 * with the MSO and the assumptions), then the closing call to action. Rendered by /services/estimate and
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
      <section aria-labelledby="estimate-structure-title">
        <h2
          id="estimate-structure-title"
          className="font-display text-fg text-[clamp(28px,3.4vw,40px)] font-medium tracking-[-0.02em]"
        >
          {copy.structure.title}
        </h2>
        <p className={`${MUTED} mt-3 max-w-3xl text-[16px] leading-relaxed`}>{copy.structure.caption}</p>
        <div className="mt-6">
          <StructureDiagram audience="firm" tone="light" sharesHref={`#${copy.details.equityCard.id}`} />
        </div>
      </section>
      <EstimateDetails inputs={current} />
      <ClosingCta {...copy.closing} />
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
