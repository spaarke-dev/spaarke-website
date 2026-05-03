/**
 * Section — Built natively on Microsoft.
 *
 * Trust-signal section between the LOI mockup and the Closing CTA.
 * Two-column layout: heading on the left, lede on the right. Light
 * blue background using the fade-effect palette.
 */

export type MicrosoftNativeContent = {
  heading: { line1: string; line2: string };
  intro: string;
};

export const microsoftNativeContent: MicrosoftNativeContent = {
  heading: {
    line1: "Built natively on Microsoft.",
    line2: "Designed for Legal IQ.",
  },
  intro:
    "Spaarke connects legal work across your Microsoft environment—so Copilot can understand the full context of legal operations.",
};
