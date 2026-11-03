import Link from "next/link";
import {
  Button,
  Eyebrow,
  Heading,
  Lede,
  Shell,
  Slab,
} from "@/components/primitives";
import {
  ARTICLE_URL,
  CONTACT_EMAIL,
  EXHIBIT_1,
  EXHIBIT_2,
  type AcceleratorDocument,
  type Block,
} from "./documents";

// Renders an accelerator document (the brief or the readiness checklist) as a
// web page. The PDF of the same document is rendered from the same copy by
// scripts/render-accelerator-pdfs.mts, so edit the copy in documents.ts.

const EXHIBITS = { 1: EXHIBIT_1, 2: EXHIBIT_2 } as const;

function BlockView({ block, pageIds }: { block: Block; pageIds: string[] }) {
  switch (block.kind) {
    case "text":
      return (
        <div className="max-w-3xl space-y-5">
          {block.paragraphs.map((p) => (
            <p key={p} className="text-fg-mid text-base leading-relaxed md:text-[17px]">
              {p}
            </p>
          ))}
        </div>
      );
    case "items":
      return (
        <dl
          className={
            block.columns === 1
              ? "grid max-w-4xl gap-8"
              : "grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {block.items.map((item) => (
            <div key={item.name} className="border-line-strong border-t pt-5">
              <dt className="text-fg font-medium">{item.name}</dt>
              <dd className="text-fg-mid mt-2 text-[15px] leading-relaxed md:text-base">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "steps":
      return (
        <ol className="grid max-w-4xl gap-6">
          {block.items.map((item, i) => (
            <li key={item.name} className="flex gap-5">
              <span className="font-mono-display text-fg-low w-8 shrink-0 pt-0.5 text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-fg font-medium">{item.name}</p>
                <p className="text-fg-mid mt-1 text-[15px] leading-relaxed md:text-base">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "list":
      return (
        <div className="max-w-3xl">
          <p className="text-fg-mid text-base leading-relaxed md:text-[17px]">{block.lead}</p>
          <ul className="text-fg-mid mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case "checks":
      return (
        <ul className="grid max-w-4xl gap-6">
          {block.items.map((check) => (
            <li key={check.name} className="flex gap-4">
              <span
                aria-hidden
                className="border-line-strong mt-1 h-4 w-4 shrink-0 rounded-[3px] border-2"
              />
              <div>
                <p className="text-fg flex flex-wrap items-center gap-x-3 gap-y-1 font-medium">
                  {check.name}
                  {check.owner && (
                    <span className="font-mono-display text-fg-low border-line-strong rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
                      {check.owner}
                    </span>
                  )}
                </p>
                <p className="text-fg-mid mt-1 text-[15px] leading-relaxed md:text-base">
                  {check.question}
                </p>
                {check.why && (
                  <p className="text-fg-low mt-1 text-sm leading-relaxed">{check.why}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      );
    case "exhibit": {
      const exhibit = EXHIBITS[block.exhibit];
      return (
        <figure className="max-w-5xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={exhibit.svg} alt={exhibit.alt} className="w-full rounded-xl" />
          <figcaption className="text-fg-low mt-3 text-sm">
            Exhibit {block.exhibit}. {exhibit.title}
          </figcaption>
        </figure>
      );
    }
    case "contents":
      return (
        <ol className="grid max-w-3xl gap-2 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <li key={item}>
              <a
                href={`#${pageIds[i + 1]}`}
                className="text-fg-mid hover:text-fg flex gap-4 text-[15px] underline-offset-4 transition-colors hover:underline"
              >
                <span className="font-mono-display text-fg-low w-6 shrink-0 text-sm">
                  {String(i + 2).padStart(2, "0")}
                </span>
                {item}
              </a>
            </li>
          ))}
        </ol>
      );
    case "book":
      return (
        <div className="border-line-strong max-w-3xl rounded-xl border p-6 md:p-8">
          <Heading level={3}>{block.title}</Heading>
          <p className="text-fg-mid mt-3 text-base leading-relaxed">{block.body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button variant="primary" href="/accelerator#book" arrow>
              Book a scoping session
            </Button>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-fg-mid hover:text-fg text-sm underline underline-offset-4 transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      );
  }
}

export default function DocumentPage({
  doc,
  other,
}: {
  doc: AcceleratorDocument;
  other: AcceleratorDocument;
}) {
  const [first, ...rest] = doc.pages;
  const pageIds = doc.pages.map((p) => p.id);
  const [lede, ...firstBlocks] = first.blocks;

  return (
    <>
      <Slab tone="dark">
        <Shell>
          <div className="max-w-3xl">
            <div className="mb-5">
              <Eyebrow>{first.eyebrow}</Eyebrow>
            </div>
            <Heading level={1}>{first.title}</Heading>
            {lede?.kind === "text" && (
              <div className="mt-6 max-w-2xl">
                <Lede>{lede.paragraphs[0]}</Lede>
              </div>
            )}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button variant="primary" href={doc.pdf} arrow>
              Download the PDF ({doc.pages.length} pages)
            </Button>
            <Link
              href="/accelerator#book"
              className="text-fg-mid hover:text-fg text-sm underline underline-offset-4 transition-colors"
            >
              Book a scoping session
            </Link>
          </div>
          <div className="mt-14 space-y-10">
            {firstBlocks.map((block, i) => (
              <BlockView key={i} block={block} pageIds={pageIds} />
            ))}
          </div>
        </Shell>
      </Slab>

      {rest.map((page, i) => (
        <Slab key={page.id} tone={i % 2 === 0 ? "light" : "dark"}>
          <Shell>
            <div id={page.id} className="max-w-4xl scroll-mt-24">
              <Eyebrow>{page.eyebrow}</Eyebrow>
              <Heading level={2} className="mt-5">
                {page.title}
              </Heading>
            </div>
            <div className="mt-12 space-y-10">
              {page.blocks.map((block, j) => (
                <BlockView key={j} block={block} pageIds={pageIds} />
              ))}
            </div>
          </Shell>
        </Slab>
      ))}

      <Slab tone={rest.length % 2 === 0 ? "light" : "dark"}>
        <Shell>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button variant="outline" href={doc.pdf}>
              Download the PDF
            </Button>
            <Link
              href={other.webUrl}
              className="text-fg-mid hover:text-fg text-sm underline underline-offset-4 transition-colors"
            >
              Read the {other.shortTitle.toLowerCase()}
            </Link>
            <Link
              href={ARTICLE_URL}
              className="text-fg-mid hover:text-fg text-sm underline underline-offset-4 transition-colors"
            >
              Read why Microsoft is now the platform for legal AI
            </Link>
          </div>
        </Shell>
      </Slab>
    </>
  );
}
