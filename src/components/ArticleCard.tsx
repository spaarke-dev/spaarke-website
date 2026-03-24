"use client";

import { useState } from "react";
import Link from "next/link";
import { Open24Regular } from "@fluentui/react-icons";

export interface ArticleCardProps {
  title: string;
  excerpt: string;
  href?: string;
  popoverContent?: string;
}

export default function ArticleCard({
  title,
  excerpt,
  href,
  popoverContent,
}: ArticleCardProps) {
  const [showPopover, setShowPopover] = useState(false);

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-hero-red">{title}</h3>
        <Open24Regular className="mt-0.5 flex-shrink-0 text-muted-foreground" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {excerpt}
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block rounded-lg border border-border bg-background p-5 shadow-sm transition-all hover:shadow-md hover:border-foreground/20"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className="relative cursor-default rounded-lg border border-border bg-background p-5 shadow-sm transition-all hover:shadow-md hover:border-foreground/20"
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      {cardContent}
      {showPopover && popoverContent && (
        <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border border-border bg-background p-4 shadow-lg">
          <p className="text-sm leading-relaxed text-foreground">
            {popoverContent}
          </p>
        </div>
      )}
    </div>
  );
}
