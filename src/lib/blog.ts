import fs from "fs";
import path from "path";
import matter from "gray-matter";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Structured tag categories for article classification. */
export type TagCategories = {
  organization: string[];
  function: string[];
  topic: string[];
  theme: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  summary?: string;
  date: string;
  posted?: string;
  author: string;
  tags: TagCategories;
  draft: boolean;
  heroImage?: string;
  /** Display order for homepage cards. Lower numbers appear first. Posts without order sort after ordered posts by date. */
  order?: number;
  content: string;
};

export type BlogPostMeta = Omit<BlogPost, "content">;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Derive a URL-friendly slug from the MDX filename. */
function fileNameToSlug(fileName: string): string {
  return fileName.replace(/\.mdx$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

/** Empty tag categories. */
function emptyTags(): TagCategories {
  return { organization: [], function: [], topic: [], theme: [] };
}

/**
 * Normalize tags from frontmatter.
 * Supports both structured (object with categories) and flat (string array) formats.
 * Flat arrays are treated as theme tags for backward compatibility.
 */
function normalizeTags(raw: unknown): TagCategories {
  if (!raw) return emptyTags();

  // Flat array — legacy format: treat all as theme tags
  if (Array.isArray(raw)) {
    return {
      ...emptyTags(),
      theme: raw.filter((t): t is string => typeof t === "string"),
    };
  }

  // Structured object
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    const toArr = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((t): t is string => typeof t === "string") : [];

    return {
      organization: toArr(obj.organization),
      function: toArr(obj.function),
      topic: toArr(obj.topic),
      theme: toArr(obj.theme),
    };
  }

  return emptyTags();
}

/** Flatten structured tags into a single string array (for SEO, RSS, etc.). */
export function flattenTags(tags: TagCategories): string[] {
  return [
    ...tags.organization,
    ...tags.function,
    ...tags.topic,
    ...tags.theme,
  ];
}

/** Validate that required frontmatter fields are present. */
function validateFrontmatter(
  data: Record<string, unknown>,
  fileName: string,
): boolean {
  const required = ["title", "description", "date", "author", "tags"] as const;
  let valid = true;

  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      console.warn(
        `[blog] Missing required frontmatter field "${field}" in ${fileName}`,
      );
      valid = false;
    }
  }

  return valid;
}

/** Build a BlogPostMeta from parsed frontmatter. */
function buildMeta(
  slug: string,
  data: Record<string, unknown>,
): BlogPostMeta {
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    summary: (data.summary as string) ?? undefined,
    date: data.date as string,
    posted: (data.posted as string) ?? undefined,
    author: data.author as string,
    tags: normalizeTags(data.tags),
    draft: data.draft === true,
    heroImage: (data.heroImage as string) ?? undefined,
    order: typeof data.order === "number" ? data.order : undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** Return metadata for every published (non-draft) blog post, sorted by date descending. */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const posts: BlogPostMeta[] = [];

  for (const fileName of files) {
    const filePath = path.join(BLOG_DIR, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    if (!validateFrontmatter(data, fileName)) {
      continue;
    }

    if (data.draft === true) {
      continue;
    }

    posts.push(buildMeta(fileNameToSlug(fileName), data));
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/** Return a single post (with raw MDX content) by slug, or null if not found. */
export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) {
    return null;
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"));

  for (const fileName of files) {
    if (fileNameToSlug(fileName) !== slug) {
      continue;
    }

    const filePath = path.join(BLOG_DIR, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (!validateFrontmatter(data, fileName)) {
      return null;
    }

    return {
      ...buildMeta(slug, data),
      content,
    };
  }

  return null;
}

/** Return a sorted array of unique tags across all published posts, organized by category. */
export function getAllTags(): TagCategories {
  const posts = getAllPosts();
  const result = emptyTags();

  for (const post of posts) {
    for (const cat of Object.keys(result) as (keyof TagCategories)[]) {
      for (const tag of post.tags[cat]) {
        if (!result[cat].includes(tag)) {
          result[cat].push(tag);
        }
      }
    }
  }

  for (const cat of Object.keys(result) as (keyof TagCategories)[]) {
    result[cat].sort();
  }

  return result;
}

/** Return a flat sorted array of all unique tags (for backward compatibility). */
export function getAllTagsFlat(): string[] {
  const tags = getAllTags();
  const all = new Set(flattenTags(tags));
  return Array.from(all).sort();
}
