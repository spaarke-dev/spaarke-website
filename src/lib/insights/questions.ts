import { articleBySlug } from "@/lib/corpus";

/**
 * The entry card's suggested questions.
 *
 * The three questions are generated once by
 * `scripts/generate-suggested-questions.ts`, reviewed by hand, and committed as
 * data. Nothing here calls a model, because a reader who opens the console has
 * not asked anything yet and should not cost anything.
 *
 * Ordering is enforced here rather than left to the component. Summarize is
 * offered fourth, always, because an entry card that leads with summarize is a
 * machine for teaching readers not to read the article (spec FR-04).
 */

/** Relative to the repository root, for the generator and the manifest build. */
export const QUESTIONS_FILE = "content/insights/suggested-questions.json";

export const SUMMARIZE_LABEL = "Summarize this article, with links to the sections";

export type EntryOption =
  | { kind: "question"; text: string }
  | { kind: "summarize"; text: string };

/**
 * What the entry card offers, in the order it offers it. An article with no
 * generated questions yields summarize alone rather than blocking: a missing
 * nicety must not stop an article from publishing, and the console renders no
 * chips when there are none to render.
 */
export function entryOptions(slug: string): EntryOption[] {
  const article = articleBySlug(slug);
  const questions = article?.suggestedQuestions ?? [];
  return [
    ...questions.map((text) => ({ kind: "question" as const, text })),
    { kind: "summarize" as const, text: SUMMARIZE_LABEL },
  ];
}

const MIN_WORDS = 6;
const MAX_WORDS = 24;

/**
 * The rules a generated question has to pass before it is written to disk. Same
 * dash rules as scripts/voice-lint.mjs, since this is reader-facing copy.
 */
export function validateQuestion(question: string): string[] {
  const problems: string[] = [];
  const words = question.trim().split(/\s+/).length;

  if (!question.trim().endsWith("?")) problems.push("not a question");
  if (words < MIN_WORDS) problems.push(`too short at ${words} words`);
  if (words > MAX_WORDS) problems.push(`too long at ${words} words`);
  if (/—|[ ]–[ ]|(?<=[A-Za-z0-9])[ ]--[ ]|(?<=[A-Za-z0-9,)])[ ]-[ ](?=[A-Za-z0-9(])/.test(question)) {
    problems.push("contains a dash");
  }
  if (/\b(summar|overview|key takeaways|tl;?dr)/i.test(question)) {
    problems.push("asks for a summary, which the fourth option already offers");
  }
  if (/\b(unpack|deep[- ]?dive|leverage|synerg|at a high level|holistic)/i.test(question)) {
    problems.push("consultant filler");
  }
  return problems;
}
