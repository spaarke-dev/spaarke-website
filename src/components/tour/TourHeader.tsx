"use client";

import { Button } from "@/components/primitives";
import type { SectionId, TourSection } from "@/content/tours/types";

type Props = {
  sections: TourSection[];
  activeSectionId: SectionId;
  onSectionClick: (id: SectionId) => void;
};

const sectionButtonBaseClasses =
  "shrink-0 rounded-full px-4 md:px-6 py-2 text-[13px] md:text-[14px] " +
  "font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]";

const sectionButtonDefaultClasses =
  "border-dashed border-[1.5px] border-white/30 text-white/80 " +
  "hover:border-white/60 hover:text-white";

const sectionButtonActiveClasses =
  "border-solid border-[1.5px] border-[#5078DC] bg-[#5078DC] text-white";

export function TourHeader({
  sections,
  activeSectionId,
  onSectionClick,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#0a0a0a] rounded-t-2xl px-6 md:px-10 pt-6 pb-4">
      <div
        className="flex items-center gap-3 overflow-x-auto"
        style={{ touchAction: "pan-x" }}
      >
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          const className = [
            sectionButtonBaseClasses,
            isActive
              ? sectionButtonActiveClasses
              : sectionButtonDefaultClasses,
          ].join(" ");

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionClick(section.id)}
              className={className}
              aria-current={isActive ? "page" : undefined}
            >
              {section.label}
            </button>
          );
        })}
      </div>
      <div className="shrink-0">
        <Button variant="primary" href="/access-request">
          Get access
        </Button>
      </div>
    </div>
  );
}
