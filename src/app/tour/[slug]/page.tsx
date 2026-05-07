import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOURS, getTour } from "@/content/tours/registry";
import { TourShell } from "@/components/tour/TourShell";

export const metadata: Metadata = {
  title: "Product tour",
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return Object.keys(TOURS).map((slug) => ({ slug }));
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();
  return (
    <main className="bg-[#0a0a0a] min-h-screen py-8 md:py-12">
      <Suspense>
        <TourShell tour={tour} />
      </Suspense>
    </main>
  );
}
