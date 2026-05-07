import type { Tour } from "./types";
import { matterManagement } from "./full-walkthrough/matter-management";
import { documentsEmail } from "./full-walkthrough/documents-email";
import { collaboration } from "./full-walkthrough/collaboration";
import { aiAutomation } from "./full-walkthrough/ai-automation";
import { spendPerformance } from "./full-walkthrough/spend-performance";

export const fullWalkthrough: Tour = {
  slug: "full-walkthrough",
  title: "Spaarke product tour",
  description:
    "A guided walkthrough of the Spaarke platform across matter management, documents, collaboration, AI, and spend.",
  sections: [
    matterManagement,
    documentsEmail,
    collaboration,
    aiAutomation,
    spendPerformance,
  ],
};
