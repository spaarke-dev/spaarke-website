import ArticleCard from "./ArticleCard";

const articles = [
  {
    title: "Raising the IQ of Legal Work",
    excerpt:
      'Work IQ is a three-part stack: Data, Memory, and Inference. Data captures how work gets done — every interaction, document, and decision. Memory retains context so that knowledge compounds. Inference turns raw signals into actionable insights.',
    featured: true,
    popoverContent:
      "Data captures how work gets done. Memory retains context so knowledge compounds over time. Inference turns raw signals into actionable insights that drive better decisions across the legal operations lifecycle.",
  },
  {
    title: "The Case for Unified Legal Data",
    excerpt:
      "Fragmented systems create blind spots. Unifying matter, spend, and workflow data into a single platform unlocks visibility that siloed tools simply cannot provide.",
    popoverContent:
      "When matter management, e-billing, and workflow data live in separate systems, critical patterns stay hidden. A unified data layer eliminates reconciliation overhead and surfaces cross-functional insights automatically.",
  },
  {
    title: "From Reactive to Predictive Operations",
    excerpt:
      "Most legal departments operate reactively. Intelligence-driven operations shift the paradigm — anticipating workload, forecasting spend, and surfacing risk before it materializes.",
    popoverContent:
      "Predictive operations use historical patterns and real-time signals to forecast demand, flag anomalies in outside counsel spend, and identify matters at risk of escalation — all before they become urgent.",
  },
  {
    title: "Operational Memory for Legal Teams",
    excerpt:
      "Institutional knowledge walks out the door every time someone leaves. Operational memory captures decisions, context, and rationale so teams build on what came before.",
    popoverContent:
      "Operational memory goes beyond document storage. It captures the reasoning behind decisions, the context of negotiations, and the lessons learned from prior matters — making every team member more effective.",
  },
  {
    title: "Intelligent Workflow Automation",
    excerpt:
      "Automation without intelligence just moves tasks faster. Intelligent workflows adapt to context, route work based on patterns, and surface the right information at the right time.",
    popoverContent:
      "Intelligent workflows learn from how your team actually operates. They adapt routing rules based on matter complexity, surface relevant precedents automatically, and flag exceptions that need human judgment.",
  },
];

export default function ArticlesSection() {
  const [featured, ...rest] = articles;

  return (
    <section id="articles" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="mb-12 text-3xl font-bold text-foreground sm:text-4xl">
        Raising the IQ of Legal Work
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Featured card — spans left column */}
        <div className="lg:row-span-2">
          <div className="h-full rounded-lg border border-border bg-background p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-hero-red">
              {featured.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {featured.excerpt}
            </p>
            <div className="mt-6 rounded-md bg-muted p-6">
              <span className="text-sm text-muted-foreground">image</span>
            </div>
          </div>
        </div>

        {/* Article grid — right two columns */}
        {rest.map((article) => (
          <ArticleCard
            key={article.title}
            title={article.title}
            excerpt={article.excerpt}
            popoverContent={article.popoverContent}
          />
        ))}
      </div>
    </section>
  );
}
