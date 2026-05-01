"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarLtr20Regular } from "@fluentui/react-icons";
import type { BlogPostMeta } from "@/lib/blog";
import TagPills from "@/components/TagPills";

type PostCardProps = {
  post: BlogPostMeta;
  variant?: "list" | "portrait";
};

export default function PostCard({ post, variant = "list" }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (variant === "portrait") {
    return (
      <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
        <Link href={`/why-spaarke/${post.slug}`} className="flex h-full flex-col">
          {/* Top row: small image + title/meta block */}
          <div className="flex gap-6 sm:gap-7">
            {/* Image / gradient thumbnail — small accent, not the focal point */}
            <div
              className="relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-md sm:w-28"
              style={{
                background: post.heroImage
                  ? undefined
                  : "linear-gradient(135deg, #1a1f3a 0%, #2d1f5e 50%, #4a1f4f 100%)",
              }}
            >
              {post.heroImage ? (
                <Image
                  src={post.heroImage}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,91,255,0.35) 0%, rgba(255,77,203,0.18) 40%, rgba(0,0,0,0) 75%)",
                  }}
                />
              )}
            </div>

            {/* Title + date + author */}
            <div className="flex min-w-0 flex-1 flex-col pr-12 sm:pr-16 lg:pr-24">
              <h3
                className="text-foreground group-hover:text-primary font-semibold leading-snug tracking-tight"
                style={{ fontSize: "clamp(18px, 1.3vw, 22px)" }}
              >
                {post.title}
              </h3>
              <div
                className="text-muted-foreground mt-2 flex items-center gap-1.5"
                style={{ fontSize: "clamp(13px, 0.85vw, 15px)" }}
              >
                <CalendarLtr20Regular className="h-3.5 w-3.5" />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>
              <p
                className="text-muted-foreground mt-1"
                style={{ fontSize: "clamp(13px, 0.85vw, 15px)" }}
              >
                {post.author}
              </p>
            </div>
          </div>

          {/* Summary — full width below the image row */}
          <p
            className="text-muted-foreground mt-5 leading-relaxed line-clamp-5"
            style={{ fontSize: "clamp(15px, 1vw, 17px)" }}
          >
            {post.summary ?? post.description}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article className="group rounded-xl border border-border bg-background p-6 transition-colors hover:border-foreground/20">
      <Link href={`/why-spaarke/${post.slug}`} className="block">
        <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary">
          {post.title}
        </h2>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarLtr20Regular className="h-4 w-4" />
          <time dateTime={post.date}>{formattedDate}</time>
        </div>

        <p className="mt-3 text-muted-foreground">
          {post.summary ?? post.description}
        </p>

        <div className="mt-4">
          <TagPills tags={post.tags} />
        </div>
      </Link>
    </article>
  );
}
