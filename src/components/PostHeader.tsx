"use client";

import Image from "next/image";
import { CalendarLtr20Regular, Person20Regular } from "@fluentui/react-icons";
import type { BlogPostMeta } from "@/lib/blog";
import TagPills from "@/components/TagPills";

type PostHeaderProps = {
  post: BlogPostMeta;
};

export default function PostHeader({ post }: PostHeaderProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarLtr20Regular className="h-4 w-4" />
          <time dateTime={post.date}>{formattedDate}</time>
        </span>
        <span className="flex items-center gap-1.5">
          <Person20Regular className="h-4 w-4" />
          {post.author}
        </span>
      </div>

      {/* Summary block — the "Why This Matters" tl;dr for SEO + AI extraction */}
      {post.summary && (
        <div
          data-summary
          className="mt-6 rounded-lg border border-border bg-muted/50 px-6 py-5"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Why This Matters
          </p>
          <p className="mt-2 text-base leading-relaxed text-foreground/90">
            {post.summary}
          </p>
        </div>
      )}

      <div className="mt-5">
        <TagPills tags={post.tags} variant="full" />
      </div>

      {post.heroImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    </header>
  );
}
