import type { Metadata } from "next";
import { Eyebrow, Heading, Lede, Shell } from "@/components/primitives";
import { deptEstimate, estimate } from "@/app/services/content";
import { EstimateView } from "@/components/services/estimate/EstimateView";
import { parseEstimateQuery } from "@/components/services/estimate/query";

export const metadata: Metadata = {
  title: "MSO value estimate",
  description: estimate.lede,
  // Draft, like /services: kept out of search until counsel review (task 051).
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * /services/estimate: the MSO value estimate as a page of its own, with the
 * calculator and "How the estimate works", for a law firm or, with
 * `?audience=corporate`, a legal department (task 071). Inputs come from the
 * query string (see query.ts); the mid-size preset otherwise.
 * From /services the same route opens as a modal (src/app/services/@modal).
 */
export default async function EstimatePage({ searchParams }: Props) {
  const q = parseEstimateQuery(await searchParams);
  const copy = q.audience === "corporate" ? deptEstimate : estimate;
  return (
    <>
      {/* One light theme for the whole page (value page row 18). */}
      <section
        data-tone="light"
        className="bg-bg text-fg relative overflow-hidden pb-6 pt-[clamp(72px,10vh,120px)]"
        style={{ backgroundColor: "#f6f6f4" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 75% 60% at 30% 40%, rgba(80,120,220,0.10) 0%, rgba(80,120,220,0.04) 40%, transparent 75%)",
          }}
        />
        <Shell className="relative">
          <Eyebrow>MSO value estimate</Eyebrow>
          <Heading level={1} className="mt-5 max-w-4xl text-balance">
            {copy.title}
          </Heading>
          <div className="mt-6 max-w-3xl">
            <Lede>{copy.lede}</Lede>
          </div>
        </Shell>
      </section>
      <section data-tone="light" className="bg-bg text-fg pb-[clamp(56px,8vh,96px)] pt-10" style={{ backgroundColor: "#f6f6f4" }}>
        <Shell>
          <EstimateView {...q} />
        </Shell>
      </section>
    </>
  );
}
