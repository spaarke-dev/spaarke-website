import type { Metadata } from "next";
import { Eyebrow, Heading, Lede, Shell } from "@/components/primitives";
import { estimate } from "@/app/services/content";
import { EstimateView } from "@/components/services/estimate/EstimateView";
import { fromQuery } from "@/components/services/estimate/query";

export const metadata: Metadata = {
  title: "MSO value estimate",
  description: estimate.lede,
  // Draft, like /services: kept out of search until counsel review (task 051).
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * /services/estimate: the MSO value estimate as a page of its own, with the
 * calculator and "How the estimate works". Inputs come from the query string
 * (`?partners=5&attorneys=7&revenue=9000000`); the mid-size preset otherwise.
 * From /services the same route opens as a modal (src/app/services/@modal).
 */
export default async function EstimatePage({ searchParams }: Props) {
  const initial = fromQuery(await searchParams);
  return (
    <>
      <section data-tone="dark" className="bg-bg text-fg relative overflow-hidden pb-16 pt-[clamp(120px,16vh,180px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 75% 60% at 30% 50%, rgba(130,165,235,0.18) 0%, rgba(80,120,220,0.08) 35%, rgba(130,165,235,0.03) 60%, transparent 78%)",
          }}
        />
        <Shell className="relative">
          <Eyebrow>MSO value estimate</Eyebrow>
          <Heading level={1} className="mt-5 max-w-4xl text-balance">
            {estimate.title}
          </Heading>
          <div className="mt-6 max-w-3xl">
            <Lede>{estimate.lede}</Lede>
          </div>
        </Shell>
      </section>
      <section data-tone="light" className="bg-bg text-fg py-[clamp(56px,8vh,96px)]" style={{ backgroundColor: "#f6f6f4" }}>
        <Shell>
          <EstimateView initial={initial} />
        </Shell>
      </section>
    </>
  );
}
