import { redirect } from "next/navigation";
import { DEFAULT_TOUR_SLUG } from "@/content/tours/registry";

export default function TourIndex() {
  redirect(`/tour/${DEFAULT_TOUR_SLUG}`);
}
