import Link from "next/link";

const articles: Record<string, { title: string; excerpt: string }> = {
  "raising-the-iq-of-legal-work": {
    title: "Raising the IQ of Legal Work",
    excerpt:
      "Work IQ is a three-part stack: Data, Memory, and Inference. Data captures how work gets done — every interaction, document, and decision. Memory retains context so that knowledge compounds. Inference turns raw signals into actionable insights.",
  },
  "the-case-for-unified-legal-data": {
    title: "The Case for Unified Legal Data",
    excerpt:
      "Fragmented systems create blind spots. Unifying matter, spend, and workflow data into a single platform unlocks visibility that siloed tools simply cannot provide.",
  },
  "from-reactive-to-predictive-operations": {
    title: "From Reactive to Predictive Operations",
    excerpt:
      "Most legal departments operate reactively. Intelligence-driven operations shift the paradigm — anticipating workload, forecasting spend, and surfacing risk before it materializes.",
  },
  "operational-memory-for-legal-teams": {
    title: "Operational Memory for Legal Teams",
    excerpt:
      "Institutional knowledge walks out the door every time someone leaves. Operational memory captures decisions, context, and rationale so teams build on what came before.",
  },
  "intelligent-workflow-automation": {
    title: "Intelligent Workflow Automation",
    excerpt:
      "Automation without intelligence just moves tasks faster. Intelligent workflows adapt to context, route work based on patterns, and surface the right information at the right time.",
  },
  "matter-lifecycle-intelligence": {
    title: "Matter Lifecycle Intelligence",
    excerpt:
      "Every matter follows a lifecycle. Intelligence surfaces patterns across matters that improve outcomes, reduce cycle times, and optimize resource allocation over time.",
  },
  "legal-spend-analytics": {
    title: "Legal Spend Analytics",
    excerpt:
      "Move beyond accruals and invoices. Understand the true cost of legal operations at every level — by matter type, law firm, practice area, and business unit.",
  },
  "ai-powered-document-understanding": {
    title: "AI-Powered Document Understanding",
    excerpt:
      "Transform unstructured legal documents into structured, searchable, actionable intelligence. Surface clauses, obligations, and risks automatically.",
  },
  "cross-functional-legal-collaboration": {
    title: "Cross-Functional Legal Collaboration",
    excerpt:
      "Legal doesn't operate in a vacuum. Break down silos between legal, finance, and business teams with shared workspaces and transparent workflows.",
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // For static generation, use a simple approach
  return {
    title: "Spaarke | Article",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          <Link href="/" className="mt-4 inline-block text-hero-red hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>
      <h1 className="text-4xl font-bold leading-tight text-foreground">
        {article.title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {article.excerpt}
      </p>
      <div className="mt-12 rounded-lg border border-border bg-muted/20 p-12 text-center text-muted-foreground">
        Full article content coming soon.
      </div>
    </article>
  );
}
