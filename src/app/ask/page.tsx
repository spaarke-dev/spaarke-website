import type { Metadata } from "next";
import { Button, PageHeader, Shell, Slab } from "@/components/primitives";
import { AskAiCard } from "@/components/AskAiCard";

const TITLE = "Learn more about Spaarke";
const DESCRIPTION =
  "One click briefs Claude, ChatGPT or Gemini on Spaarke from our own material. Learn how Spaarke is transforming the legal AI market.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ask" },
  openGraph: { title: `${TITLE} | Spaarke`, description: DESCRIPTION, url: "/ask" },
};

export default function AskPage() {
  return (
    <Slab tone="light" className="flex-1">
      <Shell>
        <PageHeader
          eyebrow="Explore Spaarke"
          title={"Learn how Spaarke is transforming the legal AI market."}
          lede="One click briefs Claude, ChatGPT or Gemini on Spaarke from our own material. Ask how it works, who it is for, and what sets it apart."
        />
        <div className="border-line bg-surface mt-12 max-w-2xl rounded-lg border p-6 shadow-sm md:p-8">
          <AskAiCard src="ask-page" variant="page" />
        </div>
        <p className="text-fg-mid mt-8 max-w-2xl text-sm leading-relaxed">
          The material itself is at{" "}
          <a className="text-spaarke-blue hover:text-cta-blue underline" href="/llms-full.txt">
            spaarke.com/llms-full.txt
          </a>
          . You can also paste that link into any assistant that reads web pages.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button variant="primary" href="/meet">
            Book a meeting
          </Button>
          <Button variant="text" href="/why-spaarke" arrow>
            Read the articles
          </Button>
        </div>
      </Shell>
    </Slab>
  );
}
