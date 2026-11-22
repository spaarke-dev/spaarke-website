import { EstimateModal } from "@/components/services/estimate/EstimateModal";
import { fromQuery } from "@/components/services/estimate/query";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * /services/estimate reached from /services ("See the details"): shown as a
 * modal over the page. A reload or a direct link renders the full page in
 * src/app/services/estimate/page.tsx instead.
 */
export default async function EstimateIntercepted({ searchParams }: Props) {
  return <EstimateModal initial={fromQuery(await searchParams)} />;
}
