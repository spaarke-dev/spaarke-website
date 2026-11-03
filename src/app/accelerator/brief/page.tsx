import type { Metadata } from "next";
import DocumentPage from "../DocumentPage";
import { BRIEF, CHECKLIST } from "../documents";

export const metadata: Metadata = {
  title: BRIEF.title,
  description: BRIEF.description,
};

export default function AcceleratorBrief() {
  return <DocumentPage doc={BRIEF} other={CHECKLIST} />;
}
