import type { Metadata } from "next";
import DocumentPage from "../DocumentPage";
import { BRIEF, CHECKLIST } from "../documents";

export const metadata: Metadata = {
  title: CHECKLIST.title,
  description: CHECKLIST.description,
};

export default function AcceleratorReadinessChecklist() {
  return <DocumentPage doc={CHECKLIST} other={BRIEF} />;
}
